/**
 * @工程名称：datapot-om
 * @程序包名：com.datapot.web.om.assets.summary
 * @程序类名：ManagementController.java
 * @创建日期：2018年6月26日
 */
package com.datapot.web.om.assets.manage;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.datapot.contants.enums.HostClassification;
import com.datapot.contants.enums.assets.AssetsStatus;
import com.datapot.contants.enums.assets.DeviceType;
import com.datapot.contants.enums.assets.InterfaceType;
import com.datapot.contants.result.ResultBean;
import com.datapot.core.om.assets.manage.IManageService;
import com.datapot.core.om.assets.manage.domain.AssetsManageReq;
import com.datapot.core.om.assets.manage.domain.HostReq;
import com.datapot.persist.support.Order;
import com.datapot.persist.support.Where;

/**
 * @功能说明：资产管理模块
 * @创建人员：zhenghb
 * @变更记录：<BR>
 * 1、2018年6月26日 zhenghb 新建类
 */
@Controller
@RequestMapping(value = "/om/assets/manage")
public class ManageController {
	
	@Autowired
	private IManageService service;
	
	@RequestMapping(value = "/index")
	public ModelAndView index() throws Exception {
		return new ModelAndView("/trafficAnalysis/assetsManage",new ModelMap());
	}
	
	/**
	 * @函数名称：wheres
	 * @创建日期：2018年6月27日
	 * @功能说明：查询条件
	 * @参数说明：
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/wheres")
	public @ResponseBody ResultBean wheres() throws Exception{
		ModelMap model = new ModelMap(); 
		model.addAttribute("offices", service.queryOfficeInfo(null,new ArrayList<>(),new ArrayList<>()));//机构信息
		
		model.put("deviceType", DeviceType.DEVICE_TYPE);//设备类型
		model.put("assetsStatus", AssetsStatus.ASSETS_STATUS);//资产状态
		model.put("classification", HostClassification.CLASSIFICATION);//资产类型
		model.put("interfaceType", InterfaceType.INTERFACE_TYPE);//接口类型
		return new ResultBean(model);
	} 
	
	/**
	 * @函数名称：create
	 * @创建日期：2018年6月26日
	 * @功能说明：
	 * @参数说明：
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/create")
	public @ResponseBody ResultBean create(HostReq hostReq) {
		System.out.println(hostReq.toString());
		return new ResultBean();
	}
	
	public void checkInput(HostReq hostReq) throws Exception{
		Optional.of(hostReq).ifPresent(h -> {
			
		});
	}
	
	/**
	 * @函数名称：query
	 * @创建日期：2018年6月27日
	 * @功能说明：查询接口
	 * @参数说明：
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/query")
	public @ResponseBody ResultBean query(AssetsManageReq query) throws Exception{
		List<Order> orders = new ArrayList<>();
		orders.add(new Order("Id", "DESC"));
		List<Where> wheres = new ArrayList<>();
		return new ResultBean(service.pagingQuery(query.getNumPerPage(), query.getPageNum(), null, wheres, orders));
	}
}
