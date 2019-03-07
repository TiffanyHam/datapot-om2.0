/* 将时间戳转为日期格式*/
function fmtDate(date){
	var date = new Date(date);
	Y = date.getFullYear() + '-';
	M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
	D = date.getDate() < 10 ? '0'+ date.getDate() + ' ' : date.getDate() + ' ';
	h = date.getHours() < 10 ? '0'+ date.getHours() + ':' : date.getHours() + ':';
	m = date.getMinutes() < 10 ? '0'+ date.getMinutes() + ':' : date.getMinutes() + ':';
	s = date.getSeconds() < 10 ? '0'+ date.getSeconds() : date.getSeconds(); 
	return Y+M+D+h+m+s;
}

/* 通过key 返回 value */
function getOptionName(stageName, index) {
	for(var i in stageName) {
		if(index == i) {
			return stageName[i];
		}
	}
	return '';
}


/* 获取数组中最大值 */
function getMaxArr(arr){
	if (arr.length > 0){
		var max = arr[0];
		for(var i in arr){
			if (arr[i] > max) {
				max = arr[i];
			}
		}
		return max;
	} else {
		return 0;
	}
	
}

/* 数组去重 */
function clearSameNum(arr) {
	var res = [];
	var json = {};
	for(var i = 0; i < arr.length; i++) {
		if(!json[arr[i]]) {
			res.push(arr[i]);
			json[arr[i]] = 1;
		}
	}
	return res;
}

/* 随机数 */
// 0 - 100 以内 
function RndNum(n){
	var rnd = 0;
	if (n < 10){
		rnd = Math.random()*80;
	} else if (n > 10 && n < 50){
		rnd = Math.random()*n;
	}
	
	rnd < 0 ? rnd = 0 : rnd = rnd;
	rnd > 100 ? rnd = 100 : rnd = rnd;
	
    return rnd;
}
/*
 * 不重复的随机数
 */
var topRandArray = new Array,
	leftRanArray = new Array;
function rndNumFun() {
	var count = 51;
	//给原数组originalArray赋值 
	for (var i = 0; i < count; i++){
		//topRandArray[i] = Math.floor(Math.random()*98);
		//leftRanArray[i] = Math.floor(Math.random()*95);
		topRandArray[i] = i*1.9;
		leftRanArray[i] = i*1.9;
	}
	
	
	topRandArray.sort(function(){ 
		return 0.5 - Math.random(); 
	});
	leftRanArray.sort(function(){ 
		return 0.5 - Math.random(); 
	});
	
	/*
	for (var k = 0; k < leftRanArray.length; k++){
		console.log(leftRanArray[k]);
	}
	console.log("=============================");
	for (var j = 0; j < topRandArray.length; j++){
		console.log(topRandArray[j]);
	}*/
	
}
rndNumFun();



/* 统计字符长度 */
function strLength(str){
	var l = str.length;
	var blen = 0;
	for(i = 0; i < l; i ++) {
		if ((str.charCodeAt(i) & 0xff00) != 0) {
			blen ++;
		}
		blen ++;
	}
	
	return blen;
}

/* 对象拷贝*/
function deepCopy(obj){
    if(typeof obj != 'object'){
        return obj;
    }
    var newobj = {};
    for ( var attr in obj) {
        newobj[attr] = deepCopy(obj[attr]);
    }
    return newobj;
}


/* 核心资产、非核心资产 */
function isKeyStrFun (isKey) {
	var keyStr = '';
	isKey == 1 ? keyStr = '<i class="star_i"></i>' : keyStr = '<i class="ic_host"></i>';
	return keyStr;
}

/* 威胁度 / 可信度  等级颜色数*/
var threatGradeColor = ["#545864", "#8b8e98", "#ffc100", "#fa7420", "#ee1029"];  //0 1 2 3 4

function threatGradeFun(threat, certainty){
	
	var x = certainty;
	var y = threat;
	
	//危急状态
	var class_a = '';
	if (x <= 0 && y <= 0){
		//安全
		class_a = 'roundBgc_dgray';
	} else if (x < 50 && y < 50) {
		//低危
		class_a = 'roundBgc_gray';
	} else if (x < 50 && y >= 50) {
		//高危
		class_a = 'roundBgc_orange';
	} else if (x >= 50 && y < 50) {
		//中级
		class_a = 'roundBgc_yellow';
	} else if (x >= 50 && y >= 50) {
		//严重
		class_a = 'roundBgc_red';
	}
	
	return class_a;
}

function threatGradeNumFun(threat, certainty){
	
	var x = certainty;
	var y = threat;
	
	//危急状态
	var num = '';
	if (x <= 0 && y <= 0){
		//安全
		num = 0;
	} else if (x < 50 && y < 50) {
		//低危
		num = 1;
	} else if (x < 50 && y >= 50) {
		//高危
		num = 3;
	} else if (x >= 50 && y < 50) {
		//中级
		num = 2;
	} else if (x >= 50 && y >= 50) {
		//严重
		num = 4;
	}
	
	return num;
}

function msgDialog(title, msg, isSucess) {
	var str = '<div class="Success_Bomb" id="LabeldialogMsg" style="display: block;">'+
		'<div class="upgradeBomb_content">'+
			'<p class="close"><img src="/static/img/close.png" width="18" height="17" onclick="removeMsg('+isSucess+')"></p>'+
			'<h3 class="succ_title" title=""><span>'+title+'</span></h3>'+
			'<div class="">'+
				'<p class="succ_Desc" id="message">'+msg+'</p>'+
				'<div class="btns">'+
					'<span class="saveBtn" onclick="removeMsg('+isSucess+')">确认</span>'+
				'</div>'+
			'</div>'+
		'</div>'+
	'</div>';
		
	$(".hostPage").append(str);
}
/*标签*/
var labelNameArr = [];
function addLabel(obj){
	
	var officeId=$("#officeId").val();
	if(officeId=="-----请选择-----"){
		$("#officeMessage").show();
		$("#officeMessage").html("请选择所属机构");
		return;
	}else{
		$("#officeMessage").hide();
		/*$("#officeMessage").attr("display","none");*/
	}
	
	if($("#hostTypeId").val()=="-----请选择-----"){
		$("#hostTypeIdMessage").html("请选择主机类型");
		$("#hostTypeIdMessage").show();
		return;
	}else{
		$("#hostTypeIdMessage").hide();
	}
	
	labelNameArr.splice(0, labelNameArr.length);
	$(".labelName").empty();
	var _selectTwo = "";
	
	var _checkbox = $(obj).parents(".particulars").find(".h_labelSelectOption input");
	_checkbox.each(function(index) {
		if ($(this).is(':checked') == true) {
			_selectTwo += $(this).val()+",";
			labelNameArr.push($(this).parent("label").text());
		}
	})
	if(_selectTwo==null||_selectTwo==""){
		$("#tagsMessage").html("请选择所属标签");
		$("#tagsMessage").show();
		return;
	}else{
		$("#tagsMessage").hide();
	}
	_selectTwo =_selectTwo.substring(0, _selectTwo.lastIndexOf(","));
	
	$.ajax({
  		url:"/om/host_tag/host_tags_save",
  		type:'POST',
  		async:true,
  		cache:true,
  		data:{
  			"officeId":$("#officeId").val(),
  			"hostTypeId":$("#hostTypeId").val(),
  			"hostTags":_selectTwo,
  			"hostName":$(".hostIp_label").text(),
  			"hostIp":$(".hd_ipInfo .hostIp_host").text(),
  			"hostId":$("#hostId").val()
  		},
  		success:function(data) {
  			var msg = data.msg;
  			var isSucess=data.retCode;
  			msgDialog('新增标签',msg, isSucess);
  		},
  		error:function(e){
  			
  		}
	})
	
}

function removeMsg(isSucess){
	var templabelName = "";
	if (isSucess == '1') {
		removeLabelWin();
		for (var i = 0 ; i < labelNameArr.length; i++) {
			templabelName += "<a href='#'>"+labelNameArr[i]+"</a>";
		}
		$(".labelName").append(templabelName);
	}
	$("#LabeldialogMsg").remove();
	
	
}

function removeLabelWin() {
	checkSeleCount = 0;
	$("#label_w").remove();
}

var offices = "";
var hostTgas = "";
var hostTypes = "";
function showAddLabel() {
	$.ajax({
  		url:"/om/host_tag/get_tags_infos",
  		type:'POST',
  		async:true,
  		cache:true,
  		data:{"hostName":$(".hostIp_label").text()},
  		success:function(results) {
  			
  			editTags(results);
  		},
  		error:function(e){
  			
  		}
	
	});
	
	/*var addLabel = '<div class="description" id="label_w" style="display:block;">'+
					'<div class="particulars" style="width:250px">'+
						'<div class="text_edit clearfix">'+
							'<h3 class="succ_title"><span>添加标签：</span></h3>'+
							'<p class="close"><img src="/static/img/close.png" width="18" height="17" onclick="removeLabelWin()"></p>'+
							'<p class="txt_enter"><input type="text" placeholder="请输入标签名" class="label_name" style="width:197px;"/></p>'+
							'<div class="info_btns">'+
								'<p><span class="btn1 cancel" onclick="removeLabelWin()">取消</span><span class="btn1 labelbtn" onclick="addLabel(this)">提交</span></p>'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>';
	*/
}

function showLabelSelecte(obj){
	var event = window.event || arguments.callee.caller.arguments[0];
	event.cancelBubble=true;
	$(obj).find(".h_labelSelectOption").css({"display":"block"});
}

function hideLbelSelecte(obj) {

	$(obj).find(".h_labelSelectOption").css({"display":"none"});
}

var checkSeleCount = 0;
//checkbox 点击
function seletedCheckbox(obj) {
	
	var state = 0; //选中或取消选中
	if ($(obj).is(':checked') == true) {
		checkSeleCount ++;
	} else {
		state = 1;
		checkSeleCount --;
	}
	
	if (checkSeleCount >= 2) {
		//选中个数大于2
		$(".cSelectedNum").text(checkSeleCount+" selected");
	} else if (checkSeleCount == 1) {
		//只选中一个
		var tempTxt = "";
		if (state == 1) {
			//取消当前checkbox选中
			$(".h_labelSelectOption ul li input").each(function(){
				if ($(this).is(':checked') == true) {
					tempTxt = $(this).parent("label").text();
				}
			})
		} else {
			tempTxt = $(obj).parent("label").text();
		}
		$(".cSelectedNum").text(tempTxt+"");
		
	} else {
		//未选中
		$(".cSelectedNum").text("-----请选择-----");
	}
}

function editTags(data){
	
	offices = data.result.offices;
	hostTgas = data.result.hostTags;
	hostTypes = data.result.hostTypes;
		
		// 第一个下拉框
	var _selectOne = "<div style='margin:0 0 0 121px;clear:both;'><span class='select_city_label'><span style='color:#a11a19;'>*</span>所属机构：</span><div class='select_city select_city_label'><span class='posRe'><select id='officeId'  name='officeId' onchange=''>";
	_selectOne+="<option>-----请选择-----</option>";
	$.each(offices, function(i, n) {
		_selectOne+="<option id='officeId_"+n.officeId+"' value='"+n.officeId+"'>"+n.officeName+"</option>";
	});
	_selectOne+="</select><i class='triangle-down selectedBtn'></i></span><span id='officeMessage' style='margin-top: 48px;color: #a11a19;'></span></div></div>";
	
	// 第二个下拉框
	var checkedStr = '<div class="cSelectedNum">-----请选择-----</div>';
	if (data.result.hostJoinTags !== undefined) {
		var checkedNum = data.result.hostJoinTags.length;//选中标签的个数
		if (checkedNum >= 2) {
			checkedStr = '<div class="cSelectedNum">'+checkedNum+' selected</div>';
			checkSeleCount = checkedNum;
		} else if (checkedNum == 1) {
			var _index = data.result.hostJoinTags[0].tagId;
			$.each(data.result.hostTags, function(j, elem) {
				if (_index == elem.id) {
					checkedStr = '<div class="cSelectedNum">'+elem.tagName+'</div>';
				}
				
			})
			checkSeleCount = 1;
		}
	}
	
	var _selectTwo = '<div style="margin:0 0 0 121px;clear:both;"><span class="select_city_label"><span style="color:#a11a19;">*</span>所属标签：</span><div class="select_city_label select_city posRe" style="width:144px" onclick="showLabelSelecte(this)">'+
							'<div class="h_labelSelect">'+
								checkedStr+
							'</div>'+
							'<i class="triangle-down selectedBtn" style="left: -23px;top: 5px;"></i>'+
							'<div class="posAb h_labelSelectOption" style="display:none">'+
							'<ul class="multiselect-container dropdown-menu">';
							
	$.each(hostTgas, function(i, n) {
		//_selectTwo+="<option value='" + n.id + "'>" + n.tagName+"</option>";
		_selectTwo += '<li class="multiselect-item multiselect-all">'+
						'<a tabindex="'+n.id+'" class="multiselect-all">'+
							'<label class="checkbox"><input type="checkbox" id="checkboxTags_'+n.id+'" value="'+n.id+'" onclick="seletedCheckbox(this)"/>'+n.tagName+'</label>'+
						'</a>'+
					'</li>';
	});
	_selectTwo += '</ul></div></div><span id="tagsMessage" class="select_city_label" style="margin-top:30px;color:#a11a19;"></span></div>';
		
	
	
	// 第三个下拉框
	var _selectThree = "<div style='margin:0 0 0 121px;clear:both;'><span class='select_city_label'><span style='color:#a11a19;'>*</span>主机类型：</span><div class='select_city select_city_label'><span class='posRe'><select id='hostTypeId' name='hostTypeId' onchange=''>";
	_selectThree+="<option>-----请选择-----</option>";
	$.each(hostTypes, function(i, n) {
		_selectThree+="<option id='hostType_" + i + "' value='" + i + "'>" + n + "</option>";
	});
	_selectThree+="</select><i class='triangle-down selectedBtn'></i></span><span id='hostTypeIdMessage' style='margin-top: 48px;color: #a11a19;'></span></div></div>";
	
	var addLabel = '<div class="description" id="label_w" style="display:block;">'+
						'<div class="particulars" style="width:466px;height: 292px;" onclick="hideLbelSelecte(this)">'+
						'<div class="text_edit clearfix">'+
							'<h3 class="succ_title"><span>添加标签：</span></h3>'+
							'<p class="close"><img src="/static/img/close.png" width="18" height="17" onclick="removeLabelWin()"></p>'+
							'<input type="hidden" id="hostId" value="">'+
							_selectOne+_selectThree+_selectTwo+
							'<div class="info_btns" style="margin-top:46px">'+
								'<p><span class="btn1 labelbtn" onclick="addLabel(this)">提交</span><span class="btn1 cancel" onclick="removeLabelWin()">取消</span></p>'+
							'</div>'+
						'</div>'+
					'</div>'+
					'</div>';
	$(".hostPage").append(addLabel);
	
	if(data.result.hostInfo!=null){
		
		$("#hostId").val(data.result.hostInfo.id);	
		$("#officeId_"+data.result.hostInfo.officeId).attr("selected",true);
		$("#hostType_"+data.result.hostInfo.hostType).attr("selected",true);
		$("#officeId").attr("disabled","disabled");
		$("#hostTypeId").attr("disabled","disabled");
	}/*else{
		$("#officeId_"+data.result.hostInfo.officeId).removeAttr("disabled");
		$("#hostType_"+data.result.hostInfo.hostType).removeAttr("disabled");
	}*/
	$.each(data.result.hostJoinTags, function(i, n) {
		//_selectTwo+="<option value='" + n.id + "'>" + n.tagName+"</option>";
		$("#checkboxTags_"+n.tagId).attr("checked",'checked');
	});
	
}


/*处理*/
function showDispose(obj) {
	
	var _detectId = $(obj).attr("data");
	$.ajax({
  		url:"/om/detect_triage/edit",
  		type:'POST',
  		async:true,
  		cache:true,
  		data:{
  			"hostThreatId":_detectId
  		},
  		success:function(data) {
  			
  			
  			if (data.retCode == '1'){
  			var result = data.result;
  			
  			
  			var _status = 0, _id = null, _remarks = "";
  			var _input = '';
  			if (result.info != null){
  				_status = result.info.dealStatus;
  				_id = result.info.id;
  				_remarks = result.info.remarks;
  			}
  			
  			//处理方式
  			var dsObj = result.detectionStatus;
  			for (var i in dsObj){
  				if (i == _status){
  					_input += '<input type="radio" name="disposeRadio" value="'+i+'" checked="checked">&nbsp;'+dsObj[i]+'&nbsp;&nbsp;&nbsp;';
  				} else {
  					_input += '<input type="radio" name="disposeRadio" value="'+i+'">&nbsp;'+dsObj[i]+'&nbsp;&nbsp;&nbsp;';
  				}
  			}
  			
  			//白名单 、已修复
  			var submitStr = '';
  			if (_status == '2' || _status == '1') {
  				submitStr = '<p><span class="btn1 submit" id="btnDispose" style="color:#444;">提交</span></p>';
  			} else {
  				submitStr = '<p><span class="btn1 submit" id="btnDispose" onclick="sendDispose(this,'+_detectId+','+_id+')">提交</span></p>';
  			}
  			
  			var dispose = '<div class="BombBox announBox" id="disposeDiv" style="display: block;">'+
							'<div class="announBox_cont detecte" style="width:490px!important">'+
								'<form id="" novalidate="novalidate">'+
									'<div class="text_edit">'+
										'<h3 class="succ_title"><span id="">处理</span></h3>'+
										'<p class="close"><img src="/static/img/close.png" width="18" height="17" onclick="removeDisposeWin()"></p>'+
										'<div class="clearfix bomb">'+
											'<p class="error_str"></p>'+
											'<div class="info_edit f_left">'+
												'<p class="txt_enter clearfix"><label>处理方式：</label>'+_input+
												/*'<input type="radio" name="disposeRadio" value="0" checked="checked">&nbsp;待处理&nbsp;&nbsp;&nbsp;'+
												'<input type="radio" name="disposeRadio" value="1">&nbsp;加入白名单&nbsp;&nbsp;&nbsp;'+
												'<input type="radio" name="disposeRadio" value="2">&nbsp;已修复</p>'+*/
											'</div>'+
											'<p class="area_enter"><label style="font-size:14px;">处理说明：</label><textarea name="explain" id="explain" rows="" cols="" style="width:280px" maxLenght="200">'+_remarks+'</textarea></p>'+
										'</div>'+
										'<div class="info_btns">'+
											submitStr+
											'<p><span class="btn1 cancel" onclick="removeDisposeWin()">取消</span></p>'+
										'</div>'+
									'</div>'+
								'</form>'+
							'</div>'+
						'</div>';
	
	
  				$(".hostPage").append(dispose);
  				
  			} else {
  				
  			}
  		},
  		error:function(e){
  			
  		}
	})
	
}

function sendDispose(obj,hostThreatId,update_id){
	
	var _remarks = $(obj).parents("#disposeDiv").find(" #explain").val(); //处理说明
	if (_remarks != ""){
		
		var _eLength = strLength(_remarks);
		if (_eLength > 200){
			$("#disposeDiv .error_str").text("请输入两百字以内的处理说明");
			return false;
		}
		
		var _dStatus = $(obj).parents("#disposeDiv").find("input[type='radio']:checked").val(); //处理方式
		
		$.ajax({
	  		url:"/om/detect_triage/save",
	  		type:'POST',
	  		async:true,
	  		cache:true,
	  		data:{
	  			"hostThreatId": hostThreatId,
	  			"id": update_id,
	  			"dealStatus": _dStatus,
	  			"remarks": _remarks
	  		},
	  		success:function(data) {
	  			
	  			msgDialog('处理',data.msg);
	  			if (data.retCode == '1'){
	  				$("#disposeDiv").remove();
	  			}
	  		},
	  		error: function(e){
	  			console.log(e);
	  		}
		})
		
	} else {
		$("#disposeDiv .error_str").text("请输入处理说明");
		return false;
	}
}

function removeDisposeWin() {
	$("#disposeDiv").remove();
}

/*
 * 数组自增
 */
function NumberZAdd(maxNum, obj){
	var num = 0;
    var t = setInterval(function() {
       num++;  
       $("."+obj).text(num);
       if(num == maxNum) {
           clearInterval(t);  
       }         
    },50); 
}


/*
 * 下拉框多选
 */

//显示下拉框
function selecteOption(obj,str){
	var event = window.event || arguments.callee.caller.arguments[0];
	event.cancelBubble=true;
	/* $(obj).find(".h_labelSelectOption").css({"display":"block"}); */
	$("#"+str+"_stageandtype_select").toggle();
}

//点击空白关闭下拉
 $(document).click(function(){
     $(".h_labelSelectOption").css({"display":"none"});
 });

//value 赋值
var isClickInput = 0;
function setOptionValue(id) {
	
	//获取所有选中元素
	$("#"+id+"_value").val("");
	var _checkbox = "";
	var inputElem = $("#"+id+"_select").find(".h_labelSelectOption ul li input");
	
	if (isClickInput == 0){
		inputElem.each(function(index) {
			_checkbox += $(this).val()+",";
		})
	} else {
		inputElem.each(function(index) {
			if ($(this).is(':checked') == true){
				_checkbox += $(this).val()+",";
			}
		})
	}
	
	$("#"+id+"_value").val(_checkbox);
}

//option input 选中
var checkSeleCount = {
	"example_one" : 0,
	"example_two" : 0,
	"example_three" : 0
};
function seletedCheckbox(obj, id) {
	
	var state = 0; //选中或取消选中
	
	var temp = checkSeleCount[id];
	if ($(obj).is(':checked') == true) {
		temp ++;
		checkSeleCount[id] = temp;
	} else {
		state = 1;
		temp --;
		checkSeleCount[id] = temp;
	}
	
	
	if (checkSeleCount[id] >= 2) {
		//选中个数大于2
		$(obj).parents(".select_con").find(".h_labelSelect").text(checkSeleCount[id]+" selected");
		isClickInput = 1;
	} else if (checkSeleCount[id] == 1) {
		//只选中一个
		var tempTxt = "";
		if (state == 1) {
			//取消当前checkbox选中
			$("#"+id+"_select .h_labelSelectOption ul li input").each(function(){
				if ($(this).is(':checked') == true) {
					tempTxt = $(this).parent("label").text();
				}
			})
		} else {
			tempTxt = $(obj).parent("label").text();
		}
		$("#"+id+"_select .h_labelSelect").text(tempTxt+"");
		isClickInput = 1;
	} else {
		//未选中
		$("#"+id+"_select .h_labelSelect").text("所有");
		isClickInput = 0;
	}
	setOptionValue(id);
}

function setSelectModel(id, li, parentName) {
	var str = '<div class="fl select_con topFMar" id="'+id+'_select">'+
				'<div class="select_city_label select_city posRe" onclick="selecteOption(this,\''+id+'\')">'+
					'<div class="h_labelSelect" >所有 </div>'+
					'<b class="caret drop_down1" style="margin-top:-5px"></b>'+
					'<div class="posAb h_labelSelectOption" style="display:none" id="'+id+'_stageandtype_select">'+
						'<ul style="width:100%;">'+li+
						'</ul>'+
					'</div>'+
				'</div>'+
			'</div>';
	$("."+parentName+"").append(str);
}

function getSelectTxt(id, parentName) {
	
	var elem = $("#"+id);
	var li = '';
	for (var i = 0; i < elem.find("option").size(); i++){
		var txt = elem.find("option").eq(i).text();
		var value = elem.find("option").eq(i).attr("value");
			li += '<li class="multiselect-item multiselect-all">'+
				'<a tabindex="'+value+'" class="multiselect-all">'+
					'<label class="checkbox"><input type="checkbox" id="checkboxTags_'+i+'" value="'+value+'" onclick="seletedCheckbox(this, \''+id+'\')"/>'+txt+'</label>'+
				'</a>'+
				'</li>'	
	}
	setSelectModel(id, li, parentName);
}

