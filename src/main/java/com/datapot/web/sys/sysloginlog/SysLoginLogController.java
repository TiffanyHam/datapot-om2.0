/**
 * @工程名称：datapot-om
 * @程序包名：com.datapot.om.web
 * @程序类名：SysLoginlog.java
 * @创建日期：2017年9月13日
 */
package com.datapot.web.sys.sysloginlog;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.datapot.contants.enums.BoolStatus;
import com.datapot.contants.enums.LogType;
import com.datapot.contants.result.ResultBean;
import com.datapot.core.sys.sysloginlog.domain.SysLoginLogReq;
import com.datapot.core.sys.sysloginlog.service.ISysLoginLogService;
import com.datapot.core.sys.sysoplog.domain.SysOpLogReq;
import com.datapot.persist.support.Order;
import com.datapot.persist.support.Pager;
import com.datapot.persist.support.Where;
import com.datapot.persist.sys.sysloginlog.domain.SysLoginLog;
import com.datapot.persist.sys.sysoplog.domain.SysOpLog;
import com.datapot.utils.date.DateUtil;
import com.datapot.web.base.BaseController;

/**
 * @功能说明：系统登录日志Controller
 * @创建人员：luxr
 * @变更记录：<BR> 1、2017年9月13日 luxr 新建类
 */
@Controller
@RequestMapping("sys/login_log")
public class SysLoginLogController extends BaseController {

	private Log log = LogFactory.getLog(getClass());

	@Autowired
	private ISysLoginLogService sysLoginLogService;
	
	/**
	 * @函数名称：logQuery
	 * @创建日期：2017年11月18日
	 * @功能说明：根据条件查询登录日志信息
	 * @参数说明：
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value="/login_query")
	public @ResponseBody ResultBean logQuery(SysOpLogReq sysOpLogReq,Model model){
		Pager<SysLoginLog> pager = null;
		try {
			String currentDate = DateUtil.getCurrentDate();
			if (StringUtils.isEmpty(sysOpLogReq.getBeginLogDate())) {
				// 如果获得开始时间为空，则取当前系统时间
				sysOpLogReq.setBeginLogDate(currentDate);
			}
			if (StringUtils.isEmpty(sysOpLogReq.getEndLogDate())) {
				// 如果获得结束时间为空，则取当前系统时间
				sysOpLogReq.setEndLogDate(currentDate);
			}

			if (StringUtils.isNotEmpty(sysOpLogReq.getBeginLogDate()) && StringUtils.isNotEmpty(sysOpLogReq.getEndLogDate())) {
				if (DateUtil.getDiffDate(sysOpLogReq.getBeginLogDate(), sysOpLogReq.getEndLogDate()) < 0) {
					return new ResultBean(ResultBean.INPUT_ERROR, "开始时间不能大于结束时间");
				}
			}
			
			pager = sysLoginLogService.querySysLoginLogList(generateWhere(sysOpLogReq),sysOpLogReq);
		} catch (Exception e) {
			log.error(e.getMessage());
			e.printStackTrace();
		}
		return new ResultBean(pager);
	}
	
	/**
	 * @函数名称：generateWhere<br>
	 * @创建日期：2016年6月12日<br>
	 * @功能说明：封装 Where查询条件<br>
	 * @参数说明： sysLogQ 查询条件<br>
	 * @返回说明：List<Where>
	 */
	public List<Where> generateWhere(SysOpLogReq sysOpLogReq) {

		List<Where> wheres = new ArrayList<Where>();
		if (null != sysOpLogReq) {

			if (StringUtils.isNotEmpty(sysOpLogReq.getUserName())) {
				wheres.add(new Where("UserName", "LIKE", "%" + sysOpLogReq.getUserName().trim() + "%"));
			}
			wheres.add(new Where("LogDate", ">=", sysOpLogReq.getBeginLogDate() + " 00:00:00"));
			wheres.add(new Where("LogDate", "<=", sysOpLogReq.getEndLogDate() + " 23:59:59"));

		}
		return wheres;
	}

	/**
	 * @函数名称：index
	 * @创建日期：2017年9月22日
	 * @功能说明：系统登录日志首页
	 * @参数说明：SysLoginLogQ query 查询条件
	 * @参数说明：nti 菜单ID
	 * @返回说明：ModelAndView
	 */
	@RequestMapping(value = "/index/{nti}")
	public ModelAndView index(Model model, SysLoginLogReq query, @PathVariable("nti") String nti) {
		List<Order> orders = this.generateOrders(query);
		List<Where> wheres = new ArrayList<Where>();

		// 如果用户名不为空就执行模糊查
		if (StringUtils.isNotEmpty(query.getUserNameQ())) {
			wheres.add(new Where("UserName", "LIKE", "%" + query.getUserNameQ() + "%"));
		}
		// 判断登录登出类型
		if (query.getLogTypeQ() != null) {
			wheres.add(new Where("LogType", query.getLogTypeQ()));
		}
		// 判断是否成功
		if (query.getIsSuccessQ() != null) {
			wheres.add(new Where("IsSuccess", query.getIsSuccessQ()));
		}

		String currentDate = DateUtil.getCurrentDate();
		if (StringUtils.isEmpty(query.getStartLogDateQ())) {
			// 如果获得开始时间为空，则取当前系统时间
			query.setStartLogDateQ(currentDate);
		} else {
			wheres.add(new Where("LogDate", ">=", query.getStartLogDateQ() + " 00:00:00"));
		}

		if (StringUtils.isEmpty(query.getEndLogDateQ())) {
			// 如果获得结束时间为空，则取当前系统时间
			query.setEndLogDateQ(currentDate);
		} else {
			wheres.add(new Where("LogDate", "<=", query.getEndLogDateQ() + " 23:59:59"));
		}

		if (StringUtils.isNotEmpty(query.getStartLogDateQ()) && StringUtils.isNotEmpty(query.getEndLogDateQ())) {
			if (DateUtil.getDiffDate(query.getStartLogDateQ(), query.getEndLogDateQ()) < 0) {
				return ajaxDoneError("开始时间不能大于结束时间");
			}
			wheres.add(new Where("LogDate", ">=", query.getStartLogDateQ() + " 00:00:00"));
			wheres.add(new Where("LogDate", "<=", query.getEndLogDateQ() + " 23:59:59"));
		}

		Pager<SysLoginLog> pager = null;
		try {
			// 获取部门分页信息
			pager = sysLoginLogService.getInfos(query.getNumPerPage(), query.getPageNum(), null, wheres, orders);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.error("The paging query system logs incorrectly:", e);
		}
		model.addAttribute("querys", query);
		model.addAttribute("infos", pager);
		model.addAttribute("nti", nti);
		model.addAttribute("logType", LogType.LOG_TYPE);
		model.addAttribute("boolStatus", BoolStatus.BOOL_STATUS);
		return new ModelAndView("/sys/login_log/index");
	}

	/**
	 * @函数名称：initOrders
	 * @创建日期：2017年4月10日
	 * @功能说明：初始排序信息集合
	 * @参数说明：query 查询条件
	 * @返回说明：List<Order>
	 */
	private List<Order> generateOrders(SysLoginLogReq query) {
		List<Order> orders = new ArrayList<Order>();
		orders.add(new Order("LogId", "ASC"));
		return orders;
	}

	/**
	 * @函数名称：getInfo
	 * @创建日期：2017年4月20日
	 * @功能说明：显示操作结果信息
	 * @参数说明：logId：登录登出日志实体id
	 * @返回说明：String
	 */
	@RequestMapping("/show_detail")
	public String getInfo(Model model, Integer logId) {
		SysLoginLog log = sysLoginLogService.getInfo(logId);
		model.addAttribute("logParamaters", log.getResultMsg());
		return "/sys/login_log/show_detail";
	}
}
