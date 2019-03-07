/**
 * @工程名称：datapot-om
 * @程序包名：com.datapot.om.web;
 * @程序类名：HomeController.java
 * @创建日期：2017年4月20日
 */
package com.datapot.web.sys.home;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.datapot.core.sys.sysmenu.service.ISysMenuService;
import com.datapot.web.base.BaseController;

/**
 * @功能说明：系统首页 Controller <BR>
 * @创建人员：LeoLu<BR>
 * @创建日期：2016年6月1日<BR>
 * @变更记录：<BR> 1、2016年6月1日 LeoLu 更新
 */
@Controller
@RequestMapping("/index")
public class HomeController extends BaseController {

	private final Logger log = LoggerFactory.getLogger(getClass());

	@Autowired
	private ISysMenuService menuService;

	/**
	 * @函数名称：index
	 * @创建日期：2014-1-1
	 * @功能说明：首页
	 * @参数说明：
	 * @返回说明：String
	 */
	@RequestMapping(value = "")
	public String index(Model model, HttpServletRequest request) {
		// UserAccount userAccount = super.getCurrentUser(request);
		// Integer groupId = userAccount.getGroupId();
		// List<SysMenuV> menus = menuService.getShowMenus(groupId, 0);
		// model.addAttribute("menus", menus);
		// System.out.println(JsonUtil.object2Json(menus));
		// request.setAttribute("currentDate", LunarUtil.currentDate());
		// request.setAttribute("dayOfWeek", LunarUtil.currentWeek());
		// request.setAttribute("lunarCalendar", LunarUtil.currentLunar());
		return "index";
	}

	/**
	 * @函数名称：main
	 * @创建日期：2014-1-1
	 * @功能说明：我的主页
	 * @参数说明：
	 * @返回说明：String
	 */
	@RequestMapping(value = "/{nti}")
	public String main(Model model, HttpServletRequest request) {
		return "/sys/announce/main";
	}
}
