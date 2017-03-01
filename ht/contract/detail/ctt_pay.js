define(['vue', 'utils', 'common_func'], function(Vue, utils, CommonFunc){

	var vmPay = Vue.component('contract-pay', {
		//el: "#contractEntity",
		template: '#contractPay-template',
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
	                    url: "getContractPayDetailList.ajax",
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
	                        data: "billNo"
	                    },
	                    {
	                       data: "billName"
	                    },
	                    {
	                       data: "applicant"
	                    },
	                    {
	                       data: "amount"
	                    },
	                    {
	                       data: "receiver"
	                    },
	                    {
	                       data: "account"
	                    },
	                    {
	                       data: "payTime"
	                    }
                	]
            	});
			}
		}
	});

	return vmPay;
});