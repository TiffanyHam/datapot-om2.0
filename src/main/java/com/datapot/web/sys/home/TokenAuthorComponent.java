package com.datapot.web.sys.home;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.datapot.core.sys.support.InitData;
import com.datapot.persist.sys.useraccount.domain.UserAccount;
import com.datapot.persist.util.LoginTokenSessionHelper;
import com.datapot.redis.sys.domain.SysMenuR;
import com.datapot.redis.sys.redisdao.SysMenuGroupRedisDao;
import com.datapot.redis.sys.redisdao.SysMenuRedisDao;
import com.datapot.token.web.author.TokenAuthorService;


@Service
public class TokenAuthorComponent implements TokenAuthorService {
	@Autowired
	private SysMenuGroupRedisDao sysMenuGroupRedisDao;
	@Autowired
	private SysMenuRedisDao sysMenuRedisDao;
	@Autowired
	private InitData initData;
	
	/**
	 * 启动时加载菜单缓存
	 */
	@PostConstruct
	public void loadUrlAuthorFromDb() {
		initData.initMenu();
	}
	
	
	/** 该实现效率极低 */
	/**
	 * 1. 拦截的url缓存本地。 
	 * 2. 获取url所需的groups
	 * 3. 比较 groups 和 用户登陆的 groupid
	 */
	@Override
	public boolean hasPerssion(String uri) {
		SysMenuR menu = sysMenuRedisDao.getUrl(uri);
		if(menu == null) { //不需要拦截
			return true;
		}
		
		int active = menu.getIsActive();
		if(active != 1) {
			return true;
		}
		
		UserAccount userAccount =  LoginTokenSessionHelper.getCurrentUser();
		if(userAccount == null) { //用户没有登录
			return false;
		}
		
		Integer group = sysMenuGroupRedisDao.getMenuGroup(uri, userAccount.getGroupId());
		if(group != null) {
			return true;
		}
		
		return false;
	}
}
