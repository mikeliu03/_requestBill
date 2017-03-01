define(['vue', 'utils', 'common_func'], function(Vue, utils, CommonFunc){
	var vmHistory = Vue.component('contract-history', {
		template: '#contractHistory-template',
		props: ['baseInfo'],
		data: function(){
			return {
				
			};
		},
		created: function(){
			
		},
		mounted: function(){
			//init table			
			this.initTable();
		},
		methods: {
			initTable: function(){
				var _self = this;
				var table = $(".table", this.$el);
				var jPluginTable = table.DataTable({
                	processing: true,		// 服务器端获取数据时，需添加
                	serverSide: true,		// 服务器端获取数据时，需添加
	                ajax: {
	                    url: "getContractAuditHistoryList.ajax",
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
	                        data: "auditTime"
	                    },
	                    {
	                       data: "auditorName"
	                    },
	                    {
	                       data: "actionName"
	                    },
	                    {
	                       data: "remark"
	                    }
                	]
            	});
			}
		}
	});

	return vmHistory;
});