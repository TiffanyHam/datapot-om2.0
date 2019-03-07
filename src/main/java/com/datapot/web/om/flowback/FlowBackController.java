/**
 * @工程名称：datapot-om
 * @程序包名：com.datapot.web.om.flowback
 * @程序类名：HttpFlowController.java
 * @创建日期：2018年4月16日
 */
package com.datapot.web.om.flowback;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.datapot.contants.enums.ProtocolType;
import com.datapot.contants.result.ResultBean;
import com.datapot.core.om.flowback.entity.FlowBack;
import com.datapot.core.om.flowback.entity.FlowBackReq;
import com.datapot.core.om.flowback.service.IBroDetailService;
import com.datapot.es.domain.TimeRangeQ;
import com.datapot.utils.date.DateStartUtil;
import com.datapot.utils.date.DateUtil;
import com.datapot.web.base.BaseController;

/**
 * @功能说明：流量溯源Controller
 * @创建人员：Luxr
 * @变更记录：<BR> 1、2018年4月16日 Luxr 新建类
 */
@Controller
@RequestMapping("/om/flow")
public class FlowBackController extends BaseController {

	@Autowired
	private IBroDetailService detailService;

	/**
	 * @函数名称：index
	 * @创建日期：2018年4月16日
	 * @功能说明：跳转到流量溯源页面
	 * @参数说明：
	 * @返回说明：String
	 */
	@RequestMapping("/flow_back")
	public String index(Model model) {
		Map<String, String> protocolType = ProtocolType.PROTOCOLTYPE;
		model.addAttribute("protocolType", protocolType);
		return "/flow/flowFrom";
	}

	/**
	 * @throws IOException
	 * @throws JsonMappingException
	 * @throws JsonGenerationException
	 * @函数名称：getFlowInfos
	 * @创建日期：2018年4月17日
	 * @功能说明：流量追溯列表
	 * @参数说明：flowBackReq 流量追溯请求对象
	 * @返回说明：String
	 */
	@RequestMapping("/flow_infos")
	public @ResponseBody ResultBean getFlowInfos(FlowBackReq flowBackReq) throws JsonGenerationException,
			JsonMappingException, IOException {
		// 时间范围长整型实体
		TimeRangeQ times = new TimeRangeQ();
		SimpleDateFormat formatter;
		String currentDate = DateUtil.getCurrentDateTime();
		String startDate = flowBackReq.getStartDate();
		String message = "";
		try {
			formatter = new SimpleDateFormat("yyyy-MM-dd");
			if(StringUtils.isBlank(startDate)) {
				startDate = DateUtil.formatDate(DateStartUtil.getCurrentDayStart(), DateUtil.LONGDATE_DATETIME);
			}
			Date start = null;
			try {
				start = formatter.parse(startDate);
			}catch(Exception e) {
				formatter  = new SimpleDateFormat("yyyy-MM-dd");
				start = formatter.parse(startDate);
			}
			Date current = formatter.parse(currentDate);
			// 获取当前日期与开始日期之间的月份差
			int months = (current.getYear() - start.getYear()) * 12 + (current.getMonth() - start.getMonth());
			if (months > 6) {
				message = "查询日期范围在半年之内";
				return new ResultBean(ResultBean.RETCODE_FAIL, message);
			}
			Long endTime = getEndTime(start);
			times.setEndTime(endTime);
			times.setBeganTime(start.getTime());
		} catch (ParseException e) {
			e.printStackTrace();
		}

		FlowBack flowBack = new FlowBack();
		Map<String, Object> map = detailService.getFlowBackList(times, flowBackReq);
		List<Map<String, Object>> list = (List<Map<String, Object>>) map.get("source");
		Integer total = Integer.parseInt(map.get("total").toString());
		flowBack.setSource(list);
		flowBack.setNumPerPage(flowBackReq.getNumPerPage());
		flowBack.setTotalCount(total);
		flowBack.setPageNum(flowBackReq.getPageNum());
		Integer page = total % flowBackReq.getNumPerPage() == 0 ? (total / flowBackReq.getNumPerPage()) : (total
				/ flowBackReq.getNumPerPage() + 1);
		flowBack.setPageSum(page);
		return new ResultBean(flowBack);
	}
	
	
	@SuppressWarnings("deprecation")
	private long getEndTime(Date start) {
		Date now = new Date();
		if(start.getDate() == now.getDate() &&  start.getMonth() == now.getMonth() && start.getYear() == now.getYear()) {
			return now.getTime();
		}
		
		return start.getTime() + 24L * 60 * 60 * 1000 - 1;
	}

	/**
	 * @函数名称：getFlowTrend
	 * @创建日期：2018年4月17日
	 * @功能说明：获取流量溯源趋势图数据
	 * @参数说明：
	 * @返回说明：Map<String,Integer>
	 */
	@RequestMapping("/flow_trend")
	public @ResponseBody ResultBean getFlowTrend(FlowBackReq flowBackReq) {
		FlowBack flowBack = new FlowBack();
		
		Map<String, Object> map = detailService.getFlowTrend(flowBackReq);
		// 趋势图
		Map<String, List<Object>> trend = new HashMap<String, List<Object>>();
		// 纵轴（流量数据）
		trend.put("count", (List<Object>) map.get("count"));
		// 横轴(时间)
		trend.put("time", (List<Object>) map.get("time"));
		flowBack.setFlowTends(trend);
		return new ResultBean(flowBack);

	}

}
