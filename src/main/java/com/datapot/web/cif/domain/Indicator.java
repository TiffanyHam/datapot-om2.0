package com.datapot.web.cif.domain;

import java.io.Serializable;
import javax.persistence.Entity;
import javax.persistence.GenerationType;
import javax.persistence.Table;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
@SuppressWarnings("serial")
@Table(name="indicator")
public class Indicator implements Serializable {
	/**
	*  
	*/
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;
	/**
	*  
	*/
	private String tags;
	/**
	*  
	*/
	private String indicator;
	/**
	*  
	*/
	private String provider;
	/**
	*  
	*/
	private String itype;
	/**
	*  
	*/
	private String portlist;
	/**
	*  
	*/
	private String cc;
	/**
	*  
	*/
	private String protocol;
	/**
	*  
	*/
	private String reporttime;
	/**
	*  
	*/
	private Float confidence;
	/**
	*  
	*/
	private String timezone;
	/**
	*  
	*/
	private String city;
	/**
	*  
	*/
	private String longitude;
	/**
	*  
	*/
	private String latitude;
	/**
	*  
	*/
	private String description;
	/**
	*  
	*/
	private String region;


	public void setId(Integer id) {
		this.id = id;
	}
	
	public Integer getId() {
		return this.id;
	}
	public void setTags(String tags) {
		this.tags = tags;
	}
	
	public String getTags() {
		return this.tags;
	}
	public void setIndicator(String indicator) {
		this.indicator = indicator;
	}
	
	public String getIndicator() {
		return this.indicator;
	}
	public void setProvider(String provider) {
		this.provider = provider;
	}
	
	public String getProvider() {
		return this.provider;
	}
	public void setItype(String itype) {
		this.itype = itype;
	}
	
	public String getItype() {
		return this.itype;
	}
	public void setPortlist(String portlist) {
		this.portlist = portlist;
	}
	
	public String getPortlist() {
		return this.portlist;
	}
	public void setCc(String cc) {
		this.cc = cc;
	}
	
	public String getCc() {
		return this.cc;
	}
	public void setProtocol(String protocol) {
		this.protocol = protocol;
	}
	
	public String getProtocol() {
		return this.protocol;
	}
	public void setReporttime(String reporttime) {
		this.reporttime = reporttime;
	}
	
	public String getReporttime() {
		return this.reporttime;
	}
	public void setConfidence(Float confidence) {
		this.confidence = confidence;
	}
	
	public Float getConfidence() {
		return this.confidence;
	}
	public void setTimezone(String timezone) {
		this.timezone = timezone;
	}
	
	public String getTimezone() {
		return this.timezone;
	}
	public void setCity(String city) {
		this.city = city;
	}
	
	public String getCity() {
		return this.city;
	}
	public void setLongitude(String longitude) {
		this.longitude = longitude;
	}
	
	public String getLongitude() {
		return this.longitude;
	}
	public void setLatitude(String latitude) {
		this.latitude = latitude;
	}
	
	public String getLatitude() {
		return this.latitude;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	
	public String getDescription() {
		return this.description;
	}
	public void setRegion(String region) {
		this.region = region;
	}
	
	public String getRegion() {
		return this.region;
	}

}
