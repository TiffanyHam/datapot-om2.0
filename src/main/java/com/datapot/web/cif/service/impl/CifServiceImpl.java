package com.datapot.web.cif.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.datapot.persist.config.TargetDataSource;
import com.datapot.persist.support.Order;
import com.datapot.persist.support.Pager;
import com.datapot.persist.support.Where;
import com.datapot.web.cif.dao.IndicatorDao;
import com.datapot.web.cif.domain.Indicator;
import com.google.common.collect.Lists;
@Service
public class CifServiceImpl implements CifService {
	@Autowired
	private IndicatorDao indicatorDao;

	@TargetDataSource(name="cif")
	@Override
	public Pager<Indicator> search(String key) throws Exception {
		return indicatorDao.getListForPage(1, 1, null, 
				Lists.newArrayList(new Where("indicator", key)), 
				Lists.newArrayList(new Order("reporttime", "desc")));
	}

}
