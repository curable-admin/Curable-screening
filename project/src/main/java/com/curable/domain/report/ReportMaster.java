package com.curable.domain.report;

import javax.persistence.*;

@Entity
@Table(name = "report_master")
public class ReportMaster {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

      @Column(name = "hospitalId", nullable = false)
    private Long hospitalId;

    @Column(name = "reportCode", nullable = false, length = 100)
    private String reportCode;

    @Column(name = "reportName", nullable = false, length = 255)
    private String reportName;

    @Column(name = "isActive", nullable = false)
    private Boolean active = Boolean.TRUE;

    public Long getId() { return id; }
    public String getReportCode() { return reportCode; }
    public String getReportName() { return reportName; }
    public Boolean getActive() { return active; }
    public void setId(Long id) { this.id = id; }
    public void setReportCode(String reportCode) { this.reportCode = reportCode; }
    public void setReportName(String reportName) { this.reportName = reportName; }
    public void setActive(Boolean active) { this.active = active; }
}


