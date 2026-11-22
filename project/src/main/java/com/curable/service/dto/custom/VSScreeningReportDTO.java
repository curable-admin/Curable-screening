package com.curable.service.dto.custom;

public interface VSScreeningReportDTO {

	/* -------- Candidate -------- */
	String getCampIdPrefix();
	String getRegistraionId();
	String getName();
	String getGender();
	String getAge();
	Long getId();
	Long getRid();

	String getCandidateName();

	/* -------- Breast -------- */
	String getBreastCreatedDate();

	String getBreastCreatedBy();

	String getBreastLastModifiedBy();

	Integer getBreastCompleted();

	String getBreastExam();

	String getBreastSymptoms();

	String getBreastTestToBeDone();

	String getBreastVisualReport();

	String getBreastThermalReport();

	String getBreastMammogramReport();

	String getBreastFindings();

	String getBreastReferral();

	/* -------- Cervical -------- */
	String getCervicalCreatedDate();

	String getCervicalCreatedBy();

	String getCervicalLastModifiedBy();

	Integer getCervicalCompleted();

	String getCervicalScreening();

	String getCervicalSymptoms();

	String getCervicalPapSmear();

	String getCervicalReport();

	String getCervicalReportDate();

	String getCervicalReferral();

	/* -------- Oral -------- */
	String getOralCreatedDate();

	String getOralCreatedBy();

	String getOralLastModifiedBy();

	Integer getOralCompleted();

	String getOralExam();

	String getOralSymptoms();

	String getOralSelectSymptoms();

	String getOralToothIssues();

	String getOralGumsIssues();

	String getOralChewingIssues();

	String getOralBadBreath();

	String getOralAlignmentIssues();

	String getOralUlcerIssues();

	String getOralDoctorNotes();

	String getOralReferral();

	/* -------- Symptom Based Cancer -------- */
	String getSympCreatedDate();

	String getSympCreatedBy();

	String getSympLastModifiedBy();

	Integer getSympCompleted();

	String getSympBasedReferral();

	String getSympSymptoms();

	String getSympReferral();

	/* -------- Prostate -------- */
	String getProstateCreatedDate();

	String getProstateCreatedBy();

	String getProstateLastModifiedBy();

	Integer getProstateCompleted();

	String getProstateScreening();

	String getProstateSymptoms();

	String getProstatePSA();

	String getProstateReport();

	String getProstateReportDate();

	String getProstateReferral();
}
