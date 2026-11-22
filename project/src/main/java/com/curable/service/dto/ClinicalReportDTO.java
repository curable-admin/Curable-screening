package com.curable.service.dto;

public interface ClinicalReportDTO {
	String getCampIdPrefix();
	String getName();
	String getGender();
	String getAge();
	Long getId();
	Long getRid();
	String getRegistrationId();

	String getCandidateName();
	
	String getOralModifiedDate();
	String getBreastModifiedDate();
	String getCervicalModifiedDate();


	// Breast
	String getBreastCreatedDate();

	String getBreastcBy();
	String getBreastAddnotes();

	String getBreastlBy();

	String getBreastClinicalExam();

	String getBreastUhid();

	String getBreastScrOpdNumber();

	String getBreastMammogram();

	String getBreastMammogramRight();

	String getBreastMammogramLeft();

	String getBreastMammogramReportDate();
	String getBreastUltraTakenDate();
	String getBreastmammoTakenDate();

	String getBreastUltrasound();

	String getBreastUltrasoundRight();

	String getBreastUltrasoundLeft();

	String getBreastUltrasoundReportDate();

	String getBreastCytology();

	String getBreastCytologyReportDate();

	String getBreastCytologyImage();

	String getBreastOtherFindings(); // cytology

	String getBreastBiopsy();

	String getBreastBiopsyReportDate();

	String getBreastBiopsyReport();

	String getBreastAdditionalComments();

	String getBreastFinalDiagnosis();

	String getBreastTreatment();

	String getBreastFollowupAdvice();
	String getBreastUSGTakenDate();
	String getBreastMammogramTakenDate();
	Integer getBreastCompleted();

	// Cervical
	String getCervicalCreatedDate();

	String getCervicalcBy();

	String getCervicallBy();

	String getCervicalClinicalExam();

	String getCervicalUhid();

	String getCervicalOpdNumber();

	String getCervicalColposcopy();

	String getCervicalImage();

	String getCervicalColposcopyReport();

	String getCervicalColposcopyReportDate();

	String getCervicalColpoBiopsy();

	String getCervicalColpoBiopsyReportDate();

	String getCervicalColpoBiopsyImage();

	String getCervicalAdditionalComments();

	String getCervicalTreatmentPlan();

	String getCervicalTreatment();
	String getCervicalAddnotes();

	String getCervicalFollowupAdvice();
	Integer getCervicalCompleted();

	// Oral
	String getOralCreatedDate();
	String getOralAddnotes();
	String getOralcBy();

	String getOrallBy();

	String getOralClinicalEvaluation();

	String getOralUhid();

	String getOralOpdNumber();

	String getOralTobaccoCounselling();

	String getOralTobaccoOutcome();

	String getOralTobaccoReportDate();

	String getOralHeadNeckOpd();

	String getOralHeadNeckReportDate();

	String getOralHeadNeckOutcome();

	String getOralCytology();

	String getOralCytologyReport();

	String getOralCytologyReportDate();

	String getOralBiopsy();

	String getOralBiopsyReport();

	String getOralBiopsyReportDate();

	String getOralAdditionalComments();

	String getOralFinalDiagnosis();

	String getOralTreatment();

	String getOralFollowupAdvice();
	Integer getOralCompleted();
}
