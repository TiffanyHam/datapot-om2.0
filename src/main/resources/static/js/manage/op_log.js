$(function() {
	var page2 = $("#page").CustomPage({
		pageSize: $("#numPerPage").val(),
		count: $("#totalCount").val(),
		current: $("#pageNum").val(),
		updateSelf: true,
		callback: query
	});

	function updatePage() {
		page2.update({
			pageSize: $("#numPerPage").val(),
			count: $("#totalCount").val(),
			current: $("#pageNum").val()
		});
	}

	function search(callback) {
		query(1);
		callback();
	}
	//ajax提交  
	$("#btnSearch").click(function() {
		search(updatePage);
	});

});

window.$logFileds = [{
		name: "userName",
		text: "用户名"
	},
	{
		name: "logDate",
		text: "操作时间"
	},
	{
		name: "logIp",
		text: "操作IP"
	},
	{
		name: "procedureCode",
		text: "操作方法"
	},
	{
		name: "proExecuteTime",
		text: "程序执行时间"
	},
	{
		name: "dbExecuteTime",
		text: "DB执行时间"
	},
	{
		name: "resultCode",
		text: "处理结果"
	},
	{
		name: "parameter",
		text: "操作参数"
	}
];

window.$loginFileds = [{
		name: "userName",
		text: "用户名"
	},
	{
		name: "logDate",
		text: "登录/登出时间"
	},
	{
		name: "logType",
		text: "登录/登出类型"
	},
	{
		name: "logIp",
		text: "操作IP"
	},
	{
		name: "isSuccess",
		text: "是否成功"
	},
	{
		name: "resultMsg",
		text: "操作信息"
	}
];

/*查询*/
function query(current) {
	var reqUrl; //请求URL
	var logType; //日志类型
	var $fileds; //表头列表
	var params = $("#searchForm").serializeArray(); //查询条件

	for(var i = 0; i < params.length; i++) { //遍历查询条件
		if(params[i].name == "logType") {
			logType = params[i].value; //得到logType的值
		}
	}

	if(1 == logType) {
		reqUrl = "/sys/log/log_query";
		$fileds = $logFileds;
	} else if(2 == logType) {
		reqUrl = "/sys/login_log/login_query";
		$fileds = $loginFileds;
	}
	/*渲染表头*/
	logRenderTableHead($fileds);

	var params = $("#searchForm").serializeArray(); //查询条件
	params.push({
		name: "pageNum",
		value: current
	}); //当前页码
	params.push({
		name: "numPerPage",
		value: $("#numPerPage").val()
	}); //每页显示行数

	$.ajax({
		url: reqUrl,
		type: "POST",
		async: false,
		contentType: "application/x-www-form-urlencoded;charset=utf-8",
		data: params,
		//dataType : "text",           
		success: function(data) {
			if("1" == data.retCode) {
				var datas = data.result.results;
				var infos = data.result;
				$("#numPerPage").val(infos.numPerPage);
				$("#pageNum").val(infos.pageNum);
				$("#pageSum").val(infos.pageSum);
				$("#totalCount").val(infos.totalCount);
				//渲染日志数据
				renderData(datas, $fileds);
			}
		},
		error: function(msg) {

		}
	});
};
/*渲染表头*/
function logRenderTableHead($fileds) {
	var $thead = $("#tab1 thead");
	$thead.empty(); //消空thead
	
	var $tr = "<tr>";
	for(x in $fileds) {
		$tr += "<th name='" + $fileds[x].name + "'>" + $fileds[x].text + "</th>"
	}
	$tr += "</tr>";
	$thead.append($tr);
}

/*渲染日志数据*/
function renderData(datas, $fileds) {
	var $tbody = $("#tab1 tbody");
	$tbody.empty(); //消空table
	logTypesVT = getSelectVT("logTypes"); //登录类型
	boolStatusVT = getSelectVT("boolStatus");
	
	$.each(datas, function(i, obj) {
		var $tr = "<tr>";
		for(x in $fileds) {
			if('logType' == $fileds[x].name) {
				$tr += "<td>" + ((obj[$fileds[x].name] == null) ? '-' : logTypesVT[obj[$fileds[x].name]]) + "</td>";
			} else if('isSuccess' == $fileds[x].name) {
				$tr += "<td>" + ((obj[$fileds[x].name] == null) ? '-' : boolStatusVT[obj[$fileds[x].name]]) + "</td>";
			}else if('logDate' == $fileds[x].name) {
				$tr += "<td>" + ((obj[$fileds[x].name] == null) ? '-' : strToDateTime(obj[$fileds[x].name])) + "</td>";
			} else {
				$tr += "<td>" + ((obj[$fileds[x].name] == null) ? '-' : obj[$fileds[x].name]) + "</td>";
			}

		}
		$tr += "</tr>";
		$tbody.append($tr);
	});
};