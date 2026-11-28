package com.curable.report.dynamic.DTO;

public class ReportDiseaseMappingRequest {
    private String reportCode = "SCREENING";
    private Long diseaseTestMasterId;
    private String sectionName;
    private Integer sectionOrder;
    private Integer baseOrder;

    public String getReportCode() { return reportCode; }
    public void setReportCode(String reportCode) { this.reportCode = reportCode; }
    public Long getDiseaseTestMasterId() { return diseaseTestMasterId; }
    public void setDiseaseTestMasterId(Long diseaseTestMasterId) { this.diseaseTestMasterId = diseaseTestMasterId; }
    public String getSectionName() { return sectionName; }
    public void setSectionName(String sectionName) { this.sectionName = sectionName; }
    public Integer getSectionOrder() { return sectionOrder; }
    public void setSectionOrder(Integer sectionOrder) { this.sectionOrder = sectionOrder; }
    public Integer getBaseOrder() { return baseOrder; }
    public void setBaseOrder(Integer baseOrder) { this.baseOrder = baseOrder; }
}
