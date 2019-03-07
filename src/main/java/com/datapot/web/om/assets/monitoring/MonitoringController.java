/**
 * @工程名称：datapot-om
 * @程序包名：com.datapot.web.om.assets.item
 * @程序类名：ItemController.java
 * @创建日期：2018年6月26日
 */
package com.datapot.web.om.assets.monitoring;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

/**
 * @功能说明：
 * @创建人员：zhenghb
 * @变更记录：<BR>
 * 1、2018年6月26日 zhenghb 新建类
 */
@Controller
@RequestMapping(value = "/om/assets/monitoring")
public class MonitoringController {
	
	@RequestMapping(value = "/index")
	public ModelAndView index() {
		ModelMap model = new ModelMap();  
		return new ModelAndView("/trafficAnalysis/assetMonitoring",model);
	}


}
