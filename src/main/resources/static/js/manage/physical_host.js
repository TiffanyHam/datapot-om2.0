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
	$("#btnSearch").click(function() {
		search(updatePage);
	});

});


//新增模块校验
function fnValidate(){

	var oUname = document.getElementById("hostName");
	var oError = document.getElementById("error_box");
	var oIp = document.getElementById('hostIp').value;
	var isNotError = true;
	//主机名验证
	 if(oUname.value=="" || oUname.value==null)
     {
		 isNotError = false;
		 oError.innerHTML = "主机名不能为空";
         return;
     }else if(oUname.value.length > 20 || oUname.value.length < 2){
		oError.innerHTML = "主机名长度必须在2~20位之间";
		isNotError = false;
		return;
		
	}
	//主机ip验证
	 if(oIp=="" || oIp==null)
     {
		 isNotError = false;
		 oError.innerHTML = "ip地址不能为空";
         return;
     }else if(isValidIP(oIp) == false){
		oError.innerHTML = "请输入正确的ip地址";
		isNotError = false;
		return;
	}
	fnSubmit();
}

function updateAttr(){
	 $("#hostName").removeAttr("disabled");
}

function fnSubmit(){
//新增
	 $("#physical_host_edit").html("新增物理主机信息");
		$.ajax({
			type: "POST",
			url: '/om/physical_host/save',
			contentType: "application/x-www-form-urlencoded;charset=utf-8",
			data: $("#editForm").serialize(),
			async: false,
			success: function(res) {

				console.log(res);
				if(res.retCode == "0") {
					$('#message').html(res.msg);
					show("dialogMsg");
				} else if(res.retCode == "1") {
					$('#message').html(res.msg);
					show("dialogMsg");
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
				$('#message').html(res.result);
				show("dialogMsg");
				/* query(1); */
			}
		}); 

}



function query(current) {
		var params = $("#searchForm").serializeArray(); //查询条件
		params.push({
			name: "pageNum",
			value: current
		}); //当前页码
		params.push({
			name: "numPerPage",
			value: $("#numPerPage").val()
		}); //每页显示行数
		
		queryInfos(params);
	
}
	
	function queryInfos(params){
		debugger
		
		$.ajax({
			type: "POST",
			url: '/om/physical_host/physical_host_query',
			contentType : "application/x-www-form-urlencoded;charset=utf-8",
		/*	dataType: "json",
			contentType: "application/json",*/
			data: params,
			async: false,
			success: function(data) {
				var hostType = getSelectVT("hostTypeReqs");
				var hostTagId = getSelectVT("hostTagIdReqs");
				var officeId = getSelectVT("officeIdReqs");
				
				console.log(hostType);
				console.log(hostTagId);
				console.log(officeId);
				var $tbody = $("#tab1 tbody");
				$tbody.empty(); //消空table
				var infos = data.result;
				$("#numPerPage").val(infos.numPerPage);
				$("#pageNum").val(infos.pageNum);
				$("#pageSum").val(infos.pageSum);
				$("#totalCount").val(infos.totalCount);
				var _body = "";
				$.each(infos.results, function(i, n) {
					_body += "<tr class='title'>"
					_body += " <input type='hidden' value='" + n.id + "' name='id'/>";
					_body += "<td> <a class='tab_name' href='#' id='" + n.id + "' onclick='editPhysical(" + n.id + ")' >" + n.hostName + "<a></td>";
					_body += "<td>" + n.hostIp + "</td>";
					_body += "<td>" + hostType[n.hostType] + "</td>";
				/*console.log(	hostTagId[n.hostTagId] );*/
				/*	_body += "<td>" + (hostTagId[n.hostTagId] == "undefined"?null:hostTagId[n.hostTagId]) + "</td>";*/
					_body += "<td>" + officeId[n.officeId] + "</td>";
					_body += "<td>" + (n.remarks == null ? "" : n.remarks) + "</td>";
				/*	_body += "<td><a class='del' onclick='delePhysical(" + n.id + ")'>删除</a></td>";*/
					_body += "</tr>";
				});
				var $tr = $(_body);
				$tbody.append($tr);
			},
			error: function(error) {
				$('#message').html("出现异常，请联系管理员或稍后重试");
				show("dialogMsg");
			}
		});
	}

function editPhysical(id) {
	debugger
	 $("#physical_host_edit").html("修改物理主机信息");
	 hostTypes = getSelectTV("hostTypeId"); // 主机类型
	/* hostTagIds = getSelectTV("hostTagIds"); // 主机标签id
*/	 officeIds = getSelectTV("officeIds"); // 分支机构id
	var tr = $("#" + id).parent().parent(); //找到tr原色
	var td = tr.find("td"); //找到td元素
	var hostName = $(td[0]).find(".tab_name").text();
	var hostIp = td[1].innerHTML;
	var hostType = hostTypes[td[2].innerHTML];
	/*var hostTagId = hostTagIds[td[3].innerHTML];*/
	var officeId = officeIds[td[3].innerHTML];
	var remarks = td[4].innerHTML;
	//alert(groupId); //指定下标即可
	$("#id").val(id);
	$("#hostName").attr("readonly","readonly");
	$("#hostName").val(hostName);
	$("#hostIp").val(hostIp);
	$("#hostTypeId").val(hostType);
	/*$("#hostTagIds").val(hostTagId);*/
	$("#officeIds").val(officeId);
	$("#remarks").val(remarks);
	show('content1');

}

function edit_title(str) {
	$("#physical_host_edit").html(str);
}

function delePhysical(id) {
	show('confirmMsg');
	$('#deleteBtn').bind('click', function() {
		$.ajax({
			type: "POST",
			url: '/om/physical_host/delete',
			async: false,
			contentType: "application/x-www-form-urlencoded;charset=utf-8",
			data: {
				"physicalHostsId": id
			},
			success: function(data) {
				hide('confirmMsg')
				$('#message').html(data.msg);
				query(1);
				page2.update({
					pageSize: $("#numPerPage").val(),
					count: $("#totalCount").val(),
					current: $("#pageNum").val()
				});
			},
			error: function(error) {
				$('#message').html(res.msg);
				show("dialogMsg");
			}
		});
	});

}