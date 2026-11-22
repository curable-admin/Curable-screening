package com.curable.service.dto.custom;

public class DiseaseTestMasterProjectionDTO {

    private Long diseaseTestMasterId;
    private String diseaseTestMasterName;
    private Long diseaseMasterId;
    private String diseaseMasterName;

    public DiseaseTestMasterProjectionDTO(Long diseaseTestMasterId, String diseaseTestMasterName, Long diseaseMasterId, String diseaseMasterName) {
        this.diseaseTestMasterId = diseaseTestMasterId;
        this.diseaseTestMasterName = diseaseTestMasterName;
        this.diseaseMasterId = diseaseMasterId;
        this.diseaseMasterName = diseaseMasterName;
    }

    public Long getDiseaseTestMasterId() {
        return diseaseTestMasterId;
    }

    public void setDiseaseTestMasterId(Long diseaseTestMasterId) {
        this.diseaseTestMasterId = diseaseTestMasterId;
    }

    public String getDiseaseTestMasterName() {
        return diseaseTestMasterName;
    }

    public void setDiseaseTestMasterName(String diseaseTestMasterName) {
        this.diseaseTestMasterName = diseaseTestMasterName;
    }

    public Long getDiseaseMasterId() {
        return diseaseMasterId;
    }

    public void setDiseaseMasterId(Long diseaseMasterId) {
        this.diseaseMasterId = diseaseMasterId;
    }

    public String getDiseaseMasterName() {
        return diseaseMasterName;
    }

    public void setDiseaseMasterName(String diseaseMasterName) {
        this.diseaseMasterName = diseaseMasterName;
    }
}