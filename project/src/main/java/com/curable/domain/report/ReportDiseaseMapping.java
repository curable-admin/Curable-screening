package com.curable.domain.report;

import javax.persistence.*;

@Entity
@Table(name = "report_disease_mapping")
public class ReportDiseaseMapping {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reportId", nullable = false)
    private Long reportId;

    @Column(name = "diseaseTestMasterId", nullable = false)
    private Long diseaseTestMasterId;

    @Column(name = "sectionName", nullable = false, length = 100)
    private String sectionName;

    @Column(name = "sectionOrder", nullable = false)
    private Integer sectionOrder;

    @Column(name = "baseOrder", nullable = false)
    private Integer baseOrder;

    @Column(name = "lastSyncedConfigHash", length = 64)
    private String lastSyncedConfigHash;

    @Column(name = "isActive", nullable = false)
    private Boolean active = Boolean.TRUE;

    public Long getId() { return id; }
    public Long getReportId() { return reportId; }
    public Long getDiseaseTestMasterId() { return diseaseTestMasterId; }
    public String getSectionName() { return sectionName; }
    public Integer getSectionOrder() { return sectionOrder; }
    public Integer getBaseOrder() { return baseOrder; }
    public String getLastSyncedConfigHash() { return lastSyncedConfigHash; }
    public Boolean getActive() { return active; }
    public void setId(Long id) { this.id = id; }
    public void setReportId(Long reportId) { this.reportId = reportId; }
    public void setDiseaseTestMasterId(Long diseaseTestMasterId) { this.diseaseTestMasterId = diseaseTestMasterId; }
    public void setSectionName(String sectionName) { this.sectionName = sectionName; }
    public void setSectionOrder(Integer sectionOrder) { this.sectionOrder = sectionOrder; }
    public void setBaseOrder(Integer baseOrder) { this.baseOrder = baseOrder; }
    public void setLastSyncedConfigHash(String lastSyncedConfigHash) { this.lastSyncedConfigHash = lastSyncedConfigHash; }
    public void setActive(Boolean active) { this.active = active; }
}
