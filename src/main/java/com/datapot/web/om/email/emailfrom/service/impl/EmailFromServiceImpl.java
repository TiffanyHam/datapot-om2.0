package com.datapot.web.om.email.emailfrom.service.impl;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import javax.annotation.PostConstruct;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.datapot.contants.exception.AppException;
import com.datapot.nmap.scantask.service.impl.BaseService;
import com.datapot.persist.config.TargetDataSource;
import com.datapot.persist.om.snortalert.dao.SnortAlertDao;
import com.datapot.persist.om.snortalert.domain.EmailSnortAlert;
import com.datapot.persist.support.Order;
import com.datapot.persist.support.Update;
import com.datapot.persist.support.Where;
import com.datapot.utils.date.DateUtil;
import com.datapot.utils.email.EmailUtil;
import com.datapot.web.om.email.constant.FrequencyType;
import com.datapot.web.om.email.emailfrequency.dao.EmailFrequencyDao;
import com.datapot.web.om.email.emailfrequency.domain.EmailFrequency;
import com.datapot.web.om.email.emailfrom.dao.EmailFromDao;
import com.datapot.web.om.email.emailfrom.domain.EmailFrom;
import com.datapot.web.om.email.emailfrom.service.EmailFromService;
import com.datapot.web.om.email.emailto.dao.EmailToDao;
import com.datapot.web.om.email.emailto.domain.EmailTo;
import com.google.common.base.Function;
import com.google.common.collect.Lists;


@Service
public class EmailFromServiceImpl extends BaseService<EmailFrom> implements EmailFromService {
	private final Logger log = LoggerFactory.getLogger(getClass());
	@Autowired
	private EmailFromDao emailFromDao;
	@Autowired
	private EmailToDao emailToDao;
	@Autowired
	private EmailFrequencyDao emailFrequencyDao;
	@Autowired
	private SnortAlertDao snortAlertDao;
	private long lastExeTime = 0;
	public static final String subject = "DataPot AIS 威胁告警";
	
	
	@PostConstruct
	public void postConstruct() {
		this._dao = emailFromDao;
		lastExeTime = System.currentTimeMillis();
		startEmailThead(); //启动邮件线程
	}
	
	@TargetDataSource(name="om")
	private void startEmailThead() {
		ExecutorService fixedThreadPool = Executors.newFixedThreadPool(1);
		fixedThreadPool.execute(new EmailCheckThread());
	}

	@TargetDataSource(name="om")
	@Override
	public int update(EmailFrom entityWithid) throws Exception {
		int num = 0;
		List<Update> updates = new ArrayList<Update>();
		updates.add(new Update("id", entityWithid.getId()));
		updates.add(new Update("server", entityWithid.getServer()));
		updates.add(new Update("account", entityWithid.getAccount()));
		updates.add(new Update("password", entityWithid.getPassword()));
		
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
	public EmailFrom addOrUpdateServer(EmailFrom from) throws Exception {
		if(from.getId() == null) {
			//保证只有一个,先清理掉以前的数据
			emailFromDao.delete(Lists.newArrayList());
			Number id = emailFromDao.insertAndReturnKey(from);
			from.setId(id.intValue());
			return from;
		}
		
		EmailFrom db = emailFromDao.findById(from.getId());
		if(db == null) {
			log.error("id = " + from.getId() + " not found.");
			throw new AppException(" 修改失败。");
		}
		BeanUtils.copyProperties(from, db);
		update(db);
		return db;
	}
	/**
	 * 邮件服务器是否可以启动
	 * @return
	 */
	@TargetDataSource(name="om")
	public boolean startEmailServer() {
		//is can start
		List<EmailFrequency> emailFrequencys = emailFrequencyDao.findAll(null, null, null);
		if(emailFrequencys == null || emailFrequencys.size() == 0) {
//			log.info("not frequency.");
			return false;
		}
		int freType = emailFrequencys.get(0).getFrequency();
		long current = System.currentTimeMillis();
		Long duration = FrequencyType.frequencyTypeList.get(freType+"");
		if(duration == null) {
//			log.info("not duration.");
			return false;
		}
		long last = current - lastExeTime;
		if(last < 0) {//可以向前调整了时间
			lastExeTime = current;
			return false;
		}
		if(last < duration) {
//			log.info("not time.");
			return false;
		}
		
		List<EmailFrom> server = emailFromDao.findAll(null, null, null);
		if(server == null || server.size() == 0) {
//			log.info("not server config.");
			return false;
		}
		
		EmailFrom server0 = server.get(0);
		if(StringUtils.isBlank(server0.getAccount()) 
		 || StringUtils.isBlank(server0.getServer())
		 || StringUtils.isBlank(server0.getPassword())) {
//			log.info("server config error.");
			return false;
		}
		
		List<EmailTo> emailTos = emailToDao.findAll(null, null, null);
		if(emailTos == null || emailTos.size() == 0) {
//			log.info("not client");
			return false;
		}
		
		//get detection type
		List<EmailSnortAlert> datas = snortAlertDao.findDataForEmail(null, 
				Lists.newArrayList(
						new Where("a.CollectTime", ">", DateUtil.convert2String(lastExeTime, DateUtil.LONGDATE_DATETIME)), 
						new Where("a.CollectTime", "<=", DateUtil.convert2String(current, DateUtil.LONGDATE_DATETIME))
						),
				Lists.newArrayList(new Order("a.CollectTime", "DESC")));
		if(datas == null || datas.size() == 0) {
//			log.info("no data.");
			return false;
		}
		
		// send email
		List<String> clients = Lists.transform(emailTos, new Function<EmailTo, String>() {

			@Override
			public String apply(EmailTo input) {
				return input.getClient();
			}
		});
		try {
			Map<String, Object> tdatas = new HashMap<String, Object>();
			tdatas.put("datas", datas);
			String content = EmailUtil.getContent("snort_alert.tpl", tdatas);
			EmailUtil.sendMail(server0.getServer(), server0.getAccount(), server0.getPassword(), 25, 
					clients, subject, content);
			lastExeTime = current;
			log.info("邮件发送成功。");
		} catch (Exception e) {
			log.error(e.getMessage());
			log.info("send email error.");
			return false;
		}
		
		return true;
	}
	
	
	class EmailCheckThread extends Thread {
		
		public EmailCheckThread() {
			this.setName("email-warn");
			this.setDaemon(true);
		}
		@TargetDataSource(name="om")
		@Override
		public void run() {
			for(;;) {
				try {
					Thread.sleep(30000);
					startEmailServer();
					
				} catch (InterruptedException e) {
					log.error(e.getMessage(), e);
				}
			}
		}
	}
}

