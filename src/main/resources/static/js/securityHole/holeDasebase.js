//全局变量
var colorObj='',
    lpageNum = 1,
    spageNum = 1,
    sisfirstLoad = true,
	isfirstLoad = true,
	level = '',
	aVulnName = '',
	aCveNo = '',
	aCnvdNo = '';


//消息弹窗
$(document).click(function() {
	$('.caret').removeClass("on");
	$(".searchList").hide();
});

//条件查询 hover
$("a.search").hover(function() {
	$(this).find("i.caret").css("visibility", "visible");
}, function() {
	$(this).find("i.caret").css("visibility", "hidden");
});

//条件查询select
function searchRisk(obj) {
	var e = window.event;
	e.stopPropagation();
	$this = $(obj);
	if($this.find('i').attr('class').indexOf('on') != -1) {
		$this.next('.searchList').css("display", "none");
		$this.find('i').removeClass("on");

	} else {
		$this.next('.searchList').css("display", "block");
		$this.find('i').addClass("on");
	}

}

//设备类型条件查询
$("#AssetsType ul li a").bind("click", function() {
	$(this).parents("#AssetsType").prev('a').find('span').text($(this).text());
	$(this).parents("#AssetsType").prev('a').find('i').removeClass("on");
	$(this).parents("#AssetsType").css("display", "none");

	assetsType = $(this).attr("value");
	
})

function closeWindow(obj) {
	$(obj).parents(".reports_detail").hide();
}

function removeMsg(obj) {
	$(obj).parents('.Success_Bomb').remove();
}

//消息弹窗
function msg(title, msg) {
	var str = '<div class="Success_Bomb" id="assetDialogMsg" style="display: block;">'+
				'<div class="upgradeBomb_content" style="border:1px solid #575b67;">'+
					'<p class="close"><img src="/static/img/close.png" width="18" height="17" onclick="removeMsg(this)"></p>'+
					'<h3 class="succ_title" title=""><span style="color:#9D9FA5;">'+title+'</span></h3>'+
					'<div class="">'+
						'<p class="succ_Desc" id="">'+msg+'</p>'+
						'<div class="btns">'+
							'<span class="saveBtn" onclick="removeMsg(this)">确认</span>'+
						'</div>'+
					'</div>'+
				'</div>'+
				'</div>';
	$("body").append(str);
}

//资产弹窗
function assetWin(title, msg) {
	var str = '<div class="Success_Bomb" id="assetWin" style="display: block;background: none;">'+
		'<div class="upgradeBomb_content" style="background: #020308;border: none;">'+
			'<p class="close"><img src="/static/img/close.png" width="18" height="17" onclick="removeMsg(this)"></p>'+
			'<h3 class="succ_title" style="border-bottom: 1px solid #222;"><span style="color:#9D9FA5;">'+title+'</span></h3>'+
			'<p class="assIconCon"><span class="sacanAnimate"></span><img src="static/img/assetSucess.png" width="65" class="fl"></p>'+
			'<div class="fl">'+
				'<p class="succ_Desc assetMsg" id="">'+msg+'</p>'+
				'<div class="btns" style="position: relative;top: 44px;">'+
					'<span class="saveBtn" onclick="removeMsg(this)">确认</span>'+
				'</div>'+
			'</div>'+
		'</div>'+
		'</div>';
	$("body").append(str);
	
}


//上传文件
$(".change").change(function(){
	
    var arrs=$(this).val().split('\\');
    var filename=arrs[arrs.length-1];
    $(".show_content").html(filename);
 }); 

//清空上传文件内容
function clearFileValue(){
	  $("#file").val(null);
	  $(".show_content").html("");
}
/*漏洞库更新*/
function updateConfirm(){
	 var file = document.getElementById("file");
	 if(file.value==""){
		  msg("漏洞库更新", "请选择上传文件!");
		  return;
	 }
	var form  = new FormData(document.getElementById("editForm"));//表单id
	$.ajax({
		url:'/om/vulnresource/import',
		type:'POST',
		contentType : "multipart/form-data",
		data: form,
		processData:false,
        contentType:false,
		success:function(data) {
			
			if (data.retCode == "1") {
				hide('holeUpdate');
				msg("漏洞库更新", "上传成功！");
				
			} else {
				hide('holeUpdate');
				msg("漏洞库更新", data.msg);
			}
			
		},
		error:function(err) {
			hide('holeUpdate');
			msg("漏洞库更新",'漏洞库更新：error');
		}
	})
}



/*漏洞库修改*/
function revise(obj){
	
	var id = $(obj).parents("tr").attr("data");
	$("#sHole input[name='vulnId']").val(id);
	$.ajax({
		url:'/om/vulnresource/detail',
		type:'GET',
		async:true,
		data: {
			vulnId:id
		},
		success:function(data) {
			$("#holetab1").empty();
			var result = data.result;
			var dLevel = assetTypeArr(result.level); //风险等级
			if (data.retCode == "1") {

				 var tab1 = "<tr>" +
                            "<td width='7%'>漏洞名称：</td>"+"<td width='93%'><span name='vulnName'>"+(result.vulnName == null ? '' : result.vulnName)+"</td>"+
					        "</tr>"+
					        "<tr>" +
		                    "<td width='7%'>CVE编号：</td>"+"<td width='93%'><span name='cveNo'>"+(result.cveNo == null ? '' : result.cveNo)+"</td>"+
							"</tr>"+
					        "<tr>" +
		                    "<td width='7%'>CNVD编号：</td>"+"<td width='93%'><span name=''>"+(result.cnvdNo == null ? '' : result.cnvdNo) +"</td>"+
		                    "</tr>"+
					        "<tr>" +
	                        "<td width='7%'>漏洞分类：</td>"+"<td width='93%'><span name='vulnType'>"+(result.vulnType == null ? '' : result.vulnType)+"</td>"+
					        "</tr>"+
					        "<tr>" +
		                    "<td width='7%'>风险等级：</td>"+"<td width='93%'><span class='color_one' name='level' style='background:"+ colorObj[dLevel]+"'>"+(dLevel == null ? '' : dLevel)+"</span></td>"+
		                    "</tr>"+
					        "<tr>" +
		                    "<td width='7%'>漏洞简介：</td>"+"<td width='93%'><textarea name='introduce' class='holeTxt'>"+(result.introduce == null ? '' : result.introduce)+"</textarea></td>"+
		                    "</tr>"+
							"<tr>"+
							"<td width='7%' style='height: 16px;line-height: 16px;'></td><td width='93%' style='height: 16px;line-height: 16px;'></td>" +
							"</tr>"+
							"<tr>" +
		                    "<td width='7%'>修复方案：</td>"+"<td width='93%'><textarea name='fixSolution' class='holeTxt'>"+(result.fixSolution == null ? '' : result.fixSolution)+"</textarea></td>"+
		                    "</tr>"+
							"<tr>" +
		                    "<td width='7%'>修复指南：</td>"+"<td><textarea name='fixStep' class='holeTxt'>"+(result.fixStep == null ? '' : result.fixStep)+"</textarea></td>"+
		                    "</tr>"+
							"<tr>"+
							"<td width='7%'></td>"+"<td width='93%'><p><span class='btn1 submit' id='btnEdit' style='width: 100px;margin: 10px 0 0 0;' onclick='fnValidate()'>提交</span></p></td>"+
							"</tr>"+
							"<tr>"+
							"<td width='7%'></td><td width='93%'><p id='error_box1' style='color: #a11a19;font-size: 14px;margin-top: 10px;'></p></td>"
							"</tr>";
		                    
		          $("#holetab1").append(tab1);
		          
				  show('holeModify');
				
			} else {
				msg("漏洞库修改", data.msg);
			}
			
		},
		error:function(err) {
			msg("漏洞库修改",'漏洞库修改：error');
		}
	})
	
}

/*漏洞库详情*/
function detailsHole(obj){
	var id = $(obj).parents("tr").attr("data");
	$.ajax({
		url:'/om/vulnresource/detail',
		type:'GET',
		async:true,
		data: {
			vulnId:id
		},
		success:function(data) {
			$("#holetab2").empty();
			var result = data.result;
			var dLevel = assetTypeArr(result.level); //风险等级
			if (data.retCode == "1") {

				 var tab2 = "<tr>" +
                            "<td width='7%'>漏洞名称：</td>"+"<td width='93%'>"+(result.vulnName == null ? '' : result.vulnName)+"</td>"+
					        "</tr>"+
					        "<tr>" +
		                    "<td width='7%'>CVE编号：</td>"+"<td width='93%'>"+(result.cveNo == null ? '' : result.cveNo)+"</td>"+
							"</tr>"+
					        "<tr>" +
		                    "<td width='7%'>CNVD编号：</td>"+"<td width='93%'>"+(result.cnvdNo == null ? '' : result.cnvdNo) +"</td>"+
		                    "</tr>"+
					        "<tr>" +
	                        "<td width='7%'>漏洞分类：</td>"+"<td width='93%'>"+(result.vulnType == null ? '' : result.vulnType)+"</td>"+
					        "</tr>"+
					        "<tr>" +
		                    "<td width='7%'>风险等级：</td>"+"<td width='93%'><span class='color_one' style='background:"+ colorObj[dLevel]+"'>"+(dLevel == null ? '' : dLevel)+"</span></td>"+
		                    "</tr>"+
					        "<tr>" +
		                    "<td width='7%'>漏洞简介：</td>"+"<td width='93%'>"+(result.introduce == null ? '' : result.introduce)+"</td>"+
		                    "</tr>"+
							"<tr>"+
							"<td width='7%' style='height: 16px;line-height: 16px;'></td><td width='93%' style='height: 16px;line-height: 16px;'></td>" +
							"</tr>"+
							"<tr>" +
		                    "<td width='7%'>修复方案：</td>"+"<td width='93%'>"+(result.fixSolution == null ? '' : result.fixSolution)+"</td>"+
		                    "</tr>"+
							"<tr>" +
		                    "<td width='7%'>修复指南：</td>"+"<td>"+(result.fixStep == null ? '' : result.fixStep)+"</td>"+
		                    "</tr>"+
							"<tr>";
		                    
		          $("#holetab2").append(tab2);
		          
				  show('holeDetail');
				
			} else {
				msg("漏洞库详情", data.msg);
			}
			
		},
		error:function(err) {
			msg("漏洞库详情",'漏洞库详情：error');
		}
	})
	
}

//校验
function fnValidate(){
	
	var sIntroduce = $("textarea[name='introduce']").val();
	var sFixSolution = $("textarea[name='fixSolution']").val();
	var sFixStep = $("textarea[name='fixStep']").val();
	var oError = document.getElementById("error_box1");
	var isNotError = true;
	//名称
	 if(sIntroduce =="" || sIntroduce ==null)
     {
		 isNotError = false;
		 oError.innerHTML = "漏洞简介不能为空";
         return;
     }else if(sFixSolution =="" || sFixSolution ==null){
		oError.innerHTML = "修复方案不能为空";
		isNotError = false;
		return;
		
	}else if(sFixStep =="" || sFixStep ==null){
		oError.innerHTML = "修复指南不能为空";
		isNotError = false;
		return;
		
	}
	 modifyInfo();
}

//修改漏洞详情  提交按钮
function modifyInfo(){
	
	var sVulnId = $("#sHole input[name='vulnId']").val();
	var sIntroduce = $("textarea[name='introduce']").val();
	var sFixSolution = $("textarea[name='fixSolution']").val();
	var sFixStep = $("textarea[name='fixStep']").val();
	
		$.ajax({
			url:'/om/vulnresource/update',
			type:'GET',
			async:true,
			data: {
				vulnId:sVulnId,
				introduce:sIntroduce,
				fixSolution:sFixSolution,
				fixStep:sFixStep
			},
			success:function(data) {
				if (data.retCode == "1") {
					
					msg("修改漏洞详情", "保存成功");
					hide('holeModify');
					getAssetListNewTbl();
					
				} else {
					msg("修改漏洞详情", data.msg);
				}
				
			},
			error:function(err) {
				msg("修改漏洞详情",'漏洞详情：error');
			}
		})
  }


//风险等级
function assetTypeArr(type) {
	
	 var x = "";
	 switch (type) {
	    case 0:
  	      x = "信息";
  	      break;
    	 case 1:
    	   x = "低危";
    	   break;
    	 case 2:
    	   x = "中危";
    	   break;
    	 case 3:
    	   x ="高危";
    	   break;
    	 case 4:
    	   x = "紧急";
    	   break;
	 }
	 
	 return x;
}


//风险等级
function getselectedInit() {
	
	 $.ajax({
			url:'/om/vuln/constants',
			type:'GET',
			async:true,
			data: {},
			success:function(data) {
				
				var result = data;
				if (result.retCode == "1") {
					
					//风险等级
					var vulnLevel  = data.result.vulnLevel;
					var typeLi = '';
					for (var i in vulnLevel) {
						typeLi += '<li><a href="javascript:;" value="'+i+'">'+vulnLevel[i]+'</a></li>'
					}
					$("#vulnLevel ul").append(typeLi);

					//风险等级条件查询
					$("#vulnLevel ul li a").bind("click", function() {
						
						$(this).parents("#vulnLevel").prev('a').find('i').removeClass("on");
						$(this).parents("#vulnLevel").css("display", "none");
						
						level = $(this).attr("value");
						spageNum = 1;
						sisfirstLoad = true;
						getAssetListNewTbl();
					})
					
					
				} else {
					msg("下拉表数据初始化：", result.msg);
				}
			},
			error:function(err) {
				msg('下拉表数据初始化：error');
			}
	 })
}

//查询按钮
$("#btnSearch").bind("click", function(){
	
	aVulnName = $("#vulnName").val();
	aCveNo = $("#cveNo").val();
	aCnvdNo = $("#cnvdNo").val();
	lpageNum = 1;
	isfirstLoad = true;
	getAssetListNewTbl();
})

//列表查询
function getAssetListNewTbl() {
	 $.ajax({
			url:'/om/vulnresource/search',
			type:'GET',
			async:true,
			cache:true,
			data:{
				pageSize: 10,
				pageNo: spageNum,
				vulnName:aVulnName,
				cveNo:aCveNo,
				cnvdNo: aCnvdNo,
				level: level
			},
			success:function(data) {
				
				//清空表数据
				$("#assetsTab tbody").empty();
				
				if (data.retCode == "1") {
					$('#load').fadeOut();
					var result = data.result.results;
					colorObj = {
							"高危": "#ca4c1d",
							"中危": "#b2a71d",
							"紧急": "#b61a32",
							"低危": "#656772",
							"信息": "#81858e"
						};
				    var tr = '';
				    if(result!= null){
      
						for (var i = 0; i < result.length; i ++) {
							
							var sLevel = assetTypeArr(result[i].level); //风险等级
							
							tr += '<tr data="'+result[i].vulnId+'">'+
								'<td>'+
								'<a href="javascript:;" class="tab_name">'+(result[i].cveNo == null ? '' : result[i].cveNo)+'</a></td>'+
								'<td>'+(result[i].cnvdNo == null ? '' : result[i].cnvdNo) +'</td>'+
								'<td>'+result[i].vulnName+'</td>'+
								'<td>'+result[i].vulnType+'</td>'+
								'<td style="padding-left:27px;"><span class="color_one" style="background:'+ colorObj[sLevel]+'">' +sLevel+'</span></td>'+
								'<td>'+(result[i].openTime == null ? '' : result[i].openTime)+'</td>'+ 
								'<td><a href="javascript:;" onclick="revise(this)">修改</a>&nbsp;&nbsp;&nbsp;&nbsp;'+
								'<a href="javascript:;" onclick="detailsHole(this)">详情</a></td>'+
							'</tr>';
						}
					
						$("#assetsTab tbody").append(tr);
				    }
					
					//分页
					
					var totalCount = data.result.totalCount; //总条数
					var numPerPage = data.result.numPerPage;//每页显示条目数
					var pageSum = data.result.pageSum;//总分页数
					var pageNum = data.result.pageNum;//当前索引
					
					//无数据不显示分页
					if(totalCount == 0){
						hide('page');
						show('no_info');
					}else{
						show('page');
						hide('no_info');
					}
					
					if (sisfirstLoad == true) {
						sisfirstLoad = false;
						var page_options = {
					            bootstrapMajorVersion:3, //对应的bootstrap版本
					            currentPage: pageNum, //当前页数，这里是用的EL表达式，获取从后台传过来的值
					            numberOfPages: numPerPage, //每页页数
					            totalPages:pageSum, //总页数，这里是用的EL表达式，获取从后台传过来的值
					            shouldShowPage:true,//是否显示该按钮
					            itemTexts: function (type, page, current) {//设置显示的样式，默认是箭头
					                switch (type) {
					                    case "first":
					                        return "<<";
					                    case "prev":
					                        return "<";
					                    case "next":
					                        return ">";
					                    case "last":
					                        return ">>";
					                    case "page":
					                        return page;
					                }
					            },
					            //分页点击事件
					            onPageClicked: function (event, originalEvent, type, page) {
					            	spageNum = page; //当前页目
					            	getAssetListNewTbl();
					            }
					    };
						$("#page #pageLimit").bootstrapPaginator(page_options);
						$("#page .countItem").text(totalCount);
					}
				
				
				} else {
					msg("查询-漏洞库列表", data.msg);
				}
				
			},
			error: function(err) {
				msg("查询-漏洞库列表", '查询-漏洞库列表：error');
			}
		  })
}




function init(){
	$('#load').fadeIn(); //loading加载
	
	getAssetListNewTbl();//列表查询
	
	getselectedInit();//风险等级
	
}
init();

