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


//注册表单验证
//$(validform());
//以上部分已经实现匿名函数的作用

function query(current) {

		classType = getSelectVT("example_one");
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
			type: "POST",
			url: '/om/snort_alert/snort_alert_query',
			async: false,
			contentType: "application/x-www-form-urlencoded;charset=utf-8",
			data: params,
			success: function(data) {
				classType = getSelectVT("example_one");
				var $tbody = $("#tab1 tbody");
				$tbody.empty(); //消空table
				var infos = data.result;
				$("#numPerPage").val(infos.numPerPage);
				$("#pageNum").val(infos.pageNum);
				$("#pageSum").val(infos.pageSum);
				$("#totalCount").val(infos.totalCount);
				var _body = "";
		         // collectTime, classtypeid,  protocol, srcIP:scrPort, dstIp:dstPort, dstCity(dstCountry), Msg						

				$.each(infos.results, function(i, n) {
					_body += "<tr class='title'>";
					_body += "<td><a class='tab_name' href='#' id='" + n.alertId + "' onclick='edit(" + n.alertId + ")'>" + n.collectTime + "</td>";
					/*_body += "<td>" + n.classtypeId + "</td>";*/
					_body += "<td>" + (classType[n.classtypeId] == null? "" : classType[n.classtypeId])  + "</td>";
					_body += "<td>" + n.protocol + "</td>";
					_body += "<td>" + (n.srcIp == null ? "" : n.srcIp) + "/" + (n.srcPort == null ? "" : n.srcPort)+ "</td>";
					_body += "<td>" + n.dstIp  + "/" + n.dstPort  + "</td>";
					_body += "<td>" + (n.dstCity == null ? "" : n.dstCity) + "("+(n.dstCountry == null ? "" : n.dstCountry)+")</td>";
					_body += "<td>" + n.msg + "</td>";
					_body += "</tr>";
				});
				var $tr = $(_body);
				$tbody.append($tr);
				
				
			},
			error: function(error) {
				$('#message').html(res.msg);
				show("dialogMsg");
			}
		});
	
}


/**
 * 导出数据
 */
function exportFile() {
	debugger;
	classType = getSelectVT("classtypeId1");
	var params = $("#searchForm").serializeArray(); //查询条件=
	/*$.post("/om/snort_alert/export", params)*/
	var collectTimeBegin = $("input[name='collectTimeBegin']").val();
	var collectTimeEnd = $("input[name='collectTimeEnd']").val();
	var classtypeId =$("#classtypeId1").val();
	var protocol =$("#protocol1").val();
	var srcIp =$("#srcIp1").val();
	var dstIp =$("#dstIp1").val();
	window.location="/om/snort_alert/export?collectTimeBegin="+collectTimeBegin+"&&collectTimeEnd="+collectTimeEnd+"&&classtypeId="+classtypeId+"&&protocol="+protocol+"&&srcIp="+srcIp+"&&dstIp="+dstIp;
}

function edit(id) {
	var params = $("#detail").serializeArray();
	classType = getSelectVT("classtypeId1");
	$.ajax({
		type: "POST",
		url: '/om/snort_alert/get_info',
		contentType: "application/x-www-form-urlencoded;charset=utf-8",
		data: {
			"alertId": id
		},
		success: function(data) {
			for(x in params) {
				if(params[x].name == 'classtypeId') {
					$("#detail").find("[name=" + params[x].name + "]").val(classType[data.result[params[x].name]]);
				} else {
					$("#detail").find("[name=" + params[x].name + "]").val(data.result[params[x].name]);
				}
			}
			show("content1");
			$(validform());
		},
		error: function(error) {
			$('#message').html(res.msg);
			show("dialogMsg");
		}
	});
}