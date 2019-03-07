/**
 * @工程名称：datapot-om
 * @程序包名：com.datapot.web.om.dashboard
 * @程序类名：DashBoardController.java
 * @创建日期：2017年12月4日
 */
package com.datapot.web.om.dashboard;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @功能说明：仪表板controller
 * @创建人员：wendg
 * @变更记录：<BR>
 * 1、2017年12月4日 wendg 新建类
 */
@Controller
@RequestMapping("/om/dash_board")
public class DashBoardController {

	private Log log = LogFactory.getLog(getClass());

	/**
	 * @函数名称：index
	 * @创建日期：2017年12月4日
	 * @功能说明：跳转到仪表盘界面
	 * @参数说明：
	 * @返回说明：String
	 */
	@RequestMapping("/index")
	public String index() {
		return "/dashboard/dashboard";
	}
}
