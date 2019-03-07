package com.datapot.web.om.email.emailfrequency.service;

import com.datapot.nmap.scantask.service.IBaseService;
import com.datapot.web.om.email.emailfrequency.domain.EmailFrequency;

public interface EmailFrequencyService extends IBaseService<EmailFrequency>{

	void frequency(int type) throws Exception;

}
