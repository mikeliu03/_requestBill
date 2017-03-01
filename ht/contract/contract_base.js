define(['vue', 'vue_datepicker','utils'], function(Vue, vue_datepicker, utils){
	//Vue.component('');
	/*var vmBase = new Vue({
		el: "#base_info",*/
	var vmBase = Vue.component('contract-base', {
		template: '#contractBase-template',
		props: ['baseInfo'],
		data: function(){
			return{
				isRead: true,
				basedata: {},
				cttTypes: []
			}			
		},
		computed: {
			isShowField: function(){
				return this.baseInfo.pageType !== 'C';
			}
		},
		watch: {
			'baseInfo.cttTypes': function(){
				console.log(this.basedata.type);
			}
		},
		mounted: function(){
			var _self = this;
			var dtdType = this.getCttTypes();
			if(this.baseInfo.pageType == 'C'){
				this.isRead = false;
			}else{
				$.when(dtdType, this.getBaseData()).done(function(data1, data2){
					_self.basedata = data2[0].rspData;
				});
			}			
			
		},		
		methods: {
			getBaseData: function(){
				var _self = this;
				return $.ajax({
					url: "getContract.ajax",
					type: "post",
					dataType: "json",
					data: {
                        "contractId": _self.baseInfo.contractId
                    }
				});
			},
			saveBaseInfo: function(){
				var _self = this;
				if(this.isRead){
					this.isRead = !this.isRead;
				}else{
					if(this._validateInfo()){
						var url = "addContract.ajax";
						if(_self.baseInfo.contractId != null){
							url = "updateContract.ajax";
						}
						utils.post(url, _self.basedata, function(data){
							utils.cem_message('保存成功');
							if(data.contractId){
								location.search = "pagetype=U&contractId=" + data.contractId;
								//_self.$parent.$emit('setContractidFire', {contractId: data.contractId});
							}else{
								_self.isRead = !_self.isRead;
								_self.$parent.$emit('showDetailFire', {show: true});
							}					
						});	
					}									
				}
			},
			submitBaseInfo: function(){
				var _self = this;
				$.ajax({
					url: "updateContract.ajax",
					type: "post",
					dataType: "json",
					data: this.basedata
				}).success(function(data){
					utils.cem_message('submit');
				});
			},
			getCttTypes: function(){
			  var _self = this;
			  var dtd = $.Deferred();
			  $.ajax({
				  url: 'getContractTypes.ajax',
				  type: 'post',
				  dataType: 'json'
			  }).success(function(data){
				  _self.cttTypes = data.rspData;
				  dtd.resolve(data.rspData);
			  });
			  return dtd.promise();
			},
			_validateInfo: function(){
				var _code = this.basedata.code;
				if(!_code || !_code.trim()){
					utils.cem_message('合同编号不能为空');
					return false;
				}
				if(_code.length > 100){
					utils.cem_message('合同编号不能超过100位字符');
					return false;
				}
				
				var _name = this.basedata.name;
				if(!_name || !_name.trim()){
					utils.cem_message('合同名称不能为空');
					return false;
				}
				if(_name.length > 100){
					utils.cem_message('合同名称不能超过100位字符');
					return false;
				}
				
				var _type = this.basedata.type;
				if(!_type || !_type.trim()){
					utils.cem_message('请选择合同类型');
					return false;
				}
				
				var _captain = this.basedata.captain;
				if(!_captain || !_captain.trim()){
					utils.cem_message('请选择责任人');
					return false;
				}
				/*var _amount = this.basedata.amount;
				if(_amount == null){
					utils.cem_message('合同金额不能为空');
					return false;
				}
				
				if(_amount < 0){
					utils.cem_message('合同金额必须大于0');
					return false;
				}*/
				
				var _startDate = this.basedata.startDate;
				if(!_startDate || !_startDate.trim()){
					utils.cem_message('开始日期不能为空');
					return false;
				}
				
				var _endDate = this.basedata.endDate;
				if(_endDate && _endDate < _startDate){
					utils.cem_message('开始日期不能晚于结束日期');
					return false;
				}
				return true;
			}
		},
		components: {
		  'vue_datepicker': vue_datepicker
		}
	});

	return vmBase;
});