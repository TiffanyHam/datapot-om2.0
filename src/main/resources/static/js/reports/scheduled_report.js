
$(document).ready(function() {

	//slider插件
	$("#ex1").slider();
	$("#ex1").on("slide", function(slideEvt) {
		$("#ex1SliderVal").text(slideEvt.value);
	});

	$("#ex2").slider();
	$("#ex2").on("slide", function(slideEvt) {
		$("#ex2SliderVal").text(slideEvt.value);
	});

	$("#ex3").slider();
	$("#ex3").on("slide", function(slideEvt) {
		$("#ex3SliderVal").text(slideEvt.value);
	});

	$("#ex4").slider();
	$("#ex4").on("slide", function(slideEvt) {
		$("#ex4SliderVal").text(slideEvt.value);
	});

	//多选下拉
	/*$('#example_one').multiselect({
		//buttonWidth: '100px',
		includeSelectAllOption: true,
		onSelectAll: function() {
			// alert('onSelectAll triggered!');
		}

	});
	$('#example_two').multiselect({
		includeSelectAllOption: true,
		onSelectAll: function() {
			// alert('onSelectAll triggered!');
		}
	});*/

})


	var detecteName = [], //环状图类别名
		detecteValue = [], //环状图存值
		behaviorName = [], //柱状图类别名
		behaviorValue = [], //柱状图存值
		typesName = [], //柱状图类别名
		typesValue = [], //柱状图存值
		total_round = 0;
	var behaviorCharts = echarts.init(document.getElementById('charts_two'));
	// 基于准备好的dom，初始化echarts实例
	var aggressiveCharts = echarts.init(document.getElementById('charts_three'));
	
	//关闭弹窗
	function closeWindow () {
		$('.reports_detail').fadeOut();
		$(".results_footer").find("#keyHostTotalPageId").remove();
		$(".biggest_tab").find("#biggestPageId").remove();
		$(".td_stage3").remove();
		
		
		clearEchartImg();
	}
	
	function clearEchartImg() {
		//清空ecarts生成的图表
		$("#charts_one_div, #charts_two_div, #charts_three_div").empty();
	  	//打开图表div
	  	$("#charts_one, #charts_two, #charts_three").css("display","block");
	}
	
	//生成报告
	function setReport() {
		$('#load').fadeIn();
		clearEchartImg();
		
		setTimeout(function(){ 
			$('#load').fadeOut();
			reports_contents();
		}, 1000);
	}
		
    function reports_contents(){
    	//Scrollup Bottom
	    $(".reports_detail").scroll(function (){
	        if ($(this).scrollTop() > 100) {
	            $(".scrollup").fadeIn();
	        } else {
	            $(".scrollup").fadeOut();
	        }
	    });
	    if ($(".scrollup").length > 0){
	        $(".scrollup").on("click", function (){
	            $(".reports_detail").animate({
	                scrollTop: 0
	            }, 200);
	            return false;
	        });
	    }
		    
		    
		//图表初始化
		
		var params = $("#reports_detail_form").serializeArray(); //查询条件

		$.ajax({
			type: "POST",
			url: "om/detection_threat/dashboard_data",
			type: 'POST',
			async: false,
			cache: true,
			data: params,
			success: function(data) {
				
				$("#table01 tbody").empty(); //清空table
				$("#table02 tbody").empty(); //清空table
				$("#table03 tbody").empty(); //清空table
				$(".reports_column_one").empty();
				$(".reports_column_two").empty();
			
				behaviorName.splice(0,behaviorName.length);//清空数组 
				behaviorValue.splice(0,behaviorValue.length);//清空数组 
				typesName.splice(0,typesName.length);//清空数组 
				typesValue.splice(0,typesValue.length);//清空数组 
				detecteName.splice(0,detecteName.length);//清空数组 
				detecteValue.splice(0,detecteValue.length);//清空数组 
								
				if(data.retCode == 1) {
					$('#load').fadeOut(); //loading
					$('.reports_detail').fadeIn(); //弹窗出现

					//	console.log(data);
					//开始时间
					$("#beginDateTime1").text(data.result.beginDateTime);
					//截止时间
					$("#endDateTime1").text(data.result.endDateTime);
					
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

						switch(stage) {
							case 1:
								color_imgs = '<img src="/static/img/state_gray.png" width="128" height="24" class="item2" />';
								stage_imgs = '<img src="/static/img/state04.png" class="stateImg"/>';
								priorityName = '<h3 class="reports_text03">' + OverviewList[x].priorityName + '</h3>'
								break;
							case 2:
								color_imgs = '<img src="/static/img/state_yellow.png" width="128" height="24" class="item3" />';
								stage_imgs = '<img src="/static/img/state01.png"  class="stateImg"/>';
								priorityName = '<h3 class="reports_text04">' + OverviewList[x].priorityName + '</h3>'
								break;
							case 3:
								color_imgs = '<img src="/static/img/state_orange.png" width="128" height="24" class="item0" />';
								stage_imgs = '<img src="/static/img/state03.png"  class="stateImg"/>';
								priorityName = '<h3 class="reports_text01">' + OverviewList[x].priorityName + '</h3>'
								break;
							case 4:
								color_imgs = '<img src="/static/img/state_red.png" width="128" height="24" class="item1" />';
								stage_imgs = '<img src="/static/img/state02.png"  class="stateImg"/>';
								priorityName = '<h3 class="reports_text02">' + OverviewList[x].priorityName + '</h3>'
								break;
						}

						//判断不同状态填进不同容器
						if(stage < 3) {

							if(stage == 1) {
								OverviewContents_one +=
									'<div class="dashboard_item d_item_'+x+'">' + priorityName + color_imgs + '<p class="reports_part">' + '<span>' + stage_imgs + '</span>' +
									'<span class="reports_num">' + OverviewList[x].countNum + '</span>' +
									'<span class="host_info"><i class="host_name">主机</i><img src="/static/img/line2.png" width="55" height="54"/><img src="/static/img/minus.png" class="minus_img"><i class="host_num">0</i></span>' +
									'</p><p class="reports_change">(本次分析阶段分数变化)</p></div>';
							} else {
								OverviewContents_one +=
									'<div class="dashboard_item d_item_'+x+'">' + priorityName + color_imgs + '<p class="reports_part">' + '<span>' + stage_imgs + '</span>' +
									'<span class="reports_num">' + OverviewList[x].countNum + '</span>' +
									'<span class="host_info"><i class="host_name">主机</i><img src="/static/img/line2.png" width="55" height="54"/><img src="/static/img/minus.png" class="minus_img"><i class="host_num">0</i></span>' +
									'</p><p class="reports_results">当前分析结果：' + total + 'Hosts</p></div>';

							}

						} else {

							OverviewContents_two +=
								'<div class="dashboard_item d_item_'+x+'">' + priorityName + color_imgs + '<p class="reports_part">' + '<span>' + stage_imgs + '</span>' +
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
							'<td><a class="tab_name" href="javascript:;" onclick="">' + assetsList[i].hostName + '</a></td>' +
							'<td>' + assetsList[i].hostIp + '</td>' +
							'<td>' + assetsList[i].threat + '</td>' +
							'<td>' + assetsList[i].certainty + '</td>' +
							'</tr>';
					}

					$("#table01 tbody").append(assetsContents);

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
					var keyAssetsList = data.result.hosts; //获取列表信息
					var stages = [1, 4, 6, 7]
					for(var i = 0; i < keyAssetsList.length; i++) {
						var keyContents = $('<tr></tr>');
						var tdName = '<td><a class="tab_name" href="javascript:;" onclick="">' + keyAssetsList[i].hostName + '</a></td>';
						keyContents.append(tdName);
						var stageArr = keyAssetsList[i].stages.split(',');
						for(var x in stages) {
							var tdStage = $('<td></td>');
							for(var y in stageArr) {
								if(stages[x] == stageArr[y]) {
									tdStage.append('<span class="reports_circle"><img src="/static/img/circle.png"></span>');
									break;
								}
							}
							keyContents.append(tdStage);
						}
						$("#table03 tbody").append(keyContents);
					}

					//图表初始化

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
						keyThead += '<th class="td_stage3"><span class="color_one" style="background:' + sColor + '">' + sName + '</span></th>';
						
						//alert(keyThead);

					}
					$("#table03 thead tr").append(keyThead);

					//检测处理分类
					total_round = null;
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
					
					/*behaviorCharts.setOption({
						legend: {
							data: behaviorName
						},
						yAxis: {
								data: behaviorName
						},
						series: [{
								data: behaviorValue
						}]
					});*/
					ballChart();

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
					/*aggressiveCharts.setOption({ //加载数据图表

						yAxis: {
							data: typesName
						},
						series: [{
							data: typesValue
						}]
					});*/
					ballChart_2();
					
					

				} else {
					console.log('状态错误:' + data.retCode);
				}
			},
			error: function(error) {
				alert("请求数据失败!");
			}
		});

		hostResults_init(); //主机检测结果

	}

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
	
	
	//主机检测结果函数
	var keyHost = {};
	function HostPage(current){
		var hostResultsList = keyHost.hostResultsList;
		var pageSize = keyHost.pageSize;
		var stages = keyHost.stages;
		$("#table04 tbody").empty();

		var dataSize;
		if(hostResultsList.length - ((current - 1) * pageSize) >= pageSize){
			dataSize = pageSize;
		}else{
			dataSize = hostResultsList.length - ((current - 1) * pageSize);
		}
		
		//数据少于或等于5条，隐藏分页
		if( hostResultsList.length < 5 || hostResultsList.length == 5 ){
			$("#keyHostTotalPageId").css('display','none');
		}else{
			$("#keyHostTotalPageId").css('display','block');
		}
		
        var flag = 0;
		//数据
		for(var i = (current - 1) * pageSize; i < hostResultsList.length; i++) {
			if(flag == dataSize){
				break;
			}
			flag += 1;
			
			var trName = $('<tr></tr>');
			var tdName1 = '';
			tdName1 +=
				'<td><a class="tab_name" href="javascript:;">' + hostResultsList[i].hostName + '</a></td>' +
				'<td>' + hostResultsList[i].hostIp + '</td>' +
				'<td>' + hostResultsList[i].curThreat + '</td>' +
				'<td>' + hostResultsList[i].curCertainty + '</td>' +
				'<td>' + hostResultsList[i].peakValueThreat + '</td>' +
				'<td>' + hostResultsList[i].peakValueCertainty + '</td>';
			trName.append(tdName1);

			//数据状态
			var stageArr = hostResultsList[i].stages.split(',');
			var stagesArr1 = stages.split(',');
			for(var x in stagesArr1) {
				if(stagesArr1[x]) {
					var tdStage = $('<td></td>');
					for(var y in stageArr) {
						if(stagesArr1[x] == stageArr[y]) {
							tdStage.append('<span class="reports_circle"><img src="/static/img/circle.png"></span>'); //灰色圆
							break;
						}
					}
					trName.append(tdStage);
				}

			}

			//最近活动时间
			var tdName2 = $('<td>' + hostResultsList[i].detectTime + '</td>');
			trName.append(tdName2);

			$("#table04 tbody").append(trName);
			
		}
	}
	
	var resultHost = {};
	//攻击行为检测结果函数
	function resultPage(current,pageId){
		
		var pageDate = resultHost[pageId];
		var detResultsList = pageDate.detResultsList;
		var pageSize = pageDate.pageSize;
		var stages = pageDate.stages;
		var tableId = pageDate.tableId;
		var _table = $("#"+tableId);
		
		_table.find("tbody").remove();
		
		var dataSize;
	
		if(detResultsList.length - ((current - 1) * pageSize) >= pageSize){
			dataSize = pageSize;
		}else{
			dataSize = detResultsList.length - ((current - 1) * pageSize);
		}
		//数据少于或等于5条，隐藏分页
		if( detResultsList.length < 5 || detResultsList.length == 5 ){
			$("#"+pageId).css('display','none');
		}else{
			$("#"+pageId).css('display','block');
		}
		

		var _tbody = $('<tbody></tbody>');
		var detectiontContents = '';
		//数据
	
		
		var flag = 0;
		for(var y = (current - 1) * pageSize; y < detResultsList.length; y++) {
			if(flag == dataSize){
				break;
			}
			flag += 1;
			
			detectiontContents +=
				'<tr>' +
				'<td>' + detResultsList[y].hostName + '</a></td>' +
				'<td>' + detResultsList[y].peakValueThreat + '</td>' +
				'<td>' + detResultsList[y].peakValueCertainty + '</td>' +
				'<td>' + detResultsList[y].detectTime + '</td>' +
				'</tr>';
		   }
		
		_tbody.append(detectiontContents);
		_table.append(_tbody);
		
		
	}


	//主机检测结果
	function hostResults_init() {
		var params = $("#reports_detail_form").serializeArray(); //查询条件
		//console.log(params);
		$.ajax({
			url: "/om/reports/reports_date",
			type: 'POST',
			async: false,
			cache: true,
			data: params,
			success: function(data) {
				//console.log(222);
				//console.log(data)
				
				$("#table04 tbody").empty(); //清空table
				$("#table05 tbody").empty(); //清空table
				$(".host_result").empty();
				$(".attackBehavior").empty();
				$(".td_stage").remove();
				$(".td_stage2").remove();
				$(".kinds_tabs1").empty();
				$(".kinds_tabs2").empty();
				if(data.retCode == 1) {
					var hostContents = '';
					var hostResultsList = data.result.hostDetectionResults;

					var stages = ''; //阶段状态值
					var sName = ''; //阶段状态名称
					$("#example_one option").each(function() { //遍历example_one里的全部checkbox
						stages += $(this).val() + ","; //获取所有checkbox的值
						sName += $(this).text() + ","; //获取所有checkbox的名称

					});
					//	alert(sName);

					/*主机检测结果（4个主机，1个核心资产）*/
					var _hostTotal = data.result.hostTotal;
					var _keyHostTotal = data.result.keyHostTotal;
					var span_result = $('<span>主机检测结果（' + _hostTotal + '个主机，' + _keyHostTotal + '个核心资产）</span>');
					$(".host_result").append(span_result);
					
					/*攻击行为检测结果（15个）*/
					var _attackBehavior = data.result.attackBehaviorTotal;
					var span_behavior = $('<span>攻击行为检测结果（' + _attackBehavior + '个）</span>');
					$(".attackBehavior").append(span_behavior);

					// 攻击行为阶段名称、颜色
					var colorArr = ["#2796b3", "#b2a71d", "#b61a32", "#6912bc", "#b68435"];

					var keyThead1 = '';
					var nameArr = sName.split(',');
					
					for(var k in nameArr) {
						var keyThead = '';
						//var sName = sName[k].stages;
						if(nameArr[k]) {
							//	alert(k);
							var sColor = colorArr[k];
							keyThead += '<td class="td_stage"><span class="color_one" style="background:' + sColor + '">' + nameArr[k] + '</span></td>';
							$("#table04 thead .trName").append(keyThead);
						}

					}

					$("#table04 thead .trName").append('<td class="td_stage2"></td>');
					
					
                    //主机检测结果---分页
					var pageId = "keyHostTotalPageId";
					var page = "<div id='" + pageId + "' class='PageId'></div>";
					$(".results_footer").append(page);
					
					var pageSize = 30;
					var current = 1;
					keyHost.hostResultsList = hostResultsList;
					keyHost.pageSize = pageSize;
					keyHost.stages = stages;
					var page = $("#" + pageId).CustomPage({
						pageId:pageId,
						pageSize: pageSize,
						count: hostResultsList.length,
						current: 1,
						updateSelf: true,
						callback:HostPage
					});
					HostPage(1);
					
					//攻击行为检测结果
					var detResultsMap = data.result.attackBehaviorDetections; //获取列表信息
					var m = 1;
					var index = 10;
					for(var key in detResultsMap) { //key为Map值
						index += 1;
						var pageId = "page" + index;
						var tableId = "table" + index;
						//	var colorArr = ["#2796b3", "#b2a71d", "#b68435", "#b61a32", "#6912bc"];
						var colorObj = {
							"侦查": "#2796b3",
							"突破": "#b2a71d",
							"控制": "#b61a32",
							"攻击": "#6912bc",
						};
						
						var xArr = key.split('_'); //下划线分割
						//console.log(colorObj[xArr[1]]);

						var _title = '<p class="reports_title"><span class="color_one" style="background:' + colorObj[xArr[1]] + '">' + xArr[1] + '</span><span class="title_name">' + xArr[0] + '<span></p>';

						var _table = $('<table border="0" cellspacing="" cellpadding="" id="' + tableId + '" class="table05"></table>'); //遍历表格									
						var _thead =
							'<thead><tr class="title">' +
							'<th width="45%">主机名</th><th colspan="2" width="20%">峰值</th>' +
							'<th width="35%">最近活动时间</th></tr><tr class="title_special">' +
							'<th></th><th>威胁度</th><th>可信度</th><th></th>' +
							'</tr></thead>';
						_table.append(_thead);

						//攻击行为检测结果---分页
						var pageSize = 30;
						var detResultsList = detResultsMap[key];
						var pageDate = {};
						
						pageDate.detResultsList = detResultsList;
						pageDate.pageSize = pageSize;
						pageDate.stages = stages;
						pageDate.tableId = tableId;
						
						resultHost[pageId] = pageDate;
						
						//分页
						var page = "<div id='" + pageId + "' class='PageId'></div>";
						
						
						//判断key值奇偶数,数据左右两侧分布
						if(m % 2 == 1) {
							$(".kinds_tabs1").append(_title);
							$(".kinds_tabs1").append(_table); //左侧
							$(".kinds_tabs1").append(page);
						} else {
							$(".kinds_tabs2").append(_title);
							$(".kinds_tabs2").append(_table); //右侧
							$(".kinds_tabs2").append(page);
						}
						m += 1;
						
						var page = $("#" + pageId).CustomPage({
							pageId:pageId,
							more:true,
							pageSize: pageSize,
							count: detResultsList.length,
							current: 1,
							updateSelf: true,
							callback:resultPage
						});
						
						resultPage(1,pageId);
						

					}

				} else {
					console.log('状态错误:' + data.retCode);
				}
			},
			error: function(e) {
				console.log('请求失败');
			}
		})

	}

	

	/*环状图*/

	var detectionCharts = echarts.init(document.getElementById('charts_one'));
	    
    function setRoundChart(total_round) {
   	   
    		var dotTxt_x = 0, dotTxt_y = 0 , dotNum_x = 0, dotNum_y = 0;
    		var dot_x = 180, dot_y = $(".echarts_bg_dashboard").height()/2;
    			dotTxt_x = 167;//180-(26/2)
    			dotNum_x = dotTxt_x - 5;
    			dotTxt_y= dot_y - 15; //50/2
    			dotNum_y = dotTxt_y - 25;
    		var position_x = dot_x + 120;
		   var option_01 = {
				title: [ {
		            text:total_round,  //Number(data[0].num) + Number(data[1].num) + Number(data[2].num)
		            left: dotTxt_x, // '21%',
		            top: dotNum_y,//'43%',
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
		            left:dotTxt_x,// '21%',
		            top: dotTxt_y,// '56%',
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
				show: true   //取消 鼠标滑过的提示框
	
			},
			color: ["#3290ff", "#9d9fa8", "#225da8"],
			legend: {
				orient: 'vertical',
				selectedMode: false, //取消图例的点击事件
				left:position_x,// '45%',
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
							show: false,
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

		   detectionCharts.setOption(option_01,true); // 为echarts对象加载数据
    }

     // left_b = ($(document).width() * 580) / 1672; 
      
     
   
    var left_b = 0;
	/*柱状图1*/
    function ballChart() {
    	
    	var e_b_dashboard = ($(document).width()- 60)/2 ;
        $("#charts_two").css({"width":""+e_b_dashboard+"px"});
        $("#charts_three").css({"width":""+e_b_dashboard+"px"});
        left_b = e_b_dashboard * 0.7;
		
		var option_02 = {
	
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
			legend: {
				data: behaviorName
			},
			/*legend: {
				data: behaviorName
			},
			yAxis: {
				data: behaviorName
			},
			series: [{
				data: behaviorValue
			}],*/
			xAxis: [{
				show: false,
				type: 'value',
				boundaryGap: [0, 0.01]
			}],
			yAxis: [{
				show: true,
				type: 'category',
				data: behaviorName,
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
				data: behaviorValue,
	
				itemStyle: {
	
					normal: {
						label: {
							show: true, //显示文本
							position: [left_b, '0'], //数据值位置
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
    }
    
    
	/*柱状图2*/
    function ballChart_2() {
		
	
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
		/*	yAxis: {
				data: typesName
			},
			series: [{
				data: typesValue
			}]*/
			xAxis: [{
				show: false,
				type: 'value',
				boundaryGap: [0, 0.01]
			}],
			yAxis: [{
				show: true,
				type: 'category',
				data: typesName,
				barWidth: 10, //柱图宽度
	
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
				data: typesValue,
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
    }
	
	
	//用于使chart自适应高度和宽度
	//window.onresize = function() {
		//重置容器高宽
		//resizeWorldMapContainer();
		//myChart.resize();
	//};

