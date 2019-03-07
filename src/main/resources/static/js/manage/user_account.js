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

var statusPwd=1;
function pwdStatus(data){
	statusPwd=data;
	 $("#_password").show();	
	 $("#con_password").show();	
}
//查询
function query(current) {
	accountStatus = getSelectVT("accountStatus2"); //用户状态
	groupId = getSelectVT("groupId2"); //角色
	accessSys = getSelectVT("accessSys2"); //可访问系统
	isAdmin = getSelectVT("isAdmin2"); //是否主管人员
	officeId = getSelectVT("officeId2"); //所属分支机构

	initPage(current);
};

function initPage(current) {
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
		url: "/sys/account/accountQuery",
		type: "POST",
		async: false,
		contentType: "application/x-www-form-urlencoded;charset=utf-8",
		data: params,
		//dataType : "text",           
		success: function(data) {
			var $tbody = $("#tab1 tbody");
			$tbody.empty(); //消空table
			var infos = data.result;
			$("#numPerPage").val(infos.numPerPage);
			$("#pageNum").val(infos.pageNum);
			$("#pageSum").val(infos.pageSum);
			$("#totalCount").val(infos.totalCount);
			$.each(data.result.results, function(i, obj) {

				var tr = "<tr>";
				for(x in fileds) {
					if('accountStatus' == fileds[x]) {
						tr += "<td>" + accountStatus[obj[fileds[x]]] + "</td>";
					} else if('groupId' == fileds[x]) {
						tr += "<td>" + (groupId[obj[fileds[x]]] == null ? "-" : groupId[obj[fileds[x]]]) + "</td>";
					} else if('accessSys' == fileds[x]) {
						tr += "<td>" + accessSys[obj[fileds[x]]] + "</td>";
					} else if('isAdmin' == fileds[x]) {
						tr += "<td>" + isAdmin[obj[fileds[x]]] + "</td>";
					} else if('officeId' == fileds[x]) {
						tr += "<td>" + (officeId[obj[fileds[x]]]==null?"-":officeId[obj[fileds[x]]]) + "</td>";
					} else if('actualName' == fileds[x]) {
						tr += '<td><a class="tab_name" href="#" id="' + obj['userId'] + '" onclick="edit(' + obj['userId'] + ')">' + ((obj[fileds[x]] == null) ? '-' : obj[fileds[x]]) + '</a></td>';
					} else {
						tr += "<td>" + ((obj[fileds[x]] == null) ? '-' : obj[fileds[x]]) + "</td>";
					}
				}
				tr += '<td style="text-align: center;"><a style="margin-right:5px;" href="#" class="del" onclick="deleteUser(' + obj['userId'] + ')">删除</a>';
				tr += '<a href="#" class="del" onclick="updatePwd(' + obj['userId'] + ',\''+obj['userName']+'\')">修改密码</a></td>'
				tr += "</tr>"
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

function unbind_userName() {
	$("#userName2").removeAttr("readonly"); 
}

//新增模块校验
function fnValidate(){

	var oUname = document.getElementById("actualName");
	var oUname2 = document.getElementById("userName2");
	var oError = document.getElementById("error_box");
	var password1 = document.getElementById("password").value;
	var password2 = document.getElementById("conPassword").value;
	var isNotError = true;
	//员工姓名验证
	 if(oUname.value=="" || oUname.value==null)
     {
		 isNotError = false;
		 oError.innerHTML = "员工姓名不能为空";
         return;
     }else if(oUname.value.length > 20 || oUname.value.length < 2){
		oError.innerHTML = "员工姓名长度必须在2~20位之间";
		isNotError = false;
		return;
		
	}
	//主机ip验证
	 if(oUname2.value == "" || oUname2.value == null)
     {
		 isNotError = false;
		 oError.innerHTML = "登录用户名不能为空";
         return;
     }else if(oUname2.value.length > 20 || oUname2.value.length < 2){
		oError.innerHTML = "登录用户名长度必须在2~20位之间";
		isNotError = false;
		return;
	}
	
	 if(statusPwd !=0 ){
	//密码验证
		 if(password1 == "" || password1 == null){		 
			 oError.innerHTML = "密码不能为空";
			 isNotError = false;
	         return;
	      }else if(isValidPassword(password1) == false){
	    	oError.innerHTML = "密码格式不正确,请重新输入(6到15位字母或数字)";
			isNotError = false;
			return;
		 }
		 //确认密码
		 if(password2 == "" || password2 == null){
			 isNotError = false;
			 oError.innerHTML = "请确认密码";
	         return;
		  }else if(password2 != password1){
			oError.innerHTML = "两次输入密码不一致,请重输";
			isNotError = false;
			return;
		 }
	 }
	
	fnSubmit();
}
/*var mustFirst = 0;
function validform() {   关键在此增加了一个return，返回的是一个validate对象，这个对象有一个form方法，返回的是是否通过验证  
	return $("#editForm").validate({
		rules: {
			accountStatus: {
				required: true,
			},
			isAdmin: {
				required: true,
			},
			accessSys: {
				required: true,
			},
			groupId: {
				required: true,
			},
			officeId: {
				required: true,
			},
			actualName: {
				maxlength: 20
			},
			userName: {
				maxlength: 20
			}
		},
		messages: {
			accountStatus: {
				required: "请选择选项",
			},
			isAdmin: {
				required: "请选择选项",
			},
			accessSys: {
				required: "请选择选项",
			},
			groupId: {
				required: "请选择选项",
			},
			officeId: {
				required: "请选择选项",
			},
			actualName: {
				maxlength: "长度不能大于20个字符"
			},
			userName: {
				maxlength: "长度不能大于20 个字符"
			}
		},
		 highlight: function(element, errorClass) {
				
		     $(element).addClass(errorClass);
	
		     $(element.form).find("input" + element.id).addClass(errorClass);
	
		  },
	
		  unhighlight: function(element, errorClass) {
	
		     $(element).removeClass(errorClass);
	
		     $(element.form).find("label[for=" + element.id + "]").removeClass(errorClass);
	
		  },
		  showErrors: function(errorMap, errorList) {

		        $("#summary").html("Your form contains " + this.numberOfInvalids()

		               + " errors, see details below.");

		        this.defaultShowErrors();

		   },
		groups:{
		    username:"actualName userName"
		},
		errorPlacement: function(error,element) {
			//debugger
			console.log(element);
			$("#editForm input").removeClass("borderRED");
			element.addClass("borderRED");
			$("#errorMsg").text(error[0].innerHTML);
			
			if(element.attr("name") == "actualName" || element.attr("name") == "userName")  {    
				error.insertAfter("#errorMsg");//查找到符合groups封好的属性组，就添加到某个div下方
			} else  {
				error.insertAfter(element);//否则直接插入到当前元素后面
			}
			
			
		  },
		  debug:true//开启调试不发送表单
	 
	});
		

	 
}*/
//注册表单验证
//$(validform());
//以上部分已经实现匿名函数的作用
//新增
function fnSubmit(){
//$('#btnEdit').bind('click', function() {
//	if(validform().form()) {  //通过表单验证，以下编写自己的代码
		var params = $("#editForm").serializeArray();
		$.ajax({
			type: "POST",
			url: '/sys/account/save',
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
	/*} else {   //校验不通过，什么都不用做，校验信息已经正常显示在表单上

		 }*/
//});

/*修改*/
function edit(userId) {
	edit_title("修改用户信息");
	statusPwd=0;
	 $("#_password").hide();	
	 $("#con_password").hide();
	accountStatusTV = getSelectTV("accountStatus2"); //用户状态
	groupIdTV = getSelectTV("groupId2"); //角色
	accessSysTV = getSelectTV("accessSys2"); //可访问系统
	isAdminTV = getSelectTV("isAdmin2"); //是否主管人员
	officeIdTV = getSelectTV("officeId2"); //所属分支机构

	var tr = $("#" + userId).parent().parent(); //找到tr原色
	var td = tr.find("td"); //找到td元素

	var actualName = $(td[0]).find(".tab_name").text();
	var userName = td[1].innerHTML;
	var accountStatus = accountStatusTV[td[2].innerHTML];
	var groupId = groupIdTV[td[3].innerHTML];
	var isAdmin = isAdminTV[td[4].innerHTML];
	var accessSys = accessSysTV[td[5].innerHTML];
	var officeId = officeIdTV[td[6].innerHTML];

	$("#userName2").attr({readonly: "true"}); 
	//alert(groupId); //指定下标即可
	$("#userId2").val(userId);
	$("#actualName").val(actualName);
	$("#userName2").val(userName);
	$("#accountStatus2").val(accountStatus);
	$("#groupId2").val(groupId);
	$("#isAdmin2").val(isAdmin);
	$("#accessSys2").val(accessSys);
	$("#officeId2").val(officeId);
	show('content1');
	//$(validform());
};

function deleteUser(userId) {
	$('#deleteBtn').bind('click', function() {
		$.ajax({
			type: "POST",
			url: '/sys/account/delete',
			async: false,
			contentType: "application/x-www-form-urlencoded",
			data: "userId=" + userId,
			success: function(res) {
				hide('confirmMsg')
				$('#message').html(res.msg);
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
	show('confirmMsg')
}


function updatePwd(userId,userName){
	$("#userId3").val(userId);
	$("#userName3").val(userName);
	show('content2');
}

function fnValidatePwd(){
	var password1 = document.getElementById("up_pwd").value;
	var password2 = document.getElementById("up_con_pwd").value;
	var oError = document.getElementById("error_pwd_box");
	var isNotError = true;
	//密码验证
	 if(password1 == "" || password1 == null){		 
		 oError.innerHTML = "密码不能为空";
		 isNotError = false;
         return;
     }else if(isValidPassword(password1) == false){
    	oError.innerHTML = "密码格式不正确,请重新输入(6到15位字母或数字)";
		isNotError = false;
		return;
	}
	 //确认密码
	 if(password2 == "" || password2 == null){
		 isNotError = false;
		 oError.innerHTML = "请确认密码";
        return;
	  }else if(password2 != password1){
		oError.innerHTML = "两次输入密码不一致,请重输";
		isNotError = false;
		return;
	}
	 pwdSubmit();
}

function pwdSubmit(){
	
	var params = $("#editForm2").serializeArray();
	$.ajax({
		type: "POST",
		url: '/sys/account/upd_user_pwd',
		contentType: "application/x-www-form-urlencoded;charset=utf-8",
		data: params,
		success: function(res) {
			$('#message').html(res.msg);
			show("dialogMsg");
			if(res.retCode == 1) {
				hide('content2');
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
