define(['vue', 'utils', 'datatables'], function(Vue, utils){
	//抄送弹出层
	Vue.component('modal-sendinfo', {
		props: {
			
		},
		template: '#modal-sendinfo-template',
		data: function(){
			return {
				param: {
					"empNo": "",
					"deptName": "",
					"empName": "",
					"empMobileNo": ""
				},
				jTable: null,
				jPluginTable: null
			};
		},
		mounted: function(){
			this.initTable();
		},
		methods: {
			showModal: function(opt){
				$(this.$el).modal('show');
			},
			hideModal: function(){
				$(this.$el).modal('hide');
			},
			sendInfoSaveHandler: function(){
				var self = this;
				var checked_elem = $("tbody :checkbox:checked", this.jTable);
		        if (checked_elem.length <= 0) {
		        	utils.cem_message("请选择被抄送人");
           			return false;
		        }
		        var ids = [];
			    checked_elem.each(function () {
			        ids.push(this.value);
			    });
			    this.$parent.$emit("billSendEvt", ids.join(","));			    
			},
			sendToSearch: function(){
				this.reloadData();
			},	
			reloadData: function(){
				this.jPluginTable.ajax.reload();
			},
			initTable: function(){
				var self = this;
				this.jTable = $(".table", this.$el);
				this.jPluginTable = this.jTable.DataTable({
                	processing: true,		// 服务器端获取数据时，需添加
	                serverSide: true,			// 服务器端获取数据时，需添加
	                ajax: {
	                    url: "queryEmployeesByCorp.ajax",
	                    type: "POST",
	                    data: function(d){
							var searchJson = self._getSearchParam();
							var param = jQuery.extend(true, d, searchJson);
							return param;
						}
	                },
	                lengthChange: false,
	        		info:false,
	        		searching: true,
                	columns: [
						{
							searchable: false,
							data: "id",
							render: function(data){
								return "<input type='checkbox' data-id='id' value='"+data+"' />";
							},
							orderable:false
						},
						{data: "no"},
						{data: "name"},
						{data: "deptName"},
						{data: "empMobileNo"},
					],
					order: [[1, 'asc']]
            	});
			},
			_getSearchParam: function(){
				var obj = this.param;
				var result = {};
				for(var e in obj){
					if(e && obj[e] && obj[e].trim()!== ","){
						result[e] = obj[e];
					}
				}
				return result;
			}
		}
	});
});