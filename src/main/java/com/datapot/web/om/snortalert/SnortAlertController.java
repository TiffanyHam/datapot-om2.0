/**
 * @工程名称：datapot-om
 * @程序包名：com.datapot.web.om.snortalert
 * @程序类名：SnortAlertController.java
 * @创建日期：2017年11月17日
 */
package com.datapot.web.om.snortalert;

import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRichTextString;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.util.CellRangeAddress;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.datapot.contants.enums.Protocol;
import com.datapot.contants.result.ResultBean;
import com.datapot.core.om.detectiontype.service.IDetectionTypeService;
import com.datapot.core.om.snortalert.domain.SnortAlertReq;
import com.datapot.core.om.snortalert.service.ISnortAlertService;
import com.datapot.core.om.snortclasstype.service.ISnortClasstypeService;
import com.datapot.persist.om.snortalert.domain.SnortAlert;
import com.datapot.persist.om.snortclasstype.domain.SnortClasstype;
import com.datapot.persist.support.Order;
import com.datapot.persist.support.Pager;
import com.datapot.persist.support.Where;
import com.datapot.utils.date.DateUtil;
import com.datapot.web.base.BaseController;

/**
 * @功能说明：
 * @创建人员：wendg
 * @变更记录：<BR> 1、2017年11月17日 wendg 新建类
 */
@Controller
@RequestMapping("/om/snort_alert")
public class SnortAlertController extends BaseController {
	private Log log = LogFactory.getLog(getClass());

	@Autowired
	private ISnortAlertService snortAlertService;

	@Autowired
	private IDetectionTypeService deteTypeService;

	private Map<String, String> map;

	@Autowired
	private ISnortClasstypeService snortClasstypeService;

	/**
	 * @函数名称：index
	 * @创建日期：2017年11月17日
	 * @功能说明：首页展示数据
	 * @参数说明：model Model
	 * @参数说明：snortAlertReq 威胁数据查询实体
	 * @返回说明：String
	 */
	@RequestMapping("/index")
	public String index(Model model, SnortAlertReq snortAlertReq) {
		Pager<SnortAlert> pager = null;
		try {
			List<Where> wheres = new ArrayList<Where>();
			if (StringUtils.isEmpty(snortAlertReq.getCollectTimeBegin())) {
				snortAlertReq.setCollectTimeBegin(DateUtil.getCurrentDate());
				wheres.add(new Where("CollectTime", ">=", snortAlertReq.getCollectTimeBegin() + " 00:00:00"));
			}
			if (StringUtils.isEmpty(snortAlertReq.getCollectTimeEnd())) {
				snortAlertReq.setCollectTimeEnd(DateUtil.getCurrentDate());
				wheres.add(new Where("CollectTime", "<=", snortAlertReq.getCollectTimeEnd() + " 23:59:59"));
			}
			List<String> fields = buildFile();
			List<Order> orders = new ArrayList<Order>();
			orders.add(new Order("AlertId", "DESC"));
			pager = snortAlertService.getInfos(snortAlertReq.getNumPerPage(), snortAlertReq.getPageNum(), fields, wheres,
					orders);
		} catch (Exception e) {
			log.error("SnortAlertController index method exception : ", e);
		}
		List<SnortClasstype> detectionTypes = snortClasstypeService.findAll(null, null, null);
		map = new HashMap<String, String>();
		for (SnortClasstype snortClasstype : detectionTypes) {
			map.put(snortClasstype.getId() + "", snortClasstype.getClasstypeZh());

		}
		model.addAttribute("query", snortAlertReq);
		model.addAttribute("detectionType", map);
		model.addAttribute("protocol", Protocol.PROTOCOL);
		model.addAttribute("infos", pager);
		return "/manage/snort_alert";
	}
	
	@ResponseBody
	@RequestMapping("/constant")
	public ResultBean constant() {
		List<SnortClasstype> detectionTypes = snortClasstypeService.findAll(null, null, null);
		map = new HashMap<String, String>();
		for (SnortClasstype snortClasstype : detectionTypes) {
			map.put(snortClasstype.getId() + "", snortClasstype.getClasstypeZh());
		}
		
		Map<String, Object> model = new HashMap<String, Object>();
		model.put("detectionType", map);
		model.put("protocol", Protocol.PROTOCOL);
		return new ResultBean(model);
	}
	

	/**
	 * @函数名称：index
	 * @创建日期：2017年11月17日
	 * @功能说明：加载页面
	 * @参数说明：snortAlertReq 警告数据查询实体
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/snort_alert_query", method = RequestMethod.POST)
	public @ResponseBody ResultBean query(SnortAlertReq snortAlertReq) {
		Pager<SnortAlert> pager = null;
		List<Where> wheres = buildWhere(snortAlertReq);
		List<String> fields = buildFile();
		List<Order> orders = new ArrayList<Order>();
		orders.add(new Order("CollectTime", "DESC"));
		try {
			pager = snortAlertService.getInfos(snortAlertReq.getNumPerPage(), snortAlertReq.getPageNum(), fields, wheres,
					orders);
		} catch (Exception e) {
			log.error("SnortAlertController query method exception : ", e);
		}
		return new ResultBean(pager);
	}

	/**
	 * @函数名称：getInfo
	 * @创建日期：2017年11月17日
	 * @功能说明：根据id查询实体
	 * @参数说明：alertId 警告数据id
	 * @返回说明：ResultBean
	 */
	@RequestMapping(value = "/get_info", method = RequestMethod.POST)
	public @ResponseBody ResultBean getInfo(Integer alertId) {
		SnortAlert snortAlert = snortAlertService.getInfo(alertId);
		return new ResultBean(snortAlert);
	}

	/**
	 * @函数名称：createExcel
	 * @创建日期：2018年4月19日
	 * @功能说明：导出数据
	 * @参数说明：
	 * @返回说明：String
	 */
	@RequestMapping(value = "/export")
	public void createExcel(HttpServletResponse response, SnortAlertReq snortAlertReq) throws IOException {
		if(snortAlertReq.getClasstypeId() != null && snortAlertReq.getClasstypeId().equals("undefined")) {
			snortAlertReq.setClasstypeId(null);
		}
		String fileName = "威胁告警报告";
		// 创建HSSFWorkbook对象(excel的文档对象)
		HSSFWorkbook wb = new HSSFWorkbook();
		// 设置样式
		HSSFCellStyle cellStyle = wb.createCellStyle();
		// 建立新的sheet对象（excel的表单）
		HSSFSheet sheet = wb.createSheet("威胁告警报告");

		// 在sheet里创建第一行，参数为行索引(excel的行)，可以是0～65535之间的任何一个
		HSSFRow row1 = sheet.createRow(0);
		// 创建单元格（excel的单元格，参数为列索引，可以是0～255之间的任何一个
		HSSFCell cell = row1.createCell(0);
		// 设置单元格内容
		cell.setCellValue("起始时间 ：" + snortAlertReq.getCollectTimeBegin() + "  结束时间：" + snortAlertReq.getCollectTimeEnd()
				+ " 威胁告警报告");
		HSSFCellStyle columnTopStyle = this.getColumnTopStyle(wb);// 获取列头样式对象
		cell.setCellStyle(columnTopStyle); // 设置列头单元格样式
		// 合并单元格CellRangeAddress构造参数依次表示起始行，截至行，起始列， 截至列
		sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 9));

		HSSFCellStyle style = this.getStyle(wb); // 单元格样式对象

		// 在sheet里创建第二行
		HSSFRow row2 = sheet.createRow(1);

		// 创建单元格并设置单元格内容
		String[] title = { "数据采集时间", "威胁类型", "协议", "源Ip", "源端口", "目标Ip", "目标端口", "目标IP所属国家", "目标IP所属城市", "消息" };
		for (int i = 0; i < title.length; i++) {
			// 设置列的宽度 单位像素
			sheet.setColumnWidth(i, 5000);
			row2.createCell(i).setCellValue(title[i]);
			HSSFCell cellRowName = row2.createCell(i); // 创建列头对应个数的单元格
			cellRowName.setCellType(HSSFCell.CELL_TYPE_STRING); // 设置列头单元格的数据类型
			HSSFRichTextString text = new HSSFRichTextString(title[i]);
			cellRowName.setCellValue(text); // 设置列头单元格的值
			cellRowName.setCellStyle(columnTopStyle); // 设置列头单元格样式
		}

		List<Where> wheres = buildWhere(snortAlertReq);
		List<String> fields = buildFile();
		List<Order> orders = new ArrayList<Order>();
		orders.add(new Order("AlertId", "DESC"));
		// 在sheet里创建第三行
		List<SnortAlert> alerts = snortAlertService.exportInfos(fields, wheres, orders);
		for (int i = 0; i < alerts.size(); i++) {
			HSSFRow row3 = sheet.createRow(i + 2);
			row3.createCell(0).setCellValue(alerts.get(i).getCollectTime());
			if (StringUtils.isNotEmpty(map.get(alerts.get(i).getClasstypeId() + ""))) {
				row3.createCell(1).setCellValue(map.get(alerts.get(i).getClasstypeId() + ""));
			} else {
				row3.createCell(1).setCellValue("");
			}
			row3.createCell(2).setCellValue(alerts.get(i).getProtocol());
			row3.createCell(3).setCellValue(alerts.get(i).getSrcIp());
			row3.createCell(4).setCellValue(alerts.get(i).getSrcPort());
			row3.createCell(5).setCellValue(alerts.get(i).getDstIp());
			row3.createCell(6).setCellValue(alerts.get(i).getDstPort());
			row3.createCell(7).setCellValue(alerts.get(i).getDstCountry());
			row3.createCell(8).setCellValue(alerts.get(i).getDstCity());
			row3.createCell(9).setCellValue(alerts.get(i).getMsg());
			for (int j = 0; j < 10; j++) {
				row3.getCell(j).setCellStyle(style);
			}
		}

		// 输出Excel文件
		OutputStream output = response.getOutputStream();
		response.reset();
		response.setContentType("application/octet-stream;charset=utf-8");
		response.setHeader("Content-Disposition", "attachment;filename=" + new String(fileName.getBytes(), "iso-8859-1")
				+ ".xls");
		wb.write(output);
		output.close();
	}

	private List<String> buildFile() {
		List<String> fields = new ArrayList<String>();
		fields.add("AlertId");
		fields.add("CollectTime");
		fields.add("ClasstypeId");
		fields.add("Protocol");
		fields.add("SrcIp");
		fields.add("SrcPort");
		fields.add("DstIp");
		fields.add("DstPort");
		fields.add("DstCountry");
		fields.add("DstCity");
		fields.add("Msg");
		return fields;
	}

	private List<Where> buildWhere(SnortAlertReq snortAlertReq) {
		List<Where> wheres = new ArrayList<Where>();
		Date startDate = null;
		Date endDate = null;
		if (StringUtils.isNotEmpty(snortAlertReq.getCollectTimeBegin())) {
			startDate = DateUtil.parse(snortAlertReq.getCollectTimeBegin(), DateUtil.LONGDATE_DATETIME);
			wheres.add(new Where("CollectTime", ">=", snortAlertReq.getCollectTimeBegin() + " 00:00:00"));
		}
		if (StringUtils.isNotEmpty(snortAlertReq.getCollectTimeEnd())) {
			endDate = DateUtil.parse(snortAlertReq.getCollectTimeEnd(), DateUtil.LONGDATE_DATETIME);
			wheres.add(new Where("CollectTime", "<=", snortAlertReq.getCollectTimeEnd() + " 23:59:59"));
		}
		if (startDate != null && endDate != null && startDate.getTime() > endDate.getTime()) {
			new ResultBean(ResultBean.RETCODE_FAIL, "开始时间不能大于结束时间");
		}
		if (StringUtils.isNotEmpty(snortAlertReq.getDstIp())) {
			wheres.add(new Where("DstIp", snortAlertReq.getDstIp()));
		}
		if (StringUtils.isNotEmpty(snortAlertReq.getProtocol())) {
			String protocolStr = snortAlertReq.getProtocol();
//			String[] protocolArr = protocolStr.split(",");
//			String protocol = "";
//			for (String pro : protocolArr) {
//				protocol += "'" + pro + "',";
//			}
//			wheres.add(new Where("Protocol", "IN", protocol.substring(0, protocol.length() - 1)));
			wheres.add(new Where("Protocol", protocolStr));
		}
		if (null != snortAlertReq.getClasstypeId()) {
			wheres.add(new Where("ClasstypeId", snortAlertReq.getClasstypeId()));
		}
		if (StringUtils.isNoneEmpty(snortAlertReq.getSrcIp())) {
			wheres.add(new Where("SrcIp", snortAlertReq.getSrcIp()));
		}
		return wheres;
	}

	/* * 列头单元格样式 */
	public HSSFCellStyle getColumnTopStyle(HSSFWorkbook workbook) {
		// 设置字体
		HSSFFont font = workbook.createFont();
		// 设置字体大小
		font.setFontHeightInPoints((short) 11);
		// 字体加粗
		font.setBold(true);
		// 设置字体名字
		font.setFontName("Courier New");
		// 设置样式;
		HSSFCellStyle style = workbook.createCellStyle();
		// 设置底边框;
		style.setBorderBottom(BorderStyle.THIN);
		// 设置底边框颜色;
		style.setBottomBorderColor(HSSFColor.BLACK.index);
		// 设置左边框;
		style.setBorderLeft(BorderStyle.THIN);
		// 设置左边框颜色;
		style.setLeftBorderColor(HSSFColor.BLACK.index);
		// 设置右边框;
		style.setBorderRight(BorderStyle.THIN);
		// 设置右边框颜色;
		style.setRightBorderColor(HSSFColor.BLACK.index);
		// 设置顶边框;
		style.setBorderTop(BorderStyle.THIN);
		// 设置顶边框颜色;
		style.setTopBorderColor(HSSFColor.BLACK.index);
		// 在样式用应用设置的字体;
		style.setFont(font);
		// 设置自动换行;
		style.setWrapText(false);
		// 设置水平对齐的样式为居中对齐;
		style.setAlignment(HorizontalAlignment.CENTER);
		// 设置垂直对齐的样式为居中对齐;
		style.setVerticalAlignment(VerticalAlignment.CENTER);
		return style;

	}

	/* * 列数据信息单元格样式 */
	public HSSFCellStyle getStyle(HSSFWorkbook workbook) {
		// 设置字体
		HSSFFont font = workbook.createFont();
		// 设置字体大小 //
		font.setFontHeightInPoints((short) 10);
		// 设置字体名字
		font.setFontName("Courier New");
		// 设置样式;
		HSSFCellStyle style = workbook.createCellStyle();
		// 设置底边框;
		style.setBorderBottom(BorderStyle.THIN);
		// 设置底边框颜色;
		style.setBottomBorderColor(HSSFColor.BLACK.index);
		// 设置左边框;
		style.setBorderLeft(BorderStyle.THIN);
		// 设置左边框颜色;
		style.setLeftBorderColor(HSSFColor.BLACK.index);
		// 设置右边框;
		style.setBorderRight(BorderStyle.THIN);
		// 设置右边框颜色;
		style.setRightBorderColor(HSSFColor.BLACK.index);
		// 设置顶边框;
		style.setBorderTop(BorderStyle.THIN);
		// 设置顶边框颜色;
		style.setTopBorderColor(HSSFColor.BLACK.index);
		// 在样式用应用设置的字体;
		style.setFont(font);
		// 设置自动换行;
		style.setWrapText(false);
		// 设置水平对齐的样式为居中对齐;
		style.setAlignment(HorizontalAlignment.CENTER);
		// 设置垂直对齐的样式为居中对齐;
		style.setVerticalAlignment(VerticalAlignment.CENTER);
		return style;
	}

}
