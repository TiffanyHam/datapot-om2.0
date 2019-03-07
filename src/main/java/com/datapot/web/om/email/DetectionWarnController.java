package com.datapot.web.om.email;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.datapot.contants.exception.AppException;
import com.datapot.contants.http.ErrorCode;
import com.datapot.contants.result.ResultBean;
import com.datapot.persist.support.Order;
import com.datapot.utils.email.EmailCheckUtil;
import com.datapot.web.om.email.constant.FrequencyType;
import com.datapot.web.om.email.dto.UpdateEmailReq;
import com.datapot.web.om.email.emailfrequency.domain.EmailFrequency;
import com.datapot.web.om.email.emailfrequency.service.EmailFrequencyService;
import com.datapot.web.om.email.emailfrom.domain.EmailFrom;
import com.datapot.web.om.email.emailfrom.service.EmailFromService;
import com.datapot.web.om.email.emailto.domain.EmailTo;
import com.datapot.web.om.email.emailto.service.EmailToService;
import com.google.common.collect.Lists;

import groovy.util.logging.Slf4j;

@RestController
@RequestMapping("/om/warn")
@Slf4j
public class DetectionWarnController {
	private Logger log = LoggerFactory.getLogger(DetectionWarnController.class); 
	@Autowired
	private EmailToService emailToService;
	@Autowired
	private EmailFromService emailFromService;
	@Autowired
	private EmailFrequencyService emailFrequencyService;
	
	@RequestMapping("delete_server")
	public ResultBean deleteServer() {
		try {
			emailFromService.delete(Lists.newArrayList());
			return new ResultBean();
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return new ResultBean(ResultBean.MSG_FAIL, "操作异常");
		}
	}
	
	@RequestMapping("add_or_update")
	public ResultBean addOrUpdateServer(EmailFrom from) {
/*		if(StringUtils.isBlank(from.getAccount()) 
		 || StringUtils.isBlank(from.getServer())
		 || StringUtils.isBlank(from.getPassword())) {
			return new ResultBean(ErrorCode.APP_ERROR_PARAMTER, "请求参数异常");
		}
		
		if(!EmailCheckUtil.checkEmail(from.getAccount())) {
			return new ResultBean(ErrorCode.APP_ERROR_PARAMTER, "请求参数异常");
		}*/
		
		try {
			from = emailFromService.addOrUpdateServer(from);
			return new ResultBean(from);
		}
		catch(AppException e) {
			return new ResultBean(ResultBean.RETCODE_FAIL, e.getMessage());
		} 
		catch(Exception e) {
			log.error(e.getMessage(), e);
			return new ResultBean(ResultBean.MSG_FAIL, "操作异常");
		}
	}
	
	@RequestMapping("constant")
	public ResultBean constant() {
		Map<String, Object> map = new HashMap<>();
		map.put("frequency", FrequencyType.frequencyTypeList);
		return new ResultBean(map);
	}
	
	@RequestMapping("get_info")
	public ResultBean getInfo() {
		List<EmailFrom> ef = emailFromService.findAll(null, null, null);
		List<EmailTo> clients = emailToService.findAll(null, null, 
				Lists.newArrayList(new Order("id", "desc")));
		List<EmailFrequency> efr = emailFrequencyService.findAll(null, null, null);
		
		Map<String, Object> data = new HashMap<>();
		
		if(ef != null && ef.size() > 0) {
			data.put("server", ef.get(0));
		}else {
			data.put("server", null);
		}
		data.put("client", clients);
		if(efr != null && efr.size() > 0) {
			data.put("fre", efr.get(0));
		}else {
			data.put("fre", null);
		}
		
		return new ResultBean(data);
	}
	
	@RequestMapping("add_email_client")
	public ResultBean addEmailTo(String emailto) {
		if(StringUtils.isBlank(emailto)) {
			return new ResultBean(ErrorCode.APP_ERROR_PARAMTER, "请求参数异常");
		}
		
		if(!EmailCheckUtil.checkEmail(emailto)) {
			return new ResultBean(ErrorCode.APP_ERROR_PARAMTER, "请求参数异常");
		}
		try {
		    emailToService.addEmailTo(emailto);
			return new ResultBean();
		}
		catch(Exception e) {
			log.error(e.getMessage(), e);
			return new ResultBean(ResultBean.MSG_FAIL, "操作异常");
		}
	}
	
	@RequestMapping("del_email_client")
	public ResultBean deleteEmailTo(String emailto) {
		if(StringUtils.isBlank(emailto)) {
			return new ResultBean(ErrorCode.APP_ERROR_PARAMTER, "请求参数异常");
		}
		
		if(!EmailCheckUtil.checkEmail(emailto)) {
			return new ResultBean(ErrorCode.APP_ERROR_PARAMTER, "请求参数异常");
		}
		try {
			int num = emailToService.deleteEmailTo(emailto);
			if(num > 0) {
				return new ResultBean();
			}else {
				log.error("没有找到指定的client");
				return new ResultBean(ResultBean.MSG_FAIL, "操作异常");
			}
		}catch(Exception e) {
			log.error(e.getMessage(), e);
			return new ResultBean(ResultBean.MSG_FAIL, "操作异常");
		}
	}
	
	@RequestMapping("update_email")
	public ResultBean updateEmailInfo(UpdateEmailReq updateEmailReq ) {
//		if(StringUtils.isBlank(updateEmailReq.getEmailTos())) {
//			return new ResultBean(ErrorCode.APP_ERROR_PARAMTER, "请求参数异常");
//		}
		if(updateEmailReq.getType() == null) {
			return new ResultBean(ErrorCode.APP_ERROR_PARAMTER, "请求参数异常");
		}
/*		if(!EmailCheckUtil.checkEmail(emailto)) {
			return new ResultBean(ErrorCode.APP_ERROR_PARAMTER, "请求参数异常");
		}*/
		try {
			emailToService.updateEmailInfo(updateEmailReq);
			return new ResultBean();
		}
		catch(AppException e) {
			log.error(e.getMessage(), e);
			return new ResultBean(ResultBean.MSG_FAIL, e.getMessage());
		}
		catch(Exception e) {
			log.error(e.getMessage(), e);
			return new ResultBean(ResultBean.MSG_FAIL, "操作异常");
		}
	}
	
	@RequestMapping("frequency")
	public ResultBean frequency(int type) {
		if(FrequencyType.frequencyTypeList.get(type +"") == null) {
			return new ResultBean(ErrorCode.APP_ERROR_PARAMTER, "请求参数异常");
		}
		try {
			emailFrequencyService.frequency(type);
			return new ResultBean();
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return new ResultBean(ResultBean.MSG_FAIL, "操作异常");
		}
		
	}
}
