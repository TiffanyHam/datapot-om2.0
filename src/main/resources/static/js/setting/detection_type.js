var page2;
$(function() {	
		page2 = $("#page").CustomPage({
        pageSize: $("#numPerPage").val(),
        count: $("#totalCount").val(),
        current: $("#pageNum").val(),
        updateSelf: true,
        callback: query
    });
	
	function updatePage(){	
		page2.update({
		  pageSize: $("#numPerPage").val(),
		  count: $("#totalCount").val(),
		  current: $("#pageNum").val()
		});
	}
	function search(callback){
		query(1);
		callback();
	}
	//ajax提交  
	$("#btnSearch").click(function() { 
		search(updatePage);
	});
	
});
	    
//查询
function query(current){
    initPage(current);
};

function initPage(current){
	stageTV = getSelectVT("stage"); //威胁阶段
	prioityTV = getSelectVT("priority2");//所属分支机构
	var fileds = [];//显示字段列表
	$("#tab1 thead tr th").each(function(i, v){    //针对tb表格下的所有th进行遍历
		if($(this).attr('name')){
			fileds.push($(this).attr('name'));//返回当前td下的值
		}
	});
  var params = $("#searchForm").serializeArray(); //查询条件
  params.push({name:"pageNum",value:current});//当前页码
  params.push({name:"numPerPage",value:$("#numPerPage").val()});//每页显示行数
  $.ajax({
    url : "/om/detection_type/query",
    type : "POST",
    contentType : "application/x-www-form-urlencoded;charset=utf-8",
    data : params,
    async: false,
    //dataType : "text",           
    success : function(data) {
    	debugger
 	   var $tbody = $("#tab1 tbody");
 	   $tbody.empty();//消空table
 	   var infos =data.result;
	   $("#numPerPage").val(infos.numPerPage);
	   $("#pageNum").val(infos.pageNum);
	   $("#pageSum").val(infos.pageSum);
	   $("#totalCount").val(infos.totalCount);
	   var _body="";
 	   $.each(infos.results, function(i, obj) {
 		  _body += "<tr>";
 		  _body += "<td><a class='tab_name' href='#' id='"+obj.id+"' onclick='edit("+obj.id+","+obj.threatLowScore+","+obj.threatHighScore+")'>"+obj.typeEn+"</a></td>";
		  _body += "<td>"+obj.typeZh+"</td>";
		  _body += "<td>"+stageTV[obj.stage]+"</td>";
		  _body += "<td>"+prioityTV[obj.priority]+"</td>";// ${detType.certaintyLowScore!}-${detType.certaintyHighScore!}
		  _body += "<td>"+obj.certaintyLowScore+"~"+obj.certaintyHighScore+"</td>";
		  _body += "<td><a class='del' onclick='deleteUser("+obj.id+")'>删除</a></td>";
 		  _body += "</tr>";
 		 });
 	   var $tr = $(_body);
	   $tbody.append($tr);
    },
    error:function(msg){
    }
 });     
};  

function edit_title(str){
	$("#user_edit").html(str);
}

//新增模块校验
function fnValidate(){

	var oUname = document.getElementById("typeEn2").value;
	var oUname2 = document.getElementById("typeZh2").value;
	var oError = document.getElementById("error_box");
	var isNotError = true;
	//主机名验证
	 if(oUname =="" || oUname ==null)
     {
		 isNotError = false;
		 oError.innerHTML = "类型英文名不能为空";
         return;
     }else if(oUname.length > 50 || oUname.length < 2){
		oError.innerHTML = "类型英文名长度必须在2~50位之间";
		isNotError = false;
		return;
	}
	 if(oUname2 == "" || oUname2 == null)
     {
		 isNotError = false;
		 oError.innerHTML = "类型中文名不能为空";
         return;
     }else if(oUname2.length > 20 || oUname2.length < 2){
		oError.innerHTML = "类型中文名长度必须在2~20位之间";
		isNotError = false;
		return;
	}
	
	fnSubmit();
}
/*else if(isValidEnglish(oUname) == false){
	oError.innerHTML = "类型英文名只能输入字母、数字和'-'符号";
	isNotError = false;
	return;
}*/

function fnSubmit(){
//新增
  var params = $("#editForm").serializeArray(); 
  $.ajax({
    type : "POST",  
    url:'/om/detection_type/save',
    contentType : "application/x-www-form-urlencoded;charset=utf-8",
    data : params,
    success:function(res){
      $('#message').html(res.msg);
      show("dialogMsg");
      if(res.retCode==1){
	      hide('content1');
	      query(1);
	      page2.update({
				pageSize: $("#numPerPage").val(),
				count: $("#totalCount").val(),
				current: $("#pageNum").val()
			});
      }
    },
	error:function(error){
	  $('#message').html(error.msg);
	  show("dialogMsg");             
    }
   });
}
  
/*修改*/
function edit(id,threatLow,threatHigh) {
	  edit_title("修改威胁类型信息");
	  priorityTV = getSelectTV("priority2");//所属分支机构
	  stageTV = getSelectTV("stage");
		var tr = $("#" + id).parent().parent(); //找到tr原色
		var td = tr.find("td"); //找到td元素
		
		var typeEn= $(td[0]).find(".tab_name").text();
		var typeZh = $(td[1]).text();
		var stage = stageTV[$(td[2]).text()];
		var priority = priorityTV[$(td[3]).text()];
		var certainty = $(td[4]).text();
		debugger
		$("#id").val(id);
		$("#typeEn2").val(typeEn);
		$("#typeZh2").val(typeZh);
		$("#stage").val(stage);
		$("#priority2").val(priority);
		$("#certaintyLowScore").val(certainty.split("~")[0]);
		$("#certaintyHighScore").val(certainty.split("~")[1]);
		$("#threatLowScore").val(threatLow);
		$("#threatHighScore").val(threatHigh);
		show('content1');
};

function deleteUser(id){
	$('#deleteBtn').bind('click',function(){
		$.ajax({
		     type : "POST",  
		     url:'/om/detection_type/delete',
		     contentType : "application/x-www-form-urlencoded",
		     data :"id="+id,
		     success:function(res){
		    	hide('confirmMsg')
		        $('#message').html(res.msg);
		        query(1);
		        page2.update({
					pageSize: $("#numPerPage").val(),
					count: $("#totalCount").val(),
					current: $("#pageNum").val()
				});
		      },
				error:function(error){
					$('#message').html(error.msg);
					show("dialogMsg"); 	 	
		      }
		  });
	});
	show('confirmMsg')
}