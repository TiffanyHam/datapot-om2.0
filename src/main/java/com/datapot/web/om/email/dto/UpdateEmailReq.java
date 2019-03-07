package com.datapot.web.om.email.dto;

public class UpdateEmailReq {
	private String emailTos;
	private Integer type;
	public String getEmailTos() {
		return emailTos;
	}
	public void setEmailTos(String emailTos) {
		this.emailTos = emailTos;
	}
	public Integer getType() {
		return type;
	}
	public void setType(Integer type) {
		this.type = type;
	}
}
