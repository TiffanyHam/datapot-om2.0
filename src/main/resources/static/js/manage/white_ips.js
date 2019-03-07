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
//查询
function query(current) {
	initPage(current);
};

function validform() {  /*关键在此增加了一个return，返回的是一个validate对象，这个对象有一个form方法，返回的是是否通过验证*/  
	return $("#searchForm").validate({});
}
//注册表单验证
//$(validform());
//以上部分已经实现匿名函数的作用

function initPage(current) {
	if(validform()) {
		var fileds = []; //显示字段列表
		$("#tab1 thead tr th").each(function(i, v) { //针对tb表格下的所有th进行遍历
			if($(this).attr('name')) {
				fileds.push($(this).attr('name')); //返回当前td下的值
			}
		});

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
			url: "/om/white_ips/query",
			type: "POST",
			async: false,
			contentType: "application/x-www-form-urlencoded;charset=utf-8",
			data: params,
			//dataType : "text",           
			success: function(data) {
				var $tbody = $("#tab1 tbody");
				$tbody.empty(); //消空table
				$("#numPerPage").val(data.result.numPerPage);
				$("#pageNum").val(data.result.pageNum);
				$("#pageSum").val(data.result.pageSum);
				$("#totalCount").val(data.result.totalCount);

				$.each(data.result.results, function(i, obj) {

					var tr = "<tr>";
					for(x in fileds) {
						tr += "<td>" + ((obj[fileds[x]] == null) ? '-' : obj[fileds[x]]) + "</td>";
					}
					tr += "</tr>";
					var $tr = $(tr);
					$tbody.append($tr);

				});
				var config = {
					pageSize: infos.numPerPage,
					count: infos.totalCount,
					current: infos.pageNum,
					pageCount: infos.pageSum,
					callback: query
				}
			},
			error: function(msg) {

			}
		});
	} else {
		//校验不通过，什么都不用做，校验信息已经正常显示在表单上
	}
};