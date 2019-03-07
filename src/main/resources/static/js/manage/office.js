var page2;
$(function() {
	page2 = $("#page").CustomPage({
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
	/*$("#btnSearch").click(function() { 
		search(updatePage);
	});*/

});

//查询
function query(current) {
	initPage(current);
};

function initPage(current) {
	var fileds = []; //显示字段列表
	$("#tab1 thead tr th").each(function(i, v) { //针对tb表格下的所有th进行遍历
		if($(this).attr('name')) {
			fileds.push($(this).attr('name')); //返回当前td下的值
		}
	});
	var params = []; //查询条件
	params.push({
		name: "pageNum",
		value: current
	}); //当前页码
	params.push({
		name: "numPerPage",
		value: $("#numPerPage").val()
	}); //每页显示行数
	$.ajax({
		url: "/sys/sys_office/query",
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
					if('officeName' == fileds[x]) {
						tr += '<td><a class="tab_name" href="#" id="tab_name_' + obj['officeId'] + '" onclick="edit(' + obj['officeId'] + ')">' + ((obj[fileds[x]] == null) ? '-' : obj[fileds[x]]) + '</a></td>';
					} else {
						tr += "<td>" + ((obj[fileds[x]] == null) ? '-' : obj[fileds[x]]) + "</td>";
					}
				}
				tr += '<td><a href="#" class="del" onclick="deleteUser(' + obj['officeId'] + ')">删除</a></td>'
				tr += "</tr>";
				var $tr = $(tr);
				$tbody.append($tr);
			});
		},
		error: function(msg) {

		}
	});
};

function edit_title(str) {
	$("#user_edit").html(str);
}

//新增模块校验
function fnValidate(){

	var oUname = document.getElementById("officeName");
	var oError = document.getElementById("error_box");
	var isNotError = true;
	//名称
	 if(oUname.value=="" || oUname.value==null)
     {
		 isNotError = false;
		 oError.innerHTML = "机构名称不能为空";
         return;
     }else if(oUname.value.length > 20 || oUname.value.length < 2){
		oError.innerHTML = "机构名称长度必须在2~20位之间";
		isNotError = false;
		return;
		
	}	 
	fnSubmit();
}


function fnSubmit(){
//新增

		var params = $("#editForm").serializeArray();
		$.ajax({
			type: "POST",
			url: '/sys/sys_office/save',
			contentType: "application/x-www-form-urlencoded;charset=utf-8",
			data: params,
			success: function(res) {
				$('#message').html(res.msg);
				show("dialogMsg");
				if(res.retCode == 1) {
					hide('content1');
					query(1);
					page2.update({
						pageSize: $("#numPerPage").val(),
						count: $("#totalCount").val(),
						current: $("#pageNum").val()
					});
				}
			},
			error: function(error) {
				$('#message').html(res.msg);
				show("dialogMsg");
			}
		});
	

}

/*修改*/
function edit(officeId) {
	edit_title("修改分支机构");
	var tr = $("#tab_name_" + officeId).parent().parent(); //找到tr原色
	var td = tr.find("td"); //找到td元素
	var officeName = $(td[0]).find("#tab_name_" + officeId).text();
	//alert(officeName); //指定下标即可
	$("#officeId2").val(officeId);
	$("#officeName").val(officeName);
	show('content1');
};

function deleteUser(officeId) {
	$('#deleteBtn').bind('click', function() {
		$.ajax({
			type: "POST",
			url: '/sys/sys_office/delete',
			contentType: "application/x-www-form-urlencoded",
			data: "officeId=" + officeId,
			success: function(res) {
				hide('confirmMsg')
				$('#message').html(res.msg);
				if(res.retCode != 1) {
					show("dialogMsg");
				} else {
					query(1);
					page2.update({
						pageSize: $("#numPerPage").val(),
						count: $("#totalCount").val(),
						current: $("#pageNum").val()
					});
				}
			},
			error: function(error) {
				$('#message').html(res.msg);
				show("dialogMsg");
			}
		});
	});
	show('confirmMsg')
}