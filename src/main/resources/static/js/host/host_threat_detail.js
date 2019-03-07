/** 折现图 **/
var certaintyData = [];  //威胁度 
var threatData = [];     //可信度
var timeData = [];       //日期

var option = {
    backgroundColor: '#171c2f',
    //color:["rgba(35,96,168,0.7)","rgba(146,200,88,0.7)"],
    tooltip : {
        trigger: 'axis',
        axisPointer: {
            type: 'line',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    toolbox: {
        show:false
    },
    grid: {
        left: '10px',
        right: '20px',
        bottom: '10px',
        top: '10px',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
            data :timeData,
            splitLine:{
                show:false
            },
            axisTick:{
               show:false
            },
            axisLabel:{
                show: true,
                textStyle: {
                    color: '#919294'
                }
            },
            splitLine: {
				show: true,
				lineStyle: {
	                color: '#333'
	            }
			}
        }
    ],
    yAxis : [
        {
            show:false,
            type : 'value',
            splitLine:{
                show:false
            }
        }
    ],
    series : [
        {
            name:'可信度',
            type:'line',
            stack: '总量',
            //symbol:'none',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            data:certaintyData, //可信度
            areaStyle:{
                normal:{
                    color:{
                        type:'linear',
                        x:0,
                        y:0,
                        x2:0,
                        y2:1,
                        colorStops:[{
                            offset:0,
                            color:'#3c6233',
                        },{
                            offset:1,
                            color:'#1c3615',
                        }]
                    },
                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                    shadowBlur: 10
                }
            },
            itemStyle: {
                normal: {
                    color: 'rgb(146,200,88)',
                    borderColor: 'rgba(146,200,88,0.27)',
                    borderWidth: 12
                }
            }
        },
        {
            name:'威胁度',
            type:'line',
            stack: '总量',
            data:threatData, //威胁度
            //symbol:'none',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            areaStyle:{
                normal:{
                    color:{
                        type:'linear',
                        x:0,
                        y:0,
                        x2:0,
                        y2:1,
                        colorStops:[{
                            offset:0,
                            color:'#1d3153',
                        },{
                            offset:1,
                            color:'#171d31',
                        }]
                    },
                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                    shadowBlur: 10
                }
            },
            itemStyle: {
                normal: {
                    color: 'rgb(35,96,168)',
                    borderColor: 'rgba(35,96,168,0.27)',
                    borderWidth: 12
                }
            }
        }
    ]
};

var inDataSum = [],
	outDataSum = [],
	timeData2 = [];
var option2 = {
	    backgroundColor: '#171c2f',
	    //color:["rgba(35,96,168,0.7)","rgba(146,200,88,0.7)"],
	    tooltip : {
	        trigger: 'axis',
	        axisPointer: {
	            type: 'line',
	            label: {
	                backgroundColor: '#6a7985'
	            }
	        }
	    },
	    toolbox: {
	        show:false
	    },
	    grid: {
	        left: '10px',
	        right: '20px',
	        bottom: '10px',
	        top: '10px',
	        containLabel: true
	    },
	    xAxis : [
	        {
	            type : 'category',
	            boundaryGap : false,
	            data :timeData2,
	            splitLine:{
	                show:false
	            },
	            axisTick:{
	               show:false
	            },
	            axisLabel:{
	                show: true,
	                textStyle: {
	                    color: '#919294'
	                }
	            },
	            splitLine: {
					show: true,
					lineStyle: {
		                color: '#333'
		            }
				}
	        }
	    ],
	    yAxis : [
	        {
	            show:false,
	            type : 'value',
	            splitLine:{
	                show:false
	            }
	        }
	    ],
	    series : [
	        {
	            name:'数据流出包',
	            type:'line',
	            stack: '总量',
	            //symbol:'none',
	            smooth: true,
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: false,
	            data:outDataSum, //可信度
	            areaStyle:{
	                normal:{
	                    color:{
	                        type:'linear',
	                        x:0,
	                        y:0,
	                        x2:0,
	                        y2:1,
	                        colorStops:[{
	                            offset:0,
	                            color:'#3c6233',
	                        },{
	                            offset:1,
	                            color:'#1c3615',
	                        }]
	                    },
	                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
	                }
	            },
	            itemStyle: {
                    normal: {
                        color: 'rgb(146,200,88)',
                        borderColor: 'rgba(146,200,88,0.27)',
                        borderWidth: 12
                    }
                }
	        },
	        {
	            name:'数据流入包',
	            type:'line',
	            stack: '总量',
	            data:inDataSum, //威胁度
	            //symbol:'none',
	            smooth: true,
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: false,
	            areaStyle:{
	                normal:{
	                    color:{
	                        type:'linear',
	                        x:0,
	                        y:0,
	                        x2:0,
	                        y2:1,
	                        colorStops:[{
	                            offset:0,
	                            color:'#1d3153',
	                        },{
	                            offset:1,
	                            color:'#171d31',
	                        }]
	                    },
	                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
	                }
	            },
	            itemStyle: {
                    normal: {
                        color: 'rgb(35,96,168)',
                        borderColor: 'rgba(35,96,168,0.27)',
                        borderWidth: 12
                    }
                }
	        }
	    ]
	};

/* 检测模式 */
//检测模式 - 列表 ：仅显示核心资产 
$(".issueing_infoBox .propertybtn").bind("click",function(){
	
	if ($(this).find("i").hasClass("on")){
		   $(".ic_property").removeClass("on");
		   detectionParam.isKey = 2; //非核心资产
	   } else {
		   $(".ic_property").addClass("on");
		   detectionParam.isKey = 1;  //核心资产
	   }
	hostDetecFLoad = true;
	detectionChartTbl_init();
})

//检测模式 - 最近发现时间
$(".hostDetailTab .receTimeBtn").bind("click",function(){
	
	if($(this).find("i").hasClass("on")){
		   $(this).find("i").removeClass("on");
		   detectionParam.order = 'DESC';
	   } else {
		   $(this).find("i").addClass("on");
		   detectionParam.order = 'ASC';
	   }
	detectionParam.pageNum = 1; //当前页目
	hostDetecFLoad = true;
	detectionChartTbl_init();
})

//检测模式 - 所有威胁类型 
function getDetailThreatType(obj){
	
	//detectionParam.detectionTypes = $(obj).val();
	detectionParam.typeZh = $(obj).val();
	detectionParam.pageNum = 1; //当前页目
	hostDetecFLoad = true;
	detectionChartTbl_init();
}

//检测模式 - 重置过滤条件 
$(".issueing_infoBox .resetBtn").bind("click",function(){
    //style
	$(".issueing_infoBox .ic_property").removeClass("on");
	$(".threatBtn").find("i").removeClass("on");
	   
	//param
	detectionParam.queryTime = 2;// 查询时间 1天（1）、1周（2）、2两（3）、1月（4）
	detectionParam.isKey = 0; // 是否是核心资产
	detectionParam.typeZh = ''; // 威胁类型
	detectionParam.stage = 0; // 行为阶段
	detectionParam.detectionTypes = '';
	hostDetecFLoad = true;
	detectionChartTbl_init();
})

//检测模式 - 图表切换时间
$("#checkM_chartDate ul li a").bind("click",function(){
	
	$("#checkM_chartDate ul li a").removeClass("on");
	$(this).addClass("on");
	detectionParam.queryTime = $(this).attr("data");
	
	detectionParam.pageNum = 1; //当前页目
	hostDetecFLoad = true;
	detectionChartTbl_init();
})

	
	//检测模式 - 初始化图表 、列表
    var detectionParam = new Object();
    detectionParam.queryTime = 2;// 查询时间 1天（1）、1周（2）、2两（3）、1月（4）
    detectionParam.isKey = 0; // 是否是核心资产
    detectionParam.typeZh = ''; // 威胁类型
    detectionParam.stage = 0; // 行为阶段
    detectionParam.sortName = 'DetectTime';//排序字段
    detectionParam.order = 'DESC';//排序（DESC、ASC）
    detectionParam.detectionTypes = '';//所有威胁类型
    
    detectionParam.hostIp = $(".hostIp_host").text();
    detectionParam.numPerPage = 10; //每页显示条目数
    detectionParam.pageNum = 1; //当前页目
    
	var stageName = {};
	var hostDetecFLoad = true;
	
    function detectionChartTbl_init() {
    	//detectionParam.hostIp = hostIp;
    	
    	$.ajax({
      		url: '/om/host_threat/get_detect_host_line',
      		type: 'POST',
      		async: true,
      		cache: true,
      		data: detectionParam,
      		success:function(data) {
      			
      			$(".hostDetailTab tbody").empty();
      			certaintyData.splice(0,certaintyData.length);  //威胁度 
      		    threatData.splice(0,threatData.length);     //可信度
      		    timeData.splice(0,timeData.length);       //日期
      			
      			
      			//获取折线图数据
      			var dLine = data.result.detectionThreatLine;
      			for(var i in dLine){
      				certaintyData.push(dLine[i].certainty);
      				threatData.push(dLine[i].threat);
      				timeData.push(dLine[i].detectTime);
      			}
      			
      			var glChart = echarts.init(document.getElementById('main2'));
      			glChart.setOption(option);
      			
      			//获取标签名
      			stageName = data.result.stageMap;
      			
      			//列表
      			var dtd = data.result.infos.results;
      			var str = '';
      			for(var j in dtd){
      				
      				var sname = getOptionName(stageName, dtd[j].stage);
      				
      				
      				str += '<tr>'+
                                '<td><a class="tab_name" href="#" onclick=""><i class="ic_label"></i>+'+(dtd[j].detectionTags == null ? dtd[j].detectionTags = '' : dtd[j].detectionTags = dtd[j].detectionTags)+'</a></td>'+
                                '<td><span class="attackType" style="background:'+gradeColorArr[dtd[j].stage]+'">'+sname+'</span></td>'+
                                '<td>'+dtd[j].typeZh+'</td>'+
                                '<td><span class="t_radius">'+dtd[j].threat+'</span></td>'+
                                '<td><span class="t_radius">'+dtd[j].certainty+'</span></td>'+
                                '<td>'+fmtDate(dtd[j].firstDetectTime)+'</td>'+
                                '<td>'+fmtDate(dtd[j].detectTime)+'</td>'+
                            '</tr>';
      			}
      			$(".hostDetailTab tbody").append(str);
      			
      			//分页
    			var totalCount = data.result.infos.totalCount; //总条数
    			var numPerPage = data.result.infos.numPerPage;//每页显示条目数
    			var pageSum = data.result.infos.pageSum;//总分页数
    			var pageNum = data.result.infos.pageNum;//当前索引
    			
    			//pageFun(2,numPerPage2,totalCount2,pageNum2,pageselectCallback2);
    			
    			if (hostDetecFLoad == true){
    				/*var page = '<div id="page2" class="f_right"></div>';
					$parent = $("#page2").parent();
					$parent.empty();
					$parent.append(page);
					detectionParam.pageNum = 1;
					
					var page = $("#page2").CustomPage({
						pageSize: numPerPage,
						count: totalCount,
						current: 1,
						updateSelf: true,
						callback: detecPageCallBack
					});*/
					hostDetecFLoad = false;
					var page2_options = {
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
				            //点击事件
				            onPageClicked: function (event, originalEvent, type, page) {
				            	
				            	detectionParam.pageNum = page; //当前页目
				            	detectionChartTbl_init();
				            }
				    };
					$("#page2 #pageLimit_page2").bootstrapPaginator(page2_options);
					$("#page2 .countItem").text(totalCount);
				}
      			
      		},
      		error:function(e){
      			console.log(e);
      		}
    	})
    	
    }
    
    detectionChartTbl_init();
    
    //分页callback
    function detecPageCallBack(page){
    	
    	detectionParam.pageNum = page; //当前页目
    	detectionChartTbl_init();
    }



/* 关联模式 */
function dotPosition() {
	//中心点横坐标
	var dotLeft = ($(".circleCon").width()-$(".dot").width())/2;

	//中心点纵坐标
	var dotTop = ($(".circleCon").height()-$(".dot").height())/2;
	
	//设置圆的中心点的位置
	$(".dot").css({"left":dotLeft-27.5,"top":dotTop-27.5});  // 55(圆心宽度/高度)/2=27.5 表示指向宽度为55的div中心
	$(".dot").attr("x",dotLeft);
	$(".dot").attr("y",dotTop);
	
	$(".dot .roundBg").css({"background":""+hostbgColor});
	
	var hostKeyIcon = '';
	host_isKey == 1 ? hostKeyIcon = '<i class="star_i"></i>' : hostKeyIcon = '<i class="ic_host"></i>';
	if (host_isKey == 1){
		$(".dot .roundBg i").addClass("host_star").removeClass("host_icon");
	} else {
		$(".dot .roundBg i").addClass("host_icon").removeClass("host_star");
	}
}

//关联模式- 关联图
function drawCircleDot() {
   //中心点横坐标
   var dotLeft = ($(".circleCon").width()-$(".dot").width())/2;

   //中心点纵坐标
   var dotTop = ($(".circleCon").height()-$(".dot").height())/2;

   //起始角度
   var stard = 0;

   //半径
   var radius = 120;

   //每一个BOX对应的角度;
   var length = $(".box").size();
   
   var avd = 360/24;
   
   if (length < 24){
	   
	   avd = 360/length;
   }
   
   //var avd = 360/$(".box").length;

   //每一个BOX对应的弧度;
   var ahd = avd*Math.PI/180;

   //设置圆的中心点的位置
  /* $(".dot").css({"left":dotLeft-27.5,"top":dotTop-27.5});  // 55/2=27.5 表示指向宽度为55的div中心
   $(".dot").attr("x",dotLeft);
   $(".dot").attr("y",dotTop);*/

   var line = ''; //圆心点到指定位置的直线
	
   var maxCount = 24;//一圈最大数量
	
   var count = 0;

   $(".box").each(function(index, element){
	   //最多显示3圈 
	   if (index > 71) {
		   
		   $(this).remove();
		   
	   } else {
		   
		   count++;
		   if (count > maxCount){
			   count = 1;
			   radius = radius + 32;
		   }
		   
		   var left = Math.sin((ahd*count))*radius+dotLeft;
	       var top = Math.cos((ahd*count))*radius+dotTop;
	       
	       if (index == 71) {
	    	   var boxMore = '<div class="boxMore"><span class="roundBg round_med" style="color:#fff;text-align:center;'+$(".box").eq(0).find(".roundBg").attr("style")+'">...</span></div>'
	    	   $(".circleCon").append(boxMore);
	    	   $(".boxMore").css({"left":left-15,"top":top-15, "position":"absolute"}); //  30/2=15 表示指向宽度为30的div中心
	    	   $(this).remove();
	       } else {
	    	   
	    	   var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
	           var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
	           var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
	           if(isIE) {
	        	    reIE.test(userAgent);
	                var fIEVersion = parseFloat(RegExp["$1"]);
	                //ie 9 
	                if(fIEVersion == 9) {
	                	$(this).css({"left":left-20,"top":top+15});
	                	 $(this).attr("x",left-20);
	                	 $(this).attr("y",top+15); 
	                }   
	           } else {
	        	   $(this).css({"left":left-15,"top":top-15}); //  30/2=15 表示指向宽度为30的div中心
	        	   $(this).attr("x",left);
			       $(this).attr("y",top); 
	           }
	    	   
		      
	       }
	       

	       //画线
	       line += '<line stroke-linecap="null" stroke-linejoin="null"' +
	               'id="svg_'+index+'" y2="'+top+'" x2="'+left+'" y1="'+dotTop+'" x1="'+dotLeft+'"' +
	               'fill-opacity="null" stroke-opacity="null" stroke-width="1.5" stroke="#383e52" fill="none"/>';
		}
   })

   
   /*$(".box").each(function(index, element){       
		if (index > maxCount){
			
			radius = (Math.ceil($(".box").length/24) * 40 ) + 150; 
			avd = 360/($(".box").length - maxCount);
			ahd = avd*4.14/180;
		}
       var left = Math.sin((ahd*index))*radius+dotLeft;
       var top = Math.cos((ahd*index))*radius+dotTop;

       $(this).css({"left":left-15,"top":top-15}); //  30/2=15 表示指向宽度为30的div中心
       $(this).attr("x",left);
       $(this).attr("y",top);

       //画线
       line += '<line stroke-linecap="null" stroke-linejoin="null"' +
               'id="svg_'+index+'" y2="'+top+'" x2="'+left+'" y1="'+dotTop+'" x1="'+dotLeft+'"' +
               'fill-opacity="null" stroke-opacity="null" stroke-width="1.5" stroke="#383e52" fill="none"/>';

		
	});*/

   //定义 svg
   var svg = '<svg width="100%" height="100%" version="1.1"'+
       'xmlns="http://www.w3.org/2000/svg">'+line+'</svg>';

   $(".circleCon").append(svg);
}


//关联模式-数据列表
var detecOnlineParam = new Object();
var onlinePageNum = 1; //当前页目
var onloadFirst = true;
var hostName = "";//主机名

function getOnlineTbl() {
	
	$.ajax({
  		url:'/om/host_threat_detail/get_host_detail',
  		type:'POST',
  		async:true,
  		cache:true,
  		data:{
  			hostThreatId: hostThreatId,
  			pageNum: onlinePageNum,
  			numPerPage:10,
  			hostName: hostName
  		},
  		success:function(data) {
  			
  			$("#hostDetail_onlineTab tbody").empty();
  			//当前主机的isKey
  			var hostKeyStr = '';
  			host_isKey == 1 ? hostKeyStr = '<i class="star_i"></i>' : hostKeyStr = '<i class="ic_host"></i>';
  			
  			var result = data.result.results;
  			//获取数据传输最大值
  			var outDataSizeArr = [],
  				inDataSizeArr = [];
  			for (var i in result){
  				outDataSizeArr.push(result[i].outDataSize); //数据连接 - 当前主机
  				inDataSizeArr.push(result[i].inDataSize); //数据连接 - 连接主机
  			}
  			
  			//获取最大值
  			var maxOutData = getMaxArr(outDataSizeArr);
  			var maxInData = getMaxArr(inDataSizeArr);
  			var maxData = 0;
  			maxOutData >= maxInData ? maxData = maxOutData : maxData = maxInData;
  			
  			var tr = '';
  			for (var i in result){
  				
  				var indateLength = result[i].inDataSize;
  				var outdataLength = result[i].outDataSize;
  				
  				result[i].inDataSize == 0 ? indateLength = 3 : indateLength = (result[i].inDataSize/maxInData)*100;
  				result[i].outDataSize == 0 ? outdataLength = 3 : outdataLength = (result[i].outDataSize/maxInData)*100;
  				
  				indateLength > 100 ? indateLength = 100 : indateLength = indateLength;
  				outdataLength > 100 ? outdataLength = 100 : outdataLength = outdataLength;
  				
  				//核心  /非核心
  				var isKey = result[i].isKey;
  				var keyStr = isKeyStrFun(isKey);
  				
  				//外部主机图标背景色
  				var _certainty = result[i].certainty;
  				var _threat = result[i].threat;
  				var _ctClass = threatGradeFun(_threat, _certainty);
  				
  				tr += '<tr>'+
                           '<td>'+
                               '<span class="roundBg round_min '+_ctClass+' externalIc">'+keyStr+'</span>'+
                               '<a class="tab_name h_tname" href="javascript:;" onclick="onlineHost(\''+result[i].externalIp+'\', \''+result[i].dataDirection+'\', this)"> '+result[i].externalIpName+'</a>'+
                           '</td>'+
                           '<td>'+
                               '<div class="flex_one">'+
                                   '<div class="f_one">'+result[i].inDataSize+'GB</div>'+
                                   '<div class="f_three">'+
                                   	  '<div class="flex_one">'+
                                       '<div class="f_one text-r"><i class="dataLength dGreen" style="width:'+indateLength+'%;"></i></div>'+
                                       '<div class="f_one text-l"><i class="dataLength dBlue" style="width:'+outdataLength+'%;"></i></div>'+
                                      '</div>'+
                                   '</div>'+
                                   '<div class="f_one">'+result[i].outDataSize+'GB</div>'+
                               '</div>'+

                           '</td>'+
                           '<td>'+
                               /*'<span class="roundBg round_m1 '+hostbgColor+'">'+*/
                                   '<span class="roundBg round_min '+hostbgColor+'">'+hostKeyStr+'</span>'+
                               /*'</span>'+*/
                           '</td>'+
                           '<td>'+result[i].protocal+' '+result[i].port+'</td>'+
                       '</tr>';
  			}
  			$("#hostDetail_onlineTab tbody").append(tr);
  			//$(".itemCount_online").text(data.result.totalCount);
  			
  			//分页
			var totalCount = data.result.totalCount; //总条数
			var numPerPage = data.result.numPerPage;//每页显示条目数
			var pageSum = data.result.pageSum;//总分页数
			var pageNum = data.result.pageNum;//当前索引

  			
  			if (onloadFirst = true){
  				onloadFirst = false;
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
			            //点击事件
			            onPageClicked: function (event, originalEvent, type, page) {
			            	
			            	onlinePageNum = page; //当前页目
			            	getOnlineTbl();
			            }
			    };
				$("#page3 #pageLimit").bootstrapPaginator(page_options);
				$("#page3 .countItem").text(totalCount);
  			}
			
  		},
  		error:function(e){
  			console.log(e);
  		}
	})
}



//关联模式-主机关联图初始化
function getOnlinePage(){
	
	$.ajax({
  		url:'/om/host_threat_detail/get_host_detail_extenal',
  		type:'POST',
  		async:true,
  		cache:true,
  		data:{
  			hostThreatId: hostThreatId,
  			hostName: hostName
  		},
  		success:function(data) {
  			
  			console.log("data");
  			var str = '';
  			$(".circleCon .box").each(function() {
  				$(this).remove();
  			});
  			if($(".circleCon").find("svg")){$(".circleCon").find("svg").remove();}
  			
  			var infos = data.result.infos;
  			for(var i in infos) {
  				
  				//核心资产 / 非核心资产
  				var isKey = infos[i].isKey;
  				isKey == 0 ? isKey = 2 : isKey = isKey;
  				keyStr = '';
  				if (isKey == 1){
  					keyStr = '<i class="star_i" style="left: 5px;top: 6px;"></i>';
  				} else if (isKey == 2){
  					keyStr = '<i class="ic_host"></i>'
  				}
  				
  				var p_stage = JSON.stringify(data.result.stage);
  				var param = JSON.stringify(infos[i]);
  				var bgColor = infos[i].color;
  				
  				str += '<div class="box" onclick=showHostBoxInfo(this,'+param+','+p_stage+') data="'+infos[i].externalIp+'"><span class="roundBg round_med" style="background:'+ threatGradeColor[bgColor]+'">'+keyStr+'</span></div>';
  			}
  			
  			$(".circleCon").append(str);
  			drawCircleDot(); //画图
  			
  		},
  		error:function(e){
  			console.log(e);
  		}
	})
}

/* 主机name搜索 */
$(".searchBox .search_text").bind('keydown',function(event){
	    if(event.keyCode == "13") {
	    	allOnlineType()
	    }
	});
$(".searchBox .search_btn").bind("click",function() {
	allOnlineType()
})

function allOnlineType() {
	   
	   hostName = $(".searchBox .search_text").val();
	   onlinePageNum = 1; //当前页目
	   onloadFirst = true;
	   getOnlineTbl();
	   getOnlinePage();
}


/* 关联/检测模式 */
var counter = 0; //计数器
var hostbgColor = ''; //当前主机颜色
$(".hd_conBtn span").bind("click",function () {
    $(".hd_conBtn span").removeClass("on");
    $(this).addClass("on");
    var dNum = $(this).attr("data"); //标记
    if (dNum == '0'){
        //检测模式
        $(".hd_model_detection").show();
        $(".hd_model_online").hide();
        //$(".hd_conBtn a").eq(0).attr("data","2");
        
    } else {
        //关联模式
        $(".hd_model_detection").hide();
        $(".hd_model_online").show();
        //$(".hd_conBtn a").eq(0).attr("data","1");
        //画主机图
        if (counter == 0){
        	counter++;
        	
        	//画圆心
        	dotPosition();
        	
        	//圆心颜色
        	var threat_c = $(".menace .t-max").text(); //威胁值
        	var trust_c = $(".trust .t-max").text();  //可信值
        	hostbgColor = threatGradeFun(threat_c, trust_c);
        	$(".dot .roundBg").eq(0).addClass(hostbgColor);
        	
        	//绘制关联模式-主机关系图
        	getOnlinePage();
        	
        	//获取关联模式-数据列表
        	getOnlineTbl();
        }
    }

});

// 返回主机页
$(".page_hostBtn").bind("click",function(){
    	$(".content").empty();
	    htmlobj=$.ajax({
	    	url:'/om/host_threat/index',
	    	data:{},
	    	async:false,
	    	success:function(data) {
	    		document.body.scrollTop = 0;// 回到顶部
	    		$(".content").html(data);
			}
	    });
})

function getChartState() {
	var detecDtailCh = $(".hd_relationCon input").val();
	if (detecDtailCh != ""){
		$(".hd_re_round").removeClass("bg");
		if (detecDtailCh.indexOf(",") > 0) {
			//多个
			var stateArr = detecDtailCh.split(',');
			for (var n = 0; n < stateArr.length; n++) {
				$(".hd_re_round.r"+stateArr[n]).addClass("bg");
			}
			
		} else {
			$(".hd_re_round.r"+detecDtailCh).addClass("bg");
		}
		/*switch(detecDtailCh){
		case '1':
			$(".hd_re_round.r1").addClass("bg");
		  break;
		case '4':
			$(".hd_re_round.r2").addClass("bg");
		  break;
		case '6':
			$(".hd_re_round.r3").addClass("bg");
			break;
		case '7':
			$(".hd_re_round.r4").addClass("bg");
			break;
		}*/
		  
	}
}
getChartState();
