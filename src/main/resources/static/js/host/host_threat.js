 /**折线图**/
    var hostPointerTime = [],
    	hostPointerThreat = [],
    	hostPointerCertainty = [],
    	hostPointPList = '';
    
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
                data : hostPointerTime,//日期
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
                data:hostPointerCertainty,//可信度
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
                data:hostPointerThreat,//威胁度
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

    
    /* 关闭弹窗  */
    $(".coorPointInfo .close_btn").on("click",function(){
    	$(".coorPointInfo .coorPointInfo_con").empty();
    	$(".coorPointInfo").hide();
    })
    
    /* 获取字符串中指定字段  */
    function getStringParam(str, name) {
    	var param = str.split(",");
  		for (var i in param) {
  			var key = param[i].split(":")[0];
  			if (key == name) {
  				var result = param[i].split(":")[1];
  				return result
  			}
  		}
  	}
    
    

  	
  	/* 获取单个点的折线图数据 */
  	function getPointerChart(ip) {
  		$.ajax({
      		url:"/om/host_threat/get_host_threat_dialog",
      		type:'POST',
      		async:true,
      		cache:true,
      		data:{hostIp:ip},
      		success:function(data){
      			console.log(data);
      			if (data.retCode == 1) {
      				
      				if (data.result.degreeList.length > 0){
      					
      					var degreeList = data.result.degreeList;//折线表数据
      					
      					hostPointerCertainty.splice(0,hostPointerCertainty.length);
      					hostPointerThreat.splice(0,hostPointerThreat.length);
      					hostPointerTime.splice(0,hostPointerTime.length);
      					
      					for (var p = 0; p < degreeList.length; p++) {
      						
      						hostPointerCertainty.push(degreeList[p].certainty);//可信度
      						hostPointerThreat.push(degreeList[p].threat);//威胁度
      						hostPointerTime.push(degreeList[p].datectTime);//时间
      						console.log(hostPointerTime);
      						
      					}
      					
          				//chart 绘制
        		        var hostChart = echarts.init(document.getElementById('singleHostChart'));
        		        hostChart.setOption(option);
      				} 
      				
      				//检测结果
      				
      				if (data.result.stageList.length > 0){
      					var stageList = data.result.stageList;
          				var _p = '';
          				if (stageList.length > 0) {
          					var stage = '';
    	      				for (var k = 0; k < stageList.length; k++) {
    	      					data.result.stageMap[stageList[k].stage+''] == undefined ?  stage = '': stage = data.result.stageMap[stageList[k].stage+''];
    	      					_p += '<p><span class="attackType" style="background:'+gradeColorArr[stageList[k].stage]+'">'+stage+'</span> '+stageList[k].typeZh+'</p>';
    	      				}
          				}
          				$("#hostPointPList").append(_p);	
      				}
      				
      				
      				
      			} else {
      				console.log('状态错误'+data.retCode);
      			}
      			
      		},
      		error:function(event, XMLHttpRequest, ajaxOptions, thrownError){
      			console.log(XMLHttpRequest);
      		}
      	})
  	}
  	
  	
  	
  	/* 点击主机点显示弹窗 */
    function hostPointInfo(obj,index) {
    	
    	$(".coorPointInfo").hide();
    	$(".coorPointInfo .coorPointInfo_con").empty(); //删除弹窗原有内容
    	var event = window.event || arguments.callee.caller.arguments[0];
    	//event.stopPropagation();
    	if (event.stopPropagation) {   
    		// 针对 Mozilla 和 Opera   
    		event.stopPropagation();   
        } else if (window.event) {   
        	// 针对 IE   
        	window.event.cancelBubble = true;   
        }  
    	
    	var isPlus = $(obj).attr("data");
    	//判断点击的是否是多个点集成在同一个位置的点 
    	if (isPlus == '1') {
    		//起始点
    		var newPointerLabel = '<div class="hostPoint" style="'+$(obj).parents(".hostPoint").attr("style")+'">'+$(obj).parents(".hostPoint").html()+'</div>';
    		var newPointer_x = $(obj).parents(".hostPoint").attr("x");
    		var newPointer_y = $(obj).parents(".hostPoint").attr("y");
    		
    		//对应点
    		
    		var this_x = getStringParam($(obj).parents(".hostPoint").attr("data"), 'certaintyMax');
    		var this_y = getStringParam($(obj).parents(".hostPoint").attr("data"), 'threatMax');
    		
    		
    		var nPointerList = [];
    		for (var d = 0; d < samePointerArr.length; d++) {
    			/*if (samePointerArr[d].key == index){
    				for (var c in samePointerArr[d].value){
    					var tIndex = samePointerArr[d].value;
    					nPointerList.push(tIndex[c]);
    				}
    				
    			}*/
    			
    				var value = samePointerArr[d].value;
    				for (var c in value){
    					var cx = value[c].newCertaintyMax || value[c].certaintyMax;
    	    			var ty = value[c].newThreatMax || value[c].threatMax;
    					//var tIndex = samePointerArr[d].value;
    					if (this_x == cx && this_y == ty) {
    						nPointerList.push(value[c]);
    					}
    					
    				}
    				
    			}
    		
    		
    		//获取所有对应点的dom结构
    		var pointerStyle = showPointerStyle(nPointerList);
    		var mask = '<div id="mask" style="width:100%;height: 400px;background:rgba(23, 28, 47,0.9);position:absolute;top:0;left:0;">'+newPointerLabel+pointerStyle+'</div>';
    		$(".hostChart").append(mask);
    		
    		 
    		//线
    		var lines = '';
    		newPointer_x = Number(newPointer_x)+10;
    		newPointer_y = Number(newPointer_y)+10;
    		
    		//计算点位置
    		var sizeNum = $("#mask .hostPoint").size();
    		
    		//显示点的方向  从左显示 or 从右显示
    		var objCerThreaNum = threatGradeNumFun(this_y, this_x);
    		var position_x = 0; 
    		if (objCerThreaNum == 2 || objCerThreaNum == 4){
    			//中危 or 严重
    			position_x = 1; //right
    		} else {
    			//低危  or 高危
    			position_x = 0; //left
    		}
    		
    		$("#mask .hostPoint").each(function(index){
    			if (index != 0){
    				if (index > 50){
    					$(this).hide();
    				} else {
    					var _RndNumTop = topRandArray[index];
    					var _RndNumLeft = leftRanArray[index];
    					//_RndNumLeft >= 99 ? _RndNumLeft = 98.5 : _RndNumLeft = _RndNumLeft;
    					//_RndNumTop >= 95 ? _RndNumTop = 95 : _RndNumTop = _RndNumTop;
        				$(this).addClass("anmationPoint");
        				$(this).css({"top":_RndNumTop+"%", "left":_RndNumLeft+"%"});
        				lines += '<line stroke-linecap="null" stroke-linejoin="null" class="anmationLine" id="maskLine_'+index+'" y2="'+(_RndNumTop+1)+'%" x2="'+(_RndNumLeft+1)+'%" y1="'+(newPointer_y)+'px" x1="'+(newPointer_x)+'px" fill-opacity="null" stroke-opacity="null" stroke-width="1" stroke="#55545f" fill="none"></line>';
        				
    				}
    				
    			}
    			
    		})
    		
    		/*if (sizeNum < 50){
	    		$("#mask .hostPoint").each(function(index){
	    			if (index != 0){
	    				var _RndNum = 0;
	    				_RndNum = index*1.5;
	    				$(this).addClass("anmationPoint");
	    				
	    				if (position_x == 0 ){
	    					$(this).css({"top":_RndNum+"%", "left":_RndNum+"%"});
	    					lines += '<line stroke-linecap="null" stroke-linejoin="null" class="anmationLine" id="maskLine_'+index+'" y2="'+(_RndNum+1)+'%" x2="'+(_RndNum+1)+'%" y1="'+(newPointer_y)+'px" x1="'+(newPointer_x)+'px" fill-opacity="null" stroke-opacity="null" stroke-width="1" stroke="#55545f" fill="none"></line>';
	    				} else {
	    					$(this).css({"top":_RndNum+"%", "right":_RndNum+"%"});
	    					var tempRight = 100 - _RndNum;
	    					lines += '<line stroke-linecap="null" stroke-linejoin="null" class="anmationLine" id="maskLine_'+index+'" y2="'+(_RndNum+1)+'%" x2="'+(tempRight-1)+'%" y1="'+(newPointer_y)+'px" x1="'+(newPointer_x)+'px" fill-opacity="null" stroke-opacity="null" stroke-width="1" stroke="#55545f" fill="none"></line>';
	    				}
	    			}
	    			
	    		})

    		} else {
    			
    			var count = 0;  //点计数
    			var lineCount = 0;//线计数
    			var x = 0, y = 0;
    			var conWindth = $("#mask").width();
    			var maxCount = Math.floor(conWindth/20); //向下取整  当前一排可放置最大点数
    			
    			var pointerLine = Math.ceil(sizeNum / maxCount); //向上取整  当前所有点可以放几排
    			var footPointerLine = 0;
    			if (pointerLine > 2){
    				footPointerLine = (pointerLine - 2) * maxCount;  //最后两排画线
    			}
    			
    			
    			
    			for (var i = 1; i < sizeNum; i ++){
    				lineCount ++;
    				
    				if (i == 1){
    					$("#mask .hostPoint").eq(1).css({"top":"0px", "left":"0px"});
    					//lines += '<line stroke-linecap="null" stroke-linejoin="null" id="maskLine_'+index+'" y2="'+10+'px" x2="'+10+'px" y1="'+(newPointer_y)+'px" x1="'+(newPointer_x)+'px" fill-opacity="null" stroke-opacity="null" stroke-width="1" stroke="#55545f" fill="none"></line>'		
    				} else {
	    				count++;
	    				x += 20;
	    				
	    				if (count >= maxCount) {
	    					//换行
	    					x = 0;
	    					y += 20;
	    					count = 0;
	    				}
	    				
	    				//画线
	    				if (lineCount > footPointerLine) {
	    					
	    					lines += '<line stroke-linecap="null" stroke-linejoin="null" id="maskLine_'+index+'" class="anmationLine" y2="'+(y+20)+'px" x2="'+(x+10)+'px" y1="'+(newPointer_y)+'px" x1="'+(newPointer_x)+'px" fill-opacity="null" stroke-opacity="null" stroke-width="1" stroke="#55545f" fill="none"></line>';
	    				}
	    				
	    				
	    				$("#mask .hostPoint").eq(i).css({"top":y+"px", "left":x+"px"});
	    				
    				}
    			}
    		}*/
    		
    		var svg = '<svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">'+lines+'</svg>'
    		
    		$("#mask").append(svg);
    		
    		//关闭
    		$("#mask").click(function(){
    			$(this).remove();
    			$(".coorPointInfo .coorPointInfo_con").empty();
    			$(".coorPointInfo").hide();
    		});
    		
    		
    		
    	} else {
    	
		    	var dataParam = $(obj).parents(".hostPoint").attr("data"); //获取data
		    	var _off = $(obj).parents(".hostPoint").offset();//获取坐标
		    	
		    	
		    	var name = getStringParam(dataParam, "name") || ''; //主机名
		    	var ip = getStringParam(dataParam, "ip") || ''; //主机ip
		    	var isKey = getStringParam(dataParam, "isKey") || 0; //
		    	var threatMax = getStringParam(dataParam, "threatMax") || ''; //威胁值
		    	var certaintyMax = getStringParam(dataParam, "certaintyMax") || ''; //可信值
		    	
		    	//0:全部     1:核心资产       2:非核心资产
		    	var label_property = '';
				if (isKey == 1) {
					label_property = '<i class="ic_property on"></i>';
				} else if (isKey == 2) {
					label_property = '<i class="ic_property"></i>';
				}
		    	
		  		var _div = '<div class="flex_one padd_t">'+
		                       '<div class="f_one h_ie_fl h_ie_wb">'+
		                            '<p class="t-h3">主机名：</p>'+
		                            '<p class="t-h3">'+name+' '+label_property+'</p>'+
		                            '<p>主机IP：'+ip+'</p>'+
		                        '</div>'+
		                        '<div class="f_one h_ie_fl h_ie_wb">'+
		                            '<div class="flex_one">'+
		                                '<div class="f_one text-c h_ie_fl h_ie_wb">威胁度<span class="t_radius">'+threatMax+'</span></div>'+
		                                '<div class="f_one text-c h_ie_fl">可信度 <span class="t_radius">'+certaintyMax+'</span></div>'+
		                            '</div>'+
		                        '</div>'+
		                    '</div>'+
		                    '<p style="clear:both;">最新检测结果：</p><div id="hostPointPList"></div><div id="singleHostChart" style="width:100%;height:100px;margin:10px 0;"></div>'
		                    
		  		
		  		$(".coorPointInfo .coorPointInfo_con").append(_div);
		         
		        //计算弹窗位置
		        var oleft = _off.left;
		        var otop = _off.top;
		        $(document).width() - oleft > 450 ? oleft = oleft - 190 : oleft = oleft - 380 - 350;
		        $(document).height() - otop > 280 ? otop = otop - 130 : otop = otop - 260 - 210;
		         
		        $(".coorPointInfo").css({"top":otop+"px","left":oleft+"px"}).show();
		        
		    	getPointerChart(ip); //获取折线图数据
		    	
		        
    	}
    	
    }
    
    
  
    /* 跳转页面 */
    function hostThreatDetail(obj){
    	
    	var param = obj;
    	$(".content").empty();
	    htmlobj=$.ajax({
	    	url:'/om/host_threat/get_detet_infos',
	    	data:param,
	    	async:false,
	    	success:function(data) {
	    		$(".content").html(data);
	    		document.body.scrollTop = 0;// 回到顶部
	    		navIndex.secendnav = true;
			}
	    });
    }
	
   /* 活动的/非活动的 */
   $(".lable_isActive a").bind("click", function () {
	   
       $(".lable_isActive a").removeClass("on");
       $(this).addClass("on");
       
       hostTblParam.hostStatusReq = $(this).attr("data"),//主机状态
       hostTblParam.numPerPage = 10; //每页显示条目数
	   hostTblParam.pageNum = 1; //当前页目
       isfirstLoad = true;
       hostTbl_init();
       hostChart_init();
   });
   
   /* 核心资产  */
   $(".issLineH .propertybtn").bind("click",function(){
	   
	   if ($(this).find("i").hasClass("on")){
		   $(".ic_property").removeClass("on");
		   hostTblParam.isKeyReq = 2; //非核心资产
	   } else {
		   $(".ic_property").addClass("on");
		   hostTblParam.isKeyReq = 1;  //核心资产
	   }
	   hostTblParam.numPerPage = 10; //每页显示条目数
	   hostTblParam.pageNum = 1; //当前页目
	   isfirstLoad = true;
	   hostTbl_init();
	   hostChart_init();
   })
   
   /* 威胁度 排序 */
   $(".threatBtn").bind("click",function(){
	   
	   if($(this).find("i").hasClass("on")){
		   $(this).find("i").removeClass("on");
		   hostTblParam.sort = 'DESC';
	   } else {
		   $(this).find("i").addClass("on");
		   hostTblParam.sort = 'ASC';
	   }
	   hostTblParam.orderName = 'Threat',
	   hostTblParam.pageNum = 1; //当前页目
	   isfirstLoad = true;
	   hostTbl_init();
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
	   hostTblParam.hostIpReq = $(".searchBox .search_text").val();
	   
	   hostTblParam.numPerPage = 10; //每页显示条目数
	   hostTblParam.pageNum = 1; //当前页目
	   isfirstLoad = true;
	   hostTbl_init();
	   hostChart_init();
   }
   
   /* 所有威胁类型 */
   function getThreatType(obj){
	   hostTblParam.stageId = $(obj).val();
	   
	   hostTblParam.numPerPage = 10; //每页显示条目数
	   hostTblParam.pageNum = 1; //当前页目
	   isfirstLoad = true;
	   hostTbl_init();
	   hostChart_init();
   }

   /*重置 */
   $(".resetBtn").bind("click",function(){
	   //style
	   $(".lable_isActive a").removeClass("on");
	   $(".lable_isActive a").eq(0).addClass("on");
	   $(".ic_property").removeClass("on");
	   $(".threatBtn").find("i").removeClass("on");
	   
	   //param
	   hostTblParam.hostIpReq = '',             //主机IP
	   hostTblParam.hostStatusReq = 0,       //主机状态
	   hostTblParam.isKeyReq = 0,            //主机类型 
	   hostTblParam.orderName = 'Threat',    //排序字段
	   hostTblParam.sort = 'DESC';           //排序（DESC、ASC）
	   hostTblParam.stageId = '';           //所有威胁类型
	   hostTblParam.numPerPage = 10; //每页显示条目数
	   hostTblParam.pageNum = 1; //当前页目
	   
	   isfirstLoad = true;
	   hostTbl_init();
	   hostChart_init();
	   $(".searchBox .search_text").val("");
   })

		
  /* 初始化主机列表（table） */	
   var hostTblParam = new Object();
   hostTblParam.hostIpReq = '',             //主机IP
   hostTblParam.hostStatusReq = 0,       //主机状态
   hostTblParam.isKeyReq = 0,            //主机类型 
   hostTblParam.orderName = 'Threat',    //排序字段
   hostTblParam.sort = 'DESC';           //排序（DESC、ASC）
   hostTblParam.stageId = '';           //所有威胁类型
   hostTblParam.numPerPage = 10; //每页显示条目数
   hostTblParam.pageNum = 1; //当前页目
  
   var isfirstLoad = true;
  function hostTbl_init() {
	  
	  $.ajax({
  		url:'/om/host_threat/get_infos',
  		type:'POST',
  		async:true,
  		cache:true,
  		data:hostTblParam,
  		success:function(data) {
  			//console.log(data);
  			$("#hostTbl tbody").empty();
  			$("#threatTypeId").empty();
  			$("#threatTypeId").append("<option value=''>所有威胁类型</option>");
  			
  			
  			var hostType = data.result.hostType; //  0:全部、     1:核心资产状态     2:非核心
			var page = data.result.page; // 分页信息
			var list = page.results; //获取列表信息
				
			if (list.length > 0) {
				var tr = '';
				for (var i = 0; i < list.length; i++) {
					
					var tags = '';
					list[i].hostTags == null ? '' : tags = list[i].hostTags;
				   	var  gethostIPParam = JSON.stringify(list[i]);
				   	
					//威胁等级颜色
				   	var threatGr = threatGradeFun(list[i].threat, list[i].certainty);
				   	
					//核心资产与非核心资产
					var keyLabel = '';
					if (list[i].isKey == 1) {
						keyLabel = '<span class="roundBg round_m posRe '+threatGr+'"><i class="ic_star"></i></span>'; //核心
					} else if (list[i].isKey == 2) {
						keyLabel = '<span class="roundBg round_m posRe '+threatGr+'"><i class="ic_host"></i></span>';  //非核心
					} else {
						keyLabel = '';
					}
					
					
						
					tr += '<tr>'+
	                               '<td><a class="tab_name" href="javascript:;" onclick=""><i class="ic_label"></i>+'+tags+'</a></td>'+
	                               '<td><span class="tab_name" onclick=hostThreatDetail('+gethostIPParam+')>'+keyLabel+list[i].hostName+'</span></td>'+
	                               '<td>'+list[i].hostIp+'</td>'+
	                               '<td><span class="t_radius">'+list[i].threat+'</span></td>'+
	                               '<td><span class="t_radius">'+list[i].certainty+'</span></td>'+
	                               '<td>'+fmtDate(list[i].detectTime)+'</td>'+
	                           '</tr>';
				}
				$("#hostTbl tbody").append(tr);
				//$(".itemCount").text(data.result.page.totalCount);
				
				//分页
				var totalCount = data.result.page.totalCount; //总条数
				var numPerPage = data.result.page.numPerPage;//每页显示条目数
				var pageSum = data.result.page.pageSum;//总分页数
				var pageNum = data.result.page.pageNum;//当前索引
				
				if (isfirstLoad == true){
					
					/*var page = '<div id="page1" class="f_right"></div>';
					$parent = $("#page1").parent();
					$parent.empty();
					$parent.append(page);
					hostTblParam.pageNum = 1;
					
					var page2 = $("#page1").CustomPage({
						pageSize: numPerPage,
						count: totalCount,
						current: 1,
						updateSelf: true,
						callback: hostPageCallBack
					});
					*/
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
				            	
				            	hostTblParam.pageNum = page; //当前页目
				            	hostTbl_init();
				            }
				    };
					$("#page1 #pageLimit").bootstrapPaginator(page_options);
					$(".countItem").text(totalCount);
						
				}
				
			} else {
				/*$parent = $("#page1").parent();
				$parent.empty();*/
				$("#page1 #pageLimit").empty();
				$(".countItem").text('0');
				isfirstLoad = false;
				$("#hostTbl tbody").append("<tr><td colspan='6' style='text-align:center'>暂无查询结果</td></tr>");
			}
			
			
			//威胁类型
			var select_options = "";
			var stageList = data.result.stageInfos;
			var stageKey = data.result.query.stageId;
			for (var l in stageList){
				if (l == stageKey) {
					select_options += "<option value='"+l+"' selected='selected'>"+stageList[l]+"</option>";
				} else {
					select_options += "<option value='"+l+"'>"+stageList[l]+"</option>";
				}
				
			}
			$("#threatTypeId").append(select_options);
			//$(".records").css("display","none");
			
  		},
  		error:function(e) {
  			console.log('失败');
  		}
  		
	  })
  		
  }
  
 //分页callback
/*  function hostPageCallBack(page){
	  hostTblParam.pageNum = page+1; //当前页目
	  hostTbl_init();
  }

  function getStageKeyName(str, key) {
	for (var l in str){
		if (l == key){
			return str[l];
		}
	}
	
	return "";
  }
  */
  /* 显示点样式 */
  var dotArr = [];//坐标点数组
  function showPointerStyle(list) {
	 
	  var hostPoint = '';
	  
	  for (var i = 0; i < list.length; i++) {
		  
			
			var _x = list[i].certaintyMax;//信任值
			var _y = list[i].threatMax;//威胁值
			dotArr.push([_x,_y]);
			
			//判断是否是多个位置相同的点
			var label_i = '';
			
			
			if (list[i].hasOwnProperty('icon')) {
				label_i = '<i class="plus_i" data="1" onclick="hostPointInfo(this,'+i+')"></i>';
			} else {
				//0:全部     1:核心资产       2:非核心资产
				if (list[i].isKey == 1) {
					label_i = '<i class="star_i" data="0" onclick="hostPointInfo(this,'+i+')"></i>';
				} else if (list[i].isKey == 2) {
					label_i = '<i class="host_i" data="0" onclick="hostPointInfo(this,'+i+')"></i>';
				} else {
					label_i = '';
				}
				
			}
			
			//危急状态
			var threatGr = threatGradeFun(_y, _x); //等级颜色处理
			var label_a = '<a href="javascript:;" class="roundBg round_m posRe '+threatGr+'" >'+label_i+'</a>';
			
			hostPoint += '<div class="hostPoint" data="ip:'+list[i].hostIp+',name:'+list[i].hostName+',certaintyMax:'+_x+',threatMax:'+_y+',isKey:'+list[i].isKey+'">'
						 +label_a+'</div>';
			
		}
	  	
	    
	  
	  return hostPoint;
  }
  
  
  //返回安全等级
  function gradeNum(x, y) {
	  var _x = x, _y = y, result = 0;
	  if (_x < 50 && _y < 50) {
			//低危
		  	result = 1;
		} else if (_x < 50 && _y >= 50) {
			//高危
			result = 3;
		} else if (_x >= 50 && _y < 50) {
			//中级
			result = 2;
		} else if (_x >= 50 && _y >= 50) {
			//严重
			result = 4;
		}
	 return result;
  }
  
  /* 初始化图表  */
  var showPointerArr = [];
  var samePointerArr = [];
  
  function hostChart_init() {
	  $.ajax({
  		url:"/om/host_threat/get_host_threat",
  		type:'POST',
  		async:true,
  		cache:true,
  		data:hostTblParam,
  		success:function(data) {
  			console.log(data);
  			
  			//清空
  			showPointerArr = [];
  			samePointerArr = [];
  			$(".grade_lowNum").text("");
			$(".grade_heightNum").text("");
			$(".grade_middleNum").text("");
			$(".grade_anxiousNum").text("");
			$(".hostChart").find(".hostPoint").remove();
			dotArr.splice(0,dotArr.length);
			
			
			$(".coorPointInfo .coorPointInfo_con").empty();
			$(".coorPointInfo").hide();
			if ($("#mask")) {$("#mask").remove()};
  			
  			
  			var list = data;
  			var hostPoint = '';//坐标点标签
  			
  			if (list.length > 0) {
  				
  				//计算不同状态分别有多少点
  				var grade_lowNum = 0, grade_heightNum = 0, grade_middleNum = 0, grade_anxiousNum = 0;
  				
  				for (var a = 0; a < list.length; a ++) {
  					var _x = list[a].certaintyMax;
  					var _y = list[a].threatMax;
  				
	  				if (_x < 50 && _y < 50) {
						//低危
						grade_lowNum++;
					} else if (_x < 50 && _y >= 50) {
						//高危
						grade_heightNum ++;
					} else if (_x >= 50 && _y < 50) {
						//中级
						grade_middleNum++;
					} else if (_x >= 50 && _y >= 50) {
						//严重
						grade_anxiousNum ++;
					}
	  				
	  		
  				}
  				$(".grade_lowNum").text(grade_lowNum);
  			  	$(".grade_heightNum").text(grade_heightNum);
  			  	$(".grade_middleNum").text(grade_middleNum);
  			  	$(".grade_anxiousNum").text(grade_anxiousNum);
  				
  				
  				
  				/* 相同位置的点处理 */
  			  	/*var _bisTrue = false;
  				for (var b = 0; b < list.length; b ++) {
  					var cx = list[b].certaintyMax;
  					var ty = list[b].threatMax;
  					var bcount = 0;
  					
  					for (var c = list.length - 1; c > b; c --) {
  						var aCer = list[b].certaintyMax;
  						var aThr = list[b].threatMax;
  						var bCer = list[c].certaintyMax;
  						var bThr = list[c].threatMax;
  						
  						var _cx = list[c].certaintyMax;
  	  					var _ty = list[c].threatMax;
  	  					
  						if (_cx == cx && _ty == ty) {
  							// || (bCer >= aCer && bCer <= aCer+3 && aThr == bThr) || ((bCer == aCer && bThr <= aThr+3 && bThr >= aThr))
  							
  							list[c].newCertaintyMax = list[b].certaintyMax;
							list[c].newThreatMax = list[b].threatMax;
								
	  						bcount++;
  							var tempArr = [];
  							
  							//拷贝list[b]的所有属性
  							if (bcount == 0){
  								var listBTemp = {};
  	  							for(var s in list[b]){
  	  								listBTemp[s] = list[b][s];
  	  							}
  	  							tempArr.push(listBTemp);
  							}
  							tempArr.push(list[c]);
  							
  							
  							var tempObj = new Object();
  								tempObj.key = b;
  								tempObj.value = tempArr;
  								
  							samePointerArr.push(tempObj);
  							
  							
  							list.splice(c,1);
  							
  							_bisTrue = true;
  							
  						}
  						
  						
  					}
  					
  					if (_bisTrue == true){
  						_bisTrue = false;
  						list[b].icon = 1;  //添加新属性作为标识：表示当前点的位置是有多个点重合
  					}
  				}*/
  				
  			  /*
	  			 *  处理显示点算法测试
	  			 */
	  			
	  			/*
	  			
	  			var tempArr = [];
	  			var isTrue = false;
	  			var testList = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],[20,10],[22,1],[13,5],[85,4],[50,52],[100,90]];
	  			for (var i in testList) {
	  				var thisDot = testList[i];
	  				var count_i = 0;
	  				for (var j = testList.length - 1; j > i; j --) {
	  					var list = testList[j];
	  					
	  					if ((list[0] >= thisDot[0] && list[0] <= thisDot[0]+10) || (list[0] <= thisDot[0] && list[0] >= thisDot[0]-10) ){
	  						if ( (list[1] >= thisDot[1] && list[1] <= thisDot[1]+10) || (list[1] <= thisDot[1] && list[1] >= thisDot[1]-10) ){
	  							isTrue = true;
  	  							var tempObj = new Object();
  	  								tempObj.key = i;
  	  								tempObj.value = list;
  	  								
  	  								tempArr.push(tempObj);
  	  								testList.splice(j,1);
  	  								count_i ++;
	  						}
	  					} else if ((list[1] >= thisDot[1] && list[1] <= thisDot[1]+10) || (list[1] <= thisDot[1] && list[1] >= thisDot[1]-10) ) {
	  						if ( (list[0] >= thisDot[0] && list[0] <= thisDot[0]+10) || (list[0] <= thisDot[0] && list[0] >= thisDot[0]-10) ){
	  							isTrue = true;
	  							var tempObj = new Object();
	  								tempObj.key = i;
	  								tempObj.value = list;
	  								
	  								tempArr.push(tempObj);
	  								testList.splice(j,1);
	  								count_i ++;
	  						}
	  					}
	  					
	  					
	  				}
	  				
	  				
	  			}
	  			
	  			*/
  				
  				// 显示点处理
  				var _nisTrue = false;
  				for (var n = 0; n < list.length; n ++) {
  					var nx = list[n].certaintyMax;
					var ny = list[n].threatMax;
					var ngrade = gradeNum(nx, ny);  //1:低微      2:中危      3:高危      4:危急
					var ncount = 0;
					
					for (var m = list.length - 1; m > n; m --) {
  						var mx = list[m].certaintyMax;
  						var my = list[m].threatMax; 
  						var mgrade = gradeNum(mx, my);  //1:低微      2:中危      3:高危      4:危急
  						if (ngrade == mgrade) {
  							
  							/*if ((nx == mx && ny == my) || (ny == my && mx <= nx && mx+10 >= nx) || ((nx == mx && my <= ny && my+10 >= ny))){
  								
  								
  							}*/
  							if ((mx >= nx && mx <= nx+10) || (mx <= nx && mx >= nx-10) ){
  		  						if ( (my >= ny && my <= ny+10) || (my <= ny && my >= ny-10) ){
  		  							
  		  								
		  		  						list[m].newCertaintyMax = list[n].certaintyMax;
		  								list[m].newThreatMax = list[n].threatMax;
		  								
		  								
		  								var tempArr = [];
		  	  							
		  	  							//拷贝list[b]的所有属性
		  								if (ncount == 0){
		  									var listBTemp = {};
		  	  	  							for(var s in list[n]){
		  	  	  								listBTemp[s] = list[n][s];
		  	  	  							}
		  	  	  							tempArr.push(listBTemp);
		  								}
		  	  							tempArr.push(list[m]);
		  	  							
		  	  							var tempObj = new Object();
		  	  								tempObj.key = n;
		  	  								tempObj.value = tempArr;
		  	  								
		  	  							samePointerArr.push(tempObj);
		  	  							
		  	  							
		  	  							list.splice(m,1);
		  	  							
		  	  							_nisTrue = true;
		  	  							
		  	  							ncount ++;
  		  						}
  		  					} else if ((my >= ny && my <= ny+10) || (my <= ny && my >= ny-10) ) {
  		  						if ( (mx >= nx && mx <= nx+10) || (mx <= nx && mx >= nx-10) ){
		  		  						list[m].newCertaintyMax = list[n].certaintyMax;
		  								list[m].newThreatMax = list[n].threatMax;
		  								
		  								
		  								var tempArr = [];
		  	  							
		  	  							//拷贝list[b]的所有属性
		  								if (ncount == 0){
		  									var listBTemp = {};
		  	  	  							for(var s in list[n]){
		  	  	  								listBTemp[s] = list[n][s];
		  	  	  							}
		  	  	  							tempArr.push(listBTemp);
		  								}
		  	  							tempArr.push(list[m]);
		  	  							
		  	  							var tempObj = new Object();
		  	  								tempObj.key = n;
		  	  								tempObj.value = tempArr;
		  	  								
		  	  							samePointerArr.push(tempObj);
		  	  							
		  	  							
		  	  							list.splice(m,1);
		  	  							
		  	  							_nisTrue = true;
		  	  							
		  	  							ncount ++;
  		  						}
  		  					}
  							
  							
  							
  							
  						}
  					}
					
					if (_nisTrue == true){
						_nisTrue = false;
  						list[n].icon = 1;  //添加新属性作为标识：表示当前点的位置是有多个点重合
  					}
  				}
  				
  				
  				showPointerArr = list;  //处理后的list赋值给可以显示的数组
  				
  				/* 显示点样式处理 */
  				var hostPoint = '';
  				hostPoint = showPointerStyle(showPointerArr);
	  			$(".hostChart").append(hostPoint);//添加dom
	  			
	  			//计算点的位置
	  			var hostChartWidth = $(".hostChart").width();
	  			var hostChartHeight = $(".hostChart").height();
	  			var dotWidth = hostChartWidth/100;   // 一个点占的宽度
	  			var dotHeight = hostChartHeight/100; // 一个点占的高度
	
	  			$(".hostChart .hostPoint").each(function (index) {

	  			    var x = dotArr[index][0];
	  			    var y = dotArr[index][1];
	  			    
	  				// y坐标值的位置与实际的top值相反
				  	y = 100 - y;
				  	
				  	//边界值处理
				  	x >= 100 ? x = 100 : x = x;
				  	y >= 100 ? y = 100 : y = y;
	  			  
	  			    // x/y 坐标乘以实际上一个点应该所占得宽度/高度
				  	x = x * dotWidth;
				  	y = y * dotHeight;
				  	
				  	// x、y点-10让标签居中
	  			  	x > dotWidth ? x = x - 10 : x = x;
	  			  	y > dotHeight ? y = y - 10 : y = y;
	  			  	
				  	
				  	//显示时的边界值处理
				  	x >= (hostChartWidth - 20) ? x = (hostChartWidth-20) : x = x;
				  	y >= (hostChartHeight - 20) ? y = (hostChartHeight-20) : y = y;
	  			  	
	  			  	
				  	
	  			    $(this).css({"left":x, "top":y});
	  			  	$(this).attr("x",x);
	  			  	$(this).attr("y",y);
	  			})
	  			
	  			
	  			
	  			
	  			
  			}
		},
		error:function(e) {
			console.log('请求失败');
		}
		
	  })
  }
  
 