package com.curable.domain.report;

import java.time.LocalDateTime;
import javax.persistence.*;

@Entity
@Table(name = "report_config_version")
public class ReportConfigVersion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reportId", nullable = false)
    private Long reportId;

    @Column(name = "versionNumber", nullable = false)
    private Integer versionNumber;

    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @Column(name = "createdBy", length = 100)
    private String createdBy;

    @Column(name = "createdDate")
    private LocalDateTime createdDate;

    @Column(name = "publishedBy", length = 100)
    private String publishedBy;

    @Column(name = "publishedDate")
    private LocalDateTime publishedDate;

    public Long getId() { return id; }
    public Long getReportId() { return reportId; }
    public Integer getVersionNumber() { return versionNumber; }
    public String getStatus() { return status; }
    public String getCreatedBy() { return createdBy; }
    public LocalDateTime getCreatedDate() { return createdDate; }
    public String getPublishedBy() { return publishedBy; }
    public LocalDateTime getPublishedDate() { return publishedDate; }
    public void setId(Long id) { this.id = id; }
    public void setReportId(Long reportId) { this.reportId = reportId; }
    public void setVersionNumber(Integer versionNumber) { this.versionNumber = versionNumber; }
    public void setStatus(String status) { this.status = status; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
    public void setPublishedBy(String publishedBy) { this.publishedBy = publishedBy; }
    public void setPublishedDate(LocalDateTime publishedDate) { this.publishedDate = publishedDate; }
}
