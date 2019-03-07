	var cityChart = echarts.init(document.getElementById("city_charts")); //城市top10
	var srcIpChart = echarts.init(document.getElementById("ip_charts")); //源IpTop10
	var desIpChart = echarts.init(document.getElementById("des_charts")); //目标IpTop10
	var requestChart = echarts.init(document.getElementById('request_charts')); //http请求方式
	var codesChart = echarts.init(document.getElementById('codes_charts')); //响应码
	var trendChart = echarts.init(document.getElementById("trend_charts")); //流量趋势图

	//城市top10
	var cityOption = {
		tooltip: {
				trigger: 'axis',
				axisPointer: {  // 坐标轴指示器，坐标轴触发有效
					type: 'shadow'
				}
			},
		grid: {
			left: '6%',
			right: '6%',
			bottom: '5%',
			top: '8%',
			containLabel: true
		},
		xAxis: {
			//name: '城市',
            nameLocation:'end',
            nameGap: '5',
            nameTextStyle:{
            	color: '#919294'
            },
			data: [], //['青岛', '北京', '上海', '成都', '广州', '南京', '深圳', '杭州', '天津', '东莞'],
			axisLine: {

				lineStyle: {
					color: '#919294'
				}
			},
			axisTick: {
				show: false //去掉刻度标尺
			},
			splitLine: {
				show: false,
				lineStyle: {
					color: '#333'
				}
			},
			axisLabel: {
				color: '#919294',
				fontSize: 12,
				rotate: 50
			}
		},
		yAxis: {
			name: '单位：万',
            nameLocation:'end',
            nameGap: '10',
            nameTextStyle:{
            	color: '#919294'
            },
			axisTick: {
				show: false
			},
			nameTextStyle: {
				color: '#919294',
				fontSize: 12
			},
			axisLine: {
				lineStyle: {
					color: '#919294'
				}
			},
			axisLabel: {
				color: '#919294',
				fontSize: 12
			},
			splitLine: {
				show: true,
				lineStyle: {
					color: '#333'
				}
			}

		},
		series: [{
			type: 'bar',
			barWidth: 18,
			itemStyle: {
				normal: {
					show: true,
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						offset: 0,
						color: '#00b0ff'
					}, {
						offset: 0.8,
						color: '#7052f4'
					}]),
					shadowColor: 'rgba(0, 0, 0, 0.1)',
					shadowBlur: 10
		 		}
			},
			
			data: [] // [11254, 6154, 3654, 3454, 1757, 911, 811, 654, 454, 357]
		}]
	};

	//源ip top10
	
/*	

	var ipOption = {
	 //   backgroundColor: '#0E2A43',
	    legend: {
	        bottom: 20,
	        textStyle:{
	            color:'#fff',
	        },
	        data: ['访入', '访出']
	    },
	    grid: {
	        left: '3%',
	        right: '4%',
	        bottom: '10%',
	        containLabel: true
	    },
	    
	            tooltip: {
	        show:"true",
	        trigger: 'axis',
	        axisPointer: { // 坐标轴指示器，坐标轴触发有效
	            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
	        }
	    },
	    xAxis:  {
	        type: 'value',
	        axisTick : {show: false},
	        axisLine: {
	            show: false,
	            lineStyle:{
	                color:'#fff',
	            }
	        },
	        splitLine: {
	            show: false
	        },
	    },
	    yAxis: [
	            {
	                type: 'category',
	                axisTick : {show: false},
	                axisLine: {
	                    show: true,
	                    lineStyle:{
	                        color:'#fff',
	                    }
	                },
	                data: ['广州','深圳','东莞','天津','惠州','北京三级','成都','南京','重庆','长沙']
	            },
	            {
	                type: 'category',
	                axisLine: {show:false},
	                axisTick: {show:false},
	                axisLabel: {show:false},
	                splitArea: {show:false},
	                splitLine: {show:false},
	                data: ['广州','深圳','东莞','天津','惠州','北京三级','成都','南京','重庆','长沙']
	            },
	            
	    ],
	    series: [
	        {
	            name: '有效房源量',
	            type: 'bar',
	            yAxisIndex:1,
	            
	            itemStyle:{
	                normal: {
	                    show: true,
	                    color: '#277ace',
	                    barBorderRadius:50,
	                    borderWidth:0,
	                    borderColor:'#333',
	                }
	            },
	            barGap:'0%',
	            barCategoryGap:'50%',
	            data: [120, 132, 101, 134, 90, 230, 210, 125, 231, 132]
	        },
	        {
	            name: '钥匙量',
	            type: 'bar',
	            itemStyle:{
	                normal: {
	                    show: true,
	                    color: '#5de3e1',
	                    barBorderRadius:50,
	                    borderWidth:0,
	                    borderColor:'#333',
	                }
	            },
	            barGap:'0%',
	            barCategoryGap:'50%',
	            data: [32, 52, 41, 64, 15, 10, 32, 25, 210, 32]
	        }
	       
	    ]
	};*/

	var ipOption = {

		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			}
		},
		legend: {
			data: ['2011年', '2012年']
		},
		grid: {
			left: '4%',
			right: '6%',
			bottom: '12%',
			top: '4%',
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
			axisTick: {
				show: false
			},
			axisLabel: {
				show: true,
				textStyle: {
					color: '#919294'
				},
			//	rotate: 30

			}
		},
		yAxis: {
			type: 'category',
		//	name: 'IP',
	        nameLocation:'end',
	        nameGap: '10',
	        nameTextStyle:{
	        	color: '#919294'
	        },
			boundaryGap: false,
			splitLine: {
				show: true
			},
			axisTick: {
				show: false
			},
			axisLabel: {
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
		},
		series: [{
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
					shadowColor: '#00eded'
				}
			},
			barWidth: '10',
			data: [],
		}]
	};

	//目标ip top10
	var desIpTop_option = {

		/*title: {
			text: '目标IP前10',
			//subtext: 'the target IP top 10',
			textStyle: {
				color: '#919294',
				fontSize: '14'
			},
		},*/
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
			left: '4%',
			right: '6%',
			bottom: '12%',
			top: '4%',
			containLabel: true
		},
		xAxis: {
			name: '单位：万',
			nameLocation:'middle',
	        nameGap: '30',
	        nameTextStyle:{
	        	color: '#919294'
	        },
			type: 'value',
			splitLine: {
				show: true,
				lineStyle: {
					color: '#333'
				}
			},
			axisTick: {
				show: false
			},
			axisLabel: {
				show: true,
				textStyle: {
					color: '#919294'
				},
				//rotate: 30

			}
		},
		yAxis: {
			type: 'category',
			//name: 'IP',
	        nameLocation:'end',
	        nameGap: '10',
	        nameTextStyle:{
	        	color: '#919294'
	        },
			boundaryGap: false,
			splitLine: {
				show: false
			},
			axisTick: {
				show: false
			},
			axisLabel: {
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
		},
		series: [{
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
					shadowColor: '#129eff'
				}
			},
			barWidth: '10',
			data: [],
		}]
	};

	//http请求方式

	var requestOption = {
			tooltip : {
		        trigger: 'item',
		        formatter: "{a} <br/>{b} : {c} ({d}%)"
		    },
		  /*  legend: {
		    	show: true,
		        orient: 'vertical',
				left:'1%',
		        top:'3%',
				textStyle: {
		            color: '#919294',
		            fontSize: '12'
		        },
		    },*/
		    legend: {
		    	show: true,
				orient: 'vertical',  //图例列表的布局朝向。
				x: 'left',
				left: '5%', // '45%',
				top: '2%', 
				//selectedMode: false, //取消图例的点击事件
				textStyle: {
		            color: '#919294',
		            fontSize: '12'
		        },
		        icon: 'circle' //图例标识圆形
		    },
		    series : [
		        {
		            name: '请求方式',
		            type: 'pie',
		            radius : '55%',
		            center: ['63%', '50%'],
		            label: {
		                normal: {
		                    show: false
		                },
		                emphasis: {
		                    show: true
		                }
		            },
		            lableLine: {
	                    //length:0.001,
		                normal: {
		                    show: true,
		                },
		                emphasis: {
		                    show: true
		                }
		            },
					color: ['#138af0', '#17c7d4', '#f8d56f', '#a76ced', "#26a9e2", "#75d373", "#91da47", "#00dcf8", "#3784ff", "#9aebff"],
					data: [],
		            itemStyle: {
		                emphasis: {
		                    shadowBlur: 10,
		                    shadowOffsetX: 0,
		                    shadowColor: 'rgba(0, 0, 0, 0.5)'
		                }
		            }
		        }
		    ]
		/*tooltip: {
			trigger: 'item',
			formatter: "{a} <br/>{b}: {c} ({d}%)"
		},
		legend: {
			show: true,
			orient: 'vertical',
			x: 'left',
			 left: '55%', // '45%',
			top: '30%', 
			selectedMode: false, //取消图例的点击事件
			textStyle: {
				fontSize: '12',
				color: "#9d9fa8"
			},
			data: [], // ['get', 'post', '404', '200', 'HTTP', 'PUT', 'TRACE', 'OPTIONS', 'DELETE', 'HEAD'],
			icon: 'circle' //图例标识圆形
		},
		series: [{
				name: '访问来源',
				type: 'pie',
				center: ['55%', '50%'],
				radius: ['60%', '70%'],
				hoverAnimation: false, //关闭 hover 在扇区上的放大动画效果。
				color: ['#138af0', '#17c7d4', '#f8d56f', '#a76ced', "#26a9e2", "#75d373", "#91da47", "#00dcf8", "#3784ff", "#9aebff"],
				//  color: ["#2d848e", "#49b4c1", "#4e78cc", "#376edd", "#1c60ea", "#094047","#91da47","#00dcf8","#3784ff","#e9df5e"],
				avoidLabelOverlap: false,
				label: {
					normal: {
						show: false,
						position: 'center'
					},
					emphasis: {
						show: false
					}
				},
				labelLine: {
					normal: {
						show: false
					}
				},
				data: []
			}

		]*/
	};

	//http响应码
	var codesOption = {
			tooltip : {
		        trigger: 'item',
		        formatter: "{a} <br/>{b} : {c} ({d}%)"
		    },
		    legend: {
		    	show: true,
				orient: 'horizontal',  //图例列表的布局朝向。
				x: 'right',
				left: '60%', // '45%',
				top: '10%', 
				//selectedMode: false, //取消图例的点击事件
				textStyle: {
		            color: '#919294',
		            fontSize: '12'
		        },
		        icon: 'circle' //图例标识圆形
		    },
		    series : [
		        {
		            name: '响应码',
		            type: 'pie',
		            radius : '55%',
		            center: ['33%', '50%'],
		            label: {
		                normal: {
		                    show: false
		                },
		                emphasis: {
		                    show: true
		                }
		            },
		            lableLine: {
		                normal: {
		                    show: true
		                },
		                emphasis: {
		                    show: true
		                }
		            },
					color: [ "#91da47", "#00dcf8","#75d373", "#9aebff",'#138af0', '#17c7d4', "#3784ff",'#f8d56f', '#a76ced', "#26a9e2"],
					data: [],
		            itemStyle: {
		                emphasis: {
		                    shadowBlur: 10,
		                    shadowOffsetX: 0,
		                    shadowColor: 'rgba(0, 0, 0, 0.5)'
		                }
		            }
		        }
		    ]
		/*tooltip: {
			trigger: 'item',
			formatter: "{a} <br/>{b}: {c} ({d}%)"
		},
		legend: {
			show: true,
			orient: 'horizontal',  //图例列表的布局朝向。
			x: 'right',
			left: '60%', // '45%',
			top: '10%', 
			selectedMode: false, //取消图例的点击事件
			textStyle: {
				fontSize: '12',
				color: "#9d9fa8"
			},
			data: [], // ['get', 'post', '404', '200', 'HTTP', 'PUT', 'TRACE', 'OPTIONS', 'DELETE', 'HEAD'],
			icon: 'circle' //图例标识圆形
		},
		series: [{
				name: '访问来源',
				type: 'pie',
				center: ['30%', '50%'],
				radius: ['70%', '50%'],
				hoverAnimation: false, //关闭 hover 在扇区上的放大动画效果。
				color: ['#138af0', '#17c7d4', '#f8d56f', '#a76ced', "#26a9e2", "#75d373", "#91da47", "#00dcf8", "#3784ff", "#9aebff"],
				//  color: ["#2d848e", "#49b4c1", "#4e78cc", "#376edd", "#1c60ea", "#094047","#91da47","#00dcf8","#3784ff","#e9df5e"],
				avoidLabelOverlap: false,
				label: {
					normal: {
						show: false,
						position: 'center'
					},
					emphasis: {
						show: false
					}
				},
				labelLine: {
					normal: {
						show: false
					}
				},
				data: []
			}
		]*/
	};

	//流量趋势图
	var trendOption = {
		grid: {
			left: '4%',
			right: '4%',
			bottom: '4%',
			top: '10%',
			containLabel: true
		},
		title: {
			left: '50%',
			textAlign: 'center'
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				lineStyle: {
					color: '#919294'
				}
			},
			padding: [5, 10],
			/*textStyle: {
				color: 'red',
			},*/
			extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
		},
		legend: {
			right: 20,
			orient: 'vertical',
			data: ['今日'],
			icon: 'circle',
			textStyle: {
				fontSize: '12',
				color: "#9d9fa8"
			}
		},
		xAxis: {
			type: 'category',
			//name: '时',
		    nameLocation:'end',
		    nameGap: '5',
		    nameTextStyle:{
		        	color: '#919294'
		        },
			data: [], // ['00:00', '2:00', '4:00', '6:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', "22:00"],
			boundaryGap: false,
			splitLine: {
				show: false,
				lineStyle: {
					color: '#333'
				}
			},
			axisTick: {
				show: false
			},
			axisLine: {
				lineStyle: {
					color: '#9d9fa8'
				}
			},
			axisLabel: {
				margin: 10,
				textStyle: {
					fontSize: 12
				}
			}
		},
		yAxis: {
			type: 'value',
			name: '单位：万',
	        nameLocation:'end',
	        nameGap: '10',
	        nameTextStyle:{
	        	color: '#919294'
	        },
			splitLine: {
				show: true,
				lineStyle: {
					color: ['#333']
				}
			},
			axisTick: {
				show: false
			},
			axisLine: {
				lineStyle: {
					color: '#9d9fa8'
				}
			},
			axisLabel: {
				margin: 10,
				textStyle: {
					fontSize: 12
				}
			},
			//interval: 50000000,
			//max: 100000000
		},
		series: [{
			name: '今日',
			type: 'line',
			smooth: true,
			showSymbol: true,
			symbol: 'circle',
			symbolSize: 6,
			/*symbol: 'image://data:image/png;base64,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',
			symbolSize: 25,*/
			data: [], // ['31222200', '41333400', '15104408', '56145511', '11066626', '66661288', '67771300', '86889800', '10561100', '59871000', '24531118', '53231322'],
			areaStyle: {
				normal: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						offset: 0,
						color: '#1b3863'
					}, {
						offset: 1,
						color: '#1b3863'
					}], false)
				}
			},
			itemStyle: {
				normal: {
					color: '#317FDA'
				}
			},
			lineStyle: {
				normal: {
					width: 2
				}
			}
		}]
	};

	/*//add loading
		function loadingAnimate(){
			var str = "<div class='loadding'><div class='loader_round'></div></div>";
			$(".echarts_bg_flow").each(function(index) {
				if (index != 0){
					$(this).append(str);
				}
			});
		}

		//remove loading
		function loadingAnimateHide(id){
			$("#"+id).parent(".echarts_bg_flow").find(".loadding").remove();
		}
*/

	/* http事件总数、流量趋势图*/

	function analysisNum() {
		$.ajax({
			url: "/om/httpflow/flow_trend",
			type: 'POST',
			async: true,
			cache: true,
			success: function(data) {
				$(".Http_num").empty();
				if(data) {
					var obj = JSON.parse(data); //将字符串转换为json对象
					//console.log(obj);

					//Http事件总数
					var _eventCount = obj.eventCount;
					var span__eventCount = $('<span class="Http_num_color">' + _eventCount + '</span>' + '<span>&nbsp;&nbsp;计数</span>');
					$(".Http_num").append(span__eventCount);

					//Http流量趋势
					//loadingAnimateHide("trend_charts");
					var trendsName = [],
						trendsValue = [];
					var trends = obj.trafficTrends;
					var trands_value = '';
					for(var i = 0; i < trends.count.length; i++) {
						trendsName.push(trends.time[i]); //挨个取出类别
						trands_value = trends.count[i]/10000;
						trendsValue.push(trands_value); //挨个取出数组
					}

					trendChart.setOption({ //加载数据图表
						xAxis: {
							data: trendsName
						},
						series: [{
							data: trendsValue // 根据名字对应到相应的系列
						}]
					});

				} else {
					console.log('状态错误:' + data.retCode);
				}
			},
			error: function(e) {
				console.log('请求失败');
			}
		})

	}

	/*http请求方式、响应码、城市top10、源IpTop10、目标IpTop10*/

	function analyzeCharts() {
		$.ajax({
			url: "/om/httpflow/method_code",
			type: 'POST',
			async: true,
			cache: true,
			success: function(data) {
				if(data) {
					var obj = JSON.parse(data); //将字符串转换为json对象
					console.log(obj);

					var cityName = [],
						cityValue = [],
						ipName = [],
						ipValue = [],
						desName = [],
						desValue = [],
						meansName = [],
						meansValue = [],
						codesName = [],
						codesValue = [];

					//城市top10

					//loadingAnimateHide("city_charts");
					var city = obj.cityTop;
					var city_value = '';

					for(var i = 0; i < city.length; i++) {
						cityName.push(city[i].name); //挨个取出类别
						city_value = city[i].value / 10000;
						cityValue.push(city_value); //挨个取出数组

					}

					cityChart.setOption({ //加载数据图表
						xAxis: {
							data: cityName
						},
						series: [{
							data: cityValue // 根据名字对应到相应的系列
						}]
					});

					//源IP top10

					//loadingAnimateHide("ip_charts");
					var ip = obj.srcIpTop.reverse();
					var ip_value = '';
					$.each(ip, function(index, item) {
						ipName.push(item.name); //挨个取出类别并填入类别数组 
						ip_value = item.value/10000;
						ipValue.push({
							value: ip_value, //各区域值
							name: item.name //各区域名称
						});
					});
					srcIpChart.setOption({ //加载数据图表

						yAxis: {
							data: ipName
						},
						series: [{
							data: ipValue
						}]

					});

					//目标ip

					//loadingAnimateHide("des_charts");
					var desip = obj.desIpTop.reverse();
					var des_ip = '';
					$.each(desip, function(index, item) {
						desName.push(item.name); //挨个取出类别并填入类别数组 
						des_ip = item.value/10000;
						desValue.push({
							value:des_ip , //各区域值
							name: item.name //各区域名称
						});
					});
					desIpChart.setOption({ //加载数据图表

						yAxis: {
							data: desName
						},
						series: [{
							data: desValue
						}]

					});

					//请求方式
					//loadingAnimateHide("request_charts");
					var means = obj.httpReqMethod;
					$.each(means, function(index, item) {
						meansName.push(item.name); //挨个取出类别并填入类别数组 
						meansValue.push({
							value: item.value, //各区域值
							name: item.name //各区域名称
						});
					});
					requestChart.setOption({ //加载数据图表

						legend: {
							data: meansName
						},
						series: [{
							data: meansValue
						}]

					});

					//响应码
					//loadingAnimateHide("codes_charts");

					var codes = obj.statusCode;
					$.each(codes, function(index, item) {
						codesName.push(item.name); //挨个取出类别并填入类别数组 
						codesValue.push({
							value: item.value, //各区域值
							name: item.name //各区域名称
						});
					});
					codesChart.setOption({ //加载数据图表

						legend: {
							data: codesName
						},
						series: [{
							data: codesValue
						}]

					});

				} else {
					console.log('状态错误:' + data.retCode);
				}
			},
			error: function(e) {
				console.log('请求失败');
			}
		})

	}

	/*初始化*/
	function init() {

		cityChart.setOption(cityOption); //城市top10
		srcIpChart.setOption(ipOption); //源IpTop10
		desIpChart.setOption(desIpTop_option); //目标IpTop10
		requestChart.setOption(requestOption); //http请求方式
		codesChart.setOption(codesOption); //响应码
		trendChart.setOption(trendOption); //流量趋势图
		//loadingAnimate();			//loading
		analysisNum(); //http事件总数和流量趋势图
		analyzeCharts(); //http请求方式、响应码、城市top10、源IpTop10、目标IpTop10

	}
	init();