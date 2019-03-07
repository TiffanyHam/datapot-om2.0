package com.datapot.web.nmap.assets.controller;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.datapot.contants.exception.AppException;
import com.datapot.contants.http.ErrorCode;
import com.datapot.contants.result.ResultBean;
import com.datapot.core.sys.sysoffice.service.ISysOfficeService;
import com.datapot.nmap.assets.domain.AssetsInfo;
import com.datapot.nmap.assets.dto.AssetsDetail;
import com.datapot.nmap.assets.dto.FilterDto;
import com.datapot.nmap.assets.dto.SearchDto;
import com.datapot.nmap.assets.service.AssetsInfoService;
import com.datapot.nmap.common.CommonPageSearchDto;
import com.datapot.nmap.constants.ScanStatus;
import com.datapot.nmap.constants.ScanType;
import com.datapot.nmap.scantask.domain.ScanTask;
import com.datapot.nmap.scantask.thread.ScanTaskGroup;
import com.datapot.nmap.scantask.thread.TaskExecute;
import com.datapot.nmap.spring.NMapComponent;
import com.datapot.nmap.util.IpSegmentUitl;
import com.datapot.persist.support.Pager;
import com.datapot.persist.sys.sysoffice.domain.SysOffice;
import com.datapot.persist.sys.useraccount.domain.UserAccount;
import com.datapot.persist.util.LoginTokenSessionHelper;
import com.datapot.utils.ip.IpUtil;

@Controller
@RequestMapping(value = "/om/assets")
public class AssetsInfoController {
	private Logger log = LoggerFactory.getLogger(AssetsInfoController.class); 
	@Autowired
	private AssetsInfoService assetsInfoService;
	@Autowired
	private ISysOfficeService sysOfficeService;
	@Autowired
	private TaskExecute taskExecute;
	@Autowired
	private NMapComponent nMapComponent;
	/**
	 * 资产扫描
	 * 可能调用时间很长
	 */
	@RequestMapping(value = "/scan")
	@ResponseBody
	public ResultBean assetsScan(HttpServletRequest request, String ips) {
		if(StringUtils.isBlank(ips)) {
			return new ResultBean(ResultBean.INPUT_ERROR, ResultBean.INPUT_ERROR_DESC);
		}
		log.debug("accept ips:" + ips);
		String nips = getIpParams(ips);
		log.debug("start cmd ips:" + nips);
		try {
			UserAccount ua = LoginTokenSessionHelper.getCurrentUser();
			if(ua == null) {
				return new ResultBean(ErrorCode.USER_NOT_LOGIN, "请登录");
			}
			
			ScanTaskGroup stg = new ScanTaskGroup();
			ScanTask st = new ScanTask();
			st.setScanParam(nips);
			st.setScanStatus(ScanStatus.QUEUE.getId());
			st.setScanner(ua.getUserName());
			st.setScanType(ScanType.ASSETS_FIND.getId());
			stg.setScanTask(st);
			Number id = taskExecute.queue(stg);
			return new ResultBean(id);
		} 
		catch(AppException e) {
			log.error(e.getMessage(), e);
			return new ResultBean(ResultBean.RETCODE_FAIL, e.getMessage());
		} 
		catch (Exception e) {
			log.error(e.getMessage(), e);
			return new ResultBean(ResultBean.MSG_FAIL,  "操作异常");
		}
	}
	
	
	
	private String getIpParams(String ips) {
		return IpSegmentUitl.getIpForNmap(ips);
	}


	@RequestMapping(value = "/add")
	@ResponseBody
	public ResultBean add(AssetsInfo assetsInfo) {
		try {
			IpUtil.validateIpv4(assetsInfo.getAssetsIp());
		}
		catch(AppException e) {
			log.error(e.getMessage(), e);
			return new ResultBean(ResultBean.RETCODE_FAIL, e.getMessage());
		} 
		catch(Exception e) {
			log.error(e.getMessage(), e);
			return new ResultBean(ResultBean.INPUT_ERROR, ResultBean.INPUT_ERROR_DESC);
		}
		try {
			AssetsInfo ai = assetsInfoService.save(assetsInfo);
			return new ResultBean(ai);
		}
		catch(AppException e) {
			log.error(e.getMessage(), e);
			return new ResultBean(ResultBean.RETCODE_FAIL, e.getMessage());
		} 
		catch(Exception e) {
			log.error(e.getMessage(), e);
			return new ResultBean(ResultBean.INPUT_ERROR,  "操作异常");
		}
	}
	
	
	@RequestMapping(value = "/index")
	public ModelAndView index() {
		ModelMap model = new ModelMap();  
		return new ModelAndView("/trafficAnalysis/assetProfile",model);
	}
	
	@RequestMapping(value = "/vulnIndex")
	public ModelAndView vulnIndex() {
		ModelMap model = new ModelMap();  
		return new ModelAndView("/trafficAnalysis/assetProfile",model);
	}
	
	/**
	 * 修改资产信息
	 * @param assetsInfo
	 * @return
	 */
	@RequestMapping(value = "/updateinfo/all")
	@ResponseBody
	public ResultBean updateAssets(AssetsInfo assetsInfo) {
		if(assetsInfo == null || assetsInfo.getAssetsId() == null) {
			return new ResultBean(ResultBean.INPUT_ERROR, ResultBean.INPUT_ERROR_DESC);
		}
		try {
			AssetsInfo ai =  assetsInfoService.updateAssetsInfo(assetsInfo);
			return new ResultBean(ai);
		}catch(AppException e) {
			log.error(e.getMessage(), e);
			return new ResultBean(ResultBean.RETCODE_FAIL, e.getMessage());
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return new ResultBean(ResultBean.MSG_FAIL,  "操作异常");
		}
	}
	
	
	/**
	 * 修改资产信息 assetsInfo中的null属性不会被修改，将保留原值
	 * @param assetsInfo
	 * @return
	 */
	@RequestMapping(value = "/updateinfo")
	@ResponseBody
	public ResultBean updateAssetsNotNull(AssetsInfo assetsInfo) {
		if(assetsInfo == null || assetsInfo.getAssetsId() == null) {
			return new ResultBean(ResultBean.INPUT_ERROR, ResultBean.INPUT_ERROR_DESC);
		}
		try {
			AssetsInfo ai =  assetsInfoService.updateAssetsInfoNotNull(assetsInfo);
			return new ResultBean(ai);
		}catch(AppException e) {
			log.error(e.getMessage(), e);
			return new ResultBean(ResultBean.RETCODE_FAIL, e.getMessage());
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return new ResultBean(ResultBean.MSG_FAIL, "操作异常");
		}
	}
	
	@RequestMapping(value = "/filter")
	@ResponseBody
	public ResultBean filter(FilterDto filter) {
		CommonPageSearchDto dto =  filter.convert2SearchDto();
		try {
			Pager<AssetsInfo> pager = assetsInfoService.getListForPage(dto.getPageSize(), dto.getPageNo(),
					dto.getFields(), dto.getWheres(), dto.getOrders());
			return new ResultBean(pager);
		}catch(AppException e) {
			log.error(e.getMessage(), e);
			return new ResultBean(ResultBean.RETCODE_FAIL, e.getMessage());
		} 
		catch (Exception e) {
			log.error(e.getMessage(), e);
			return new ResultBean(ResultBean.MSG_FAIL,  "操作异常");
		}
	}
	
	@RequestMapping(value = "/search")
	@ResponseBody
	public ResultBean pagerAssetsInfo(SearchDto search) {
		try {
			CommonPageSearchDto dto = search.convert2SearchDto();
			Pager<AssetsInfo> pager =  assetsInfoService.getListForPage(dto.getPageSize(), dto.getPageNo(),
					dto.getFields(), dto.getWheres(), dto.getOrders());
			return new ResultBean(pager);
		}catch(AppException e) {
			log.error(e.getMessage(), e);
			return new ResultBean(ResultBean.RETCODE_FAIL, e.getMessage());
		} 
		catch(Exception e) {
			log.error(e.getMessage(), e);
			return new ResultBean(ResultBean.MSG_FAIL,  "操作异常");
		}
	}
	
	/**
	 * 获取资产详情
	 * @param assetsId
	 * @return
	 */
	@RequestMapping(value = "/detail")
	@ResponseBody
	public ResultBean assetsDetail(Integer assetsId) {
		try {
			AssetsDetail detail = assetsInfoService.assetsDetail(assetsId);	
			
			if(detail != null) {
				Integer oid = detail.getAssetsInfo().getOfficeId();
				if(oid != null) {
					SysOffice so = sysOfficeService.getInfo(oid);
					if(so != null) {
						detail.getAssetsInfo().setOfficeName(so.getOfficeName());
					}
				}
			}
			return new ResultBean(detail);
		}
		catch(AppException e) {
			log.error(e.getMessage(), e);
			return new ResultBean(ResultBean.RETCODE_FAIL, e.getMessage());
		} 
		catch(Exception e) {
			log.error(e.getMessage(), e);
			return new ResultBean(ResultBean.MSG_FAIL,  "操作异常");
		}
	}
	
	
	@RequestMapping(value = "/delete")
	@ResponseBody
	public ResultBean delete(Integer assetsId) {
		try {
			AssetsInfo ai = assetsInfoService.delete(assetsId);
			return new ResultBean(ai);
		}
		catch(AppException e) {
			log.error(e.getMessage(), e);
			return new ResultBean(ResultBean.RETCODE_FAIL, e.getMessage());
		} 
		catch(Exception e) {
			log.error(e.getMessage(), e);
			return new ResultBean(ResultBean.MSG_FAIL,  "操作异常");
		}
	}
	
	@RequestMapping(value = "refresh ", method= RequestMethod.POST)
	@ResponseBody
	public ResultBean refresh(@RequestParam(required=false, name="url") String url, 
			@RequestParam(required=false, name="home") String home) {
		if(StringUtils.isBlank(url) && StringUtils.isBlank(home)) {
			return new ResultBean(ResultBean.INPUT_ERROR, ResultBean.INPUT_ERROR_DESC);
		}
		
		return new ResultBean(nMapComponent.refresh(url, home));
	}
}
