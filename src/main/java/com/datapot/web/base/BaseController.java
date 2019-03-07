/**
 * @工程名称：datapot-om
 * @程序包名：com.datapot.om.base;
 * @程序类名：BaseController.java
 */
package com.datapot.web.base;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.servlet.ModelAndView;

import com.datapot.contants.cache.CacheConstants;
import com.datapot.persist.sys.useraccount.domain.UserAccount;

/**
 * @功能说明：Controller抽象类 <BR>
 * @创建人员：LeoLu<BR>
 * @创建日期：2016年6月1日<BR>
 * @变更记录：<BR> 1、2016年6月1日 LeoLu 更新
 */
public abstract class BaseController {

	protected ModelAndView ajaxDone(int statusCode, String message, String forwardUrl) {
		ModelAndView mav = new ModelAndView("./common/ajaxDone");
		mav.addObject("statusCode", statusCode);
		mav.addObject("message", message);
		mav.addObject("forwardUrl", forwardUrl);
		return mav;
	}

	protected ModelAndView ajaxDone(int statusCode, String message, String forwardUrl, Object navTabId) {
		ModelAndView mav = new ModelAndView("./common/ajaxDone");
		mav.addObject("statusCode", statusCode);
		mav.addObject("message", message);
		mav.addObject("forwardUrl", forwardUrl);
		mav.addObject("navTabId", navTabId);
		return mav;
	}

	protected ModelAndView ajaxDoneSuccess(String message) {
		return ajaxDone(200, message, "");
	}

	protected ModelAndView ajaxDoneSuccess(String message, Object navTabId) {
		return ajaxDone(200, message, "", navTabId);
	}

	protected ModelAndView ajaxDoneError(String message) {
		return ajaxDone(300, message, "");
	}

	/**
	 * @函数名称：setCurrentUser
	 * @创建日期：2017年9月12日
	 * @功能说明：把当前用户存到session
	 * @参数说明：request 请求
	 * @参数说明：user 当前用户
	 * @返回说明：void
	 */
	public void setCurrentUser(HttpServletRequest request, UserAccount user) {
		request.getSession(true).setAttribute(CacheConstants.SESSION_SYS_USER, user);
	}

	/**
	 * @函数名称：getCurrentUser
	 * @创建日期：2014-1-1
	 * @功能说明：得到当前用户对象的Session信息
	 * @参数说明：request HttpServletRequest 对象
	 * @返回说明：UserInfo
	 */
	public UserAccount getCurrentUser(HttpServletRequest request) {
		Object object = request.getSession(true).getAttribute(CacheConstants.SESSION_SYS_USER);
		if (object instanceof UserAccount)
			return (UserAccount) object;
		return null;
	}

}
