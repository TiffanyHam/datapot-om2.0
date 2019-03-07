/**
 * @工程名称：datapot-om
 * @程序包名：com.datapot.om.web
 * @程序类名：SysLogController.java
 * @创建日期：2017年9月7日
 */
package com.datapot.web.sys.sysoplog;

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

import com.datapot.contants.enums.BoolStatus;
import com.datapot.contants.enums.LogType;
import com.datapot.contants.result.ResultBean;
import com.datapot.core.sys.sysoplog.domain.SysOpLogReq;
import com.datapot.core.sys.sysoplog.service.ISysOpLogService;
import com.datapot.persist.support.Order;
import com.datapot.persist.support.Pager;
import com.datapot.persist.support.Where;
import com.datapot.persist.sys.sysoplog.domain.SysOpLog;
import com.datapot.utils.date.DateUtil;
import com.datapot.web.base.BaseController;

/**
 * @功能说明：系统日志控制类
 * @创建人员：luxr
 * @变更记录：<BR> 1、2017年9月13日 luxr 新建类
 */
@Controller
@RequestMapping("sys/log")
public class SysOpLogController extends BaseController {
	private final Logger log = LoggerFactory.getLogger(getClass());

	@Autowired
	private ISysOpLogService sysOpLogService;

	/**
	 * @函数名称：index
	 * @创建日期：2017年11月18日
	 * @功能说明：操作日志查询首页
	 * @参数说明：
	 * @返回说明：String
	 */
	@RequestMapping(value = "/index")
	public String index(SysOpLogReq sysOpLogReq, Model model) {
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
					throw new Exception("开始时间不能大于结束时间");
				}
			}
			List<Where> wheres = generateWhere(sysOpLogReq);
			Pager<SysOpLog> pager = sysOpLogService.querySysOpLogList(wheres, sysOpLogReq);
			model.addAttribute("sysOpLogReq", sysOpLogReq);
			model.addAttribute("logTypes", LogType.LOG_TYPE);
			model.addAttribute("boolStatus", BoolStatus.BOOL_STATUS);
			model.addAttribute("infos", pager);
		} catch (Exception e) {
			log.error(e.getMessage());
			e.printStackTrace();
		}
		return "manage/sys_op_log";
	}

	/**
	 * @函数名称：logQuery
	 * @创建日期：2017年11月18日
	 * @功能说明：根据条件查询操作日志信息
	 * @参数说明：
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/log_query")
	public @ResponseBody ResultBean logQuery(SysOpLogReq sysOpLogReq, Model model) {
		Pager<SysOpLog> pager = null;
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
			List<Where> wheres = generateWhere(sysOpLogReq);
			pager = sysOpLogService.querySysOpLogList(wheres, sysOpLogReq);
		} catch (Exception e) {
			log.error(e.getMessage());
			e.printStackTrace();
		}
		return new ResultBean(pager);
	}

	/**
	 * @函数名称：getOpLogList<br>
	 * @创建日期：2016年6月6日<br>
	 * @功能说明： 系统日志查询首页<br>
	 * @参数说明： sysLogQ 查询条件<br>
	 * @参数说明： nti 菜单ID<br>
	 * @返回说明：String jsp页面
	 */
	@RequestMapping(value = "/index1")
	public @ResponseBody ResultBean index1(SysOpLogReq sysOpLogReq) {
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

			Pager<SysOpLog> pager = sysOpLogService.getOpLogs(generateWhere(sysOpLogReq), generateOrders(sysOpLogReq),
					sysOpLogReq.getNumPerPage(), sysOpLogReq.getPageNum());
			if (null == pager) {
				return new ResultBean(ResultBean.RETCODE_ELSEMSG, ResultBean.MSG_BLANK);
			} else {
				return new ResultBean(pager);
			}

		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.error(e.getMessage());
			e.printStackTrace();
		}
		return null;

	}

	/**
	 * @函数名称：getOpLogParameter<br>
	 * @创建日期：2016年6月8日<br>
	 * @功能说明： 根据日志id获取日志参数<br>
	 * @参数说明：logId 日志Id <br>
	 * @返回说明：String
	 */
	@RequestMapping(value = "log_parameter")
	public @ResponseBody ResultBean getOpLogParameter(Long logId) {
		List<String> fields = new ArrayList<String>();
		fields.add("PARAMETER");
		String sysOpLog = sysOpLogService.getOpLog(logId, fields).getParameter();
		return new ResultBean(sysOpLog);
	}

	/**
	 * @函数名称：generateOrders<br>
	 * @创建日期：2016年6月6日<br>
	 * @功能说明：初始排序信息集合 <br>
	 * @参数说明： sysLogQ 排序条件<br>
	 * @返回说明：List<Order>
	 */
	private List<Order> generateOrders(SysOpLogReq sysOpLogReq) {
		List<Order> orders = new ArrayList<Order>();
		orders.add(new Order("LogId", "DESC"));
		return orders;
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

}
