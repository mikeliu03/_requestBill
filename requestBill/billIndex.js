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
		barcode: "jquery-barcode-2.0.2.min",
		jq_uploadify: "jquery.Huploadify",
		jq_datepicker_zh_cn: "jquery.ui.datepicker-zh-CN",
		datatables: "jquery.dataTables.min",
		cem_upload: "cem-upload",
		viewer: "jquery.viewer",
		vue: "vue",
		vuex: "vuex",
		//vueResource: "vue-resource.min",
		storeIndex: "../private/bill/requestBill/store/index",
		globalApi: "../private/bill/requestBill/api/global",
		filterIndex: "../private/bill/requestBill/filter/filter",
		compHeader: "../private/bill/requestBill/components/Header",
		compDetail: "../private/bill/requestBill/components/Detail",
		compShare: "../private/bill/requestBill/components/Share",
		compPayment: "../private/bill/requestBill/components/Payment",
		compAttach: "../private/bill/requestBill/components/Attach",
		ctrlInput: "../private/bill/requestBill/components/CtrlInput",
		ctrlSelect: "../private/bill/requestBill/components/CtrlSelect",
		ctrlDate: "../private/bill/requestBill/components/CtrlDate",
		modalTree: "../private/bill/requestBill/components/ModalTree",
		modalHistory: "../private/bill/requestBill/components/ModalHistory",
		modalEndorsement: "../private/bill/requestBill/components/ModalEndorsement",
		modalSendinfo: "../private/bill/requestBill/components/ModalSendinfo",
		modalRelevantBill: "../private/bill/requestBill/components/modalRelevantBill",
		modalFlowback: "../private/bill/requestBill/components/ModalFlowback",
		modalAdvice: "../private/bill/requestBill/components/ModalAdvice"
	},
	shim: {
		bootstrap: ["jquery"],
		jq_validate: ["jquery"],
		jq_validata_msg: ["jquery", "jq_validate"],
		jq_uploadify: ["jquery"],
		jq_ui: ["jquery"],
		jq_ztree: ["jquery"],
		jq_hc: ["jquery"],
		barcode: ["jquery"],
		viewer: ["jquery"],
		jq_datepicker_zh_cn: ["jquery","jq_ui"],
		datatables: ["jquery"],
		//vueResource: ["vue"],
		vuex: ["vue"]
	}, urlArgs: "v=de1dbef188"});

// 引入公共脚本：header和左侧menu
require(["common"]);
require(["bootstrap"]);
require(["globalApi"]);
require(["filterIndex"]);
require(["ctrlInput"]);
require(["ctrlSelect"]);
require(["ctrlDate"]);
//require(["modalRelevantBill"]);

require(["utils", "vue", "storeIndex", "compHeader", "compDetail", "compShare", "compPayment", "compAttach", "modalHistory", "modalEndorsement", "modalSendinfo", "modalFlowback",
         "modalAdvice", "modalTree", "jq_validata_msg"], 
	function(utils, Vue, StoreIndex, compHeader, compDetail, compShare, compPayment, compAttach, modalHistory){
	var store = StoreIndex.store;
	new Vue({
	  el: '#vueRoot',
	  store: store,
	  data: {
		//每个模块有哪些元素，元素绑定数据源，样式等信息都在这
	  	metadata: {
	  		header: {
	  			title: "",
	  			access: {
	  				isUserEdit: true
	  			},
	  			main: {
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
	  	
	  	//如果是更新模式，各区域数据都这
	  	billdata: {
	  		"main": {
	  			"main_remark": null
	  		},
	  		"detail": [],
	  		"share": []
	  	},
	  	flow: {
	  		//processDefinitionId: 流程定义ID,baseId:流程主表ID
	  	},
	  	//单据不同状态下按钮的显示情况
	  	btnshow: {
	  		"bill_submit": false,
	  		"bill_submit_flow": false,
	  		
	  		"bill_save": false,
	  		"back_flow": false,
	  		"backout_flow": false,
	  		"bill_finish": false,
	  		"bill_delete": false,
	  		"flow_reminders": false,
	  		"backout_flow": false,
	  		"bill_finish": false,
	  		
	  		//
	  		"bill_print": false,
	  		
	  		"sendBill": true,
	  		"addEndorseli": true,
	  		"showHistory": true,
	  		
	  		"reject": false,
	  		"consent": false,
	  		"advice": false
	  	},
	  	//单据权限控制
	  	areaAuth: {
	  		"detail": {
	  			"isShow": true,
	  			"isEdit": true
	  		},
	  		"share": {
	  			"isShow": true,
	  			"isEdit": true
	  		},
	  		"payment": {
	  			"isShow": true,
	  			"isEdit": true
	  		},
	  		"remark": {
	  			"isShow": true,
	  			"isEdit": true
	  		}
	  	},
	  	AreasName: ["detail", "share", "payment"],
	  	Validator: null
	  },
	  computed: {
	  },
	  created: function(){
	  	this._getBillTemplateMetadata();
	  	this.$store.dispatch("initMappingField");
	  	//this.$store.dispatch("initFlowInfo");
	  	//this.$store.dispatch("initBillInfo");	  	
	  },
	  mounted: function(){
	  	var self = this;
	  	this._initValidateForm();	  	
	  	
	  	this.$on("billSendEvt", function(ids){
	  		self._sendBillEvt(ids);
	  	});
	  	this.$on("billEndorsementEvt", function(ids){
	  		self._billEndorsementEvt(ids);
	  	});	
	  	
	  	this.$on("updateOriginalCurrSumEvt", function(data){
	  		self.$refs["headerBillArea"].setOriginalCurrSum(data);
	  	});
	  	//1. 取所有全局参数
	  	//2. 初始化单据
	  	Promise.all([this.$store.dispatch("initFlowInfo"), this.$store.dispatch("initBillInfo"), this._getBillData(), this._loadBillBaseMessage()]).then(function(){
	  		self._getBillButtonState();
	  		
	  		var pageStatus = self.$store.state.pageStatus;
	  		var billStatus = self.$store.state.billInfo.billStatus;
	  		
	  		if(!self.$store.getters.isCreatePage){
		  		if(billStatus == '0' && pageStatus == 'billquery'){ //允许修改申请人
		  			self.metadata.header.access.isUserEdit = true;
		  		}else{
		  			self.metadata.header.access.isUserEdit = false;
		  		}
		  		
		  		if((billStatus == '0' && pageStatus == 'billquery') || billStatus == '1' && pageStatus == 'flowtask'){
		  			//需要校验所有字段权限
		  			self._getAccessControl();
		  		}else{
		  			self._setAllCtrlToDisable();
		  		}
	  		}	  		
	  	});
	  },
	  methods: {
		  saveBill: function(){
		  	$.when(this._saveBillInfo()).done(function(){
		  		utils.cem_message("单据保存成功!");
		  	});		  	
		  },
		  //提交单据
		  submitBill: function(){
		  		var self = this;
		  		if(!this.Validator.form()){
		  			return false;
		  		}
		  		$.when(this._saveBillInfo()).done(function(){
		  			//校验当前差旅报销单是否发起流程
	                var checkTravelBill = {
	                	"billId": self.$store.state.billId,
		  				"billNo": self.$store.state.billNo,
	                };                        
	                utils.post("queryTravelApplyBill.ajax", checkTravelBill, function(data){
	                	console.log(2);
	            		if(data == 'submit'){ //普通单据/非零报销正常发起审批                        
	                        var baseMessage = {
	                        	"billNo": self.$store.state.billNo,
	                        	"nodeId": self.$store.state.currentNode,
	                        	"saveFlag": "1",
	                        	"billType": self.$store.state.billType
	                        };
	                        $.extend(true, baseMessage, self.flow);
	                        // 提交成功后的弹出层
	                        utils.post("getProcessAttributeByBill.ajax", baseMessage, function(data) {                        	
	                        	self._processAttributeByBill(data);
	                        });            			
	            		}else{
	            			utils.cem_message("提交成功!",function(){
	            				window.location.href = "showOwnBillSkipAction.do?";
	            			});
	            		}
	            	});
		  		});
		  	},
		  //删除单据
		  	deleteBill: function(){
		  		var self = this;
		  		utils.cem_alert("确定要执行单据删除吗？", function (){
			        var param = {billNo: self.$store.state.billNo, billId: self.$store.state.billId};
			        $.ajax({
			            url: "deleteBillFormAction.ajax",
			            type: "post",
			            data: param,
			            dataType: "json"
			        }).success(function (data) {
		                if (data.rspData == '0') {
		                	utils.cem_message("单据尚未保存，无需删除.");
		                }else if(data.rspData == '1'){
		                	utils.cem_message("该单据已经提交，不能删除.");
		                }else {
		                	utils.cem_message("单据删除成功!",function(){
		                		location.reload(); //刷新当前页面
		                	});
		                }
		            });
		    	 });
		  	},
		  //打印单据
		  	printBill: function(){
				var param = {
					"billId": this.$store.state.billId,
					"billNo": this.$store.state.billNo,
					"reqDeptId": this.$store.state.userInfomation.deptId
				};
				utils.post("queryPrintTempletByBillId.ajax", param, function(modelId){
					if(modelId){
	                	window.open("toPrintBillView.do?billNo="+ param.billNo+"&billId="+ param.billId + "&modelId="+modelId);
	                }else{
	                	utils.cem_message("当前单据未匹配打印模版！");
	                }
				});
		  	},
		  	//撤回
		  	backoutFlow: function(){
		  		var self = this;
				var billNo = this.$store.state.billNo;
				utils.cem_alert("确定要执行撤回吗？", function () {					
					var paramt = {
						"processInst": self.$store.state.flowInfo.processInst,
						"taskId": self.$store.state.flowInfo.taskId,
						"processId": self.$store.state.flowInfo.processId,
						"executionId": self.$store.state.flowInfo.execId,
						"taskSource": self.$store.state.flowInfo.taskSource,
						"currentNode": self.$store.state.currentNode,
						"billNo": self.$store.state.billNo,
						"billmainid": self.$store.state.billInfo.billMainId
					};					
					utils.ajax({
						url: "workFlowRegainAction.ajax",
						type: "get",
						data: paramt,
						dataType: "json",
						success: function(data){							
							utils.cem_message("撤回成功!",function(){
								window.location.href = "showOwnBillSkipAction.do?";
							});							
						}
					});
				 });
		  	},
		  	//催办
		  	flowReminder: function(){
		  		$.ajax({
					url: "flowReminders.ajax?businessKey=" + this.$store.state.billNo,
					type: "get",
					data: {},
					dataType: "json",
					success: function(data){
						utils.cem_message(data.rspMsg);
					}			
				})
		  	},
		  	// 退回流程
		  	backFlow: function(){		  		
		  		this.$refs["modal_flowback"].showModal();
		  	},
		    //流程终止
		  	billFinish: function(){
		  		var paramt = {
	  				"processInst": this.$store.state.flowInfo.processInst,
					"taskId": this.$store.state.flowInfo.taskId,
					"billNo": this.$store.state.billNo,
					"billId": this.$store.state.billId
		  		};
				$.ajax({
					url: "endBillWorkFlowAction.ajax",
					type: "get",
					data: paramt,
					dataType: "json",
					success: function(data){
					  	if (data.msgType == "N") {
					  		utils.cem_message("流程终止成功!",function(){
					  			window.location.href = "showOwnBillSkipAction.do?";
					  		});
							
		            	}else{
		            		utils.cem_message(data.rspMsg);
		            	}
						
					},
					error: function(data){
						utils.cem_message("流程终止失败");
					}
				});
		  	},
		  	//抄送
		  	sendInfoMenu: function(){
		  		this.$refs["modal_sendinfo"].showModal();
		  	},
		  	//会签
		  	sendEndorsementMenu: function(){
		  		this.$refs["modal_endorsement"].showModal();
		  	},
		  	//会签模式: 同意/驳回
		  	commentAddPass: function(btnName){
				var paramt = {
					"billId": this.$store.state.billId,
		  			"businessKey": this.$store.state.billNo,
		  			"processDefinitionId": this.$store.state.flowInfo.processId,
		  			"nodeId": this.$store.state.currentNode,
		  			"taskId": this.$store.state.flowInfo.taskId,
		  			"execId": this.$store.state.flowInfo.execId,
		  			"processInst": this.$store.state.flowInfo.processInst,
		  			"comment": this.billdata.main.main_advice, //审批意见
		  			"buttonName": btnName
				};
				utils.ajax({
		            url: "billFlowCommentAndPass.ajax",
		            type: "post",
		            data: paramt,
		            dataType: "json",
		            success: function (data) {		            	
		              utils.cem_message("单据提交成功!",function(){
		       			  window.location.href = "billIndex.do?";
		           	  });		            	
		            }
				});
		  	},
		  	_sendBillEvt: function(ids){
		  		var self = this;
		  		var param = {
			    	"billId": this.$store.state.billId,
			    	"billNumber": this.$store.state.billNo,
			    	"billName": this.$store.state.billInfo.billName,
			    	"billStatus": this.$store.state.billInfo.billStatus,
			    	"ids": ids,
			    	"remark": this.billdata.main.main_remark,
			    	"nodeName": this.$store.state.flowInfo.nodeName,
			    	"currentApproval": this.$store.state.flowInfo.assignee,
			    	"totalAmount": this.billdata.main.main_originalCurrencySum,
			    	"creater": this.$store.state.billInfo.createrName
			    };
		       utils.post("billSend.ajax",param,function(data){
		    	   if (data == "success") {
		           	   utils.cem_message("抄送成功");
		           	   self.$refs["modal_sendinfo"].hideModal();
		           }
		       });
			},
			_billEndorsementEvt: function(assignee){
				var datas = {
						/*taskId:$("#taskId").val(), //任务ID
						nodeId:$("#currentNode").val(), //节点ID
						billNum:$("#billNo").val(), //单据编号
						processDefinitionId:$("#processDefinitionId").val(), //流程定义ID
						signModel:$("#endorsement_current").val(),//加签审批模式,
						processInst:$("#processInst").val(),//流程实例ID
						assignee:assignee //加签人*/
				}
				
				utils.post("endorseBillWorkFlowAction.ajax", datas, function(data){
					utils.cem_message("单据加签成功!",function(){
	                	window.location.href = "billIndex.do?";
	                });			
				});
			},
		  	_getBillTemplateMetadata: function(){
		  		var self = this;
		  		utils.get("queryBillTempletAction.ajax", {billId: this.$store.state.billId}, function(data){
		  			self.AreasName.forEach(function(name){
		  				if(data.metadata[name]){
			  				data.metadata[name].items.forEach(function(a){
					  			a.access = {
					  				"isEdit": "000",
					  				"isShow": "000"
					  			};
					  		});
			  			}
		  			});
		  				  			
		  			var copyMetaData = $.extend(true, {}, self.metadata);
		  			self.metadata = $.extend(true, copyMetaData, data.metadata);
		  		});
		  	},
		  	_getBillData: function(){		  		
		  		var self = this;
		  		var url = "editAndShowBillFormAction.ajax";
		  		if(!this.$store.getters.isUpdatePage){
		  			return true;
		  		}
		  		return new Promise(function(resolve){
		  			utils.get(url, { main_billNo: self.$store.state.billNo }, function(data){
			  			for(var e in data){
							if(e == "main"){
								self.billdata.main = data.main[0];
							}else{
								self.billdata[e] = data[e];
							}
						}
			  			resolve();
			  		});
		  		});		  		
		  	},
		  	_saveBillInfo: function(){
		  		var deferred = $.Deferred();
		  		var self = this;
		  		//var refNames = ["detailBillArea", "shareBillArea", "paymentBillArea", "attachBillArea"];
		  		var refNames = ["detailBillArea"];
		  		var data = {mainBillNo: this.$store.state.billNo, billId: this.$store.state.billId};
		  		refNames.forEach(function(refname){
		  			var ref = self.$refs[refname];
		  			var areaData = ref.getAreaData();
		  			var areaName = ref.getName();
		  			data[areaName] = [];
		  			areaData.forEach(function(lineData){
						data[areaName].push(JSON.stringify(lineData));
		  			});	  			
		  		});
		  		
		  		var headerData = this.$refs['headerBillArea'].getAreaData();
		  		data['title'] = [JSON.stringify(headerData)];
		  		data["main_remark"] = this.billdata.main.main_remark;
		  		data["checkBudget"] = "000";
		  		
		  		var saveUrl = "";
		  		if(this.$store.getters.isUpdatePage){
		  			saveUrl = "saveBillBusinesAction.ajax";
		  		}else{
		  			saveUrl = "saveBillBusinesSubmitAction.ajax";
		  		}
		  		
		  		utils.ajax({
	                url: saveUrl,
	                type: "post",
	                data: data,
	                dataType: "json",
	                success: function (_data) {
	                	self.$refs['attachBillArea'].loadAttachData();
	                	deferred.resolve(data);
	                }
	            });
		  		return deferred.promise();
		  	},
		  	_initValidateForm: function(){
		  		this.Validator = $("#preview_form", this.$el).validate({
		  	        showErrors: function (map, list) {
	                    var focussed = document.activeElement;
	                    if (focussed && $(focussed).is("input, textarea")) {
	                        $(this.currentForm).tooltip("close", {
	                            currentTarget: focussed
	                        }, true)
	                    }
	                    this.currentElements.removeAttr("title").removeClass("ui-state-highlight");
	                    $.each(list, function (index, error) {
	                        $(error.element).attr("title", error.message).addClass("ui-state-highlight");
	                    });
	                    if (focussed && $(focussed).is("input, textarea")) {
	                        $(this.currentForm).tooltip("open", {
	                            target: focussed
	                        });
	                    }
	                },
		  		});
		  	},
		  //查询当前单据所属的流程信息等
		  	_loadBillBaseMessage: function(){
		  		var self = this;
		  		var paramBaseMessage = {
		  			"billId": this.$store.state.billId,
		  			"billNo": this.$store.state.billNo,
		  			"orgId": this.$store.state.orgId,
		  			//"nodeId": "start",
		  			"nodeId" : this.$store.state.currentNode,
		  			"saveFlag": "1"
		  		};

			  	if(this.$store.getters.isPreviewPageStatus){
		  			return true;
		  		}
		  		return new Promise(function(resolve){
		  			$.ajax({
			  			url: "getBaseMessageByBillNoAndOrgId.ajax",
			  			data: paramBaseMessage,
			  			type: "get",
		            	dataType: "json"
			  		}).success(function(data){
			  			if(data.msgType == 'E'){	  				
		            		utils.cem_message("当前单据没有找到流程信息!");
		            		return false;
		            	}else{
		            		self.btnshow.bill_submit_flow = true;
		            	}
		
		            	data = data.rspData;
		            	self.flow = data;
		            	resolve();
					});		  			
		  		});		  		
		  	},
		  	//单据权限查询
		  	_getAccessControl: function(){
		  		//单据操作权限控制 (允许操作附件 operateAttachment;允许查看附件 viewAttachment)....
		  		var self = this;
            	var authParam = { nodeId:self.$store.state.currentNode, processDefinitionId: this.flow.processDefinitionId, baseId: this.flow.id};
            	//单据区域显示/隐藏权限控制
            	utils.get("billAccessControlAction.ajax", authParam, function(data){
					//各个区域显示情况
					//区域 isShow 000:显示  001:隐藏
					for(var i = 0; i < data.length; i++){
						
						if(!self.areaAuth[data[i].areaCode]){
							self.areaAuth[data[i].areaCode] = {
								isShow: true,
								isEdit: true
							};
						}
						var tmpAuthObj = self.areaAuth[data[i].areaCode];
						if(data[i].isShow == "000"){
							tmpAuthObj.isShow = true;											
						}else if(data[i].isShow == "001"){
							tmpAuthObj.isShow = false;
						}
						
						//isEdit 000:可编辑  001:不可编辑  
						if(data[i].isEdit == "000"){
							tmpAuthObj.isEdit = true;
						}else if(data[i].isEdit == "001"){
							tmpAuthObj.isEdit = false;
						}					
					}
				});

				//单据字段权限控制
				utils.get("billItemAccessControlAction.ajax", authParam, function(accessData){
					console.log(accessData);
					console.log(self.metadata.detail);
					self.AreasName.forEach(function(name){
						var areaMetaArr = self.metadata[name].items;
						for(var i = 0; i < areaMetaArr.length; i++){
							var itemName = areaMetaArr[i].prop.name;
							var accessItem = accessData.filter(function(a){
								return a.itemId == itemName;
							})[0];
							areaMetaArr[i].access = accessItem;
						}
					});
					//billAjaxhandler.accessControlActionHandler(data, loadBaseMessage);
				});	
		  	},
		  	_accessControlActionHandler: function(data){
			  	//字段 isShow 000:显示  001:隐藏  
			  	//字段 000:可编辑  001:不可编辑  
		  		
		  	},
		  	_setAllCtrlToDisable: function(){
		  		var self = this;
		  		this.AreasName.forEach(function(name){
		  			var areaMetaArr = self.metadata[name].items;
		  			areaMetaArr.forEach(function(a){
			  			a.access = {
			  				"isEdit": "001",
			  				"isShow": "000"
			  			};
			  		});			  		
			  		self.areaAuth[name].isEdit = false;
		  		});

		  		this.areaAuth.remark.isEdit = false;
		  	},
		  	_processAttributeByBill: function(data){
		  		var self = this;
		  		this.flow.nodeId = data.nextNodeId;
		  		var executiveArr = data.executive;
		  		var assignee = null;
		  		if(executiveArr && executiveArr.length){
		  			var assignees = [];
		  			executiveArr.forEach(function(a){
			  			assignees.push({"personelCode": a.personleCode});
			  		});
		  			assignee = JSON.stringify(assignees);
		  		}		  		
		  		var param = {
		  			"assignee": assignee,
		  			"processId": data.processDefinitionId,
		  			"processDefinitionKey": data.processDefinitionKey,
		  			"nextNodeId": data.nodeId
		  		}
		  		if(this.$store.getters.isCreatePage ||(this.$store.state.billInfo.billStatus == '0' && this.$store.state.pageStatus == 'billquery')){
		  			this._startBillWork(param);
		  		}else{
		  			this.$refs["modal_advice"].showModal({
		  				save: function(data){
		  					self._processBillWork($.extend(true, param, data));
		  				} 
		  			});		  			
		  		}		  		
			},
			 // 开始跑流程
	    	_startBillWork: function(data){
	    		var self = this;
		    	var param = {
		    		"billId": this.$store.state.billId,
		  			"billNo": this.$store.state.billNo,
		  			"orgId": this.$store.state.userInfomation.deptId,
		  			"baseId": this.flow.id,
		  			"nodeId": this.flow.nodeId
		    	};
		    	$.extend(true, param, data);
		    	utils.ajax({
		            url: "startBillWorkFlowAction.ajax",
		            timeout:300000,
		            type: "post",
		            data: param,
		            dataType: "json",
		            success: function (data) {
		            	self._showHistory({
		            		hide: function(){	            			
			   					window.location.href = "billExpenseSkip.do?";
		            		}
		            	});
		            }
		    	});	    	
		    },
		    
		    //继续处理流程
		    _processBillWork: function(data){
		    	var self = this;
		    	var param = {
		    		"billId": this.$store.state.billId,
		  			"billNo": this.$store.state.billNo,
		  			"processDefinitionId": data.processId,
		  			"processDefinitionKey": data.processDefinitionKey,
		  			"assignee": data.assignee,
		  			"thisNode": this.$store.state.currentNode,
		  			"thisTaskId": this.$store.state.flowInfo.taskId,
		  			"nextNodeId": data.nextNodeId,
		  			"executionId": this.$store.state.flowInfo.execId,
		  			"processInst": this.$store.state.flowInfo.processInst,
		  			"form_explain": data.form_explain //审批意见
		    	};
		    	utils.ajax({
		            url: "billSkipWorkFlowAction.ajax",
		            timeout:300000,
		            type: "post",
		            data: param,
		            dataType: "json",
		            success: function (data) {
		            	utils.cem_message("单据提交成功!",function(){
                		  window.location.href = "billIndex.do?";
		            	});
		            }
		    	});	
		    },
		  //查询按钮权限
		    _getBillButtonState: function(){
		    	var self = this;
		    	if(this.$store.state.noticeType == 'U'){
		    		this.btnshow["sendBill"] = false;
		    		this.btnshow["addEndorseli"] = false;
		    	}
		    	var flowParam = {
	    			"nodeId" : this.$store.state.flowInfo.nodeId,
					"processDefinitionId": this.$store.state.flowInfo.processId,
					"taskId": this.$store.state.flowInfo.taskId
		    	}
		    	if(this.$store.state.pageStatus == 'flowtask'){
		    		utils.post("queryNodeAttrbutForProcessDefinitionId.ajax", flowParam, function(data){
		    			if(data == 'agree' || data == 'endorse'){
		    				self.btnshow["reject"] = true;
		    				self.btnshow["consent"] = true;
		    				self.btnshow["advice"] = true;
		    				self.btnshow["addEndorseli"] = false;		
						}else{
							self._getBillBtnCtrlaction();
						}
		    		});
		    	}else{
		    		this._getBillBtnCtrlaction();
		    	}	    	
		    },
		    _getBillBtnCtrlaction: function(){
		    	var self = this;
		    	var param = {
					"pageStatus" : this.$store.state.pageStatus,
					"flowStatus" : "002",
					"billStatus" : this.$store.state.billInfo.billStatus,
					"businessKey" : this.$store.state.billNo,
					"nodeId" : this.$store.state.currentNode,
					"processDefinitionId":this.$store.state.flowInfo.processId,
					//"noticeType":$("#noticeType").val(),
					"billType":this.$store.state.billType,
					//"redStatus":utils.GetQueryString("redStatus"),
				};
		    	utils.post("billButtonControlAction.ajax", param, function(data){
					var	array = data.buttonStrMap.replace(/\"/g, "").split(",");
					for(var i = 0; i < array.length; i++){
						self.btnshow[array[i]] = true;
					}
					
					if(param.pageStatus == 'completeflowtask' || param.pageStatus == 'billquery' || param.nodeId == 'start'){ //如果是已办任务则隐藏，加签按钮
						$("#add_endorseli").addClass("hide");
					}
		    	});
		    },
		    
		    //显示审批历史
		    _showHistory: function(opt){
		    	this.$refs["modal_history"].showModal(opt);
		    },
		    
		    hasAreaByName: function(name){
		  		return this.metadata[name]? true: false;
		  	}
	  },
	  components: {
	  	"compHeader": compHeader,
	  	"compDetail": compDetail,
	  	"compShare": compShare,
	  	"compPayment": compPayment,
	  	"modalHistory": modalHistory,
	  	"compAttach": compAttach
	  }
	});
});