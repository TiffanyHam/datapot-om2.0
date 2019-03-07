/**
 * @工程名称：datapot-om
 * @程序包名：com.datapot.om.web
 * @程序类名：SnortRuleController.java
 * @创建日期：2017年9月15日
 */
package com.datapot.web.om.snortrule;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.datapot.contants.enums.ActionType;
import com.datapot.contants.enums.Protocol;
import com.datapot.contants.operation.OpResultConstants;
import com.datapot.contants.result.ResultBean;
import com.datapot.core.om.snortclasstype.service.ISnortClasstypeService;
import com.datapot.core.om.snortrules.domain.SnortRulesReq;
import com.datapot.core.om.snortrules.service.ISnortRulesService;
import com.datapot.core.util.Properties;
import com.datapot.persist.om.snortclasstype.domain.SnortClasstype;
import com.datapot.persist.om.snortrules.domain.SnortRule;
import com.datapot.persist.support.Order;
import com.datapot.persist.support.Pager;
import com.datapot.persist.support.Where;

/**
 * @功能说明：snort过滤规则
 * @创建人员：wendg
 * @变更记录：<BR> 1、2017年9月15日 wendg 新建类
 */
@Controller
@RequestMapping("/om/snort_rule")
public class SnortRuleController {
	private Log log = LogFactory.getLog(getClass());

	@Autowired
	private ISnortRulesService rulesService;

	@Autowired
	private ISnortClasstypeService snortClasstypeService;

	@Autowired
	private Properties prop;

	/**
	 * @函数名称：index
	 * @创建日期：2017年11月22日
	 * @功能说明：首页展示信息
	 * @参数说明：
	 * @返回说明：String
	 */
	@RequestMapping(value = "/index")
	public String index(Model model, SnortRulesReq querys) {
		List<Order> orders = this.generateOrders(querys);
		List<Where> wheres = new ArrayList<Where>();
		Pager<SnortRule> pager = null;
		Map<String, String> actionsType = ActionType.ACTION_TYPE;
		Map<String, String> protocolMap = Protocol.PROTOCOL;
		Map<String, String> snortClassTypeMap = new LinkedHashMap<String, String>();
		try {
			// 获取部门分页信息	
			pager = rulesService.getInfos(querys.getNumPerPage(), querys.getPageNum(), null, wheres, orders);

			List<SnortClasstype> list = snortClasstypeService.findAll(null, null, null);
			for (SnortClasstype snortClasstype : list) {
				snortClassTypeMap.put(snortClasstype.getClasstype(), snortClasstype.getClasstypeZh());
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.error("CompanyIpController index method exception : ", e);
		}

		model.addAttribute("actionsType", actionsType);
		model.addAttribute("protocolMap", protocolMap);
		model.addAttribute("snortClassTypeMap", snortClassTypeMap);
		model.addAttribute("infos", pager);
		return "/setting/snort_rules";
	}
	
	@ResponseBody
	@RequestMapping(value = "constant")
	public ResultBean constant() {
		Map<String, String> actionsType = ActionType.ACTION_TYPE;
		Map<String, String> protocolMap = Protocol.PROTOCOL;
		Map<String, String> snortClassTypeMap = new LinkedHashMap<String, String>();
		Map<String, Object> model = new HashMap<String, Object>();
		model.put("actionsType", actionsType);
		model.put("protocolMap", protocolMap);
		try {
			List<SnortClasstype> list = snortClasstypeService.findAll(null, null, null);
			for (SnortClasstype snortClasstype : list) {
				snortClassTypeMap.put(snortClasstype.getClasstype(), snortClasstype.getClasstypeZh());
			}
		} catch (Exception e) {
			log.error("CompanyIpController index method exception : ", e);
		}
		model.put("snortClassTypeMap", snortClassTypeMap);
		return new ResultBean(model);
	}

	/**
	 * @函数名称：query
	 * @创建日期：2017年11月22日
	 * @功能说明：供查询调用
	 * @参数说明：querys SnortRulesReq查询实体
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/query", method = RequestMethod.POST)
	public @ResponseBody ResultBean query(SnortRulesReq querys) {
		List<Order> orders = this.generateOrders(querys);
		List<Where> wheres = new ArrayList<Where>();
		if (StringUtils.isNotBlank(querys.getActionQ())) {
			wheres.add(new Where("UPPER(Action)", querys.getActionQ().toUpperCase()));
		}

		if (StringUtils.isNotBlank(querys.getProtocolQ())) {
			wheres.add(new Where("UPPER(Protocol)", querys.getProtocolQ().toUpperCase()));
		}

		if (StringUtils.isNotBlank(querys.getClassTypeQ())) {
			wheres.add(new Where("UPPER(Classtype)", querys.getClassTypeQ().toUpperCase()));
		}
		Pager<SnortRule> pager = null;
		try {
			// 获取部门分页信息
			pager = rulesService.getInfos(querys.getNumPerPage(), querys.getPageNum(), null, wheres, orders);

		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.error("CompanyIpController index method exception : ", e);
		}

		return new ResultBean(pager);
	}

	/**
	 * @函数名称：getInfos
	 * @创建日期：2017年11月22日
	 * @功能说明：根据id查询实体类
	 * @参数说明：sid 过滤规则id
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/get_info")
	public @ResponseBody ResultBean getInfos(Integer sid) {
		SnortRule snortRule = rulesService.getInfo(sid);
		return new ResultBean(snortRule);
	}

	/**
	 * @函数名称：initOrders
	 * @创建日期：2017年4月10日
	 * @功能说明：初始排序信息集合
	 * @参数说明：query 查询条件
	 * @返回说明：List<Order>
	 */
	private List<Order> generateOrders(SnortRulesReq query) {
		List<Order> orders = new ArrayList<Order>();
		orders.add(new Order("Sid", "ASC"));
		return orders;
	}

	/**
	 * @throws Exception 
	 * @函数名称：save
	 * @创建日期：2017年11月23日
	 * @功能说明：上传文件，并解析文件后把内容保存到数据库与redis
	 * @参数说明：file MultipartFile文件对象
	 * @返回说明：ResultBean
	 */

	// @RequestMapping(value = "/save", method = RequestMethod.POST, consumes = "multipart/form-data")
	// public @ResponseBody ResultBean save(MultipartFile file, HttpServletResponse response,
	// HttpServletRequest request) {
	// ShiroHttpServletRequest shiroRequest = (ShiroHttpServletRequest) request;
	// CommonsMultipartResolver commonsMultipartResolver = new CommonsMultipartResolver();
	// MultipartHttpServletRequest multiRequest = commonsMultipartResolver
	// .resolveMultipart((HttpServletRequest) shiroRequest.getRequest());
	// // MultipartHttpServletRequest multiRequest = (MultipartHttpServletRequest) request;
	// Iterator<String> iterator = multiRequest.getFileNames();
	// // MultipartFile file = null;
	// while (iterator.hasNext()) {
	// String key = iterator.next();
	// file = multiRequest.getFile(key);
	//
	// }
	@RequestMapping(value = "/save", method = RequestMethod.POST, consumes = "multipart/form-data")
	public @ResponseBody ResultBean save(MultipartFile file, HttpServletResponse response, HttpServletRequest request)
			throws Exception {
		String path = "";
		String message = "";
		if (file == null) {
			message = "对不起，系统未找到该文件，请检查文件";
			return new ResultBean(ResultBean.RETCODE_FAIL, message);
		}
		// response.setContentType("application/json;charset=UTF-8");// 防止数据传递乱码
		String fileName = null;

		try {
			if (file == null && file.isEmpty()) {
				message = "对不起，您上传的文件为无效文件，请检查文件";
				return new ResultBean(ResultBean.RETCODE_FAIL, message);
			}
			log.info("get fileName : " + file.getOriginalFilename());
			fileName = file.getOriginalFilename();
			if (StringUtils.isEmpty(fileName)) {
				message = "请选择上传文件";
				return new ResultBean(ResultBean.RETCODE_FAIL, message);
			}
			// 进一步判断文件是否为空（即判断其大小是否为0或其名称是否为null）
			long size = file.getSize();
			if (fileName == null || ("").equals(fileName) && size == 0) {
				message = "获取文件异常，请稍后重试";
				return new ResultBean(ResultBean.RETCODE_FAIL, message);
			}
			// 不能上传可执行文件到服务器
			if (fileName.contains(".exe") || fileName.contains(".bat")) {
				message = "不能上传可执行文件";
				return new ResultBean(ResultBean.RETCODE_FAIL, message);
			} else if (!fileName.contains(".rules")) {
				message = "对不起，您上传的文件为无效文件，请检查文件";
				return new ResultBean(ResultBean.RETCODE_FAIL, message);
			}

			String docPath = null;
			String systemType = System.getProperties().getProperty("os.name");
			if (systemType.toLowerCase().contains("windows")) {
				// 获取 windows 系统路径
				docPath = prop.getUplodadWindPath();
			} else {
				// 获取 Linux 系统路径
				docPath = prop.getUplodadLinuxPath();
			}
			log.info("docPath    -       " + docPath);
			File fileMkdirs = new File(docPath);
			// 创建一个目录 （它的路径名由当前 File 对象指定，包括任一必须的父路径。）
			if (!fileMkdirs.exists()) {
				fileMkdirs.mkdirs();
			}

			// 文件路径
			path = docPath + File.separator + fileName;
			log.info("path    -       " + path);
			OutputStream fos = null;

			try {
				fos = new FileOutputStream(path);
				InputStream is = file.getInputStream();
				byte[] buffer = new byte[2048];
				int count = 0;
				while ((count = is.read(buffer)) > 0) {
					fos.write(buffer, 0, count);
				}
				fos.close();
				is.close();
			} catch (Exception e) {
				log.error("SnortRuleController save method IOException: ", e);
				message = "上传文件失败，请联系管理员";
				return new ResultBean(ResultBean.RETCODE_FAIL, message);
			}
			message = rulesService.parseSnortRules(path);
			return new ResultBean(ResultBean.RETCODE_SUCCESS, message);
		} catch (DuplicateKeyException e) {
			log.error("SnortRuleController save method DuplicateKeyException: ", e);
			message = OpResultConstants.EXIST_SAME_DATA + "sid";
			return new ResultBean(ResultBean.RETCODE_FAIL, message);
			// TODO Auto-generated catch block
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.error("SnortRuleController save method Exception: ", e);
			message = OpResultConstants.SYSTEM_ERROR;
			return new ResultBean(ResultBean.RETCODE_FAIL, message);
		}

	}

	@RequestMapping("/init")
	public String init() {
		try {
			rulesService.syncSnortRulesToRedis();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return "";
	}
}
