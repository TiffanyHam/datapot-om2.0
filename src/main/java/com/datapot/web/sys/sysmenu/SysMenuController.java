/**
 * @工程名称：datapot-om
 * @程序包名：com.datapot.om.web;
 * @程序类名：SysMenuController.java
 * @创建日期：2017年4月20日
 */
package com.datapot.web.sys.sysmenu;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.datapot.contants.http.ErrorCode;
import com.datapot.contants.result.ResultBean;
import com.datapot.core.sys.sysgroup.service.ISysGroupService;
import com.datapot.core.sys.sysgroupjoinmenu.servic.ISysGroupJoinMenuService;
import com.datapot.core.sys.sysmenu.domain.SysMenuQ;
import com.datapot.core.sys.sysmenu.service.ISysMenuService;
import com.datapot.persist.sys.sysmenu.domain.SysMenuV;
import com.datapot.persist.sys.useraccount.domain.UserAccount;
import com.datapot.persist.util.LoginTokenSessionHelper;
import com.datapot.token.util.TokenSessionHelper;
import com.datapot.web.base.BaseController;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.Lists;

/**
 * 
 * @功能说明：系统菜单管理控制类
 * @创建人员：Luxr
 * @变更记录：<BR> 1、2017年4月12日 Luxr 新建类
 */

@Controller
@RequestMapping("/sys/menu")
public class SysMenuController extends BaseController {
	private final Logger log = LoggerFactory.getLogger(getClass());

	@Autowired
	private ISysMenuService menuService;
	@Autowired
	private ISysGroupService sysGroupService;

	@Autowired
	private ISysGroupJoinMenuService sysGroupJoinMenuService;

	/**
	 * @函数名称：getMainMenu
	 * @创建日期：2017年11月1日
	 * @功能说明：获取所有的一级菜单
	 * @参数说明：
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/get_menus")
	public @ResponseBody ResultBean getMainMenu(HttpServletRequest request) {
		// UserAccount userAccount = (UserAccount)
		request.getAttribute("accountSession");
		Map<String, Object> map = new LinkedHashMap<String, Object>();
		// 如果从session中取出数据为空，则返回空的结果
		if (null == request.getAttribute("menus")) {
			return new ResultBean();
		} // 从session中获取用户菜单信息
		@SuppressWarnings("unchecked")
		List<SysMenuV> menuList = (List<SysMenuV>) request.getAttribute("menus");

		List<SysMenuV> list = new ArrayList<SysMenuV>();
		for (SysMenuV sysMenuV : menuList) {
			if (sysMenuV.getParentMenuId() == 0) {
				list.add(sysMenuV);
			}
		}
		sortList(list); // 一级菜单访入map
		Map<Integer, List<SysMenuV>> mapMenu = new LinkedHashMap<Integer, List<SysMenuV>>();
		for (SysMenuV sysMenuV : list) {
			mapMenu.put(sysMenuV.getMenuId(), new ArrayList<>());
			for (SysMenuV sysMenu : menuList) { // 判断是否当前菜单的子菜单
				if (sysMenuV.getMenuId() == sysMenu.getParentMenuId()) {
					mapMenu.get(sysMenuV.getMenuId()).add(sysMenuV);
				}
			} // 对加入的菜单进行排序
			sortList(mapMenu.get(sysMenuV.getMenuId()));
		}
		map.put("mainMenus", list);
		map.put("secondMenus", mapMenu); // System.out.println(new ObjectMapper().writeValueAsString(new
		return new ResultBean(map);
	}

	/**
	 * @函数名称：getMainMenu
	 * @创建日期：2017年11月15日
	 * @功能说明：获取一级菜单
	 * @参数说明：
	 * @返回说明：ResultBean
	 */
	//TODO: need logined
	@RequestMapping(value = "/level_menus")
	public @ResponseBody ResultBean getLevelMenus(HttpServletRequest request) {
		UserAccount user = LoginTokenSessionHelper.getCurrentUser();
		if(user == null) {
			return new ResultBean(ErrorCode.USER_NOT_LOGIN, "请登录");
		}
		Integer groupId = user.getGroupId();
		// 获取所有一级菜单
		List<SysMenuV> menus = menuService.queryLevelMenus(groupId);
		return new ResultBean(menus);
	}

	/**
	 * @函数名称：getMainMenu
	 * @创建日期：2017年11月15日
	 * @功能说明：获取二级菜单
	 * @参数说明：
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/second_level_menus")
	public @ResponseBody ResultBean getSecondLevelMenus(HttpServletRequest request, SysMenuV sysMenu) {
		// 获取所有二级菜单
		// 获取session中的用户
		UserAccount account = LoginTokenSessionHelper.getCurrentUser();
		if(account == null) {
			return new ResultBean(ErrorCode.USER_NOT_LOGIN, "请先登陆");
		}
		Integer groupId = account.getGroupId();

		List<SysMenuV> menus = menuService.querySecondLevelMenus(sysMenu, groupId);
		if (menus == null || menus.size() == 0) {
			return new ResultBean(Lists.newArrayList());
		} else {
			return new ResultBean(menus);
		}
		
	}

	/**
	 * @函数名称：getMainMenu
	 * @创建日期：2017年11月15日
	 * @功能说明：获取跳转页面的URL
	 * @参数说明：
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/open_page")
	public @ResponseBody ResultBean getOpenPage(HttpServletRequest request, SysMenuV sysMenu) {
		SysMenuV menu = null;

		UserAccount user = LoginTokenSessionHelper.getCurrentUser();
		if(user == null) {
			return new ResultBean(ErrorCode.USER_NOT_LOGIN, "请先登陆");
		}
		Integer groupId = user.getGroupId();

		// 获取所有二级菜单
		List<SysMenuV> menus = menuService.querySecondLevelMenus(sysMenu, groupId);
		if (menus == null || menus.size() == 0) {
			// 根据ID获取菜单信息
			menu = menuService.findSysMenuV(sysMenu);
			return new ResultBean(menu);
		} else {
			return new ResultBean(menus.get(0));
		}

	}

	/**
	 * @函数名称：sortList
	 * @创建日期：2017年11月2日
	 * @功能说明：对菜单进行排序
	 * @参数说明：
	 * @返回说明：void
	 */
	public void sortList(List<SysMenuV> chinaList) {
		// 对list进行排序
		Collections.sort(chinaList, new Comparator<SysMenuV>() {
			/*
			 * int compare(SysMenuV o1, SysMenuV o2) 返回一个基本类型的整型， 返回负数表示：o1 小于o2， 返回0 表示：o1和o2相等，
			 * 返回正数表示：o1大于o2。
			 */
			public int compare(SysMenuV o1, SysMenuV o2) {
				// 按照菜单ID进行升序排列
				if (o1.getMenuId() < o2.getMenuId()) {
					return 1;
				}
				if (o1.getMenuId() == o2.getMenuId()) {
					return 0;
				}
				return -1;
			}
		});
	}

	/**
	 * @函数名称：getInfosByGroupId
	 * @创建日期：2017年11月18日
	 * @功能说明：
	 * @参数说明：
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/get_menus_userid")
	public @ResponseBody ResultBean getInfosByUserId() {

		UserAccount user = LoginTokenSessionHelper.getCurrentUser();
		if(user == null) {
			return new ResultBean(ErrorCode.USER_NOT_LOGIN, "请先登陆");
		}
		List<Integer> listGroupMenuId = sysGroupJoinMenuService.getJoinMenuIdsById(user.getGroupId());

		List<SysMenuV> list = null;
		List<SysMenuQ> menuQList = new ArrayList<>();
		String data = null;
		try {
			list = menuService.getInfos();
			for (SysMenuV sysMenuV : list) {
				// if (listGroupMenuId.contains(sysMenuV.getMenuId())) {
				SysMenuQ sysMenuQ = new SysMenuQ();
				sysMenuQ.setId(sysMenuV.getMenuId());
				sysMenuQ.setpId(sysMenuV.getParentMenuId());
				sysMenuQ.setName(sysMenuV.getMenuName());
				menuQList.add(sysMenuQ);
				// }
			}
			ObjectMapper obj = new ObjectMapper();
			data = obj.writeValueAsString(menuQList);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.error("SysMenuController getInfosByGroupId method exception : ", e);
		}
		return new ResultBean(data);
	}

	/**
	 * @函数名称：getInfosByGroupId
	 * @创建日期：2017年11月18日
	 * @功能说明：
	 * @参数说明：
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/get_menus_groupid")
	public @ResponseBody ResultBean getInfosByGroupId(Integer groupId) {
		List<SysMenuV> list = null;
		List<SysMenuQ> menuQList = new ArrayList<>();
		try {
			list = menuService.findSysMenuReqByGroupId(groupId);
			for (SysMenuV sysMenuV : list) {
				SysMenuQ sysMenuQ = new SysMenuQ();
				sysMenuQ.setId(sysMenuV.getMenuId());
				sysMenuQ.setpId(sysMenuV.getParentMenuId());
				sysMenuQ.setName(sysMenuV.getMenuName());
				menuQList.add(sysMenuQ);
			}
		} catch (Exception e) {
			log.error("SysMenuController getInfosByGroupId method exception : ", e);
		}
		return new ResultBean(list);
	}
}
