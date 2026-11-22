package com.curable.service.dto.custom;


public interface VSClinicalReportDTO {

    /* -------- Candidate -------- */
	String getCampIdPrefix();
    String getRegistrationId();
    String getCandidateName();
	String getName();
	String getGender();
	String getAge();
	Long getId();
	Long getRid();

    /* -------- Breast -------- */
    String getBreastCreatedDate();
    String getBreastcBy();
    String getBreastlBy();
    Integer getBreastCompleted();
    String getBreastClinicalExam();
    String getBreastDoctorNotes();
    String getBreastInvestigations();
    String getBreastUltrasoundReport();
    String getBreastUltrasoundReportDate();
    String getBreastBiopsyReport();
    String getBreastBiopsyReportDate();
    String getBreastFinalDiagnosis();
    String getBreastTreatmentAdvised();

    /* -------- Cervical -------- */
    String getCervicalCreatedDate();
    String getCervicalcBy();
    String getCervicallBy();
    Integer getCervicalCompleted();

    String getCervicalClinicalExam();
    String getCervicalDoctorNotes();
    String getCervicalInvestigations();
    String getCervicalCBCReport();
    String getCervicalCBCReportDate();
    String getCervicalBiopsyReport();
    String getCervicalBiopsyReportDate();
    String getCervicalFinalDiagnosis();
    String getCervicalTreatmentAdvised();

    /* -------- Oral -------- */
    String getOralCreatedDate();
    String getOralcBy();
    String getOrallBy();
    Integer getOralCompleted();

    String getOralClinicalEvaluation();
    String getOralDoctorNotes();
    String getOralInvestigations();
    String getOralBiopsy();
    String getOralBiopsyReport();
    String getOralBiopsyReportDate();
    String getOralFinalDiagnosis();
    String getOralTreatment();

    /* -------- Prostate -------- */
    String getProstateCreatedDate();
    String getProstatecBy();
    String getProstatelBy();
    Integer getProstateCompleted();

    String getProstateClinicalExam();
    String getProstateDoctorNotes();
    String getProstateInvestigations();
    String getProstateUltrasoundKUBReport();
    String getProstateUltrasoundKUBReportDate();
    String getProstateFinalDiagnosis();
    String getProstateTreatmentAdvised();
}
