 	/* 折现图 */
	var lineColor = ["","#2796b3","", "", "#b68435","", "#b61a32","#6912bc"];
	var sypData = [], throughData = [], controlData = [], attackData = [];
	
	function detectionChart() {

		var detectionChart = echarts.init(document.getElementById('detection'));

		/*var option = {
			//color: ["#2796b3", "#b68435", "#b61a32", "#6912bc"],
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'line',
					label: {
						backgroundColor: '#6a7985'
					}
				}
			},
			toolbox: {
				show: false
			},
			 calculable : true,
			grid: {
				left: '2%',
				right: '2%',
				bottom: '10px',
				top: '10px',
				containLabel: true
			},
			xAxis: [{
				type: 'category',
				boundaryGap: false,
				data: timeArr, // ['11/05 14:55','11/05 14:55','11/05
								// 14:55','11/05 14:55','11/05 14:55','11/05
								// 14:55','11/05 14:55']
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
					show: true,
					lineStyle: {
		                color: '#333'
		            }
				}
			}],
			yAxis: [{
				show: true,
				axisTick: {
					show: true
				},
				name: '检测数量',
				nameLocation: 'middle',
				nameTextStyle: {
					color: '#919294'
				},
				nameGap: 15,
				type: 'value',
				splitLine: {
					show: false
				},
				axisLabel: {
					formatter: function(value) {
						return ''
					}
				}
			}],
			series:[
			        {
					name: "侦查",
					type: 'line',
					stack: '总量',
					smooth: true,
					symbol: 'circle',
			        symbolSize: 3,
			        showSymbol: false,
					itemStyle: {
						normal: {
							lineStyle: {width: 1},
							color: "#2796b3"
						}
					},
					data: sypData
				},
				{
					name: "突破",
					type: 'line',
					stack: '总量',
					smooth: true,
					symbol: 'circle',
			        symbolSize: 3,
			        showSymbol: false,
					itemStyle: {
						normal: {
							lineStyle: {width: 1},
							color: "#b68435"
						}
					},
					data: throughData
				},
				{
					name: "控制",
					type: 'line',
					stack: '总量',
					smooth: true,
					symbol: 'circle',
			        symbolSize: 3,
			        showSymbol: false,
					itemStyle: {
						normal: {
							lineStyle: {width: 1},
							color: "#b61a32"
						}
					},
					data: controlData
				},
				{
					name: "攻击",
					type: 'line',
					stack: '总量',
					smooth: true,
					symbol: 'circle',
			        symbolSize: 3,
			        showSymbol: false,
					itemStyle: {
						normal: {
							lineStyle: {width: 1},
							color: "#6912bc"
						}
					},
					data: attackData
				}
			]
		};*/
		
		var option = {
			    tooltip: {
			        trigger: 'axis',
			        axisPointer: {
			        	type: 'line',
			        	label: {
							backgroundColor: '#6a7985'
						}
			        }
			    },
			    
			    grid: {
			    	left: '2%',
					right: '2.1%',
					bottom: '10px',
					top: '10px',
			        containLabel: true
			    },
			    xAxis: [{
			        type: 'category',
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
						show: true,
						lineStyle: {
			                color: '#333'
			            }
					},
			        data: timeArr
			    }],
			    yAxis: [{
			        type: 'value',
			        axisTick: {
			            show: false
			        },
			        name: '检测数量',
					nameLocation: 'middle',
					nameTextStyle: {
						color: '#919294'
					},
					nameGap: 15,
					type: 'value',
					splitLine: {
						show: false
					},
					axisLabel: {
						formatter: function(value) {
							return ''
						}
					}
			    }],
			    series: [
			    {
			        name: '侦查',
			        type: 'line',
			        smooth: true,
			        symbol: 'circle',
			        symbolSize: 1,
			        showSymbol: false,
			        lineStyle: {
			            normal: {
			                width: 1
			            }
			        },
			        itemStyle: {
			            normal: {
			                color: '#2796b3',
			                borderColor: '#2796b3',
			                borderWidth: 12

			            }
			        },
			        data: sypData
			    }, {
			        name: '突破',
			        type: 'line',
			        smooth: true,
			        symbol: 'circle',
			        symbolSize: 1,
			        showSymbol: false,
			        lineStyle: {
			            normal: {
			                width: 1
			            }
			        },
			        itemStyle: {
			            normal: {
			                color: '#b68435',
			                borderColor: '#b68435',
			                borderWidth: 12

			            }
			        },
			        data: throughData
			    }, {
			        name: '控制',
			        type: 'line',
			        smooth: true,
			        symbol: 'circle',
			        symbolSize: 1,
			        showSymbol: false,
			        lineStyle: {
			            normal: {
			                width: 1
			            }
			        },
			        itemStyle: {
			            normal: {

			                color: '#b61a32',
			                borderColor: '#b61a32',
			                borderWidth: 12
			            }
			        },
			        data: controlData
			    },
			    {
			        name: '攻击',
			        type: 'line',
			        smooth: true,
			        symbol: 'circle',
			        symbolSize: 1,
			        showSymbol: false,
			        lineStyle: {
			            normal: {
			                width: 1
			            }
			        },
			        itemStyle: {
			            normal: {
			                color: '#6912bc',
			                borderColor: '#6912bc',
			                borderWidth: 12
			            }
			        },
			        data: attackData
			    }]
			};

		detectionChart.setOption(option);
	}
	/*攻击行为阶段 */
	function getStagesName() {
		$(".attack_type").empty();
		for(var o in stageName){
			delete stageName[o];
		}
		
		$.ajax({
			url: "/om/detection_threat/get_stages",
			type: 'POST',
			async: false,
			cache: true,
			data: {},
			success: function(data) {
				
				// 攻击行为阶段
				stageName = data.result.stages;
				var _span = '';
				for(var k in stageName) {
					var name = stageName[k];
					var color = gradeColorArr[k];
					_span += '<a href="javascript:;" class="attackType" data="' + k + '" style="background:' + color + '" onclick="attactEvent(this,' + k + ')" >' + name + '</a>';

				}
				$(".attack_type").append(_span);
			}
		})
	}
	
	getStagesName();

	/* 初始化检测列表 */
	var isfirstload = true;
	var detectionTblParam = new Object();
     	detectionTblParam.stageQ = "", // 威胁阶段
		detectionTblParam.dealStatusQ = 0, // 检测处理状态
		detectionTblParam.isKeyQ = '', // 是否核心资产
		detectionTblParam.hostNameQ = '', // 主机名
		detectionTblParam.typeZhQ = ' ', // 查询条件
		detectionTblParam.sortName = 'Threat',     // 排序字段
		detectionTblParam.order = 'DESC',           // 排序（DESC、ASC）
		detectionTblParam.time = '2'; // 查询时间范围
     	detectionTblParam.numPerPage = 10; //每页显示条目数
     	detectionTblParam.pageNum = 1; //当前页目
     	
    function detectionTbl_init() {
     	
		// 请求检测表数据
		$.ajax({
			url: "/om/detection_threat/query",
			type: 'POST',
			async: true,
			cache: true,
			data: detectionTblParam,
			success: function(data) {
				
				$("#detectionTal tbody").empty(); // 清空table
				
				if(data.retCode == 1) {
					//console.log(data);
					var list = data.result.info.results;  // 获取列表信息
					var tr = '';
					
					if (list.length > 0){
						
						for(var i = 0; i < list.length; i++) {
	
							//var sName = getOptionName(stageName, list[i].stage);
							var sName = "";
							var item = data.result.stages;
							for (var o in item){
								if (o == list[i].stage) {
									sName = item[o];
								}
							}
							var sColor = gradeColorArr[list[i].stage];
							
							var deteCParam = JSON.stringify(list[i]);  // 从一个对象解析出字符串
							
							tr += '<tr>' +
								'<td><a class="tab_name" href="javascript:;" onclick=""><i class="ic_label"></i>+' + list[i].detectionTags + '</a></td>' +
								'<td><span class="attackType" style="background:' + sColor + '">' + sName + '</span></td>' +
								'<td><span class="tab_name"  onclick=detecThreatDetail('+deteCParam+')>' + list[i].typeZh + '</span></td>' +
								'<td>' + list[i].hostName + '</td>' +
								'<td><span class="t_radius">' + list[i].threat + '</span></td>' +
								'<td><span class="t_radius">' + list[i].certainty + '</span></td>' +
								'<td>' + fmtDate(list[i].detectTime) + '</td>' +
								'</tr>';
						}
	
						$("#detectionTal tbody").append(tr);
						
						//$(".itemCount").text(data.result.info.totalCount);
	
						
						//分页
						var totalCount = data.result.info.totalCount; //总条数
						var numPerPage = data.result.info.numPerPage;//每页显示条目数
						var pageSum = data.result.info.pageSum;//总分页数
						var pageNum = data.result.info.pageNum;//当前索引
						
						
							if (isfirstload == true){
								
								/*var page = '<div id="page1" class="f_right"></div>';
								$parent = $("#page1").parent();
								$parent.empty();
								$parent.append(page);
								detectionTblParam.pageNum = 1;
								
								var page = $("#page1").CustomPage({
									pageSize: numPerPage,
									count: totalCount,
									current: 1,
									updateSelf: true,
									callback: pageCallBlack
								});*/
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
							            	
							            	detectionTblParam.pageNum = page; //当前页目
							            	detectionTbl_init();
							            }
							    };
								$("#page1 #pageLimit").bootstrapPaginator(page_options);
								$("#page1 .countItem").text(totalCount);
							 }
						
					} else {
						$("#page1 #pageLimit").empty();
						$("#page1 .countItem").text('0');
						isfirstload = false;
						$("#detectionTal tbody").append("<tr><td colspan='7' style='text-align:center'>暂无查询结果</td></tr>");
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


	var timeArr = [], // x轴坐标数组
		seriesOptions = [], // 配置检测数量参数
		stageName = {}; // 折线对应的名称
 	
	/* 初始化折线图 */
	function detectionChart_init() {
		
		// 清空全局对象
		seriesOptions.splice(0,seriesOptions.length);
		timeArr.splice(0,timeArr.length);
		
		
		//$("#detection").empty();
		sypData.splice(0, sypData.length);
		throughData.splice(0, throughData.length);
		controlData.splice(0, controlData.length);
		attackData.splice(0, attackData.length);
		

		// 请求检测表数据
		$.ajax({
			url: "/om/detection_threat/get_detections",
			type: 'POST',
			async: false,
			cache: true,
			data: detectionTblParam,
			success: function(data) {
				
				console.log(data);
				
				var result = {};
				for(var x in data.result.info){
					var map = data.result.info[x];
					for(var m in map){
						if(result[m]){
							var list = result[m];
							list.push(map[m].num);
						} else {
							var list = [];
							list.push(map[m].num);
							result[m] = list;
							
						}
					}
					// 获取时间数组
					for(var m in map){
						timeArr.push(map[m].time);
						break;
					}
				}
				
				// var len = Object.keys(result).length;
				// console.log(result);
				
				
				// 配置参数
				
				for (var j in result) {
					
					if (j == '1'){
						sypData = result[j];
					} else if (j == '4'){
						throughData = result[j];
					} else if (j == '6'){
						controlData = result[j];
					}  else if (j == '7'){
						attackData = result[j];
					}
						
					/*var oName = getOptionName(stageName, j);
					var _color = lineColor[j];
					
					var option = {
						name: oName,
						type: 'line',
						stack: '总量',
						symbol: 'none',
						symbol: 'circle',
				        symbolSize: 3,
				        showSymbol: false,
						itemStyle: {
							normal: {
								lineStyle: {width: 1},
								color: _color
							}
						},
						data: result[j]
					}

					seriesOptions.push(option);*/
				} 
				
				// 画图
				detectionChart();

				


			},
			error: function(e) {
				console.log('请求失败');
			}
		});

	}
	
	
	/* 点击威胁类型跳转页面 */
    function detecThreatDetail(obj){
		
    	var param = obj;
		
		param.firstDetectTime== null ? param.firstDetectTime = fmtDate(param.detectTime) : param.firstDetectTime = fmtDate(param.firstDetectTime); //时间戳转时间
		param.detectTime == null? param.detectTime = null : param.detectTime = fmtDate(param.detectTime);
	
		
    	$(".content").empty();
	    var htmlobj=$.ajax({
	    	url:'/om/detection_threat/detection_page',
	    	type:"POST",
	    	data:param,
	    	async:false,
	    	success:function(data) {
	    		$(".content").html(data);
	    		$(".content").attr("data",param.detectId);
	    		document.body.scrollTop = 0;// 回到顶部
	    		navIndex.secendnav = true;
			}
	    });
    }

	/* 攻击行为阶段切换 */
	function attactEvent(obj,k) {
		
		
		if (detectionTblParam.stageQ == ""){
			detectionTblParam.stageQ = ""+k;
		} else {
			//判断是否包含两个以上
			var detectionSQ = detectionTblParam.stageQ;
			if(detectionSQ.indexOf(",") > 0){
				var tempArr = detectionSQ.split(",");
				var hasK = false;
				for (var i in tempArr){
					if (tempArr[i] == k){
						tempArr.splice(i,1);
						hasK = true;
					}
				}
				
				if (hasK == false){
					detectionTblParam.stageQ += ","+k;
				} else {
					detectionTblParam.stageQ = tempArr.join(",");
				}
				
			} else {
				if(detectionTblParam.stageQ == k){
					detectionTblParam.stageQ = "";
				} else {
					detectionTblParam.stageQ += ","+k;
				}
				
			}
			
		}
		// 按钮颜色变化
		if($(obj).hasClass("cls")){
		     $(obj).removeClass("cls");
		   }else{
		     $(obj).addClass("cls");
		    }   
        
		detectionTblParam.numPerPage = 10; //每页显示条目数
     	detectionTblParam.pageNum = 1; //当前页目
		isfirstload = true;
		detectionTbl_init();
		detectionChart_init();
	}

	/* 状态切换 */
	$(".lable_isActive a").bind("click", function() {
		console.log("列表状态切换 ");
		$(".lable_isActive a").removeClass("on");
		$(this).addClass("on");

		if($(this).attr("data") == '0') {
			detectionTblParam.dealStatusQ = 0;
		} else if($(this).attr("data") == '1') {
			detectionTblParam.dealStatusQ = 1;
		} else {
			detectionTblParam.dealStatusQ = 2;
		}
		
		detectionTblParam.numPerPage = 10; //每页显示条目数
     	detectionTblParam.pageNum = 1; //当前页目
		isfirstload = true;
		detectionTbl_init();
		detectionChart_init();
	})

	/* 核心资产 */
	$(".issLineH .detecPos").bind("click", function() {
		console.log("核心资产 ");
		
		if($(this).find("i").hasClass("on")) {
			$(".ic_property").removeClass("on");
			detectionTblParam.isKeyQ = ''; // 非核心资产
		} else {
			$(".ic_property").addClass("on");
			detectionTblParam.isKeyQ = 1; // 核心资产
		}
		
		detectionTblParam.numPerPage = 10; //每页显示条目数
     	detectionTblParam.pageNum = 1; //当前页目
		isfirstload = true;
		detectionTbl_init();
		detectionChart_init();
	})
	
	/* 检测类型条件查询 */
     $("#detectionType").change(function () {  
    	detectionTblParam.typeZhQ = $(this).val();
    	
    	detectionTblParam.numPerPage = 10; //每页显示条目数
     	detectionTblParam.pageNum = 1; //当前页目
    	isfirstload = true;
    	detectionTbl_init();
    	detectionChart_init();
    })
	
	
	 /* 威胁度查询 */
    
	 $(".threatBtn").bind("click",function(){
	   
	   if($(this).find("i").hasClass("on")){
		   $(this).find("i").removeClass("on");
		   detectionTblParam.order = 'DESC';
	   } else {
		   $(this).find("i").addClass("on");
		   detectionTblParam.order = 'ASC';
	   }
	   
	   	detectionTblParam.sortName = 'Threat';
	   	isfirstload = true;
	   	detectionTblParam.pageNum = 1; //当前页目
		detectionTbl_init();
		   
	 })
	 
   /* 主机ip搜索 */
   $(".searchBox .search_text").bind('keydown',function(event){
	    if(event.keyCode == "13") {
	    	allThreatType()
	    }
	});
   $(".searchBox .search_btn").bind("click",function() {
	   allThreatType()
   })
   function allThreatType() {
	   detectionTblParam.hostNameQ = $(".searchBox .search_text").val();
	   
	   detectionTblParam.numPerPage = 10; //每页显示条目数
    	detectionTblParam.pageNum = 1; //当前页目
	   isfirstload = true;
	   detectionTbl_init();
	   detectionChart_init();
   }

	/* 重置 */
	$(".resetBtn").bind("click", function() {
		console.log("重置 ");
		// style
		$(".lable_isActive a").removeClass("on");
		$(".lable_isActive a").eq(0).addClass("on");
		$(".ic_property").removeClass("on"); // 核心资产
		$(".threatBtn").find("i").removeClass("on"); // 威胁度
		$(".attack_type a").removeClass("cls");// 威胁阶段

		// param
		detectionTblParam.stageQ = "", // 威胁阶段
		detectionTblParam.dealStatusQ = 0, // 检测处理状态
		detectionTblParam.isKeyQ = '', // 是否核心资产
		detectionTblParam.hostNameQ = '', // 主机名
		detectionTblParam.typeZhQ = ' ', // 查询条件
		detectionTblParam.sortName = 'Threat',     // 排序字段
		detectionTblParam.order = 'DESC',           // 排序（DESC、ASC）
		detectionTblParam.time = '2'; // 查询时间范围
     	detectionTblParam.numPerPage = 10; //每页显示条目数
     	detectionTblParam.pageNum = 1; //当前页目
     	
     	
		isfirstload = true;
		detectionTbl_init();
		detectionChart_init();
		$("#detectionType").find("option").eq(0).prop("selected", 'selected');
		$(".searchBox .search_text").val("");
	})
	
	
	/* 检测折线图日期切换 */
	$(".hd_chart_date ul li a").bind("click",function(){
		
		$(".hd_chart_date ul li a").removeClass("on");
		$(this).addClass("on");
		
		var tiem = $(this).attr("data");
		detectionTblParam.time = tiem;
		detectionChart_init(); // 重绘折线图
		
		detectionTblParam.numPerPage = 10; //每页显示条目数
     	detectionTblParam.pageNum = 1; //当前页目
		isfirstload = true;
		detectionTbl_init();// 更新列表
		
	})
	
	
	