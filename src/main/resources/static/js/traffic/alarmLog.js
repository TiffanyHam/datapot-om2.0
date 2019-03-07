var netflowChart = echarts.init(document.getElementById('netflow'));
var netflow_option = {
	backgroundColor: '#171c2f',
    tooltip: {
        trigger: 'axis'
    },
    grid: {
        left: '1%',
        right: '2%',
        bottom: '4%',
		top: '4%',
        containLabel: true
    },
    xAxis: {
        type : 'category',
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
			show: true,
			lineStyle: {
				color: '#333'
			}
		},
        data: ['周一','周二','周三','周四','周五','周六','周日']
    },
    yAxis: {
		type : 'value',
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
			
		}
    },
    series: [
        {
            name:'上行',
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
            data:[10, 32, 51, 75, 90, 150, 210]
        }
    ]
};
netflowChart.setOption(netflow_option);