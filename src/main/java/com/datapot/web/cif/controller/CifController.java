package com.datapot.web.cif.controller;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.datapot.contants.http.ErrorCode;
import com.datapot.contants.result.ResultBean;
import com.datapot.web.cif.service.impl.CifService;
@RequestMapping("om/cif")
@RestController
public class CifController {
	private Logger log = LoggerFactory.getLogger(CifController.class);
	@Autowired
	private CifService cifService;
	
	@RequestMapping("search")
	public ResultBean search(String key) {
		if(StringUtils.isBlank(key)) {
			return new ResultBean(ErrorCode.APP_ERROR_PARAMTER, "参数为空");
		}
		
		try {
			return new ResultBean(cifService.search(key.trim().toLowerCase()));
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return new ResultBean(ErrorCode.APP_ERROR_APPERROR, "操作异常");
		}
	}
	
}
