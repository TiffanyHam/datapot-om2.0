/**
 * @工程名称：datapot-om
 * @程序包名：com.datapot.web.om.params
 * @程序类名：ParamsController.java
 * @创建日期：2018年1月5日
 */
package com.datapot.web.om.params;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.datapot.contants.result.ResultBean;
import com.datapot.core.om.params.service.IParamsService;

/**
 * @功能说明：参数设置
 * @创建人员：zhenghb
 * @变更记录：<BR>
 * 1、2018年1月5日 zhenghb 新建类
 */
@Controller
@RequestMapping("/om/params")
public class ParamsController {
	
	@Autowired
	private IParamsService paramsService;
	
	/**
	 * 
	 * @函数名称：updateSnortParams
	 * @创建日期：2018年1月5日
	 * @功能说明：跳转到维度参数设置页面
	 * @参数说明：
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/{html}", method = RequestMethod.GET)
	public String index(@PathVariable String html){
		return "/setting/" + html.trim();
	}
	
	/**
	 * 
	 * @函数名称：updateSnortParams
	 * @创建日期：2018年1月5日
	 * @功能说明：设置snort解析参数
	 * @参数说明：
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/save_or_update_param", method = RequestMethod.POST)
	public @ResponseBody ResultBean saveOrUpdateSnortParams(@RequestParam String nameEn,@RequestParam String value){
		if(StringUtils.isEmpty(nameEn) || StringUtils.isEmpty(value)){
			return new ResultBean(ResultBean.INPUT_ERROR,"参数不能为空！");
		}
		return paramsService.saveOrUpdateParams(nameEn,value);
	}
	
	/**
	 * 
	 * @函数名称：getSnortParams
	 * @创建日期：2018年1月5日
	 * @功能说明：获取所有参数
	 * @参数说明：
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/get_params", method = RequestMethod.GET)
	public @ResponseBody ResultBean getSnortParams(){
		return paramsService.getParams();
	}
}
