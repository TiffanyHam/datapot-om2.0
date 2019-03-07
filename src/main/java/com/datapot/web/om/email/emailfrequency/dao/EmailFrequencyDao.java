package com.datapot.web.om.email.emailfrequency.dao;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.datapot.persist.config.TargetDataSource;
import com.datapot.persist.support.MysqlGenericSupport;
import com.datapot.persist.support.Order;
import com.datapot.persist.support.Where;
import com.datapot.web.om.email.emailfrequency.domain.EmailFrequency;

@Repository
public class EmailFrequencyDao extends MysqlGenericSupport<EmailFrequency> {
	 @TargetDataSource(name="om")
	 public List<EmailFrequency> findAll(List<String> fields, List<Where> wheres, List<Order> orders) {
		 return super.findAll(fields, wheres, orders);
	 } 
	 
	 @TargetDataSource(name="om")
	 public int delete( List<Where> wheres) throws Exception {
		 return super.delete(wheres);
	 } 
	 
	 @TargetDataSource(name="om")
	 public Number insertAndReturnKey(EmailFrequency fre) {
		 return super.insertAndReturnKey(fre);
	 }
	 
}