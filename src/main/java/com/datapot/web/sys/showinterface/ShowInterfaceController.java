/**
 * @工程名称：datapot-om
 * @程序包名：com.datapot.sys.showinterface
 * @程序类名：ShowInterfaceController.java
 * @创建日期：2017年10月25日
 */
package com.datapot.web.sys.showinterface;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.datapot.core.sys.showinterface.service.IShowInterfaceService;
import com.datapot.persist.sys.showinterface.domain.ShowInterface;
import com.datapot.web.base.BaseController;

/**
 * @功能说明：
 * @创建人员：wendg
 * @变更记录：<BR> 1、2017年10月25日 wendg 新建类
 */
@Controller
@RequestMapping("/sys/show_interface")
public class ShowInterfaceController extends BaseController {

	@Autowired
	private IShowInterfaceService showInterfaceService;

	/**
	 * @函数名称：getInfos
	 * @创建日期：2017年10月25日
	 * @功能说明：
	 * @参数说明：
	 * @返回说明：String
	 */
	@RequestMapping("/list")
	public String getInfos(Model model) {
		List<ShowInterface> list = showInterfaceService.getInfos();
		model.addAttribute("showInterfaces", list);
		return "/manage/show_interface";
	}

	/**
	 * @函数名称：save
	 * @创建日期：2017年10月25日
	 * @功能说明：保存接口名称
	 * @参数说明：
	 * @返回说明：void
	 */
	@RequestMapping("/save")
	@ResponseBody
	public Object save(ShowInterface showInterface, Model model) {
		String message = "";
		if (StringUtils.isEmpty(showInterface.getName()) || StringUtils.isEmpty(showInterface.getMethod())
				|| StringUtils.isEmpty(showInterface.getUrl())) {
			message = "接口url、接口请求方法、接口名称不能为空，请检查参数值";
			model.addAttribute("message", message);
			return message;
		}

		try {
			if (showInterface.getId() != null) {
				message = showInterfaceService.update(showInterface);
			} else {
				message = showInterfaceService.save(showInterface);
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			message = "操作失败，请稍后重试";
		}
		model.addAttribute("message", message);
		return message;
	}

	/**
	 * @函数名称：getInfos
	 * @创建日期：2017年10月25日
	 * @功能说明：
	 * @参数说明：
	 * @返回说明：String
	 */
	@RequestMapping("/manage_interface")
	public String getManageInterface(Model model) {
		List<ShowInterface> list = showInterfaceService.getInfos();
		model.addAttribute("showInterfaces", list);
		return "/manage/manage_interface";
	}

	/**
	 * @函数名称：save
	 * @创建日期：2017年10月25日
	 * @功能说明：保存接口名称
	 * @参数说明：
	 * @返回说明：void
	 */
	@RequestMapping("/edit")
	@ResponseBody
	public ShowInterface edit(Integer interfaceId, Model model) {
		ShowInterface showInterface = showInterfaceService.getInfo(interfaceId);
		model.addAttribute("showInterface", showInterface);
		return showInterface;
	}

	/**
	 * @函数名称：save
	 * @创建日期：2017年10月25日
	 * @功能说明：保存接口名称
	 * @参数说明：
	 * @返回说明：void
	 */
	@RequestMapping("/delete")
	@ResponseBody
	public Object delete(Integer interfaceId, Model model) {
		String message = null;
		try {
			message = showInterfaceService.delete(interfaceId);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			message = "删除失败，请稍后重试";
		}
		model.addAttribute("showInterface", message);
		return message;
	}

	@RequestMapping("/test")
	public String test() {
		return "/test";
	}
}
