define(['vue', 'utils'], function(Vue, utils){
	var vmBenefit = Vue.component('modal-benefit', {
		//el: "#contractEntity",
		template: '#benefitModal-template',
		props: ['baseInfo'],
		data: function(){
			return {
				type: null,
				content: {
					startTime: "",
					endTime: "",
					amount: null
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
		},
		methods: {
			saveEntityInfo: function(){
				var _self = this;
				var url = "";
				if(_self.type == 'A'){
					url = "addContractBenefitPeriod.ajax";
				}else if(_self.type == 'U'){
					url = "updateContractBenefitPeriod.ajax";
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
				if(data.type == 'A'){
					for(var e in this.content){
						this.content[e] = null;
					}
				}else if(data.type == 'U'){
					this.content = data.content;
				}
				$(this.$el).modal('show');
			},
			_reloadDataTrigger: function(){
				this.$emit('reloadDataFire', { ref: 'benefitContract'});
			},
			_validateInfo: function(){
				var _startTime = this.content.startTime;
				if(!_startTime || !_startTime.trim()){
					utils.cem_message('开始日期不能为空');
					return false;
				}
				
				var _endTime = this.content.endTime;
				if(_endTime && _endTime < _startTime){
					utils.cem_message('开始日期不能晚于结束日期');
					return false;
				}
				
				var _amount = this.content.amount;
				if(_amount == null){
					utils.cem_message('金额不能为空');
					return false;
				}
				
				if(_amount < 0){
					utils.cem_message('金额必须大于0');
					return false;
				}				
				
				return true;
			}
		}
	});
	return vmBenefit;
});