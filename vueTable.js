define(['vue', 'datatables'], function(Vue){
	var vmTable = Vue.component('vueTable', {
		template: '<table width="100%" class="display"></table>',
		props: {
			opt: {
				type: Object
			}
		},
		data: function(){
			return {
				jPluginTable: null
			};
		},
		mounted: function(){
			this.$nextTick(function(){
				this._initTable();
			});
			
		},
		methods: {
			getSelectedRow: function(){
				var jContractTable = $(this.$el)
				var _selectRow = $('tr.selected', jContractTable);
				var selected_data = this.jPluginTable.row(_selectRow).data();
				return selected_data;
			},
			reloadData: function(){
				this.jPluginTable.ajax.reload();
			},
			_initTable: function(){
				var jContractTable = $(this.$el);
				this.jPluginTable = jContractTable.DataTable({
			        processing: true,		// 服务器端获取数据时，需添加
                	serverSide: true,		// 服务器端获取数据时，需添加
                	select: 'single',
                	ajax: this.opt.ajax,
	                info: false,
	                lengthChange: false,
	                ordering: false,
	                paging: true,
	                searching: false,
			        columns: this.opt.columns
			    });
				
				// 行点击事件
				jContractTable.on("click", "tbody tr", function(){
					if ( !$(this).hasClass('selected') ) {
						$('tr.selected', jContractTable).removeClass('selected');
						$(this).addClass('selected');
					}			
				});
			}			
		}
	});
	return vmTable;
});