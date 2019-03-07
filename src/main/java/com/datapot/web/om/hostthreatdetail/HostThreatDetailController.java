/**
 * @工程名称：datapot-om
 * @程序包名：com.datapot.web.om
 * @程序类名：HostThreatDetailController.java
 * @创建日期：2017年12月7日
 */
package com.datapot.web.om.hostthreatdetail;

import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.datapot.contants.enums.Stage;
import com.datapot.contants.result.ResultBean;
import com.datapot.core.om.hostthreatdetail.domain.HostJoinDetailDialog;
import com.datapot.core.om.hostthreatdetail.domain.HostThreatDetailReq;
import com.datapot.core.om.hostthreatdetail.service.IHostThreatDetailService;
import com.datapot.persist.om.hostthreatdetail.domain.HostAndExternalSum;
import com.datapot.persist.om.hostthreatdetail.domain.HostJoinDetailParam;
import com.datapot.persist.om.hostthreatdetail.domain.HostJoinDetectPage;
import com.datapot.persist.support.Pager;
import com.datapot.utils.date.DateUtil;

/**
 * @功能说明：主机关联controller
 * @创建人员：wendg
 * @变更记录：<BR>
 * 1、2017年12月7日 wendg 新建类
 */
@Controller
@RequestMapping("/om/host_threat_detail")
public class HostThreatDetailController {
	private Log log = LogFactory.getLog(getClass());

	@Autowired
	private IHostThreatDetailService hostThreatDetailService;

	/**
	 * @函数名称：getInfos
	 * @创建日期：2017年12月9日
	 * @功能说明：根据主机主键分页查询关联表信息
	 * @参数说明：query HostThreatDetailReq实体
	 * @返回说明：Pager<HostJoinDetectPage>
	 */
	@RequestMapping(value = "/get_host_detail", method = RequestMethod.POST)
	public @ResponseBody ResultBean getInfos(HostThreatDetailReq query) {
		Pager<HostJoinDetectPage> page = null;
		try {
			page = hostThreatDetailService.getInfos(query.getHostThreatId(), query.getHostName(), query.getNumPerPage(),
					query.getPageNum());
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.error("HostThreatDetailController getInfos method exception : ", e);
		}
		return new ResultBean(page);
	}

	/**
	 * @函数名称：getExternalIpInfos
	 * @创建日期：2017年12月11日
	 * @功能说明：根据主机威胁ip获取相关联的主机信息
	 * @参数说明：hostThreatId 主机威胁id
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/get_host_detail_extenal", method = RequestMethod.POST)
	public @ResponseBody ResultBean getExternalIpInfos(@RequestParam("hostThreatId")String hostThreatId, @RequestParam("hostName")String hostName) {
		Integer threatId = Integer.parseInt(hostThreatId);
		List<HostJoinDetailDialog> list = hostThreatDetailService.getHostDetailByParam(threatId, hostName);
		Map<String, Object> map = new HashMap<>();
		map.put("stage", Stage.STAGE_DATA);
		map.put("infos", list);
		return new ResultBean(map);
	}

	/**
	 * @函数名称：getData
	 * @创建日期：2017年12月12日
	 * @功能说明：
	 * @参数说明：
	 * @返回说明：ResultBean
	 */
	@RequestMapping("/get_infos_port")
	public @ResponseBody ResultBean getData(HostJoinDetailParam param) {
		String endDate = null;
		String startDate = null;
		List<HostAndExternalSum> list = null;
		try {
			// 判断读取时间（1天、1周、2周、1个月）
			if (param.getTime() == 1) { // 判断为1一天
				endDate = DateUtil.getCurrentDateTime();
				startDate = DateUtil.addDateMinut(endDate, -23);
			} else if (param.getTime() == null || param.getTime() == 2) {// 判断为1周
				endDate = DateUtil.getCurrentDate();
				startDate = DateUtil.addDate(endDate, -6);
				param.setTime(2);
			} else if (param.getTime() == 3) {// 判断为2周
				endDate = DateUtil.getCurrentDate();
				startDate = DateUtil.addDate(endDate, -13);
			} else { // 判断为1个月
				endDate = DateUtil.getCurrentDate();
				Date date = DateUtil.dateAddMonth(new Date(), -1);
				startDate = DateUtil.formatDate(date, DateUtil.LONGDATE_DATE);
			}
			param.setStartDate(startDate);
			param.setEndDate(endDate);
			list = hostThreatDetailService.getInfosByPort(param);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.error("HostThreatDetailController getData method exception : ", e);
		}
		return new ResultBean(list);
	}

	/**
	 * @函数名称：getHostJoinDetail
	 * @创建日期：2017年12月12日
	 * @功能说明：根据主机ip、外部主机ip查询列表与下拉框数据
	 * @参数说明：
	 * @返回说明：String
	 */
	@RequestMapping(value = "/get_infos", method = RequestMethod.POST)
	public @ResponseBody ResultBean getHostJoinDetail(Integer hostThreatId, String externalIp, Integer port) {
		List<HostAndExternalSum> list = null;
		Map<Integer, Integer> portMap = null;
		try {
			list = hostThreatDetailService.getDataOutput(hostThreatId, externalIp, port);
			portMap = new LinkedHashMap<>();
			for (HostAndExternalSum hostAndExternalSum : list) {
				portMap.put(hostAndExternalSum.getPort(), hostAndExternalSum.getPort());
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.error("HostThreatDetailController getHostJoinDetail method exception : ", e);
		}

		Map<String, Object> map = new HashMap<String, Object>();
		map.put("portMap", portMap);
		map.put("infos", list);
		return new ResultBean(map);
	}
}
