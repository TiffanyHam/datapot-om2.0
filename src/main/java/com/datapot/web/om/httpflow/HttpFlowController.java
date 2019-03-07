/**
 * @工程名称：datapot-om
 * @程序包名：com.datapot.web.om.httpflow
 * @程序类名：HttpFlowController.java
 * @创建日期：2018年4月16日
 */
package com.datapot.web.om.httpflow;

import java.io.IOException;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.datapot.contants.result.ResultBean;
import com.datapot.core.om.httflows.entity.HttpFlowAnalysis;
import com.datapot.core.om.httflows.service.IHttpFlowsService;
import com.datapot.core.om.overview.entity.DataSources;
import com.datapot.es.domain.TimeRangeQ;
import com.datapot.utils.date.DateStartUtil;
import com.datapot.utils.date.DateUtil;
import com.datapot.web.base.BaseController;

/**
 * @功能说明：http流量分析
 * @创建人员：Luxr
 * @变更记录：<BR> 1、2018年4月16日 Luxr 新建类
 */
@Controller
@RequestMapping("/om/httpflow")
public class HttpFlowController extends BaseController {

	@Autowired
	private IHttpFlowsService flowsService;

	/**
	 * @函数名称：index
	 * @创建日期：2018年4月16日
	 * @功能说明：http流量分析
	 * @参数说明：
	 * @返回说明：String
	 */
	@RequestMapping("/index")
	public String index() {
		return "/flow/analyzeFlow";
	}

	/**
	 * 
	 * @函数名称：getFlowTrend
	 * @创建日期：2018年4月16日
	 * @功能说明：http事件总数和流量趋势图数据
	 * @参数说明：
	 * @返回说明：String
	 */
	@RequestMapping("/flow_trend")
	public @ResponseBody ResultBean getFlowTrend() {
		HttpFlowAnalysis analysis = new HttpFlowAnalysis();
		// 时间范围长整型实体
		TimeRangeQ times = new TimeRangeQ();
		times.setEndTime(System.currentTimeMillis());
		times.setBeganTime(DateStartUtil.getCurrentDayStart());
		Map<String, Object> map = flowsService.getEvenCountAndFlowTrend(times);
		// 格式化数字为小数除外的一切数以三位一个间隔，用逗号隔开
		DecimalFormat df = new DecimalFormat("#,###");
		analysis.setEventCount(df.format(map.get("total")));
		// 趋势图
		Map<String, List<Object>> trend = new HashMap<String, List<Object>>();
		// 纵轴（流量数据）
		trend.put("count", (List<Object>) map.get("count"));
		// 横轴(时间)
		trend.put("time", (List<Object>) map.get("time"));
		analysis.setTrafficTrends(trend);
		return new ResultBean(analysis);
	}

	/**
	 * @函数名称：getMehtodAndCode
	 * @创建日期：2018年4月16日
	 * @功能说明：查询http 请求方式与响应分析 Http IP(scrIp) 城市
	 * @参数说明：
	 * @返回说明：String
	 */
	@RequestMapping("/method_code")
	public @ResponseBody ResultBean getMehtodAndCode() {
		HttpFlowAnalysis analysis = new HttpFlowAnalysis();
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
		Map<String, List<DataSources>> topData = flowsService.getMehtodAndCode(times);
		List<DataSources> method = topData.get("method");
		List<DataSources> statusCode = topData.get("statusCode");
		List<DataSources> cityTop = topData.get("cityTop");
		List<DataSources> srcIpTop = topData.get("srcIpTop");
		List<DataSources> dstIpTop = topData.get("dstIpTop");
		analysis.setCityTop(cityTop);
		analysis.setDesIpTop(dstIpTop);
		analysis.setSrcIpTop(srcIpTop);
		analysis.setStatusCode(statusCode);
		analysis.setHttpReqMethod(method);

		return new ResultBean(analysis);
	}

}
