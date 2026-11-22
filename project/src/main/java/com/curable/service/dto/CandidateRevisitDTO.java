package com.curable.service.dto;

import java.io.Serializable;
import java.time.Instant;

import org.springframework.format.annotation.DateTimeFormat;

public class CandidateRevisitDTO implements Serializable {

	private static final long serialVersionUID = 1L;

	private Long id;
	private Long candidateId;
	@DateTimeFormat(pattern = "YYYY-MM-DD")
	private Instant revisitDate;
	private String revisitStatus;
	private String remarks;
	private String notes;
	@DateTimeFormat(pattern = "YYYY-MM-DD")
	private Instant nextFollowUpDate;
	private Long hospitalId;
	private String mobileNo;
	private String visitedLocation;
	private String candidateName;
	private String hospitalName;

	public CandidateRevisitDTO() {
	}

	public CandidateRevisitDTO(Long id, Long candidateId, Instant revisitDate, String revisitStatus, String remarks) {
		this.id = id;
		this.candidateId = candidateId;
		this.revisitDate = revisitDate;
		this.revisitStatus = revisitStatus;
		this.remarks = remarks;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getCandidateId() {
		return candidateId;
	}

	public void setCandidateId(Long candidateId) {
		this.candidateId = candidateId;
	}

	public Instant getRevisitDate() {
		return revisitDate;
	}

	public void setRevisitDate(Instant revisitDate) {
		this.revisitDate = revisitDate;
	}

	public String getRevisitStatus() {
		return revisitStatus;
	}

	public void setRevisitStatus(String revisitStatus) {
		this.revisitStatus = revisitStatus;
	}

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public Instant getNextFollowUpDate() {
		return nextFollowUpDate;
	}

	public void setNextFollowUpDate(Instant nextFollowUpDate) {
		this.nextFollowUpDate = nextFollowUpDate;
	}

	public Long getHospitalId() {
		return hospitalId;
	}

	public void setHospitalId(Long hospitalId) {
		this.hospitalId = hospitalId;
	}

	public String getMobileNo() {
		return mobileNo;
	}

	public void setMobileNo(String mobileNo) {
		this.mobileNo = mobileNo;
	}

	public String getVisitedLocation() {
		return visitedLocation;
	}

	public void setVisitedLocation(String visitedLocation) {
		this.visitedLocation = visitedLocation;
	}

	public String getCandidateName() {
		return candidateName;
	}

	public void setCandidateName(String candidateName) {
		this.candidateName = candidateName;
	}

	public String getHospitalName() {
		return hospitalName;
	}

	public void setHospitalName(String hospitalName) {
		this.hospitalName = hospitalName;
	}

	@Override
	public String toString() {
		return "CandidateRevisitDTO [id=" + id + ", candidateId=" + candidateId + ", revisitDate=" + revisitDate
			+ ", revisitStatus=" + revisitStatus + ", remarks=" + remarks + ", notes=" + notes
			+ ", nextFollowUpDate=" + nextFollowUpDate + ", hospitalId=" + hospitalId + ", mobileNo=" + mobileNo
			+ ", visitedLocation=" + visitedLocation + ", candidateName=" + candidateName + ", hospitalName="
			+ hospitalName + "]";
	}
}
