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
		var pay_detail= null;
		var table = table_example.DataTable({
		processing: true,		// 服务器端获取数据时，需添加
		serverSide: true,			// 服务器端获取数据时，需添加
		ajax: {
	         url: "getPayPlaneList.ajax",
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
		"scrollX":true,
		paging:false,
		"scrollY":350,
		columns: [
			{
				searchable : false,
				data : "id",
				render : function(data) {
					return "<input type='checkbox' value='" + data+ "' />";
				},
				orderable : false,
				width : "3%",
			},
			{data: "code"},
			{data: "typeName"},
			{data: "name"},
			{data: "employeeName"},
			{data: "deptName"},
			{data: "state",render : function(data) {
					if(data ==1){
						return "草稿";
					}else if(data ==2){
						return "审批中";
					}else if(data ==3){
						return "待处理";
					}else if(data ==4){
						return "确认";
					}else if(data ==5){
						return "变更中";
					}else if(data ==6){
						return "暂挂";
					}else if(data ==7){
						return "终止";
					}else{
						return "完成";
					}
				}
			},
			{data: "targetName"},
			{data: "startDate"},
			{data: "endDate"},
			{	data: "amount",
				render:function(data){
					return utils.get_format_number(data);
				}
			},
			{	data: "debtAmount",
				render:function(data){
					return utils.get_format_number(data);
				}
			},
			{	data: "reimburseAmount",
				render:function(data){
					return utils.get_format_number(data);
				}
			},
			{
				data: "allPayAmount",
				render:function(data){
					return utils.get_format_number(data);
				}
			},
			{
				data: "allPayAmount",
				render:function(data){
					return utils.get_format_number(data);
				}
			},
			{
				data: "payProgress",
				render:function(data){
					return utils.get_format_number(data);
				}
			}
		],
			"columnDefs": [{},//第一列弹出框绑定
	        {
	            "render": function (data, type, row, meta) {
	            	return "<a href='javascript:void(0)' class='pay-detail' data-payDetailId='"+row.id+"'>" + row.code + "</a>";
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
	init_status_data();
	init_type_data();
	
	
	$("#payStartTime").datepicker({
		minDate: new Date($("#payStartTime").val()),
	    changeYear: true,
	    changeMonth: true,
	    numberOfMonths: 1,
	    timeFormat: 'hh:mm:ss',
	    onClose: function (selectedDate) {
	        $("#payEndTime").datepicker("option", "minDate", new Date($("#payStartTime").val()));
	    }
	});
	$("#payEndTime").datepicker({
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
		$("#contactNo").val("");
		$("#payStartTime").val("");
		$("#payEndTime").val("");
		$("#contactName").val("");
		$("#creater").val("");
		$("#startTime").val("");
		$("#startTimeEnd").val("");
		$("#endTime").val("");
		$("#endTimeEnd").val("");
		$("#contactAccountMin").val("");
		$("#contactAccountMax").val("");
		$("#executeProgressStart").val("");
		$("#executeProgressEnd").val("");
		$("#contactType").val("");
		$("#provider").val("");
		$("#deptCode").val("");
		$("#dept").val("");
		$("#contactStatus").val("");
	});
	$("#search").click(function(){
		var minAccount = parseFloat($("#contactAccountMin").val()) >= 0 ? parseFloat($("#contactAccountMin").val()):-1;
		var maxAccount = parseFloat($("#contactAccountMax").val())  >= 0 ? parseFloat($("#contactAccountMax").val()):-1;
		var minPregress = parseFloat($("#contactAccountMin").val())  >= 0 ? parseFloat($("#contactAccountMin").val()):-1;
		var maxPregress = parseFloat($("#contactAccountMax").val())  >= 0 ? parseFloat($("#contactAccountMax").val()):-1;
		if((minAccount != "-1" && !(/^[0-9]{0,9}$/.test(minAccount))) || (maxAccount != "-1" &&!(/^[0-9]{0,9}$/.test(maxAccount)))){
			utils.cem_message('合同金额:请输入正确的金额值！');
			return false;
		} else if(maxAccount < minAccount){
			utils.cem_message('合同金额:金额区间值应由小到大！');
			return false;
		}else if((minPregress != "-1" && !(/^[0-9]{0,9}$/.test(minPregress))) || (maxPregress != "-1" && !(/^[0-9]{0,9}$/.test(maxPregress)))){
			utils.cem_message('执行进度:请输入正确的进度值！');
			return false;
		} else if(maxPregress < minPregress){
			utils.cem_message('执行进度:进度区间值应由小到大');
			return false;
		}
		table.ajax.reload();
	});
	$("#table_example").on('click','.pay-detail',function(){
		var rowId = $(this).attr('data-payDetailId');
		/*utils.post("getDebtReimburse.ajax",{"contractId":rowId},function(data){
			console.log(data);
		});*/
		init_pay_deatil_table(rowId);
		$("#payDetailShow").modal('show');
	});
	//供应商输入联想
	/* utils.post("queryNationality.ajax",null,function(d){
		var data = d;
	  	$("#provider").cemAutocompleteInput(function(key){
			var result = data.filter(function(a){
				if(a.name.indexOf(key) >= 0 || a.code.indexOf(key) >= 0){
					return true;
				}
			});
			return result;
	  	});
	});*/
	function _getSearchJson(){
		var obj = {
				"code": $.trim($("#contactNo").val()),
				"payStartTime": $.trim($("#payStartTime").val()),
				"payEndTime": $.trim($("#payEndTime").val()),
				"name": $.trim($("#contactName").val()),
				"creater": $.trim($("#creater").val()),
				"startTime": $.trim($("#startTime").val()),
				"startTimeEnd": $.trim($("#startTimeEnd").val()),
				"endTime": $.trim($("#endTime").val()),
				"endTimeEnd": $.trim($("#endTimeEnd").val()),
				"contactAccountMin": $.trim($("#contactAccountMin").val()),
				"contactAccountMax": $.trim($("#contactAccountMax").val()),
				"executeProgressStart": $.trim($("#executeProgressStart").val()),
				"executeProgressEnd": $.trim($("#executeProgressEnd").val()),
				"type": $.trim($("#contactType").val()),
				"provider": $.trim($("#provider").val()),
				"dept": $.trim($("#deptCode").val()),
				"state": $.trim($("#contactStatus").val())
			};
	
		var result = {};
		for(var e in obj){
			if(e && obj[e] && obj[e].trim()!== ","){
				result[e] = obj[e];
			}
		}
		return result;
	}
	//初始化合同状态列表
	function init_status_data(){
		$("#contactStatus").empty();//清空
    	var contactStates = $("#contactStatus");
    	var optionStr = "";
    	utils.post("getContractStates1.ajax",{},function(data){
 			var selectData = data;
 			optionStr += '<option value="">请选择..</option>';
     		for(var i = 0;i < selectData.length;i++)
     		{
     			optionStr += '<option value="'+selectData[i].value+'">'+selectData[i].name+'</option>';
     		}
     		contactStates.append(optionStr);
    	});
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
	}
	
	function init_pay_deatil_table(id){
		var param = {"contractId":id};
		var pay_detail_table = $("#pay_detail_table");
		if(pay_detail){
			pay_detail.settings()[0].ajax.data = param;
			pay_detail.ajax.reload();
		}else{
			pay_detail = pay_detail_table.DataTable({
				processing: true,		// 服务器端获取数据时，需添加
				serverSide: true,			// 服务器端获取数据时，需添加
				ajax: {
			         url: "getDebtReimburse.ajax",
			         type: "POST",
			         data: param
			    },
				lengthChange: false,
				info:false,
				searching: true,
				columns: [
					{data: "type"},
					{data: "payAmount"},
					{data: "createTime"},
				],
				order: [[1, 'asc']]
			});
		}
	};
	var clickCallBack = function(obj){
		 console.log(obj.key + "---" + obj.value);
	 };
	//供应商输入联想
	 utils.post("getSupplierList.ajax",null,function(d){
		var data = d;
    	$("#provider").cemAutocompleteInput(function(key){
 		var result = data.filter(function(a){
 			if(a.name.indexOf(key) >= 0 || a.code.indexOf(key) >= 0){
 				return true;
 			}
 		});
 		return result;
    	},clickCallBack);
  });
	//部门输入联想
	 utils.post("getOrgs.ajax",null,function(d){
		var data = d;
    	$("#dept").cemAutocompleteInput(function(key){
 		var result = data.filter(function(a){
 			if(a.name.indexOf(key) >= 0 || a.code.indexOf(key) >= 0){
 				return true;
 			}
 		});
 		return result;
    	},clickCallBack);
  });
});