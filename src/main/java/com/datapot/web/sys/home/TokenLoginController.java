package com.datapot.web.sys.home;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.datapot.contants.http.ErrorCode;
import com.datapot.contants.redis.RedisContants;
import com.datapot.contants.result.ResultBean;
import com.datapot.core.config.SystemVersion;
import com.datapot.core.sys.sysloginlog.service.UserDailyErrorCountService;
import com.datapot.core.sys.sysmenu.service.ISysMenuService;
import com.datapot.core.sys.useraccount.service.IUserAccountService;
import com.datapot.core.util.PasswordHelper;
import com.datapot.persist.sys.sysmenu.domain.SysMenuV;
import com.datapot.persist.sys.useraccount.domain.UserAccount;
import com.datapot.persist.util.LoginTokenSessionHelper;
import com.datapot.redis.om.VCodeDao;
import com.datapot.token.util.TokenSessionHelper;
import com.datapot.utils.redis.RedisUtil;
import com.datapot.utils.security.DESUtil;

@RestController
@CrossOrigin
public class TokenLoginController {
	private Logger log = LoggerFactory.getLogger(TokenLoginController.class);
	
	public static final int max_error_count = 5;
	@Autowired
	private ISysMenuService iSysMenuService;

	@Autowired
	private SystemVersion SystemVersion;
	
	@Autowired
	private IUserAccountService iUserAccountService;
	
	@Autowired
	private VCodeDao vcodeDao;
	@Autowired
	private UserDailyErrorCountService userDailyErrorCountService;

	@RequestMapping(value = "/main")
	public String main(HttpServletRequest request, Model model) {
		UserAccount user = LoginTokenSessionHelper.getCurrentUser();
		model.addAttribute("user", user);
		model.addAttribute("version", SystemVersion.getVersion());
		return "main";
	}

	@RequestMapping("/403")
	public String forbidden() {
		return "refuse";
	}
	
	/**
	 * 
	 * @函数名称：login
	 * @创建日期：2017年11月21日
	 * @功能说明：登录
	 * @参数说明：
	 * @返回说明：String
	 */
	@RequestMapping(value = "/login")
	public ResultBean login(HttpServletRequest request) {
		String userName = request.getParameter("userName");
		String loginPwd = request.getParameter("loginPwd");
		String randomcode =  request.getParameter("loginCode");
		HttpSession session  = request.getSession(true);
		
		if(StringUtils.isBlank(userName)) {
			return new ResultBean(ErrorCode.APP_ERROR_PARAMTER, "用户名不能为空");
		}
		else if(StringUtils.isBlank(loginPwd)) {
			return new ResultBean(ErrorCode.APP_ERROR_PARAMTER, "密码不能为空");
		}
		/**
		 * 解密ASE加密用户名及密码
		 */
		String decryUserName = null;
		String decryLoginPwd = null;
		try {
			decryUserName = DESUtil.decryption(userName);
			decryLoginPwd = DESUtil.decryption(loginPwd);
		} catch (Exception e1) {
			e1.printStackTrace();
		}
		
		UserAccount account = iUserAccountService.findUserAccountByUserName(decryUserName);
		if(account == null) {
			return new ResultBean(ErrorCode.APP_ERROR_PARAMTER, "用户不存在");
		}
		int count = userDailyErrorCountService.getLoginErrorCount(account.getUserId());
		if(count >= max_error_count) {
			return new ResultBean(ErrorCode.USER_LOCKED, "你的账号已被冻结，请联系管理员恢复使用");
		}
		if(!StringUtils.isBlank(randomcode)) {
			String code = RedisUtil.generateRedisKey(RedisContants.VCODE, randomcode.toLowerCase());
			Object validateCode = vcodeDao.get(code);
			if(randomcode == null || validateCode == null) {
				log.error("验证码错误 randomcode = " + randomcode + " validateCode = " + validateCode);
				return new ResultBean(ErrorCode.APP_ERROR_APPERROR, "验证码错误");
			}
		}
		
		if(1 != account.getAccountStatus()) {
			return new ResultBean(ErrorCode.USER_LOCKED, "你的账号已被冻结，请联系管理员恢复使用");
		}
		if(!PasswordHelper.encryption(decryUserName, decryLoginPwd).equals(account.getLoginPwd())) {
			int errorcount = userDailyErrorCountService.getLoginErrorCount(account.getUserId().longValue());
			if(max_error_count ==  1 + errorcount) {
				account.setAccountStatus(0);
				iUserAccountService.update_no_need_login(account);
				try {
					userDailyErrorCountService.clearLoginErrorCount(account.getUserId());
				} catch (Exception e) {
					log.error(e.getMessage(), e);
				}
			}
			try {
				userDailyErrorCountService.incLoginErrorCount(account.getUserId());
			} catch (Exception e) {
				log.error(e.getMessage(), e);
			}
			return new ResultBean(ErrorCode.USER_LOCKED,"密码错误，请重新输入（剩余次数：" +(max_error_count - errorcount -1)+"）");
		}
		if(StringUtils.isNoneBlank(randomcode)) {
			vcodeDao.delKey(RedisUtil.generateRedisKey(RedisContants.VCODE, randomcode));
		}
		
		TokenSessionHelper.setUserAccountToSessionAttr(account, session);
		try {
			userDailyErrorCountService.clearLoginErrorCount(account.getUserId());
		} catch (Exception e) {
			log.error(e.getMessage(), e);
		}
		return new ResultBean(session.getId());
	}
	
	@RequestMapping(value = "/login.json")
	public ResultBean login_json(HttpServletRequest request) {
		String userName = request.getParameter("userName");
		String loginPwd = request.getParameter("loginPwd");
		String randomcode =  request.getParameter("loginCode");
		HttpSession session  = request.getSession(true);
		String validateCode = (String) session.getAttribute("IMAGE_CODE");
		if(randomcode == null || validateCode == null || !randomcode.toLowerCase().equals(validateCode.toLowerCase())) {
			return new ResultBean(ErrorCode.APP_ERROR_APPERROR, "验证码错误");
		}
		if(StringUtils.isBlank(userName)) {
			return new ResultBean(ErrorCode.APP_ERROR_PARAMTER, "用户名不能为空");
		}
		else if(StringUtils.isBlank(loginPwd)) {
			return new ResultBean(ErrorCode.APP_ERROR_PARAMTER, "密码不能为空");
		}
		UserAccount account = iUserAccountService.findUserAccountByUserName(userName);
		if(account == null) {
			return new ResultBean(ErrorCode.APP_ERROR_PARAMTER, "用户不存在");
		}
		if(1 != account.getAccountStatus()) {
			return new ResultBean(ErrorCode.USER_LOCKED, "帐号锁定");
		}
		if(!PasswordHelper.encryption(userName, loginPwd).equals(account.getLoginPwd())) {
			return new ResultBean(ErrorCode.USER_LOCKED, "用户名或密码不正确");
		}
		session.removeAttribute("IMAGE_CODE");
		TokenSessionHelper.setUserAccountToSessionAttr(account, session);
		return new ResultBean(session.getId());
	}
	
	@RequestMapping(value = "/logout", method = RequestMethod.POST)
	public ResultBean logout(HttpServletRequest request, Model model) {
		HttpSession session  = request.getSession(true);
		session.invalidate();
		log.info("logut token:" + session.getId());
		return  new ResultBean(ErrorCode.HTTP_OK, ResultBean.MSG_SUCCESS);
	}
	
	@RequestMapping(value = "/user_menus", method = RequestMethod.GET)
	public ResultBean userMenus() {
		UserAccount account = LoginTokenSessionHelper.getCurrentUser();
		if(account == null) {
			return new ResultBean(ErrorCode.USER_NOT_LOGIN, "请先登陆");
		}
		Integer groupId = account.getGroupId();
		List<SysMenuV> menus = iSysMenuService.findSysMenuReqByGroupId(groupId);
		return new ResultBean(menus);
	}

	/**
	 * @函数名称：getMenus
	 * @创建日期：2017年11月6日
	 * @功能说明：获取菜单信息
	 * @参数说明：
	 * @返回说明：Map<String,Object>
	 */
	public Map<String, Object> getMenus(HttpSession session) {
		Map<String, Object> map = new LinkedHashMap<String, Object>();

		Object obj = session.getAttribute("menus");
		List<SysMenuV> menus = null;
		if (null == obj) {
			menus = iSysMenuService.queryAll();
		} else {
			// 从session中获取用户菜单信息
			menus = (List<SysMenuV>) obj;
		}

		List<SysMenuV> list = new ArrayList<SysMenuV>();
		for (SysMenuV sysMenuV : menus) {
			if (sysMenuV.getParentMenuId() == 0) {
				list.add(sysMenuV);
			}
		}
		sortList(list); // 一级菜单访入map
		Map<Integer, List<SysMenuV>> mapMenu = new LinkedHashMap<Integer, List<SysMenuV>>();
		for (SysMenuV sysMenuV : list) {
			mapMenu.put(sysMenuV.getMenuId(), new ArrayList<>());
			for (SysMenuV sysMenu : menus) { // 判断是否当前菜单的子菜单
				if (sysMenuV.getMenuId() == sysMenu.getParentMenuId()) {
					mapMenu.get(sysMenuV.getMenuId()).add(sysMenu);
				}
			} // 对加入的菜单进行排序
			sortList(mapMenu.get(sysMenuV.getMenuId()));
		}
		map.put("mainMenus", list);
		map.put("secondMenus", mapMenu);
		return map;
	}

	/**
	 * @函数名称：sortList
	 * @创建日期：2017年11月2日
	 * @功能说明：对菜单进行排序
	 * @参数说明：
	 * @返回说明：void
	 */
	public void sortList(List<SysMenuV> chinaList) {
		// 对list进行排序
		Collections.sort(chinaList, new Comparator<SysMenuV>() {
			/*
			 * int compare(SysMenuV o1, SysMenuV o2) 返回一个基本类型的整型， 返回负数表示：o1 小于o2， 返回0 表示：o1和o2相等，
			 * 返回正数表示：o1大于o2。
			 */
			@Override
			public int compare(SysMenuV o1, SysMenuV o2) {
				// 按照学生的年龄进行升序排列
				if (o1.getMenuId() < o2.getMenuId()) {
					return 1;
				}
				if (o1.getMenuId() == o2.getMenuId()) {
					return 0;
				}
				return -1;
			}
		});
	}
}
