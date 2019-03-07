/**
 * @工程名称：datapot-om
 * @程序包名：com.datapot.web.om
 * @程序类名：DetectionTriageController.java
 * @创建日期：2017年11月29日
 */
package com.datapot.web.om.detectiontriage;

import java.sql.Timestamp;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.datapot.contants.enums.DealStatus;
import com.datapot.contants.http.ErrorCode;
import com.datapot.contants.result.ResultBean;
import com.datapot.core.om.detectiontriage.service.IDetectionTriageService;
import com.datapot.core.om.hostthreat.service.IHostThreatService;
import com.datapot.persist.config.TargetDataSource;
import com.datapot.persist.om.detectiontriage.domain.DetectionTriage;
import com.datapot.persist.sys.useraccount.domain.UserAccount;
import com.datapot.persist.util.LoginTokenSessionHelper;
import com.datapot.web.base.BaseController;

/**
 * @功能说明：检测处理控制类
 * @创建人员：Luxr
 * @变更记录：<BR> 1、2017年11月29日 Luxr 新建类
 */
@Controller
@RequestMapping("/om/detect_triage")
public class DetectionTriageController extends BaseController {

	private Log log = LogFactory.getLog(getClass());

	@Autowired
	private IDetectionTriageService detectionTriageService;

	@Autowired
	private IHostThreatService hostThreatService;

	/**
	 * @函数名称：edit
	 * @创建日期：2018年1月5日
	 * @功能说明：根据检测威胁id查询数据
	 * @参数说明：detectId 检测威胁id
	 * @返回说明：ResultBean
	 */
	@RequestMapping("/edit")
	public @ResponseBody ResultBean edit(Integer hostThreatId) {
		DetectionTriage detectionTriage = null;
		// List<Integer> hostThreatIds = hostThreatService.getHostIdByIP(hostThreatId);
		// if (null != hostThreatIds) {
		// detectionTriage = detectionTriageService.getThreatIds(hostThreatIds);
		// }
		if (hostThreatId != null) {
			detectionTriage = detectionTriageService.getInfo(hostThreatId);
		}
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("info", detectionTriage);
		map.put("detectionStatus", DealStatus.DETECTION_STATUS_MORE);
		return new ResultBean(map);
	}

	/**
	 * @函数名称：save
	 * @创建日期：2018年1月5日
	 * @功能说明：保存/修改检测处理结果信息
	 * @参数说明：
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/save", method = RequestMethod.POST)
	@TargetDataSource(name = "om")
	public @ResponseBody ResultBean save(DetectionTriage detectionTriage) {
		String message = "";
		// 获取当前用户信息
		try {
			UserAccount user = LoginTokenSessionHelper.getCurrentUser();
			if(user == null) {
				return new ResultBean(ErrorCode.USER_NOT_LOGIN, "请登录");
			}
			detectionTriage.setUserName(user.getUserName());
			detectionTriage.setTriageTime(new Timestamp(new Date().getTime()));
			if (detectionTriage.getId() == null) {
				message = detectionTriageService.save(detectionTriage);
			} else {
				message = detectionTriageService.update(detectionTriage);
			}
			return new ResultBean(ResultBean.RETCODE_SUCCESS, message);
		}  catch (Exception e) {
			// TODO Auto-generated catch block
			log.error("DetectionTriageController save method exception : ", e);
			message = "操作异常，请稍后重试或联系管理员！";
			return new ResultBean(ResultBean.RETCODE_FAIL, message);
		}
	}
}
