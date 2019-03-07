function isValidIP(ip) {
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    return reg.test(ip);
}
function isValidEmail(email) {
    var reg = /^[A-Za-z0-9._%-]+@([A-Za-z0-9-]+\.)+[A-Za-z]{2,4}$/
    return reg.test(email);
} 

//消息弹窗
$(document).click(function() {
	$('.caret').removeClass("on");
	$(".searchList").hide();
});

/*
 *  window
 * */

function closeWindow(obj) {
	$(obj).parents(".reports_detail").hide();
}

function removeMsg(obj) {
	if (isClick == true) {
		isClick = false;
	}
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

//端口弹窗
function portWin(title, msg, state, ips) {
	/*
	 * 1: 未勾选
	 * 2: 已勾选，是否扫描
	 * 3: 扫描中
	 * 4: 扫描完成
	 */
	var str = '<div class="Success_Bomb" id="portWin" style="display: block;background: none;">'+
				'<div class="upgradeBomb_content" style="background: #020308;border: none;">'+
					'<p class="close"><img src="/static/img/close.png" width="18" height="17" onclick="removeMsg(this)"></p>'+
					'<h3 class="succ_title" style="border-bottom: 1px solid #222;"><span style="color:#9D9FA5;background:none;">'+title+'</span></h3>'+
					'<p class="assIconCon">'+
					'<span class="sacanAnimate"></span><img src="static/img/portAsset.png" style="top: 15px;left: 19px;" width="45" class="fl"></p>';
				
	switch(state) {
		case 2:
			str += '<div class="fl">'+
						'<p class="succ_Desc assetMsg" id="">'+msg+'</p>'+
						'<div class="btns" style="position: relative;top: 44px;">'+
						'<span class="saveBtn" onclick="portScan()">确定</span>'+
							'<span class="saveBtn" onclick="removeMsg(this)">取消</span>'+
						'</div>'+
					'</div>';
		    break;
		case 3:
			
			str += '<div class="fl">'+
						'<p class="succ_Desc assetMsg" id="">'+
							'<p class="title" style="background:none;">正在扫描，请稍后..</p>'+
							'<div class="ipsList"><ul class="ips">'+
								
							'</ul></div>'+
						'</p>'+
						'<div class="btns" style="position: relative;top: 0px;">'+
							'<span class="saveBtn" onclick="removeMsg(this)">确认</span>'+
						'</div>'+
					'</div>';
			break;
		case 4:
			str += '<div class="fl">'+
					'<p class="succ_Desc assetMsg">'+
						'<p class="title" style="background:none;">扫描完成</p>'+
						'<div class="ipsList"><ul class="ips">'+

						'</ul></div>'+
					'</p>'+
					'<div class="btns" style="position: relative;top: 0px;">'+
						'<span class="saveBtn" onclick="removeMsg(this)">确认</span>'+
					'</div>'+
				'</div>';
		    break;
			  
	   default:
		   str += '<div class="fl">'+
			'<p class="succ_Desc assetMsg" id="">'+msg+'</p>'+
			'<div class="btns" style="position: relative;top: 44px;">'+
				'<span class="saveBtn" onclick="removeMsg(this)">确认</span>'+
			'</div>'+
		'</div>';
	  
	}
	
	str +=  '</div>'+
			'</div>';
	
	$("body").append(str);
	if (state == 3 || state == 4) {
		$("#portWin ul.ips").append(ips);
	}
}

//漏洞弹窗
function holeWin(title, msg, state, ips) {
	/*
	 * 1: 未勾选
	 * 2: 已勾选，是否扫描
	 * 3: 扫描中
	 * 4: 扫描完成
	 */
	var str = '<div class="Success_Bomb holeWin" id="holeWin'+state+'" style="display: block;background: none;">'+
				'<div class="upgradeBomb_content" style="background: #020308;border: none;">'+
					'<p class="close"><img src="/static/img/close.png" width="18" height="17" onclick="removeMsg(this)"></p>'+
					'<h3 class="succ_title" style="border-bottom: 1px solid #222;"><span style="color:#9D9FA5;">'+title+'</span></h3>'+
					'<p class="assIconCon">'+
					'<span class="sacanAnimate"></span><img src="static/img/holeAsset.png" style="top: 15px;left: 19px;" width="45" class="fl"></p>';
				
	switch(state) {
		case 2:
			str += '<div class="fl">'+
						'<p class="succ_Desc assetMsg" id="">'+msg+'</p>'+
						'<div class="btns" style="position: relative;top: 44px;">'+
						'<span class="saveBtn" onclick="holeAssetScaning(this)">确定</span>'+
							'<span class="saveBtn" onclick="removeMsg(this)">取消</span>'+
						'</div>'+
					'</div>';
		    break;
		case 3:
			
			str += '<div class="fl">'+
						'<p class="succ_Desc assetMsg" id="">'+
							'<p>正在扫描，请稍后..</p>'+
							'<div class="ipsList"><ul class="ips">'+
								
							'</ul></div>'+
						'</p>'+
						'<div class="btns" style="position: relative;top: 0px;">'+
							'<span class="saveBtn" onclick="holeAssetScanEnd()">取消扫描</span>'+
							'<span class="saveBtn" onclick="removeMsg(this)">确定</span>'+
						'</div>'+
					'</div>';
			break;
		case 4:
			str += '<div class="fl">'+
					'<p class="succ_Desc assetMsg">'+
						'<p>'+msg+'</p>'+
						'<div class="ipsList"><ul class="ips">'+

						'</ul></div>'+
					'</p>'+
					'<div class="btns" style="position: relative;top: 0px;">'+
						'<span class="saveBtn" onclick="removeMsg(this)">确认</span>'+
					'</div>'+
				'</div>';
		    break;
		case 5:
			str += '<div class="fl">'+
						'<p class="succ_Desc assetMsg" id="">取消扫描可能导致本次扫描数据丢失，是否继续本次扫描操作？</p>'+
						'<div class="btns" style="position: relative;top: 0px;">'+
						'<span class="saveBtn" onclick="removeMsg(this)">继续扫描</span>'+
							'<span class="saveBtn" onclick="holeScanEnd()">结束扫描</span>'+
						'</div>'+
					'</div>';
		    break;
			  
	   default:
		   str += '<div class="fl">'+
			'<p class="succ_Desc assetMsg" id="">'+msg+'</p>'+
			'<div class="btns" style="position: relative;top: 44px;">'+
				'<span class="saveBtn" onclick="removeMsg(this)">确认</span>'+
			'</div>'+
		'</div>';
	  
	}
	
	str +=  '</div>'+
			'</div>';
	
	$("body").append(str);
	if (state == 3 || state == 4) {
		$(".holeWin ul.ips").append(ips);
	}
}

/*
 * 资产列表
 * 
 * */

//条件查询select
function searchItemFun(obj) {
	
	
	var e = window.event;
	e.stopPropagation();
	$this = $(obj);
	if ($this.find('i').attr('class').indexOf('on') != -1) {
		$this.next('.searchList').css("display", "none");
		$this.find('i').removeClass("on");
		
	} else {
		$this.next('.searchList').css("display", "block");
		$this.find('i').addClass("on");
	}
	
}
function selectedIcon(obj) {
	
	if ($(obj).parent('span').find('i').attr('class').indexOf('on') != -1) {
		$(obj).parent('span').find('i').removeClass("on");
	} else {
		$(obj).parent('span').find('i').addClass("on");
	}
}
//条件查询 hover
/*
$("a.search").hover(function(){
	$(this).find("i.caret").css("visibility", "visible");
},function(){
	$(this).find("i.caret").css("visibility", "hidden");
});
*/

//checkbox
function getCheckSe(obj) {
	$this = $(obj);
	if ($this.attr('class').indexOf('on') != -1) {
		$this.removeClass("on");
	} else {
		$this.addClass("on");
	}
}

//设备类型
function assetTypeArr(type) {
	
	 var x = "";
	 switch (type) {
    	 case 1:
    	   x = "服务器";
    	   break;
    	 case 2:
    	   x = "实体机";
    	   break;
    	 case 3:
    	   x = "虚拟机";
    	   break;
    	 case 4:
    	   x ="路由器";
    	   break;
    	 case 5:
    	   x = "交换机";
    	   break;
    	 case 6:
    	   x = "安全设备";
    	   break;
    	 case 7:
      	   x = "打印机";
      	   break;
    	 case 6:
      	   x = "安全设备";
      	   break;
    	 case 9:
      	   x = "其它设备";
      	   break;
	 }
	 
	 return x;
}

//资产类型
function hostTypeArr(type) {
    var x = {
    	name: "",
    	icon: ""
    };
	 switch (type) {
	 case 0:
	   x.name = "非核心资产";
	   x.icon = "ic_property"
	   break;
   	 case 1:
   	   x.name = "核心资产";
   	   x.icon = "ic_property on"
   	   break;
   	 case 2:
   	   x.name = "非核心资产";
   	   x.icon = "ic_property"
   	   break;
	 }
	 return x;
}

//条件查询列表
function getselectedInit() {
	
	 $.ajax({
			url:' om/assets/constants',
			type:'GET',
			async:true,
			
			data: {},
			success:function(data) {
				
				var result = data;
				if (result.retCode == "1") {
					
					//设备类型
					var AssetsType  = data.result.AssetsType;
					var typeLi = '', typeOption = '';
					for (var i in AssetsType) {
						typeOption += ' <option value="'+i+'">'+AssetsType[i]+'</option>';
						typeLi += '<li><a href="javascript:;" value="'+i+'">'+AssetsType[i]+'</a></li>'
					}
					$("#AssetsType ul").append(typeLi);
					$("#AssetsTypeTbl").append(typeOption);
					
					//设备类型条件查询
					$("#AssetsType ul li a").bind("click", function() {
						
						
						//$(this).parents("#AssetsType").prev('a').find('span').text($(this).text());
						$(this).parents("#AssetsType").prev('a').find('i').removeClass("on");
						$(this).parents("#AssetsType").css("display", "none");
						
						$("#AssetsType ul li a").css({"background": "none", "color": "#696b73"});
						$(this).css({"background":"#2187c4", "color": "#fff"});
						
						assetsType = $(this).attr("value");
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

//所属机构下拉列表
function getOrganizationList() {
	$.ajax({
		url:'/sys/sys_office/find_all',
		type:'POST',
		async:true,
		
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
					
					$("#sysOffices ul li a").css({"background": "none", "color": "#696b73"});
					$(this).css({"background":"#2187c4", "color": "#fff"});
					
					officeId = $(this).attr("value");
					spageNum = 1;
					sisfirstLoad = true;
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



/*
 * 详情
 * 
 */

//端口列表、漏洞列表
function portHoleList(f) {
	
	
	$(".listCon").hide();
	$(".list_"+f).show();
	$(".listBtn").css({"color":"#696b73"});
	$(".listBtn").eq(f).css({"color":"#fff"});
	if (f == "0") {
		$(".listlines").css({"left":"-26px"});
	} else {
		$(".listlines").css({"left":"71px"});
	}
}
$(".listBtn").bind("click", function() {
	var f = $(this).attr("data");
	portHoleList(f);
});


//资产详情弹窗
function detailAssetBtn(obj) {
	
	var id = $(obj).parents("tr").attr("data");
	 $.ajax({
			url:'/om/assets/detail',
			type:'GET',
			async:true,
			
			data: {
				assetsId: id
			},
			success:function(data) {
				
				var result = data.result;
				if (data.retCode == "1") {
					
					//清空  初始状态
					$("#assetDetail .baseInfo, #assetDetail .otherAsset").empty();
					$("#assetDetail .assetPort tbody, #assetDetail .assetHole tbody").empty();
					portHoleList("0");
					
					//威胁统计
					
					
					//基本信息
					var assetsInfo = result.assetsInfo;
					var str = "";
					var hostType = ""; //资产类型
					if (assetsInfo['hostType'] != null ) {
						var type = hostTypeArr(assetsInfo['hostType']);
						hostType = type.name;
					}
					var assetType = ""; //设备类型
					if (assetsInfo['assetsType'] != null ) {
						assetType = assetTypeArr(assetsInfo['assetsType']);
					}
					//for (var i in assetsInfo) {
						str = '<tr>'+
								'<td width="80">主机名称：</td>'+
								'<td width="200" style="width:200px;display:block;"><span class="overelise" title="'+assetsInfo['assetsName']+'">'+(assetsInfo['assetsName'] == null ? '' :assetsInfo['assetsName'])+'</span></td>'+
								'<td width="80">负责人：</td>'+
								'<td width="200" style="width:200px;display:block;"><span class="overelise" title="'+assetsInfo['assetsUser']+'">'+(assetsInfo['assetsUser'] == null ? '' : assetsInfo['assetsUser'])+'</span></td>'+
							'</tr>'+
							'<tr>'+
								'<td width="80">主机IP：</td>'+
								'<td width="200" style="width:200px;display:block;"><span class="overelise" title="'+assetsInfo['assetsIp']+'">'+(assetsInfo['assetsIp'] == null ? '' : assetsInfo['assetsIp'])+'</span></td>'+
								'<td width="80">关联邮箱：</td>'+
								'<td width="200" style="width:200px;display:block;"><span class="overelise" title="'+assetsInfo['email']+'">'+(assetsInfo['email'] == null ? '' : assetsInfo['email'])+'</span></td>'+
							'</tr>'+
							'<tr>'+
								'<td width="80">设备类型：</td>'+
								'<td width="200" style="width:200px;display:block;"><span class="overelise" title="'+assetType+'">'+assetType+'</span></td>'+
								'<td width="80">资产类型：</td>'+
								'<td width="200" style="width:200px;display:block;"><span class="overelise" title="'+hostType+'">'+hostType+'</span></td>'+
							'</tr>'+
							'<tr>'+
								'<td width="80">所属机构：</td>'+
								'<td width="200" style="width:200px;display:block;"><span class="overelise" title="'+assetsInfo['officeId']+'">'+(assetsInfo['officeId'] == null ? '' : assetsInfo['officeId'])+'</span></td>'+
								'<td width="80">备注：</td>'+
								'<td width="200" style="width:200px;display:block;"><span class="overelise" title="'+assetsInfo['remarks']+'">'+(assetsInfo['remarks'] == null ? '' : assetsInfo['remarks'])+'</span></td>'+
							'</tr>';
					//}
					
					$("#assetDetail .baseInfo").append(str);
					
					//附加信息
					var assetsAttachInfo = result.assetsAttachInfo;
					
					if (assetsAttachInfo != null) {
						var attchstr = '<tr data="'+(assetsAttachInfo['assetsId'] == null ? '' :assetsAttachInfo['assetsId'])+'">'+
								'<td width="80">操作系统：</td>'+
								'<td width="200">'+(assetsAttachInfo['os'] == null ? '' :assetsAttachInfo['os'])+'</td>'+
								'<td width="80">CPU型号：</td>'+
								'<td width="200">'+(assetsAttachInfo['cpu'] == null ? '' : assetsAttachInfo['cpu'])+'</td>'+
								'<td width="80">CPU数量：</td>'+
								'<td width="200">'+(assetsAttachInfo['cpuNum'] == null ? '' : assetsAttachInfo['cpuNum'])+'</td>'+
								'<td width="80">硬盘大小：</td>'+
								'<td width="200">'+(assetsAttachInfo['hdSize'] == null ? '' : assetsAttachInfo['hdSize'])+'</td>'+
							'</tr>'+
							'<tr>'+
								'<td width="80">设备厂商：</td>'+
								'<td width="200">'+(assetsAttachInfo['hardComp'] == null ? '' : assetsAttachInfo['hardComp'])+'</td>'+
								'<td width="80">SN号：</td>'+
								'<td width="200">'+(assetsAttachInfo['sn'] == null ? '' : assetsAttachInfo['sn'])+'</td>'+
								'<td width="80">机柜信息：</td>'+
								'<td width="200">'+(assetsAttachInfo['cabinet'] == null ? '' : assetsAttachInfo['cabinet'])+'</td>'+
								'<td width="80">内存大小：</td>'+
								'<td width="200">'+(assetsAttachInfo['memSize'] == null ? '' : assetsAttachInfo['memSize'])+'</td>'+
							'</tr>';
						$("#assetDetail .otherAsset").append(attchstr);
					}
					
					//端口列表
					var assetsPorts = result.assetsPorts;
					var dkStr = "";
					if (assetsPorts.length > 0) {
						
						for (var j = 0; j < assetsPorts.length; j++) {
							dkStr += '<tr>'+
										'<td><span class="overelise">'+(assetsPorts[j].port == null ? '' : assetsPorts[j].port)+'</span></td>'+
										'<td><span class="overelise">'+(assetsPorts[j].serviceInfo == null ? '' : assetsPorts[j].serviceInfo)+'</span></td>'+
										'<td><span class="overelise">'+(assetsPorts[j].versionInfo == null ? '' : assetsPorts[j].versionInfo)+'</span></td>'+
										'<td><span class="overelise">'+(assetsPorts[j].remarks == null ? '' : assetsPorts[j].remarks)+'</span></td>'+
										'<td><span class="overelise">'+(assetsPorts[j].protocal == null ? '' : assetsPorts[j].protocal)+'</span></td>'+
										'<td><span class="overelise">'+(assetsPorts[j].uptime == null ? '' : assetsPorts[j].uptime)+'</span></td>'+
									'</tr>';
						}
						$("#assetDetail .assetPort").append(dkStr);
					}
					
					//$(".listCon").css({"height": (document.body.scrollHeight-575)+"px"});
					
					//头部信息
					var hostType = hostTypeArr(result.assetsInfo['hostType']);
					$("#assetDetail #hostTypeIcon").attr("class", hostType.icon);
					$("#assetDetail .title_ip").text(result.assetsInfo['assetsIp']);
					
					//漏洞列表
					var id = $(obj).parents("tr").attr("data");
					var ip = $(obj).parents("tr").find("td").eq(1).text();
					$("#assetDetail").attr("data", id);
					getHoleList(id, ip);
					
					
					
					
					
				} else {
					msg("资产详情", data.msg);
				}
			},
			error:function(err) {
				msg("资产详情", '资产详情：error');
			}
	 })
}

//信息变更 - 查询
function updateAttachBtn() {
	
	
	$("#updataInfoForm input").val("");
	var assetsId = $("#assetDetail").attr("data");
	
	$.ajax({
		url:'/om/assets/attach/get',
		type:'GET',
		async:true,
		data:{
			assetsId: assetsId
		},
		success:function(data) {
			
			if (data.retCode == "1") {
				var result = data.result;
				for (var i in result) {
					$("#updataInfoForm input").each(function() {
						if (i == $(this).attr("name")) {
							$(this).val(result[i]);
						}
					});
				}
			
			} else {
				//msg("变更信息", data.msg);
			}
			
		},
		error: function(err) {
			//msg("变更信息", '变更信息：error');
		}
	  })
	  
	  $("#updataInfo").show();
	
}

//附件  信息变更提交
function updateAttach() {

	var reg = /^\d+$/;
	var cpuNum = $("#updataInfoForm input[name='cpuNum']").val();
	var hdSize = $("#updataInfoForm input[name='hdSize']").val();
	var memSize = $("#updataInfoForm input[name='memSize']").val();
	if ( cpuNum != "" && (!reg.test(cpuNum)) ) {
		msg("提示", "CPU数量格式不正确");
		return false;
	}
	if ( hdSize != "" && (!reg.test(hdSize)) ) {
		msg("提示", "硬盘大小格式不正确");
		return false;
	}
	if ( memSize != "" && (!reg.test(memSize)) ) {
		msg("提示", "内存大小格式不正确");
		return false;
	}
	
	
	var formData = {};
		formData.assetsId = $("#assetDetail").attr("data");
		
	$("#updataInfoForm input").each(function() {
		var name = $(this).attr("name");
		formData[""+name+""] = $(this).val();
	});
	
	$.ajax({
		url:'/om/assets/attach/update',
		type:'GET',
		async:true,
		data: formData,
		success:function(data) {
			
			if (data.retCode == "1") {
				 $("#updataInfo").hide();
				getNewData();
				msg("变更信息", "提交成功");
			
			} else {
				msg("变更信息", data.msg);
			}
			
		},
		error: function(err) {
			msg("变更信息", '变更信息：error');
		}
	  })
	
}

//信息变更  成功后更新列表
function getNewData(assetsId) {
	
	$("#assetDetail .otherAsset").empty();
	var assetsId = $("#assetDetail").attr("data");
	
	$.ajax({
		url:'/om/assets/attach/get',
		type:'GET',
		async:true,
		data:{
			assetsId: assetsId
		},
		success:function(data) {
			
			if (data.retCode == "1") {
				var result = data.result;
				if (result != null) {
					var attchstr = '<tr data="'+(result['assetsId'] == null ? '' :result['assetsId'])+'">'+
							'<td width="80">操作系统：</td>'+
							'<td width="200">'+(result['os'] == null ? '' :result['os'])+'</td>'+
							'<td width="80">CPU型号：</td>'+
							'<td width="200">'+(result['cpu'] == null ? '' : result['cpu'])+'</td>'+
							'<td width="80">CPU数量：</td>'+
							'<td width="200">'+(result['cpuNum'] == null ? '' : result['cpuNum'])+'</td>'+
							'<td width="80">硬盘大小：</td>'+
							'<td width="200">'+(result['hdSize'] == null ? '' : result['hdSize'])+'</td>'+
						'</tr>'+
						'<tr>'+
							'<td width="80">设备厂商：</td>'+
							'<td width="200">'+(result['hardComp'] == null ? '' : result['hardComp'])+'</td>'+
							'<td width="80">SN号：</td>'+
							'<td width="200">'+(result['sn'] == null ? '' : result['sn'])+'</td>'+
							'<td width="80">机柜信息：</td>'+
							'<td width="200">'+(result['cabinet'] == null ? '' : result['cabinet'])+'</td>'+
							'<td width="80">内存大小：</td>'+
							'<td width="200">'+(result['memSize'] == null ? '' : result['memSize'])+'</td>'+
						'</tr>';
					$("#assetDetail .otherAsset").append(attchstr);
				}
			
			} else {
				msg("变更信息", data.msg);
			}
			
		},
		error: function(err) {
			msg("变更信息", '变更信息：error');
		}
	  })
	
}

/*
 * 
 * 资产列表
 * 
 ****/

//输入查询
$("#btnSearchAsset").bind("click", function() {
	condition = $("#txtSearch").val();
	lpageNum = 1;
	isfirstLoad = true;
	getAssetListTbl();
})

//获取资产列表
function getAssetListTbl() {
	 
	  $.ajax({
		url:'/om/assets/search',
		type:'GET',
		async:true,
		
		data:{
			pageSize: 10,
			pageNo: lpageNum,
			condition: condition,
		},
		success:function(data) {
			
			//清空表数据
			$("#assetTbl tbody").empty();
			
			
			
			if (data.retCode == "1") {
				var result = data.result.results;
				var tr = '';
				for (var i = 0; i < result.length; i ++) {
					
					var assetsType = '';
					if (result[i].assetsType != null ) {
						assetsType = assetTypeArr(result[i].assetsType); //设备类型
					}
					var hostType = {name: '', icon : ''}; //资产类型
					if (result[i].hostType != null) {
						hostType = hostTypeArr(result[i].hostType);
					}
					
					
					tr += '<tr data="'+result[i].assetsId+'">'+
							'<td>'+
							'<a href="javascript:;" class="checkbox fl" onclick="getCheckSe(this)"></a>'+
							'<a href="javascript:;" class="fl tab_name overelise" title="'+(result[i].assetsName == null ? '' : result[i].assetsName)+'">&nbsp;&nbsp;'+(result[i].assetsName == null ? '' : result[i].assetsName)+'</a></td>'+
							'<td>'+result[i].assetsIp+'</td>'+
							'<td style="padding-left:27px;">'+assetsType+'</td>'+
							'<td style="padding-left:27px;">'+hostType.name+'&nbsp;&nbsp;<i class="'+hostType.icon+'"></i></td>'+
							'<td style="padding-left:27px;">'+(result[i].officeName == null ? '' : result[i].officeName)+'</td>'+
							'<td><span class="overelise" title="'+(result[i].remarks == null ? '' : result[i].remarks)+'">'+(result[i].remarks == null ? '' : result[i].remarks)+'</span></td>'+
							'<td>'+(result[i].uptime == null ? '' : result[i].uptime)+'</td>'+
							'<td><a href="javascript:;" onclick="updateAssetBtn(this)">修改</a>&nbsp;&nbsp;&nbsp;&nbsp;'+
							'<a href="javascript:;" onclick="detailAssetBtn(this)">详情</a></td>'+
						'</tr>';
				}
			
								
				$("#assetTbl tbody").append(tr);
				
				//分页
				var totalCount = data.result.totalCount; //总条数
				var numPerPage = data.result.numPerPage;//每页显示条目数
				var pageSum = data.result.pageSum;//总分页数
				var pageNum = data.result.pageNum;//当前索引
				
				if (isfirstLoad == true) {
					isfirstLoad = false;
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
				            	
				            	lpageNum = page; //当前页目
				            	getAssetListTbl();
				            }
				    };
					$("#page #pageLimit").bootstrapPaginator(page_options);
					$("#page .countItem").text(totalCount);
				}
			
			
			} else {
				msg("资产列表", data.msg);
			}
			
		},
		error: function(err) {
			msg("查询-资产列表", '资产列表：error');
		}
	  })
}



/*
 * 
 * 资产
 * 
 ****/

//新增资产:弹窗
function addAssetBtn() {
	document.getElementById("addAssetForm").reset();
	$("#addAssetForm input[name='assetsId']").val("");
	$("#addAssetForm .oError").text("");
	$("#addAssetForm").attr("data", "0");
	$("#contentTittle").text("新增资产");
	$("#addAssetForm input[name='assetsIp']").attr("readOnly", false);
	$("#addAsset").show();
}

//修改资产:弹窗
function updateAssetBtn(obj) {
	//查询
	var id = $(obj).parents("tr").attr("data");
	$("#addAssetForm input[name='assetsId']").val(id);
	$("#addAssetForm .oError").text("");
	
	 $.ajax({
			url:'/om/assets/detail',
			type:'GET',
			async:true,
			
			data: {
				assetsId: id
			},
			success:function(data) {
				
				var result = data.result;
				if (data.retCode == "1") {
					
					var assetsInfo = result.assetsInfo;
					$("#addAssetForm input").each(function() {
						for (var i in assetsInfo) {
							if ($(this).attr("name") == i) {
								$(this).val(assetsInfo[i]);
							}
						}
						
					});
					
					//设备类型
					var assetsType = assetsInfo['assetsType'];
					$("#AssetsTypeTbl option[value='"+assetsType+"'] ").attr("selected",true);
					
					//所属机构
					var officeId = assetsInfo['officeId'];
					$("#organization option[value='"+officeId+"'] ").attr("selected",true);
					
					//资产类型
					var hostType = assetsInfo['hostType'];
					hostType == 0 ? hostType = 2 : hostType = hostType;
					$("#hostTypeTbl option[value='"+hostType+"'] ").attr("selected",true);
					
					if (assetsInfo.remarks) {
						$("textarea").val(assetsInfo.remarks);
					} else {
						$("textarea").val("");
					}
					
					
					$("#addAssetForm").attr("data", "1");
					$("#contentTittle").text("修改资产");
					$("#addAssetForm input[name='assetsIp']").attr("readOnly", true);
					$("#addAsset").show();
					
					
				} else {
					msg("资产修改查询", data.msg);
				}
			},
			error:function(err) {
				msg("资产修改查询", '资产修改查询：error');
			}
	 })
	
	
}

//新增资产：提交  || 修改资产:提交
function addNewAsset() {

	var eIp = $("#addAssetForm input[name='assetsIp']").val();
	var email = $("#addAssetForm input[name='email']").val();
	var oError = $("#addAssetForm .oError");
	
	var fomData = $("#addAssetForm").serialize();
	var status = $("#addAssetForm").attr("data");
	
	if (email != "" && isValidEmail(email) == false) {
		oError.text("请输入正确的邮箱格式");
		return;
	}
	
	if (status == "0") {
		
		if(eIp != "" && isValidIP(eIp) == false){
			oError.text("请输入正确的IP格式");
			return;
		} 
		
		 //新增
		 $.ajax({
				url:'/om/assets/add',
				type:'POST',
				async:true,
				
				data: fomData,
				success:function(data) {
					
					var result = data;
					if (result.retCode == "1") {
						msg("新增资产", "保存成功");
						$("#addAsset").hide();
						lpageNum = 1;
						isfirstLoad = true;
						getAssetListTbl();
						
						
					} else {
						msg("新增资产", result.msg);
					}
				},
				error:function(err) {
					msg("新增资产", '新增资产：error');
				}
		  })
	} else {
		//修改
		 $.ajax({
				url:' /om/assets/updateinfo/all',
				type:'POST',
				async:true,
				
				data: fomData,
				success:function(data) {
					
					var result = data;
					if (result.retCode == "1") {
						msg("修改资产", "保存成功");
						$("#addAsset").hide();
						lpageNum = 1;
						isfirstLoad = true;
						getAssetListTbl();
					} else {
						msg("修改资产", result.msg);
					}
				},
				error:function(err) {
					msg('修改资产：error');
				}
		  })
	}
	 
	  
}



//资产类型查询
$("#HostType ul li a").bind("click", function() {
	
	//$(this).parents("#HostType").prev('a').find('span').text($(this).text());
	$(this).parents("#HostType").prev('a').find('i').removeClass("on");
	$(this).parents("#HostType").css("display", "none");
	
	$("#HostType ul li a").css({"background": "none", "color": "#696b73"});
	$(this).css({"background":"#2187c4", "color": "#fff"});
	
	hostType = $(this).attr("value");
	spageNum = 1;
	sisfirstLoad = true;
	getAssetListNewTbl();
})

//资产条件查询（不同于资产列表的接口）
function getAssetListNewTbl() {
	 $.ajax({
			url:'/om/assets/filter',
			type:'GET',
			async:true,
			
			data:{
				pageSize: 10,
				pageNo: spageNum,
				assetsType: assetsType,
				hostType: hostType,
				officeId: officeId
			},
			success:function(data) {
				
				//清空表数据
				$("#assetTbl tbody").empty();
				
				if (data.retCode == "1") {
					var result = data.result.results;
					var tr = '';
					for (var i = 0; i < result.length; i ++) {
						
						var assetsType = assetTypeArr(result[i].assetsType); //设备类型
						var hostType = hostTypeArr(result[i].hostType); //资产类型
						
						
						tr += '<tr data="'+result[i].assetsId+'">'+
							'<td>'+
							'<a href="javascript:;" class="checkbox fl" onclick="getCheckSe(this)"></a>'+
							'<a href="javascript:;" class="fl tab_name overelise" title="'+(result[i].assetsName == null ? '' : result[i].assetsName)+'">&nbsp;&nbsp;'+(result[i].assetsName == null ? '' : result[i].assetsName)+'</a></td>'+
							'<td>'+(result[i].assetsIp == null ? "" : result[i].assetsIp)+'</td>'+
							'<td style="padding-left:27px;">'+assetsType+'</td>'+
							'<td style="padding-left:27px;">'+hostType.name+'&nbsp;&nbsp;<i class="'+hostType.icon+'"></i></td>'+
							'<td style="padding-left:27px;"'+(result[i].officeName == null ? "" : result[i].officeName)+'</td>'+
							'<td><span class="overelise" title="'+(result[i].remarks == null ? "" : result[i].remarks)+'">'+(result[i].remarks == null ? "" : result[i].remarks)+'</span></td>'+
							'<td>'+(result[i].uptime == null ? "" : result[i].uptime)+'</td>'+
							'<td><a href="javascript:;" onclick="updateAssetBtn(this)">修改</a>&nbsp;&nbsp;&nbsp;&nbsp;'+
							'<a href="javascript:;" onclick="detailAssetBtn(this)">详情</a></td>'+
						'</tr>';
					}
				
									
					$("#assetTbl tbody").append(tr);
					
					//分页
					var totalCount = data.result.totalCount; //总条数
					var numPerPage = data.result.numPerPage;//每页显示条目数
					var pageSum = data.result.pageSum;//总分页数
					var pageNum = data.result.pageNum;//当前索引
					
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
					msg("查询-资产列表", data.msg);
				}
				
			},
			error: function(err) {
				msg("查询-资产列表", '查询-资产列表：error');
			}
		  })
}




//资产发现:网段选择-选中
function selectedSegment(obj) {
	var e = window.event;
	e.stopPropagation();
	var ips = $(obj).text();
	$(obj).parents("#addAssetFind").find("#scanAssetIp").text(ips);
	$(obj).parents("#addAssetFind").find('.caret').removeClass("on");
	$(obj).parents(".searchList").hide();
	
}
//资产发现:网段选择-鼠标经过
function hSeg(obj) {
	if ($(obj).find('i.deleSeg')) {
		$(obj).find('i.deleSeg').css("visibility", "visible");
	}
}
//资产发现:网段选择-鼠标移出
function oSeg(obj) {
	if ($(obj).find('i.deleSeg')) {
		$(obj).find('i.deleSeg').css("visibility", "hidden");
	}
}
//资产发现:网段选择-删除
function deleteSegement(obj) {
	if ($(obj).parent('a').find('span').length > 0) {
		var IPSege = $(obj).parent('a').find('span').text();
		//删除网段
		 $.ajax({
				url:'/om/scan/assets/delete',
				type:'POST',
				async:true,
				
				data: {
					ips: IPSege
				},
				success:function(data) {
					
					
					if (data.retCode == "1") {
						
						$(obj).parents("li").remove();
						
					} else {
						
						assetWin("删除网段", data.msg);
					}
				},
				error:function(err) {
					msg("删除网段", '删除网段：error');
				}
		})
	}
}

//资产发现:新增网段
function addSegment() {
	var e = window.event;
	e.stopPropagation();
	$("#addWEBDkForm input[name='startIP']").val("");
	$("#addWEBDkForm input[name='endIp']").val("");
	$("#addWEBDk").show();
}

function addWEBDKbtn() {
	var e = window.event;
	e.stopPropagation();
	
	$("#addWEBDk").hide();
	
	var sip = $("#addWEBDkForm input[name='startIP']").val();
		sip = $.trim(sip);
	var nip = $("#addWEBDkForm input[name='endIp']").val();
		nip = $.trim(nip);
	
		
	if (sip == "" || nip == "") {
		msg("资产发现", "起始IP和结束IP不能为空");
		return false;
	} else {
		
		if ((isValidIP(sip)) == false || (isValidIP(nip)) == false) {
			msg("资产发现", "IP格式不正确");
			return false;
		}
		
		var sArr = sip.split('.');
		var nArr = nip.split('.');
		if (sArr[0] == nArr[0] && sArr[1] == nArr[1] && sArr[2] == nArr[2]) {
			
			//新增网段
			 $.ajax({
					url:'/om/scan/assets/add',
					type:'POST',
					async:true,
					
					data: {
						ips: sip+' -- '+nip
					},
					success:function(data) {
						
						
						if (data.retCode == "1") {
							//var result = data.result;
							var li = '<li onmouseover="hSeg(this)" onmouseout="oSeg(this)"><a href="javascript:;" value=""><span onclick="selectedSegment(this)">'+sip+' -- '+nip+'</span><i onclick="deleteSegement(this)" class="deleSeg">x</i></a></li>';
							$("#addAssetFind .searchList ul").prepend(li);
							$("#addAssetFind .searchList").show();
							window.scrollTo(0,0);
							
						} else {
							
							assetWin("新增网段", data.msg);
						}
					},
					error:function(err) {
						msg("新增网段", '新增网段：error');
					}
			})
			
			
		} else {
			msg("资产发现", "请在同一网段设置IP范围");
			return
		}
	}
	
}


//资产发现:网段选择
function findAssetBtn(obj) {
	
	
	clearInterval(scanTime);
	
	if ($(".portAsset").find("img").length > 0 || $(".holeAsset").find("img").length > 0) {
		msg("提示", "正在执行其他任务，请稍后..");
		//$(".portAsset").css({"background":"#888", "color": "#666"});
		return;
	}
	
	if ($(obj).find("img").length > 0) {
		//查看资产扫描状态
		isClick = true;
		findAssetStatus();
		
	} else {
		
		//查询资产扫描下拉列表数据
		 $.ajax({
				url:'/om/scan/assets/records',
				type:'GET',
				async:true,
				
				data: {
					limit: ''
				},
				success:function(data) {
					
					
					if (data.retCode == "1") {
						
						var result = data.result;
						var li = "";
						for (var i = 0; i < result.length; i++) {
							li += '<li onmouseover="hSeg(this)" onmouseout="oSeg(this)"><a href="javascript:;" value=""><span onclick="selectedSegment(this)">'+result[i].params+'</span><i onclick="deleteSegement(this)" class="deleSeg">x</i></a></li>';
						}
						
						$("#addAssetFind .searchList ul").append(li);
						$("#addAssetFind").show();
						
					} else {
						
						assetWin("查询资产扫描下拉列表", data.msg);
					}
				},
				error:function(err) {
					msg("查询资产扫描下拉列表", '查询资产扫描下拉列表：error');
				}
		})
		
	}
	
	
};


//资产扫描: 扫描状态 
function findAssetStatus(init) {
	 $.ajax({
			url:'/om/scantask/status',
			type:'GET',
			async:true,
			
			data: {
				taskid: scanId
			},
			success:function(data) {
				
				
				if (data.retCode == "1") {
					
					var scanAssetsLogs = data.result.scanAssetsLogs;//资产列表
					var scanTask = data.result.scanTask;//任务列表
					var scanStatus; //扫描状态     0：排队      1：扫描中       2：扫描完成    3：扫描失败	 
					
					if (scanAssetsLogs == null || scanAssetsLogs.length < 1) {
						
						scanStatus = scanTask.scanStatus;
					} else {
						scanStatus = scanAssetsLogs.scanStatus;
						
					}
					
					var str = "";
					if (scanStatus == 2) {
						
						if ($(".findAsset").find("img").length > 0) {
							$(".findAsset").find("img").remove();
						}
						str = "扫描完成";
						
						clearInterval(scanTime);
						lpageNum = 1;
						isfirstLoad = true;
						getAssetListTbl();
						
					} else if (scanStatus == 1) {
						
						str = "正在扫描，请稍后..";
						
					} else if (scanStatus == 3) {
						
						scanId = 0;
						if ($(".findAsset").find("img").length > 0) {
							$(".findAsset").find("img").remove();
						}
						str = "扫描失败..";
						
						clearInterval(scanTime);
						
					} else if (scanStatus == 0) {
						
						str = "队列中..";
					}
					
					if ($("#assetWin").length > 0) {
						$("#assetWin .assetMsg").text(str);
					} else {
						if (isClick == true) {
							assetWin("资产扫描", str);
						}
						
					}
					
					
				} else {
					if ($(".findAsset").find("img").length > 0) {
						$(".findAsset").find("img").remove();
					}
					if (isClick == true) {
						assetWin("扫描", data.msg, 1);
					}
					
				}
			},
			error:function(err) {
				msg("扫描", '扫描：error');
			}
	})
}

//资产发现:提交扫描
function scanAsset(obj) {
	$(obj).css("pointer-events", "none");
	var ips = $("#addAssetFind #scanAssetIp").text();
	
	 if (ips != "") {
		 $.ajax({
				url:'/om/assets/scan',
				type:'GET',
				async:true,
				
				data: {
					ips: ips
				},
				success:function(data) {
					
					$(obj).css("pointer-events", "auto");
					$("#addAssetFind").hide();
					
					if (data.retCode == "1") {
						
						scanId = data.result; //存储资产扫描ID
						
						var str = ' <img class="titleLoading" src="/static/img/assetLoad.png" width="20"/>';
						$(".findAsset").append(str);
						
						
						
						clearInterval(scanTime);
						scanTime = setInterval("findAssetStatus()", 60000);
						console.log(scanTime);
						assetWin("资产扫描", "正在扫描，请稍后..");
						
					} else {
						
						assetWin("资产扫描", data.msg);
					}
				},
				error:function(err) {
					$(obj).css("pointer-events", "auto");
					msg("资产扫描", '资产扫描：error');
				}
		})
	 } else {
		 $(obj).css("pointer-events", "auto");
		 msg("资产扫描", '请选择网段');
	 }
}

/*
 * 
 *  端口 
 * 
 ***/

//端口扫描 -状态查询
function portScanState() {
	
	 $.ajax({
			url:'/om/scantask/status',
			type:'GET',
			async:true,
			
			data: {
				taskid: scanId
			},
			success:function(data) {
				
				if (data.retCode == "1") {
					
					 
					var scanPortLogs = data.result.scanPortLogs; //端口扫描列表
					var scanTask = data.result.scanTask; //扫描任务列表
					var portStr = "", list = [], ips = "", status = 3;
					var count = 0; //扫描完成计数
					
					if (scanPortLogs == null || scanPortLogs.length < 1) {
						list = scanTask;
						ips = "scanParam";
					} else {
						list = scanPortLogs;
						ips = "ipAddr";
					}
					
					
					for (var i = 0; i < list.length; i++) {
						
						
							var scanStatus = list[i].scanStatus; //扫描状态    0：排队      1：扫描中       2：扫描完成    3：扫描失败
							var name = '';
							
							//获取状态
							if (scanStatus == 1) {
								name = 'scaning';
								status = 3; //扫描中
							} else if (scanStatus == 2) {
								count ++;
								name = 'complete';
								status = 4; //扫描完成
							} else if (scanStatus == 3) {
								name = 'fail';
								status = 4; //扫描完成
							} else if (scanStatus == 0) {
								name = 'queue';
								status = 3; //扫描中
							}
							
							//判断是否是多个ip
							if((list[i][ips]).indexOf(',') != -1) {
								
								var param = (list[i][ips]).split(',');
								for (var j = 0 ; j < param.length; j ++) {
									if (name == 'queue') {
										portStr += '<li><i class="queue"></i><span>'+param[j]+'</span></li>'; /*<a onclick="deletePort(this)" class="deletePort">x</a>*/
									} else {
										portStr += '<li><i class="'+name+'"></i>'+param[j]+'</li>';
									}
								}
								
							} else {
								
								if (name == 'queue') {
									portStr += '<li><i class="queue"></i><span>'+list[i][ips]+'</span></li>'; /*<a onclick="deletePort(this)" class="deletePort">x</a>*/
								} else {
									portStr += '<li><i class="'+name+'"></i>'+list[i][ips]+'</li>';
								}
								
							}
						
						
					}
					
					
					if ($("#portWin").length > 0) {
						$("#portWin ul").empty();
						$("#portWin ul").append(portStr);
						
					} else {
						if (isClick == true) {
							portWin("端口扫描进度", "", status, portStr);
						}
					}
					
					
					if (count == list.length) {
						
						clearInterval(scanTime);
						
						if ($(".portAsset").find("img").length > 0) {
							$(".portAsset").find("img").remove();
						}
						
						//$("#portWin .title").text("扫描完成");
						
						lpageNum = 1;
						isfirstLoad = true;
						getAssetListTbl();
						
					}
					

				} else {
					if ($(".portAsset").find("img").length > 0) {
						$(".portAsset").find("img").remove();
					}

					portWin("端口扫描进度", data.msg, 1);
					
					
				}
			},
			error:function(err) {
				msg("端口扫描进度", '端口扫描进度：error');
			}
	})
	
	
}

//端口扫描-取消排队的扫描
/*function deletePort(obj) {

	var portIP = $(obj).parent("li").find("span").text();
		portIP = $.trim(portIP);
	 $.ajax({
			url:'/om/scantask/cancelport',
			type:'POST',
			async:true,
			
			data: {
				ip: portIP
			},
			success:function(data) {
				
				var result = data;
				if (result.retCode == "1") {
					
					$(obj).parent("li").remove();
					portWin("端口扫描", "已取消该端口扫描", 1);
				}
			},
			error:function(err) {
				msg("端口扫描", '端口扫描：error');
			}
	 })
}
	*/			
//端口扫描-开始扫描
function portScan() {
	
	var assetsidsStr = "";
	$("#assetTbl tr td a.checkbox").each(function() {
		if ($(this).hasClass("on")) {
			var asids = $(this).parents("tr").find("td").eq(1).text();
			assetsidsStr += asids+",";
		}
	});
	
	 $.ajax({
			url:'/om/assets/port/scan',
			type:'POST',
			async:true,
			
			data: {
				assetsips: assetsidsStr
			},
			success:function(data) {
				
				if (data.retCode == "1") {
					
					scanId = data.result;  //存储扫描任务ID
					
					$("#portWin").remove();
					if ($(".portAsset").find('img').length < 1) {
						var str = ' <img class="titleLoading" src="/static/img/assetLoad.png" width="20"/>';
						$(".portAsset").append(str);
					}
					
					//扫描中
					var ips = '';
					$("#assetTbl tr td a.checkbox").each(function() {
						if ($(this).hasClass("on")) {
							var asids = $(this).parents("tr").find("td").eq(1).text();
							ips += '<li><i class="queue"></i><span>'+asids+'</span></li>'; /*<a onclick="deletePort(this)" class="deletePort">x</a>*/
						}
					});
					
					
					clearInterval(scanTime);
					scanTime = setInterval("portScanState()", 60000);
					console.log(scanTime);
					portWin("端口扫描", "", 3, ips);
					
				} else {
					
					portWin("端口扫描", data.msg, 1);
				}
			},
			error:function(err) {
				msg("端口扫描", '端口扫描：error');
			}
	})
}

//端口扫描-点击端口扫描按钮
function portAssetBtn(obj) {
	
	
	clearInterval(scanTime);
	
	if ($(".findAsset").find("img").length > 0 || $(".holeAsset").find("img").length > 0) {
		msg("提示", "正在执行其他任务，请稍后..");
		return;
	}
	
	if ($(obj).find("img").length > 0) {
		//扫描中  查看扫描状态
		isClick = true;
		portScanState();
		
	} else {
		
		var flag = false;
		var count = 0;
		$("#assetTbl tr td a.checkbox").each(function() {
			if ($(this).hasClass("on")) {
				flag = true;
				count ++;
			}
		});
		
		if (!flag) {
			portWin("端口扫描", "请先选择相应资产，再进行端口扫描！", 1);
			return false;
		}
		
		 $.ajax({
				url:'/om/scantask/left',
				type:'GET',
				async:true,
				
				data: {},
				success:function(data) {
					
					
					if (data.retCode == "1") {
						var result = data.result;
						if (count > result) {
							portWin("可扫描数量查询", "超过可扫描数量,最多可扫描"+result+"个资产", 1);
							return false;
						} else {
							//扫描提示
							portWin("端口扫描", "您将对所选的资产进行端口扫描，是否继续执行？", 2);
							return false;
						}
						
					} else {
						
						portWin("可扫描数量查询", data.msg, 1);
					}
				},
				error:function(err) {
					msg("可扫描数量查询", '可扫描数量查询：error');
				}
		})
		
		
	}
}

/*
 * 漏洞扫描 
 * 
 * ***/


//漏洞扫描  通过ID查看单个扫描状态
function getHoleStatusById(id) {
	
	var scanStatus = 0; //队列中
	$.ajax({
		url:'/om/vuln/scan/status',
		type:'GET',
		async:false,
		data: {scanId: id},
		success:function(data) {
			
			if (data.retCode == "1") {
				scanStatus = data.result.scanStatus;
			} else {
				msg("漏洞扫描", data.msg);
			}
			
		},
		error:function(err) {
			msg("漏洞扫描",'漏洞详情：error');
		}
	})
	
	return scanStatus;
}

//漏洞扫描   启动  通过ID查看单个扫描状态
function holeScanStateInit() {
	
	var str = "";
	var isComcount = 0;
	
	if (holeArr.length > 0) {
		for (var i in holeArr) {
			var id = holeArr[i].id;
			var status = getHoleStatusById(id); //通过ID获取状态
			if (status == 2) {
				isComcount++;
			}
			var tempName = getHoleIDStaus(status);
			str += '<li><i class="'+tempName+'"></i><span data="'+holeArr[i].id+'">'+holeArr[i].ip+'</span></li>'; /*<a onclick="holeScanEndSige('+(result[i])+', \''+i+'\')" class="deletePort">x</a>*/

		}
	}
	
	
	//完成数 是否等于 扫描总数 
	if (isComcount == holeArr.length) {
		if ($(".holeAsset").find("img").length > 0) {
			$(".holeAsset").find("img").remove();
		}
		//弹窗是否打开
		if ($(".holeWin ul.ips").length > 0) {
			//已打开
			$(".holeWin ul.ips").empty();
			$(".holeWin ul.ips").append(str);
			
		} else {
			if (isClick == true) {
				//关闭后不能再定时弹出
				holeWin("漏洞扫描", "", 4, "扫描完成");
			}
			
		}
		clearInterval(scanTime);
		lpageNum = 1;
		isfirstLoad = true;
		getAssetListTbl();
	} else {
		//弹窗是否打开
		if ($(".holeWin ul.ips").length > 0) {
			//已打开
			$(".holeWin ul.ips").empty();
			$(".holeWin ul.ips").append(str);
			
		} else {
			if (isClick == true) {
				//关闭后不能再定时弹出
				holeWin("漏洞扫描", "", 3, str);
			}
			
		}
		clearInterval(scanTime);
		scanTime = setInterval("holeScanStateInit()", 60000);
		console.log(scanTime);
	}
	
	
	
	
}

//通过状态ID获取状态Name
function getHoleIDStaus(id) {
	
	var name = "";
	
	/*$.ajax({
		url:'/om/vuln/scan/status',
		type:'GET',
		async:false,
		data: {scanId: id},
		success:function(data) {
			if (data.retCode == "1") {*/
				/*
				* "0": "队列中",
		        * "1": "扫描中",
		        * "2": "扫描完成",
		        * "3": "扫描失败"
				*/
				//var scanStatus = data.result.scanStatus;
				var scanStatus = id;
				//获取状态
				if (scanStatus == 1) {
					name = 'scaning';
				} else if (scanStatus == 2) {
					name = 'complete';
				} else if (scanStatus == 3) {
					name = 'fail';
				} else if (scanStatus == 0) {
					name = 'queue';
				}
				
			/*} else {
				msg("漏洞扫描", data.msg);
			}
			
		},
		error:function(err) {
			msg("漏洞扫描",'漏洞详情：error');
		}
	})*/
	
	return name;
	
	
}

//漏洞扫描 漏洞扫描列表
function holeScanState(holeTaskId) {
	
	$.ajax({
		url:'/om/vuln/scan/task',
		type:'GET',
		async:false,
		data: {taskId: holeTaskId},
		success:function(data) {
			
			if (data.retCode == "1") {
				
				var vulns = data.result.vulns; //获取扫描任务
				
				if (vulns == null || vulns.length < 1) {

					//holeWin("漏洞扫描", "正在启动，请稍后..", 1);
					//弹窗是否打开
					if ($(".holeWin ul.ips").length > 0) {
						//已打开
						$(".holeWin ul.ips").empty();
						$(".holeWin ul.ips").append(str);
						
					} else {
						if (isClick == true) {
							if (data.result.st.scanParam) {
								var scanParam = data.result.st.scanParam;
								holeWin("漏洞扫描", "", 3, scanParam);
							} else {
								holeWin("漏洞扫描", "", 3, "");
							}
							
							
						}
					}
					
				} else {
					
					if ($(".holeAsset").find("img").length <= 0){
						var str = '&nbsp;<img class="titleLoading" src="/static/img/assetLoad.png" width="20">';
						$(".holeAsset").append(str);
					}
					
					var str = "";
					var count = 0; //完成扫描数量计数
					for (var i in vulns) {
						if (vulns[i].scanStatus == 2) {
							count++;
						}
						//var tempName = getHoleIDStaus(vulns[i].scanId);//通过ID获取状态
						var tempName = getHoleIDStaus(vulns[i].scanStatus);
						str += '<li><i class="'+tempName+'"></i><span data="'+vulns[i].scanId+'">'+vulns[i].ipAddr+'</span></li>'; /*<a onclick="holeScanEndSige('+(result[i])+', \''+i+'\')" class="deletePort">x</a>*/
					
					}
					
					//完成数 是否等于 扫描总数 
					if (count == vulns.length) {
						
						//弹窗是否打开
						if ($(".holeWin ul.ips").length > 0) {
							//已打开
							$(".holeWin ul.ips").empty();
							$(".holeWin ul.ips").append(str);
							
						} else {
							if (isClick == true) {
								holeWin("漏洞扫描", "", 4, "扫描完成");
							}
						}
						
						
						if ($(".holeAsset").find("img").length > 0) {
							$(".holeAsset").find("img").remove();
						}
						
						holeTaskId = "";
						clearInterval(scanTime);
						lpageNum = 1;
						getAssetListTbl();
						
					} else {
						
						//弹窗是否打开
						if ($(".holeWin ul.ips").length > 0) {
							//已打开
							$(".holeWin ul.ips").empty();
							$(".holeWin ul.ips").append(str);
							
						} else {
							if (isClick == true) {
								holeWin("漏洞扫描", "", 3, str);
							}
						}
					}
					
					
					
					
					
				}
				
				
			} else {
				msg("漏洞扫描", data.msg);
			}
			
		},
		error:function(err) {
			msg("漏洞扫描",'漏洞详情：error');
		}
	})
}


//漏洞扫描 启动扫描
function holeAssetScaning(obj) {
	$(obj).css("pointer-events", "none");
	var holeidsStr = "";
	$("#assetTbl tr td a.checkbox").each(function() {
		if ($(this).hasClass("on")) {
			var asids = $(this).parents("tr").find("td").eq(1).text();
			holeidsStr += asids+",";
		}
	});
	
	$.ajax({
		url:'/om/vuln/scan/launch',
		type:'POST',
		async:true,
		
		data: {
			ips: holeidsStr
		},
		success:function(data) {
			
			
			$(obj).css("pointer-events", "auto");
			$(".holeWin").remove();
			
			if (data.retCode == "1") {
				var str = ' <img class="titleLoading" src="/static/img/assetLoad.png" width="20"/>';
				$(".holeAsset").append(str);
				
				if (data.result.taskId != "") {
					holeTaskId = data.result.taskId; //启动任务ID
					
					clearInterval(scanTime);
					scanTime = setInterval("holeScanState(holeTaskId)", 60000);
					console.log(scanTime);
					
					var str = "";
					$("#assetTbl tr td a.checkbox").each(function() {
						if ($(this).hasClass("on")) {
							var asids = $(this).parents("tr").find("td").eq(1).text();
							str += '<li><i class="queue"></i><span>'+asids+'</span></li>'; /*<a onclick="holeScanEndSige('+(map[i])+', \''+i+'\')" class="deletePort">x</a>*/
						}
					});
					
					holeWin("漏洞扫描", "", 3, str);
					
				}
				/*var map = data.result.map;
				var ipstr = "";
				//获取扫描ip对应的任务id
				for (var i in map) {
					holeArr.push({
						ip: i,
						id: map[i]
					});
					ipstr += '<li><i class="queue"></i><span>'+i+'</span></li>'; <a onclick="holeScanEndSige('+(map[i])+', \''+i+'\')" class="deletePort">x</a>
				}
				//扫描中提示
				holeWin("漏洞扫描", "", 3, ipstr);
				*/
				
				
			} else if (data.retCode == "0") {
				
				//异常，不能经常漏洞扫描
				var portScans = data.result.portScans;
				var vulnScans = data.result.vulnScans;
				
				var portStr = "";
				for (var i in portScans) {
					portStr += portScans[i]+" ";
				}
				
				var vulnStr = "";
				for (var j in vulnScans) {
					vulnStr += vulnScans[j]+" ";
				}
				
				
				if (portStr != "" || vulnStr != "") {
					var str = "";
					if (portStr != "") {
						str += portStr = "<li>正在进行端口扫描："+portStr+"</li>";
					}
					if (vulnStr != "") {
						str += vulnStr = "<li>正在进行漏洞扫描："+vulnStr+"</li>";
					}
					holeWin("漏洞扫描", "", 4, str);
				} else {
					var scanIp = data.result.scanIp;
					if (scanIp.indexOf(",") < 0) {
						holeWin("漏洞扫描", scanIp+"近期已完成漏洞扫描，请重新选择", 1);
					} else {
						var list = scanIp.split(",");
						var str = "";
						for (var i = 0; i < list.length; i++) {
							str += list[i]+"<br/>";
						}
						holeWin("漏洞扫描", str+"近期已完成漏洞扫描，请重新选择！", 1);
					}
					
				}
				
				
			} else {
				
				msg("漏洞扫描", data.msg);
			}
			
		},
		error:function(err) {
			msg("漏洞扫描",'扫描中：error');
		}
	})
}


//漏洞扫描  是否扫描
function holeAssetBtn(obj) {
	
	
	if ($(".findAsset").find("img").length > 0 || $(".portAsset").find("img").length > 0) {
		msg("提示", "正在执行其他任务，请稍后..");
		return;
	}
	
	if ($(obj).find("img").length > 0) {
		//扫描中  查看扫描状态
	
		isClick = true;
		clearInterval(scanTime);
		if (holeArr.length <= 0) {
			scanTime = setInterval("holeScanState(holeTaskId)", 60000);
			holeScanState(holeTaskId);
		} else {
			scanTime = setInterval("holeScanStateInit()", 60000);
			holeScanStateInit()
		}
		
		
	} else {
		
		var flag = false;
		var count = 0;
		var holeidsStr = "";
		$("#assetTbl tr td a.checkbox").each(function() {
			if ($(this).hasClass("on")) {
				flag = true;
				count ++;
				var asids = $(this).parents("tr").find("td").eq(1).text();
				holeidsStr += asids+",";
			}
		});
		if (!flag) {
			holeWin("漏洞扫描", "请先选择相应资产，再进行漏洞扫描！", 1);
			return false;
		}
		
		holeWin("漏洞扫描", "您将对所选的资产进行漏洞扫描，是否继续执行？", 2);
		
		
	}
}

//漏洞扫描  取消扫描
function holeAssetScanEnd() {
	//是否取消扫描
	holeWin("漏洞扫描", "", 5);
}
//漏洞扫描 批量取消
function holeScanEnd() {
	
	
	$("#holeWin5").remove();
	if (holeTaskId != "") {
		$.ajax({
			url:'/om/vuln/scan/stopTask',
			type:'POST',
			async:false,
			data: {
				taskId: holeTaskId
			},
			success:function(data) {
				
				
				if (data.retCode == "1") {
					
					//删除 holeArr
					
					clearInterval(scanTime);
					
					//是否取消正在扫描的状态
					if ($(".holeAsset").find("img").length > 0) {
						$(".holeAsset").find("img").remove();
					}
					
					$(".holeWin .ipsList ul li").empty();
					$(".holeWin").remove();
					msg("漏洞扫描", "取消成功！");
					
					
				} else {
					msg("漏洞扫描", data.msg);
				}
				
			},
			error:function(err) {
				msg("漏洞扫描",'取消扫描（单个）：error');
			}
		})
	} else {
		for (var i = 0 ; i < holeArr.length; i++) {
			var id = holeArr[i].id;
			var ip = holeArr[i].ip;
			holeScanEndSige(id, ip);
			
		}
		$(".holeWin").remove();
	}

	
}

//漏洞扫描  单个取消
function holeScanEndSige(id, ip) {
	var id = id;
	var ip = ip;
	/*if (id == "-1") {
		var ip = $(obj).parent("li").find("span").text();
		for (var i = 0 ; i < holeArr.length; i++) {
			if (ip == holeArr[i].ip) {
				id = holeArr[i].id;
			}
		}
	}*/
	
	
	//结束扫描
	$.ajax({
		url:'/om/vuln/scan/stop',
		type:'POST',
		async:false,
		data: {
			scanId: id
		},
		success:function(data) {
			
			
			if (data.retCode == "1") {
				
				//删除 holeArr
				/*var ip = $(obj).parent("li").find("span").text();
				for (var i = 0 ; i < holeArr.length; i++) {
					if (ip == holeArr[i].ip) {
						holeArr.splice(i, 1);
					}
				}*/
				
				for (var i = 0 ; i < holeArr.length; i++) {
					if (id == holeArr[i].id) {
						holeArr.splice(i, 1);
					}
				}
				
				var count = 0;
				$(".holeWin .ipsList ul li").each(function() {
					var tempIp = $(this).find("span").text();
					if (ip == tempIp) {
						$(this).remove();
					}
					count++;
				});
				
				
				
				//是否取消正在扫描的状态
				if ($(".holeAsset").find("img").length > 0) {
					$(".holeAsset").find("img").remove();
				}
				
				//是否关闭弹窗
				if (count <= 1) {
					$(".holeWin").remove();
					msg("漏洞扫描", "取消成功！");
				}
				
				
			} else {
				msg("漏洞扫描", data.msg);
			}
			
		},
		error:function(err) {
			msg("漏洞扫描",'取消扫描（单个）：error');
		}
	})
}

//漏洞扫描 漏洞列表
var clientID, clinetIP; 
function getHoleList(id, ip) {
	clientID = id;
	clinetIP = ip;
	$.ajax({
		url:'/om/vuln/manager/search',
		type:'GET',
		async:true,
		
		data: {
			assetsId: id,
			assetsIp: ip,
			cveNo: '',
			vulnName: '',
			vulnType: '',
			level: '',
			fixStatus: '',
			pageNo: 1,
			cnvdNo: '',
		},
		success:function(data) {
			
			$("#holeDetail tbody").empty();
			if (data.retCode == "1") {
				
				var list = data.result.results;
				var listStr = "";
				for (var i = 0; i < list.length; i++ ) {
					
					var level_t = getNameStr(vulnLevel, list[i].level);
					var fixStatus_t = getNameStr(fixStatus, list[i].fixStatus);
					
					listStr += "<tr data='"+list[i].id+"'>" +
									"<td><span class='overelise'>"+list[i].cveNo+"</span></td>" +
									"<td><span class='overelise'>"+list[i].vulnName+"</span></td>" +
									"<td><span class='overelise'>"+list[i].vulnType+"</span></td>" +
									"<td><span class='overelise'>"+level_t+"</span></td>" +
									"<td><span class='overelise'>"+list[i].assetsIp+"</span></td>" +
									"<td class='fixStatus' data='"+list[i].fixStatus+"'><span class='overelise'>"+fixStatus_t+"</span></td>" +
									"<td><span class='overelise'>"+list[i].uptime+"</span></td>" +
									"<td><a href='javascript:;' onclick='showDisposs(this)'>处理</a>&nbsp;&nbsp;<a href='javascript:;' onclick='holeInfo(this)'>详情</a></td>" +
								"</tr>";
				}
				
				$("#holeDetail tbody").append(listStr);
				$("#assetDetail").show();
				
			} else {
				msg("漏洞扫描", data.msg);
			}
			
		},
		error:function(err) {
			msg("漏洞扫描",'漏洞列表：error');
		}
	})
}

//漏洞扫描  处理
function showDisposs(obj) {
	var id = $(obj).parents("tr").attr("data");
	$("#disposeFrom input[name='vulnId']").val(id);
	

	var status = $(obj).parents('tr').find("td.fixStatus").attr("data");
	if (status == '2') {
		$("#disposeFrom .radio.wcl").prop("disabled", true);
	} else {
		$("#disposeFrom .radio.wcl").attr("disabled", false);
	}
	show('disposeWin');
}

//漏洞扫描  提交处理
function saveHolefix() {
	var vulnId = $("#disposeFrom input[name='vulnId']").val();
	var fixStatus = $("#disposeFrom input[name='fixStatus']").val();
	var explain = $("#disposeFrom textarea[name='explain']").val();
	$.ajax({
		url:'/om/vuln/manager/fix',
		type:'POST',
		async:true,
		
		data: {
			vulnId: vulnId,
			fixStatus: fixStatus,
			explain: explain
		},
		success:function(data) {
			if (data.retCode == "1") {
				
				msg("漏洞处理", "提交成功，已处理！");
				hide('disposeWin');
				getHoleList(clientID, clinetIP);
				
			} else {
				msg("漏洞处理", data.msg);
			}
			
		},
		error:function(err) {
			msg("漏洞处理",'漏洞处理：error');
		}
	})
	
}

//漏洞扫描  获取类型对应的中文
function getNameStr(arr, param) {
	var result = "";
	for (var i = 0; i < arr.length; i++) {
		if (arr[i].type == param) {
			result = arr[i].value;
		} 
	}
	return result;
}


//漏洞扫描 漏洞详情
function holeInfo(obj) {
	var id = $(obj).parents("tr").attr("data");
	if(id != "") {
		$.ajax({
			url:'/om/vuln/manager/detail/'+id,
			type:'GET',
			async:true,
			
			data: {},
			success:function(data) {
				
				if (data.retCode == "1") {
					$("#holeInfo").empty();
					var result = data.result;
					var table = "<tr>" +
									"<td width='80'>漏洞名称：</td><td width='400'>"+(result.vulnName == null ? '' : result.vulnName)+"</td><td width='80'>负责人：</td><td width='400'>"+(result.assetsUser == null ? '' : result.assetsUser)+"</td>"+
								"</tr>"+
								"<tr>" +
									"<td>CVE编号：</td><td>"+(result.cveNo == null ? '' : result.cveNo)+"</td><td>关联邮箱：</td><td>"+(result.email == null ? '' : result.email)+"</td>"+
								"</tr>"+
								"<tr>" +
									"<td>CNVD编号：</td><td>"+''+"</td><td>漏洞分类：</td><td>"+(result.vulnType == null ? '' : result.vulnType)+"</td>"+
								"</tr>"+
								"<tr>" +
									"<td>关联资产：</td><td>"+(result.assetsName == null ? '' : result.assetsName)+"</td><td>风险等级：</td><td>"+(result.level == null ? '' : result.level)+"</td>"+
								"</tr>"+
								"<tr>" +
									"<td>主机IP：</td><td>"+(result.hostType == null ? '' : result.hostType)+"</td><td>发现时间：</td><td>"+(result.createDate == null ? '' : result.createDate)+"</td>"+
								"</tr>"+
								"<tr style='height:100px'>" +
									"<td>漏洞简介：</td><td colspan='3'>"+(result.introduce == null ? '' : result.introduce)+"</td>"+
								"</tr>"+
								"<tr style='height:100px'>" +
									"<td>修复方案：</td><td colspan='3'>"+(result.fixSolution == null ? '' : result.fixSolution)+"</td>"+
								"</tr>"+
								"<tr style='height:100px'>" +
									"<td>修复指南：</td><td colspan='3'>"+''+"</td>"+
								"</tr>"+
								"<tr style='height:100px'>" +
									"<td>处理状态：</td><td colspan='3'>"+(result.fixStatus == null ? '' : result.fixStatus)+"</td>"+
								"</tr>"+
								"<tr style='height:100px'>" +
									"<td>处理说明：</td><td colspan='3'>"+(result.fixAction == null ? '' : result.fixAction)+"</td>"+
								"</tr>";
					
					$("#holeInfo").append(table);
					$("#holeDetailBox").show();
					
					
				} else {
					msg("漏洞扫描", data.msg);
				}
				
			},
			error:function(err) {
				msg("漏洞扫描",'漏洞详情：error');
			}
		})
	} else {
		msg("漏洞详情", "暂无详情");
	}
}



/*
 * 页面初始化接口 
 *
 ****/

//漏洞列表初始化参数
function getHoleListParm() {
	$.ajax({
		url:'/om/vuln/constants',
		type:'GET',
		async:true,
		
		data: {},
		success:function(data) {
			if (data.retCode == "1") {
				
				var result = data.result;
				for (var i in result.vulnLevel) {
					vulnLevel.push({
						type: i,
						value : result.vulnLevel[i],
					});
				}
				for (var j in result.fixStatus) {
					fixStatus.push({
						type: j,
						value : result.fixStatus[j],
					});
				}
				
				
			} else {
				msg("漏洞扫描", data.msg);
			}
			
		},
		error:function(err) {
			msg("漏洞扫描",'漏洞列表参数：error');
		}
	})
}

//漏洞扫描  初始化查看漏洞扫描状态
function getHoleScanStatus() {
	
	$.ajax({
		url:'/om/vuln/scan/running',
		type:'GET',
		async:true,
		
		data: {},
		success:function(data) {
			
			
			if (data.retCode == "1") {
				
				var result = data.result;
				
				holeArr.splice(0, holeArr.length);
				
				if (result.running) {
					var running = result.running;
					//获取扫描ip对应的任务id
					for (var i in running) {
						holeArr.push({
							ip: i,
							id: running[i]
						});
					}
				}
				if (holeArr.length > 0) {
					
					if ($(".holeAsset").find("img").length <= 0) {
						var str = '&nbsp;<img class="titleLoading" src="/static/img/assetLoad.png" width="20">';
						$(".holeAsset").append(str);
					}
					
					clearInterval(scanTime);
					scanTime = setInterval("getHoleScanStatus()", 60000);
					
					
					
					if (result.queue) {
						var queue = result.queue;
						//获取扫描ip对应的任务id
						for (var i in queue) {
							holeArr.push({
								ip: i,
								id: ''
							});
						}
					}
					
					
				}
				
				
				/*
				
				if (data.result == null || JSON.stringify(data.result) == "{}") {
					
					//无扫描任务
					if ($(".holeAsset").find("img").length > 0){
						$(".holeAsset").find("img").remove();
					}
					
					clearInterval(scanTime);
					
					
				} else {
					//有扫描任务
					
					if ($(".holeAsset").find("img").length <= 0) {
						var str = '&nbsp;<img class="titleLoading" src="/static/img/assetLoad.png" width="20">';
						$(".holeAsset").append(str);
					}
					
					clearInterval(scanTime);
					scanTime = setInterval("getHoleScanStatus()", 60000);
					console.log(scanTime);
					
					holeArr.splice(0, holeArr.length);
					var result = data.result;
					//获取扫描ip对应的任务id
					for (var i in result) {
						holeArr.push({
							ip: i,
							id: result[i]
						});
					}
					
				}*/
				
				
			} else {
				msg("漏洞扫描", data.msg);
			}
			
		},
		error:function(err) {
			msg("漏洞扫描",'漏洞详情：error');
		}
	})
}


//查询扫描状态: 资产扫描、端口扫描
function getScanState() {
	 $.ajax({
			url:'/om/scantask/taskStatus',
			type:'GET',
			async:true,
			
			data: {},
			success:function(data) {
				
				
				if (data.retCode == "1") {
					
					var result = data.result.queue; //排队扫描
					
					/*var str = '&nbsp;<img src="static/img/assetLoading.gif"/>';*/
					var str = '<img class="titleLoading" src="/static/img/assetLoad.png" width="20"/>';
					var isPort = false, isAsset = false;
					//有排队或正在扫描的端口、资产
					if (result.length > 0) {
						
						isAsset = true;
						for (var i = 0; i < result.length; i ++) {
							
							if (result[i].scanPortLogs != null) {
								isPort = true;
								for (var k in result[i].scanPortLogs) {
									scanId = result[i].scanPortLogs[k].scanId;
								}
							} else {
								scanId = result[i].scanTask.scanId;
							}
							
							var scanType = result[i].scanTask.scanType; //扫描任务状态
							
							var sName = "";
							if (scanType == 2) {
								//端口扫描
								sName = "portAsset";
							} else if (scanType == 3) {
								//漏洞扫描
								sName = "holeAsset";
							} else if (scanType == 1) {
								//资产扫描
								sName = "findAsset";
							}
							
							var scanStatus = result[i].scanTask.scanStatus;
							//扫描状态     "0": "队列中",   "1": "扫描中",    "2": "扫描完成",    "3": "扫描失败"
							
							if (scanStatus == 0 || scanStatus == 1) {
								 if ($("."+sName).find("img").length <= 0) {
									 $("."+sName).append(str);
								 }
							}
							
						}
						
						if (isPort) {
							
							clearInterval(scanTime);
							scanTime = setInterval("getScanState()", 60000);
							console.log(scanTime);
						}
						if (isAsset) {
							
							clearInterval(scanTime);
							scanTime = setInterval("findAssetStatus(1)", 60000);
							console.log(scanTime);
						}
						
					} else {
						
						if ($(".findAsset").find("img").length > 0) {
							$(".findAsset").find("img").remove();
						}
						
						if ($(".portAsset").find("img").length > 0) {
							$(".portAsset").find("img").remove();
						}
						
						clearInterval(scanTime);
					}
					
					//查看漏洞扫描状态
					getHoleScanStatus();
					
				} else {
					
					portWin("扫描", data.msg, 1);
				}
				
				console.log("getScanState over ....");
			},
			error:function(err) {
				msg("扫描", '扫描：error');
			}
	})
}


//全局变量
var lpageNum = 1,
	spageNum = 1,
	condition = '',
	isfirstLoad = true,
	sisfirstLoad = true,
	assetsType = '',
	hostType = '',
	officeId = '',
	taskid = '',
	scanId = 0,
	holeArr = [],
	vulnLevel = [],
	fixStatus = [],
	holeTaskId = "",
	isClick = false,
	scanTime = null;

//初始化
function inIt() {
	
	//资产列表
	getAssetListTbl();
	
	//新增（修改）资产：所属机构 
	getOrganizationList();
	
	//初始化下拉列表接口
	getselectedInit();
	
	//资产发现、端口扫描状态查询
	getScanState();
	
	
	//获取漏洞列表类型参数
	getHoleListParm();
	
	 
	 var bodyHeight = $("body").height();
	 var contentHeight = bodyHeight - 73;
	 $("#tanffic").css("height", contentHeight+"px");
}

inIt()