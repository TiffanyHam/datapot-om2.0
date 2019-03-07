package com.datapot.web.cif.dao;

import org.springframework.stereotype.Repository;

import com.datapot.persist.support.MysqlGenericSupport;
import com.datapot.web.cif.domain.Indicator;

@Repository
public class IndicatorDao extends MysqlGenericSupport<Indicator> {

}