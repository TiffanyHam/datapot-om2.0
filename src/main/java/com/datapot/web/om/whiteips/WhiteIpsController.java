/**
 * @工程名称：datapot-om
 * @程序包名：com.datapot.web.sys.whiteips
 * @程序类名：WhiteIpsController.java
 * @创建日期：2017年11月15日
 */
package com.datapot.web.om.whiteips;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.datapot.contants.exception.AppException;
import com.datapot.contants.http.ErrorCode;
import com.datapot.contants.result.ResultBean;
import com.datapot.core.om.whiteips.domain.WhiteIpsQuery;
import com.datapot.core.om.whiteips.service.IWhitesIpsService;
import com.datapot.persist.om.whiteips.domain.WhiteIps;
import com.datapot.persist.support.Order;
import com.datapot.persist.support.Pager;
import com.datapot.persist.support.Where;
import com.datapot.web.base.BaseController;

/**
 * @功能说明：Ip白名单控制类
 * @创建人员：Luxr
 * @变更记录：<BR> 1、2017年11月15日 Luxr 新建类
 */
@Controller
@RequestMapping("/om/white_ips")
public class WhiteIpsController extends BaseController {

	private final Logger log = LoggerFactory.getLogger(getClass());

	@Autowired
	IWhitesIpsService whiteIpsService;

	/**
	 * 
	 * @函数名称：index
	 * @创建日期：2017年4月10日
	 * @功能说明：IP白名单管理加载页面
	 * @参数说明：query 查询条件
	 * @返回说明：String
	 */
	@RequestMapping(value = "/index")
	public String index(Model model, WhiteIpsQuery query) {
		String sortName = query.getSortName();
		query.setNumPerPage(10);
		List<Order> orders = new ArrayList<Order>();
		if (StringUtils.isEmpty(sortName)) {
			orders.add(new Order("AddTime", "DESC"));
			orders.add(new Order("Id", "DESC"));
		} else {
			String order = query.getOrder().toUpperCase();
			String newStr = sortName.substring(0, 1).toUpperCase() + sortName.substring(1);
			orders.add(new Order(newStr, order));
		}
		List<Where> wheres = new ArrayList<Where>();
		if (StringUtils.isNotEmpty(query.getIp())) {
			Where where = new Where("Ip", query.getIp());
			wheres.add(where);
		}
		Pager<WhiteIps> pager = null;
		try {
			// 获取用户账户分页信息
			pager = whiteIpsService.getInfos(query.getNumPerPage(), query.getPageNum(), null, wheres, orders);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.info("The WhiteIps information query is wrong");
		}
		model.addAttribute("infos", pager);
		return "manage/white_ips";
	}

	/**
	 * @函数名称：query
	 * @创建日期：2017年11月15日
	 * @功能说明：查询Ip白名单
	 * @参数说明：
	 * @返回说明：String
	 */
	@RequestMapping(value = "/query")
	public @ResponseBody ResultBean query(Model model, WhiteIpsQuery query) {
		String sortName = query.getSortName();
		if(query.getNumPerPage() == 0) {
			query.setNumPerPage(10);
		}
		
		List<Order> orders = new ArrayList<Order>();
		if (StringUtils.isEmpty(sortName)) {
			orders.add(new Order("AddTime", "DESC"));
			orders.add(new Order("Id", "DESC"));
		} else {
			String order = query.getOrder().toUpperCase();
			String newStr = sortName.substring(0, 1).toUpperCase() + sortName.substring(1);
			orders.add(new Order(newStr, order));
		}
		List<Where> wheres = new ArrayList<Where>();
		if (StringUtils.isNotEmpty(query.getIp())) {
			Where where = new Where("Ip", query.getIp());
			wheres.add(where);
		}
		Pager<WhiteIps> pager = null;
		try {
			// 获取用户账户分页信息
			pager = whiteIpsService.getInfos(query.getNumPerPage(), query.getPageNum(), null, wheres, orders);
		} catch (Exception e) {
			log.info("The WhiteIps information query is wrong");
		}
		return new ResultBean(pager);
	}
	
	@RequestMapping(value = "/save")
	@ResponseBody
	public ResultBean save(String ip) {
		if(StringUtils.isBlank(ip)) {
			return new ResultBean(ErrorCode.APP_ERROR_PARAMTER, "请输入ip");
		}
		try {
			whiteIpsService.save(ip);
			return new ResultBean();
		}catch(AppException e) {
			return new ResultBean(ErrorCode.APP_ERROR_APPERROR, e.getMessage());
		}catch(Exception e) {
			return new ResultBean(ErrorCode.APP_ERROR_APPERROR, "操作异常");
		}
	}
	
	@RequestMapping(value = "/delete")
	@ResponseBody
	public ResultBean delete(String ip) {
		try {
			whiteIpsService.delete(ip);
			return new ResultBean();
		}catch(AppException e) {
			return new ResultBean(ErrorCode.APP_ERROR_APPERROR, e.getMessage());
		}catch(Exception e) {
			return new ResultBean(ErrorCode.APP_ERROR_APPERROR, "操作异常");
		}
	}
}
