/**
 * @工程名称：datapot-om
 * @程序包名：com.datapot.web.om.assets.alert
 * @程序类名：SummaryController.java
 * @创建日期：2018年6月26日
 */
package com.datapot.web.om.assets.summary;

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
@RequestMapping(value = "/om/assets/summary")
public class SummaryController {
	
	@RequestMapping(value = "/index")
	public ModelAndView index() {
		ModelMap model = new ModelMap();  
		return new ModelAndView("/trafficAnalysis/assetProfile",model);
	}

}