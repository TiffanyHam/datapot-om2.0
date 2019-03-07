var netflowChart = echarts.init(document.getElementById('netflow'));
var sourceTblInfo = [];
var isfirstload = true;
var searhTime = {
		srcIp: '',
		dstIp: '',
		start: '',
		end: ''
}
var pageNumArr = {
		numPerPage: 20,
		pageNum: 1
}

var netflow_option = {
	backgroundColor: '#171c2f',
    tooltip: {
        trigger: 'axis'
    },
    grid: {
        left: '4%',
        right: '4%',
        bottom: '3%',
		top: '5%',
        containLabel: true
    },
    xAxis: {
        type : 'category',
        name: '时',
        nameLocation:'end',
        nameGap: '10',
        nameTextStyle:{
       	color: '#919294'
        },
		boundaryGap : false,
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
			show: false,
			lineStyle: {
				color: '#333'
			}
		},
		data:[]
        //data: ['周一','周二','周三','周四','周五','周六','周日']
    },
    yAxis: {
		type : 'value',
		name: '单位：万',
        nameLocation:'middle',
        nameGap: '70',
        nameTextStyle:{
        	color: '#919294'
        },
        splitLine: {
			show: true,
			lineStyle: {
				color: '#333'
			}
		},
		axisTick:{
			show:false
		},
		axisLabel:{
			show: true,
			textStyle: {
				color: '#919294'
			}
			
		}
    },
    series: [
        {
            name:'访问量',
            type:'line',
			smooth: true,
			showSymbol: false,
			areaStyle: {
				normal: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						offset: 0,
						color: 'rgba(166,109,240,0.8)'
					}, {
						offset: 1,
						color: 'rgba(19,138,240,0.2)'
					}], false)
				}
			},
			itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						offset: 0,
						color: '#a66df0'
					}, {
						offset: 1,
						color: '#138af0'
					}], false)
                },
                emphasis: {
                    opacity: 1,
					shadowBlur: 15,
                    shadowColor: '#114c9a'
                }
            },
            data: []
            //data:[10, 32, 51, 75, 90, 150, 210]
        }
    ]
};


function removeMsg(){
	$("#LabeldialogMsg").remove();
}

function msgDialog(title, msg) {
	var str = '<div class="Success_Bomb" id="LabeldialogMsg" style="display: block;">'+
		'<div class="upgradeBomb_content">'+
			'<p class="close"><img src="/static/img/close.png" width="18" height="17" onclick="removeMsg()"></p>'+
			'<h3 class="succ_title" title=""><span>'+title+'</span></h3>'+
			'<div class="">'+
				'<p class="succ_Desc" id="message">'+msg+'</p>'+
				'<div class="btns">'+
					'<span class="saveBtn" onclick="removeMsg()">确认</span>'+
				'</div>'+
			'</div>'+
		'</div>'+
	'</div>';
		
	$(".flowFrom").append(str);
}


function getChartDate(){
	
	$.ajax({
		url:"/om/flow/flow_trend",
		type:'POST',
		async:true,
		cache:true,
		data:{
			startDate: searhTime.start, //开始日期(必传)
			endDate: searhTime.end,	//结束日期(必传)
			srcIp: searhTime.srcIp,       //源Ip
			dstIp: searhTime.dstIp,       //目标Ip
			numPerPage: pageNumArr.numPerPage,      //查询条数(必传)
			pageNum: pageNumArr.pageNum,      //从第几条开始查(必传)
		},
		success:function(data) {
			
			//console.log(data);
			var result = JSON.parse(data);
			
			if (result != null || result != "" || result != undefined){
				var flow = result.flowTends;
				for (var i = 0; i < flow.count.length; i ++){
					flow.count[i] > 0 ? flow.count[i] = flow.count[i]/10000 : flow.count[i] = flow.count[i];
				}
				//netflowChart.clear();
				netflowChart.setOption({
					xAxis: {data:flow.time},
	                series:[{
	                    data: flow.count,
	                }]
	
				});
			}
		},
		error: function(err){
			console.log('error:'+err);
		}
	})
}


function getTblData(){
	
	$.ajax({
		url:"/om/flow/flow_infos",
		type:'POST',
		async:true,
		cache:true,
		data:{
			startDate: searhTime.start, //开始日期(必传)
			endDate: searhTime.end,	//结束日期(必传)
			srcIp: searhTime.srcIp,       //源Ip
			dstIp: searhTime.dstIp,       //目标Ip
			numPerPage: pageNumArr.numPerPage,      //查询条数(必传)
			pageNum: pageNumArr.pageNum,      //从第几条开始查(必传)
		},
		success:function(data) {
			
			//console.log(data);
			$("#flowTbl tbody").empty();
			sourceTblInfo.splice(0,sourceTblInfo.length);
			
			var result = JSON.parse(data);
			
			if (result != null || result != "" || result != undefined){

				var source = result.source;
				
				//sourceTblInfo = result.source;
				var trs = "";
				for (var i = 0; i < source.length; i ++){
					source[i].index = i;
					sourceTblInfo.push(source[i]);
					var timestamp = '';
					if (source[i].timestamp != undefined){
						var time = new Date(source[i].timestamp);
						//var timestamp = getDateTime(time, '00');
						var timestamp = datetimeFormat_2(source[i].timestamp);
						//timestamp != '' ? timestamp = timestamp.split(" ")[0] : timestamp = timestamp;
					}
					
					trs += "<tr onclick='sourceName(this, "+i+")' data='0'>"+
					        "<td width='25%'><i class='addLine'>+</i>"+timestamp+"</td>"+             // 采集时间
							"<td width='15%'>"+(source[i].protocol == undefined ? source[i].protocol = '' : source[i].protocol = source[i].protocol)+"</td>"+         // 协议
							"<td width='15%'><span class='sourceIp'>"+(source[i].ip_src_addr == undefined ? source[i].ip_src_addr = '' : source[i].ip_src_addr = source[i].ip_src_addr)+"</span></td>"+      //访问Ip
							"<td width='15%'>"+(source[i].ip_src_port == undefined ? source[i].ip_src_port = '' : source[i].ip_src_port = source[i].ip_src_port)+"</td>"+      // 访问主机端口
							"<td width='15%'>"+(source[i].ip_dst_addr == undefined ? source[i].ip_dst_addr = '' : source[i].ip_dst_addr = source[i].ip_dst_addr)+"</td>"+      // 被访问主机IP
							"<td width='15%'>"+(source[i].ip_dst_port == undefined ? source[i].ip_dst_port = '' : source[i].ip_dst_port = source[i].ip_dst_port)+"</td>"+      // 被访问主机端口
							//"<td>"+timestamp+"</td></tr>";             // 采集时间
							"</tr>";
				}
				
				
				
				$("#flowTbl tbody").append(trs);
				$(".search.btn").css({"display":"block"});
				
				//分页
				var totalCount = result.totalCount; //总条数
				var numPerPage = result.numPerPage;//每页显示条目数
				var pageSum = result.pageSum;//总分页数
				var pageNum = result.pageNum;//当前索引
				pageNumArr.pageNum = 1; //当前页目
				if (source.length > 0){
					if (isfirstload == true){
						isfirstload = false;
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
					            	
					            	pageNumArr.pageNum = page; //当前页目
					            	getTblData();
					            }
					    }
						$("#page1 #pageLimit").bootstrapPaginator(page_options);
						$("#page1 .countItem").text(totalCount);
					}
					
					
					var _top = $("#flowTbl").offset().top;
					var cHieght = getClientHeight();
					var _tblHeight = cHieght - _top;
					$(".tbl_tbody").css({"height":"auto","overflow":"hidden","display":"inline-block"});
					if ($(".tbl_tbody").height() > _tblHeight){
						$(".tbl_tbody").css({"height":(_tblHeight-30)+"px","overflow":"auto","display":"block"});
					}
					
					
				} else {
					$("#page1 #pageLimit").empty();
					$("#page1 .countItem").text('0');
					isfirstload = false;
					$("#flowTbl tbody").append("<tr><td colspan='6' style='text-align:center'>暂无查询结果</td></tr>");
				}
				
					 
			}
		},
		error: function(err){
			console.log('error:'+err);
		}
	})
}

function sourceName(obj, index){
	var state = $(obj).attr("data");//状态
	
	if (state == '0'){
		//展开
		$(obj).attr("data","1");
		$(obj).find(".addLine").text("-");
		//var ip_src_addr = $(obj).find(".sourceIp").text();
		
		var tr = "";
		for (var i = 0; i < sourceTblInfo.length; i++){
			//if (ip_src_addr == sourceTblInfo[i].ip_src_addr){
			if (index == sourceTblInfo[i].index){
				
				tr = "<tr><td colspan='6'><div class='tblTDInfo'><table class=''>" +
						 "<tr><td width='20%'>访问Ip</td><td width='80%'>"+(sourceTblInfo[i].ip_src_addr == undefined ? sourceTblInfo[i].ip_src_addr = '' : sourceTblInfo[i].ip_src_addr = sourceTblInfo[i].ip_src_addr)+"</td></tr>"+
						 "<tr><td>访问主机端口</td><td>"+(sourceTblInfo[i].ip_src_port == undefined ? sourceTblInfo[i].ip_src_port = '' : sourceTblInfo[i].ip_src_port = sourceTblInfo[i].ip_src_port)+"</td></tr>"+
						 "<tr><td>被访问主机IP</td><td>"+(sourceTblInfo[i].ip_dst_addr == undefined ? sourceTblInfo[i].ip_dst_addr = '' : sourceTblInfo[i].ip_dst_addr = sourceTblInfo[i].ip_dst_addr)+"</td></tr>"+
						 "<tr><td>被访问主机端口</td><td>"+(sourceTblInfo[i].ip_dst_port == undefined ? sourceTblInfo[i].ip_dst_port = '' : sourceTblInfo[i].ip_dst_port = sourceTblInfo[i].ip_dst_port)+"</td></tr>"+
						 "<tr><td>采集时间</td><td>"+(sourceTblInfo[i].timestamp == undefined ? sourceTblInfo[i].timestamp = '' : sourceTblInfo[i].timestamp = sourceTblInfo[i].timestamp)+"</td></tr>"+
						 "<tr><td>被访问地址所属国家</td><td>"+(sourceTblInfo[i]['enrichments:geo:ip_dst_addr:country'] == undefined ? sourceTblInfo[i]['enrichments:geo:ip_dst_addr:country'] = '' : sourceTblInfo[i]['enrichments:geo:ip_dst_addr:country'] = sourceTblInfo[i]['enrichments:geo:ip_dst_addr:country'])+"</td></tr>"+
						 "<tr><td>协议</td><td>"+(sourceTblInfo[i].protocol == undefined ? sourceTblInfo[i].protocol = '' : sourceTblInfo[i].protocol = sourceTblInfo[i].protocol)+"</td></tr>"+
						 "<tr><td>被访问地址经纬度</td><td>"+(sourceTblInfo[i]['enrichments:geo:ip_dst_addr:location_point'] == undefined ? sourceTblInfo[i]['enrichments:geo:ip_dst_addr:location_point'] = '' : sourceTblInfo[i]['enrichments:geo:ip_dst_addr:location_point'] = sourceTblInfo[i]['enrichments:geo:ip_dst_addr:location_point'])+"</td></tr>"+
						 "<tr><td>被访问地址纬度</td><td>"+(sourceTblInfo[i]['enrichments:geo:ip_dst_addr:latitude'] == undefined ? sourceTblInfo[i]['enrichments:geo:ip_dst_addr:latitude'] = '' : sourceTblInfo[i]['enrichments:geo:ip_dst_addr:latitude'] = sourceTblInfo[i]['enrichments:geo:ip_dst_addr:latitude'])+"</td></tr>"+
						 "<tr><td>被访问地址经度</td><td>"+(sourceTblInfo[i]['enrichments:geo:ip_dst_addr:longitude'] == undefined ? sourceTblInfo[i]['enrichments:geo:ip_dst_addr:longitude'] = '' : sourceTblInfo[i]['enrichments:geo:ip_dst_addr:longitude'] = sourceTblInfo[i]['enrichments:geo:ip_dst_addr:longitude'])+"</td></tr>"+
						 "<tr><td>主键</td><td>"+(sourceTblInfo[i].guid == undefined ? sourceTblInfo[i].guid = '' : sourceTblInfo[i].guid = sourceTblInfo[i].guid)+"</td></tr>"+
						 "<tr><td>原始数据</td><td>"+(sourceTblInfo[i].original_string == undefined ? sourceTblInfo[i].original_string = '' : sourceTblInfo[i].original_string = sourceTblInfo[i].original_string)+"</td></tr>" +
				 		"</table></div></td></tr>";
				 break;
			}
		}
		$(obj).after(tr);
		
	} else {
		$(obj).attr("data","0");
		$(obj).find(".addLine").text("+");
		$(obj).next('tr').remove();
	}
}

//采集时间
function datetimeFormat_2(longTypeDate){ 
	  var datetimeType = ""; 
	  var date = new Date(); 
	  date.setTime(longTypeDate);
	  datetimeType = date.getFullYear()+"-"+getMonth(date)+"-"+getDay(date)+" "+getHours(date)+":"+getMinutes(date)+":"+getSeconds(date);//yyyy-MM-dd 00:00:00格式日期
	  return datetimeType;
	}
//返回 01-12 的月份值  
function getMonth(date){ 
  var month = ""; 
  month = date.getMonth() + 1; //getMonth()得到的月份是0-11 
  if(month<10){ 
    month = "0" + month; 
  } 
  return month; 
} 
//返回01-30的日期 
function getDay(date){ 
  var day = ""; 
  day = date.getDate(); 
  if(day<10){ 
    day = "0" + day; 
  } 
  return day; 
}
//返回小时
function getHours(date){
  var hours = "";
  hours = date.getHours();
  if(hours<10){ 
    hours = "0" + hours; 
  } 
  return hours; 
}
//返回分
function getMinutes(date){
  var minute = "";
  minute = date.getMinutes();
  if(minute<10){ 
    minute = "0" + minute; 
  } 
  return minute; 
}
//返回秒
function getSeconds(date){
  var second = "";
  second = date.getSeconds();
  if(second<10){ 
    second = "0" + second; 
  } 
  return second; 
}


function getDateTime(date, minutes){
	var year = date.getFullYear(),
		month = date.getMonth()+1,
		date_d = date.getDate(),
		hours = date.getHours();
		//minutes = date.getMinutes();
	
	month < 10 ? month = '0'+month : month = month;
	date_d < 10 ? date_d = '0'+date_d : date_d = date_d;
	hours < 10 ? hours = '0'+hours : hours = hours;
	//minutes < 10 ? minutes = '0'+minutes : minutes = minutes;
	minutes == '59' ? hours = '23' : hours = hours;
	var result = year+'-'+month+'-'+date_d+' '+hours+':'+minutes+':'+minutes;
	
	return result;
}


function init() {
	
	//加载echart
	netflowChart.setOption(netflow_option);
	
	//结束日期
	var nowDate = new Date();
	var endDate = getDateTime(nowDate, '59');
	
	
	//开始日期
	//var startTime = new Date().getTime();
	//startTime = startTime-(15*60*1000); //15分钟
	//var startTimeTemp = new Date(startTime);//时间戳为10位需*1000(10位为秒)，时间戳为13位的话不需乘1000(13位为毫秒)
	//var startDate = getDateTime(startTimeTemp, '00');
	var startTime = new Date();
	var startDate = getDateTime(startTime, '00');
	
	console.log(startDate + "-------"+endDate);
	searhTime.start = startDate;
	searhTime.end = endDate;
	
	$("input[name='begin']").val(startDate);
	$("input[name='end']").val(endDate);
	
	//初始化图表
	getChartDate();
	
	//初始化表格
	getTblData();
	
}

// 初始化
init();

function getPastHalfYear() {
    // 先获取当前时间
    var curDate = (new Date()).getTime();
    // 将半年的时间单位换算成毫秒
    var halfYear = 365 / 2 * 24 * 3600 * 1000;
    var pastResult = curDate - halfYear;  // 半年前的时间（毫秒单位）
 
    // 日期函数，定义起点为半年前
    var pastDate = new Date(pastResult),
        pastYear = pastDate.getFullYear(),
        pastMonth = pastDate.getMonth() + 1,
        pastDay = pastDate.getDate();
    
    console.log('半年前是：' + pastYear + '-' + pastMonth + '-' + pastDay);
    return pastYear + '-' + pastMonth + '-' + pastDay;
}

//查询条件判断
function timeRange(){
	var starInput = $("input[name='begin']").val();
	var endInput = $("input[name='end']").val();

	if (starInput != "" && endInput != ""){
		var starTime = (new Date(starInput)).getTime();
		var endTime = (new Date(endInput)).getTime();
		var nowTime = (new Date()).getTime();
		
		var twoDaysTime = 48*60*60*1000;//结束日期和开始日期之间只能相差两天
		var getPfYear = getPastHalfYear();//当前日期的6个月以内的时间
		var sixMouthTime = (new Date(getPfYear)).getTime();
		//console.log(sixMouthTime);
			
		if ((endTime - starTime) >= 0 && (endTime - starTime) <= twoDaysTime && starTime <= nowTime && starTime >= sixMouthTime && endTime >= sixMouthTime){
			return true;
		} else {
			var str = "<div style='font-size:16px;margin-top:27px;'>请输入有效的查询时间范围！</div>"+
					  "<div style='line-height:25px;'>1、起、止时间范围不超过48小时</div>"+
					  "<div style='line-height:25px;'>2、起始时间不超过当前日期</div>"+
					  "<div style='line-height:25px;'>3、起始时间不能大于结束时间</div>";
			return str;
		}
	} else {
		return "时间范围不能为空";
	}
}


$("#btnSearch").click(function() {
	var state = timeRange();
	if (state == true){
		//loadding
		var str = "<div class='loadding'><div class='loader_round'></div></div>";
		$(".hostPage").append(str);
		setTimeout(function(){
			$('.loadding').remove();
		}, 800)
		
		var srcIpValue = $("input[name='beginIp']").val(); //源Ip
		var dstIpValue = $("input[name='endIp']").val();//目标Ip
		searhTime.srcIp = srcIpValue;
		searhTime.dstIp = dstIpValue;
		
		var startValue = $("input[name='begin']").val();
		var endValue = $("input[name='end']").val();
		
		/*if(startValue.indexOf(" ") < 0){
			startValue = startValue+" 00:00:00";
		}
		if(endValue.indexOf(" ") < 0){
			endValue = endValue+" 00:00:00";
		}*/
		
		searhTime.start = startValue;
		searhTime.end = endValue;
		

		
		
		isfirstload = true;
		
		//初始化图表
		getChartDate();
		//初始化表格
		getTblData();
		
		
		
	} else {
		//alert(1);
		msgDialog("流量追溯", state);
	}
});
