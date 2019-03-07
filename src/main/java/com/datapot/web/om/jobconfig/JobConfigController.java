/**
 * @工程名称：datapot-om
 * @程序包名：com.datapot.om.web
 * @程序类名：JobConfigController.java
 * @创建日期：2017年9月15日
 */
package com.datapot.web.om.jobconfig;

import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.datapot.contants.enums.BoolStatus;
import com.datapot.contants.result.ResultBean;
import com.datapot.core.om.jobconfig.domain.JobConfigReq;
import com.datapot.core.om.jobconfig.service.IJobConfigService;
import com.datapot.persist.om.jobconfig.domain.JobConfigV;
import com.datapot.redis.domain.JobConfig;
import com.datapot.web.base.BaseController;

/**
 * @功能说明：JobConfig控制类
 * @创建人员：Luxr
 * @变更记录：<BR> 1、2017年9月15日 Luxr 新建类
 */
@RequestMapping("/om/job_config")
@Controller
public class JobConfigController extends BaseController {
	private Log log = LogFactory.getLog(getClass());
	@Autowired
	private IJobConfigService jobConfigService;

	/**
	 * @函数名称：index
	 * @创建日期：2017年11月23日
	 * @功能说明：查询所有JobConfigV
	 * @参数说明：model Model对象
	 * @返回说明：String
	 */
	@RequestMapping("/index")
	public String index(Model model) {
		List<JobConfigV> list = jobConfigService.getJobConfigVs();
		model.addAttribute("jobConfigVs", list);
		model.addAttribute("status", BoolStatus.BOOL_STATUS);
		return "/setting/job_config";
	}

	/**
	 * @函数名称：index
	 * @创建日期：2017年11月23日
	 * @功能说明：查询所有JobConfigV
	 * @参数说明：
	 * @返回说明：ResultBean
	 */
	@RequestMapping("/query")
	public @ResponseBody ResultBean index() {
		List<JobConfigV> list = jobConfigService.getJobConfigVs();
		return new ResultBean(list);
	}

	/**
	 * @函数名称：save
	 * @创建日期：2017年9月20日
	 * @功能说明：保存所有的任务列表到mysql
	 * @参数说明：
	 * @返回说明：void
	 */
	@RequestMapping("/save_from_redis")
	public void saveFromRedis() {
		List<JobConfigV> configVs = jobConfigService.getJobConfigVs();
		// 新增前先把数据库里面之前的所有数据删除
		for (JobConfigV jobConfigV : configVs) {
			jobConfigService.delete(jobConfigV.getId());
		}
		// redis中获取所有的任务列表
		List<Object> list = jobConfigService.getJobConfigs();
		list.forEach(obj -> {
			JobConfig jobConfig = (JobConfig) obj;
			JobConfigV jobConfigV = new JobConfigV();
			jobConfigV.setCreateTime(jobConfig.getCreateTime());
			jobConfigV.setCron(jobConfig.getCron());
			jobConfigV.setDescription(jobConfig.getDesc());
			jobConfigV.setJob(jobConfig.getJob());
			jobConfigV.setJobClass(jobConfig.getJobClass());
			jobConfigV.setJobGroup(jobConfig.getJobGroup());
			jobConfigV.setStatus(jobConfig.getStatus());
			jobConfigV.setTriggerName(jobConfig.getTrigger());
			jobConfigV.setTriggerGroup(jobConfig.getTriggerGroup());
			jobConfigV.setTimeInterval(jobConfig.getTimeInterval());
			// jobConfigService.save(jobConfigV);
		});
	}

	/**
	 * @函数名称：saveToRedis
	 * @创建日期：2017年9月21日
	 * @功能说明：把数据保存到Redis
	 * @参数说明：
	 * @返回说明：void
	 */
	@RequestMapping("/save_to_redis")
	public void saveToRedis() {
		// 保存数据到Redis
		jobConfigService.saveToRedis();
	}

	/**
	 * @函数名称：save
	 * @创建日期：2017年9月21日
	 * @功能说明：保存JobConfigV
	 * @参数说明：JobConfigV jobConfigV
	 * @返回说明：void
	 */
	@RequestMapping("/save")
	public @ResponseBody ResultBean save(JobConfigReq jobConfigReq) {
		String message = "";
		try {
			if (jobConfigReq.getId() == 0) {
				message = jobConfigService.save(jobConfigReq);
			} else {
				// message = jobConfigService.save(jobConfigV);
			}
		} catch (DuplicateKeyException e) {
			message = "对不起，已存在相同定时任务名称！";
			return new ResultBean(ResultBean.RETCODE_FAIL, message);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.error("JobConfigController save method exception : ", e);
			message = "异常操作，请稍后重试或者联系管理员！";
			return new ResultBean(ResultBean.RETCODE_FAIL, message);
		}

		return new ResultBean(ResultBean.RETCODE_SUCCESS, message);
	}

	/**
	 * @函数名称：delete
	 * @创建日期：2017年9月21日
	 * @功能说明：删除单个
	 * @参数说明：id
	 * @返回说明：void
	 */
	@RequestMapping("/delete")
	public void delete(int id) {
		jobConfigService.delete(id);
	}

	/**
	 * @函数名称：updateActive
	 * @创建日期：2017年11月23日
	 * @功能说明：修改定时任务启用禁用状态
	 * @参数说明：
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/active", method = RequestMethod.POST)
	public @ResponseBody ResultBean updateActive(Integer jobId, Integer active) {
		String message = "";
		try {
			jobConfigService.updateActive(jobId, active);
			if (active == 1) {
				message = "启用成功！";
			} else {
				message = "禁用成功！";
			}

			return new ResultBean(ResultBean.RETCODE_SUCCESS, message);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			log.error("JobConfigController updateActive method exception : ", e);
			message = "修改状态失败，请稍后重试或联系管理员";
			return new ResultBean(ResultBean.RETCODE_FAIL, message);
		}
	}
}
