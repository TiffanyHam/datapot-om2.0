$(document).ready(function() {

	$('#load').fadeIn(); //loading加载
	dashboardTbl_init(); //仪表盘数据
	
  
	

	//变化最大危险资产函数
	var bigHost = {};
	function biggestPage(current){
		var biggestList = bigHost.biggestList;
		var pageSize = bigHost.pageSize;
		$("#table02 tbody").empty();

		var dataSize;
		if(biggestList.length - ((current - 1) * pageSize) >= pageSize){
			dataSize = pageSize;
		}else{
			dataSize = biggestList.length - ((current - 1) * pageSize);
		}
		
		//数据少于或等于5条，隐藏分页
		if( biggestList.length < 5 || biggestList.length == 5 ){
			$("#biggestPageId").css('display','none');
		}else{
			$("#biggestPageId").css('display','block');
		}
		
	    var flag = 0;
	    var biggestContents = '';
		//数据
		for(var i = (current - 1) * pageSize; i < biggestList.length; i++) {
			if(flag == dataSize){
				break;
			}
			flag += 1;
			
			biggestContents += '<tr>' +
			'<td><a class="tab_name" href="javascript:;" onclick="">' + biggestList[i].hostName + '</a></td>' +
			'<td>' + biggestList[i].preThread + '</td>' +
			'<td>' + biggestList[i].preCertainty + '</td>' +
			'<td>' + biggestList[i].curThreat + '</td>' +
			'<td>' + biggestList[i].curCertainty + '</td>' +
			'</tr>';			
		}
		$("#table02 tbody").append(biggestContents);
	}
	
	
	// 请求仪表盘数据
	var detecteName = [], //环状图类别名
		detecteValue = [], //环状图存值
		behaviorName = [], //柱状图类别名
		behaviorValue = [], //柱状图存值
		typesName = [], //柱状图类别名
		typesValue = [], //柱状图存值
	    stageName = {}, // 状态对应的名称
		total_round = 0;

	function dashboardTbl_init() {
		$.ajax({
			url: "om/detection_threat/dashboard_data",
			type: 'POST',
			async: true,
			cache: true,
			success: function(data) {
				$("#table08 tbody").empty(); //清空table
				$("#table09 tbody").empty(); //清空table
				$("#table10 tbody").empty(); //清空table
				if(data.retCode == 1) {
					console.log(data);
					$('#load').fadeOut();

					//主机危险性总览
					var OverviewList = data.result.hostThreatOverviewCount; //获取列表信息(主机危险性总览)
					var OverviewContents_one = '';
					var OverviewContents_two = '';

					var total = 0; //主机数求和
					for(var x in OverviewList) {
						total += OverviewList[x].countNum;
					}
					
					for(var x in OverviewList) {
						var stage = OverviewList[x].priority; //等级
						//console.log(stage);
						switch(stage) {
							case 1:
								color_imgs = '<img src="/static/img/state_gray.png" width="128" height="24" class="item2" />';
								stage_imgs = '<img src="/static/img/state04.png"/>';
								priorityName = '<h3 class="reports_text03">' + OverviewList[x].priorityName + '</h3>'
								break;
							case 2:
								color_imgs = '<img src="/static/img/state_yellow.png" width="128" height="24" class="item3" />';
								stage_imgs = '<img src="/static/img/state01.png"/>';
								priorityName = '<h3 class="reports_text04">' + OverviewList[x].priorityName + '</h3>'
								break;
							case 3:
								color_imgs = '<img src="/static/img/state_orange.png" width="128" height="24" class="item0" />';
								stage_imgs = '<img src="/static/img/state03.png"/>';
								priorityName = '<h3 class="reports_text01">' + OverviewList[x].priorityName + '</h3>'
								break;
							case 4:
								color_imgs = '<img src="/static/img/state_red.png" width="128" height="24" class="item1" />';
								stage_imgs = '<img src="/static/img/state02.png"/>';
								priorityName = '<h3 class="reports_text02">' + OverviewList[x].priorityName + '</h3>'
								break;
						}

						//判断不同状态填进不同容器
						if(stage < 3) {

							if(stage == 1) {
								OverviewContents_one +=
									'<div class="dashboard_item d_item_'+x+'" onclick="dashHost()">' + priorityName + color_imgs + '<p class="reports_part">' + '<span>' + stage_imgs + '</span>' +
									'<span class="reports_num">' + OverviewList[x].countNum + '</span>' +
									'<span class="host_info"><i class="host_name">主机</i><img src="/static/img/line2.png" width="55" height="54"/><img src="/static/img/minus.png" class="minus_img"><i class="host_num">0</i></span>' +
									'</p><p class="reports_change">(本次分析阶段分数变化)</p></div>';
							} else {
								OverviewContents_one +=
									'<div class="dashboard_item d_item_'+x+'" onclick="dashHost()">' + priorityName + color_imgs + '<p class="reports_part">' + '<span>' + stage_imgs + '</span>' +
									'<span class="reports_num">' + OverviewList[x].countNum + '</span>' +
									'<span class="host_info"><i class="host_name">主机</i><img src="/static/img/line2.png" width="55" height="54"/><img src="/static/img/minus.png" class="minus_img"><i class="host_num">0</i></span>' +
									'</p><p class="reports_results">当前分析结果：' + total + 'Hosts</p></div>';

							}

						} else {

							OverviewContents_two +=
								'<div class="dashboard_item d_item_'+x+'" onclick="dashHost()">' + priorityName + color_imgs + '<p class="reports_part">' + '<span>' + stage_imgs + '</span>' +
								'<span class="reports_num">' + OverviewList[x].countNum + '</span>' +
								'<span class="host_info"><i class="host_name">主机</i><img src="/static/img/line2.png" width="55" height="54"/><img src="/static/img/minus.png" class="minus_img"><i class="host_num">0</i></span>' +
								'</p></div>';

						}

					}

					$(".reports_column_one").append(OverviewContents_one);
					$(".reports_column_two").append(OverviewContents_two);

					//危险资产数据
					var assetsList = data.result.assets; //获取列表信息(危险资产)
					var assetsContents = '';

					for(var i = 0; i < assetsList.length; i++) {
						assetsContents +=
							'<tr>' +
							'<td><a class="tab_name" href="javascript:;" onclick="dashHost()">' + assetsList[i].hostName + '</a></td>' +
							'<td>' + assetsList[i].hostIp + '</td>' +
							'<td>' + assetsList[i].threat + '</td>' +
							'<td>' + assetsList[i].certainty + '</td>' +
							'</tr>';
					}

					$("#table08 tbody").append(assetsContents);

					//变化最大危险资产
					var biggestList = data.result.biggestMovers; //获取列表信息(变化最大危险资产)
					
					//变化最大危险资产(分页)
					var pageId = "biggestPageId";
					var page = "<div id='" + pageId + "' class='PageId'></div>";
					$(".biggest_tab").append(page);
					
					var pageSize = 30;
					var current = 1;
					bigHost.biggestList = biggestList;
					bigHost.pageSize = pageSize;
					var page = $("#" + pageId).CustomPage({
						pageId:pageId,
						pageSize: pageSize,
						count: biggestList.length,
						current: 1,
						updateSelf: true,
						callback:biggestPage
					});
					biggestPage(1);

					//关键资产
					var keyAssetsList = data.result.hosts; //获取列表信息(变化最大危险资产)
					var stages = [1, 4, 6, 7];
					for(var i = 0; i < keyAssetsList.length; i++) {
						var keyContents = $('<tr></tr>');
						var tdName = '<td><a class="tab_name" href="javascript:;" onclick="detectionHost(this)">' + keyAssetsList[i].hostName + '</a></td>';
						keyContents.append(tdName);
						var stageArr = keyAssetsList[i].stages.split(',');
						for(x in stages) {
							var tdStage = $('<td></td>');
							for(y in stageArr) {
								if(stageArr[y] == stages[x]) {
									tdStage.append('<span class="reports_circle"><img src="/static/img/circle.png"></span>');
									break;
								}
							}
							keyContents.append(tdStage);
						}
						$("#table10 tbody").append(keyContents);
					}

					// 攻击行为阶段
					var stageName = data.result.detectionStages;
					var colorArr = ["#2796b3", "#b2a71d", "#b61a32", "#6912bc", "#b68435"];
					var keyThead = '';
					var index = [1,4,6,7];
					for(var i in index) {
						var sName;
						for(var k in stageName) {
							if(index[i] == stageName[k].stage){
								sName = stageName[k].stageName;
								break;
							}
							
						}
						
						//var sName = stageName[k].stage;
						var sColor = colorArr[i];
						keyThead += '<th><span class="color_one" style="background:' + sColor + '">' + sName + '</span></th>';

					}
					$("#table10 thead tr").append(keyThead);

					//图表初始化

					//检测处理分类
					breakdownsList = data.result.breakdowns;
					
					$.each(breakdownsList, function(index, item) {
						total_round += item.num;
						var name = item.dealStatusName + "：" + item.num + "（" + item.perCentum + "）";
						detecteName.push(name); //挨个取出类别并填入类别数组 
						detecteValue.push({
							value: item.num, //各区域值
							name: name //各区域名称
						});
					});
					
					
					/*detectionCharts.setOption({ //加载数据图表

						legend: {
							data: detecteName
						},
						series: [{
							data: detecteValue
						}]
					});*/
					setRoundChart(total_round);
					

					//攻击阶段
					
					var stagesList = data.result.detectionStages.reverse();
					$.each(stagesList, function(index, item) {
						//console.log(item.stage);
						behaviorName.push(item.stageName); //挨个取出类别并填入类别数组 
						behaviorValue.push({
							value: item.num, //各区域值
							name: item.stageName //各区域名称
						});
					});
					behaviorCharts.setOption({ //加载数据图表

						yAxis: {
							data: behaviorName
						},
						series: [{
							data: behaviorValue
						}]
					});

					//攻击类型
					var typesList = data.result.detectionTypes.reverse();
					$.each(typesList, function(index, item) {
						//console.log(item.stage);
						typesName.push(item.type); //挨个取出类别并填入类别数组 
						typesValue.push({
							value: item.num, //各区域值
							name: item.stage //各区域名称
						});
					});
					aggressiveCharts.setOption({ //加载数据图表

						yAxis: {
							data: typesName
						},
						series: [{
							data: typesValue
						}]
					});

				} else {
					console.log('状态错误:' + data.retCode);
					$('#load').fadeOut();
				}
			},
			error: function(e) {
				console.log('请求失败');
			}
		})

	}

	/*环状图*/
	var dotTxt_x = 0, dotTxt_y = 0 , dotNum_x = 0, dotNum_y = 0;
	var dot_x = 180, dot_y = $(".echarts_bg_dashboard").height()/2;
		dotTxt_x = 167;//180-(26/2)
		dotNum_x = dotTxt_x - 5;
		dotTxt_y = dot_y - 15; //50/2
		dotNum_y = dotTxt_y - 25;
		
	var position_x = dot_x + 120, legend_y = 0;

	var detectionCharts = echarts.init(document.getElementById('charts_one'));
	
	//var data= [{num:'20',name:'发现'},{num:'20',name:'发现'},{num:'20',name:'发现'}];
	/*for(var x in breakdownsList) {
		var intData = parseInt(breakdownsList[x].num);
		total = total + intData;
	}*/
	
	
	function setRoundChart(total_round) {
		var option_01 = {
				 title: [ {
			            text:total_round,  //Number(data[0].num) + Number(data[1].num) + Number(data[2].num)
			            left: dotTxt_x, //'24%',
			            top: dotNum_y, //'42%',
			            textAlign: 'center',
			            textBaseline: 'middle',
			            textStyle: {
			                color: '#9d9fa8',
			                fontSize: 22,
			                fontWeight: 'normal',
			                position: 'center'
			            }
			        }, {
			            text: '发现',
			            left: dotTxt_x, //'24%',
			            top: dotTxt_y,  //'55%',
			            textAlign: 'center',
			            textBaseline: 'middle',
			            textStyle: {
			                color: '#9d9fa8',
			                fontWeight: 'normal',
			                position: 'center',
			                fontSize: 12
			            }
			        }],
	
			tooltip: {
				trigger: 'item',
				formatter: "{a} <br/>{b}",
				show: true           //取消 鼠标滑过的提示框
	
			},
			color: ["#3290ff", "#9d9fa8", "#225da8"],
			legend: {
				orient: 'vertical',
				selectedMode: false, //取消图例的点击事件
				left:position_x,  // '45%',
				top: '35%',
				data: detecteName,
				textStyle: {
					fontSize: '12',
					color: "#9d9fa8"
				}
	
			},
			calculable: false,
			series: [{
				name: '检测处理分类',
				type: 'pie',
				center: [170, 110],
				//center: ['20%', '40%'],
				radius: [70, 80],
				//radius: ['50%', '60%'],//这里是控制环形内半径和外半径
				hoverAnimation: false, //关闭 hover 在扇区上的放大动画效果。
				cursor: 'default', //鼠标悬浮时在图形元素上时鼠标的样式是什么。同 CSS 的 cursor。
				itemStyle: {
					normal: {
						label: {
							show: false,//显示中间数据
							/*formatter: function(data) {
								return '{a|' + data.value + '}' + "\n" + "\n" + '{b|发现}';
	
							},
							rich: { // 在文本中，可以对部分文本采用 rich 中定义样式。
								a: {
									fontSize: '22',
									color: "#9d9fa8"
								},
								b: {
									fontSize: '12',
									color: "#9d9fa8"
								}
							},*/
	
							position: 'center',
	
						},
	
						labelLine: {
							show: false
						},
	
					},
	
				},
				data: detecteValue
	
			}]
		};
		detectionCharts.setOption(option_01); // 为echarts对象加载数据
	}
	

	/*柱状图1*/
	//var left_b = '500';
	//var left_b = $(".echarts_bg_dashboard").width() - 190;
	//var left_b = ($(document).width() * 550) / 1920;
	var left_b = $("#charts_two").width()*0.7;
	
	var behaviorCharts = echarts.init(document.getElementById('charts_two'));
		option_02 = {

		tooltip: {
			trigger: 'item',
		},
		calculable: true,
		grid: {
			/*x: 70,
			x2: 220,
			y: 20,
			y2: 20,
			height: 150*/

			left: '20%',
			right: '10%',
			top: '10%',
			bottom: '10%'
		},
		xAxis: [{
			show: false,
			type: 'value',
			boundaryGap: [0, 0.01]
		}],
		yAxis: [{
			show: true,
			type: 'category',
			data: [], //['遥控', '嗅探', '扩散', '肉鸡', '泄露'],
			barWidth: 10, //柱图宽度
			triggerEvent: true,
			axisLine: {
				show: false
			}, //坐标轴
			axisTick: [{ //坐标轴小标记
				show: false
			}],
			axisLabel: {
				textStyle: {
					fontSize: '12',
					color: "#317FDA"
				}
			}

		}],
		series: [{
			//          name:'2011年',
			type: 'bar',
			tooltip: {
				show: false
			},
			barWidth: 10, //柱宽度
			data: [], //[18, 12, 45, 56, 78],
			//barGap:'50%',
			//barCategoryGap:'50%',
			itemStyle: {

				normal: {
					label: {
						show: true, //显示文本
						 //position: 'right',
						position: [left_b, '0'], //数据值位置
						//position: ['30%', '0'],
						textStyle: {
							fontSize: '12',
							color: "#9d9fa8",
						}
					},

					color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [

						{
							offset: 0,
							color: '#1b3863'
						}, {
							offset: 1,
							color: '#3386e4'
						}
					]),

				}
			}

		}]
	};
	
	behaviorCharts.setOption(option_02);
	
	//echarts图表点击跳转  
	/*   myChart2.on('click', function (param){  
                    var name=param.name;  
                    if(name=="用户数"){  
                        window.location.href="${base}/admin/user/list.htm";  
                    }else if(name=="栏目数"){  
                        window.location.href="${base}/admin/classify/list.htm";  
                    }else if(name=="新闻数"){  
                        window.location.href="${base}/admin/news/list.htm";  
                   }else{  
                    window.location.href="${base}/admin/file/list.htm";  
                   }                      
                });  
                myChart.on('click',eConsole);  
      */
	/*柱状图2*/

	var myChart = document.getElementById('charts_three');
	// 基于准备好的dom，初始化echarts实例
	var aggressiveCharts = echarts.init(myChart);

	option_03 = {

		tooltip: {
			trigger: 'item',
		},
		calculable: true,
		grid: {
			/*left: 120,
			right: 220,
			top: 20,
			bottom: 20*/

			left: '20%',
			right: '10%',
			top: '10%',
			bottom: '10%'
		},
		xAxis: [{
			show: false,
			type: 'value',
			boundaryGap: [0, 0.01]
		}],
		yAxis: [{
			show: true,
			type: 'category',
			data: [], //['遥控', '嗅探', '扩散', '肉鸡', '泄露'],
			barWidth: 10, //柱图宽度
			//barGap:'50%',
			//barCategoryGap:'50%',
			axisLine: {
				show: false
			}, //坐标轴
			axisTick: [{ //坐标轴小标记
				show: false
			}],
			axisLabel: {
				textStyle: {
					fontSize: '12',
					color: "#317FDA"
				}
			}

		}],
		series: [{
			type: 'bar',
			tooltip: {
				show: false
			},
			barWidth: 10, //柱宽度
			data: [], //[18, 12, 45, 56, 78],
			itemStyle: {
				normal: {
					label: {
						show: true, //显示文本
						position: [left_b, '0'], //数据值位置
						textStyle: {
							fontSize: '12',
							color: "#9d9fa8",
							align: 'left'
						}
					},
					color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
						offset: 0,
						color: '#1b3863'
					}, {
						offset: 1,
						color: '#3386e4'
					}]),

				}
			}

		}]
	};
	aggressiveCharts.setOption(option_03);

})

//仪表盘页面点击主机名跳转页面
function dashHost() {
	$(".content").empty();
//	$(".a2").removeClass("navdown");
//	$(".a3").addClass("navdown");
//	$('.a2 img').attr('src', '/static/img/plat_icon1.png');
//	$('.a3 img').attr('src', '/static/img/ch2.png');
	var _next = $(".navdown").next();
	var htmlobj = $.ajax({
		url: '/om/host_threat/index',
		type: "POST",
		async: false,
		success: function(data) {
			editEvent(_next,3,1);
			$(".content").html(data);
			document.body.scrollTop = 0; // 回到顶部
		}
	});
}

//核心资产 --主机跳转到  主机检测模式
function detectionHost(obj) {
	$("#dashboardHost").val($(obj).text());
	$(".content").empty();
	$(".a2").removeClass("navdown");
	$(".a3").addClass("navdown");
	$('.a2 img').attr('src', '/static/img/plat_icon1.png');
	$('.a3 img').attr('src', '/static/img/ch2.png');
	var htmlobj = $.ajax({
		url: '/om/host_threat/index',
		type: "POST",
		async: false,
		success: function(data) {
			$(".content").html(data);
			document.body.scrollTop = 0; // 回到顶部
		}
	});
}
