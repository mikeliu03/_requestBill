define(['vue', 'utils', 'vue_autoinput'], function(Vue, utils, vue_autoinput){
	var vmAuth = Vue.component('modal-auth', {
		//el: "#contractEntity",
		template: '#authModal-template',
		props: ['baseInfo'],
		data: function(){
			return {
				type: null,
				content: {
					authArr: [],
					expreArr: [{type: "", value: {}}]
				},
				expretypeOpts: []
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
			addExpress: function(){
				this.content.expreArr.push({type: ""});
			},
			deleteExpress: function(index){
				this.content.expreArr.splice(index, 1);
			},
			saveEntityInfo: function(){
				var _self = this;
				
				var _express = this._expressCompose(this.content.expreArr);
				var _auth = JSON.stringify(this.content.authArr);
				
				if(this._validateInfo()){
					utils.post("addContractPermission.ajax", $.extend(true, {"contractId": _self.baseInfo.contractId, "authArr": _auth}, _express), function(data){
						if(data.rspMsg == null){
							utils.cem_message('保存成功');
							_self._reloadDataTrigger();
							$(_self.$el).modal('hide');
						}else{
							utils.cem_message(data.rspMsg);
						}
					});
				}
			},
			_showModal: function(data){
				if(data.type == 'A'){
					this.content.authArr = [];
					this.content.expreArr = [{type: "", value: {}}];
				}else if(data.type == 'U'){
					this.content = data.content;
				}
				$(this.$el).modal('show');
			},
			_reloadDataTrigger: function(){
				this.$emit('reloadDataFire', { ref: 'authContract'});
			},
			_initSelectOpts: function(){
				/*utils.post(".ajax", {}, function(data){
				});*/
				var _self = this;
				//_self.expretypeOpts = [{"key":"1", "value":"组织机构"},{"key":"2", "value":"岗位"},{"key":"3", "value":"指定人员"}];
				_self.expretypeOpts = [{"key":"1", "value":"组织机构"},{"key":"3", "value":"指定人员"}];
			},
			_expressCompose: function(expressArr){
				var showExpress = "";
				var executeExpress = "";
				var _self = this;
				expressArr.forEach(function(a){
					var _typeText = _self.__getTypeTextByKey(a.type);
					var _valueText = a.value.value;
					var _valueKey = a.value.key;
					showExpress += _typeText + '[' + _valueText + '];';
					executeExpress += _typeText + '[' + _valueKey + '];';
				});
				
				var saveExpress = JSON.stringify(expressArr);
				return {
					"expressionShow": showExpress,
					"expression": executeExpress
				};
			},
			__getTypeTextByKey: function(_type){
				var _obj = this.expretypeOpts.filter(function(a){
					return a.key == _type;
				})[0];
				return _obj && _obj.value;
			},
			_validateInfo: function(){
				var _authArr = this.content.authArr;
				if(_authArr.length == 0){
					utils.cem_message('请选择合同权限类型');
					return false;
				}
								
				var _expreArr = this.content.expreArr;
				for(var i = 0; i < _expreArr.length; i++){
					if(!_expreArr[i].type || !_expreArr[i].value.key){
						utils.cem_message('合同权限对象表达式字段不能为空');
						return false;
					}
				}			
				
				return true;
			}
		},
		components: {
		  'vue_autoinput': vue_autoinput
		}
	});
	return vmAuth;
});