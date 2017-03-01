define(['vue', 'utils', 'datatables'], function(Vue, utils){
	//会签弹出层
	Vue.component('modal-endorsement', {
		props: {
			
		},
		template: '#modal-endorsement-template',
		data: function(){
			return {
				jTable: null,
				jPluginTable: null
			}
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
			endorsementSaveHandler: function(){
				var self = this;
				
				var assignees = [];
				var assignee = null;
				$("tbody :checkbox:checked", this.jTable).each(function(){
					var selected_data = table_table_example_add.row($(this).closest("tr")).data();
					assignees.push({
						id: selected_data.employeeId,
						name: selected_data.name
					});
					assignee = JSON.stringify(assignees);
				});
		       
			    this.$parent.$emit("billEndorsementEvt", assignee);			    
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
	                    url: "selectEmprefDeptToOtherModules.ajax",
	                    type: "POST",
	                    data: {
							columnsLength: $("thead th", table_example_add).length,
			                idNotEqual: "idNotEqual"
						}
	                },
	                info: false,
	                lengthChange: false,	      
	                paging: true,
	                searching: true,
                	columns: [
						{
							searchable: false,
							data: "id",
							render: function(data){
								return "<input type='checkbox' data-id='id' value='"+data+"' />";
							},
							orderable:false,
							width:"3%",
						},
						{data: "no"},
						{data: "employeeName"},
						{data: "deptName"},
						{
							searchable: false,
							data: "employeeId",
							render: function(data){
								return "<input type='hidden' data-id='id' value='"+data+"' />";
							},
							orderable:false
						}
					],
					order:[[2,'asc']]
            	});
			},
			_getSearchParam: function(){
				
			}
		}
	});
});