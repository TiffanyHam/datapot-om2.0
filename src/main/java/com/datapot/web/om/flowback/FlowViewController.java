package com.datapot.web.om.flowback;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.datapot.contants.result.ResultBean;
import com.datapot.core.om.flowback.service.IFlowViewService;

@RequestMapping("/om/flowview")
@RestController
public class FlowViewController {
    
	@Autowired
	private IFlowViewService flowViewService;
	/**
	   *    根据内外网ip查询流量视图数据
	 */
	@RequestMapping("/getFlowViewByIp")
	public ResultBean getFlowViewDataByIp(String ip) {
		return new ResultBean(flowViewService.getFlowViewDataByIp(ip));
	}
}
