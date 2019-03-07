package com.datapot.web.om.email.emailfrequency.service.impl;


import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.datapot.nmap.scantask.service.impl.BaseService;
import com.datapot.persist.config.TargetDataSource;
import com.datapot.persist.support.Update;
import com.datapot.persist.support.Where;
import com.datapot.web.om.email.emailfrequency.dao.EmailFrequencyDao;
import com.datapot.web.om.email.emailfrequency.domain.EmailFrequency;
import com.datapot.web.om.email.emailfrequency.service.EmailFrequencyService;
import com.google.common.collect.Lists;

@Service
public class EmailFrequencyServiceImpl extends BaseService<EmailFrequency> implements EmailFrequencyService {
	@Autowired
	private EmailFrequencyDao emailFrequencyDao;
	
	@PostConstruct
	public void postConstruct() {
		this._dao = emailFrequencyDao;
	}
	
	@TargetDataSource(name="om")
	@Override
	public int update(EmailFrequency entityWithid) throws Exception {
		int num = 0;
		List<Update> updates = new ArrayList<Update>();
		updates.add(new Update("id", entityWithid.getId()));
		updates.add(new Update("frequency", entityWithid.getFrequency()));
		updates.add(new Update("uptime", entityWithid.getUptime()));
		updates.add(new Update("upUser", entityWithid.getUpUser()));
		
		List<Where> wheres = new ArrayList<Where>();
			wheres.add(new Where("id", entityWithid.getId()));
		num = this.update(updates, wheres);
		if(num == 0) {
			throw new RuntimeException("update error."); 
		}
		return num;
	}
	
	@TargetDataSource(name="om")
	@Override
	public void frequency(int type) throws Exception {
		emailFrequencyDao.delete(Lists.newArrayList());
		EmailFrequency ef = new EmailFrequency();
		ef.setFrequency(type);
		
/*		UserAccount account = LoginTokenSessionHelper.getCurrentUser();
		if(account != null) {
			ef.setUpUser(account.getUserName());
		}else {
			throw new AppException("请先登录。");
		}*/
		
		emailFrequencyDao.insertAndReturnKey(ef);
	}
}