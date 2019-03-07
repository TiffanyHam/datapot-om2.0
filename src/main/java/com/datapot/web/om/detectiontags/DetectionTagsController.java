/**
 * @工程名称：datapot-om
 * @程序包名：com.datapot.web.om.detectiontags
 * @程序类名：DetectionTagsController.java
 * @创建日期：2017年11月7日
 */
package com.datapot.web.om.detectiontags;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.datapot.contants.operation.OpResultConstants;
import com.datapot.contants.result.ResultBean;
import com.datapot.core.om.detectiontags.domain.DetectionTagsReq;
import com.datapot.core.om.detectiontags.service.IDetectionTagsService;
import com.datapot.persist.om.detectiontags.domain.DetectionTags;
import com.datapot.persist.support.Order;
import com.datapot.persist.support.Pager;
import com.fasterxml.jackson.core.JsonProcessingException;

/**
 * @功能说明：检测标签controller
 * @创建人员：wendg
 * @变更记录：<BR>
 * 1、2017年11月7日 wendg 新建类
 */
@Controller
@RequestMapping("/om/detection_tags")
public class DetectionTagsController {

	private final Logger log = LoggerFactory.getLogger(getClass());

	@Autowired
	private IDetectionTagsService detectionTagsService;

	/**
	 * 
	 * @throws JsonProcessingException 
	 * @函数名称：index
	 * @创建日期：2017年4月10日
	 * @功能说明：检测标签加载页面
	 * @参数说明：query 查询条件
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/index", method = RequestMethod.POST)
	public @ResponseBody ResultBean index(DetectionTagsReq querys) {
		List<Order> orders = this.generateOrders(querys);
		Map<String, Object> map = new HashMap<String, Object>();
		Pager<DetectionTags> pager = null;
		try {
			// 获取部门分页信息
			pager = detectionTagsService.getInfos(querys.getNumPerPage(), querys.getPageNum(), null, null, orders);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.info("CompanyIp management information query error");
		}
		map.put("pager", pager);
		return new ResultBean(map);
	}

	/**
	 * @函数名称：generateOrders
	 * @创建日期：2017年4月10日
	 * @功能说明：初始排序信息集合
	 * @参数说明：query 查询条件
	 * @返回说明：List<Order>
	 */
	private List<Order> generateOrders(DetectionTagsReq query) {
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
	 * @参数说明：id 内网IP Id
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

	/**
	 * @函数名称：save
	 * @创建日期：2017年4月11日
	 * @功能说明：保存检测标签信息与更新检测标签信息
	 * @参数说明：request 请求对象
	 * @参数说明：detectionTags 检测标签对象
	 * @返回说明：ModelAndView
	 */
	@RequestMapping(value = "/save", method = RequestMethod.POST)
	public @ResponseBody ResultBean save(HttpServletRequest request, DetectionTags detectionTags) {

		String message = "";
		String opName = "";
		try {
			// 如果部门id为空则是执行新增，否则为修改
			if (null == detectionTags.getId() || detectionTags.getId() < 0) {

				message = detectionTagsService.save(detectionTags);
			} else {
				opName = "修改";
				message = detectionTagsService.update(detectionTags);
			}
			// 此处为返回页面并刷新数据
			return new ResultBean(ResultBean.RETCODE_SUCCESS, message);
		} catch (DuplicateKeyException duplicateKeyException) {
			log.error("[CompanyIp] - " + opName + "exception - ", duplicateKeyException);
			message = OpResultConstants.EXIST_SAME_DATA + "IP";
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
	 * @功能说明：执行删除部门操作
	 * @参数说明：request 请求对象
	 * @参数说明：detectionTagsId 检测标签 ID
	 * @返回说明：ModelAndView
	 */
	@RequestMapping(value = "/delete", method = RequestMethod.POST)
	public @ResponseBody ResultBean delete(HttpServletRequest request, Integer detectionTagsId) {

		String message = "";
		try {

			message = detectionTagsService.delete(detectionTagsId);
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
