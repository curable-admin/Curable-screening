package com.curable.service.dto;

import java.time.LocalDate;

import com.curable.domain.enums.Gender;

public interface CandidateCustomDTO {
	public Long getId();

	public String getName();

	public String getDob();

	public String getMobileNo();

	public Long getHospitalId();

	public String getRegistrationId();

	public Gender getGender();

	public int getRevistStatusId();

	public String getLastVistCompletedDate();

}
