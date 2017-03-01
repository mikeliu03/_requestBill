define(['vue', 'utils', 'datatables'], function(Vue, utils){
	//退回弹出层
	Vue.component('modal-flowback', {
		props: {
			
		},
		template: '#modal-flowback-template',
		data: function(){
			return {
				param: {					
					"processDefinitionId": null,
					"processName": null,
					"returnReason": null,
					"returnNode": null,
					"submitType": "",
					"returnMessage": null
				},
				opt: {
					"backReason": [],
					"returnNode": [],
					"executive": []
				},
				jExecTable: null,
				jExecPluginTable: null,
				Validator: null
			};
		},
		mounted: function(){
			this._initValidateForm();
		},
		methods: {
			showModal: function(opt){
				this.initData();
				$(this.$el).modal('show');
			},
			hideModal: function(){
				$(this.$el).modal('hide');
			},
			backSaveHandler: function(){
				var self = this;
				if(!this.Validator.form()){
		  			return false;
		  		}
				
				var data = $.extend(true, { "executive": this.opt.executive }, this.param);
				
				var params = {
					"execId": this.$store.state.flowInfo.execId,
					"processInstanceId": this.$store.state.flowInfo.processInst,
					"taskId": this.$store.state.flowInfo.taskId,
					"processDefinitionId": this.$store.state.flowInfo.processId,
					"billNo": this.$store.state.billNo,
					"billmainid": this.$store.state.billInfo.billMainId,
					
					"activityId": this.param.returnNode,
					"backType": this.param.submitType,
					"comment": this.param.returnMessage,
					"returnReason": this.param.returnReason
				};
				//流程退回
				utils.ajax({
					url: "backBillWorkFlowAction.ajax",
					type: "post",
					data: params,
					dataType: "json",
					success: function(data){						
						 utils.cem_message("单据退回成功!",function(){
		                	 window.location.href = "billIndex.do?";
		                 });						 
					}
				});		    
			},
			_initValidateForm: function(){
		  		this.Validator = $("form", this.$el).validate({
		  	        showErrors: function (map, list) {
	                    var focussed = document.activeElement;
	                    if (focussed && $(focussed).is("input, textarea")) {
	                        $(this.currentForm).tooltip("close", {
	                            currentTarget: focussed
	                        }, true)
	                    }
	                    this.currentElements.removeAttr("title").removeClass("ui-state-highlight");
	                    $.each(list, function (index, error) {
	                        $(error.element).attr("title", error.message).addClass("ui-state-highlight");
	                    });
	                    if (focussed && $(focussed).is("input, textarea")) {
	                        $(this.currentForm).tooltip("open", {
	                            target: focussed
	                        });
	                    }
	                },
	                rules: {
	        			processName: {
	        				required: true
	        			},
	        			returnReason: {
	        				required: true
	        			},
	        			returnMessage: {
	        				required: true
	        			},
	        			submitType: {
	        				required: true
	        			}
	        		},
	        		messages: {
	        			processName: {
	        				required: "请输入流程主题"
	        			},
	        			returnReason: {
	        				required: "请输入退回原因"
	        			},
	        			returnMessage: {
	        				required: "请输入退回说明"
	        			},
	        			submitType: {
	        				required: "请选择再提交类型"
	        			}
	        		}
		  		});
		  	},
			initData: function(){
				var self = this;
				var paramt = {
		  			"execId": self.$store.state.flowInfo.execId,
		  			"processId": self.$store.state.flowInfo.processId,
		  			"processName": self.$store.state.flowInfo.processName,
		  			"businessKey": self.$store.state.billNo,
		  			"processinstanceid": self.$store.state.flowInfo.processInst,
		  			"nodeId": self.$store.state.currentNode
		  		};			
		  		utils.get("queryReturnAbleAction.ajax", paramt, function(data){
		  			self.opt.backReason = data.backReason;
		  			self.opt.returnNode = data.returnNode;
		  			self.opt.executive = data.executive;
		  			
		  			self.param.processDefinitionId = data.processDefinitionId;
		  			self.param.processName = data.processName;
		  			
		  			self.param.returnReason = data.backReason[0] && data.backReason[0].id;
		  			self.param.returnNode = data.returnNode[0] && data.returnNode[0].nodeId;
		  			
		  			self.jExecTable = $(".table", self.$el);
		  			if(self.jExecPluginTable){
		  				self.jExecPluginTable.destroy(); 				
		  			}
		  			self.jExecPluginTable = self.jExecTable.DataTable({
						data: data.executive,
						processing: true,
						columns: [
						    {
								data: "id",
								render: function(data){
									return "<input type='checkbox' checked='checked' disabled='disabled'/>";
								}
							},
							{data: "departmentName"},
							{data: "postName"},
							{data: "personleName"}
						],
						info: false,
						searching: false,
						lengthChange: false,
						paging: false,
						ordering: false
		  			});
		  		});
			}
		}
	});
});