package com.curable.domain;

import java.time.Instant;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.envers.Audited;

@Audited
@Entity
@Table(name = "campdisease")
public class CampDisease extends AbstractAuditingEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "campId")
	private Camp camp;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "diseaseTestMasterId")
	private DiseaseTestMaster diseaseTestMaster;

	public CampDisease() {
	}

	public CampDisease(Long id, Camp camp, DiseaseTestMaster diseaseTestMaster) {
		this.id = id;
		this.camp = camp;
		this.diseaseTestMaster = diseaseTestMaster;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Camp getCamp() {
		return camp;
	}

	public void setCamp(Camp camp) {
		this.camp = camp;
	}

	public DiseaseTestMaster getDiseaseTestMaster() {
		return diseaseTestMaster;
	}

	public void setDiseaseTestMaster(DiseaseTestMaster diseaseTestMaster) {
		this.diseaseTestMaster = diseaseTestMaster;
	}

	public String toString() {
		return "CampDisease [" +
		"id=" + id +
		"camp=" + camp +
		"diseaseTestMaster=" + diseaseTestMaster +
		"]";
	}
}