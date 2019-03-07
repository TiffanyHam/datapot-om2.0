var base = document.getElementById("base").href;
var gradeColorArr = ["","#2796b3","","","#b2a71d","#b68435","#b61a32","#6912bc"];

//HTML标签自带属性title样式修改
/*var oldTitle;
$(document).bind('mouseover mouseout mousemove', function(event) {
	var left = event.pageX,
		top = event.pageY;
	var ele = event.target;
	var title = ele.title;

	var type = event.originalEvent.type;
	if(type == 'mouseover') {
		oldTitle = title;
		ele.title = '';
		if(title && title.length > 0) {
			var showEle = $('<div></div>', {
				text: title,
				class: 'showTitleBox'
			}).css({
				position: 'absolute',
				top: top + 10,
				left: left,
			})
			var text = {}; 
			//title = JSON.stringify(text).replace(/\"/g,"'");
			showEle.appendTo('body');
		}
	} else if(type == 'mouseout') {
		ele.title = oldTitle;
		$('.showTitleBox').remove();
	} else if(type == 'mousemove') {
		$('.showTitleBox').css({
			top: top + 10,
			left: left
		})
	}
})*/

$(function() {
	$('#currentDate').html(currentDate());
	$('#currentTime').html(currentTime());
	setInterval(function()
		{
			$('#currentDate').html(currentDate());
			$('#currentTime').html(currentTime());
		}
		,1000);
	var right_wid = $(window).width()-259+ 'px' //设置屏幕右侧宽度
	$('.page').css('width',right_wid);
	
	
	
})

function showDiv(obj) {
	$(obj).show();
	$(window).scroll(function() {
		center(obj);
	});
	$(window).resize(function() {
		center(obj);
	});
}
/*ip正则验证*/
function isValidIP(ip) {
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    return reg.test(ip);
} 
/*英文验证*/
function isValidEnglish(eng) {
	var reg = /[0-9a-zA-Z-]*/;/*"^\\S[\\sA-Za-z,\\.·\\-]*\\S$"*/
	return reg.test(eng);
} 
/*中文验证*/
function isValidChinese(chi) {
	var reg = /^[a-zA-Z0-9\u4e00-\u9fa5]$/;
	return reg.test(chi);
}
	
/*密码格式    6到15位字母或数字 */
function isValidPassword(pwd) {
var reg=/^[0-9a-zA-Z]{6,15}$/;
return reg.test(pwd);
}


function center(obj) {
	var windowWidth = document.documentElement.clientWidth;
	var windowHeight = document.documentElement.clientHeight;
	var popupHeight = $(obj).height();
	var popupWidth = $(obj).width();
	$(obj).css({
		"position": "absolute",
		"top": (windowHeight - popupHeight) / 2,
		"left": (windowWidth - popupWidth) / 2
	});
}


function currentDate(){
	var date = new Date();
	var seperator1 = "-";
	var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    return currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
}

function strToDateTime(nS){
	var date = new Date(parseInt(nS));
	var seperator1 = "-";
	var seperator2 = ":";
	
	var month = date.getMonth() + 1;
    var strDate = date.getDate();
    
    var Hours = date.getHours();
	var Minutes = date.getMinutes();
    var Seconds = date.getSeconds();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    
    if (Hours >= 0 && Hours <= 9) {
    	Hours = "0" + Hours;
	}
	if (Minutes >= 0 && Minutes <= 9) {
		Minutes = "0" + Minutes;
	}
	if (Seconds >= 0 && Seconds <= 9) {
		Seconds = "0" + Seconds;
	}
    return currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + Hours + seperator2 + Minutes + seperator2 + Seconds;
}


/*将日期缀字符串转换成yyyy-MM-dd hh:mm:ss格式字符串*/
function getLocalTime(nS) {
	return new Date(parseInt(nS)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
}

function currentTime(){
	var date = new Date();
	var seperator2 = ":";
	var Hours = date.getHours();
	var Minutes = date.getMinutes();

	if (Hours >= 0 && Hours <= 9) {
	Hours = "0" + Hours;
	}
	if (Minutes >= 0 && Minutes <= 9) {
	Minutes = "0" + Minutes;
	}
	return Hours + seperator2 + Minutes;
}


/*弹出层*/

function show(tag) {
	var content = document.getElementById(tag);
	content.style.display = 'block';

}
/*重置表单*/
function reset(tag){
	$("#" + tag + " #editForm")[0].reset();
	$("#" + tag + " #editForm").find("input[type='hidden']").each(function(i, v){
		$(this).val('');
	});
}

function hide(tag) {
	var content = document.getElementById(tag);
	content.style.display = 'none';
	$("label[class='error']").remove();
	$("#error_box").empty();
}

/*key:value,value:text*/
function getSelectVT(selectName){
	var obj = {};
 	$("#"+selectName+" option").each(function(){//遍历所有option  
 	var t = $(this).text(); 
  	var v = $(this).val(); //获取option值   
  	if(v!=''){  
	   	obj[v] = t;//添加到对象中  
   	}  
  })
 	return obj
};
  
/*key:text,value:value*/
function getSelectTV(selectName){
	var obj = {};
  $("#"+selectName+" option").each(function(){//遍历所有option  
	var t = $(this).text(); 
    var v = $(this).val(); //获取option值   
    if(v!=''){  
 	   	obj[t] = v;//添加到对象中  
    }  
  })
  return obj
};

//光标距离
/*window.$leftStyle={
		"97":"10px",
		"98":"120px",
		"100":"227px",
		"101":"329px",
		"102":"411px",
		"103":"509px",
		"104":"619px",
		"113":"730px",
		"105":"0px",
		"106":"126px",
		"107":"256px",
		"108":"366px",
		"109":"479px",
		"110":"582px",
		"111":"689px",
		"112":"802px"	
	};*/

function unitPagination(){
	var page = "<div id='page'>	</div>";
	var $nav = $(".foot-nav");
	$nav.empty();
	$nav.append(page);
};


//var clientHeight = 0;
function getClientHeight() {
	var clientHeight = document.body.clientHeight;
	return clientHeight;
	//console.log(clientHeight);
}

$(window).resize(function(){
	reloadPage();
});


//页面滚动条
function getClientScroll(){
	var flag = 0;  //标识有分页
	var cHieght = getClientHeight();
	if ($(".table_body").length > 0){
		var tableTop =  $(".table_body").offset().top;//table距离  .offset().top   offsetTop
		var scroll_top = cHieght - tableTop; //页面滚动距离  -55
		var tbodyHeight = $(".table_body").height();//tbody高度
		if(tbodyHeight > scroll_top){
			$('.table_body').css({'height': (scroll_top-10) + 'px','display':'block','overflow':'auto'});
			if ($("#page").length > 0){
				console.log("has page");
				$('.table_body').css({'height': (scroll_top-50) + 'px','display':'block','overflow':'auto'});
			}
	
		}else{
			$('.table_body').css({'height': 'auto','display':'inline-block','overflow':'hidden'});
		}
	}
	
}
	
getClientScroll();


/*load指定页面*/
function loadPage(menuId,url,isClick,firstMenu){
	/////////////////////////////////////
	if (isClick == "1") {
		clearCookie("urlDatail");
		clearCookie("indexDatail");
		
		var urlDatail = "menuId:"+menuId+",url:"+url;
		setCookie("urlDatail",urlDatail);
		setCookie("indexDatail",firstMenu);
	}
    var cookieUrl = getCookie("urlDatail");
    var cookieArr = splitStrFun(cookieUrl);
    menuId = cookieArr[0] || menuId;
    url = cookieArr[1]  || url;
    ////////////////////////////////////
	htmlobj=$.ajax({url:url,async:false,
		success : function(data, status) {
            if(data.indexOf("<title>用户登录</title>") >= 0 )
            {
            	window.location.reload();
            }else{
            	$(".content").empty();
            	//初始化分页节点
            	unitPagination();
            	$(".content").html(data);
            	secondStyle(menuId);
            } 
        }});
	  getClientScroll();

}


/*二级菜单加亮*/
function secondStyle(menuId){
	$ul = $("#menuId"+menuId).parent();
	//$ul.find("#solid").css("left", $leftStyle[menuId]);
	
	var sLeft = $('#secondLevelMenus').offset().left;
	var sNow = $("#menuId" + menuId).offset().left;
	var sWord =  $("#menuId" + menuId).text();
	//alert(sWord.length);
	//二级菜单字数长度
	if(sWord.length < 4|| sWord.length == 4){
		s = sNow - sLeft -8;
		$ul.find("#solid").css("left", s);
	}else{
		s = sNow - sLeft + 10;
		$ul.find("#solid").css("left", s);

	}
	
	//alert(s);
	$ul.find("li").each(function(i, v){
		var $span = $(this).find("span:eq(0)");
		if($span.hasClass("store_active")){
			$span.removeClass("store_active");
		}
	});
	$("#menuId"+menuId).find("span:eq(0)").addClass("store_active");
}

window.$myimg = {};
/*一级菜单样式加亮*/
var navIndex = {
	"prevIndex" : 0,
	"initIndex" : 0,
	"secendnav" : false
}
function editEvent(obj,index,isClick){
	//第一次点击导航
	if (navIndex.initIndex == 0) {
		navIndex.initIndex = 1;
		navIndex.prevIndex = index;
	} else {
		
		if (navIndex.prevIndex != index || navIndex.secendnav == true) {
			navIndex.prevIndex = index;
		} else {
			return false;
		}
		
	}

	clearCookie("indexDatail");
	var firstMenu = $(obj).attr("id");
	firstMenu = firstMenu.replace("menuId","");
	setCookie("indexDatail",firstMenu);
	//重置样式
	$ul = $(obj).parent();
	var y = 0;
	$ul.find("li").each(function(i, v){
		$(this).attr("class","menulist_top a"+(y+1));
		$(this).find("img").each(function(i, v){
			var imgs = $myimg[y];
			var arr = imgs.split(",");
			$(this).attr("src",arr[0]);
		});
		y++;
	});
	
	//加亮选择菜单
	$li = $(obj);
	$li.attr("class","menulist_top menulist_top_down navdown a"+(index+1));
	$(obj).find("img").each(function(i, v){
		var imgs = $myimg[index];
		var arr = imgs.split(",");
		$(this).attr("src",arr[1]);
	});
	secondLevelMenus(obj,isClick);
	//openPage(obj);
}
//请求跳转
function requestUrl(url,menuId){
	window.location.href=url
};
/*如果有二级菜则生成二级菜单,否则跳转到指定页面*/
function secondLevelMenus(obj,isClick){
	var id = getCookie("indexDatail");
	if(id){
		obj = $("#menuId" + id).get(0);
		$ul = $(obj).parent();
		var y = 0;
		$ul.find("li").each(function(i, v){
			$(this).attr("class","menulist_top a"+(y+1));
			$(this).find("img").each(function(i, v){
				var imgs = $myimg[y];
				var arr = imgs.split(",");
				$(this).attr("src",arr[0]);
			});
			y++;
		});
		
		$(obj).addClass("navdown");
		
		$(obj).find("img").each(function(i, v){
			var thisImgUrl = $(this).attr("src");
			var targetImgUrl;
			for(x in $myimg){
				var imgs = $myimg[x];
				var arr = imgs.split(",");
				if(thisImgUrl == arr[0]){
					targetImgUrl = arr[1];
					break;
				}
			}
			$(this).attr("src",targetImgUrl);
		});
	}
	var menuId = $(obj).attr("id");
	menuId = menuId.replace("menuId","");
	var params = []; //查询条件
	  params.push({name:"menuId",value:menuId});//菜单ID
	  $.ajax({
	    url : "/sys/menu/second_level_menus",
	    type : "POST",
	    async: false,
	    contentType : "application/x-www-form-urlencoded;charset=utf-8",
	    data : params,
	    dataType : "json",           
	    success : function(data) {
	 	   if(data.retCode == 1){
	 		  var html="<span id='solid'><img src='/static/img/solid.png' width='145' height='1'></span>";
	 		  var result = data.result;
	 		  for(var i=0;i<result.length;i++){
	         	 html+="<li id='menuId"+result[i].menuId+"' onclick=loadPage('"+result[i].menuId+"','"+result[i].menuUrl+"','1','"+menuId+"')><span class='List_c ' >"+result[i].menuName+"</span>";
	         	 if(i != result.length -1){
	         		html+="<span>|</span>";
	         	 }
	         	
	         	 html+="</li>";
	          }
	 		 
	 		  $("#secondLevelMenus").empty();
	          $("#secondLevelMenus").append(html);
	          $(".header").show();
	 		  $(".content").removeClass("no_scroll");
	 		 if(menuId == "95"){
	 			 $(".main_title").html('<img src="/static/img/plat_icon6.png" width="27" height="28">设置');  
	 		   }else if(menuId == "94"){
	 			 $(".main_title").html('<img src="/static/img/plat_icon9.png" width="27" height="28">管理');    
	 		   }else if(menuId == "56"){
	 			 $(".main_title").html('<img src="/static/img/plat_icon10.png" width="28" height="28">流量');    
	 		   }else if(menuId == "119"){
		 			 $(".main_title").html('<img src="/static/img/plat_icon11.png" width="28" height="28">漏洞');    
		 		   }
	 		
	 	   }else{
	 		  $(".header").hide();
	 		  $(".content").addClass("no_scroll");
	 	   }
	 	   openPage(obj,isClick);
	    },
	    error:function(msg){
	      
	    }
	 });
};

$.ajax({
    cache: true,
    type: "POST",
    async: false,
    url:'/sys/menu/level_menus',
    dataType:"json",
    success: function(data) {
		   console.log(data);

    	var result = data.result;
        var html="";
        for(var i=0;i<result.length;i++){
        	var images = result[i].menuImage.split(",");
        	$myimg[i] = "/static/img/"+images[0]+","+"/static/img/"+images[1];
        	html+="<li class='menulist_top a"+(i+1)+"' id='menuId"+result[i].menuId+"' onclick='editEvent(this," +i+",1)'><img src='/static/img/"+images[0]+"' alt=''>"+result[i].menuName+"</li>";
        }
      
        $("#menulist").empty();
        $("#menulist").append(html);
        //默认样式
        var index = 0;
        var $li = $(".a"+(index+1));
        $li.attr("class","menulist_top navdown a"+(index+1));
        $li.find("img").each(function(i, v){
    		var imgs = $myimg[index];
    		var arr = imgs.split(",");
    		$(this).attr("src",arr[1]);
    	});
        
        secondLevelMenus($li.get(0),0);
    }
});

/*跳转到指定页面*/
function openPage(obj,isClick){
	var menuId = $(obj).attr("id");
	menuId = menuId.replace("menuId","");
	var params = []; //查询条件
	  params.push({name:"menuId",value:menuId});//菜单ID
	  $.ajax({
	    url : "/sys/menu/open_page",
	    type : "POST",
	    async: false,
	    contentType : "application/x-www-form-urlencoded;charset=utf-8",
	    data : params,
	    dataType : "json",           
	    success : function(data) {
	 	   if(data.retCode == 1){
	 		  var html="";
	 		  var result = data.result;
	 		  loadPage(result.menuId,result.menuUrl,isClick,menuId);
	 	   }
	    },
	    error:function(msg){
	      alert("请求异常");
	    }
	 });
};


function getCookie(c_name){
if (document.cookie.length>0)
  {
  c_start=document.cookie.indexOf(c_name + "=")
  if (c_start!=-1)
    { 
    c_start=c_start + c_name.length+1 
    c_end=document.cookie.indexOf(";",c_start)
    if (c_end==-1) c_end=document.cookie.length
    return unescape(document.cookie.substring(c_start,c_end))
    } 
  }
return ""
}

function setCookie(c_name,value,expiredays){
	var exdate=new Date()
	exdate.setDate(exdate.getDate()+expiredays)
	document.cookie=c_name+ "=" +escape(value)+
	((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
}


function clearCookie(name) { 
    setCookie(name, "", -1);  
}  

function splitStrFun(str) {
	str = str.split(",");
	var newArray = [];
	for (var i = 0; i < str.length; i ++) {
		var item = str[i].split(":");
		newArray.push(item[1]);
	}
	return newArray;
}






