/**
 * @工程名称：datapot-om
 * @程序包名：com.datapot.web.om.resource
 * @程序类名：ResourcsController.java
 * @创建日期：2017年12月25日
 */
package com.datapot.web.om.resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @功能说明：资源静态资源
 * @创建人员：wendg
 * @变更记录：<BR>
 * 1、2017年12月25日 wendg 新建类
 */
@Controller
@RequestMapping("/om/resource")
public class ResourcsController {

	/**
	 * @函数名称：index
	 * @创建日期：2017年12月25日
	 * @功能说明：跳转到
	 * @参数说明：
	 * @返回说明：String
	 */
	@RequestMapping("/index")
	public String index() {
		return "/resource/resource";
	}
}
