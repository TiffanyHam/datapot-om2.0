 /**折现图**/
    var certaintyArr = [],
    	timeArr = [],
    	threatArr = [];
    
    /*var option = {
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
            right: '20',
        	left: '30',
            bottom: '10',
            top: '10',
            containLabel: true
        },
        xAxis : [
            {
            	show:true,
                type : 'category',
                boundaryGap : false,
                data : timeArr,//['2017-10-25','2017-10-25','2017-10-25','2017-10-25','2017-10-25','2017-10-25','2017-10-25'],
                splitLine:{
                    show:true,
                    lineStyle:{
                        color:'#2c303a'
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
        yAxis : [
            {
                show:false,
                type : 'value',
                splitLine:{
                    show:false
                }
            }
        ],
        series : [{
            name:'可信度',
            type:'line',
            stack: '总量',
            symbol:'none',
            data:certaintyArr,//[220, 132, 286, 134, 190, 130, 210],
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
                data:threatArr,//[320, 182, 306, 134, 290, 130, 310],
                symbol:'none',
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
                                color:'#33629e',
                            },{
                                offset:1,
                                color:'#72abf3',
                            }]
                        },
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }
                },
                itemStyle: {
                    normal: {
                        color: 'rgb(23,29,49)',
                        borderColor: 'rgba(23,29,49,0.27)',
                        borderWidth: 12
                    }
                }
            }
        ]
    };*/
    var option = {
            //color:["rgba(35,96,168,0.7)","rgba(146,200,88,0.7)"],
        	backgroundColor: '#171c2f',
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
                x: '10px',
                y: '10px',
                x2: '30px',
                y2: '10px',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : timeArr,//日期
                    splitLine:{
                        show:false
                    },
                    axisTick:{
                        show:false
                    },
                    axisLabel:{
                        show: true,
                        //interval:0,//横轴信息全部显示  
                        //rotate:-30,//-30度角倾斜显示  
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
                    //symbol:'none',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 3,
                    showSymbol: false,
                    data:certaintyArr,//可信度
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
                                }],
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
                    data:threatArr,//威胁度
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
                                }],
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

    
    
    /* 入侵  */
    function detecDetail_threat(){
    	
    	$.ajax({
			url: "/om/detection_threat/host_detections",
			type: 'POST',
			async: true,
			cache: true,
			data: {
				'hostIp': hostIp
			},
			success: function(data) {
				//console.log('统计主机的威胁阶段信息');
				//console.log(data);
				$("#threatSatge span").each(function(index) {
					var li = $(this).text();
					$(".invade_con .text_"+index).text(li);
					
					var stageNum = $("#threatSatgeNum").val();
					$(".deteTitle, .invade_con .stage_"+stageNum).css({"background":""+gradeColorArr[stageNum]});
					$(".deteTitle").text($("#threatSatge .stage_"+stageNum).text());
				});
				
			},
			error: function(e){
				
			}
    	})
    }
	
    /* 主机信息  */
   /* function detecDetail_host(){

    	$.ajax({
			url: "/om/detection_threat/get_host",
			type: 'POST',
			async: true,
			cache: true,
			data: {
				'detectId': detectId
			},
			success: function(data) {
				//console.log(data);
			},
			error: function(e){
				
			}
    	})
    }*/
    
    /* 时间轴  */
    function detecDetail_timeShaft(){
    	$.ajax({
			url: "/om/detection_threat/get_host_threat",
			type: 'POST',
			async: true,
			cache: true,
			data: {
				'hostIp': hostIp
			},
			success: function(data) {
				//console.log("时间轴");
				//console.log(data);
				certaintyArr.splice(0, certaintyArr.length);
				timeArr.splice(0, timeArr.length);
				threatArr.splice(0, threatArr.length);
				
				for (var i in data.result) {
					var result = data.result;
					timeArr.push(result[i].detectTime);
					threatArr.push(result[i].threat);
					certaintyArr.push(result[i].certainty);
				}
				
				var deteSoftChart = echarts.init(document.getElementById('deteSoftChart'));
				deteSoftChart.setOption(option);
				
			},
			error: function(e){
				
			}
    	})
    }
    
    /* 检测摘要  */
    function detecDetail_abstract() {
    	
    	$.ajax({
			url: "/om/detection_activity/get_host_active",
			type: 'POST',
			async: true,
			cache: true,
			data: {
				'detectId': detectId
			},
			success: function(data) {
				//console.log(data);
				if (data.retCode == 1){
					
					var externalIpStr = '';
					var result = data.result;
					//多个外部ip
					if (result.externalIp.indexOf(",") > 0){
						var ipObj = result.externalIp.split(",");
						for (var i = 0; i < ipObj.length; i ++){
							if (i == ipObj.length - 1){
								externalIpStr += ipObj[i];
							} else {
								externalIpStr += ipObj[i] + ",&nbsp;&nbsp;";
							}
						}
					} else {
						externalIpStr = result.externalIp;
					}
					
					var str = '<p>外网入侵服务器：'+externalIpStr+'</p>'+
                    		  '<p>下载次数：'+result.countNum+'</p>'+
                    		  '<p>文件：'+result.fileName+'</p>';
					$("#hd_digestInfo").append(str);
					
				}
				
				
			},
			error: function(e){
				console.log(e);
			}
    	})
    }
    
    /* 列表  */
    var pageNum_c = 1;
    var isfirstLoad = true;
    function detecDetail_tbl() {
    	
    	$.ajax({
			url: "/om/detection_activity/get_activities",
			type: 'POST',
			async: true,
			cache: true,
			data: {
				'detectId': detectId,
				'numPerPage':10,
				'pageNum':pageNum_c
			},
			success: function(data) {
				console.log(data);
				$("#detectionDetailTal tbody").empty();
				var str = '';
				for (var i in data.result.results) {
					var result = data.result.results;
					str += '<tr>'+
		                        '<td><a class="tab_name" href="#" onclick=""><i class="ic_label"></i>+</a></td>'+
		                        '<td>'+result[i].externalIp+'</td>'+
		                        '<td>'+result[i].uri+'</td>'+
		                        '<td>'+result[i].fileName+'</td>'+
		                        '<td>'+result[i].fileSize+'</td>'+
		                        '<td>'+result[i].port+'</td>'+
		                        '<td>'+fmtDate(result[i].detectTime)+'</td>'+
		                    '</tr>';
					
				}
				$("#detectionDetailTal tbody").append(str);
				
				//分页
				var totalCount = data.result.totalCount; //总条数
				var numPerPage = data.result.numPerPage;//每页显示条目数
				var pageSum = data.result.pageSum;//总分页数
				var pageNum = data.result.pageNum;//当前索引
				
				if (isfirstLoad == true){
					/*var page = '<div id="page1" class="f_right"></div>';
					$parent = $("#page1").parent();
					$parent.empty();
					$parent.append(page);
					pageNum = 1;
					
					var page2 = $("#page1").CustomPage({
						pageSize: numPerPage,
						count: totalCount,
						current: 1,
						updateSelf: true,
						callback: detecPageCallBack
					});*/
					
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
				            //点击事件
				            onPageClicked: function (event, originalEvent, type, page) {
				            	
				            	pageNum_c = page; //当前页目
				            	detecDetail_tbl();
				            }
				    };
					$("#page1 #pageLimit").bootstrapPaginator(page_options);
					$("#page1 .countItem").text(totalCount);
				}
					
				
			},
			error: function(e){
				
			}
    	})
    }
    
    /*function detecPageCallBack(page){
    	pageNum = page+1; //当前页目
    	detecDetail_tbl();
    }*/
    
    /**威胁度、可信度**/
    /*$("#slider, #slider2" ).slider({
        max: 100,
        value: $(this).attr("value"),
        stop:function (event,ui) {
            //console.log(ui);
            var value = ui.value;
            var elem = $(this).attr("data");
            $("#"+elem).animate({left: '+'+value+'%'}, "slow");
            $("#"+elem+" .t_radius").text(value);
        }
    });
    var s1Value = $("#slider").attr("value");
    var s2Value = $("#slider2").attr("value");
    $("#slider").slider( "value", s1Value);
    $("#slider2").slider( "value", s2Value);
    $("#sliderValue1").css({"left":s1Value+"%"});
    $("#sliderValue2").css({"left":s2Value+"%"});*/
    var trust = $("#slider2").attr("value");
    var theart = $("#slider").attr("value");
    if (trust != ""){
    	trust = Number(trust);
    	trust = (trust/100)*100;
    	if (theart > 90){
    		theart = theart - 1;
    	}
    	$("#sliderValue2, .slider2_i").css({left: trust+'%'});
    }
    
    if (theart != ""){
    	theart = Number(theart);
    	theart = (theart/100)*100;
    	if (theart > 90){
    		theart = theart - 6;
    	}
    	$("#sliderValue1, .slider_i").css({left: theart+'%'});
    }
    
    

    /**入侵**/
    $(".invadeLI").bind("click",function () {
        var _offset = $(this).offset();
        $(".invadeInfo").css({"left":_offset.left-150, "top":_offset.top, "display":"block"})
    })
    $(".invadeInfo a.close").bind("click",function () {
        $(".invadeInfo").css({"display":"none"})
    })
    
    
  