/**
 * @工程名称：datapot-om
 * @程序包名：com.datapot.web.om
 * @程序类名：DetectionActivityController.java
 * @创建日期：2017年11月29日
 */
package com.datapot.web.om.detectionactivity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.datapot.contants.result.ResultBean;
import com.datapot.core.om.detectionactivity.service.IDetectionactivityService;
import com.datapot.persist.om.detectionactivity.domain.DetectionActivity;
import com.datapot.persist.om.detectionactivity.domain.DetectionActivitySummary;
import com.datapot.persist.support.Pager;
import com.datapot.web.base.BaseController;

/**
 * @功能说明：检测活动信息控制类
 * @创建人员：Luxr
 * @变更记录：<BR> 1、2017年11月29日 Luxr 新建类
 */
@RequestMapping("/om/detection_activity")
@Controller
public class DetectionActivityController extends BaseController {

	@Autowired
	private IDetectionactivityService activityService;

	/**
	 * @函数名称：getActivities
	 * @创建日期：2017年12月1日
	 * @功能说明：通过检测信息ID获取检测活动信息
	 * @参数说明：detectId 检测信息ID
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/get_activities")
	public @ResponseBody ResultBean getActivities(Long detectId, Integer pageNum, Integer numPerPage) {
		Pager<DetectionActivity> pager = activityService.getDetectionActivities(detectId, pageNum, numPerPage);
		return new ResultBean(pager);
	}

	/**
	 * @函数名称：getHostActive
	 * @创建日期：2017年12月4日
	 * @功能说明：统计文件下载次数
	 * @参数说明：detectId 检测信息ID
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/get_host_active", method = RequestMethod.POST)
	public @ResponseBody ResultBean getHostActive(Long detectId) {
		DetectionActivitySummary summary = activityService.getActivity(detectId);
		return new ResultBean(summary);
	}
}
