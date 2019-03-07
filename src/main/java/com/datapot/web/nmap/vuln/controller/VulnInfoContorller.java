package com.datapot.web.nmap.vuln.controller;

import java.util.Map;

import org.apache.commons.collections.map.HashedMap;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.datapot.constants.ScheduleActive;
import com.datapot.contants.result.ResultBean;
import com.datapot.nessus.constants.FixStatus;
import com.datapot.nessus.constants.VulnLevel;

@Controller
@RequestMapping(value = "/om/vuln")
public class VulnInfoContorller {

	@RequestMapping(value = "/index")
	public ModelAndView vulnIndex() {
		ModelMap model = new ModelMap();  
		return new ModelAndView("/securityHole/holeDasebase", model);
	}
	
	@RequestMapping(value = "/manager")
	public ModelAndView vulnManager() {
		ModelMap model = new ModelMap();  
		return new ModelAndView("/securityHole/holeDasebase", model);
	}
	
	@RequestMapping(value = "/vulnresource")
	public ModelAndView vulnresource() {
		ModelMap model = new ModelMap();  
		return new ModelAndView("/securityHole/holeManage", model);
	}
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@ResponseBody
	@RequestMapping(value = "/constants")
	public ResultBean constants() {
		Map<String, Map> cons = new HashedMap();
		cons.put("fixStatus", FixStatus.list());
		cons.put("vulnLevel", VulnLevel.list());
		cons.put("scheduleActive", ScheduleActive.scheduleActiveList);
		return new ResultBean(cons);
	}
}
