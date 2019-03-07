/**
 * @工程名称：datapot-om
 * @程序包名：com.datapot.om.web
 * @程序类名：UserAccountController.java
 * @创建日期：2017年9月14日
 */
package com.datapot.web.sys.useraccount;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.datapot.contants.enums.AccessSys;
import com.datapot.contants.enums.AccountStatus;
import com.datapot.contants.enums.BoolStatus;
import com.datapot.contants.exception.AppException;
import com.datapot.contants.http.ErrorCode;
import com.datapot.contants.operation.OpResultConstants;
import com.datapot.contants.result.ResultBean;
import com.datapot.core.base.BaseQuery;
import com.datapot.core.sys.sysgroup.service.ISysGroupService;
import com.datapot.core.sys.sysoffice.service.ISysOfficeService;
import com.datapot.core.sys.useraccount.domain.AccountQuery;
import com.datapot.core.sys.useraccount.service.IUserAccountService;
import com.datapot.core.util.PasswordHelper;
import com.datapot.persist.support.Order;
import com.datapot.persist.support.Pager;
import com.datapot.persist.sys.sysgroup.domain.SysGroup;
import com.datapot.persist.sys.sysoffice.domain.SysOffice;
import com.datapot.persist.sys.useraccount.domain.UserAccount;
import com.datapot.persist.util.LoginTokenSessionHelper;
import com.datapot.redis.sys.domain.SysOfficeR;
import com.datapot.redis.sys.redisdao.SysOfficeRedisDao;
import com.datapot.token.util.TokenSessionHelper;
import com.datapot.utils.security.DESUtil;
import com.datapot.web.base.BaseController;

/**
 * 
 * @功能说明：用户账户控制类
 * @创建人员：Luxr
 * @变更记录：<BR> 1、2017年4月10日 Luxr 新建类
 */

@Controller
@RequestMapping("/sys/account")
public class UserAccountController extends BaseController {

	private final Logger log = LoggerFactory.getLogger(getClass());

	@Autowired
	private IUserAccountService userAccountService;

	@Autowired
	private ISysGroupService sysGroupService;

	@Autowired
	private ISysOfficeService sysOfficeService;

	@Autowired
	private SysOfficeRedisDao redisDao;

	/**
	 * 
	 * @函数名称：index
	 * @创建日期：2017年4月10日
	 * @功能说明：用户账户管理加载页面
	 * @参数说明：query 查询条件
	 * @返回说明：String
	 */
	@RequestMapping(value = "/index")
	public String index(Model model, BaseQuery query) {
		String sortName = query.getSortName();
		List<Order> orders = new ArrayList<Order>();
		if (StringUtils.isEmpty(sortName)) {
			orders.add(new Order("LastLogDate", "DESC"));
			orders.add(new Order("UserId", "DESC"));
		} else {
			String order = query.getOrder().toUpperCase();
			String newStr = sortName.substring(0, 1).toUpperCase() + sortName.substring(1);
			orders.add(new Order(newStr, order));
		}
		Pager<UserAccount> pager = null;
		try {
			// 获取用户账户分页信息
			pager = userAccountService.getInfos(query.getNumPerPage(), query.getPageNum(), null, null, orders);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.info("The userAccount information query is wrong");
		}
		List<SysOfficeR> officeRs = redisDao.getSysOffices();
		List<SysOffice> offices = null;
		if (CollectionUtils.isNotEmpty(officeRs)) {
			for (SysOffice sysOffice : offices) {
				SysOffice office = new SysOffice();
				office.setOfficeId(sysOffice.getOfficeId());
				office.setOfficeName(sysOffice.getOfficeName());
				offices.add(office);
			}
		} else {
			offices = sysOfficeService.getInfos();
		}
		// 把分支部门转为Map集合
		Map<String, String> officeMap = new HashMap<String, String>();
		for (SysOffice sysOffice : offices) {
			officeMap.put(sysOffice.getOfficeId() + "", sysOffice.getOfficeName());
		}
		List<SysGroup> groups = sysGroupService.findAll(null);
		Map<String, String> groupsMap = new HashMap<String, String>();
		for (SysGroup sysGroup : groups) {
			groupsMap.put(sysGroup.getGroupId() + "", sysGroup.getGroupName());
		}
		model.addAttribute("accessSys", AccessSys.ACCESS_SYS);
		model.addAttribute("accountStatus", AccountStatus.ACCOUNT_STATUS);
		model.addAttribute("boolStatus", BoolStatus.BOOL_STATUS);
		model.addAttribute("sysOffice", officeMap);
		model.addAttribute("groups", groupsMap);
		model.addAttribute("infos", pager);
		return "manage/user_account";
	}
	
	
	
	@RequestMapping(value = "/constant")
	@ResponseBody
	public ResultBean constant() {
		Map<String, Object> model = new HashMap<>();
		model.put("accessSys", AccessSys.ACCESS_SYS);
		model.put("accountStatus", AccountStatus.ACCOUNT_STATUS);
		model.put("boolStatus", BoolStatus.BOOL_STATUS);
		return new ResultBean(model);
	}

	/**
	 * @函数名称：accountQuery
	 * @创建日期：2017年11月10日
	 * @功能说明：条件查询
	 * @参数说明：
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/accountQuery")
	@ResponseBody
	public ResultBean accountQuery(HttpServletRequest request, AccountQuery accountQuery) {
		Pager<UserAccount> pager = null;
		try {
			// 获取用户账户分页信息
			pager = userAccountService.getInfos(accountQuery);
		} catch (Exception e) {
			log.info("The userAccount information query is wrong");
		}
		return new ResultBean(pager);
	}

	/**
	 * @函数名称：init
	 * @创建日期：2017年10月30日
	 * @功能说明：跳转页面时初始化数据
	 * @参数说明：userId 账户Id（执行新增时值为空）
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/init", method = RequestMethod.POST)
	public @ResponseBody ResultBean edit(Model model, Integer userId) {
		List<SysGroup> sysGroups = sysGroupService.findAll(null);
		Map<Integer, String> groups = new HashMap<Integer, String>();
		for (SysGroup sysGroup : sysGroups) {
			groups.put(sysGroup.getGroupId(), sysGroup.getGroupName());
		}
		List<SysOffice> offices = sysOfficeService.getInfos();
		Map<String, Object> map = new HashMap<>();
		map.put("accessSys", AccessSys.ACCESS_SYS);
		map.put("accountStatus", AccountStatus.ACCOUNT_STATUS);
		map.put("sysGroups", groups);
		map.put("sysOffice", offices);
		// 如果账户id为空则是新增页面，否则为修改
		if (userId != null && userId > 0) {
			UserAccount userAccount = userAccountService.getInfo(userId);
			map.put("userAccount", userAccount);
		}
		return new ResultBean(map);
	}

	/**
	 * @函数名称：save
	 * @创建日期：2017年4月11日
	 * @功能说明：保存账户信息与更新账户信息
	 * @参数说明：request 请求对象
	 * @参数说明：nti 菜单id
	 * @返回说明：ModelAndView
	 */
	@RequestMapping(value = "/save", method = RequestMethod.POST)
	public @ResponseBody ResultBean save(UserAccount userAccount) {
		String message = "";
		String opName = "";
		// 表单验证
		if (StringUtils.isEmpty(userAccount.getActualName())) {
			return new ResultBean(ResultBean.RETCODE_FAIL, "员工姓名不能为空");
		}
		if (StringUtils.isEmpty(userAccount.getUserName())) {
			return new ResultBean(ResultBean.RETCODE_FAIL, "用户名不能为空");
		}
		if (null == userAccount.getAccessSys()) {
			return new ResultBean(ResultBean.RETCODE_FAIL, "请选择可访问系统");
		}
		if (null == userAccount.getAccountStatus()) {
			return new ResultBean(ResultBean.RETCODE_FAIL, "请选择用户状态");
		}
		if (null == userAccount.getGroupId()) {
			return new ResultBean(ResultBean.RETCODE_FAIL, "请选择用户角色");
		}
		if (null == userAccount.getIsAdmin()) {
			return new ResultBean(ResultBean.RETCODE_FAIL, "请选择是否管理员");
		}
		if (null == userAccount.getOfficeId()) {
			return new ResultBean(ResultBean.RETCODE_FAIL, "请选择分支机构");
		}
		try {
			// 如果用户id为空则是执行新增，否则为修改
			if (null == userAccount.getUserId() || userAccount.getUserId() < 0) {
				opName = "新增";
				message = OpResultConstants.INSERT_SUCCESSED;
				userAccountService.save(userAccount);
			} else {
				opName = "修改";
				message = OpResultConstants.UPDATE_SUCCESSED;
				userAccountService.update(userAccount);
			}
			// 此处为返回页面并刷新数据
			return new ResultBean(ResultBean.RETCODE_SUCCESS, message);
		}catch(AppException e) {
			return new ResultBean(ResultBean.RETCODE_FAIL, e.getMessage());
		} 
		catch (DuplicateKeyException duplicateKeyException) {
			log.error("An exception occurs when the [Dept] information is" + opName + "- ", duplicateKeyException);
			return new ResultBean(ResultBean.RETCODE_FAIL, "员工姓名或用户名不能重复！");
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.error("An exception occurs when the [Dept] information is" + opName + "- ", e);
			return new ResultBean(ResultBean.RETCODE_FAIL, ResultBean.MSG_FAIL);
		}
	}

	/**
	 * @函数名称：delete
	 * @创建日期：2017年4月11日
	 * @功能说明：执行删除用户账户操作
	 * @参数说明：request 请求对象
	 * @参数说明：nti 菜单id
	 * @参数说明：userAccountId 部门ID
	 * @返回说明：ModelAndView
	 */
	@RequestMapping(value = "/delete", method = RequestMethod.POST)
	public @ResponseBody ResultBean delete(Integer userId) {
		try {
			String message = "";
			UserAccount user = LoginTokenSessionHelper.getCurrentUser();
			if(user == null) {
				return new ResultBean(ErrorCode.USER_NOT_LOGIN, "请先登陆");
			}
			message = userAccountService.delete(userId, user.getUserId());
			// 如果是存在相同的，就返回错误的提示信息界面
			if (message.equals(OpResultConstants.DEPT_USED)) {
				return new ResultBean(message);
			}
			// 此处为返回页面并刷新数据
			return new ResultBean(message);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return new ResultBean(ResultBean.RETCODE_FAIL, ResultBean.MSG_FAIL);
		}

	}

	/**
	 * 
	 * @函数名称：pwd
	 * @创建日期：2016年6月29日
	 * @功能说明：用户点击修改密码的时候跳到修改密码页面
	 * @参数说明：model 页面对象
	 * @参数说明：userId 用户ID
	 * @返回说明：String
	 */
	@RequestMapping(value = "/pwd")
	public String pwd() {
		return "setting/modify_password";
	}

	/**
	 * 
	 * @函数名称：updatePwd
	 * @创建日期：2016年6月29日
	 * @功能说明：修改当前用户密码
	 * @参数说明：request 页面请求对象
	 * @参数说明：empId 用户ID
	 * @参数说明：oldPwd 旧密码
	 * @参数说明：newPwd 新密码
	 * @返回说明：ModelAndView
	 */
	@RequestMapping(value = "/upd_account_pwd", method = RequestMethod.POST)
	public @ResponseBody ResultBean updatePwd(String newPwd, String oldPwd, String newPwdConfirm, HttpSession session) {
		UserAccount user = LoginTokenSessionHelper.getCurrentUser();
		if(user == null) {
			return new ResultBean(ErrorCode.USER_NOT_LOGIN, "请先登录！");
		}
		if (StringUtils.isEmpty(oldPwd)) {
			return new ResultBean(ResultBean.RETCODE_FAIL, "请输入原密码！");
		}
		if (StringUtils.isEmpty(newPwd)) {
			return new ResultBean(ResultBean.RETCODE_FAIL, "请输入新密码！");
		}
		if (StringUtils.isEmpty(newPwdConfirm)) {
			return new ResultBean(ResultBean.RETCODE_FAIL, "请确认新密码！");
		}
		
		/**
		 * DES解密账号密码
		 */
		String decypOldPwd = null;
		String decypNewPwd = null;
		try {
			decypOldPwd = DESUtil.decryption(oldPwd);
			decypNewPwd = DESUtil.decryption(newPwd);
		} catch (Exception e1) {
			e1.printStackTrace();
		}
		
		try {
			String message = "";
			if (!user.getLoginPwd().equals(PasswordHelper.encryption(user.getUserName(), decypOldPwd))) {// 如果输入的旧密码有误
				message = OpResultConstants.OLD_PASSWORD_ERROR;
				return new ResultBean(ResultBean.RETCODE_FAIL, message);
			} else {// 否则，修改密码，同时将新密码存入到Session中
				message = userAccountService.updatePwd(user.getUserId().intValue(), decypNewPwd, user.getUserName());
				session.setAttribute(TokenSessionHelper.USERINFO_SESSION_KEY, user);
				return new ResultBean(ResultBean.RETCODE_SUCCESS, message);
			}
		}catch(AppException e) {
			return new ResultBean(ResultBean.RETCODE_FAIL, e.getMessage());
		} catch (Exception e) {
			log.error("[UserAccount] - An exception occurs when the password is changed - ", e);
			return new ResultBean(ResultBean.RETCODE_FAIL, OpResultConstants.OP_EXCEPTION);
		}
	}

	/**
	 * @函数名称：updateUserPwd
	 * @创建日期：2018年3月20日
	 * @功能说明：修改用户密码
	 * @参数说明：
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/upd_user_pwd", method = RequestMethod.POST)
	public @ResponseBody ResultBean updateUserPwd(String loginPwd, String conPassword, Integer userId, String userName) {

		String message = "";

		if (StringUtils.isEmpty(loginPwd)) {
			message = "请输入密码！";
			return new ResultBean(ResultBean.RETCODE_FAIL, message);
		}

		if (StringUtils.isEmpty(conPassword)) {
			message = "请确认新密码！";
			return new ResultBean(ResultBean.RETCODE_FAIL, message);
		}

		if (!loginPwd.equals(conPassword)) {
			message = "密码不一致，请重新输入！";
			return new ResultBean(ResultBean.RETCODE_FAIL, message);
		}

		/**
		 * DES解密账号密码
		 */
		String decypLoginPwd = null;
		String decypUserName = null;
		try {
			decypLoginPwd = DESUtil.decryption(loginPwd);
			decypUserName = DESUtil.decryption(userName);
		} catch (Exception e1) {
			e1.printStackTrace();
		}
		
		try {

			message = userAccountService.updatePwd(userId, decypLoginPwd, decypUserName);
			return new ResultBean(ResultBean.RETCODE_SUCCESS, message);

		}
		catch(AppException e) {
			return new ResultBean(ResultBean.RETCODE_FAIL, e.getMessage());
		} 
		catch (Exception e) {
			log.error("[UserAccount] - An exception occurs when the password is changed - ", e);
			return new ResultBean(ResultBean.RETCODE_FAIL, OpResultConstants.OP_EXCEPTION);
		}
	}
}
