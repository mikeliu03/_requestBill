define(['vue', 'utils', 'common_func'], function(Vue, utils, CommonFunc){
	//var vmEntity = new Vue({

	var vmAuth = Vue.component('contract-auth', {
		//el: "#contractEntity",
		template: '#contractAuth-template',
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
			add_auth: function(){
				this.$emit('operationFire', {type: 'A', ref: 'authModal'});
			},
			delete_auth: function(){
				var _self = this;
				var checked_elem = this._getSelectedElem();
				if (checked_elem.length > 0) {
		            utils.cem_alert("确定要执行删除操作吗？", function () {
		                var ids = [];
		                checked_elem.each(function () {
		                    ids.push(this.value);
		                });
		                utils.post("deleteContractPermission.ajax",{ids: ids + ""},function(data){
		                	if(data.msgType == "N"){
		                		utils.cem_message('删除成功');
	                        }else{
	                        	utils.cem_message(data.rspMsg);
	                        }
		                	_self._reloadData();
		               });
		            });
		        }
			},
			_reloadData: function(){
				this.jPluginTable.ajax.reload();
			},
			_getSelectedElem: function(){
				var checked_elem = $("tbody :checkbox:checked", this.jTable);
		        if (checked_elem.length <= 0) {
		            utils.cem_message("请选择一条记录。");
		            return false;
		        } else if (checked_elem.length > 1) {
		            utils.cem_message("一次只能修改一条记录。");
		            return false;
		        }
		        return checked_elem;
			},
			initTable: function(){
				var _self = this;
				this.jTable = $(".table", this.$el);
				this.jPluginTable = this.jTable.DataTable({
                	processing: true,		// 服务器端获取数据时，需添加
	                serverSide: true,		// 服务器端获取数据时，需添加
	                ajax: {
	                    url: "getContractPermissionList.ajax",
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
				            //visible: _self.isEditable
				        },
	                    {
	                        data: "type",
	                        render: function(data){
	                        	var _arr = JSON.parse(data);
	                        	var _str = "";
	                        	if(Object.prototype.toString.call(_arr) == "[object Array]"){
	                        		for(var i = 0; i < _arr.length; i++){
	                        			if(_arr[i] == 'R'){
	                        				_arr[i] = '使用';
	                        			}else if(_arr[i] == 'U'){
	                        				_arr[i] = '编辑';
	                        			}
	                        		}
	                        		_str = _arr.join(",");
	                        	}
	                        	return "<span>" + _str + "</span>";
	                        }
	                    },
	                    {
	                       data: "expressionShow"
	                    }
                	]
            	});
			}
		}
	});

	return vmAuth;
});