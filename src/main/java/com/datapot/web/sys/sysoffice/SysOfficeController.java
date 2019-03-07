/**
 * @工程名称：datapot-om
 * @程序包名：com.datapot.web.sys.sysoffice
 * @程序类名：SysOfficeController.java
 * @创建日期：2017年10月30日
 */
package com.datapot.web.sys.sysoffice;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.datapot.contants.operation.OpResultConstants;
import com.datapot.contants.result.ResultBean;
import com.datapot.core.om.companyip.service.ICompanyIpService;
import com.datapot.core.om.physicalhosts.service.IPhysicalHostsService;
import com.datapot.core.sys.sysoffice.domain.SysOfficeReq;
import com.datapot.core.sys.sysoffice.service.ISysOfficeService;
import com.datapot.persist.support.Order;
import com.datapot.persist.support.Pager;
import com.datapot.persist.support.Where;
import com.datapot.persist.sys.sysoffice.domain.SysOffice;
import com.datapot.web.base.BaseController;

/**
 * @功能说明：
 * @创建人员：wendg
 * @变更记录：<BR> 1、2017年10月30日 wendg 新建类
 */
@Controller
@RequestMapping("/sys/sys_office")
public class SysOfficeController extends BaseController {

	private Log log = LogFactory.getLog(getClass());

	@Autowired
	private ISysOfficeService sysOfficeService;

	@Autowired
	private IPhysicalHostsService hostService;

	@Autowired
	private ICompanyIpService ipService;

	/**
	 * @函数名称：index
	 * @创建日期：2017年10月30日
	 * @功能说明：分页查询
	 * @参数说明：
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/index")
	public String index(Model model, SysOfficeReq sysOfficeReq) {
		List<Order> orders = this.generateOrders();
		Pager<SysOffice> pager = null;
		try {
			// 获取部门分页信息
			pager = sysOfficeService.getInfos(sysOfficeReq.getNumPerPage(), sysOfficeReq.getPageNum(), null, null, orders);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.info("The dept information query is wrong");
		}
		model.addAttribute("infos", pager);
		return "manage/sys_office";
	}

	/**
	 * @函数名称：index
	 * @创建日期：2017年10月30日
	 * @功能说明：分页查询
	 * @参数说明：
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/query")
	public @ResponseBody ResultBean query(SysOfficeReq sysOfficeReq) {
		List<Order> orders = this.generateOrders();
		Pager<SysOffice> pager = null;
		try {
			// 获取部门分页信息
			pager = sysOfficeService.getInfos(sysOfficeReq.getNumPerPage(), sysOfficeReq.getPageNum(), null, null, orders);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.info("The sysOffice information query is wrong");
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
	private List<Order> generateOrders() {
		List<Order> orders = new ArrayList<Order>();
		orders.add(new Order("OfficeId", "DESC"));
		return orders;
	}

	/**
	 * @函数名称：getInfos
	 * @创建日期：2017年10月30日
	 * @功能说明：获取所有的分支机构信息
	 * @参数说明：
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/find_all")
	public @ResponseBody ResultBean getInfos() {
		List<SysOffice> list = sysOfficeService.getInfos();
		Map<String, Object> map = new HashMap<>();
		map.put("sysOffices", list);
		return new ResultBean(map);
	}

	/**
	 * @函数名称：save
	 * @创建日期：2017年10月30日
	 * @功能说明：保存/修改分之机构信息
	 * @参数说明：sysOffice SysOffice对象
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/save", method = RequestMethod.POST)
	public @ResponseBody ResultBean save(SysOffice sysOffice) {

		String message = "";
		// 表单验证
		if (StringUtils.isEmpty(sysOffice.getOfficeName())) {
			return new ResultBean(ResultBean.RETCODE_FAIL, "机构名称不能为空");
		}
		ResultBean bean = new ResultBean();
		try {
			// 如果传入分支机构为空，则为新增否者为修改
			if (sysOffice.getOfficeId() == null) {
				sysOfficeService.save(sysOffice);
				message = OpResultConstants.SAVE_SUCCESSED;
			} else {
				message = sysOfficeService.update(sysOffice);
			}
			// 此处为返回页面并刷新数据
			return new ResultBean(ResultBean.RETCODE_SUCCESS, message);
		} catch (DuplicateKeyException e) {
			log.error("SysOfficeController save method exception : ", e);
			message = "操作失败，已存在相同的分支机构名称";
			return new ResultBean(ResultBean.RETCODE_FAIL, message);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.error("SysOfficeController save method exception : ", e);
			// 此处为返回页面并刷新数据
			message = "操作失败，请稍后重试或者联系管理员";
			return new ResultBean(ResultBean.RETCODE_FAIL, message);
		}
	}

	/**
	 * @函数名称：delete
	 * @创建日期：2017年10月31日
	 * @功能说明：删除分之机构信息
	 * @参数说明：
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/delete", method = RequestMethod.POST)
	public @ResponseBody ResultBean delete(Integer officeId) {

		String message = "";
		try {
			List<Where> wheres = new ArrayList<Where>();
			wheres.add(new Where("OfficeId", officeId));
			if (hostService.countSysOffice(wheres) > 0) {
				return new ResultBean(ResultBean.RETCODE_FAIL, OpResultConstants.SYSOFFICE_USED);
			}
			if (ipService.countSysOffice(wheres) > 0) {
				return new ResultBean(ResultBean.RETCODE_FAIL, OpResultConstants.SYSOFFICE_USED);
			}
			message = sysOfficeService.delete(officeId);
			if (message.equals(OpResultConstants.SYSOFFICE_USED)) {
				return new ResultBean(ResultBean.RETCODE_FAIL, OpResultConstants.SYSOFFICE_USED);
			}
			// 此处为返回页面并刷新数据
			return new ResultBean(ResultBean.RETCODE_SUCCESS, message);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.error("SysOfficeController save method exception : ", e);
			// 此处为返回页面并刷新数据
			message = "操作失败，请稍后重试或者联系管理员";
			return new ResultBean(ResultBean.RETCODE_FAIL, message);
		}
	}

}
