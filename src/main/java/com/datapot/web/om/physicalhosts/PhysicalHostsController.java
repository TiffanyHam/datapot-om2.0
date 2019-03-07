/**
 * @工程名称：datapot-om
 * @程序包名：com.datapot.web.om.physicalhosts
 * @程序类名：PhysicalHostsController.java
 * @创建日期：2017年11月7日
 */
package com.datapot.web.om.physicalhosts;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

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

import com.datapot.contants.enums.HostType;
import com.datapot.contants.operation.OpResultConstants;
import com.datapot.contants.result.ResultBean;
import com.datapot.core.om.hosttags.service.IHostTagsService;
import com.datapot.core.om.physicalhosts.domain.PhysicalHostsReq;
import com.datapot.core.om.physicalhosts.service.IPhysicalHostsService;
import com.datapot.core.sys.sysoffice.service.ISysOfficeService;
import com.datapot.persist.om.hosttags.domain.HostTags;
import com.datapot.persist.om.physicalhosts.domain.PhysicalHosts;
import com.datapot.persist.support.Order;
import com.datapot.persist.support.Pager;
import com.datapot.persist.sys.sysoffice.domain.SysOffice;

/**
 * @功能说明：物理主机controller
 * @创建人员：wendg
 * @变更记录：<BR>
 * 1、2017年11月7日 wendg 新建类
 */
@Controller
@RequestMapping("/om/physical_host")
public class PhysicalHostsController {

	private final Logger log = LoggerFactory.getLogger(getClass());

	@Autowired
	private IPhysicalHostsService physicalHostsService;

	@Autowired
	private ISysOfficeService sysOfficeService;

	@Autowired
	private IHostTagsService hostTagsService;

	/**
	 * 
	 * @函数名称：index
	 * @创建日期：2017年4月10日
	 * @功能说明：物理主机加载页面
	 * @参数说明：query 查询条件
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/index")
	public String index(PhysicalHostsReq querys, Model model) {
		List<Order> orders = this.generateOrders(querys);
		Pager<PhysicalHosts> pager = null;
		Map<String, String> officeMap = new LinkedHashMap<>();
		Map<String, String> hostTagsMap = new LinkedHashMap<>();
		try {
			// 获取部门分页信息
			pager = physicalHostsService.getInfos(querys.getNumPerPage(), querys.getPageNum(), null, null, orders);
			List<SysOffice> offices = sysOfficeService.getInfos();

			for (SysOffice sysOffice : offices) {
				officeMap.put(sysOffice.getOfficeId() + "", sysOffice.getOfficeName());
			}

			List<HostTags> hostTagsList = hostTagsService.findAll();
			for (HostTags hostTag : hostTagsList) {
				hostTagsMap.put(hostTag.getId() + "", hostTag.getTagName());
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.info("CompanyIp management information query error");
		}
		model.addAttribute("infos", pager);
		model.addAttribute("sysOffice", officeMap);
		model.addAttribute("hostTagsMap", hostTagsMap);
		model.addAttribute("hostTypeMap", HostType.HOST_TYPE_SELECT);
		return "/manage/physical_hosts";
	}

	/**
	 * 
	 * @函数名称：index
	 * @创建日期：2017年4月10日
	 * @功能说明：物理主机加载页面
	 * @参数说明：query 查询条件
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/physical_host_query", method = RequestMethod.POST)
	public @ResponseBody ResultBean query(PhysicalHostsReq querys, Model model) {
		List<Order> orders = this.generateOrders(querys);
		Pager<PhysicalHosts> pager = null;
		Map<String, Object> mapValues = new HashMap<>();

		if (StringUtils.isNotEmpty(querys.getHostNameReq())) {
			mapValues.put("HostName", querys.getHostNameReq());
			mapValues.put("HostIp", querys.getHostNameReq());
		}
		if (querys.getHostTypeReq() != null && querys.getHostTypeReq() != 0) {
			mapValues.put("HostType", querys.getHostTypeReq());
		}

		if (querys.getHostTagIdReq() != null) {
			mapValues.put("HostTagId", querys.getHostTagIdReq());
		}

		if (querys.getOfficeIdReq() != null) {
			mapValues.put("OfficeId", querys.getOfficeIdReq());
		}
		try {
			// 获取部门分页信息
			pager = physicalHostsService.getInfos(querys.getNumPerPage(), querys.getPageNum(), mapValues, orders);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.info("CompanyIp management information query error", e);
		}

		return new ResultBean(pager);
	}

	/**
	 * @函数名称：generateOrders
	 * @创建日期：2017年4月10日
	 * @功能说明：初始排序信息集合
	 * @参数说明：query 查询条件
	 * @返回说明：List<Order>
	 */
	private List<Order> generateOrders(PhysicalHostsReq query) {
		List<Order> orders = new ArrayList<Order>();
		orders.add(new Order("Id", "ASC"));
		return orders;
	}

	/**
	 * @函数名称：save
	 * @创建日期：2017年4月11日
	 * @功能说明：保存物理主机信息与更新物理主机信息
	 * @参数说明：request 请求对象
	 * @参数说明：detectionTags 物理主机对象
	 * @返回说明：ModelAndView
	 */
	@RequestMapping(value = "/save", method = RequestMethod.POST)
	public @ResponseBody ResultBean save(HttpServletRequest request, PhysicalHosts physicalHosts) {

		String message = "";
		String opName = "";
		try {
			// 如果部门id为空则是执行新增，否则为修改
			if (null == physicalHosts.getId() || physicalHosts.getId() < 0) {

				message = physicalHostsService.save(physicalHosts);
			} else {
				opName = "修改";
				message = physicalHostsService.update(physicalHosts);
			}
			// 此处为返回页面并刷新数据
			return new ResultBean(ResultBean.RETCODE_SUCCESS, message);
		} catch (DuplicateKeyException duplicateKeyException) {
			log.error("[CompanyIp] - " + opName + "exception - ", duplicateKeyException);
			message = OpResultConstants.EXIST_SAME_DATA + "主机名或主机IP";
			return new ResultBean(ResultBean.RETCODE_FAIL, message);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.error("[CompanyIp] - " + opName + "exception - ", e);
			message = OpResultConstants.OP_EXCEPTION;
			return new ResultBean(ResultBean.RETCODE_FAIL, message);
		}
	}

	/**
	 * @函数名称：delete
	 * @创建日期：2017年4月11日
	 * @功能说明：执行删除资产标签操作
	 * @参数说明：request 请求对象
	 * @参数说明：physicalHostsId 物理主机 ID
	 * @返回说明：ModelAndView
	 */
	@RequestMapping(value = "/delete", method = RequestMethod.POST)
	public @ResponseBody ResultBean delete(HttpServletRequest request, Integer physicalHostsId) {

		String message = "";
		try {

			message = physicalHostsService.delete(physicalHostsId);
			// 此处为返回页面并刷新数据
			return new ResultBean(ResultBean.RETCODE_SUCCESS, message);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.error("DetectionTagsController delete method exception : ", e);
			message = OpResultConstants.OP_EXCEPTION;
			return new ResultBean(ResultBean.RETCODE_SUCCESS, message);
		}
	}
}
