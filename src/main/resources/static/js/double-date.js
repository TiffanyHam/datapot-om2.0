$(function(){
    var dateStr='<div class="date-list"><span class="closeDate">×</span><div style="clear:both;"></div><div class="calendar_header clearfix"><div class="header-left">&lt;</div><div class="common"><select class="year"></select></div><div class="common"><select class="month"><option value="1">1月</option><option value="2">2月</option><option value="3">3月</option><option value="4">4月</option><option value="5">5月</option><option value="6">6月</option><option value="7">7月</option><option value="8">8月</option><option value="9">9月</option><option value="10">10月</option><option value="11">11月</option><option value="12">12月</option></select></div><div class="header-right">&gt;</div></div><table id="tab2"><thead><tr><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th><th>日</th></tr></thead><tbody><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr></tbody></table><div class="date-time"></div></div>'
    $(dateStr).appendTo($(".calendar_date"));
    var $y = $(".year"), $m = $(".month"),
        $year = $y.val(),
        $month = $m.val(),
        current = new Date(),
        current_year = current.getFullYear(),
        current_month = current.getMonth() + 1,
        current_date = current.getDate();
    $m.val(current_month);
    $y.val(current_year);
    for(var i=1917;i<2118;i++){
        var opt = '';
        opt += "<option>" + i + "</option>";
        
        
        $(opt).appendTo($y);

    }
    //添加年
    $y.val(current_year);
    show();
    
    //添加时间
    if ($(".date-check").attr("data") == "time_0" || $(".date-check").attr("data") == "time_1") {
    	
    	 $(".date-check").each(function() { 
    		 var _index = $(this).attr("data").split("_")[1];
    		 var timeStr = getTimeData(_index);
    	     $(".date-list").eq(_index).find(".date-time").append(timeStr);
    	 });
    	
    }
    
    function getTimeData(index){
    	//时
    	var _hstr = "";
    	for(var n = 0; n < 24; n++){
    		var _hour = 0;
    		n < 10 ? _hour = '0'+n : _hour = n;
    		var tempN = "<option>"+_hour+"</option>"
    		_hstr += tempN;
    	}
    	
    	//分、秒
    	/*var _mStr = "";
    	for(var m = 0; m < 60; m++){
    		var _minutes = 0;
    		m < 10 ? _minutes = '0'+m : _minutes = m;
    		var tempM = "<option>"+_minutes+"</option>"
    		_mStr += tempM;
    	}*/
    	
    	var _mStr = "";
    	var _mValue = "00";
    	if (index == "0"){
    		_mStr = "<span class='select_city'>00</span> 分  ";
    	} else {
    		_mStr = "<span class='select_city'>59</span> 分  ";
    		_mValue = "59";
    	}
    	var time = "<div class='timeCon' data='"+_mValue+"'><span class='select_city'><select>"+_hstr+"</select><i class='triangle-down selectedBtn'></i></span> 时  " +_mStr+
    			   /*"<span class='select_city'><select>"+_mStr+"</select></span> 分  " +*/
    			   "<span class=''>00</span> 秒</div>";
    	return time;
    }
    function show() {
        $(".calendar_date").each(function () {
            var $y = $(this).find(".year"), $m = $(this).find(".month");
            var year = $(this).find(".year").val(), month = $(this).find(".month").val();
            var dates = new Date(year, month, 0).getDate();
            //根据年份和月份获取当月第一天的日期
            date = new Date(new Date(year, month - 1, 1));
            //根据年份和月份获取当月第一天是星期几:
            var firstDay = date.getDay();
            if (firstDay == 0) {
                firstDay = 7;
            }
            var num = 1;
            $(this).find("td").each(function () {
                $(this).removeClass("current");
                var $eq = $(this).index() + 1;
                //给td赋值
                if ($eq < firstDay && $(this).parent("tr").index() === 0) {
                    $(this).html("");
                } else {
                    if (num <= dates) {
                        $(this).html(num);
                        num++
                    } else {
                        $(this).html("")
                    }
                }
                //去掉内容为空的tr
                if ($(this).html() == "" && $(this).siblings().html() == "") {
                    $(this).parents("tr").css("display", "none");
                } else {
                    $(this).parents("tr").css("display", "table-row")
                }
                if ($y.val() == current_year && $m.val() == current_month && $(this).html() == current_date) {
                    $(this).addClass("current");
                    $(this).addClass("isTrue");
                } else {
                    $(this).removeClass("current");
                }
            });
            num = 1;
        }); 
    }

    var date = new Date();
    //点击今日跳转到今日列表
    $(".today").on("click", function () {
        $y.val(current_year);
        $m.val(current_month);
        show();
        $(this).parents(".date-list").css("display", "none").siblings(".date-check").val(current_year + "-" + zero(current_month) + "-" + zero(current_date));
    });
    $(".calendar_header select").on("change", function () {
        show();
    });
    var flag = 0;
    $(".date-list").hover(function () {
        flag = 0;
    }, function () {
        flag = 1;
    });
    //input框获得焦点，让日历显示。失去焦点后，让日历隐藏
    $(".date-check").each(function () {
        $(this).on("focus", function () {
            var $outer = $(this).siblings(".date-list"),
                $this_input = $(this);
            $outer.css("display", "block");
            
            $outer.find("td").each(function () {
            	var $this_td = $(this);
            	$this_td.on("click", function () {
            		$(this).parents(".date-list").find("table td").removeClass("isTrue");
            		$(this).addClass("isTrue");
                    var $input_year = $(this).parents(".date-list").find(".year").val(),
                        $input_month = $(this).parents(".date-list").find(".month").val(),
                        $input_val = $(this).html();
                    	date_str = "";
                    	//添加时间
                    	if ($(".date-check").attr("data") == "time_0" || $(".date-check").attr("data") == "time_1") {
                        	//获取选中的时间
                        	$input_time_h = $(this).parents(".date-list").find(".timeCon select").find("option:selected").text(),
                        	$input_time_m = $(this).parents(".date-list").find(".timeCon").attr("data"),
                        	date_str += $input_year + "-" + zero($input_month) + "-" + zero($input_val) + " " +$input_time_h+":"+$input_time_m+":00"; 
                        } else {
                        	 date_str += $input_year + "-" + zero($input_month) + "-" + zero($input_val);
                        }
                        
	                    if ($this_td.html() != "") {
	                        $this_input.val(date_str);
	                        $outer.css("display", "none");
	                    }
                })
            })
            
            if ($(".date-check").attr("data") == "time_0" || $(".date-check").attr("data") == "time_1") {
	            $outer.find(".timeCon select").each(function () {
	            	var $this_option = $(this);
	            	$this_option.on("change", function () {
	            		
	            		 var $input_year = $(this).parents(".date-list").find(".year").val(),
	                     $input_month = $(this).parents(".date-list").find(".month").val(),
	                     $input_val = $(this).parents(".date-list").find(".isTrue").text(),
	                     //获取选中的时间
	                     $input_time_h = $(this).parents(".date-list").find(".timeCon select").find("option:selected").text(),
	                     $input_time_m = $(this).parents(".date-list").find(".timeCon").attr("data"),
	                     dateStr = "";
		                 dateStr += $input_year + "-" + zero($input_month) + "-" + zero($input_val) + " " +$input_time_h+":"+$input_time_m+":00";
		                 $this_input.val(dateStr);
		                 $outer.css("display", "none");
	            	})
	            })
            }
            
        });
        $(this).on("blur", function () {
            if (flag == 1) {
                $(this).siblings(".date-list").css("display", "none");
                flag = 0;
            }
        })
        $(".closeDate").on("click",function(){
        	$(this).parents(".date-list").css("display", "none");
        })
    });
     $("#from").on("click",function(){
    	//alert(1);
     	$("#to").children(".date-list").css("display", "none");
     })
     $("#to").on("click",function(){
     	//alert(2);
     	$("#from").children(".date-list").css("display", "none");
     })
     
     
     
     
    //月份和日期小于10的补0
    function zero(num) {
        return num >= 10 ? num : "0" + num;
    }
    $("#from td,#to td,#from .today,#to .today").on("click",function(){
        var d_year=$(this).parents(".date-list").find(".year").val(),
            d_month=$(this).parents(".date-list").find(".month").val(),
            $td_val;
        if($(this).prop("tagName").toLowerCase()=="td"){
            $td_val =$(this).html();
            if($td_val!=""){
                var str=d_year+"-"+d_month+"-"+$td_val;
                $(this).parents(".date-list").siblings(".date-check").val(str);
            }
        }
        var $from=$("#from .date-check").val(),$to=$("#to .date-check").val();
        var from_seconds=new Date($from.replace("-", "/").replace("-", "/")).getTime(),to_seconds=new Date($to.replace("-", "/").replace("-", "/")).getTime();
        if($from!="" && $to !=""){
            if(from_seconds>to_seconds){
                alert("起始日期不能大于结束日期！");
                $("#from,#to").addClass("date-error");
            }else{
                $("#from,#to").removeClass("date-error");
            }
        }
    });
    $(".header-left").on("click",function(){
        var $year=parseInt($(this).parents(".calendar_header").find(".year").val());
        var $mon=parseInt($(this).parents(".calendar_header").find(".month").val());
        if($mon>=2){
            $mon-=1;
        }else{
            $year-=1;
            $mon=12;
            $(this).parents(".calendar_header").find(".month").val($mon);
            $(this).parents(".calendar_header").find(".year").val($year)
        }
        $(this).parents(".calendar_header").find(".month").val($mon);
        show();
    });
    $(".header-right").on("click",function(){
        var $year=parseInt($(this).parents(".calendar_header").find(".year").val());
        var $mon=parseInt($(this).parents(".calendar_header").find(".month").val());
        if($mon<12){
            $mon+=1;
        }else{
            $year+=1;
            $mon=1;
            $(this).parents(".calendar_header").find(".month").val($mon);
            $(this).parents(".calendar_header").find(".year").val($year)
        }
        $(this).parents(".calendar_header").find(".month").val($mon);
        show();

    });
   /* document.body.onselectstart=document.body.ondrag=function(){
        return false;

    }*/
})