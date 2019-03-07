package com.datapot.web.om.email.emailto.dao;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.datapot.persist.config.TargetDataSource;
import com.datapot.persist.support.MysqlGenericSupport;
import com.datapot.persist.support.Order;
import com.datapot.persist.support.Where;
import com.datapot.web.om.email.emailto.domain.EmailTo;

@Repository
public class EmailToDao extends MysqlGenericSupport<EmailTo> {
	 @TargetDataSource(name="om")
	 public List<EmailTo> findAll(List<String> fields, List<Where> wheres, List<Order> orders) {
		 return super.findAll(fields, wheres, orders);
	 } 
	 
	 @TargetDataSource(name="om")
	 public Number insertAndReturnKey(EmailTo entity) {
		return super.insertAndReturnKey(entity); 
	 }
}