define(['vue', 'utils', 'vueTable'], function(Vue, utils, vueTable){
	var vmEntity = Vue.component('modal-entity', {
		//el: "#contractEntity",
		template: '#entityModal-template',
		props: ['baseInfo'],
		data: function(){
			return {
				type: null,
				targetOpts: [],
				content: {
					id: ""
				},
				tableOpt: {
					ajax: {
	                    url: "getSupplierTable.ajax",
	                    type: "post",
	                    data: {
	                    	"contractId": this.baseInfo.contractId
						}
	                },
	                columns: [
	                  		{
	                  			title: "对象代码",
	                  			data: "code"
	  				        },
	  	                    {
	  				        	title: "对象名称",
	                  			data: "name"
	  	                    },
	  	                    {
	  	                    	title: "账号",
	                  			data: "bankAccountNo"
	  	                    }
	                  	]
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
			//this._initSelectOpts();
		},
		watch: {
			'content.id': {
				handler: function(val){
					this.targetSelectChange(val);
				},
				deep: true
			}
		},
		methods: {
			targetSelectChange: function(_id){				
				var _obj = this.targetOpts.filter(function(a){
					return a.id == _id;
				})[0] || {};
				for(var e in _obj){
					if(e && e !== 'id'){
						this.content[e] = _obj[e];
					}
				}
			},
			saveEntityInfo: function(){				
				var _self = this;
				var entityTable = this.$refs.entityChooseTable;
				var rowData = entityTable.getSelectedRow();
				this.content = rowData;
				if(rowData){
					utils.post("addContractTarget.ajax", $.extend(true, {"contractId": this.baseInfo.contractId}, this.content), function(data){
						utils.cem_message('保存成功');
						_self._reloadDataTrigger();
						$(_self.$el).modal('hide');
					});
				}else{
					utils.cem_message('请选择合同对象');
				}
				/*if(this._validateInfo()){
					utils.post("addContractTarget.ajax", $.extend(true, {"contractId": this.baseInfo.contractId}, this.content), function(data){
						utils.cem_message('保存成功');
						_self._reloadDataTrigger();
						
					});
				}*/
			},
			_showModal: function(data){
				/*if(data.type == 'A'){
					//this.content.id = "";
					this.content = {id: ""};
				}else if(data.type == 'U'){
					this.content.id = data.content.targetId;
				}*/
				var entityTable = this.$refs.entityChooseTable;
				entityTable.reloadData();
				$(this.$el).modal('show');
			},
			_reloadDataTrigger: function(){
				this.$emit('reloadDataFire', { ref: 'entityContract'});
			},
			/*_initSelectOpts: function(){
				var _self = this;
				$.ajax({
					url: 'getSupplierList.ajax',
					type: 'post',
					dataType: 'json'
				}).success(function(data){
					_self.targetOpts = data.rspData;
				});
			},*/
			_validateInfo: function(){
				/*var _id = this.content.id;
				if(!_id || !_id.trim()){
					utils.cem_message('请选择合同对象');
					return false;
				}*/
				return true;
			}
		},
		components: {
		  	'vueTable': vueTable
		  }
	});
	return vmEntity;
});