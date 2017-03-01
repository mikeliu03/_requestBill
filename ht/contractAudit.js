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
	}
});

require(["common"]);

require(["utils", "jq_ui", "bootstrap", "jq_ztree","jq_ui_addon","jq_validata_msg", "datatables","jq_datepicker_zh_cn"], function(utils){
		var table_example = $("#table_example");
		var chk_all = $("#table_example_all");
		var table = table_example.DataTable({
		processing: true,		// 服务器端获取数据时，需添加
		serverSide: true,			// 服务器端获取数据时，需添加
		ajax: {
             url: "getContractList.ajax",
             type: "POST",
             data: function(d){
		 		var searchJson = _getSearchJson();
		 		var param = jQuery.extend(true, d, searchJson);
		 		param = jQuery.extend(true, param, {"auditState":"2"});
		 		return param;
		 	}
        },
		lengthChange: false,
		info:false,
		searching: true,
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
			{data: "code",width:"18%"},
			{data: "typeName",width:"8%"},
			{data: "name",width:"8%"},
			{data: "employeeName",width:"8%"},
			{data: "createTime",width:"8%"},
			{data: "startDate",width:"9%"},
			{data: "endDate",width:"14%"},
			{data: "amount",width:"14%"},
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
	init_select_data();
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
    	minDate: new Date($("#startTime").val()),
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
    	$("#code").val("");
    	$("#createStartTime").val("");
    	$("#createEndTime").val("");
    	$("#contactName").val("");
    	$("#formulator").val("");
    	$("#startTime").val("");
    	$("#startTimeEnd").val("");
    	$("#endTime").val("");
    	$("#endTimeEnd").val("");
    	$("#contactType").val("");
    });
	$("#search").click(function(){
		table.ajax.reload();
	});
	// 通过
	$("#contactPass").click(function(){
		var checked_elem = $("tbody :checkbox:checked", table_example);
		 setEnable(checked_elem, "3");//通过
	});
	// 退回
	$("#contactBack").click(function(){
		var checked_elem = $("tbody :checkbox:checked", table_example);
		setEnable(checked_elem, "4");//退回
	});
	function _getSearchJson(){
		var obj = {
				"code": $.trim($("#code").val()),
				"createTimeMin": $.trim($("#createStartTime").val()),
				"createTimeMax": $.trim($("#createEndTime").val()),
				"name": $.trim($("#contactName").val()),
				"formulator": $.trim($("#formulator").val()),
				"startDateMin": $.trim($("#startTime").val()),
				"startDateMax": $.trim($("#startTimeEnd").val()),
				"endDateMin": $.trim($("#endTime").val()),
				"endDateMax": $.trim($("#endTimeEnd").val()),
				"type": $.trim($("#contactType").val()),
			};

		var result = {};
		for(var e in obj){
			if(e && obj[e] && obj[e].trim()!== ","){
				result[e] = obj[e];
			}
		}
		return result;
	}
	/**
     * 退回或通过
     * checked_elem 选中的记录ID
     * 
     */
    function setEnable(checked_elem, enable) {
        var ids = [];
        if (checkChecked_elem()) {
            checked_elem.each(function () {
                ids.push(this.value);
            });
            // 发送异步请求
            utils.post("auditContract.ajax",{"ids": ids + "","action": enable+""},function(data){
            	$("#table_example_all").trigger('click');
            	  utils.cem_message("操作成功！");
                  table.draw();
            });
        }
    }
    function checkChecked_elem() {
        var checked_elem = $("tbody :checkbox:checked", table_example);

        if (checked_elem.length <= 0) {
            utils.cem_message("请选择一条记录。");
            return false;
        }
        return true;
    }
	//初始化合同类型列表
	function init_select_data(){
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
});