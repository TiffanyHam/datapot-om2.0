var agreementChart = echarts.init(document.getElementById('agreement'));
var upDownControlChart = echarts.init(document.getElementById('upDownControl'));
var sourceIpChart = echarts.init(document.getElementById('sourceIp'));
var targetIpChart = echarts.init(document.getElementById('targetIp'));
var cityIpChart = echarts.init(document.getElementById('cityIp'));


var agreement_option ={
    title : {
        text: '协议占比',
		//subtext: 'percentage of agreement',
		textStyle: {
            color: '#fefefc',
            fontSize: '14'
        },
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
		left:'1%',
        top:'3%',
		textStyle: {
            color: '#919294',
            fontSize: '12'
        },
        //data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
    },
    series : [
        {
            name: '协议占比',
            type: 'pie',
            radius : '55%',
            center: ['50%', '60%'],
			color: ['#138af0', '#17c7d4', '#f8d56f', '#a76ced','#5c9e21','#c0c1c4','#ffc1c2','#fdfdff','#fec049','#9f1b51','#dea438','#432e59'],
			data: [],
            /*data:[
                {value:335, name:'直接访问'},
                {value:310, name:'邮件营销'},
                {value:234, name:'联盟广告'},
                {value:135, name:'视频广告'},
                {value:1548, name:'搜索引擎'}
            ],*/
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};

var upDownControl_option = {

    title: {
        text: '流量上下行趋势',
		//subtext: 'upstream and downstream comparison',
		textStyle: {
            color: '#fefefc',
            fontSize: '14'
        },
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
		textStyle: {
            color: '#919294',
            fontSize: '12'
        },
        data:['上行','下行']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type : 'category',
      //  name: '时',
        nameLocation:'end',
        nameGap: '5',
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
		 data: [],
        //data: ['周一','周二','周三','周四','周五','周六','周日']
    },
    yAxis: {
		type : 'value',
		name: '单位：万',
        nameLocation:'end',
        nameGap: '10',
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
            name:'上行',
            type:'line',
			smooth: true,
			symbol: 'circle',
			//symbol: 'image://data:image/png;base64,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',
            symbolSize: 6,
			areaStyle: {
				normal: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						 offset: 0,
	                        /*color: '#00c0e9'*/
							color: '#a746a3'
	                    }, {
	                        offset: 1,
	                        /*color: '#3b73cf'*/
							color: '#f3a8e0'
					}], false)
				}
			},
			itemStyle: {
                normal: {
                    color: '#f3a8e0'
                },
                emphasis: {
                    opacity: 1,
					shadowBlur: 15,
                    shadowColor: '#f3a8e0'
                }
            },
            data: [],
            //data:[10, 32, 51, 75, 90, 150, 210]
        },
        {
            name:'下行',
			smooth: true,
			symbol: 'circle',
/*			symbol: 'image://data:image/png;base64,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',
*/            symbolSize: 6,
            type:'line',
			areaStyle: {
				normal: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						offset: 0,
						color: 'rgba(13,177,205,0.8)'
					}, {
						offset: 1,
						color: 'rgba(13,177,205,0.2)'
					}], false)
				}
			},
            itemStyle: {
                normal: {
                    color: 'rgba(13,177,205,1)'
                },
                emphasis: {
                    opacity: 1,
					shadowBlur: 15,
                    shadowColor: '#015571'
                }
            },
            data: [],
            //data:[220, 192, 160, 120, 80, 30, 10]
        }
    ]
};

var sourceIp_option = {

    title: {
        text: '内网IP访问TOP10',
		//subtext: 'source IP top 10',
		textStyle: {
            color: '#fefefc',
            fontSize: '14'
        },
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {
        //data: ['2011年', '2012年']
    },
    grid: {
        left: '2%',
        right: '5%',
        bottom: '8%',
        containLabel: true
    },
    xAxis: {
        type: 'value',
        name: '单位：万',
        nameLocation:'middle',
        nameGap: '30',
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
			},
		 //rotate:30
		}
    },
    yAxis: {
        type: 'category',
       // name: 'IP',
        nameLocation:'end',
        nameGap: '10',
        nameTextStyle:{
        	color: '#919294'
        },
		boundaryGap : false,
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
			show: false,
			lineStyle: {
				color: '#333'
			}
		},
		 data: [],
        //data: ['192.168.0.123', '192.168.0.12', '192.168.0.13', '192.168.0.23', '192.168.0.3', '192.168.0.4', '192.168.0.54', '192.168.0.78', '192.168.0.52', '192.168.0.65']
    },
    series: [
        {
            name: '',
            type: 'bar',
			itemStyle: {
                normal: {
                    show: true,
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                        offset: 0,
                        color: '#01d3d2'
                    }, {
                        offset: 1,
                        color: '#88ecec'
                    }]),
                    barBorderRadius: 50,
                    borderWidth: 0,
                },
                emphasis: {
                    shadowBlur: 15,
                    shadowColor: '#129eff'
                }
            },
            barWidth: '10',
            data: [],
            //data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
        }
    ]
};

var targetIp_option = {

    title: {
        text: '外网IP访问TOP10',
		//subtext: 'the target IP top 10',
		textStyle: {
            color: '#fefefc',
            fontSize: '14'
        },
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {
        //data: ['2011年', '2012年']
    },
    grid: {
        left: '2%',
        right: '5%',
        bottom: '8%',
        containLabel: true
    },
    xAxis: {
        type: 'value',
        name: '单位：万',
        nameLocation:'middle',
        nameGap: '30',
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
			},
			//rotate:30
		}
    },
    yAxis: {
        type: 'category',
       // name: 'IP',
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
		data: [],
        //data: ['192.168.0.123', '192.168.0.12', '192.168.0.13', '192.168.0.23', '192.168.0.3', '192.168.0.4', '192.168.0.54', '192.168.0.78', '192.168.0.52', '192.168.0.65']
    },
    series: [
        {
            name: '',
            type: 'bar',
			itemStyle: {
                normal: {
                    show: true,
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                        offset: 0,
                        /*color: '#00c0e9'*/
						color: '#138af0'
                    }, {
                        offset: 1,
                        /*color: '#3b73cf'*/
						color: '#b5defe'
                    }]),
                    barBorderRadius: 50,
                    borderWidth: 0,
                },
                emphasis: {
                    shadowBlur: 15,
                    shadowColor: '#00eded'
                }
            },
            barWidth: '10',
            data: [],
            //data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
        }
    ]
};

var cityIp_option = {
	title: {
        text: '流量访问来源城市前10',
		//subtext: 'city IP top 10',
		textStyle: {
            color: '#fefefc',
            fontSize: '14'
        },
    },
    color: ['#3398DB'],
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        left: '1%',
        right: '6%',
        bottom: '3%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            name: '城市',
            nameLocation:'end',
            nameGap: '5',
            nameTextStyle:{
            	color: '#919294'
            },
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
				},
				//rotate:50
				rotate:50
			},
			splitLine: {
				show: false,
				lineStyle: {
					color: '#333'
				}
			},
			data: [],
            //data : ['上海', '北京', '深圳', '广州', '青岛', '杭州', '苏州', '天津', '成都', '东莞']
        }
    ],
    yAxis : [
        {
            type : 'value',
            name: '单位：万',
            nameLocation:'end',
            nameGap: '10',
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
        }
    ],
    series : [
        {
            name:'',
            type:'bar',
			itemStyle: {
                normal: {
                    show: true,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        /*color: '#00c0e9'*/
						color: '#f3a8e0'
                    }, {
                        offset: 1,
                        /*color: '#3b73cf'*/
						color: '#a746a3'
                    }]),
                    barBorderRadius: 50,
                    borderWidth: 0,
                },
                emphasis: {
                    shadowBlur: 15,
                    shadowColor: '#724ca1'
                }
            },
            barWidth: '10',
            data: [],
            //data:[100, 90, 80, 70, 60, 50, 40, 30, 20, 10]
        }
    ]
};


//add loading
function loadingAnimate(){
	var str = "<div class='loadding'><div class='loader_round'></div></div>";
	$(".halves").each(function(index) {
		if (index != 0){
			$(this).append(str);
		}
	});
}

//remove loading
function loadingAnimateHide(id){
	$("#"+id).parent(".halves").find(".loadding").remove();
}

//get data common
function getCommonData(data){
	
	var nameArr = [], valueArr = [], result = new Object();
	
	for(var i = data.length - 1; i >= 0; i--){
		nameArr.push(data[i].name);
		if (data[i].value > 0){
			var _v = data[i].value / 10000;
			valueArr.push(_v);
		} else {
			valueArr.push(data[i].value);
		}
	}
	result.name = nameArr;
	result.value = valueArr;
	
	return result;
}

//日志分析
function LogData() {
	$.ajax({
		url:"/om/over_view/get_file_info",
		type:'POST',
		async:true,
		cache:true,
		data:{},
		success:function(data) {			
			var result = JSON.parse(data);
			console.log(result);
			if (result != null || result != "" || result != undefined){
				
				//日志文件大小				
				var a_length = result.logFileSize.length;//字符长度
				var a_unit = result.logFileSize.substring(a_length-1,a_length);//截取字符单位 
				var a_num = result.logFileSize.substring(0 , a_length - 1);//截取数字 
				//console.log(num);
				var a_text = $("<span>"+ a_num + "<i class ='unit'>"+ a_unit +"</i></span>");
				
				//剩余存储空间
                var b_length = result.freeSpace.length;//字符长度
				var b_unit = result.freeSpace.substring(b_length-1,b_length);//截取字符单位 
				var b_num = result.freeSpace.substring(0 , b_length - 1);//截取数字 
				var b_text = $("<span>"+ b_num + "<i class ='unit'>"+ b_unit +"</i></span>");
				
				//事件总数
				//$(".lmContent .num[data='eventCount']").text(result.eventCount);
				//日志文件大小
				$(".lmContent .num[data='logFileSize']").html(a_text);
				//剩余储存空间
				$(".lmContent .num[data='freeSpace']").html(b_text);
				//日志存储天数
				$(".lmContent .num[data='logDays']").text(result.logDays);
				
				
			}
		},
		error:function(err){
			console.log("err:"+err);
		}
	})
}

//事件总数、上下行对比
function upAndDowData(){
	$.ajax({
		url:"/om/over_view/get_event_updown",
		type:'POST',
		async:true,
		cache:true,
		data:{},
		success:function(data) {
			console.log(data);
			loadingAnimateHide("upDownControl");
			var result = JSON.parse(data);
			if (result != null || result != "" || result != undefined){
				//事件总数
				$(".lmContent .num[data='eventCount']").text(result.eventCount);
				
				//上下行对比
				var upDownControlData = result.andDown;
				for (var i = 0; i < upDownControlData.up.length; i ++){
					upDownControlData.up[i] > 0 ? upDownControlData.up[i] = upDownControlData.up[i]/10000 : upDownControlData.up[i] = upDownControlData.up[i];
					upDownControlData.down[i] > 0 ? upDownControlData.down[i] = upDownControlData.down[i]/10000 : upDownControlData.down[i] = upDownControlData.down[i];
				}
				upDownControlChart.setOption({
					xAxis: {data:upDownControlData.time},
                    series:[{
                        data: upDownControlData.up,
                    },{
                        data: upDownControlData.down,
                    }]

				});
				
				
			}
		},
		error:function(err){
			console.log("err:"+err);
		}
	})
}


//源Iptop10、目标Iptop10、城市top10、协议占比
function topData(){
	$.ajax({
		url:"/om/over_view/get_tops",
		type:'POST',
		async:true,
		cache:true,
		data:{},
		success:function(data) {
			console.log(data);
			
			var result = JSON.parse(data);
			if (result != null || result != "" || result != undefined){
				
				loadingAnimateHide("agreement");
				
				//协议占比
				var agreementData = [];
				agreementData = result.protocol;
				agreementChart.setOption({
                    series:[{
                        data: agreementData,
                    }]

				});
				
				//源ip
				loadingAnimateHide("sourceIp");
				var sourceIpData = result.srcIp, sipArr = [], sipData = [];
				var sObj = getCommonData(sourceIpData);
				sipArr = sObj.name;
				sipData = sObj.value;
				/*for(var i = sourceIpData.length - 1; i >= 0; i--){
					sipArr.push(sourceIpData[i].name);
					if (sourceIpData[i].value > 0){
						var value = sourceIpData[i].value / 10000;
						sipData.push(value);
					} else {
						sipData.push(sourceIpData[i].value);
					}
				}*/
				sourceIpChart.setOption({
					yAxis: {data:sipArr},
                    series:[{
                        data: sipData,
                    }]
				});
				
				
				//目标ip
				loadingAnimateHide("targetIp");
				var targetIpData = result.dstIp, tipArr = [], tipData = [];
				var tObj = getCommonData(targetIpData);
				tipArr = tObj.name;
				tipData = tObj.value;
				/*for(var j = targetIpData.length - 1; j >= 0; j--){
					tipArr.push(targetIpData[j].name);
					if (targetIpData[j].value > 0){
						var value = targetIpData[j].value / 10000;
						tipData.push(value);
					} else {
						tipData.push(targetIpData[j].value);
					}
					
				}*/
				targetIpChart.setOption({
					yAxis: {data:tipArr},
                    series:[{
                        data: tipData,
                    }]
				});
				
				
				//城市ip
				loadingAnimateHide("cityIp");
				var cityIpData = result.cityTop.reverse(), cipArr = [], cipData = [];
				var cObj = getCommonData(cityIpData);
				cipArr = cObj.name;
				cipData = cObj.value;
				/*for(var k = cityIpData.length - 1; k >= 0; k--){
					cipArr.push(cityIpData[k].name);
					if (cityIpData[k].value > 0){
						var value = cityIpData[k].value / 10000;
						cipData.push(value);
					} else {
						cipData.push(cityIpData[k].value);
					}
					
				}*/
				cityIpChart.setOption({
					xAxis: {data:cipArr},
                    series:[{
                        data: cipData,
                    }]
				});
				
			}
		},
		error:function(err){
			console.log("err:"+err);
		}
	})
}

function init() {
	//协议占比
	//agreementChart.showLoading();agreementChart.hideLoading();
	agreementChart.setOption(agreement_option);
	//上下行流量分析
	upDownControlChart.setOption(upDownControl_option);
	//源ip
	sourceIpChart.setOption(sourceIp_option);
	//目标ip
	targetIpChart.setOption(targetIp_option);
	//城市ip
	cityIpChart.setOption(cityIp_option);
	//loading
	loadingAnimate();
	
	//日志分析：/om/over_view/get_file_info
	LogData();
	
	//事件总数和上下行：/om/over_view/get_event_updown
	upAndDowData();
	
	//Ip、城市top10和协议：/om/over_view/get_tops
	topData();
	
	
}

init();
