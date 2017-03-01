require.config({
	baseUrl: "resource/js/public",
	paths: {
		jquery: "jquery-2.1.4.min",
		bootstrap: "bootstrap.min",
		jq_validate: "jquery.validate.min",
		jq_validata_msg: "messages_zh",
		jq_ui: "jquery-ui.custom.min",
		jq_ztree: "jquery.ztree.all-3.5.min",
		jq_datepicker_zh_cn: "jquery.ui.datepicker-zh-CN",
		jq_ui_addon: "jquery-ui-timepicker-addon",
		datatables: "jquery.dataTables.min",
		cem_autocomplete_input:"cem-autocomplete-input"
	},
	shim: {
		bootstrap: ["jquery"],
		jq_validate: ["jquery"],
		jq_validata_msg: ["jquery", "jq_validate"],
		jq_ui: ["jquery"],
		jq_datepicker_zh_cn: ["jquery", "jq_ui"],
		jq_ui_addon: ["jquery", "jq_ui"],
		jq_ztree: ["jquery"],
		datatables: ["jquery"],
		cem_autocomplete_input:["jquery"]
	}
});

require(["common"]);

require(["utils", "jq_ui", "bootstrap", "jq_ztree","jq_ui_addon","jq_validata_msg", "datatables","jq_datepicker_zh_cn","cem_autocomplete_input"], function(utils){
		var table_example = $("#table_example");
		var chk_all = $("#table_example_all");
		var table = table_example.DataTable({
			processing: true,		// 服务器端获取数据时，需添加
			serverSide: true,		// 服务器端获取数据时，需添加
			ajax: {
	             url: "getContractList.ajax",
	             type: "POST",
	             data: function(d){
			 		var searchJson = _getSearchJson();
			 		var param = jQuery.extend(true, d, searchJson);
			 		return param;
			 	}
	        },
			lengthChange: false,
			info:false,
			searching: true,
			ordering: false,
			columns: [
				{
					searchable : false,
					data : "id",
					render : function(data) {
						return "<input type='checkbox' value='" + data+ "' />";
					},
					orderable : false,
					width : "2%"
				},
				{data: "code",width:"9%"},
				{data: "typeName",width:"6%"},
				{data: "name",width:"8%"},
				{data: "employeeName",width:"5%"},
				{
					data : "state",
					width:"6%",
					render : function(data){
						var state = "";
						switch(data){
					       case "1": state = "草稿"; break;
					       case "2": state = "审批中"; break;
					       case "3": state = "待处理"; break;
					       case "4": state = "确认"; break;
					       case "5": state = "变更中"; break;
					       case "6": state = "暂挂"; break;
					       case "7": state = "终止"; break;
					       case "8": state = "完成"; break;
					       default : state = "";
					   };
					   return state;
					}
				},
				{
					data : "auditState",
					width:"7%",
					render : function(data){
						var auditState = "";
						switch(data){
						   case "1": auditState = "草稿"; break;
					       case "2": auditState = "审批中"; break;
					       case "3": auditState = "待处理"; break;
					       case "4": auditState = "审核通过"; break;
					       default : auditState = "";
						};
						return auditState;
					}
				},
				{data: "createTime",width:"7%"},
				{data: "startDate",width:"7%"},
				{data: "endDate",width:"7%"},
				{data: "captainName",width:"5%"},
				{data: "amount",width:"6%"}
			],
			"columnDefs": [{},//合同编号链接至详情页面地址绑定
	            {
	                "render": function (data, type, row, meta) {
	                	return "<a href='contractInfo.do?pagetype=R&contractId=" + row.id + "'>" + row.code + "</a>";
	                },
	                //指定是第二列
	                "targets": 1
	        }],
			order: [[1, 'asc']]
	}); 
	// 注册表格单页全选事件
	chk_all.click(function() {
		var _this = this;
		$("tbody :checkbox", table_example).each(function() {
			this.checked = _this.checked;
		});
	});
	table_example.on("click", "tbody :checkbox",
		function() {
			var checked_len = $("tbody :checkbox:checked",
					table_example).length;
			var chk_len = $("tbody :checkbox",
					table_example).length;

			chk_all[0].checked = checked_len === chk_len;
		});
	init_type_data();
	init_state_data();
	$("#createStartTime").datepicker({
    	minDate: new Date($("#createStartTime").val()),
        changeYear: true,
        changeMonth: true,
        numberOfMonths: 1,
        timeFormat: 'hh:mm:ss',
        onClose: function (selectedDate) {
            $("#createEndTime").datepicker("option", "minDate", new Date($("#createStartTime").val()));
        }
    });

    $("#createEndTime").datepicker({
    	minDate: "+1d",
        changeYear: true,
        changeMonth: true,
        numberOfMonths: 1,
        timeFormat: 'hh:mm:ss',
    });
    $("#startTime").datepicker({
    	minDate: new Date($("#startTime").val()),
        changeYear: true,
        changeMonth: true,
        numberOfMonths: 1,
        timeFormat: 'hh:mm:ss',
        onClose: function (selectedDate) {
            $("#startTimeEnd").datepicker("option", "minDate", new Date($("#startTime").val()));
        }
    });
    $("#startTimeEnd").datepicker({
    	minDate: "+1d",
        changeYear: true,
        changeMonth: true,
        numberOfMonths: 1,
        timeFormat: 'hh:mm:ss',
    });
    $("#endTime").datepicker({
    	minDate: new Date($("#endTime").val()),
        changeYear: true,
        changeMonth: true,
        numberOfMonths: 1,
        timeFormat: 'hh:mm:ss',
        onClose: function (selectedDate) {
            $("#endTimeEnd").datepicker("option", "minDate", new Date($("#endTime").val()));
        }
    });
    $("#endTimeEnd").datepicker({
    	minDate: "+1d",
        changeYear: true,
        changeMonth: true,
        numberOfMonths: 1,
        timeFormat: 'hh:mm:ss',
    });

    $("#clearContent").click(function(){
    	$("#contractNo").val("");
    	$("#createStartTime").val("");
    	$("#createEndTime").val("");
    	$("#contactName").val("");
    	$("#formulator").val("");
    	$("#startTime").val("");
    	$("#startTimeEnd").val("");
    	$("#endTime").val("");
    	$("#endTimeEnd").val("");
    	$("#contactType").val("");
    	$("#personLiable").val("");
    	$("#contactStatus").val("");
    });
	$("#search").click(function(){
		table.ajax.reload();
	});
	//修改
	$("#contactUpdate").click(function(){
		var checked_elem = $("tbody :checkbox:checked", table_example);
		var selected_data = table.row(checked_elem.closest("tr")[0]).data();  //选择中数据
		if(checked_elem.length <= 0){
			utils.cem_message("请选择一条记录。");
			return false;
		}else if(checked_elem.length > 1){
			utils.cem_message("一次只能修改一条记录。");
			return false;
		}else if(selected_data.auditState != '1' && selected_data.auditState != '3'){
			utils.cem_message("只能对合同审核状态为草稿和待处理的合同进行修改操作");
			return false;
		}else{
			utils.post("getContractOperationType.ajax", {contractId: selected_data.id}, function(data){
				  if(data.flag){
					  window.location.href = 'contractInfo.do?pagetype=U&contractId=' + selected_data.id;
				  }else{
					  utils.cem_message("该用户不具有对当前合同的编辑权限");
				  }
			  });
		}
		
	});
	//删除
	$("#contactDel").click(function(){
		var checked_elem = $("tbody :checkbox:checked",table_example);
		var selected_data = table.row(checked_elem.closest("tr")[0]).data();  //选择中数据
		if(checked_elem.length <= 0){
			utils.cem_message("请至少选择一条记录。");
			return false;
		}else if(selected_data.state != '1' && selected_data.state != '3'){
			utils.cem_message("只能对草稿或待处理的合同进行删除操作");
			return false;
		}

		utils.cem_alert("确认要删除选中项吗？", function(){
			var ids = [];
			
			checked_elem.each(function(){
				ids.push(this.value);
			});

			utils.post("deleteContract.ajax",{ids: ids + ""},function(data){
				table.draw();
			});
		});
	});
	function _getSearchJson(){
		var obj = {
				"code": $.trim($("#contractNo").val()),
				"createTimeMin": $.trim($("#createStartTime").val()),
				"createTimeMax": $.trim($("#createEndTime").val()),
				"name": $.trim($("#contactName").val()),
				"formulator": $.trim($("#formulator").val()),
				"startDateMin": $.trim($("#startTime").val()),
				"startDateMax": $.trim($("#startTimeEnd").val()),
				"endDateMin": $.trim($("#endTime").val()),
				"endDateMax": $.trim($("#endTimeEnd").val()),
				"type": $.trim($("#contactType").val()),
				"captain": $.trim($("#personLiable").val()),
				"state": $.trim($("#contactStates").val())
			};

		var result = {};
		for(var e in obj){
			if(e && obj[e] && obj[e].trim()!== ","){
				result[e] = obj[e];
			}
		}
		return result;
	}
	//初始化合同类型列表
	function init_type_data(){
		$("#contactType").empty();//清空
    	var contactType = $("#contactType");
    	var optionStr = "";
    	utils.post("getContractTypes.ajax",{},function(data){
 			var selectData = data;
 			optionStr += '<option value="">请选择..</option>';
     		for(var i = 0;i < selectData.length;i++)
     		{
     			optionStr += '<option value="'+selectData[i].objId+'">'+selectData[i].objName+'</option>';
     		}
     		contactType.append(optionStr);
    	});
	};
	
	//初始化合同状态列表
	function init_state_data(){
		$("#contactStates").empty();//清空
    	var contactStates = $("#contactStates");
    	var optionStr = "";
    	utils.post("getContractStates.ajax",{},function(data){
 			var selectData = data;
 			optionStr += '<option value="">请选择..</option>';
     		for(var i = 0;i < selectData.length;i++)
     		{
     			optionStr += '<option value="'+selectData[i].value+'">'+selectData[i].name+'</option>';
     		}
     		contactStates.append(optionStr);
    	});
	};
	var clickCallBack = function(obj){
		 console.log(obj.key + "---" + obj.value);
	 };
	//责任人输入联想
	 utils.post("getEmployees.ajax",null,function(d){
		var data = d;
     	$("#personLiable").cemAutocompleteInput(function(key){
  		var result = data.filter(function(a){
  			if(a.name.indexOf(key) >= 0 || a.code.indexOf(key) >= 0){
  				return true;
  			}
  		});
  		return result;
     	},clickCallBack);
   });
	//创建人输入联想
	 utils.post("getEmployees.ajax",null,function(d){
		var data = d;
     	$("#formulator").cemAutocompleteInput(function(key){
  		var result = data.filter(function(a){
  			if(a.name.indexOf(key) >= 0 || a.code.indexOf(key) >= 0){
  				return true;
  			}
  		});
  		return result;
     	},clickCallBack);
   });
});