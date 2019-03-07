/**
 * @工程名称：datapot-om
 * @程序包名：com.datapot.om.snortclasstype
 * @程序类名：SnortClasstypeController.java
 * @创建日期：2017年9月7日
 */
package com.datapot.web.om.snortclasstype;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.datapot.contants.enums.Priority;
import com.datapot.contants.operation.OpResultConstants;
import com.datapot.contants.result.ResultBean;
import com.datapot.core.om.snortclasstype.domain.SnortClasstypeReq;
import com.datapot.core.om.snortclasstype.service.ISnortClasstypeService;
import com.datapot.core.util.Properties;
import com.datapot.persist.om.snortclasstype.domain.SnortClasstype;
import com.datapot.persist.support.Order;
import com.datapot.web.base.BaseController;

/**
 * @功能说明：Snort警告类型控制类
 * @创建人员：luxr
 * @变更记录：<BR> 1、2017年9月7日 luxr 新建类
 * @变更记录：<BR> 2、2017年9月11日 luxr
 */
@Controller
@RequestMapping("/om/snort_classtype")
public class SnortClasstypeController extends BaseController {

	private final Logger log = LoggerFactory.getLogger(getClass());

	@Autowired
	private ISnortClasstypeService classtypeService;

	@Autowired
	private Properties prop;

	/**
	 * @函数名称：index
	 * @创建日期：2017年9月8日
	 * @功能说明：分页查询方法
	 * @参数说明：classtypeQ 查询条件
	 * @返回说明：String
	 */
	@RequestMapping("/index")
	public String index(SnortClasstypeReq classtypeQ, Model model) {
		// 存储排序条件
		List<Order> orders = new ArrayList<Order>();
		orders.add(new Order("Category", "DESC"));
		orders.add(new Order("Priority", "DESC"));
		Map<String, String> map = Priority.PRIORITY_DESCRIPTION;
		List<SnortClasstype> list = null;
		// Pager<SnortClasstype> pager = null;
		try {
			// pager = classtypeService.getPageInfos(classtypeQ.getNumPerPage(),
			// classtypeQ.getPageNum(),
			// null, null, orders);
			list = classtypeService.findAll(null, null, orders);
		} catch (Exception e) {
			log.error("An error occurred while checking for paging information：", e);
		}
		model.addAttribute("infos", list);
		model.addAttribute("prioritys", map);
		return "/setting/snort_classtype";
	}

	/**
	 * @函数名称：index
	 * @创建日期：2017年9月8日
	 * @功能说明：分页查询方法
	 * @参数说明：classtypeQ 查询条件
	 * @返回说明：String
	 */
	@RequestMapping("/query")
	public @ResponseBody ResultBean query() {
		// 存储排序条件
		List<Order> orders = new ArrayList<Order>();
		orders.add(new Order("Category", "DESC"));
		orders.add(new Order("Priority", "DESC"));
		try {
			List<SnortClasstype> snortClasstypes = classtypeService.findAll(null, null, orders);
			if (null != snortClasstypes) {
				Map<String, Object> map = new HashMap<>();
				map.put("priority", Priority.PRIORITY_DESCRIPTION);
				return new ResultBean(snortClasstypes);
			} else {
				return new ResultBean(ResultBean.RETCODE_BLANK, ResultBean.MSG_BLANK);
			}
		} catch (Exception e) {
			log.error("An error occurred while checking for paging information：", e);
		}
		return null;
	}

	/**
	 * @函数名称：edit
	 * @创建日期：2017年9月8日
	 * @功能说明：跳转到编辑页面加载数据
	 * @参数说明：id 主键
	 * @返回说明：String
	 */
	@RequestMapping(value = "/init", method = RequestMethod.POST)
	public @ResponseBody ResultBean edit(Integer id) {
		Map<String, Object> map = new HashMap<>();
		map.put("priority", Priority.PRIORITY_DESCRIPTION);
		if (null != id && id > 0) {
			SnortClasstype classtype = classtypeService.find(id);
			map.put("classtype", classtype);
		}
		return new ResultBean(map);
	}

	/**
	 * @函数名称：save
	 * @创建日期：2017年9月8日
	 * @功能说明：新增修改方法
	 * @参数说明：classtype 新增修改对象
	 * @返回说明：String
	 */
	@RequestMapping(value = "/save", method = RequestMethod.POST)
	public @ResponseBody ResultBean save(SnortClasstype classtype) {
		String message = "";
		// 如果id为空时新增否则为修改
		try {
			if (classtype.getId() == null || classtype.getId() <= 0) {
				message = classtypeService.save(classtype);
			} else {
				message = classtypeService.update(classtype);
			}
			return new ResultBean(message);
		} catch (DuplicateKeyException duplicateKeyException) {
			log.error("The inserted data is duplicated:", duplicateKeyException);
			return new ResultBean(ResultBean.RETCODE_FAIL, OpResultConstants.EXIST_SAME_DATA + "SnortClasstype");
		} catch (Exception e) {
			log.error("An exception occurs when the change occurs：", e);
			return new ResultBean(ResultBean.RETCODE_FAIL, ResultBean.MSG_FAIL);
		}
	}

	/**
	 * @函数名称：delete
	 * @创建日期：2017年9月8日
	 * @功能说明：删除方法
	 * @参数说明：id 主键
	 * @返回说明：String
	 */
	@RequestMapping(value = "/delete", method = RequestMethod.POST)
	public @ResponseBody ResultBean delete(Integer id) {
		String message = classtypeService.delete(id);
		return new ResultBean(message);
	}

	/**
	 * @函数名称：syncDataToRedis
	 * @创建日期：2017年10月17日
	 * @功能说明：同步数据到redis
	 * @参数说明：
	 * @返回说明：String
	 */
	@RequestMapping("/sync_data")
	public String syncDataToRedis() {
		String message = classtypeService.syncClassTypToRedis();
		return "/setting/initialise";
	}

	/**
	 * @函数名称：importExcel
	 * @创建日期：2017年11月14日
	 * @功能说明：上传excel文件，并解析
	 * @参数说明：
	 * @返回说明：String
	 */
	@RequestMapping(value = "/import_excel", method = RequestMethod.POST)
	public @ResponseBody ResultBean importExcel(MultipartFile file) {
		String path = "";
		String message = "";
		try {
			if (null == file) {
				message = "系统错误，未找到该文件";
				return new ResultBean(ResultBean.RETCODE_FAIL, message);
			}
			String filename = file.getOriginalFilename();
			// 进一步判断文件是否为空（即判断其大小是否为0或其名称是否为null）
			long size = file.getSize();
			if (filename == null || ("").equals(filename) && size == 0)
				return null;
			// 不能上传可执行文件到服务器
			if (filename.contains(".exe") || filename.contains(".bat")) {
				message = "不能上传可执行文件";
				return new ResultBean(ResultBean.RETCODE_FAIL, message);
			}

			if (!(filename.contains(".xls") || filename.contains(".xlsx"))) {
				message = "请上传指定格式的excel文档";
				return new ResultBean(ResultBean.RETCODE_FAIL, message);
			}
			String docPath = null;
			String systemType = System.getProperties().getProperty("os.name");
			if (systemType.toLowerCase().contains("windows")) {
				/* 获取 windows 系统路径 */
				docPath = prop.getUplodadWindPath();
			} else {
				/* 获取 Linux 系统路径 */
				docPath = prop.getUplodadLinuxPath();
			}

			File fileMkdirs = new File(docPath);
			// 创建一个目录 （它的路径名由当前 File 对象指定，包括任一必须的父路径。）
			if (!fileMkdirs.exists()) {
				fileMkdirs.mkdirs();
			}

			// 文件路径
			path = docPath + File.separator + filename;
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

			message = classtypeService.importExcel(path);
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
}
