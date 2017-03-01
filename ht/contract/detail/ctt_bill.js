define(['vue', 'utils', 'common_func'], function(Vue, utils, CommonFunc){
	//var vmEntity = new Vue({

	var vmBill = Vue.component('contract-bill', {
		//el: "#contractEntity",
		template: '#contractBill-template',
		props: ['baseInfo'],
		data: function(){
			return {
				
			};
		},
		created: function(){
			
		},
		mounted: function(){
			//init table			
			this.initApplyTable();
			this.initDebtTable();
			this.initReimburseTable();
		},
		methods: {
			initApplyTable: function(){
				var _self = this;
				var table = $("#billApply_table", this.$el);
				var jPluginTable = table.DataTable({
                	processing: true,		// 服务器端获取数据时，需添加
                	serverSide: true,		// 服务器端获取数据时，需添加
	                ajax: {
	                    url: "getContractApplyBillList.ajax",
	                    type: "post",
	                    data: {
	                        "contractId": _self.baseInfo.contractId
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
	                       data: "applicantName"
	                    },
	                    {
	                       data: "remark"
	                    },
	                    {
	                       data: "billAmount"
	                    }
                	]
            	});
			},
			initDebtTable: function(){
				var _self = this;
				var table = $("#billDebt_table", this.$el);
				var jPluginTable = table.DataTable({
                	processing: true,		// 服务器端获取数据时，需添加
	                serverSide: true,		// 服务器端获取数据时，需添加
	                ajax: {
	                    url: "getContractDebtBillList.ajax",
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
	                       data: "applicantName"
	                    },
	                    {
	                       data: "remark"
	                    },
	                    {
	                       data: "billAmount"
	                    },
	                    {
	                       data: "payAmount"
	                    }
                	]
            	});
			},
			initReimburseTable: function(){
				var _self = this;
				var table = $("#billReimburse_table", this.$el);
				var jPluginTable = table.DataTable({
                	processing: true,		// 服务器端获取数据时，需添加
	                serverSide: true,		// 服务器端获取数据时，需添加
	                ajax: {
	                    url: "getContractReimburseBillList.ajax",
	                    type: "post",
	                    data: {
	                        "contractId": _self.baseInfo.contractId
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
	                       data: "applicantName"
	                    },
	                    {
	                       data: "remark"
	                    },
	                    {
	                       data: "billAmount"
	                    },
	                    {
	                       data: "payAmount"
	                    },
	                    {
	                       data: "reimburseAmount"
	                    }
                	]
            	});
			}
		}
	});

	return vmBill;
});