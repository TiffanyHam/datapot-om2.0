/**
 * @工程名称：datapot-om
 * @程序包名：com.datapot.web.om
 * @程序类名：InitialiseController.java
 * @创建日期：2017年11月23日
 */
package com.datapot.web.om.initialise;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.datapot.contants.http.ErrorCode;
import com.datapot.contants.operation.OpResultConstants;
import com.datapot.contants.result.ResultBean;
import com.datapot.core.om.companyip.service.ICompanyIpService;
import com.datapot.core.om.detectionscore.service.IDetectionScoreService;
import com.datapot.core.om.jobconfig.service.IJobConfigService;
import com.datapot.core.om.snortclasstype.service.ISnortClasstypeService;
import com.datapot.core.om.snortrules.service.ISnortRulesService;
import com.datapot.core.util.Properties;
import com.datapot.web.base.BaseController;
import com.google.common.base.Splitter;

/**
 * @功能说明：初始化Controller
 * @创建人员：Luxr
 * @变更记录：<BR> 1、2017年11月23日 Luxr 新建类
 */
@Controller
@RequestMapping("/om/initialise")
public class InitialiseController extends BaseController {

	private Log log = LogFactory.getLog(getClass());
	@Autowired
	private ISnortClasstypeService classtypeService;

	@Autowired
	private ISnortRulesService snortRuleService;

	@Autowired
	private IJobConfigService jobConfigService;

	@Autowired
	private ICompanyIpService companyIpService;

	@Autowired
	public IDetectionScoreService service;

	@Autowired
	private Properties prop;

	/**
	 * @函数名称：save
	 * @创建日期：2017年11月18日
	 * @功能说明：解析并保持信息
	 * @参数说明：
	 * @返回说明：
	 */
	@RequestMapping(value = "/save")
	public String save(HttpServletRequest request) {

		String opName = "";
		String file = prop.getFilePath();
		try {
			String[] filePaths = file.split(",");
			for (String path : filePaths) {
				service.save(path);
			}
			// 此处为返回页面并刷新数据
			return "";
		} catch (DuplicateKeyException duplicateKeyException) {
			log.error("[DetectionScore] - " + opName + "exception - ", duplicateKeyException);
			return OpResultConstants.EXIST_SAME_DATA + " ReferenceName";
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.error("[DetectionScore] - " + opName + "exception - ", e);
			return OpResultConstants.OP_EXCEPTION + " - " + file;
		}
	}

	/**
	 * @函数名称：syncDataToRedis
	 * @创建日期：2017年10月17日
	 * @功能说明：跳转初始化页面
	 * @参数说明：
	 * @返回说明：String
	 */
	@RequestMapping("/sync_data")
	public String syncDataToRedis() {
		return "/setting/initialise";
	}

	/**
	 * @函数名称：syncInit
	 * @创建日期：2017年11月23日
	 * @功能说明：同步数据到redis
	 * @参数说明：
	 * @返回说明：ResultBean
	 */
	@RequestMapping("/sync_init")
	public @ResponseBody ResultBean syncInit(Integer[] selectId) {
		String message = "";
		for (int j : selectId) {
			if (j == 1) {
				message = classtypeService.syncClassTypToRedis();
			}
			if (j == 2) {
				message = snortRuleService.syncSnortRulesToRedis();
			}
			if (j == 3) {
				message = jobConfigService.saveToRedis();
			}
			if (j == 4) {
				try {
					message = companyIpService.syncDataToRedis();
				} catch (Exception e) {
					// TODO Auto-generated catch block
					log.error("Init CompanyIp exception : ", e);
					return new ResultBean(ResultBean.RETCODE_FAIL, OpResultConstants.OP_EXCEPTION);
				}
			}
			if (j == 5) {
				// 新增之前先删除所有数据
				service.deleteAll();
				String file = prop.getFilePath();
				String[] filePaths = file.split(",");
				for (String path : filePaths) {
					try {
						message = service.save(path);
					} catch (Exception e) {
						log.error("Init Detetction exception : ", e);
						return new ResultBean(ResultBean.RETCODE_FAIL, OpResultConstants.OP_EXCEPTION);
					}
				}
			}
			if (j == 6) {
				message = service.syncDataToRedis();
			}
		}
		return new ResultBean(ResultBean.RETCODE_SUCCESS, message);
	}
	
	@RequestMapping("/sync_init.json")
	public @ResponseBody ResultBean syncInit_json(String selectIds) {
		if(StringUtils.isBlank(selectIds)){
			return new ResultBean(ErrorCode.APP_ERROR_APPERROR, "参数为空");
		}
		List<String> selectStrs = Splitter.on(",").splitToList(selectIds);
		Integer[] sIds = new Integer[selectStrs.size()];
		for(int i = 0; i < sIds.length; i++) {
			sIds[i] = Integer.parseInt(selectStrs.get(i).trim());
		}
		return syncInit(sIds);
	}
}
