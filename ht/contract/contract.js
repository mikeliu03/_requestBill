require.config({
	baseUrl: "resource/js/public",
	paths: {
		jquery: "jquery-2.1.4.min",
		bootstrap: "bootstrap.min",
		jq_validate: "jquery.validate.min",
		jq_validata_msg: "messages_zh",
		jq_ui: "jquery-ui.custom.min",
		jq_ztree: "jquery.ztree.all-3.5.min",
		jq_hc: "highcharts",
		jq_datepicker_zh_cn: "jquery.ui.datepicker-zh-CN",
		datatables: "jquery.dataTables.min",
		cem_upload: "cem-upload",
		viewer: "jquery.viewer",
		vue: "vue",
		vuex: "vuex",
		vueTable: "vue/vueTable",
		vue_config: "../private/ht/contract/vue_config",
		ctt_base: "../private/ht/contract/contract_base",
		ctt_detail: "../private/ht/contract/contract_detail",
		ctt_plan: "../private/ht/contract/detail/ctt_plan",
		ctt_plan_modal: "../private/ht/contract/detail/ctt_plan_modal",
		ctt_attach: "../private/ht/contract/detail/ctt_attach",
		ctt_entity: "../private/ht/contract/detail/ctt_entity",
		ctt_entity_modal: "../private/ht/contract/detail/ctt_entity_modal",
		ctt_benefit: "../private/ht/contract/detail/ctt_benefit",
		ctt_benefit_modal: "../private/ht/contract/detail/ctt_benefit_modal",
		ctt_auth: "../private/ht/contract/detail/ctt_auth",
		ctt_auth_modal: "../private/ht/contract/detail/ctt_auth_modal",
		ctt_bill: "../private/ht/contract/detail/ctt_bill",
		ctt_pay: "../private/ht/contract/detail/ctt_pay",
		ctt_history: "../private/ht/contract/detail/ctt_history",
		common_func: "../private/ht/contract/common_func",
		cem_autocomplete_input:"cem-autocomplete-input",
		vue_datepicker: "vue_datepicker",
		vue_autoinput: "../private/ht/contract/vue_autoinput"
	},
	shim: {
		bootstrap: ["jquery"],
		jq_validate: ["jquery"],
		jq_validata_msg: ["jquery", "jq_validate"],
		jq_ui: ["jquery"],
		jq_ztree: ["jquery"],
		jq_hc: ["jquery"],
		jq_datepicker_zh_cn: ["jquery","jq_ui"],
		datatables: ["jquery"],
		cem_upload: ["jquery"],
		viewer: ["jquery"],
		vuex: ["vue"],
		ctt_base: ["jquery", "vue", "vue_datepicker", "utils"],
		ctt_detail: ["jquery", "vue", "utils", "ctt_attach", "ctt_entity", "ctt_entity_modal", "ctt_plan", "ctt_plan_modal"],
		ctt_plan: ["jquery", "vue", "utils"],
		ctt_plan_modal: ["datatables", "jquery", "vue"],
		ctt_attach: ["datatables", "jquery", "vue", "utils", "viewer", "cem_upload"],
		ctt_entity: ["datatables", "jquery", "vue", "common_func"],
		ctt_entity_modal: ["datatables", "jquery", "vue", "common_func"],
		ctt_benefit: ["datatables", "jquery", "vue"],
		ctt_benefit_modal: ["datatables", "jquery", "vue"],
		ctt_auth: ["datatables", "jquery", "vue"],
		ctt_auth_modal: ["datatables", "jquery", "vue", "vue_autoinput"],
		ctt_bill: ["datatables", "jquery", "vue"],
		ctt_pay: ["datatables", "jquery", "vue"],
		ctt_history: ["datatables", "jquery", "vue"],
		common_func: ["jquery"],
		vue_config: ["common_func"],
		cem_autocomplete_input:["jquery"],
		vue_datepicker: ["vue", "jq_datepicker_zh_cn"],
		vue_autoinput: ["vue", "cem_autocomplete_input"]
	}, urlArgs: "v=de1dbef188"});

// 引入公共脚本：header和左侧menu
require(["common"]);
require(["common"]);
//require(["vue_config"]);

require(["utils", "vue", "vue_config", "ctt_base", "ctt_detail", "bootstrap", "jq_validata_msg", "jq_datepicker_zh_cn"], 
	function(utils, Vue, VueConfig, cttBase, cttDetail){
/*require(["utils", "vue", "ctt_base", "ctt_detail", "bootstrap", "jq_validata_msg", "jq_datepicker_zh_cn"], 
		function(utils, Vue, cttBase, cttDetail){*/
	var store = VueConfig.store;
	new Vue({
	  el: '#vueRoot',
	  store: store,
	  data: {
		  baseInfo: {
			  pageType: utils.GetQueryString("pagetype"),
			  isEditable: null,
			  contractId: utils.GetQueryString("contractId"),
			  isShowdetail: true,
			  state: "1",
			  auditState: "",
			  cttStatus: []
		  },
		  property: {},
		  other: {},
		  btnStatus: {"submit": false, "change": false, "confirm": false, "pending": false, "cancelpending": false, "terminate": false}
	  },
	  computed:{
			basetitle: function(){
				switch(this.baseInfo.pageType){
				case 'C': return '合同信息添加'; break;
				default: return '合同详情';
				}
			}
		},
	  created: function(){
		  var _self = this;
		  this.baseInfo.isShowdetail = (this.baseInfo.pageType !== 'C');		  
		  
		  this.$on('showDetailFire', function(){
			  _self.baseInfo.isShowdetail = true;
		  });
		  
		  this.$on('setContractidFire', function(data){
			  _self.baseInfo.contractId = data.contractId;
		  });
		  
		  utils.post("getContractOperationType.ajax", {contractId: this.baseInfo.contractId}, function(data){
			  _self.property = data || {state: "1", flag: true};
			  //_self.baseInfo.isEditable = (_self.baseInfo.pageType !== 'R' && _self.property.flag);
			  _self.$set(_self.baseInfo, "isEditable", (_self.baseInfo.pageType !== 'R' && _self.property.flag));
			  _self.baseInfo.state = _self.property.state;
			  _self.baseInfo.auditState = _self.property.auditState;
			  _self.getCttBtnState();
		  });
		  /*$.ajax({
			 url: "getContractOperationType.ajax",
			 dataType: "json",
			 type: "get",
			 data: {contractId: this.baseInfo.contractId}
		  }).success(function(data){
			  _self.property = data.rspData || {state: "1", flag: true};
			  _self.baseInfo.isEditable = (_self.baseInfo.pageType !== 'R' && _self.property.flag);
			  _self.getCttBtnState();
		  });*/
		  //this.getCttState();
	  },
	  mounted: function(){
		 /* $('input[data-fieldtype="date"]', this.$el).datepicker({
              changeMonth: true,
              changeYear: true
          });*/
		  
	  },
	  methods: {		  
		  submitContract: function(){
			//草稿状态 -->提交审核 --> 审核中,
			//变更中 -->提交审核-->变更中
			  var _self = this;
			  
			  if(this._submitValidate()){
				  this._submit('1', function(){
					  utils.cem_message('提交成功');
					  location.search = "?pagetype=R&contractId=" + _self.baseInfo.contractId;
					  /*if(_self.baseInfo.pageType == 'C'){
						  location.search = "?pagetype=R&contractId=" + _self.baseInfo.contractId;
					  }else{
						  _self._reloadPage();
					  }	*/			  
				  });
			  }		  
			  		
		  },
		  changeContract: function(){
			//确认状态 -->变更-->变更中,
			  $('#remark_dialog_form').modal({
	          		show: true,
	        		backdrop:'static'
	        	});
		  },
		  confirmContract: function(){
			  
		  },
		  pendingContract: function(){
			  //确认状态 -->暂挂-->暂挂
			  var _self = this;
			  this._submit('3', function(){
				  _self._reloadPage();
			  });
		  },
		  cancelpendingContract: function(){
			//暂挂状态-->取消暂挂-->确认
			  var _self = this;
			  this._submit('4', function(){
				  _self._reloadPage();
			  });
		  },
		  terminateContract: function(){
			  //确认状态 -->终止-->终止
			  var _self = this;
			  this._submit('5', function(){
				  _self._reloadPage();
			  });
		  },
		  submiChangeWithtRemark: function(){
			//确认状态 -->变更-->变更中,
			  var _self = this;
			  this._submit('2', function(){
				  _self._toChangePage();
			  }, this.other);
		  },
		  _submit: function(action, successCallback, other){
			  var _data = {
	                	contractId: this.baseInfo.contractId,
	                	currentState: this.baseInfo.state,
	                	action: action
	                 };
			  if(other){
				  _data = $.extend(true, _data, other);
			  }
			  utils.post(
	                "changeContractState.ajax",
	                _data,
	                function (data) {
	                	 successCallback();	                	 
	               }
	           );  
		  },
		  _reloadPage: function(){
			  location.reload();
		  },
		  _toChangePage: function(){
			  var href = location.href;
			  var reg = new RegExp("(pagetype=[^&]*)(&|$)");
			  href = href.replace(reg, "");
			  href += '&pagetype=U';
			  location.href = href;
		  },
		  submitAction: function(actionid){
			  var _self = this;
			  $.ajax({
				  url: "changeContractState.ajax",
				  dataType: "json",
				  data: { contractiId: this.baseInfo.contractId, action: actionid },
				  type: "get"
			  }).success(function(data){
				  console.log(data.rspData);
				  //_self.btnStatus = 
			  });
		  },
		  getCttBtnState: function(){
			  var isEditable = this.baseInfo.isEditable;
			  var pageType = this.baseInfo.pageType;
			  var status = this.property.state;
			  
			  if(pageType == 'C'){
				  this.btnStatus = {"submit": true, "change": false, "confirm": false, "pending": false, "cancelpending": false, "terminate": false};
			  }else if(this.property.flag){
				  //1.草稿, 2.审批中, 3.待处理, 4.确认, 5.变更中, 6.暂挂, 7.终止, 8.完成
				  switch(status){
				  	//草稿状态 -->提交审核 --> 审核中,
				  	case '1': this.btnStatus = {"submit": true, "change": false, "confirm": false, "pending": false, "cancelpending": false, "terminate": false}; break;
				  	//变更中 -->提交审核-->变更中
				  	case '5': 
				  		if(this.baseInfo.auditState == "2"){
				  			this.btnStatus = {"submit": false, "change": false, "confirm": false, "pending": false, "cancelpending": false, "terminate": false};
				  		}else{
				  			this.btnStatus = {"submit": true, "change": false, "confirm": false, "pending": false, "cancelpending": false, "terminate": false};
				  		}
				  		break;
				  	//确认状态 -->变更-->变更中, 确认状态 -->暂挂-->暂挂,  确认状态 -->终止-->终止
				  	case '4': this.btnStatus = {"submit": false, "change": true, "confirm": false, "pending": true, "cancelpending": false, "terminate": true}; break;
				  	//暂挂状态-->取消暂挂-->确认
				  	case '6': this.btnStatus = {"submit": false, "change": false, "confirm": false, "pending": false, "cancelpending": true, "terminate": false}; break;
				  	//猜的
				  	case '3': this.btnStatus = {"submit": true, "change": false, "confirm": false, "pending": false, "cancelpending": false, "terminate": false}; break;
				  	default: this.btnStatus = {"submit": false, "change": false, "confirm": false, "pending": false, "cancelpending": false, "terminate": false};
				  }
			  }
			  /*if(isEditable){
				  
				  
			  }else{				  
				  this.btnStatus = {"submit": false, "change": false, "confirm": false, "pending": false, "cancelpending": false, "terminate": false};
			  }*/
		  },
		  _submitValidate: function(){
			  var detailCttVue = this.$refs.contractDetail;
			  
			  var _entityCount = detailCttVue.$refs.entityContract.getRowCount();
			  var _planCount = detailCttVue.$refs.planContract.getRowCount();
			  if(_entityCount <= 0){
				  utils.cem_message("请添加合同对象");
				  return false;
			  }
			  if(_planCount <= 0){
				  utils.cem_message("请添加付款计划");
				  return false;
			  }
			  return true;
		  }
	  },
	  components: {
	  	'contract-base': cttBase,
	  	'contract-detail': cttDetail
	  }
	});
});