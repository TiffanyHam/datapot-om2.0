/**
 * @工程名称：datapot-om
 * @程序包名：com.datapot.om.web
 * @程序类名：CompanyIpController.java
 * @创建日期：2017年9月8日
 */
package com.datapot.web.om.companyip;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.jsoup.helper.StringUtil;
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
import com.datapot.core.om.companyip.domain.CompanyIpReq;
import com.datapot.core.om.companyip.service.ICompanyIpService;
import com.datapot.core.sys.sysoffice.service.ISysOfficeService;
import com.datapot.persist.om.companyip.domain.CompanyIp;
import com.datapot.persist.support.Order;
import com.datapot.persist.support.Pager;
import com.datapot.persist.support.Where;
import com.datapot.persist.sys.sysoffice.domain.SysOffice;
import com.datapot.utils.ip.IpUtil;

/**
 * @功能说明：内网ip控制类
 * @创建人员：wendg
 * @变更记录：<BR> 1、2017年9月8日 wendg 新建类
 */
@Controller
@RequestMapping(value = "/om/company_ip")
public class CompanyIpController {

	private final Logger log = LoggerFactory.getLogger(getClass());

	@Autowired
	public ICompanyIpService companyIpService;

	@Autowired
	private ISysOfficeService sysOfficeService;

	/**
	 * 
	 * @函数名称：index
	 * @创建日期：2017年4月10日
	 * @功能说明：内网ip管理加载页面
	 * @参数说明：model 用于传参的模型
	 * @参数说明：query 查询条件
	 * @参数说明：nti 菜单id
	 * @返回说明：String
	 */
	@RequestMapping(value = "/index")
	public String index(Model model, CompanyIpReq querys) {
		List<Order> orders = this.generateOrders(querys);
		List<Where> wheres = new ArrayList<Where>();
		Map<String, String> officeMap = new LinkedHashMap<>();
		Pager<CompanyIp> pager = null;
		try {
			// 获取部门分页信息
			pager = companyIpService.getInfos(querys.getNumPerPage(), querys.getPageNum(), null, wheres, orders);

			List<SysOffice> offices = sysOfficeService.getInfos();

			for (SysOffice sysOffice : offices) {
				officeMap.put(sysOffice.getOfficeId() + "", sysOffice.getOfficeName());
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.error("CompanyIpController index method exception : ", e);
		}
		model.addAttribute("sysOffice", officeMap);
		model.addAttribute("querys", querys);
		model.addAttribute("infos", pager);

		return "/setting/company_ip";
	}

	/**
	 * 
	 * @函数名称：index
	 * @创建日期：2017年4月10日
	 * @功能说明：内网ip管理加载页面
	 * @参数说明：model 用于传参的模型
	 * @参数说明：query 查询条件
	 * @参数说明：nti 菜单id
	 * @返回说明：String
	 */
	@RequestMapping(value = "/query")
	public @ResponseBody ResultBean query(CompanyIpReq querys) {
		List<Order> orders = this.generateOrders(querys);
		List<Where> wheres = new ArrayList<Where>();
		if (StringUtils.isNotEmpty(querys.getStartIpQ())) {
			wheres.add(new Where("StartIp", querys.getStartIpQ()));
		}
		if (StringUtils.isNotEmpty(querys.getEndIpQ())) {
			wheres.add(new Where("EndIp", querys.getEndIpQ()));
		}
		if (querys.getOfficeIdQ() != null) {
			wheres.add(new Where("OfficeId", querys.getOfficeIdQ()));
		}
		Pager<CompanyIp> pager = null;
		try {
			// 获取部门分页信息
			pager = companyIpService.getInfos(querys.getNumPerPage(), querys.getPageNum(), null, wheres, orders);

		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.error("CompanyIpController query method exception : ", e);
		}

		return new ResultBean(pager);
	}

	/**
	 * @函数名称：initOrders
	 * @创建日期：2017年4月10日
	 * @功能说明：初始排序信息集合
	 * @参数说明：query 查询条件
	 * @返回说明：List<Order>
	 */
	private List<Order> generateOrders(CompanyIpReq query) {
		List<Order> orders = new ArrayList<Order>();
		orders.add(new Order("Id", "DESC"));
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
	@RequestMapping(value = "/edit")
	public String edit(Model model, Integer id) {
		// 如果部门id为空则是新增页面，否则为修改
		if (id != null && id > 0) {
			CompanyIp companyIp = companyIpService.getInfo(id);
			model.addAttribute("info", companyIp);
		} else {
			model.addAttribute("info", null);
		}
		return "/sys_config_manage/company_ip/edit";
	}

	/**
	 * @函数名称：save
	 * @创建日期：2017年4月11日
	 * @功能说明：内网IP信息与更新内网IP信息
	 * @参数说明：request 请求对象
	 * @参数说明：companyIp 内网IP对象
	 * @参数说明：nti 菜单id
	 * @返回说明：ModelAndView
	 */
	@RequestMapping(value = "/save")
	public @ResponseBody ResultBean save(HttpServletRequest request, CompanyIp companyIp, Integer nti) {

		String message = "";
		String opName = "";
		try {
			companyIp.setStartIpValue(IpUtil.ipToLong(companyIp.getStartIp()));
			companyIp.setEndIpValue(IpUtil.ipToLong(companyIp.getEndIp()));
			
			Integer isOffice = companyIpService.findUniqueOfficeByIp(companyIp);
			
			// 如果部门id为空则是执行新增，否则为修改
			if (null == companyIp.getId() || companyIp.getId() < 0) {
				opName = "新增";
				if(!(checkIp(companyIp.getStartIp()) && checkIp(companyIp.getEndIp()))) {
					return new ResultBean(ResultBean.INPUT_ERROR, "新增失败，请输入正确的IP格式");
				}else if(companyIp.getStartIpValue() >= companyIp.getEndIpValue()) {
					return new ResultBean(ResultBean.INPUT_ERROR, "新增失败，请重新设置IP");
				}else if(isOffice > 0) {
					return new ResultBean(ResultBean.INPUT_ERROR, "新增失败，该网段与现有网段重合");
				}else {
					message = companyIpService.save(companyIp);
				}
			}else{
				opName = "修改";
				if(!(checkIp(companyIp.getStartIp()) && checkIp(companyIp.getEndIp()))) {
					return new ResultBean(ResultBean.INPUT_ERROR, "新增失败，请输入正确的IP格式");
				}else if(companyIp.getStartIpValue() >= companyIp.getEndIpValue()) {
					return new ResultBean(ResultBean.INPUT_ERROR, "新增失败，请重新设置IP");
				}else if(isOffice > 0) {
					return new ResultBean(ResultBean.INPUT_ERROR, "新增失败，该网段与现有网段重合");
				}else {
					message = companyIpService.update(companyIp);
				}
			}
			return new ResultBean(ResultBean.RETCODE_SUCCESS, message);
		} catch (DuplicateKeyException duplicateKeyException) {
			log.error("[CompanyIp] - " + opName + "exception - ", duplicateKeyException);
			message = OpResultConstants.EXIST_SAME_DATA + "IP";
			return new ResultBean(ResultBean.RETCODE_FAIL, message);
		} catch (Exception e) {
			log.error("[CompanyIp] - " + opName + "exception - ", e);
			return new ResultBean(ResultBean.RETCODE_FAIL, OpResultConstants.OP_EXCEPTION);
		}
	}
	
	/**
	 * 校验合法IP
	 * @return
	 */
	public boolean checkIp(String ip) {
		String regEX = "(?=(\\b|\\D))(((\\d{1,2})|(1\\d{1,2})|(2[0-4]\\d)|(25[0-5]))\\.){3}((\\d{1,2})|(1\\d{1,2})|(2[0-4]\\d)|(25[0-5]))(?=(\\b|\\D))";
		Pattern pattern = Pattern.compile(regEX);
		if(!StringUtil.isBlank(ip)) {
			return pattern.matcher(ip).find();
		}
		return false;
	}
	
	/**
	 * @函数名称：delete
	 * @创建日期：2017年4月11日
	 * @功能说明：执行删除部门操作
	 * @参数说明：request 请求对象
	 * @参数说明：nti 菜单id
	 * @参数说明：deptId 部门ID
	 * @返回说明：ModelAndView
	 */
	@RequestMapping(value = "/delete", method = RequestMethod.POST)
	public @ResponseBody ResultBean delete(HttpServletRequest request, Integer id) {
		try {
			String message = "";
			message = companyIpService.delete(id);
			// 此处为返回页面并刷新数据
			return new ResultBean(ResultBean.RETCODE_SUCCESS, message);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.error("CompanyIp delete method exception - ", e);
			return new ResultBean(ResultBean.RETCODE_FAIL, OpResultConstants.OP_EXCEPTION);
		}
	}

	/**
	 * @函数名称：syncDataToRedis
	 * @创建日期：2017年5月26日
	 * @功能说明：同步数据到redis
	 * @参数说明：
	 * @返回说明：void
	 */
	@RequestMapping(value = "/sync_data", produces = "text/plain;charset=UTF-8")
	public @ResponseBody Object syncDataToRedis() {
		String message;
		try {
			message = companyIpService.syncDataToRedis();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			message = "数据同步失败，请稍后重试或联系管理！";
		}
		return message;
	}
}
