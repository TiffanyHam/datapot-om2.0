package com.datapot.web.om.email.constant;

import java.util.LinkedHashMap;
import java.util.Map;

public enum FrequencyType {
	REALTIME(0, 0L), 
	MINUTE_30(30, 30*60*1000L), 
	MINUTE_60(60, 60*60*1000L);
	
	private int id;
	private Long duration;
	
	FrequencyType(int id, Long dur) {
		this.id = id;
		this.duration = dur;
	}
	
	public int getId() {
		return this.id; 
	}

	public Long getDuration() {
		return duration;
	}

	public void setDuration(Long duration) {
		this.duration = duration;
	}

	public static Map<String, Long> frequencyTypeList = frequencyTypeList();

	private static Map<String, Long> frequencyTypeList() {
		Map<String, Long> map = new LinkedHashMap<String, Long>();
		map.put(String.valueOf(REALTIME.getId()), REALTIME.getDuration());
		map.put(String.valueOf(MINUTE_30.getId()),MINUTE_30.getDuration());
		map.put(String.valueOf(MINUTE_60.getId()),MINUTE_60.getDuration());
		return map;
	}

}
