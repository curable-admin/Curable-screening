package com.curable.service.dto;

public interface SavedPatientDTO {

	String getOutreachClinicID();

	Long getId();
	Long getRid();

	String getOutreachClinicName();

	String getCreatedDate();
	
	String getRdate();

	String getCreatedBy();

	String getReason();

	String getRegistraionId(); // fixed typo

	String getName();

	String getMobileNo();

	String getGender();

	Integer getAge();

	String getAddress();

	String getStreetId();

	String getFatherName();

	String getSpouseName();

	String getAlternateMobileNo();

	String getMonthlyIncome();

	String getHouseType();

	String getEducation();

	String getOccupation();

	String getAadhar();

	String getVoterId();

	String getRationCard();

	String getMedicalhistory();

	String getBloodPressure();

	String getPulseRate();

	String getWeight();

	String getHistoryOfSurgery();

	String getHeight();

	String getSpo2();

	String getAllergy();

	String getOtherComplaints();

	Integer getAgeAtMenarche();

	Integer getAgeAtFirstChild();

	Integer getAgeAtLastChild();

	Integer getAgeAtMarriage();

	String getLastMentrution();

	String getAbnormalBleedingVaginum();

	Integer getTotalPregnancies();

	String getCurrentlyPregant();

	String getMethodOfContraceptionUsed();

	String getUndergoneCervicalBreastScrening();

	String getBreastFed();

	String getSocialHabits();

	String getEligibilityMetrics();
}
