define(['vue', 'vuex', 'utils'], function(Vue, Vuex, utils){
	Vue.use(Vuex);
	//所有的全局变量都在这里
	var store = new Vuex.Store({
		state: {
			billNo: document.getElementById('billNo').value,
			billId: document.getElementById('billId').value,
			billType: document.getElementById('billType').value,
			billStatus: document.getElementById('billStatus').value,
			pageType: utils.GetQueryString("billNo")? 'U': 'C',
		    orgId: document.getElementById('orgId').value,
		    pageStatus: document.getElementById('pageStatus').value || "from",
		    noticeType: document.getElementById('noticeType').value,
		    currentNode: document.getElementById('currentNode').value || "start",
		    baseId: document.getElementById('baseId').value,
			userInfomation: {
				/*"deptId": null,
		        "deptName": null,
		        "orgId": null,
		        "orgName": null,
		        "postId": null,
		        "userId": null,
		        "userName": null*/
			},
			flowInfo: {
				//assignee
				//baseId
				//billId,billNo, nodeName
				//createrId, execId,id, nodeId, pattern, processId, processInst, reqDept,taskId,tmId			
			},
			billInfo: {
				//createrName, createrId
			},
			mappingFieldList: [],
			uploadUrl: document.getElementById("uploadUrl").value
		},
		mutations: {
			setMappingField: function(state, data){
				state.mappingFieldList = data;
			},
			setUserInfomation: function(state, data) {
		    	state.userInfomation = data;
		    },
		    setFlowInfo: function(state, data){
		    	state.flowInfo = data;
		    },
		    setBillInfo: function(state, data){
		    	state.billInfo = data;
		    }
		},
		getters: {
			getUserParam: function(state){
				return {
					"billId": state.billId,
					"reqUserId": state.userInfomation.userId,
					"reqDeptId": state.userInfomation.deptId
				};
			},
			isUpdatePage: function(state){
				return state.pageType == "U";
			},
			isCreatePage: function(state){
				return !state.pageType || state.pageType == "C";
			},
			isPreviewPageStatus: function(){ //预览类型
				return document.getElementById('previewPageStatus').value == "preview"? true:false;
			}
		},
		actions: {
			initMappingField: function(context){
				utils.get("getBillControlDimColumnAction.ajax", { billId: context.state.billId}, function(data){
					context.commit("setMappingField", data.dimRefList);					
				});
			},
			initFlowInfo: function(context){
				return new Promise(function(resolve){
					utils.get("queryBillTaskInfo.ajax", { businessKey: context.state.billNo}, function(data){
						context.commit("setFlowInfo", data);
						resolve();
					});
				});
			},
			initBillInfo: function(context){
				return new Promise(function(resolve){
					utils.get("queryBillCreateUserInfoCtx.ajax", { billNo: context.state.billNo}, function(data){
						context.commit("setBillInfo", data);
						resolve();
					});
				});				
			}
		}
	});
	
	//取当前字段映射的所有其他字段
	store._getMappingTargetFields = function(srcField){
		var targetFields = []; 
    	this.state.mappingFieldList.forEach(function(a){
    		if(a.sourceField == srcField){
    			targetFields.push(a.targetField);
    			return true;
    		}
    	});
    	return targetFields;
	};

	//取当前字段映射的所有其他字段
	store._getMappingSrcField = function(targetField){
     	var dimRefList = this.state.mappingFieldList;
     	for(var i =0;i<dimRefList.length;i++){
     		if(targetField == dimRefList[i]["targetField"]){     			
     			var sourceDim = dimRefList[i]["sourceField"];
     			return sourceDim;
     		}
     	}
    	return null;
	};

	return {
		store: store
	}
});