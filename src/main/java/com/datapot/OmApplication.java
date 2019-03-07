/**
 * @工程名称：datapot-om
 * @程序包名：com.datapot.om
 * @程序类名：OmApplication.java
 * @创建日期：2017年8月30日
 */
package com.datapot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.web.MultipartAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import org.springframework.web.socket.server.standard.ServerEndpointExporter;

import com.datapot.persist.config.DynamicDataSourceRegister;

/**
 * @功能说明：
 * @创建人员：zhenghb
 * @变更记录：<BR> 1、2017年8月30日 zhenghb 新建类
 */
@Import({ DynamicDataSourceRegister.class })
// 注册动态多数据源
@ServletComponentScan
@EnableTransactionManagement
@SpringBootApplication
@ComponentScan("com.datapot")
@EnableAutoConfiguration(exclude = {MultipartAutoConfiguration.class})  
public class OmApplication extends SpringBootServletInitializer {
	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
		return builder.sources(OmApplication.class);
	}

	public static void main(String[] args) {
		SpringApplication.run(OmApplication.class, args);

	}

//	@Bean
	public ServerEndpointExporter serverEndpointExporter() {
		return new ServerEndpointExporter();
	}
	
	/**
	 * @函数名称：multipartResolver
	 * @创建日期：2018年3月14日
	 * @功能说明：文件上传配置  
	 * @参数说明：
	 * @返回说明：MultipartResolver
	 */
  @Bean
  public MultipartResolver multipartResolver(){
  	MultipartResolver multipartResolver = new CommonsMultipartResolver();
  	return multipartResolver;
  }

}
