package com.datapot.web.om.email.emailto.domain;

import java.io.Serializable;
import javax.persistence.Entity;
import javax.persistence.GenerationType;
import javax.persistence.Table;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
@SuppressWarnings("serial")
@Table(name="email_to")
public class EmailTo implements Serializable {
	/**
	*  
	*/
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;
	/**
	*  
	*/
	private String client;


	public void setId(Integer id) {
		this.id = id;
	}
	
	public Integer getId() {
		return this.id;
	}
	public void setClient(String client) {
		this.client = client;
	}
	
	public String getClient() {
		return this.client;
	}

	public EmailTo(String client) {
		super();
		this.client = client;
	}

	public EmailTo() {
		super();
	}
	
	

}
