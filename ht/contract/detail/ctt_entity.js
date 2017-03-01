define(['vue', 'utils', 'common_func'], function(Vue, utils, CommonFunc){
	//var vmEntity = new Vue({

	var vmEntity = Vue.component('contract-entity', {
		//el: "#contractEntity",
		template: '#contractEntity-template',
		props: ['baseInfo'],
		data: function(){
			return {
				jTable: null,
				jPluginTable: null
			};
		},
		created: function(){
			var _self = this;
			this.$on('reloadData', function(){
				_self._reloadData();
			});
		},
		mounted: function(){
			//init table			
			this.initTable();
		},
		methods: {
			add_entity: function(){
				this.$emit('operationFire', {type: 'A', ref: 'entityModal'});
			},
			update_entity: function(){
				var checked_elem = $("tbody :checkbox:checked", this.jTable);
		        if (checked_elem.length <= 0) {
		            utils.cem_message("请选择一条记录。");
		            return false;
		        } else if (checked_elem.length > 1) {
		            utils.cem_message("一次只能修改一条记录。");
		            return false;
		        }
		        var selected_data = this.jPluginTable.row(checked_elem.closest("tr")[0]).data();
				this.$emit('operationFire', {type: 'U', ref: 'entityModal', content: selected_data});
			},
			delete_entity: function(){
				var _self = this;
				var checked_elem = $("tbody :checkbox:checked", this.jTable);
		        if (checked_elem.length > 0) {
		            utils.cem_alert("确定要执行删除操作吗？", function () {
		                var ids = [];
		                checked_elem.each(function () {
		                    ids.push(this.value);
		                });
		                utils.post("deleteContractTarget.ajax",{ids: ids + ""},function(data){
		                	utils.cem_message('删除成功');
		                	_self._reloadData();
		               });
		            });
		        }
			},
			_reloadData: function(){
				this.$store.commit('setEntityFlag', true);
				this.jPluginTable.ajax.reload();				
			},
			initTable: function(){				
				var _self = this;
				this.jTable = $(".table", this.$el);				
				this.jPluginTable = this.jTable.DataTable({
                	processing: true,		// 服务器端获取数据时，需添加
                	serverSide: true,		// 服务器端获取数据时，需添加
	                ajax: {
	                    url: "getContractTargetList.ajax",
	                    type: "post",
	                    data: function(param){
	                        return $.extend(true, {"contractId": _self.baseInfo.contractId}, param);
	                    }
	                },
	                info: false,
	                lengthChange: false,
	                ordering: false,
	                paging: true,
	                searching: false,
                	columns: [
                		{
                			data: "id",
				            render: function (data) {
				                return "<input type='checkbox' value='" + data + "' />";
				            },
				            width: "30px",
				            //visible: _self.baseInfo.isEditable
				        },
	                    {
	                        data: "targetCode"
	                    },
	                    {
	                       data: "targetName"
	                    },
	                    {
	                    	data: "targetAccount",	                        
	                        render: function (_data, type, row) {
	                        	return CommonFunc.handlerAccountFormat(_data);	                    
	                        }
	                    }
                	]
            	});				
			},
			getRowCount: function(){
				var _len = this.jPluginTable.column( 0 ).data().length;
				return _len;
				//this.$store.commit('setcount', {name: "entity", count: _len});
			}
		}
	});

	return vmEntity;
});