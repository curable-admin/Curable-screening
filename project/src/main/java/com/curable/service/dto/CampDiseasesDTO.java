package com.curable.service.dto;

import org.springframework.format.annotation.DateTimeFormat;
import java.io.Serializable;
import java.time.Instant;

public class CampDiseasesDTO implements Serializable {

	private static final long serialVersionUID = 1L;
	private Long id;
	private Long campId;
	private Long diseaseTestMasterId;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getCampId() {
		return campId;
	}

	public void setCampId(Long campId) {
		this.campId = campId;
	}

	public Long getDiseaseTestMasterId() {
		return diseaseTestMasterId;
	}

	public void setDiseaseTestMasterId(Long diseaseTestMasterId) {
		this.diseaseTestMasterId = diseaseTestMasterId;
	}

	public String toString() {
		return "CampDiseasesDTO [" +
		"id=" + id +
		"campId=" + campId +
		"diseaseTestMasterId=" + diseaseTestMasterId +
		"]";
	}
}
