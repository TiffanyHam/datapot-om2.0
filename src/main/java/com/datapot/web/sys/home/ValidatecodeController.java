/**
 * @工程名称：datapot-om
 * @程序包名：com.datapot.web.sys.home
 * @程序类名：ValidatecodeController.java
 * @创建日期：2017年11月21日
 */
package com.datapot.web.sys.home;
import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.geom.Rectangle2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.Random;
import java.util.concurrent.TimeUnit;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.datapot.contants.redis.RedisContants;
import com.datapot.contants.result.ResultBean;
import com.datapot.core.util.MyMath;
import com.datapot.redis.om.VCodeDao;
import com.datapot.utils.redis.RedisUtil;
import com.sun.image.codec.jpeg.JPEGCodec;
import com.sun.image.codec.jpeg.JPEGEncodeParam;
import com.sun.image.codec.jpeg.JPEGImageEncoder;
/**
 * @功能说明：生成验证码
 * @创建人员：zhenghb
 * @变更记录：<BR>
 * 1、2017年11月21日 zhenghb 新建类
 */
@CrossOrigin
@Controller
public class ValidatecodeController {
	private Logger log = LoggerFactory.getLogger(ValidatecodeController.class);
	private static final long vCode_Expire_Second = 120L;
	@Autowired
	private VCodeDao vcodeDao;
	/**
	 * 
	 * @函数名称：validatecode
	 * @创建日期：2017年11月21日
	 * @功能说明：生成验证码
	 * @参数说明：
	 * @返回说明：void
	 */
	@RequestMapping(value="/validatecode")
	public void validatecode(HttpServletRequest request,HttpServletResponse response) throws IOException{
		String s = request.getParameter("fontcolor");
		int randomNum = MyMath.random(colorArray.length);// 得到随机数
		colorFont = s == null ? colorArray[randomNum][0] : s;// 000033
		String s1 = request.getParameter("backgroundcolor");
		colorBackground = s1 == null ? colorArray[randomNum][1] : s1;// 99CCCC
		try {
			width = Integer.parseInt(request.getParameter("width"));
		} catch (NumberFormatException numberformatexception) {
			width = widthDefault;
		}
		try {
			height = Integer.parseInt(request.getParameter("height"));
		} catch (NumberFormatException numberformatexception1) {
			height = heightDefault;
		}
		
		char ac[] = getCode();
		request.getSession(true).setAttribute(SESSION_VALIDATE_CODE, String.valueOf(ac));
		response.addHeader("token", request.getSession(true).getId());
		outputImage(response, buildImage(ac));
	}
	@ResponseBody
	@RequestMapping(value="/validatecode64")
	public ResultBean validatecode64(HttpServletRequest request,HttpServletResponse response) throws IOException{
		String s = request.getParameter("fontcolor");
		int randomNum = MyMath.random(colorArray.length);// 得到随机数
		colorFont = s == null ? colorArray[randomNum][0] : s;// 000033
		String s1 = request.getParameter("backgroundcolor");
		colorBackground = s1 == null ? colorArray[randomNum][1] : s1;// 99CCCC
		try {
			width = Integer.parseInt(request.getParameter("width"));
		} catch (NumberFormatException numberformatexception) {
			width = widthDefault;
		}
		try {
			height = Integer.parseInt(request.getParameter("height"));
		} catch (NumberFormatException numberformatexception1) {
			height = heightDefault;
		}
		
		char ac[] = getCode();
		String code = String.valueOf(ac);
		log.info("code:" +  code);
		log.info("token:" +  request.getSession(true).getId());
		request.getSession(true).setAttribute(SESSION_VALIDATE_CODE, code);
		response.addHeader("token", request.getSession(true).getId());
		BufferedImage bi = buildImage(ac);
		ByteArrayOutputStream outputStream = new ByteArrayOutputStream(); 
		ImageIO.write(bi, "jpg", outputStream);
		Base64.Encoder encoder = Base64.getEncoder();
		String base64Img = encoder.encodeToString(outputStream.toByteArray());
		response.setHeader("pragma", "NO-cache");
		response.setHeader("Cache-Control", "no-cache");
		response.setHeader("Cache-Control", "no-store");
		response.setDateHeader("Expries", 0L);
		ResultBean res =  new ResultBean(base64Img);
		//TODO:for debug.
		res.setMsg(code);
		return res;
	}
	
	
	@ResponseBody
	@RequestMapping(value="/vcode")
	public ResultBean vcode(HttpServletRequest request, HttpServletResponse response) throws IOException{
		String s = request.getParameter("fontcolor");
		int randomNum = MyMath.random(colorArray.length);// 得到随机数
		colorFont = s == null ? colorArray[randomNum][0] : s;// 000033
		String s1 = request.getParameter("backgroundcolor");
		colorBackground = s1 == null ? colorArray[randomNum][1] : s1;// 99CCCC
		try {
			width = Integer.parseInt(request.getParameter("width"));
		} catch (NumberFormatException numberformatexception) {
			width = widthDefault;
		}
		try {
			height = Integer.parseInt(request.getParameter("height"));
		} catch (NumberFormatException numberformatexception1) {
			height = heightDefault;
		}
		
		char ac[] = getCode();
		String code = String.valueOf(ac);
		log.info("code:" +  code);
		vcodeDao.setAndExpire(RedisUtil.generateRedisKey(RedisContants.VCODE, code.toLowerCase()), 1, vCode_Expire_Second, TimeUnit.SECONDS);
		BufferedImage bi = buildImage(ac);
		ByteArrayOutputStream outputStream = new ByteArrayOutputStream(); 
		ImageIO.write(bi, "jpg", outputStream);
		Base64.Encoder encoder = Base64.getEncoder();
		String base64Img = encoder.encodeToString(outputStream.toByteArray());
		response.setHeader("pragma", "NO-cache");
		response.setHeader("Cache-Control", "no-cache");
		response.setHeader("Cache-Control", "no-store");
		response.setDateHeader("Expries", 0L);
		ResultBean res =  new ResultBean(base64Img);
		//TODO:for debug.
		res.setMsg("");
		return res;
	}
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
	}

	private char[] getCode() {
		char ac[] = new char[4];
		Random random = new Random();
		for (int i = 0; i < 4; i++)
			ac[i] = chose.charAt(random.nextInt(chose.length()));

		return ac;
	}

	private BufferedImage buildImage(char ac[]) {
		Color color = new Color(Integer.valueOf(colorBackground, 16).intValue());
		Color color1 = new Color(Integer.valueOf(colorFont, 16).intValue());
		BufferedImage bufferedimage = new BufferedImage(width, height, 1);
		Graphics2D graphics2d = bufferedimage.createGraphics();
		graphics2d.setBackground(color);
		graphics2d.clearRect(0, 0, width, height);
		graphics2d.setColor(color1);
		// graphics2d.setFont(new Font("Times New Roman", 1, 18));
		// graphics2d.setFont(new Font("Times New Roman", 1, 16));
		int randomNum = MyMath.random(fontArray.length);// 得到随机数
		graphics2d.setFont(fontArray[randomNum]);// 设置随机字体
		char ac1[] = new char[ac.length * 2];
		for (int i = 0; i < ac.length; i++) {
			ac1[i * 2] = ac[i];
			ac1[i * 2 + 1] = ' ';
		}

		java.awt.font.FontRenderContext fontrendercontext = graphics2d.getFontRenderContext();
		Rectangle2D rectangle2d = graphics2d.getFont().getStringBounds(ac1, 0, ac1.length - 1, fontrendercontext);
		int j = (int) (((double) width - rectangle2d.getWidth()) / 2D);
		int k = (int) (((double) height - rectangle2d.getHeight()) / 2D);
		k += (int) (-rectangle2d.getY());
		graphics2d.drawChars(ac1, 0, ac1.length - 1, j, k);
		graphics2d.dispose();
		bufferedimage.flush();
		return bufferedimage;
	}

	private void outputImage(HttpServletResponse httpservletresponse, BufferedImage bufferedimage) throws IOException {
		httpservletresponse.setContentType("image/jpeg; charset=UTF-8");
		httpservletresponse.setHeader("pragma", "NO-cache");
		httpservletresponse.setHeader("Cache-Control", "no-cache");
		httpservletresponse.setHeader("Cache-Control", "no-store");
		httpservletresponse.setDateHeader("Expries", 0L);
		ServletOutputStream servletoutputstream = httpservletresponse.getOutputStream();
		JPEGImageEncoder jpegimageencoder = JPEGCodec.createJPEGEncoder(servletoutputstream);
		JPEGEncodeParam jpegencodeparam = jpegimageencoder.getDefaultJPEGEncodeParam(bufferedimage);
		jpegencodeparam.setQuality(1.0F, false);
		jpegimageencoder.setJPEGEncodeParam(jpegencodeparam);
		jpegimageencoder.encode(bufferedimage);
		servletoutputstream.close();
	}

	/**
	 * 功能：检测验证码是否有效
	 * 
	 * @param s
	 *            String 输入的验证码
	 * @param httpsession
	 *            HttpSession Session对象
	 * @param flag
	 *            boolean 是否区分大小写
	 * @return 是否有效
	 */
	public static boolean validateCode(String s, HttpSession httpsession, boolean flag) {
		String s1 = (String) httpsession.getAttribute(SESSION_VALIDATE_CODE);
		String s2 = s;
		if (!flag) {
			s1 = s1.toLowerCase();
			s2 = s.toLowerCase();
		}
		// logger.debug((new StringBuilder()).append("比对图形验证码[").append(s).append(",
		// ").append(s1).append("]").toString());
		return s1.equals(s2);
	}
	
	public static String SESSION_VALIDATE_CODE = "IMAGE_CODE";

	private final String chose = "0123456789abcdefghijkmnpqrstuvwxyABCDEFGHJKLMNPQRSTUVWXYZ";

	private int width;

	private int height;

	private final int widthDefault = 64;

	private final int heightDefault = 24;

	private String colorFont;

	private String colorBackground;

	private final String colorFontDefault = "ffffff";

	private final String colorBackgroundDefault = "ff9900";

	/* {字体颜色,底色} 数组，用于随机取不同颜色组合的验证码，防止验证码自动识别程序的攻击 */
	private final String[][] colorArray = new String[][] { { "FFFFFF", "FF9900" }, { "FFFF00", "AAAAD5" },
			{ "009900", "FFFF33" }, { "FF0099", "CCFF00" }, { "FF99FF", "009900" } };

	/* {字体} 数组，用于随机取不同的字体，防止验证码自动识别程序的攻击 */
	private final Font[] fontArray = new Font[] { new Font(null, 0, 16), new Font("Arial", 0, 16),
			new Font("黑体", 0, 16), new Font("方正姚体", 0, 16), new Font("Cambria", 0, 16), new Font("华文细黑", 0, 16),
			new Font("Times New Roman", 0, 16) };
}
