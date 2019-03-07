//全局变量
var colorObj='',
    lpageNum = 1,
    spageNum = 1,
    sisfirstLoad = true,
	isfirstLoad = true,
	condition = '',
	officeId = '',
	level = '',
	fixStatus = '';


//消息弹窗
$(document).click(function() {
	$('.caret').removeClass("on");
	$(".searchList").hide();
});
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


/*重置表单*/
function reset(tag){
	
	$("#" + tag + " #disposeFrom")[0].reset();
	$("#" + tag + " #disposeFrom").find("input[type='hidden']").each(function(i, v){
		$(this).val('');
	});
}

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
	
	//$(this).parents("#AssetsType").prev('a').find('span').text($(this).text());
	$(this).parents("#AssetsType").prev('a').find('i').removeClass("on");
	$(this).parents("#AssetsType").css("display", "none");

	assetsType = $(this).attr("value");
	
})

//修改按钮
var qFixStatus = $("#disposeFrom input[name='fixStatus']").val();
function updateShole(obj){
	
	var id = $(obj).parents("tr").attr("data");
	$("#disposeFrom input[name='vulnId']").val(id);
	show('sholeSet');
	
	var s;
	$(obj).parents("tr").find("td").each(function() {
		s = $(this).attr("data");//状态值
		if(s){
			if(s == '2'||s == 2) {
				$("input[name='fixStatus'][value='0']").prop("disabled", true); 
			}else{
				$("input[name='fixStatus'][value='0']").attr("disabled", false); 
			}
		}
	})
	
}
//漏洞处理  提交按钮
function saveHolefix() {
	//reset('sholeSet');
	
	var vulnId = $("#disposeFrom input[name='vulnId']").val();
	var kFixStatus = $("#disposeFrom input[name='fixStatus']").val();
	var explain = $("#disposeFrom textarea[name='explain']").val();
	$.ajax({
		url:'/om/vuln/manager/fix',
		type:'POST',
		async:true,
		data: {
			vulnId: vulnId,
			fixStatus: kFixStatus,
			explain: explain
		},
		success:function(data) {
	
			if (data.retCode == "1") {
				
				msg("漏洞处理", "提交成功，已处理！");
				hide('sholeSet');
				
			} else {
				msg("漏洞处理", data.msg);
			}
			
		},
		error:function(err) {
			msg("漏洞处理",'漏洞处理：error');
		}
	})
	
}

//详情
function detailsShole(obj){
	var id = $(obj).parents("tr").attr("data");
	$.ajax({
		url:'/om/vuln/manager/detail/'+id,
		type:'GET',
		async:true,
		data: {},
		success:function(data) {
			$("#holetab1").empty();			
			$("#holetab2").empty();
			var result = data.result;
			var dLevel = assetTypeArr(result.level); //风险等级
			var dFixStatus = hostTypeArr(result.fixStatus); //资产类型
			if (data.retCode == "1") {

				var tab1 = "<tr>" +
				           "<td width='10%'>漏洞名称：</td>"+"<td width='35%'>"+(result.vulnName == null ? '' : result.vulnName)+"</td><td width='10%'></td><td width='10%'>负责人：</td>"+"<td width='35%'>"+(result.assetsUser == null ? '' : result.assetsUser)+"</td>"+
				           "</tr>"+
						   "<tr>" +
				           "<td width='10%'>CVE编号：</td>"+"<td width='35%'>"+(result.cveNo == null ? '' : result.cveNo)+"</td><td width='10%'></td><td width='10%'>关联邮箱：</td>"+"<td width='35%'>"+(result.email == null ? '' : result.email)+"</td>"+
				           "</tr>"+
						   "<tr>" +
				           "<td width='10%'>CNVD编号：</td>"+"<td width='35%'>"+(result.cvndNo == null ? '' : result.cnvdNo)+"</td><td width='10%'></td><td width='10%'>漏洞分类：</td>"+"<td width='35%'>"+(result.vulnType == null ? '' : result.vulnType)+"</td>"+
				           "</tr>"+
						   "<tr>" +
				           "<td width='10%'>关联资产：</td>"+"<td width='35%'>"+(result.assetsName == null ? '' : result.assetsName)+"</td><td width='10%'></td><td width='10%'>风险等级：</td>"+"<td width='35%'><span class='color_one' style='background:"+ colorObj[dLevel]+"'>"+(dLevel == null ? '' : dLevel)+"</span></td>"+
				           "</tr>"+
						   "<tr>" +
				           "<td width='10%'>主机IP：</td>"+"<td width='35%'>"+(result.hostType == null ? '' : result.hostType)+"</td><td width='10%'></td><td width='10%'>发现时间：</td>"+"<td width='35%'>"+(result.createDate == null ? '' : result.createDate)+"</td>"+
				           "</tr>";
				 $("#holetab1").append(tab1);
				 
				 
				 var tab2 = "<tr>" +
		                    "<td width='10%'>漏洞简介：</td>"+"<td width='90%'>"+(result.introduce == null ? '' : result.introduce)+"</td>"+
		                    "</tr>"+
							"<tr>"+
							"<td width='10%' style='height: 16px;line-height: 16px;'></td><td width='90%' style='height: 16px;line-height: 16px;'></td>" +
							"</tr>"+
							"<tr>" +
		                    "<td width='10%'>修复方案：</td>"+"<td width='90%'>"+(result.fixSolution == null ? '' : result.fixSolution)+"</td>"+
		                    "</tr>"+
							"<tr>" +
		                    "<td width='10%'>修复指南：</td>"+"<td>"+(result.fixAction == null ? '' : result.fixAction)+"</td>"+
		                    "</tr>"+
							"<tr>" +
		                    "<td width='10%'>处理状态：</td>"+"<td>"+(dFixStatus == null ? '' : dFixStatus)+"</td>"+
		                    "</tr>"+
							"<tr>" +
		                    "<td width='10%'>处理说明：</td>"+"<td>"+(result.fixAction == null ? '' : result.fixAction)+"</td>"+
		                    "<tr>";
		                    
		          $("#holetab2").append(tab2);
		          
				  show('sholeDetail');
				
			} else {
				msg("漏洞详情", data.msg);
			}
			
		},
		error:function(err) {
			msg("漏洞详情",'漏洞详情：error');
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


//处理状态
function hostTypeArr(type) {
	 var x = "";
	 switch (type) {
	 case 0:
  	   x = "待修复";
  	   break;
  	 case 2:
  	   x = "已修复";
  	   break;
	 }
	 return x;
}



//风险等级，处理状态
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
					
					
					var wFixStatus  = data.result.fixStatus;
					var typefi = '';
					for (var i in wFixStatus) {
						typefi = '<li><a href="javascript:;" value="0">'+wFixStatus[0]+'</a></li><li><a href="javascript:;" value="2">'+wFixStatus[2]+'</a></li>'
					}
					$("#fixStatus ul").append(typefi);
					
					
					
					//风险等级条件查询
					$("#vulnLevel ul li a").bind("click", function() {
						
						$(this).parents("#vulnLevel").prev('a').find('i').removeClass("on");
						$(this).parents("#vulnLevel").css("display", "none");
						
						level = $(this).attr("value");
						spageNum = 1;
						getAssetListNewTbl();
					})
					
					//处理状态条件查询
					$("#fixStatus ul li a").bind("click", function() {
						
						$(this).parents("#fixStatus").prev('a').find('i').removeClass("on");
						$(this).parents("#fixStatus").css("display", "none");
						
						fixStatus = $(this).attr("value");
						spageNum = 1;
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


//所属机构下拉列表
function getOrganizationList() {
	$.ajax({
		url:'/sys/sys_office/find_all',
		type:'POST',
		async:true,
		cache:true,
		data:{},
		success:function(data) {
			
			var result = data;
			if (result.retCode == "1") {
				var sysOffices = data.result.sysOffices;
				var option = "";
				var li = "";
				for (var i = 0; i < sysOffices.length; i++) {
					option += ' <option value="'+sysOffices[i].officeId+'">'+sysOffices[i].officeName+'</option>';
					li += '<li><a href="javascript:;" value="'+sysOffices[i].officeId+'">'+sysOffices[i].officeName+'</a></li>'
				}
				$("#organization").append(option);
				$("#sysOffices ul").append(li);
				
				//所属机构条件查询
				$("#sysOffices ul li a").bind("click", function() {
					
					
					//$(this).parents("#sysOffices").prev('a').find('span').text($(this).text());
					$(this).parents("#sysOffices").prev('a').find('i').removeClass("on");
					$(this).parents("#sysOffices").css("display", "none");
					
					officeId = $(this).attr("value");
					spageNum = 1;
					getAssetListNewTbl();
				})
				
			} else {
				msg("所属机构", result.msg);
			}
		},
		error:function(err) {
			msg("所属机构", "所属机构：error");
		}
 })
 
}


//查询按钮
$("#btnSearch").bind("click", function(){
	
	condition = $("#assetsName").val();
	lpageNum = 1;
	isfirstLoad = true;
	getAssetListNewTbl();
})

//列表查询
function getAssetListNewTbl() {
	 $.ajax({
			url:'/om/vuln/manager/search',
			type:'GET',
			async:true,
			cache:true,
			data:{
				pageSize: 10,
				pageNo: spageNum,
				assetsName: condition,
				officeId: officeId,
				level: level,
				fixStatus: fixStatus
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
						for (var i = 0; i < result.length; i ++) {
	
								var sLevel = assetTypeArr(result[i].level); //风险等级
								var sFixStatus = hostTypeArr(result[i].fixStatus); //资产类型
								
								tr += '<tr data="'+result[i].id+'">'+
									'<td>'+
									'<a href="javascript:;" class="tab_name">'+result[i].cveNo+'</a></td>'+
									'<td>'+result[i].vulnName+'</td>'+
									'<td>'+result[i].vulnType+'</td>'+
									'<td style="padding-left:27px;"><span class="color_one" style="background:'+ colorObj[sLevel]+'">' +sLevel+'</span></td>'+
									'<td>'+(result[i].assetsName == null ? '' : result[i].assetsName)+'</td>'+
									'<td style="padding-left:27px;">'+(result[i].officeName == null ? '' : result[i].officeName)+'</td>'+
									'<td style="padding-left:27px;" data="'+result[i].fixStatus+'">'+sFixStatus+'</td>'+
									'<td>'+(result[i].createDate == null ? '' : result[i].createDate)+'</td>'+ 
									'<td><a href="javascript:;" onclick="updateShole(this)">修改</a>&nbsp;&nbsp;&nbsp;&nbsp;'+
									'<a href="javascript:;" onclick="detailsShole(this)">详情</a></td>'+
								'</tr>';
						  }
					      $("#assetsTab tbody").append(tr);
					
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
					msg("查询-漏洞列表", data.msg);
				}
				
			},
			error: function(err) {
				msg("查询-漏洞列表", '查询-漏洞列表：error');
			}
		  })
}




function init(){
	$('#load').fadeIn(); //loading加载

	getAssetListNewTbl();//列表查询
	
	getOrganizationList();//所属机构下拉列表
	
	getselectedInit();//风险等级，处理状态
	
}
init();
