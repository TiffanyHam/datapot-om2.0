package com.datapot.web.om.email.emailto.service;

import com.datapot.nmap.scantask.service.IBaseService;
import com.datapot.web.om.email.dto.UpdateEmailReq;
import com.datapot.web.om.email.emailto.domain.EmailTo;

public interface EmailToService extends IBaseService<EmailTo>{

	EmailTo addEmailTo(String emailto);

	int deleteEmailTo(String emailto) throws Exception;

	void updateEmailInfo(UpdateEmailReq updateEmailReq) throws Exception;
	
}
