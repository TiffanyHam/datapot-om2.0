/**
 * @工程名称：datapot-om
 * @程序包名：com.datapot.web.om.detectionscore
 * @程序类名：DetectionScoreController.java
 * @版权归属：datapot.com
 */
package com.datapot.web.om.detectionscore;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.datapot.contants.operation.OpResultConstants;
import com.datapot.core.om.detectionscore.service.IDetectionScoreService;
import com.datapot.core.util.Properties;

/**
 * @功能说明：威胁分数表
 * @创建日期：2017年11月18日
 * @变更记录： 1、2017年11月18日 JackyWang 新建类
 */
@Controller
@RequestMapping(value = "/detection_score")
public class DetectionScoreController {
	private final Logger log = LoggerFactory.getLogger(getClass());

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
}
