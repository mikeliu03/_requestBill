define(['vue', 'utils'], function(Vue, utils){
	//历史记录弹出层
	Vue.component('modal-history', {
		props: {
			
		},
		template: '#modal-history-template',
		data: function(){
			return {
				history: [
				
				],
				option: {
					//hide: function(){}
				}
			}
		},
		mounted: function(){
			var self = this;
			$(this.$el).on("hide.bs.modal", function(){
				self.option.hide && self.option.hide();
			});
		},
		methods: {
			showModal: function(opt){
				var self = this;
				this.option.hide = opt && opt.hide;
				$.when(this._initList()).done(function(data){					
					$(".cem-history", self.$el).html(data);
					$(self.$el).modal('show');
				});	
			},
			_initList: function(){
				var self = this;
				var deferred = $.Deferred();
				utils.get("viewAllProcessNodeAssignee.ajax?businessKey=" + this.$store.state.billNo, {}, function(data){
					// 数据合并
					var task_id_arr = [];
					for(var i=0; i<data.length; i++){
						task_id_arr.push(data[i].taskid);
					}
					$.unique(task_id_arr);
					var new_obj = [];
					for(var i=0; i<task_id_arr.length; i++){
						var cur_task_id = task_id_arr[i];

						var cur_obj = {
							assignee: [],
							completetime: [],
							createtime: [],
							name: [],
							taskid: cur_task_id,
							showType: [],
							status: [],
							pass:[],
							commenta:[]
						};
						for(var j=0; j<data.length; j++){
							var per = data[j];
							if(per.taskid === cur_obj.taskid){
								cur_obj.assignee.push(per.assignee);
								cur_obj.completetime.push(per.completetime);
								cur_obj.createtime.push(per.createtime);
								cur_obj.name.push(per.name);
								cur_obj.showType.push(per.showType);
								cur_obj.status.push(per.status);
								cur_obj.pass.push(per.pass);
								cur_obj.commenta.push(per.commenta);
							}
						}
						new_obj.push(cur_obj);
					}

					// 展示数据
					var str = '';
					var name_str = '';
					// 退回，加签，被收回，终止，重启，审批通过，处理中，未处理
					var status_obj = {
						backzs: {icon: "glyphicon glyphicon-fast-backward", content: "退回【直送至我】"},
						backzj: {icon: "glyphicon glyphicon-fast-backward", content: "退回【逐级审批】"},
						turnDown: {icon: "glyphicon glyphicon-fast-backward", content: "驳回"},
						endorse: {icon: "glyphicon glyphicon-pencil", content: "加签"},
						cancel: {icon: "glyphicon glyphicon-remove-sign", content: "收回"},
						bycancel: {icon: "glyphicon glyphicon-remove-sign", content: "被收回"},
						stop: {icon: "glyphicon glyphicon-stop", content: "终止"},
						restart: {icon: "glyphicon glyphicon-off", content: "重启"},
						complete: {icon: "glyphicon glyphicon-ok-sign", content: "审批通过"},
						active: {icon: "glyphicon glyphicon-exclamation-sign", content: "处理中"},
						nothandle: {icon: "glyphicon glyphicon-list-alt", content: "未处理"}
					};						
						
					for(var i=0; i<new_obj.length; i++){
						var cur_status_obj = status_obj[new_obj[i].status[0]];
						if(!cur_status_obj) continue;
						
						//0:不同意，1表示同意  2:提交审批  3:退回  4：加签  5：收回  6：唤醒
						var passName = "";
						if(!isNaN(new_obj[i].pass[0])){
							switch(parseInt(new_obj[i].pass[0]))
							{
								case 0 :
									passName = '不同意';
								break;
								case 1 :
									passName = '同意';
								break;
								case 2 :
									passName = '提交审批';
								break;
								case 3 :
									passName = '退回';
								break;
								case 4 :
									passName = '加签';
								break;
								case 5 :
									passName = '收回';
								break;
								case 6 :
									passName = '唤醒';
								break;
								default:
									passName = '';
								break;
							}
						}
						
						
						str += '<div class="row"><div class="cem-history-number clearflex"><span>'+(i+1)+'</span></div>'+
	                            '<div><p>'+new_obj[i].showType[0]+'</p><small>'+self._createSmallList(new_obj[i].name)+'</small></div>'+
	                            '<div><p><span class="'+cur_status_obj.icon+'"></span>'+cur_status_obj.content+'</p><small>'+self._createSmallList(new_obj[i].commenta)+'</small></div>'+
	                            '<div><p>&nbsp;</p><small>'+self._createSmallList(new_obj[i].completetime)+'</small></div></div>';
					}
					deferred.resolve(str);
				});
				return deferred.promise();
			},
			_createSmallList: function(arr){
				var str = '';
				for(var i=0; i<arr.length; i++){
					if(arr[i]){
						str += '<small>'+arr[i]+'</small><br />';
					}else{
						str += '<small></small><br />';
					}
				}
				return str;
			}
		}
	});
});