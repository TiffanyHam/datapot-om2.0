/**
 * @工程名称：datapot-om
 * @程序包名：com.datapot.web.om.reports
 * @程序类名：ReportsController.java
 * @创建日期：2017年12月4日
 */
package com.datapot.web.om.reports;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.datapot.contants.enums.HostClassification;
import com.datapot.contants.enums.Source;
import com.datapot.contants.enums.Stage;
import com.datapot.contants.result.ResultBean;
import com.datapot.core.om.Reports.domain.ReportsReq;
import com.datapot.core.om.Reports.domain.ReportsRes;
import com.datapot.core.om.Reports.service.IReportsService;
import com.datapot.core.om.detectiontype.service.IDetectionTypeService;
import com.datapot.core.om.hosttags.service.IHostTagsService;
import com.datapot.persist.om.hosttags.domain.HostTags;
import com.datapot.utils.date.DateUtil;

/**
 * @功能说明：
 * @创建人员：wendg
 * @变更记录：<BR>
 * 1、2017年12月4日 wendg 新建类
 */
@Controller
@RequestMapping("/om/reports")
public class ReportsController {

	private static Logger LOGGER = LoggerFactory.getLogger(ReportsController.class);

	@Autowired
	private IDetectionTypeService detectionTypeService;

	@Autowired
	private IReportsService reportsService;

	@Autowired
	private IHostTagsService hostTagsService;

	/**
	 * @函数名称：index
	 * @创建日期：2017年12月4日
	 * @功能说明：跳转到报告界面
	 * @参数说明：
	 * @返回说明：String
	 */
	@RequestMapping("/index")
	public String index(Model model) {
		try {
			// 攻击行为阶段
			Map<String, String> stages = Stage.STAGE_DATA;
			// 攻击行为类型
			Map<String, String> detectionTypes = detectionTypeService.findDetectionTypeMap();
			// 主机分类
			Map<String, String> hostClassifications = HostClassification.CLASSIFICATION;
			// 检测来源
			Map<String, String> sources = Source.SOURCE;
			// 获取标签信息
			List<HostTags> listTags = hostTagsService.findAll();
			Map<String, String> mapTags = new LinkedHashMap<String, String>();
			for (HostTags hostTags : listTags) {
				mapTags.put(hostTags.getId().toString(), hostTags.getTagName());
			}
			model.addAttribute("beginDateTime", DateUtil.getCurrentDate());
			model.addAttribute("endDateTime", DateUtil.getCurrentDate());
			model.addAttribute("stages", stages);
			model.addAttribute("detectionTypes", detectionTypes);
			model.addAttribute("hostClassifications", hostClassifications);
			model.addAttribute("sources", sources);
			model.addAttribute("hostTags", mapTags);
		} catch (Exception e) {
			LOGGER.error("跳转到报告界面时发生异常！" + e);
			e.printStackTrace();
		}
		return "/reports/scheduled_report";
	}
	
	
	@ResponseBody
	@RequestMapping("/constant")
	public ResultBean constant() {
		Map<String, String> stages = Stage.STAGE_DATA;
		Map<String, String> hostClassifications = HostClassification.CLASSIFICATION;
		// 检测来源
		Map<String, String> sources = Source.SOURCE;
		Map<String, Object> model = new HashMap<>();
		model.put("beginDateTime", DateUtil.getCurrentDate());
		model.put("endDateTime", DateUtil.getCurrentDate());
		model.put("stages", stages);
		model.put("hostClassifications", hostClassifications);
		model.put("sources", sources);
		return new ResultBean(model);
	}
	
	/**
	 * @函数名称：getReportsDate
	 * @创建日期：2017年12月13日
	 * @功能说明：获取报告页面数据
	 * @参数说明：
	 * @返回说明：void
	 */
	@RequestMapping("/reports_date")
	public @ResponseBody ResultBean getReportsDate(ReportsReq req) {
		ReportsRes res = null;
		try {
			res = reportsService.getReportsDate(req);
		} catch (Exception e) {
			LOGGER.error("获取报告页面数据时发生异常！" + e);
			e.printStackTrace();
		}
		return new ResultBean(res);
	}

	/**
	 * @函数名称：getHostDetectionResults
	 * @创建日期：2017年12月13日
	 * @功能说明：查询主机检测结果
	 * @参数说明：
	 * @返回说明：ResultBean
	 */
	/*
	 * @RequestMapping("/host_detection_results") public @ResponseBody ResultBean
	 * getHostDetectionResults(ReportsReq req){ List<HostDetectionResults> hostDetectionResults =
	 * null; try { hostDetectionResults = reportsService.getHostDetectionResults(req); } catch
	 * (Exception e) { LOGGER.error("查询主机检测结果时发生异常！" + e); e.printStackTrace(); } return new
	 * ResultBean(hostDetectionResults); }
	 */

	/**
	 * @函数名称：getAttackBehaviorDetection
	 * @创建日期：2017年12月13日
	 * @功能说明：查询攻击行为检测结果
	 * @参数说明：
	 * @返回说明：ResultBean
	 */
	/*
	 * @RequestMapping("/attack_behavior_detection") public @ResponseBody ResultBean
	 * getAttackBehaviorDetection(ReportsReq req){ Map<String,List<AttackBehaviorDetection>>
	 * attackBehaviorDetections = null; try { attackBehaviorDetections =
	 * reportsService.getAttackBehaviorDetection(req); } catch (Exception e) {
	 * LOGGER.error("查询攻击行为检测结果时发生异常！" + e); e.printStackTrace(); } return new
	 * ResultBean(attackBehaviorDetections); }
	 */
}
