define(['vue', 'utils'], function(Vue, utils){
	var vmPlan = Vue.component('modal-plan', {
		//el: "#contractEntity",
		template: '#planModal-template',
		props: ['baseInfo'],
		data: function(){
			return {
				type: null,
				targetidOpts: [],
				paywayOpts: [],
				content: {
					
				}
			};
		},
		created: function(){
			var _self = this;
			this.$on('showModal', function(data){
				_self.type = data.type;
				_self._showModal(data);
			});
		},
		mounted: function(){
			this._initSelectOpts();
		},
		methods: {
			saveEntityInfo: function(){
				var _self = this;
				var url = "";
				if(_self.type == 'A'){
					url = "addContractPaymentPlan.ajax";
				}else if(_self.type == 'U'){
					url = "updateContractPaymentPlan.ajax";
				}
				
				if(this._validateInfo()){
					utils.post(url, $.extend(true, {"contractId": this.baseInfo.contractId}, this.content), function(data){
						utils.cem_message('保存成功');
						_self._reloadDataTrigger();
						$(_self.$el).modal('hide');
					});
				}				
			},
			_showModal: function(data){
				if(this.$store.state.entityChangeFlag){
					this._initSupplierList();
					this.$store.commit('setEntityFlag', false);
				}				
				
				if(data.type == 'A'){
					this.content = {};
				}else if(data.type == 'U'){
					this.content = data.content;
				}				
				$(this.$el).modal('show');
			},
			_reloadDataTrigger: function(){
				this.$emit('reloadDataFire', { ref: 'planContract'});
			},
			_initSelectOpts: function(){
				var _self = this;
				$.ajax({
					url: 'getPayWays.ajax',
					type: 'post',
					dataType: 'json'
				}).success(function(data){
					_self.paywayOpts = data.rspData;
				});	
				
				this._initSupplierList();
			},
			
			_initSupplierList: function(){
				var _self = this;
				$.ajax({
					url: 'getSupplierList.ajax?' + Math.random(),
					type: 'post',
					dataType: 'json',
					data: {"contractId": this.baseInfo.contractId, "limited": "X"}
				}).success(function(data){
					_self.targetidOpts = data.rspData;
				});
			},
			_validateInfo: function(){				
				var _target = this.content.target;
				if(!_target || !_target.trim()){
					utils.cem_message('请选择收款对象');
					return false;
				}
				
				var _totalAmount = this.content.totalAmount;
				if(_totalAmount == null){
					utils.cem_message('金额不能为空');
					return false;
				}
				
				if(_totalAmount < 0){
					utils.cem_message('金额必须大于0');
					return false;
				}
				
				var _payWay = this.content.payWay;
				if(!_payWay || !_payWay.trim()){
					utils.cem_message('请选择付款方式');
					return false;
				}
				
				return true;
			}
		}
	});
	return vmPlan;
});