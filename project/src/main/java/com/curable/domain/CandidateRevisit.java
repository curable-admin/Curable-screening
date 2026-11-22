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
@Table(name = "candidate_revisit")
public class CandidateRevisit extends AbstractAuditingEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "candidateId")
	private Candidate candidate;

	@Column(name = "revisitDate")
	private Instant revisitDate;

	@Column(name = "revisitStatus")
	private String revisitStatus;

	@Column(name = "nextFollowUpDate")
	private Instant nextFollowUpDate;

	public CandidateRevisit() {
	}

	public CandidateRevisit(Candidate candidate, Instant revisitDate, String revisitStatus) {
		super();
		this.candidate = candidate;
		this.revisitDate = revisitDate;
		this.revisitStatus = revisitStatus;
	}

	public CandidateRevisit(Candidate candidate, String revisitStatus, Instant nextFollowUpDate) {
		super();
		this.candidate = candidate;
		this.revisitStatus = revisitStatus;
		this.nextFollowUpDate = nextFollowUpDate;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Candidate getCandidate() {
		return candidate;
	}

	public void setCandidate(Candidate candidate) {
		this.candidate = candidate;
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

	public Instant getNextFollowUpDate() {
		return nextFollowUpDate;
	}

	public void setNextFollowUpDate(Instant nextFollowUpDate) {
		this.nextFollowUpDate = nextFollowUpDate;
	}

	@Override
	public String toString() {
		return "CandidateRevisit [id=" + id + ", revisitDate=" + revisitDate + ", revisitStatus=" + revisitStatus
				+ ", nextFollowUpDate=" + nextFollowUpDate + "]";
	}

}
