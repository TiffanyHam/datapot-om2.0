var assetTypeChart = echarts.init(document.getElementById('assetType')); //资产类型
var alarmAssetsChart = echarts.init(document.getElementById('alarmAssets')); //告警资产
var alarmTypeChart = echarts.init(document.getElementById('alarmType')); //告警类型
var alarmNumberChart = echarts.init(document.getElementById('alarmNumber')); //告警数量
var alarmAssetsTopChart = echarts.init(document.getElementById('alarmAssetsTop')); //告警资产TOP10
var alarmTimeChart = echarts.init(document.getElementById('alarmTime')); //告警平均响应时长

var assetType_option = {
	title: {
		text: '资产类型统计',
		textStyle: {
			color: '#fefefc',
			fontSize: '14'
		},
	},
	tooltip: {
		trigger: 'item',
		formatter: "{a} <br/>{b} : {c} ({d}%)"
	},
	legend: {
		orient: 'vertical',
		left: '1%',
		bottom: '1%',
		textStyle: {
			color: '#919294',
			fontSize: '12'
		}
	},
	series: [{
		name: '访问来源',
		type: 'pie',
		radius: '55%',
		center: ['50%', '50%'],
	/*	color: ['#138af0', '#17c7d4', '#f8d56f', '#a76ced'],*/
		color: ['#977cc3', '#f2d903', '#41dbf7', '#eef1f8', '#5392e2'],
		data: [{
				value: 335,
				name: '直接访问'
			},
			{
				value: 310,
				name: '邮件营销'
			},
			{
				value: 234,
				name: '联盟广告'
			},
			{
				value: 135,
				name: '视频广告'
			},
			{
				value: 158,
				name: '搜索引擎'
			}
		],
		itemStyle: {
			emphasis: {
				shadowBlur: 10,
				shadowOffsetX: 0,
				shadowColor: 'rgba(0, 0, 0, 0.5)'
			}
		}
	}]
};

var alarmAssets_option = {
	title: {
		text: '告警资产统计',
		textStyle: {
			color: '#fefefc',
			fontSize: '14'
		},
	},
	/*color: ['#3398DB'],*/
	tooltip: {
		trigger: 'axis',
		axisPointer: { // 坐标轴指示器，坐标轴触发有效
			type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
		}
	},
	grid: {
		left: '3%',
		right: '4%',
		bottom: '3%',
		containLabel: true
	},
	xAxis: [{
		type: 'category',
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
			rotate: 30

		},

		data: ['Linux', 'Windows', '防火墙', '交换机', '路由器', '其他']
	}],
	yAxis: [{
		name: '资产数/个',
		nameGap: '10',
		nameTextStyle: {
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
			}

		}
	}],
	series: [{
			name: '',
			type: 'bar',
			itemStyle: {
				normal: {
					show: true,
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						offset: 0,
						/*color: '#f3a8e0'*/
						color: '#fcffff'
					}, {
						offset: 1,
						/*color: '#a746a3'*/
						color: '#509fda'
					}]),
					barBorderRadius: 50,
					borderWidth: 0,
				},
				emphasis: {
					shadowBlur: 15,
					shadowColor: '#724ca1'
				}
			},
			barWidth: '10',
			data: [30, 40, 30, 60, 20, 10]
		}, {
			name: '',
			type: 'bar',
			itemStyle: {
				normal: {
					show: true,
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						offset: 0,
						/*color: '#01d3d2'*/
						color: '#fcffff'
					}, {
						offset: 1,
						/*color: '#88ecec'*/
						color: '#31d1dd'
					}]),
					barBorderRadius: 50,
					borderWidth: 0,
				},
				emphasis: {
					shadowBlur: 15,
					shadowColor: '#724ca1'
				}
			},
			barWidth: '10',
			data: [10, 30, 50, 40, 60, 10]
		}

	]
};

var alarmType_option = {
	title: {
		text: '告警类型统计',
		textStyle: {
			color: '#fefefc',
			fontSize: '14'
		},
	},
	color: ['#3398DB'],
	tooltip: {
		trigger: 'axis',
		axisPointer: { // 坐标轴指示器，坐标轴触发有效
			type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
		}
	},
	grid: {
		left: '3%',
		right: '4%',
		bottom: '3%',
		containLabel: true
	},
	xAxis: [{
		type: 'category',

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
		data: ['I/O', '当机', 'CPU过载', '内存不足', '其他']
	}],
	yAxis: [{
		name: '资产数/个',
		nameGap: '10',
		nameTextStyle: {
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
			}

		}
	}],
	series: [{
		name: '',
		type: 'bar',
		itemStyle: {
			normal: {
				show: true,
				color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
					offset: 0,
					/*color: '#b5defe'*/
					color: '#fcffff'
				}, {
					offset: 1,
					/*color: '#138af0'*/
					color: '#fee677'
				}]),
				barBorderRadius: 50,
				borderWidth: 0,
			},
			emphasis: {
				shadowBlur: 15,
				shadowColor: '#724ca1'
			}
		},
		barWidth: '10',
		data: [12, 10, 8, 7, 6]
	}]
};
var alarmNumber_option = {

	title: {
		text: '告警数量统计（最近30天）',
		textStyle: {
			color: '#fefefc',
			fontSize: '14'
		},
	},
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
		left: '3%',
		right: '4%',
		bottom: '3%',
		containLabel: true
	},
	xAxis: {
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
			}

		}
	},
	yAxis: {
		name: '告警数/个',
		nameGap: '10',
		nameTextStyle: {
			color: '#919294'
		},
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
		data: ['Linux', 'Windows', '防火墙', '交换机', '路由器', '其他']
	},
	series: [{
		name: '',
		type: 'bar',
		itemStyle: {
			normal: {
				show: true,
				color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
					offset: 0,
					/*color: '#01d3d2'*/
					color: '#67c094'
				}, {
					offset: 1,
					/*color: '#88ecec'*/
					color: '#fcffff'
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
		data: [10, 20, 30, 40, 50, 60]
	}]
};

var alarmAssetsTop_option = {

	title: {
		text: '告警资产 TOP10（最近30天）',
		textStyle: {
			color: '#fefefc',
			fontSize: '14'
		},
	},
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
		left: '3%',
		right: '4%',
		bottom: '3%',
		containLabel: true
	},
	xAxis: {
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
			}

		}
	},
	yAxis: {
		name: '告警数/个',
		nameGap: '10',
		nameTextStyle: {
			color: '#919294'
		},
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
			show: false,
			lineStyle: {
				color: '#333'
			}
		},
		data: ['192.168.0.123', '192.168.0.12', '192.168.0.13', '192.168.0.23', '192.168.0.3', '192.168.0.4', '192.168.0.54', '192.168.0.78', '192.168.0.52', '192.168.0.65']
	},
	series: [{
		name: '',
		type: 'bar',
		itemStyle: {
			normal: {
				show: true,
				color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
					offset: 0,
					/*color: '#138af0'*/
					color: '#53cfd9'
				}, {
					offset: 1,
					/*color: '#b5defe'*/
					color: '#fcffff'
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
		data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
	}]
};

var alarmTime_option = {

	title: {
		text: '告警平均响应时长',
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
		left: '3%',
		right: '4%',
		bottom: '3%',
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
		data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
	},
	yAxis: {
		type: 'value',
		name: '平均响应时长/h',
		nameGap: '10',
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
						/*color: 'rgba(13,177,205,0.8)'*/
						color: '#c8f9fd'
					}, {
						offset: 1,
						/*color: 'rgba(13,177,205,0.2)'*/
						color: '#53cfd9'
					}], false)

				}
			},
			itemStyle: {
				normal: {
					color: '#c8f9fd'
				},
				emphasis: {
					opacity: 1,
					shadowBlur: 15,
					shadowColor: '#114c9a'
				}
			},
			data: [0, 0, 0, 0, 0, 75, 90, 0, 0, 0, 0, 0]
		},
		{
			name: '当机',
			smooth: true,
			symbol: 'circle',
			/*			symbol: 'image://data:image/png;base64,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',
			 */
			symbolSize: 6,
			type: 'line',
			areaStyle: {
				normal: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						offset: 0,
						/*color: '#a746a3'*/
						color: '#c5fce1'
					}, {
						offset: 1,
						/*color: '#f3a8e0'*/
						color: '#67c094'
					}], false)
				}
			},
			itemStyle: {
				normal: {
					color: '#c5fce1'
				},
				emphasis: {
					opacity: 1,
					shadowBlur: 15,
					shadowColor: '#015571'
				}
			},
			data: [0, 0, 0, 0, 0, 20, 40, 0, 0, 0, 0, 0]
		}
	]
};

//资产类型
assetTypeChart.setOption(assetType_option);
//告警资产
alarmAssetsChart.setOption(alarmAssets_option);
//告警类型
alarmTypeChart.setOption(alarmType_option);
//告警数量
alarmNumberChart.setOption(alarmNumber_option);
//告警资产TOP10
alarmAssetsTopChart.setOption(alarmAssetsTop_option);
//告警平均响应时长
alarmTimeChart.setOption(alarmTime_option);