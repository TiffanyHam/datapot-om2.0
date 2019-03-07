/**
 * @工程名称：datapot-om
 * @程序包名：com.datapot.web.om.overview
 * @程序类名：OverViewController.java
 * @创建日期：2017年12月20日
 */
package com.datapot.web.om.overview;

import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.datapot.contants.result.ResultBean;
import com.datapot.core.es.domain.CityDataSource;
import com.datapot.core.es.service.IGeoDistributService;
import com.datapot.core.hdfs.IHdfsBlotService;
import com.datapot.core.om.overview.entity.DataSources;
import com.datapot.core.om.overview.entity.General;
import com.datapot.core.om.overview.service.IOverViewService;
import com.datapot.es.domain.TimeRangeQ;
import com.datapot.utils.date.DateStartUtil;
import com.datapot.utils.date.DateUtil;
import com.datapot.utils.disk.SizeConverter;

/**
 * @功能说明：
 * @创建人员：wendg
 * @变更记录：<BR> 1、2017年12月20日 wendg 新建类
 */
@Controller
@RequestMapping("/om/over_view")
public class OverViewController {

	private Log log = LogFactory.getLog(getClass());
	@Autowired
	private IGeoDistributService geoDistributService;
	@Autowired
	private IHdfsBlotService hdfsService;
	@Autowired
	private IOverViewService overViewService;

	/**
	 * @函数名称：index
	 * @创建日期：2017年12月22日
	 * @功能说明：世界地图访问路径
	 * @参数说明：
	 * @返回说明：String
	 */
	@RequestMapping("/index")
	public String index() {
		return "/panorama/panorama";
	}

	/**
	 * @函数名称：getChinaInfos
	 * @创建日期：2017年12月22日
	 * @功能说明：中国地图访问路径
	 * @参数说明：
	 * @返回说明：String
	 */
	@RequestMapping("/china_map")
	public String getChinaInfos(Model model) {
		return "panorama/cmap";
	}

	/**
	 * @函数名称：getChinaInfos
	 * @创建日期：2017年12月22日
	 * @功能说明：中国地图访问路径
	 * @参数说明：
	 * @返回说明：String
	 */
	@RequestMapping("/china_infos")
	public @ResponseBody ResultBean getChinaInfos() {
		List<CityDataSource> list = geoDistributService.getChinaMapInfos();
		return new ResultBean(list);
	}

	/**
	 * @函数名称：getGenneralIndex
	 * @创建日期：2018年4月16日
	 * @功能说明：跳转到总览页面
	 * @参数说明：
	 * @返回说明：String
	 */
	@RequestMapping("/genneral_index")
	public String getGenneralIndex(Model model) {
		return "/flow/summarize";
	}

	/**
	 * @函数名称：getGeneral
	 * @创建日期：2018年4月14日
	 * @功能说明：获取日志分析数据
	 * @参数说明：
	 * @返回说明：String
	 */
	@RequestMapping("/get_file_info")
	public @ResponseBody ResultBean getGeneral(Model model) {

		// 获取日志文件大小、日志储存天数、剩余储存空间
		Map<String, Double> logData = hdfsService.parseHdfsSpace();
		General general = new General();
		Double logFileSize = logData.get("used");
		Double remainingSpace = logData.get("remainingSpace");
		Double unit = 1024.0;
		String logSize = logFileSize + "G";
		String spase = remainingSpace + "G";
		if (logFileSize > 1024) {
			logSize = SizeConverter.GBTrim.convert(Float.parseFloat(logFileSize.toString()));
		}
		if (remainingSpace > 1024) {
			spase = SizeConverter.GBTrim.convert(Float.parseFloat(remainingSpace.toString()));
		}
		general.setLogFileSize(logSize);// 日志文件大小
		general.setFreeSpace(spase);// 剩余储存空间
		try {
			Long days = hdfsService.parseHdfsMod();
			String date = DateUtil.formatDate(days, DateUtil.LONGDATE_DATETIME);
			Long day = DateUtil.getDiffDate(date, DateUtil.getCurrentDate());
			general.setLogDays(day.intValue());// 日志储存天数
			return new ResultBean(general);
		}catch(Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * @函数名称：getEvenUpdown
	 * @创建日期：2018年4月16日
	 * @功能说明：获取事件总数和上下行数据
	 * @参数说明：
	 * @返回说明：String
	 */
	@RequestMapping("/get_event_updown")
	public @ResponseBody ResultBean getEvenUpdown(Model model) {
		General general = new General();
		// 时间范围长整型实体
		TimeRangeQ times = new TimeRangeQ();
		times.setEndTime(System.currentTimeMillis());
		times.setBeganTime(DateStartUtil.getCurrentDayStart());
		// 获取上下行数据
		Map<String, Object> map = overViewService.getUpAndDown(times);

		// 格式化数字为小数除外的一切数以三位一个间隔，用逗号隔开
		DecimalFormat df = new DecimalFormat("#,###");
		general.setEventCount(df.format(map.get("total")));
		map.remove("total");
		Map<String, List<Object>> upAndDown = new HashMap<String, List<Object>>();
		upAndDown.put("up", (List<Object>) map.get("up"));
		upAndDown.put("down", (List<Object>) map.get("down"));
		upAndDown.put("time", (List<Object>) map.get("time"));

		general.setAndDown(upAndDown);// 上下行

		return new ResultBean(general);
	}

	/**
	 * @函数名称：getTops
	 * @创建日期：2018年4月16日
	 * @功能说明：获取城市、ip top10 以及协议
	 * @参数说明：
	 * @返回说明：String
	 */
	@RequestMapping(value = "/get_tops", method = RequestMethod.POST)
	public @ResponseBody ResultBean getTops(Model model) {
		General general = new General();
		// 时间范围长整型实体
		TimeRangeQ times = new TimeRangeQ();
		String currentDate = DateUtil.getCurrentDate();
		String startDate = currentDate + " 00:00:00";
		String endDate = currentDate + " 23:59:59";
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		try {
			Date start = formatter.parse(startDate);
			Date end = formatter.parse(endDate);
			times.setEndTime(end.getTime());
			times.setBeganTime(start.getTime());
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		// 获取源Ip目标Ip 城市 top10数据
		Map<String, List<DataSources>> topData = overViewService.getIpCityTop(times);
		List<DataSources> srcIpTop = topData.get("srcIpTop");
		List<DataSources> cityTop = topData.get("cityTop");
		List<DataSources> dstIpTop = topData.get("dstIpTop");
		// 给源Ip、目标Ip、城市Top10赋值
		general.setSrcIp(srcIpTop);// 源IpTop10
		general.setCityTop(cityTop);// 城市Top10
		general.setDstIp(dstIpTop);// 目标IpTop10
		// 获取请求协议统计数据
		List<DataSources> protocol = overViewService.getProtocolData(times);
		general.setProtocol(protocol);// 协议
		return new ResultBean(general);
	}
}
