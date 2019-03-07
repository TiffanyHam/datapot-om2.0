package com.datapot.web;

import java.util.List;

import org.quartz.Job;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import com.datapot.constants.ScheduleActive;
import com.datapot.contants.exception.AppException;
import com.datapot.nessus.biz.ScanSample;
import com.datapot.nessus.schedule.ScanStatusManager;
import com.datapot.persist.config.TargetDataSource;
import com.datapot.schedule.schedulerecord.api.CornSchedule;
import com.datapot.schedule.schedulerecord.api.ScheduleManager;
import com.datapot.schedule.schedulerecord.domain.ScheduleInfo;
import com.datapot.schedule.schedulerecord.service.ScheduleInfoService;

@Component
public class ApplicationReadyEventListener implements  ApplicationListener<ApplicationReadyEvent> {
	
    private static Logger logger = LoggerFactory.getLogger(ApplicationReadyEventListener.class);
    @Autowired
    private ScanSample s;
    @Autowired
    private ScheduleManager scheduleManager;
    @Autowired
    private ScheduleInfoService scheduleRecordService;
    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        logger.info("sys started. then init scanStatusManager... ");
        ScanStatusManager.getInstance().init(s);
        //启动定时任务
        startScheduleTasks();
    }
    
    @TargetDataSource(name="om")
    public void startScheduleTasks() {
    	
    	// 启动上次关机的定时任务
    	List<ScheduleInfo> records = scheduleRecordService.findActiveStatus(ScheduleActive.ACTIVE.getId());
    	if(records != null ) { //将任务重新启动
    		for(ScheduleInfo sr : records) {
    			try {
    				Class<?> clazz = Class.forName(sr.getClassName());
    				if(!Job.class.isAssignableFrom(clazz)) {
    					throw new AppException("class is not a job class");
    				}
        			CornSchedule schedule = new CornSchedule(sr.getType(), sr.getId(), sr.getCron(),
        					sr.getBeat(), (Class<? extends Job>) clazz);
            		scheduleManager.start(schedule);	
    			}catch(Exception e) {
    				logger.error(" log start schedule id = {} error.", sr.getId());
    				logger.error(e.getMessage(), e);
    				try {
						scheduleRecordService.disableScheduleRecord(sr.getId());
					} catch (Exception e1) {
						logger.error("disable schedule error. id = {}", sr.getId());
						logger.error(e1.getMessage(), e);
					}
    			}
    		}
    	}
    	
    	List<ScheduleInfo> pauseRecords = scheduleRecordService.findActiveStatus(ScheduleActive.PAUSE.getId());
    	if(pauseRecords != null ) { //将任务重新暂停
    		for(ScheduleInfo sr : pauseRecords) {
    			try {
    				Class<?> clazz = Class.forName(sr.getClassName());
    				if(!Job.class.isAssignableFrom(clazz)) {
    					throw new AppException("class is not a job class");
    				}
        			CornSchedule schedule = new CornSchedule(sr.getType(), sr.getId(), sr.getCron(),
        					sr.getBeat(), (Class<? extends Job>) clazz);
        			//先延迟启动
            		scheduleManager.startDelay(schedule);
            		//在启动之前暂停
            		scheduleManager.pause(sr.getId(), sr.getType());
    			}catch(Exception e) {
    				logger.error(" log start schedule id = {} error.", sr.getId());
    				logger.error(e.getMessage(), e);
    				try {
						scheduleRecordService.disableScheduleRecord(sr.getId());
					} catch (Exception e1) {
						logger.error("disable schedule error. id = {}", sr.getId());
						logger.error(e1.getMessage(), e);
					}
    			}
    		}
    	}
    }
}