
var assetsTabTbl = [];
var isfirstload = true;
var pageNumArr = {
		numPerPage: 20,
		pageNum: 1
}

function getTblData(){
	
	$.ajax({
		url:"/om/assets/manage/query",
		type:'POST',
		async:true,
		cache:true,
		data:{
			nameOrIp: '', //名称、IP
			sortName: '',
			order: '',
			numPerPage: pageNumArr.numPerPage,      //查询条数(必传)
			pageNum: pageNumArr.pageNum,      //从第几条开始查(必传)
		},
		success:function(data) {
			
			debugger
			console.log(data);
			$("#assetsTab tbody").empty();
			assetsTabTbl.splice(0, assetsTabTbl.length);
			
			//var result = JSON.parse(data);
			var result = data.result;
			
			if (result != null || result != "" || result != undefined){

				var source = result.results;

				var trs = "";
				for (var i = 0; i < source.length; i ++){
					
					assetsTabTbl.push(source[i]);
					
					trs += '<tr>'+
								'<td>'+
									'<a class="tab_name" id="" href="#">'+source[i].hostName+'</a>'+
								'</td>'+
								'<td>'+source[i].hostIp+'</td>'+
								'<td><span class="attackType" style="background: #e03c4b;">'+source[i].assetsStatus+'</span></td>'+
								'<td>'+source[i].deviceType+'</td>'+
								'<td>'+source[i].hostType+'</td>'+
								'<td>'+source[i].officeId+'</td>'+
								'<td>'+source[i].remarks+'</td>'+
							'</tr>';
				}
				
				
				
				$("#assetsTab tbody").append(trs);
				
				
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
					
					
				} else {
					$("#page1 #pageLimit").empty();
					$("#page1 .countItem").text('0');
					isfirstload = false;
					$("#assetsTab tbody").append("<tr><td colspan='6' style='text-align:center'>暂无查询结果</td></tr>");
				}
				
					 
			}
		},
		error: function(err){
			console.log('error:'+err);
		}
	})
}


function getSearchData() {
	
	
}

//页面初始化
function init() {
	
	//获取列表
	getTblData();
	
	//获取条件选择数据
	getSearchData();
	
}


init();