package com.datapot.web.om.email.emailfrom.dao;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.datapot.persist.config.TargetDataSource;
import com.datapot.persist.support.MysqlGenericSupport;
import com.datapot.persist.support.Order;
import com.datapot.persist.support.Where;
import com.datapot.web.om.email.emailfrom.domain.EmailFrom;

@Repository
public class EmailFromDao extends MysqlGenericSupport<EmailFrom> {
	 @TargetDataSource(name="om")
	 public List<EmailFrom> findAll(List<String> fields, List<Where> wheres, List<Order> orders) {
		 return super.findAll(fields, wheres, orders);
	 } 
}