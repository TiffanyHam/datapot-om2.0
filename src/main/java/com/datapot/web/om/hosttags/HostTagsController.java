/**
 * @工程名称：datapot-om
 * @程序包名：com.datapot.web.om.hosttags
 * @程序类名：HostTagsController.java
 * @创建日期：2017年11月7日
 */
package com.datapot.web.om.hosttags;

import java.util.ArrayList;
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
import com.datapot.core.om.hosttags.domain.HostTagsReq;
import com.datapot.core.om.hosttags.domain.HostTagsSave;
import com.datapot.core.om.hosttags.service.IHostTagsService;
import com.datapot.core.sys.sysoffice.service.ISysOfficeService;
import com.datapot.persist.om.hosttags.domain.HostTags;
import com.datapot.persist.support.Order;
import com.datapot.persist.support.Pager;
import com.datapot.persist.support.Where;
import com.datapot.persist.sys.sysoffice.domain.SysOffice;

/**
 * @功能说明：资产标签controller
 * @创建人员：wendg
 * @变更记录：<BR>
 * 1、2017年11月7日 wendg 新建类
 */
@Controller
@RequestMapping("/om/host_tag")
public class HostTagsController {

	private final Logger log = LoggerFactory.getLogger(getClass());

	@Autowired
	private IHostTagsService hostTagsService;

	@Autowired
	private ISysOfficeService sysOfficeService;

	/**
	 * 
	 * @函数名称：index
	 * @创建日期：2017年4月10日
	 * @功能说明：资产标签加载页面
	 * @参数说明：query 查询条件
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/index", method = RequestMethod.GET)
	public String index(HostTagsReq querys, Model model) {
		List<Order> orders = this.generateOrders(querys);
		Pager<HostTags> pager = null;
		try {
			// 获取标签分页信息
			pager = hostTagsService.getInfos(querys.getNumPerPage(), querys.getPageNum(), null, null, orders);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.info("CompanyIp management information query error");
		}
		model.addAttribute("infos", pager);
		return "/manage/host_tags";
	}

	/**
	 * 
	 * @函数名称：index
	 * @创建日期：2017年4月10日
	 * @功能说明：资产标签加载页面
	 * @参数说明：query 查询条件
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/get_infos", method = RequestMethod.POST)
	public @ResponseBody ResultBean getInfos(HostTagsReq querys) {
		List<Order> orders = this.generateOrders(querys);
		Pager<HostTags> pager = null;
		List<Where> wheres = new ArrayList<>();
		if (StringUtils.isNotEmpty(querys.getHostNameReq())) {
			wheres.add(new Where("HostName", "LIKE", "%" + querys.getHostNameReq().trim() + "%"));
		}

		if (StringUtils.isNotEmpty(querys.getHostTagsReq())) {
			wheres.add(new Where("TagName", "LIKE", "%" + querys.getHostTagsReq().trim() + "%"));
		}
		try {
			// 获取标签分页信息
			pager = hostTagsService.getInfos(querys.getNumPerPage(), querys.getPageNum(), null, wheres, orders);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.info("CompanyIp management information query error");
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
	private List<Order> generateOrders(HostTagsReq query) {
		List<Order> orders = new ArrayList<Order>();
		orders.add(new Order("Id", "ASC"));
		return orders;
	}

	/**
	 * @函数名称：edit
	 * @创建日期：2017年4月11日
	 * @功能说明：点击新增或修改时弹层
	 * @参数说明：model
	 * @参数说明：nti 菜单id
	 * @参数说明：id 资产标签 Id
	 * @返回说明：String
	 */
	@RequestMapping(value = "/edit", method = RequestMethod.GET)
	public String edit(Model model) {
		// 如果部门id为空则是新增页面，否则为修改
		// if (id != null && id > 0) {
		// CompanyIp companyIp = companyIpService.getInfo(id);
		// model.addAttribute("info", companyIp);
		// } else {
		// model.addAttribute("info", null);
		// }

		return "";
	}

	@RequestMapping(value = "/all")
	public @ResponseBody ResultBean all() {
		List<HostTags> tagsList = hostTagsService.findAll();
		return new ResultBean(tagsList);
		
	}

	

	/**
	 * @函数名称：save
	 * @创建日期：2017年4月11日
	 * @功能说明：保存资产标签信息与更新资产标签信息
	 * @参数说明：request 请求对象
	 * @参数说明：detectionTags 资产标签对象
	 * @返回说明：ModelAndView
	 */
	@RequestMapping(value = "/save", method = RequestMethod.POST)
	public @ResponseBody ResultBean save(HttpServletRequest request, HostTags hostTags) {

		String message = "";
		String opName = "";
		try {
			// 如果部门id为空则是执行新增，否则为修改
			if (null == hostTags.getId() || hostTags.getId() < 0) {

				message = hostTagsService.save(hostTags);
			} else {
				opName = "修改";
				message = hostTagsService.update(hostTags);
			}
			// 此处为返回页面并刷新数据
			return new ResultBean(ResultBean.RETCODE_SUCCESS, message);
		} catch (DuplicateKeyException duplicateKeyException) {
			log.error("[HostTags] - " + opName + "exception - ", duplicateKeyException);
			message = OpResultConstants.EXIST_SAME_DATA + "IP";
			return new ResultBean(ResultBean.RETCODE_FAIL, message);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.error("[HostTags] - " + opName + "exception - ", e);
			message = OpResultConstants.OP_EXCEPTION;
			return new ResultBean(ResultBean.RETCODE_FAIL, message);
		}
	}

	/**
	 * @函数名称：delete
	 * @创建日期：2017年4月11日
	 * @功能说明：执行删除资产标签操作
	 * @参数说明：request 请求对象
	 * @参数说明：detectionTagsId 资产标签 ID
	 * @返回说明：ModelAndView
	 */
	@RequestMapping(value = "/delete", method = RequestMethod.POST)
	public @ResponseBody ResultBean delete(HttpServletRequest request, Integer hostTagsId) {

		String message = "";
		try {

			message = hostTagsService.delete(hostTagsId);
			if (message.equals(OpResultConstants.HOST_TAGS_USED)) {
				return new ResultBean(ResultBean.RETCODE_FAIL, message);
			}
			// 此处为返回页面并刷新数据
			return new ResultBean(ResultBean.RETCODE_SUCCESS, message);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.error("DetectionTagsController delete method exception : ", e);
			message = OpResultConstants.OP_EXCEPTION;
			return new ResultBean(ResultBean.RETCODE_SUCCESS, message);
		}
	}

	/**
	 * @函数名称：getTagsInfos
	 * @创建日期：2018年2月5日
	 * @功能说明：
	 * @参数说明：
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/get_tags_infos", method = RequestMethod.POST)
	public @ResponseBody ResultBean getTagsInfos(String hostName) {
		Map<String, Object> result = hostTagsService.getInfos(hostName);
		try {
			List<SysOffice> officeList = sysOfficeService.getInfos();
			List<HostTags> tagsList = hostTagsService.findAll();
			Map<String, String> mapType = HostType.HOST_TYPE_SELECT;
			result.put("offices", officeList);
			result.put("hostTags", tagsList);
			result.put("hostTypes", mapType);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.error("HostTagsController getTagsInfos method exception : ", e);
		}

		return new ResultBean(result);
	}

	/**
	 * @函数名称：saveHostTags
	 * @创建日期：2018年2月6日
	 * @功能说明：
	 * @参数说明：
	 * @返回说明：String
	 */
	@RequestMapping("/host_tags_save")
	public @ResponseBody ResultBean saveHostTags(HostTagsSave hostTagsSave) {
		String message = "";
		try {
			message = hostTagsService.saveHostJoinTags(hostTagsSave);
			return new ResultBean(ResultBean.RETCODE_SUCCESS, message);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.error("HostTagsController saveHostTags method exception : ", e);
			message = "对不起，操作失败，请稍后重试或联系管理员！";
			return new ResultBean(ResultBean.RETCODE_FAIL, message);
		}
	}
}
