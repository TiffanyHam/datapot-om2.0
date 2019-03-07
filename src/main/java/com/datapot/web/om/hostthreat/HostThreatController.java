/**
 * @工程名称：datapot-om
 * @程序包名：com.datapot.web.om.hostthreat
 * @程序类名：HostThreatController.java
 * @创建日期：2017年11月29日
 */
package com.datapot.web.om.hostthreat;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.datapot.contants.enums.DataSource;
import com.datapot.contants.enums.HostStatus;
import com.datapot.contants.enums.HostType;
import com.datapot.contants.enums.Stage;
import com.datapot.contants.result.ResultBean;
import com.datapot.core.om.detectiontype.service.IDetectionTypeService;
import com.datapot.core.om.hosttags.service.IHostTagsService;
import com.datapot.core.om.hostthreat.domain.HostJoinDetectParam;
import com.datapot.core.om.hostthreat.domain.HostJoinDetectReq;
import com.datapot.core.om.hostthreat.domain.HostThreatReq;
import com.datapot.core.om.hostthreat.service.IHostThreatService;
import com.datapot.persist.om.detectionthreat.domain.DetectionThreat;
import com.datapot.persist.om.detectionthreat.domain.DetectionThreatLine;
import com.datapot.persist.om.detectionthreat.domain.HostJoinDetectStage;
import com.datapot.persist.om.detectiontype.domain.DetectionType;
import com.datapot.persist.om.hostthreat.domain.HostThreat;
import com.datapot.persist.om.hostthreat.domain.HostThreatCount;
import com.datapot.persist.om.hostthreat.domain.HostThreatDegree;
import com.datapot.persist.support.Order;
import com.datapot.persist.support.Pager;
import com.datapot.persist.support.Where;
import com.datapot.utils.date.DateUtil;

/**
 * @功能说明：主机威胁信息表
 * @创建人员：wendg
 * @变更记录：<BR>
 * 1、2017年11月29日 wendg 新建类
 */
@Controller
@RequestMapping("/om/host_threat")
public class HostThreatController {

	private Log log = LogFactory.getLog(getClass());

	@Autowired
	private IHostThreatService hostThreatService;

	@Autowired
	private IDetectionTypeService detectionTypeService;

	@Autowired
	private IHostTagsService hostTagsService;

	/**
	 * @函数名称：index
	 * @创建日期：2017年12月4日
	 * @功能说明：跳转至主机主页面
	 * @参数说明：
	 * @返回说明：String
	 */
	@RequestMapping("/index")
	public String index(Model model) {
		return "/host/host_threat";
	}

	/**
	 * @函数名称：getMainHostIp
	 * @创建日期：2017年12月1日
	 * @功能说明：获取主机主页威胁度信用度值图(主机主界面)
	 * @参数说明：
	 * @返回说明：List<HostThreat>
	 */
	@RequestMapping(value = "/get_host_threat")
	public @ResponseBody ResultBean getMainHostIp(HostThreatReq query) {
		Map<String, Object> requestMap = new HashMap<String, Object>();

		if (StringUtils.isNotEmpty(query.getHostIpQ())) {
			requestMap.put("HostName", "%" + query.getHostIpQ().toUpperCase().trim() + "%");
		}

		if (query.getIsKeyQ() == HostType.KEY_ASSET.getId()) {
			requestMap.put("IsKey", HostType.KEY_ASSET.getId());
		}

		if (query.getHostStatusQ() != null) {
			requestMap.put("HostStatus", query.getHostStatusQ());
		}

		if (query.getStageQ() != null) {
			requestMap.put("dt.Stage", query.getStageQ());
		}
		String endDate = DateUtil.getCurrentDateTime();
		String startDate = DateUtil.addDateMinut(endDate, -24);

		requestMap.put("startDate", startDate);
		requestMap.put("endDate", endDate);
		return new ResultBean(hostThreatService.getMainHostTreat(requestMap));
	}

	/**
	 * @函数名称：getDetectionInfos
	 * @创建日期：2017年12月1日
	 * @功能说明：根据主机ip查询相关检测信息
	 * @参数说明：hostIp 主机ip
	 * @返回说明：List<DetectionThreat>
	 */
	@RequestMapping("/get_detection_threat")
	public @ResponseBody List<DetectionThreat> getDetectionInfos(String hostIp) {
		List<DetectionThreat> list = hostThreatService.getDetectionInfoByIp(hostIp);
		return list;
	}

	/**
	 * @函数名称：getInfos
	 * @创建日期：2017年12月1日
	 * @功能说明：分页获取列表信息
	 * @参数说明：query HostThreatReq查询实体对象
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/get_infos")
	public @ResponseBody ResultBean getInfos(HostThreatReq query) {
		Map<String, Object> requestMap = new HashMap<String, Object>();
		List<Order> orders = new ArrayList<>();
		if (StringUtils.isNoneEmpty(query.getSortName())) {
			orders.add(new Order(query.getSortName(), StringUtils.isNoneEmpty(query.getOrder()) ? query.getOrder() : "DESC"));
		}

		if (StringUtils.isNotEmpty(query.getHostIpQ())) {
			requestMap.put("HostName", "%" + query.getHostIpQ().toUpperCase().trim() + "%");
		}

		if (query.getIsKeyQ() != -1) {
			requestMap.put("IsKey", query.getIsKeyQ());
		}

		if (query.getHostStatusQ() != null) {
			requestMap.put("HostStatus", query.getHostStatusQ());
		}

		if (query.getStageQ() != null) {
			requestMap.put("dt.Stage", query.getStageQ());
		}
		String endDate = DateUtil.getCurrentDateTime();
		String startDate = DateUtil.addDateMinut(endDate, -24);

		requestMap.put("endDate", endDate);
		requestMap.put("startDate", startDate);
		Map<String, Object> map = new HashMap<String, Object>();
		Pager<HostThreat> page = null;
		try {
			page = hostThreatService.getInfos(requestMap, orders, query.getPageNum(), query.getNumPerPage());
			map.put("query", query);
			map.put("page", page);
			map.put("hostType", HostType.HOST_TYPE_ASSER);
			map.put("stageInfos", Stage.STAGE_DATA);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.error("HostThreatController getInfos method exception : ", e);
		}
		return new ResultBean(map);
	}

	/**
	 * @函数名称：getInfosByHostIp
	 * @创建日期：2017年12月1日
	 * @功能说明：根据主机ip获取主机检测模式中威胁度、可信度折线图
	 * @参数说明：
	 * @返回说明：List<DetectionThreat>
	 */
	@RequestMapping("/get_host_detect")
	public @ResponseBody ResultBean getInfosByHostIp(String hostIp, Integer time, String typeZh) {
		String endDate = DateUtil.getCurrentDateTime();
		String startDate = null;
		// 判断读取时间（1天、1周、2周、1个月）
		if (time == null || time == 1) { // 判断为1一天
			startDate = DateUtil.addDateMinut(endDate, -23);
			time = 1;
		} else if (time == 2) {// 判断为1周
			startDate = DateUtil.addDate(endDate, -6);
		} else if (time == 3) {// 判断为2周
			startDate = DateUtil.addDate(endDate, -13);
		} else { // 判断为1个月
			Date date = DateUtil.dateAddMonth(new Date(), -1);
			startDate = DateUtil.formatDate(date, DateUtil.LONGDATE_DATE);
		}
		List<DetectionThreatLine> list = null;
		try {
			list = hostThreatService.getInfosByHostIp(hostIp, time, startDate, endDate, typeZh);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			log.error("HostThreatController getInfosByHostIp method exception : ", e);
		}
		return new ResultBean(list);
	}

	/**
	 * @函数名称：getStageByTime
	 * @创建日期：2017年12月6日
	 * @功能说明：根据主机ip获取最近24小时内的行为阶段和攻击类型说明及折线图（弹出框）
	 * @参数说明：hostIp 主机ip 
	 * @返回说明：List<HostJoinDetectStage>
	 */
	@RequestMapping(value = "/get_host_threat_dialog", method = RequestMethod.POST)
	public @ResponseBody ResultBean getStageByHostIp(String hostIp) {
		String endDate = DateUtil.getCurrentDateTime();
		String startDate = DateUtil.addDateMinut(endDate, -24);
		List<HostJoinDetectStage> stageList = hostThreatService.getStageByTime(hostIp, startDate, endDate);
		List<HostThreatDegree> degreeList = hostThreatService.getThreatInfoByIp(hostIp);
		Map<String, Object> map = new HashMap<>();
		map.put("stageList", stageList);
		map.put("degreeList", degreeList);
		map.put("stageMap", Stage.STAGE_DATA);
		return new ResultBean(map);
	}

	/************主机检测模式***************/
	/**
	 * @函数名称：toHostDetectPage
	 * @创建日期：2017年12月7日
	 * @功能说明：主机检测模式基本信息
	 * @参数说明：param 主机请求响应相关参数
	 * @返回说明：String
	 */
	@RequestMapping(value = "/get_detet_infos")
	public String toHostDetectPage(HostJoinDetectParam param, Model model) {
		DetectionThreat detectThreat = hostThreatService.getDetectInfosByIp(param.getHostIp());
		param.setSource(detectThreat.getSource());

//		param.setDetectStatus(DetectionStatus.DETECTION_STATUS_MORE.get(detectThreat.getDetectionStatus()));
//		param.setDetectStatusStr(DetectionStatus.DETECTION_STATUS_MORE.get(param.getDetectStatus()));
		String tags = hostTagsService.getStringByHostIp(param.getHostIp());
		param.setHostStatusStr(HostStatus.HOST_STATUS.get(param.getHostStatus()));
		List<DetectionType> list = detectionTypeService.findAll();
		model.addAttribute("hostJoinDetect", param);
		model.addAttribute("detectionTypes", list);
		model.addAttribute("dataSources", DataSource.DATA_SOURCE);
		model.addAttribute("tags", tags);
		return "/host/host_threat_detail";
	}
	
	@RequestMapping(value = "/get_detet_infos.json")
	@ResponseBody
	public ResultBean toHostDetectPage_json(HostJoinDetectParam param) {
		String tags = hostTagsService.getStringByHostIp(param.getHostIp());
		param.setHostStatusStr(HostStatus.HOST_STATUS.get(param.getHostStatus()));
		List<DetectionType> list = detectionTypeService.findAll();
		Map<String, Object> model = new HashMap<>();
		model.put("hostJoinDetect", param);
		model.put("detectionTypes", list);
		model.put("dataSources", DataSource.DATA_SOURCE);
		model.put("tags", tags);
		return new ResultBean(model);
	}

	/**
	 * @函数名称：getDetectInfosByIp
	 * @创建日期：2017年12月7日
	 * @功能说明：获取主机检测信息数据（折线、图标、列表）
	 * @参数说明：hostJoinDetectReq HostJoinDetectReq请求参数对象
	 * @返回说明：ResultBean
	 */
	@RequestMapping("/get_detect_host_line")
	public @ResponseBody ResultBean getDetectInfosByIp(HostJoinDetectReq hostJoinDetectReq) {
		String endDate = DateUtil.getCurrentDateTime();
		String startDate = null;
		// 判断读取时间（1天、1周、2周、1个月）
		if (hostJoinDetectReq.getQueryTime() == null || hostJoinDetectReq.getQueryTime() == 1) { // 判断为1一天
			startDate = DateUtil.addDateMinut(endDate, -24);
		} else if (hostJoinDetectReq.getQueryTime() == 2) {// 判断为1周
			startDate = DateUtil.addDate(endDate, -7);
		} else if (hostJoinDetectReq.getQueryTime() == 3) {// 判断为2周
			startDate = DateUtil.addDate(endDate, -14);
		} else { // 判断为1个月
			Date date = DateUtil.dateAddMonth(new Date(), -1);
			startDate = DateUtil.formatDate(date, DateUtil.LONGDATE_DATE);
		}

		Map<String, Object> map = new HashMap<>();
		try {
			// 获取检测信息威胁度、信用度、折线图
			List<DetectionThreatLine> detectionThreatlist = hostThreatService.getInfosByHostIp(hostJoinDetectReq.getHostIp(),
					hostJoinDetectReq.getQueryTime(), startDate, endDate, hostJoinDetectReq.getTypeZh());
			// List<Integer> stageList = hostThreatService.getStageByHostIp(hostJoinDetectReq.getHostIp(),
			// startDate, endDate);
			Pager<DetectionThreat> page = getDetectionPager(hostJoinDetectReq);

			map.put("detectionThreatLine", detectionThreatlist);
			// map.put("stageList", stageList);
			map.put("stageMap", Stage.STAGE_DATA);
			map.put("infos", page);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.error("HostThreatController getDetectInfosByIp method exception : ", e);
		}

		return new ResultBean(map);
	}

	/**
	 * @函数名称：getDetectionPager
	 * @创建日期：2017年12月7日
	 * @功能说明：根据条件查询检测信息列表
	 * @参数说明：
	 * @返回说明：Pager<DetectionThreat>
	 */
	public Pager<DetectionThreat> getDetectionPager(HostJoinDetectReq query) {
		List<Where> wheres = new ArrayList<>(); // 查询条件
		List<Order> orders = new ArrayList<>(); // 排序字段
		// 判断排序字段是否为空,如果为空则按降序，否则按传入的字段排序
		if (StringUtils.isNotEmpty(query.getSortName())) {
			orders.add(new Order(query.getSortName(), query.getOrder() == null ? "DESC" : query.getOrder()));
		} else {
			orders.add(new Order("DetectTime", "DESC"));
		}

		if (StringUtils.isNotEmpty(query.getTypeZh())) {
			wheres.add(new Where("TypeZh", "LIKE", "%" + query.getTypeZh() + "%"));
		}
		if (query.getStage() != null) {
			wheres.add(new Where("Stage", query.getStage()));
		}
		String endDate = DateUtil.getCurrentDateTime();
		String startDate = null;
		// 判断读取时间（1天、1周、2周、1个月）
		if (query.getQueryTime() == null || query.getQueryTime() == 1) { // 判断为1一天
			startDate = DateUtil.addDateMinut(endDate, -24);
		} else if (query.getQueryTime() == 2) {// 判断为1周
			startDate = DateUtil.addDate(endDate, -7);
		} else if (query.getQueryTime() == 3) {// 判断为2周
			startDate = DateUtil.addDate(endDate, -14);
		} else { // 判断为1个月
			Date date = DateUtil.dateAddMonth(new Date(), -1);
			startDate = DateUtil.formatDate(date, DateUtil.LONGDATE_DATE);
		}

		wheres.add(new Where("HostIp", query.getHostIp()));
		wheres.add(new Where("DetectTime", ">=", startDate));
		wheres.add(new Where("DetectTime", "<=", endDate));
		Pager<DetectionThreat> page = null;
		try {
			page = hostThreatService.getDetectInfosByHostIp(query, wheres, orders);
		} catch (Exception e) {
			log.error("HostThreatController getDetectInfosByHostIp method exception : ", e);
		}
		return page;
	}

	/**
	 * @函数名称：getDetectInfosByHostIp
	 * @创建日期：2017年12月1日
	 * @功能说明：根据条件分页查询
	 * @参数说明：query DetectionThreatQ查询实体对象
	 * @返回说明：ResultBean
	 */
	@RequestMapping("/get_host_detet_list")
	public @ResponseBody ResultBean getDetectInfosByHostIp(HostJoinDetectReq query) {

		Pager<DetectionThreat> page = this.getDetectionPager(query);
		return new ResultBean(page);
	}

	/********主机关联模式********/

}
