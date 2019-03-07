package com.datapot.web.om.email.emailto.service.impl;


import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.datapot.contants.exception.AppException;
import com.datapot.nmap.scantask.service.impl.BaseService;
import com.datapot.persist.config.TargetDataSource;
import com.datapot.persist.om.params.dao.ParamsDao;
import com.datapot.persist.om.params.domain.Params;
import com.datapot.persist.support.Update;
import com.datapot.persist.support.Where;
import com.datapot.persist.sys.useraccount.domain.UserAccount;
import com.datapot.persist.util.LoginTokenSessionHelper;
import com.datapot.redis.snort.redisdao.ParserEsRedisDao;
import com.datapot.web.om.email.EmailPluginConstant;
import com.datapot.web.om.email.dto.UpdateEmailReq;
import com.datapot.web.om.email.emailfrequency.dao.EmailFrequencyDao;
import com.datapot.web.om.email.emailfrequency.domain.EmailFrequency;
import com.datapot.web.om.email.emailto.dao.EmailToDao;
import com.datapot.web.om.email.emailto.domain.EmailTo;
import com.datapot.web.om.email.emailto.service.EmailToService;
import com.google.common.base.Splitter;
import com.google.common.collect.Lists;


@Service
public class EmailToServiceImpl extends BaseService<EmailTo> implements EmailToService {
	private final Logger log = LoggerFactory.getLogger(getClass());
	@Autowired
	private EmailToDao emailToDao;
	@Autowired
	private ParamsDao paramsDao;
	@Autowired
	private ParserEsRedisDao parserEsRedisDao;
	@Autowired
	private EmailFrequencyDao emailFrequencyDao;
	@PostConstruct
	public void postConstruct() {
		this._dao = emailToDao;
	}
	
	@TargetDataSource(name="om")
	@Override
	public int update(EmailTo entityWithid) throws Exception {
		int num = 0;
		List<Update> updates = new ArrayList<Update>();
		updates.add(new Update("id", entityWithid.getId()));
		updates.add(new Update("client", entityWithid.getClient()));
		
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
	public EmailTo addEmailTo(String emailto) {
		List<EmailTo> clients = emailToDao.findAll(null, null, null);
		int maxClients =  getMaxClients();
		if(clients != null && clients.size() >= maxClients) {
			throw new AppException("已经达到最大配置数量");
		}
		else {
			EmailTo client = new EmailTo(emailto);
			Number num = emailToDao.insertAndReturnKey(client); 
			client.setId(num.intValue());
			return client;
		}
	}
	
	
	@TargetDataSource(name = "om")
	public int getMaxClients() {
		int maxClients = 5;
		//从redis中取数据
		try {
			//保存到redis
			String res = (String) parserEsRedisDao.get(EmailPluginConstant.WARN_MAX_CLIENTS);
			if(res != null) {
				return Integer.parseInt(res);
			}
		}catch(Exception e) {
			log.warn(e.getMessage(), e);
		}
		//从数据库中取数据，如果取不到给默认值. 并往redis中缓存
		try {
			Params p = paramsDao.findByName(EmailPluginConstant.WARN_MAX_CLIENTS);
			if(p != null) {
				maxClients = Integer.parseInt(p.getValue());
			}
		}catch(Exception e) {
			log.error(e.getMessage(), e);
		}
		finally {
			try {
				parserEsRedisDao.set(EmailPluginConstant.WARN_MAX_CLIENTS, maxClients+"");
			}catch(Exception e) {
				log.warn(e.getMessage(), e);
			}
		}
		
		return maxClients;
	}
	
	@TargetDataSource(name = "om")
	@Override
	public int deleteEmailTo(String emailto) throws Exception {
		return emailToDao.delete(Lists.newArrayList(new Where("client", emailto.trim())));
	}
	
	@TargetDataSource(name = "om")
	@Override
	public void updateEmailInfo(UpdateEmailReq updateEmailReq) throws Exception {
		emailToDao.delete(Lists.newArrayList());
		if(StringUtils.isNotBlank(updateEmailReq.getEmailTos())) {
			List<String> emailtos = Splitter.on(",").trimResults().splitToList(updateEmailReq.getEmailTos());
			for(int i = 0; i < emailtos.size(); i++) {
				EmailTo client = new EmailTo(emailtos.get(i));
				emailToDao.insertAndReturnKey(client);
			}
		}

		emailFrequencyDao.delete(Lists.newArrayList());
		EmailFrequency ef = new EmailFrequency();
		ef.setFrequency(updateEmailReq.getType());
		UserAccount ua = LoginTokenSessionHelper.getCurrentUser();
		if(ua == null) {
			throw new AppException("请登录");
		}
		ef.setUpUser(ua.getUserName());
		emailFrequencyDao.insertAndReturnKey(ef);
		
	}
}