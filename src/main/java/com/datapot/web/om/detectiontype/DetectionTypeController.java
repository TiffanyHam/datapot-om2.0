/**
 * @工程名称：datapot-om
 * @程序包名：com.datapot.web.om.detectiontype
 * @程序类名：DetectionTypeController.java
 * @创建日期：2017年11月1日
 */
package com.datapot.web.om.detectiontype;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

import com.datapot.contants.enums.Priority;
import com.datapot.contants.enums.Stage;
import com.datapot.contants.operation.OpResultConstants;
import com.datapot.contants.result.ResultBean;
import com.datapot.core.om.detectiontype.domain.DetectionTypeQ;
import com.datapot.core.om.detectiontype.service.IDetectionTypeService;
import com.datapot.persist.om.detectiontype.domain.DetectionType;
import com.datapot.persist.support.Order;
import com.datapot.persist.support.Pager;
import com.datapot.web.base.BaseController;

/**
 * @功能说明：威胁类型Controller
 * @创建人员：Luxr
 * @变更记录：<BR> 1、2017年11月1日 Luxr 新建类
 */
@Controller
@RequestMapping("/om/detection_type")
public class DetectionTypeController extends BaseController {

	private final Logger log = LoggerFactory.getLogger(getClass());

	@Autowired
	private IDetectionTypeService detectionTypeService;

	/**
	 * @函数名称：index
	 * @创建日期：2017年9月8日
	 * @功能说明：分页查询方法
	 * @参数说明：classtypeQ 查询条件
	 * @返回说明：String
	 */
	@RequestMapping("/index")
	public String index(Model model, DetectionTypeQ query) {
		// 存储排序条件
		List<Order> orders = new ArrayList<Order>();
		orders.add(new Order("Stage", "DESC"));
		orders.add(new Order("Priority", "DESC"));
		Map<String, Object> map = new HashMap<String, Object>();
		if (StringUtils.isNotEmpty(query.getName())) {
			map.put("name", query.getName());
		}

		if (query.getPriorityQ() != null && query.getPriorityQ() != 0) {
			map.put("Priority", query.getPriorityQ());
		}

		if (query.getStageQ() != null && query.getStageQ() != 0) {
			map.put("Stage", query.getStageQ());
		}
		try {
			Pager<DetectionType> pager = detectionTypeService.getPageInfos(query.getNumPerPage(), query.getPageNum(), map,
					orders);
			model.addAttribute("priority", Priority.PRIORITY_TYPE_ZH);
			model.addAttribute("stage", Stage.STAGE_DATA);
			model.addAttribute("infos", pager);
		} catch (Exception e) {
			log.error("An error occurred while checking for paging information：", e);
		}
		return "setting/detection_type";
	}
	
	@ResponseBody
	@RequestMapping("/index.json")
	public ResultBean index_json(DetectionTypeQ query) {
		ResultBean result = new ResultBean();
		// 存储排序条件
		List<Order> orders = new ArrayList<Order>();
		orders.add(new Order("Stage", "DESC"));
		orders.add(new Order("Priority", "DESC"));
		Map<String, Object> map = new HashMap<String, Object>();
		if (StringUtils.isNotEmpty(query.getName())) {
			map.put("name", query.getName());
		}

		if (query.getPriorityQ() != null && query.getPriorityQ() != 0) {
			map.put("Priority", query.getPriorityQ());
		}

		if (query.getStageQ() != null && query.getStageQ() != 0) {
			map.put("Stage", query.getStageQ());
		}
		try {
			Pager<DetectionType> pager = detectionTypeService.getPageInfos(query.getNumPerPage(), query.getPageNum(), map,
					orders);
			Map<String, Object> model = new HashMap<String, Object>();
			model.put("priority", Priority.PRIORITY_TYPE_ZH);
			model.put("stage", Stage.STAGE_DATA);
			model.put("infos", pager);
			return new ResultBean(model);
		} catch (Exception e) {
			log.error("An error occurred while checking for paging information：", e);
			result.setRetCode(ResultBean.RETCODE_FAIL);
			result.setMsg("error.");
			return result;
		}
	}

	
	@ResponseBody
	@RequestMapping("/constant")
	public ResultBean constant() {
		Map<String, Object> model = new HashMap<String, Object>();
		model.put("priority", Priority.PRIORITY_TYPE_ZH);
		model.put("stage", Stage.STAGE_DATA);
		return new ResultBean(model);
	}
	/**
	 * @函数名称：index
	 * @创建日期：2017年9月8日
	 * @功能说明：分页查询方法
	 * @参数说明：classtypeQ 查询条件
	 * @返回说明：String
	 */
	@RequestMapping("/query")
	public @ResponseBody ResultBean query(DetectionTypeQ query) {
		// 存储排序条件
		List<Order> orders = new ArrayList<Order>();
		orders.add(new Order("Stage", "DESC"));
		orders.add(new Order("Priority", "DESC"));
		Map<String, Object> map = new HashMap<String, Object>();
		if (StringUtils.isNotEmpty(query.getName())) {
			map.put("name", query.getName());
		}

		if (query.getPriorityQ() != null && query.getPriorityQ() != 0) {
			map.put("Priority", query.getPriorityQ());
		}

		if (query.getStageQ() != null && query.getStageQ() != 0) {
			map.put("Stage", query.getStageQ());
		}
		try {
			Pager<DetectionType> pager = detectionTypeService.getPageInfos(query.getNumPerPage(), query.getPageNum(), map,
					orders);
			if (null != pager) {
				return new ResultBean(pager);
			} else {
				return new ResultBean(ResultBean.RETCODE_BLANK, "查询结果为空");
			}
		} catch (Exception e) {
			log.error("An error occurred while checking for paging information：", e);
			return new ResultBean(ResultBean.RETCODE_FAIL, OpResultConstants.OP_EXCEPTION);
		}
	}

	/**
	 * @函数名称：save
	 * @创建日期：2017年9月8日
	 * @功能说明：新增修改方法
	 * @参数说明：classtype 新增修改对象
	 * @返回说明：String
	 */
	@RequestMapping(value = "/save", method = RequestMethod.POST)
	public @ResponseBody ResultBean save(DetectionType detectionType) {
		String message = "";
		// 如果id为空时新增否则为修改
		try {
			if (detectionType.getId() == null || detectionType.getId() <= 0) {
				message = detectionTypeService.save(detectionType);
			} else {
				message = detectionTypeService.update(detectionType);
			}
			return new ResultBean(ResultBean.RETCODE_SUCCESS, message);
		} catch (DuplicateKeyException duplicateKeyException) {
			log.error("The inserted data is duplicated:", duplicateKeyException);
			return new ResultBean(ResultBean.RETCODE_FAIL, OpResultConstants.EXIST_SAME_DATA + "威胁类型");
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
		String message = detectionTypeService.delete(id);
		return new ResultBean(ResultBean.RETCODE_SUCCESS, message);
	}

	/**
	 * @函数名称：syncDataToRedis
	 * @创建日期：2017年10月17日
	 * @功能说明：同步数据到redis
	 * @参数说明：
	 * @返回说明：String
	 */
	@RequestMapping("/sync_data")
	public @ResponseBody ResultBean syncDataToRedis() {
		String message = detectionTypeService.syncToRedis();
		return new ResultBean(ResultBean.RETCODE_SUCCESS, message);
	}

	@RequestMapping("/detection_types")
	@ResponseBody
	public ResultBean detectionTypes() {
		Map<String, String> detectionTypes = detectionTypeService.findDetectionTypeMap();
		return new ResultBean(detectionTypes);
	}
}
