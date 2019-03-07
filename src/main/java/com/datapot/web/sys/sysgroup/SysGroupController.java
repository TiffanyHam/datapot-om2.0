/**
 * @工程名称：datapot-om
 * @程序包名：com.datapot.om.web;
 * @程序类名：SysGroupController.java
 * @创建日期：2017年4月20日
 */
package com.datapot.web.sys.sysgroup;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.datapot.contants.result.ResultBean;
import com.datapot.core.sys.sysgroup.domain.SysGroupReq;
import com.datapot.core.sys.sysgroup.service.ISysGroupService;
import com.datapot.core.sys.sysgroupjoinmenu.servic.ISysGroupJoinMenuService;
import com.datapot.persist.support.Order;
import com.datapot.persist.support.Pager;
import com.datapot.persist.support.Where;
import com.datapot.persist.sys.sysgroup.domain.SysGroup;
import com.datapot.utils.date.DateUtil;
import com.datapot.web.base.BaseController;
import com.google.common.base.Function;
import com.google.common.collect.Collections2;
import com.google.common.collect.Lists;

/**
 * 
 * @功能说明：角色信息controller
 * @创建人员：Luxr
 * @变更记录：<BR> 1、2017年4月13日 Luxr 新建类
 */
@Controller
@RequestMapping(value = "/sys/group")
public class SysGroupController extends BaseController {

	private final Logger log = LoggerFactory.getLogger(getClass());

	@Autowired
	private ISysGroupService sysGroupService;

	@Autowired
	private ISysGroupJoinMenuService sysGroupJoinMenuService;

	/**
	 * 
	 * @函数名称：index
	 * @创建日期：2017年4月13日
	 * @功能说明：分页查询权限组信息
	 * @参数说明：
	 * @返回说明：void
	 */
	@RequestMapping(value = "/index")
	public String index(SysGroupReq query, Model model) {
		query.setNumPerPage(10);
		List<Order> orders = new ArrayList<Order>();
		orders.add(new Order("GroupId", "ASC"));
		List<Where> wheres = new ArrayList<>();
		if (StringUtils.isNotEmpty(query.getGroupNameQ())) {
			wheres.add(new Where("GroupName", "LIKE", "%" + query.getGroupNameQ() + "%"));
		}

		Pager<SysGroup> pager = sysGroupService.getInfos(query.getNumPerPage(), query.getPageNum(), null, wheres, orders);

		model.addAttribute("infos", pager);

		return "/manage/sys_group";
	}

	/**
	 * 
	 * @函数名称：index
	 * @创建日期：2017年4月13日
	 * @功能说明：分页查询权限组信息
	 * @参数说明：
	 * @返回说明：void
	 */
	@RequestMapping(value = "/query")
	public @ResponseBody ResultBean query(SysGroupReq query) {
		List<Order> orders = new ArrayList<Order>();
		orders.add(new Order("GroupId", "ASC"));
		List<Where> wheres = new ArrayList<>();
		if (StringUtils.isNotEmpty(query.getGroupNameQ())) {
			wheres.add(new Where("GroupName", "LIKE", "%" + query.getGroupNameQ() + "%"));
		}
		Pager<SysGroup> pager = sysGroupService.getInfos(query.getNumPerPage(), query.getPageNum(), null, wheres, orders);

		Map<String, Object> map = new HashMap<>();
		
		if(pager != null && pager.getResults() != null) {
			List<SysGroup> group = Lists.transform(pager.getResults(), new Function<SysGroup, SysGroup>() {
				@Override
				public SysGroup apply(SysGroup input) {
					input.setUptime(DateUtil.formatDate(input.getUptime(), DateUtil.LONGDATE_DATEMINUTE));
					return input;
				}
			});
			pager.setResults(group);
		}
		map.put("pager", pager);

		return new ResultBean(map);
	}

	/**
	 * @函数名称：getInfos
	 * @创建日期：2017年10月31日
	 * @功能说明：不分页显示所有信息
	 * @参数说明：
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/find_all", method = RequestMethod.POST)
	public @ResponseBody ResultBean getInfos(SysGroupReq sysGroupReq) {

		List<SysGroup> sysGroups = sysGroupService.findAll(sysGroupReq);
		if(sysGroups != null && sysGroups.size() != 0) {
			sysGroups = Lists.transform(sysGroups, new Function<SysGroup, SysGroup>() {
				@Override
				public SysGroup apply(SysGroup input) {
					input.setUptime(DateUtil.formatDate(input.getUptime(), DateUtil.LONGDATE_DATEMINUTE));
					return input;
				}
			});
		}
		Map<String, Object> map = new HashMap<>();
		map.put("sysGroups", sysGroups);
		return new ResultBean(sysGroups);
	}

	/**
	 * @函数名称：save
	 * @创建日期：2017年4月13日
	 * @功能说明：新增/修改操作
	 * @参数说明：sysGroup 权限组实体对象
	 * @返回说明：String
	 */
	@RequestMapping(value = "/save")
	@ResponseBody
	public ResultBean save(SysGroup sysGroup) {
		String message = "";
		if (StringUtils.isEmpty(sysGroup.getGroupName())) {
			message = "权限组名称不能为空";
			return new ResultBean(ResultBean.RETCODE_ELSEMSG, message);
		}
		try {
			if (null == sysGroup.getGroupId()) {
				sysGroupService.save(sysGroup);
				message = "新增成功";
			} else {
				sysGroupService.update(sysGroup);
				message = "修改成功";
			}
		} catch (DuplicateKeyException e) {
			log.error("a duplicateKeyException occurs when inserted or modified： ", e);
			message = "角色名称不能相同！";
			return new ResultBean(ResultBean.RETCODE_FAIL, message);
		} catch (Exception e) {
			log.error("An exception occurs when inserted or modified： ", e);
			message = "操作异常，请联系管理员或者稍后重试！";
			return new ResultBean(ResultBean.RETCODE_FAIL, message);
		}

		return new ResultBean(ResultBean.RETCODE_SUCCESS, message);
	}

	/**
	 * @函数名称：getMenuByGroupId
	 * @创建日期：2017年10月31日
	 * @功能说明：根据权限组id获取菜单id
	 * @参数说明：groupId 权限组id
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/get_menuId")
	@ResponseBody
	public ResultBean getMenuIdByGroupId(Integer groupId) {
		// 根据权限组id获取菜单id
		List<Integer> menuIds = sysGroupJoinMenuService.getJoinMenuIdsById(groupId);
		Map<String, Object> map = new HashMap<>();
		map.put("menuIds", menuIds);
		return new ResultBean(map);
	}

	/**
	 * @函数名称：addAuth
	 * @创建日期：2017年10月31日
	 * @功能说明：保存权限组与菜单关联信息
	 * @参数说明：groupId 权限组id
	 * @参数说明：menuIdStr 菜单id字符串，中间用“,”分隔
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/add_auth")
	@ResponseBody
	public ResultBean addAuth(Integer groupId, String menuIdStr) {
		String message = "";
		if (groupId == null) {
			message = "请选择要操作的角色！";
			return new ResultBean(ResultBean.RETCODE_SUCCESS, message);
		}
		if (StringUtils.isEmpty(menuIdStr)) { // 如果传入过来的菜单id为空，则为删除所有权限组所关联的菜单id
			message = sysGroupJoinMenuService.saveGroupJoinMenu(groupId, null);
			return new ResultBean(ResultBean.RETCODE_SUCCESS, message);
		} else {
			String[] menuIds = menuIdStr.split(",");
			List<String> list = Arrays.asList(menuIds);
			message = sysGroupJoinMenuService.saveGroupJoinMenu(groupId, list);
			return new ResultBean(ResultBean.RETCODE_SUCCESS, message);
		}
	}
}
