package com.datapot.web.om.flowback;

import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.datapot.contants.http.ErrorCode;
import com.datapot.contants.result.ResultBean;
import com.datapot.core.om.flowback.entity.OctAmountHis;
import com.datapot.core.om.flowback.service.OctAmountService;
import com.datapot.utils.date.DateStartUtil;
import com.datapot.utils.date.DateUtil;
import com.google.common.base.Splitter;

@RequestMapping("om/oct")
@RestController
public class OctAmountController {
	@Autowired
	private OctAmountService octAmountService;

	/**
	 * 默认今天
	 * @param start yyyy-MM-dd HH:mm:SS
	 * @param end yyyy-MM-dd HH:mm:SS
	 * @param ips
	 * @return
	 */
	@RequestMapping("ip")
	public ResultBean getOctAmount(@RequestParam(value="start", required=false) String start, 
			@RequestParam(value="end", required=false)String end,  @RequestParam("ips")String ips){
		if(StringUtils.isBlank(ips)) {
			return new ResultBean(ErrorCode.APP_ERROR_PARAMTER, "参数异常");
		}
		long startTime = DateStartUtil.getCurrentDayStart();
		if(!StringUtils.isBlank(start)) {
			Date sd = DateUtil.strToLongDate(start.trim());
			startTime = sd.getTime();
		}
		long endtime = DateStartUtil.getCurrentMonthEnd();
		if(!StringUtils.isBlank(end)) {
			Date ed = DateUtil.strToLongDate(end);
			endtime = ed.getTime();
		}
		List<String> ipList = Splitter.on(",").trimResults().splitToList(ips);
		return new ResultBean(octAmountService.getOctAmount(startTime, endtime, ipList));
	}
	
/* 接口暂时停用，数据从es获取改为从es导入mysql，再获取（如果新接口出问题，可以回滚使用此接口）	
 * @RequestMapping("month")
	public ResultBean getMonthOctAmount(@RequestParam(required=false, value="srcip")String srcip, 
			@RequestParam(required=false, value="dstip")String dstip){
		int	interval = 24 * 60;
		long endTime = System.currentTimeMillis();
		long duration = 30L * 24 * 60 * 60 * 1000;
		long startTime = endTime - duration;
		return new ResultBean(octAmountService.getOctHistogram(startTime, endTime, interval * 60000,  "MM/dd", srcip, dstip));
	}*/
	
	@RequestMapping("month")
	public ResultBean getMonthOctAmount(@RequestParam(required=false, value="srcip")String srcip, 
			@RequestParam(required=false, value="dstip")String dstip){
		List<OctAmountHis> data = null;
		return new ResultBean(octAmountService.getFlowByIpAndSeveralDay(srcip, DateUtil.getDate(30)));
	}
	
/* 接口暂时停用，数据从es获取改为从es导入mysql，再获取（如果新接口出问题，可以回滚使用此接口）
 * @RequestMapping("week")
	public ResultBean getWeekOctAmount(@RequestParam(required=false, value="srcip")String srcip,
			@RequestParam(required=false, value="dstip")String dstip){
		int	interval = 24 * 60;
		long endTime = System.currentTimeMillis();
		long startTime = endTime - 6L * 24 * 60 * 60 * 1000;
		return new ResultBean(octAmountService.getOctHistogram(startTime, endTime, interval * 60000, "MM/dd", srcip, dstip));
	}*/
	
	@RequestMapping("week")
	public ResultBean getWeekOctAmount(@RequestParam(required=false, value="srcip")String srcip,
			@RequestParam(required=false, value="dstip")String dstip){
		return new ResultBean(octAmountService.getFlowByIpAndSeveralDay(srcip, DateUtil.getDate(1*7)));
	}
	
/* 接口暂时停用，数据从es获取改为从es导入mysql，再获取（如果新接口出问题，可以回滚使用此接口）
 * @RequestMapping("2week")
	public ResultBean get2WeekOctAmount(@RequestParam(required=false, value="srcip")String srcip,
			@RequestParam(required=false, value="dstip")String dstip){
		int	interval = 24 * 60;
		long endTime = System.currentTimeMillis();
		long startTime = endTime - 13L * 24 * 60 * 60 * 1000;
		return new ResultBean(octAmountService.getOctHistogram(startTime, endTime, interval * 60000, "MM/dd", srcip, dstip));
	}*/
	
	@RequestMapping("2week")
	public ResultBean get2WeekOctAmount(@RequestParam(required=false, value="srcip")String srcip,
			@RequestParam(required=false, value="dstip")String dstip){
		return new ResultBean(octAmountService.getFlowByIpAndSeveralDay(srcip, DateUtil.getDate(2*7)));
	}
	
/*	接口暂时停用，数据从es获取改为从es导入mysql，再获取（如果新接口出问题，可以回滚使用此接口）
 * @RequestMapping("day")
	public ResultBean getDayOctAmount(@RequestParam(required=false, value="srcip")String srcip,
			@RequestParam(required=false, value="dstip")String dstip){
		int	interval = 1 * 60;
		long endTime =  System.currentTimeMillis();
		long startTime = DateStartUtil.getCurrentDayStart();
		List<OctAmountHis> data = octAmountService.getOctHistogram(startTime, endTime, interval * 60000, "MM/dd HH", srcip, dstip);
		return new ResultBean(data);
	}*/
	@RequestMapping("day")
	public ResultBean getDayOctAmount(@RequestParam(required=false, value="srcip")String srcip,
			@RequestParam(required=false, value="dstip")String dstip){
		return new ResultBean(octAmountService.getFlowByIpAndOneDay(srcip, DateUtil.getCurrentDate()));
	}
	
/*	接口暂时停用，数据从es获取改为从es导入mysql，再获取（如果新接口出问题，可以回滚使用此接口）
 *  @RequestMapping("out")
	public ResultBean getOutTop(){
		return new ResultBean(octAmountService.getOutTop());
	}
	@RequestMapping("in")
	public ResultBean getInTop(){
		return new ResultBean(octAmountService.getInTop());
	}*/ 
	
	@RequestMapping("out")
	public ResultBean getNewOutTop() {
		return new ResultBean(octAmountService.getNewOutTop());
	}
	
	@RequestMapping("in")
	public ResultBean getNewInTop() {
		return new ResultBean(octAmountService.getNewInTop());
	}
	
/* 接口暂时停用，数据从es获取改为从es导入mysql，再获取（如果新接口出问题，可以回滚使用此接口）
 * @RequestMapping("his")
	public ResultBean getOctHistogram(@RequestParam(value="start",required=false )String start,
			@RequestParam(value = "end" ,required=false)String end, 
			@RequestParam(value = "interval",required=false)Integer interval, 
			@RequestParam(required=false, value="srcip")String srcip, 
			@RequestParam(required=false, value="dstip")String dstip,
			@RequestParam(required=false, value="format")String format){
		if(interval == null || interval == 0 ) {
			interval = 1 * 60;
		}
		long startTime = DateStartUtil.getCurrentDayStart();
		Date sd =  null;
		if(!StringUtils.isBlank(start)) {
			sd = DateUtil.strToDate(start.trim(), DateUtil.LONGDATE_DATE);
			startTime = sd.getTime();
		}
		
		long endtime = System.currentTimeMillis();
		if(!StringUtils.isBlank(end)) {
			Date ed = DateUtil.strToDate(end.trim(), DateUtil.LONGDATE_DATE);
			endtime = ed.getTime();
		}else {
			endtime = getEndTime(sd);
		}
		return new ResultBean(octAmountService.getOctHistogram(startTime, endtime, interval * 60000, format, srcip, dstip));
	}*/
	
	@RequestMapping("his")
	public ResultBean getOctHistogram(@RequestParam(value="start",required=false )String start,
			@RequestParam(value = "end" ,required=false)String end, 
			@RequestParam(value = "interval",required=false)Integer interval, 
			@RequestParam(required=false, value="srcip")String srcip, 
			@RequestParam(required=false, value="dstip")String dstip,
			@RequestParam(required=false, value="format")String format){
		//原ip跟目标ip都一样，逻辑已经判断出内外网IP
		String ip = srcip;
		ip = dstip;
		return new ResultBean(octAmountService.getFlowByIpAndOneDay(ip, start));
	}
	
	@SuppressWarnings("deprecation")
	private long getEndTime(Date start) {
		Date now = new Date();
		if(start == null) {
			return now.getTime();
		}
		if(start.getDate() == now.getDate() &&  start.getMonth() == now.getMonth() && start.getYear() == now.getYear()) {
			return now.getTime();
		}
		
		return start.getTime() + 24L * 60 * 60 * 1000 + 1;
	}
}
