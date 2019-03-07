package com.datapot.web.om.email.emailfrequency.domain;

import java.io.Serializable;
import javax.persistence.Entity;
import javax.persistence.GenerationType;
import javax.persistence.Table;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
@SuppressWarnings("serial")
@Table(name="email_frequency")
public class EmailFrequency implements Serializable {
	/**
	*  
	*/
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;
	/**
	*  
	*/
	private Integer frequency;
	/**
	*  
	*/
	private String uptime;
	/**
	*  
	*/
	private String upUser;


	public void setId(Integer id) {
		this.id = id;
	}
	
	public Integer getId() {
		return this.id;
	}
	public void setFrequency(Integer frequency) {
		this.frequency = frequency;
	}
	
	public Integer getFrequency() {
		return this.frequency;
	}
	public void setUptime(String uptime) {
		this.uptime = uptime;
	}
	
	public String getUptime() {
		return this.uptime;
	}
	public void setUpUser(String upUser) {
		this.upUser = upUser;
	}
	
	public String getUpUser() {
		return this.upUser;
	}

}
