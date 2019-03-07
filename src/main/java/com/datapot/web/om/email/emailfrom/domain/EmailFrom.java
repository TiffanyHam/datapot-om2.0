package com.datapot.web.om.email.emailfrom.domain;

import java.io.Serializable;
import javax.persistence.Entity;
import javax.persistence.GenerationType;
import javax.persistence.Table;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Table(name="email_from")
@Entity
@SuppressWarnings("serial")
public class EmailFrom implements Serializable {
	/**
	*  
	*/
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;
	/**
	*  
	*/
	private String server;
	/**
	*  
	*/
	private String account;
	/**
	*  
	*/
	private String password;


	public void setId(Integer id) {
		this.id = id;
	}
	
	public Integer getId() {
		return this.id;
	}
	public void setServer(String server) {
		this.server = server;
	}
	
	public String getServer() {
		return this.server;
	}
	public void setAccount(String account) {
		this.account = account;
	}
	
	public String getAccount() {
		return this.account;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	
	public String getPassword() {
		return this.password;
	}

}
