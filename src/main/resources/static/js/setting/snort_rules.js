$(function() {	
	var page2 = $("#page").CustomPage({
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
	    
function query(current){
	var params = $("#searchForm").serializeArray(); //查询条件
	  	params.push({name:"pageNum",value:current});//当前页码
	  	params.push({name:"numPerPage",value:$("#numPerPage").val()});//每页显示行数
		  $.ajax({
			    type : "POST",  
			    url:'/om/snort_rule/query',
			    async: false,
			    contentType : "application/x-www-form-urlencoded;charset=utf-8",
			    data : params,
			    success:function(data){
			    	console.log(data);
			    	  var $tbody = $("#tab1 tbody");
			  	    $tbody.empty();//消空table
			    	  var infos =data.result;
			    	  $("#numPerPage").val(infos.numPerPage);
			    	  $("#pageNum").val(infos.pageNum);
			    	  $("#pageSum").val(infos.pageSum);
			    	  $("#totalCount").val(infos.totalCount);
			  	    var _body="";
				    	$.each(infos.results,function(i,n){
					    		_body += "<tr class='title'>";
									_body += "<td width='5%'>";
									_body += "<a class='tab_name' href='javascript:edit(" + n.sid + ");'>" + n.sid + "</a>";
									_body += "</td>";
									_body += "<td width='5%'>" + n.score + "</td>";
									_body += "<td width='5%'>" + n.action + "</td>";
									_body += "<td width='5%'>" + n.protocol + "</td>";
									_body += "<td width='10%'>" + n.srcIp + "</td>";
									_body += "<td width='5%'>" + n.srcPort + "</td>";
									_body += "<td width='5%'>" + n.flow + "</td>";
									_body += "<td width='5%'>" + n.destIp + "</td>";
									_body += "<td width='15%'>" + n.destPort + "</td>";
									_body += "<td width='15%'>" + n.classtype + "</td>";
									_body += "<td width='25%'>" + n.msg + "</td>";
									_body += "</tr>";
				    	});
				    	var $tr = $(_body);
			    		 $tbody.append($tr);
			    },
				error:function(error){
					$('#message').html(error.msg);
					show("dialogMsg");
			    }
			   });
	} 



function edit(id){
	$.ajax({
	    type : "POST",  
	    url:'/om/snort_rule/get_info',
	    contentType : "application/x-www-form-urlencoded;charset=utf-8",
	    data : {"sid":id},
	    success:function(data){
	    	 var param = $("#editForm").serializeArray();
	    	 $.each(param,function(i,n){
	    		 $("#editForm").find("[name="+n.name+"]").val(data.result[n.name]);
	    	}); 
	    	 show("content1");
	    },
		error:function(error){
			$('#message').html(error.msg);
			show("dialogMsg");
	    }
	   });
	
}

$(".change").change(function(){
    var arrs=$(this).val().split('\\');
    var filename=arrs[arrs.length-1];
    $(".show_content").html(filename);
		 }); 
	  $("#upload_file").on("click",function(){
		  submitForm();
	  });
	  
	  //挂起按钮
	  function submitForm(){
		  //var params = $("#uploadFile").serializeArray();
		 var file = document.getElementById("file");
		 console.log(file.value);
		 if(file.value==""){
			 $('#message').html("请选择上传文件！");
			 $('#load').fadeOut();
			  show("dialogMsg");
			  return;
		 }
		  var form  = new FormData(document.getElementById("uploadFile"));//表单id
		  debugger
		  $("#upload_file").off("click");
		  $('#load').fadeIn();
		  $.ajax({
			    type : "POST",  
			    url:'/om/snort_rule/save',
			    contentType : "multipart/form-data",
			    data : form ,
			    processData:false,
               contentType:false,
			    success:function(data){
			    	debugger
			    	 $('#load').fadeOut();
			    	if(data.result==1){
			    	hide("upload_photos");
			    	$('#message').html(data.msg);
					  show("dialogMsg");
					  query(1);
			    	}else{
			    		hide("upload_photos");
			    		$('#message').html(data.msg);
						  show("dialogMsg");
			    	}
					  $("#upload_file").on("click",function(){
						 $('#load').fadeIn();
						  submitForm();
					  });
			    },
				error:function(error){
					$('#load').fadeOut();
					$('#message').html(error.msg);
					show("dialogMsg");
					 $("#upload_file").on("click",function(){
						  $('#load').fadeIn();
						  submitForm();
					  });
			    }
			   });
	  }
	  function clearFileValue(){
		  $("#file").val(null);
		  $(".show_content").html("");
	  }