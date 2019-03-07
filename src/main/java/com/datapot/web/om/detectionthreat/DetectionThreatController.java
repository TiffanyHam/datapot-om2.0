/**
 * @工程名称：datapot-om
 * @程序包名：com.datapot.web.om.detectionthreat
 * @程序类名：DetectionThreatController.java
 * @创建日期：2017年11月29日
 */
package com.datapot.web.om.detectionthreat;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.datapot.contants.enums.DealStatus;
import com.datapot.contants.enums.HostStatus;
import com.datapot.contants.enums.Source;
import com.datapot.contants.enums.Stage;
import com.datapot.contants.result.ResultBean;
import com.datapot.core.om.Reports.domain.ReportsReq;
import com.datapot.core.om.detectionthreat.domain.DetectionThreatReq;
import com.datapot.core.om.detectionthreat.service.IDetectionThreatService;
import com.datapot.core.om.detectiontype.service.IDetectionTypeService;
import com.datapot.core.om.hosttags.service.IHostTagsService;
import com.datapot.core.om.hostthreat.service.IHostThreatService;
import com.datapot.persist.om.detectionthreat.domain.DetectionStageCount;
import com.datapot.persist.om.detectionthreat.domain.DetectionThreadCount;
import com.datapot.persist.om.detectionthreat.domain.DetectionThreat;
import com.datapot.persist.om.detectionthreat.domain.DetectionThreatLine;
import com.datapot.persist.om.detectiontype.domain.DetectionType;
import com.datapot.persist.om.hostthreat.domain.HostThreat;
import com.datapot.persist.res.DashboardRes;
import com.datapot.persist.support.Order;
import com.datapot.persist.support.Pager;
import com.datapot.utils.date.DateUtil;
import com.datapot.web.base.BaseController;

/**
 * @功能说明：检测信息控制类
 * @创建人员：Luxr
 * @变更记录：<BR> 1、2017年11月29日 Luxr 新建类
 */
@RequestMapping("/om/detection_threat")
@Controller
public class DetectionThreatController extends BaseController {
	private Log log = LogFactory.getLog(getClass());

	@Autowired
	private IDetectionThreatService threatService;

	@Autowired
	private IHostThreatService hostService;

	@Autowired
	private IDetectionTypeService typeService;

	@Autowired
	private IHostTagsService hostTagsService;

	/**
	 * 
	 * @函数名称：index
	 * @创建日期：2017年4月10日
	 * @功能说明：用户账户管理加载页面
	 * @参数说明：query 查询条件
	 * @返回说明：String
	 */
	@RequestMapping(value = "/index")
	public String index(Model model) {
		List<DetectionType> typeZh = typeService.findAll();
		Map<String, String> types = new HashMap<String, String>();
		if (null != typeZh) {
			for (DetectionType detectionType : typeZh) {
				types.put(detectionType.getTypeZh(), detectionType.getTypeZh());
			}
			model.addAttribute("detectionType", types);
		}
		return "check/detection";
	}

	/**
	 * @函数名称：getStage
	 * @创建日期：2018年2月4日
	 * @功能说明：传递攻击行为阶段查询条件
	 * @参数说明：
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/get_stages")
	public @ResponseBody ResultBean getStages(Model model) {
		model.addAttribute("stages", Stage.STAGE_DATA);
		return new ResultBean(model);
	}

	/**
	 * @函数名称：query
	 * @创建日期：2017年11月22日
	 * @功能说明：折线图
	 * @参数说明：time
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/get_detections")
	public @ResponseBody ResultBean getDetections(DetectionThreatReq querys, Integer time) {
		// 给time设置默认值
		if (null == time || time == 0) {
			time = 4;
		}
		Map<String, Object> map = new HashMap<String, Object>();
		if (StringUtils.isNotEmpty(querys.getHostIpQ())) {
			map.put("HostIp", querys.getHostIpQ().toUpperCase());
		}

		map.put("hostStatus", querys.getHostStatusQ());

		if (querys.getIsKeyQ() != null) {
			map.put("IsKey", querys.getIsKeyQ());
		}

		if (querys.getStageQ() != null) {
			map.put("Stage", querys.getStageQ());
		}

//		if (StringUtils.isNotEmpty(querys.getTypeZhQ())) {
//			map.put("TypeZh", querys.getTypeZhQ());
//		}
		List<Map<Integer, DetectionThreadCount>> list = threatService.getDetectionNumber(map, time);
		Map<String, Object> maps = new HashMap<String, Object>();
		maps.put("info", list);
		return new ResultBean(maps);
	}
	
	
	@ResponseBody
	@RequestMapping(value = "hosttags")
	public ResultBean detection(String hostip) {
		String tags = hostTagsService.getStringByHostIp(hostip);
		return new ResultBean(tags);
	}
	
	@ResponseBody
	@RequestMapping(value = "constant")
	public ResultBean constant() {
		Map<String, Object> model = new HashMap<String, Object>();
		model.put("stage", Stage.STAGE_DATA);
		model.put("source", Source.SOURCE);
		model.put("hostStatus", HostStatus.HOST_STATUS);
		model.put("dealStatus", DealStatus.DETECTION_STATUS);
		return new ResultBean(model);
	}

	/**
	 * @函数名称：query
	 * @创建日期：2017年11月22日
	 * @功能说明：供分页查询调用
	 * @参数说明：querys 检测信息查询实体
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/query")
	public @ResponseBody ResultBean query(DetectionThreatReq querys, Integer time) {
		/**
		 * @TODO 查询列表传入的阶段行为有误，需修改
		 */
		// 给time设置默认值
		if (null == time || time == 0) {
			time = 4;
		}
		String sortName = querys.getSortName();
		List<Order> orders = new ArrayList<Order>();
		if (StringUtils.isEmpty(sortName)) {
			orders.add(new Order("DetectTime", "DESC"));
		} else {
			String order = querys.getOrder().toUpperCase();
			String newStr = sortName.substring(0, 1).toUpperCase() + sortName.substring(1);
			orders.add(new Order(newStr, order));
			orders.add(new Order("DetectTime", "DESC"));
		}
		Map<String, Object> map = new HashMap<String, Object>();
		if (StringUtils.isNotEmpty(querys.getHostIpQ())) {
			map.put("HostIp", querys.getHostIpQ());
		}

		if (querys.getIsKeyQ() != null) {
			map.put("IsKey", querys.getIsKeyQ());
		}
		
//		if (!StringUtils.isBlank(querys.getHostIp())) {
//			map.put("hostIp", querys.getHostIp());
//		}
		map.put("hostStatus", querys.getHostStatusQ());

		if (querys.getStageQ() != null) {
			map.put("Stage", querys.getStageQ());
		}

//		if (StringUtils.isNotEmpty(querys.getTypeZhQ())) {
//			map.put("TypeZh", querys.getTypeZhQ());
//		}
//		if(querys.getHostStatus() != null) {
//			map.put("hostStatus", querys.getHostStatus());
//		}
//		if (querys.getPriority() != null) {
//			map.put("priority", querys.getPriority());
//		}
		Pager<DetectionThreat> pager = null;
		try {
			// 获取分页信息
			pager = threatService.getInfos(querys.getNumPerPage(), querys.getPageNum(), null, map, orders, time);
		} catch (Exception e) {
			log.error("DetectionThreatController index method exception : ", e);
		}
		Map<String, Object> maps = new HashMap<String, Object>();
		maps.put("info", pager);
		maps.put("dealStatus", DealStatus.DETECTION_STATUS);
		maps.put("stages", Stage.STAGE_DATA);
		List<DetectionType> typeZh = typeService.findAll();
		Map<String, String> types = new HashMap<String, String>();
		if (null != typeZh) {
			for (DetectionType detectionType : typeZh) {
				types.put(detectionType.getTypeZh(), detectionType.getTypeZh());
			}
			maps.put("detectionTypes", types);
		}
		return new ResultBean(maps);
	}

	/**
	 * m
	 * 
	 * @函数名称：getDetectionThread
	 * @创建日期：2017年12月1日
	 * @功能说明：通过ID查询单个
	 * @参数说明：
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/get_detection")
	public @ResponseBody ResultBean getDetectionThread(Integer detectId) {

		DetectionThreat threat = threatService.findDetection(detectId);

		return new ResultBean(threat);
	}

	/**
	 * @函数名称：getDetections
	 * @创建日期：2017年11月22日
	 * @功能说明：根据检测信息ID获取有关主机的信息
	 * @参数说明：detectId
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/get_host")
	public @ResponseBody ResultBean getDetections(Long detectId) {
		HostThreat hostThreat = hostService.getHostThreatByDetectId(detectId);
		return new ResultBean(hostThreat);
	}

	/**
	 * @函数名称：query
	 * @创建日期：2017年11月22日
	 * @功能说明：统计主机的威胁阶段信息
	 * @参数说明：time
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/host_detections")
	public @ResponseBody List<DetectionStageCount> HostDetections(String hostIp) {
		List<DetectionStageCount> list = threatService.getHostDetections(hostIp);
		return list;
	}

	/**
	 * @函数名称：HostDetections
	 * @创建日期：2017年12月4日
	 * @功能说明：统计主机的可信度和威胁度
	 * @参数说明：
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/get_host_threat")
	public @ResponseBody ResultBean getHostThreat(String hostIp) {

		String endDate = DateUtil.getCurrentDateTime();
		String startDate = DateUtil.addDateMinut(DateUtil.getCurrentDateTime(), -48);

		List<DetectionThreatLine> list = null;
		try {
			list = hostService.getInfosByHostIp(hostIp, 1, startDate, endDate, null);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			log.error("DetectionThreatController getHostThreat method exception : ", e);
		}
		return new ResultBean(list);
	}

	/**
	 * 
	 * @函数名称：index
	 * @创建日期：2017年4月10日
	 * @功能说明：检测主页面点击主机跳转页面
	 * @参数说明：query 查询条件
	 * @返回说明：String
	 */
	@RequestMapping(value = "/detection_page", method = RequestMethod.POST)
	public String detection(Model model, DetectionThreat param) {

		String tags = hostTagsService.getStringByHostIp(param.getHostIp());
		model.addAttribute("tags", tags);
		model.addAttribute("detectionThreat", param);
		model.addAttribute("stage", Stage.STAGE_DATA);
		model.addAttribute("source", Source.SOURCE);
		model.addAttribute("hostStatus", HostStatus.HOST_STATUS);
		return "check/detection_detail";
	}

	/**
	 * @函数名称：getDashboardDate
	 * @创建日期：2017年12月9日
	 * @功能说明：获取仪表盘数据
	 * @参数说明：
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/dashboard_data")
	public @ResponseBody ResultBean getDashboardDate(ReportsReq req) {
		DashboardRes res = null;
		try {
			res = threatService.getBashboardData(req);
		} catch (InterruptedException | ExecutionException e) {
			log.error("DetectionThreatController getDashboardDate method exception : ", e);
		}
		return new ResultBean(res);
	}

	/**
	 * @函数名称：getBiggestMovers8
	 * @创建日期：2017年12月13日
	 * @功能说明：
	 * @参数说明：
	 * @返回说明：ResultBean
	 */
	/*
	 * @RequestMapping(value = "/biggest_movers") public @ResponseBody ResultBean
	 * getBiggestMovers(ReportsReq req) { List<BiggestMovers> biggestMovers = null; try {
	 * biggestMovers = threatService.getBiggestMovers(req); } catch (Exception e) {
	 * log.error("DetectionThreatController getBiggestMovers method exception : ", e); } return new
	 * ResultBean(biggestMovers); }
	 */

	/**
	 * @函数名称：getThreatAssets
	 * @创建日期：2018年3月30日
	 * @功能说明：获取主机危险性总览
	 * @参数说明：
	 * @返回说明：DashboardRes
	 */
	@RequestMapping(value = "/hostthreat_overview")
	public @ResponseBody DashboardRes getHostThreatOverviewCount() {
		return threatService.getHostThreatOverviewCount();
	}

	/**
	 * @函数名称：getKeyHosts
	 * @创建日期：2018年3月30日
	 * @功能说明：获取关键资产
	 * @参数说明：
	 * @返回说明：DashboardRes
	 */
	@RequestMapping(value = "/key_host")
	public @ResponseBody DashboardRes getKeyHosts() {
		return threatService.getKeyHosts();
	}

	/**
	 * @函数名称：getThreatAssets
	 * @创建日期：2018年3月30日
	 * @功能说明：危险资产
	 * @参数说明：
	 * @返回说明：DashboardRes
	 */
	@RequestMapping(value = "/threat_assets")
	public @ResponseBody DashboardRes getThreatAssets() {
		return threatService.getThreatAssets();
	}

	/**
	 * @函数名称：getDetectionBreakdown
	 * @创建日期：2018年3月30日
	 * @功能说明：检测处理分类信息
	 * @参数说明：
	 * @返回说明：DashboardRes
	 */
	@RequestMapping(value = "/detection_breakdown")
	public @ResponseBody DashboardRes getDetectionBreakdown() {
		return threatService.getDetectionBreakdown();
	}

	/**
	 * @函数名称：getDetectionStages
	 * @创建日期：2018年3月30日
	 * @功能说明：攻击行为阶段
	 * @参数说明：
	 * @返回说明：DashboardRes
	 */
	@RequestMapping(value = "/detection_stages")
	public @ResponseBody DashboardRes getDetectionStages() {
		return threatService.getDetectionStages();
	}

	/**
	 * @函数名称：getBiggestMovers
	 * @创建日期：2018年3月30日
	 * @功能说明：最大危险资产
	 * @参数说明：
	 * @返回说明：DashboardRes
	 */
	@RequestMapping(value = "/biggest_movers")
	public @ResponseBody DashboardRes getBiggestMovers() {
		return threatService.getBiggestMovers();
	}

	/**
	 * @函数名称：getDetectionTypes
	 * @创建日期：2018年3月30日
	 * @功能说明：攻击行为类型
	 * @参数说明：
	 * @返回说明：DashboardRes
	 */
	@RequestMapping(value = "/detection_types")
	public @ResponseBody DashboardRes getDetectionTypes() {
		return threatService.getDetectionTypes();
	}
}
