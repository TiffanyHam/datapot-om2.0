var io_monitorChart = echarts.init(document.getElementById('io_monitor')); //IO监控
var load_monitorChart = echarts.init(document.getElementById('load_monitor')); //负载监控
var memory_monitorChart = echarts.init(document.getElementById('memory_monitor'));

var io_monitor_option = {
	backgroundColor:'#171e31',
	title: {
		//text: '最近24h磁盘/IO监控',
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
		data: ['I/O', '当机', 'CPU过载', '内存不足', '其他']
	},
	grid: {
		left: '8%',
		right: '4%',
		bottom: '3%',
		top:'14%',
		containLabel: true
	},
	xAxis: {
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
			},
			rotate: 50

		},
		splitLine: {
			show: false,
			lineStyle: {
				color: '#333'
			}
		},
		data: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']
	},
	yAxis: {
		type: 'value',
		name: '平均响应时长/h',
        nameLocation:'middle',
        nameGap: '35',
		nameTextStyle: {
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
			}

		}
	},
	series: [{
		name: 'I/O',
		type: 'line',
		smooth: true,
		
		symbol: 'circle',
		/*			symbol: 'image://data:image/png;base64,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',
		 */
		symbolSize: 6,
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
				color: 'rgba(13,177,205,0.8)'
			},
			emphasis: {
				opacity: 1,
				shadowBlur: 15,
				shadowColor: '#114c9a'
			}
		},
		data: [0, 0, 0, 0, 0, 75, 90, 0, 0, 0, 0, 0]
	}]
};

var load_monitor_option = {
	backgroundColor:'#171e31',
	title: {
	//	text: '最近24hCPU负载监控',
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
		data: ['I/O', '当机', 'CPU过载', '内存不足', '其他']
	},
	grid: {
		left: '8%',
		right: '4%',
		bottom: '3%',
		top:'14%',
		containLabel: true
	},
	xAxis: {
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
			},
			rotate: 50

		},
		splitLine: {
			show: false,
			lineStyle: {
				color: '#333'
			}
		},
		data: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']

	},
	yAxis: {
		type: 'value',
		name: '平均响应时长/h',
		nameLocation:'middle',
        nameGap: '35',
		nameTextStyle: {
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
			}

		}
	},
	series: [{
		name: '当机',
		smooth: true,
		symbol: 'circle',
		symbolSize: 6,
		type: 'line',
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
			},
			emphasis: {
				opacity: 1,
				shadowBlur: 15,
				shadowColor: '#015571'
			}
		},
		data: [0, 10, 5, 6, 30, 20, 40, 10, 30, 5, 0, 0]
	}]
};

var memory_monitor_option = {
	backgroundColor:'#171e31',
	title: {
		//text: '最近24h内存监控',
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
		data: ['I/O', '当机', 'CPU过载', '内存不足', '其他']
	},
	grid: {
		left: '8%',
		right: '4%',
		bottom: '3%',
		top:'14%',
		containLabel: true
	},
	xAxis: {
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
			},
			rotate: 50

		},
		splitLine: {
			show: false,
			lineStyle: {
				color: '#333'
			}
		},
		data: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']

	},
	yAxis: {
		type: 'value',
		name: '平均响应时长/h',
		nameLocation:'middle',
        nameGap: '35',
		nameTextStyle: {
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
			}

		}
	},
	series: [{
		name: 'I/O',
		type: 'line',
		smooth: true,
		symbol: 'circle',
		/*			symbol: 'image://data:image/png;base64,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',
		 */
		symbolSize: 6,
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
			},
			emphasis: {
				opacity: 1,
				shadowBlur: 15,
				shadowColor: '#114c9a'
			}
		},
		data: [0, 0, 0, 0, 0, 75, 90, 0, 0, 0, 0, 0]
	}]
};

//IO监控
io_monitorChart.setOption(io_monitor_option);
//负载监控
load_monitorChart.setOption(load_monitor_option);
//内存监控
memory_monitorChart.setOption(memory_monitor_option);