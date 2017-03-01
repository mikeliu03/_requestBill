define(['vue', 'utils', 'barcode'], function(Vue, utils){
	var vmHeader = Vue.component('bill-header', {
		template: "#bill-header-template",
		props: {
			main: {
				type: Object,
				default: function(){
					return {
						"main_requserId": {               
			            },
			            "main_reqOrg": {			            	
			            },
			            "main_reqDept": {
			            },
			            "main_billNo": {
			            },
			            "main_originalCurrencySum": {
			            }
					}				
				}
			},
			access: {
				type: Object,
				default: function(){
					return {
						"isUserEdit": true
					}
				}
			},
			contents: {
				type: Object,
				default: function(){
					return {
						"main_requserId": {               
			            },
			            "main_reqOrg": {			            	
			            },
			            "main_reqDept": {
			            },
			            "main_billNo": {
			            },
			            "main_originalCurrencySum": {
			            }
					}				
				}
			}
		},
		mounted: function(){
			var billNo = this.$store.state.billNo;
			this.content.main_billNo = billNo;
			$(".fee-mob-tcode div", this.$el).barcode(billNo, "code128",{ barWidth: 1, barHeight: 30 });
			this.getDefaultReqUser();
		},
		data: function(){
			return {
				showQrcode: false,
				content: {
					"main_requserId": {},
		            "main_reqOrg": {},
		            "main_reqDept": {},
		            "main_billNo": null,
		            "main_originalCurrencySum": null
				}
			}
		},
		watch: {
			"contents": {
				deep: true,
				handler: function(data){
					this.content.main_requserId = {
						"key": data.main_requserId[0],
						"text": data.main_requserId[1]
					};
					this.content.main_reqOrg = {
						"key": data.main_reqOrg[0],
						"text": data.main_reqOrg[1]
					};
					this.content.main_reqDept = {
						"key": data.main_reqDept[0],
						"text": data.main_reqDept[1]
					};
				}
			}
		},
		methods: {
			getDefaultReqUser: function(){
				var url = "loadDefaultReqUser.ajax";
				var _self = this;
				utils.get(url, {}, function(data){
					if(_self.$store.getters.isCreatePage){
						_self.content.main_requserId = {
							"key": data.userId,
							"text": data.userName
						};
						_self.content.main_reqOrg = {
							"key": data.orgId,
							"text": data.orgName
						};
						_self.content.main_reqDept = {
							"key": data.deptId,
							"text": data.deptName
						};
					}					
					
					_self.$store.commit('setUserInfomation', data);
				});
			},
			userDelegateHandler: function(){
				if(this.access && !this.access.isUserEdit){
					return false;
				}
				var self = this;
				var opt = {
					url: "selectDeptPostEmpTree.ajax",
					param: {billId: this.$store.state.billId},
					extendDataLevel: 2,
					resolve: function(data){
						var requestDeptId = data.parents[1].id;
                        var requestDeptName = data.parents[1].name;
                        var requestPostId = data.parents[0].oId;
						var param = {};
                        param["deptId"] = requestDeptId;
                        utils.get("getDepartOrgAjax.ajax", param, function(data1){
                        	var requestOrgId = data1.deptId;
                          	var requestOrgName = data1.deptName;
                          	self._delegateSave({
                          		main_requserId: {
            						"key": data.id,
            						"text": data.key
            					},
                				main_reqOrg: {
            						"key": requestOrgId,
            						"text": requestOrgName
            					},
            					main_reqDept: {
            						"key": requestDeptId,
            						"text": requestDeptName
            					}
                          	});
                        });
					}
				}
				var modalTree = this.$root.$refs["modal_tree"];
				modalTree.showModal(opt);
			},
			_delegateSave: function(param){
				if(param.main_requserId.key !== this.content.main_requserId.key || param.main_reqDept.key !== this.content.main_reqDept.key){
					//置空单据信息
				}
				for(var e in param){
					this.content[e] = param[e];
				}				
			},
			setOriginalCurrSum: function(data){
				this.content.main_originalCurrencySum = data;
			},
			getAreaData: function(){
				var resultData = {};		
				for(var e in this.content){
					resultData[e] = this._transformCtrlDataToSaveFormat(this.content[e]);
				}
				return resultData;
			},
			_transformCtrlDataToSaveFormat: function(item){
				if(!item){
					return "";
				}
				if(Object.prototype.toString.call(item) == "[object Object]"){
					return item.key + '@' + item.text;
				}else{
					return item.toString();
				}
			}
		}
	});
	return vmHeader;
});