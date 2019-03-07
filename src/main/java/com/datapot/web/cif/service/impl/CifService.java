package com.datapot.web.cif.service.impl;

import com.datapot.persist.support.Pager;
import com.datapot.web.cif.domain.Indicator;

public interface CifService {
	Pager<Indicator> search(String key) throws Exception;
}
