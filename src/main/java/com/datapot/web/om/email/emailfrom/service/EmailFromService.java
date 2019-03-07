package com.datapot.web.om.email.emailfrom.service;

import com.datapot.nmap.scantask.service.IBaseService;
import com.datapot.web.om.email.emailfrom.domain.EmailFrom;

public interface EmailFromService extends IBaseService<EmailFrom>{

	EmailFrom addOrUpdateServer(EmailFrom from) throws Exception;
}
