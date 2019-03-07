var page3;
$(function() {
	page3 = $("#page").CustomPage({
		pageSize: $("#numPerPage").val(),
		count: $("#totalCount").val(),
		current: $("#pageNum").val(),
		updateSelf: true,
		callback: query
	});

	function updatePage() {
		page3.update({
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

$("#btnSearch").click(function() {
	query(1);
});

function query(current) {
	debugger
	var param = $("#searchForm").serializeArray();
	param.push({
		name: "pageNum",
		value: current
	}); //当前页码
	param.push({
		name: "numPerPage",
		value: '10'	/*value: $("#numPerPage").val()*/
	}); //每页显示行数
	$.ajax({
		type: "POST",
		url: '/sys/group/query',
		contentType: "application/x-www-form-urlencoded;charset=utf-8",
		data: param,
		success: function(data) {
			debugger
			var $tbody = $("#tab1 tbody");
			$tbody.empty(); //消空table
			$("#numPerPage").val(data.result.pager.numPerPage);
			$("#pageNum").val(data.result.pager.pageNum);
			$("#pageSum").val(data.result.pager.pageSum);
			$("#totalCount").val(data.result.pager.totalCount);
			page3.update({
				pageSize: $("#numPerPage").val(),
				count: $("#totalCount").val(),
				current: $("#pageNum").val()
			});
			var _body = "";
			var infos = data.result.pager.results;
			$.each(infos, function(i, n) {
				_body += "<tr onclick='getInfosMenu(" + n.groupId + ")' id=\"" + n.groupId + "\">";
				_body += "<td><a class='tab_name' href='javascript:edit(" + n.groupId + ")'>" + n.groupName + "</a></td>";
				_body += "<td>" + (n.remarks == null ? "" : n.remarks) + "</td>";
				_body += "</tr>";
			});
			
			var $tr = $(_body);
			$tbody.append($tr);
		},
		error: function(error) {
			$('#message').html(error.msg);
			show("dialogMsg");
		}
	});
	}

	function initPage(current) {
		debugger
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
			value: '10' //value: $("#numPerPage").val()
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

//新增模块校验
function fnValidate(){

	var oUname = document.getElementById("groupName");
	var oError = document.getElementById("error_box");
	var isNotError = true;
	//名称
	 if(oUname.value=="" || oUname.value==null)
     {
		 isNotError = false;
		 oError.innerHTML = "名称不能为空";
         return;
     }else if(oUname.value.length > 20 || oUname.value.length < 2){
		oError.innerHTML = "名称长度必须在2~20位之间";
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
			url: '/sys/group/save',
			contentType: "application/x-www-form-urlencoded;charset=utf-8",
			data: params,
			success: function(res) {
				$('#message').html(res.msg);
				show("dialogMsg");
				if(res.retCode == 1) {
					hide('content1');
					query(1);
				}
			},
			error: function(error) {
				$('#message').html(error.msg);
				show("dialogMsg");
			}
		}); 
	
}



function getInfosMenu(data) {
	$("#tab1 tbody tr").css("background", "#0C0F20");
	$("#" + data).css("background", "#000");
	/* $("#"+data).addClass("cs");*/
	$("#group_id").val(data);
	var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
	$.ajax({
		type: "POST",
		url: '/sys/menu/get_menus_groupid',
		contentType: "application/x-www-form-urlencoded;charset=utf-8",
		data: {
			"groupId": data
		},
		success: function(data) {
			var infos = data.result;
			treeObj.checkAllNodes(false);
			if(infos.length == 0) {
				return;
			}
			$.each(data.result, function(i, n) {
				var node = treeObj.getNodeByParam("id", n.menuId);
				treeObj.selectNode(node);
				node.checked = true;
				treeObj.updateNode(node);
			});
		},
		error: function(error) {
			$('#message').html(res.msg);
			show("dialogMsg");
		}
	});
}

$("#save").on("click", function() {
	var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
	var nodes = treeObj.getCheckedNodes(true);
	console.log(nodes);
	var v = "";
	for(var i = 0; i < nodes.length; i++) {
		if(i == nodes.length - 1) {
			v += nodes[i].id;
			break;
		}
		v += nodes[i].id + ",";
	}
	var groupId = $("#group_id").val();
	$.ajax({
		type: "POST",
		url: '/sys/group/add_auth',
		contentType: "application/x-www-form-urlencoded;charset=utf-8",
		data: {
			"groupId": groupId,
			"menuIdStr": v,
		},
		success: function(data) {
			$('#message').html(data.msg);
			show("dialogMsg");
			query(1);
		},
		error: function(error) {
			$('#message').html(error.msg);
			show("dialogMsg");
		}
	});
});
function  editTitle(data){
	$("#group_role_name").html(data);
}
function edit(data) {
	editTitle("修改角色信息");
	var tr = $("#" + data); //找到tr原色
	var td = tr.find("td"); //找到td元素
	var groupName = $(td[0]).find(".tab_name").text();
	var remarks = td[1].innerHTML;
	console.log(groupName);
	$("#groupId").val(data);
	$("#groupName").val(groupName);
	$("#remarks").val(remarks);
	show('content1');
}