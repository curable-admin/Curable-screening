package com.curable.service.dto.custom;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class HistoryDTO {

	private Long id;
	private String date;
	private String title;
	private String referral;
	private String status;
	private Integer sequence;
	private String name;

	@JsonIgnore
	private Instant createdDate;

	public HistoryDTO() {
		super();
	}

	public HistoryDTO(Long id, Instant createdDate,String date, String title, String referral, String completed, String name) {
		super();
		this.id = id;
		this.createdDate = createdDate;
		this.date = date;
		this.title = title;
		this.referral = referral;
		this.status = completed;
		this.name = name;
	}

	public HistoryDTO(Long id, Instant createdDate, String title, Boolean referral, int completed, String name) {
		super();
		this.id = id;
		this.createdDate = createdDate;
		this.date = com.curable.util.CommonUtil.getDateYYYYMMDD(createdDate);
		this.title = title;
		this.referral = referral == null ? null : (referral ? "Yes" : "No");
		this.status = completed == 1 ? "Completed" : "Pending";
		this.name = name;
	}

	public HistoryDTO(Long id, String date, String title, String referral, String status, Integer sequence) {
		super();
		this.id = id;
		this.date = date;
		this.title = title;
		this.referral = referral;
		this.status = status;
		this.sequence = sequence;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getReferral() {
		return referral;
	}

	public void setReferral(String referral) {
		this.referral = referral;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Integer getSequence() {
		return sequence;
	}

	public void setSequence(Integer sequence) {
		this.sequence = sequence;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Instant getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Instant createdDate) {
		this.createdDate = createdDate;
	}

	@Override
	public String toString() {
		return "HistoryDTO [id=" + id + ", date=" + date + ", title=" + title + ", referral=" + referral + ", status="
				+ status + ", sequence=" + sequence + ", name=" + name + "]";
	}

}