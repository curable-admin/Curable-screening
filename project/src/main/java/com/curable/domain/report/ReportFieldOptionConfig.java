package com.curable.domain.report;

import javax.persistence.*;

@Entity
@Table(name = "report_field_option_config")
public class ReportFieldOptionConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reportFieldConfigId", nullable = false)
    private Long reportFieldConfigId;

    @Column(name = "optionValue", nullable = false, length = 255)
    private String optionValue;

    @Column(name = "outputFieldKey", nullable = false, length = 100)
    private String outputFieldKey;

    @Column(name = "displayName", nullable = false, length = 255)
    private String displayName;

    @Column(name = "displayOrder", nullable = false)
    private Integer displayOrder;

    @Column(name = "negativeWhenTestName", length = 255)
    private String negativeWhenTestName;

    @Column(name = "negativeWhenValue", length = 255)
    private String negativeWhenValue;

    @Column(name = "isActive", nullable = false)
    private Boolean active;

    public Long getId() { return id; }
    public Long getReportFieldConfigId() { return reportFieldConfigId; }
    public String getOptionValue() { return optionValue; }
    public String getOutputFieldKey() { return outputFieldKey; }
    public String getDisplayName() { return displayName; }
    public Integer getDisplayOrder() { return displayOrder; }
    public String getNegativeWhenTestName() { return negativeWhenTestName; }
    public String getNegativeWhenValue() { return negativeWhenValue; }
    public Boolean getActive() { return active; }
    public void setId(Long id) { this.id = id; }
    public void setReportFieldConfigId(Long reportFieldConfigId) { this.reportFieldConfigId = reportFieldConfigId; }
    public void setOptionValue(String optionValue) { this.optionValue = optionValue; }
    public void setOutputFieldKey(String outputFieldKey) { this.outputFieldKey = outputFieldKey; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
    public void setNegativeWhenTestName(String negativeWhenTestName) { this.negativeWhenTestName = negativeWhenTestName; }
    public void setNegativeWhenValue(String negativeWhenValue) { this.negativeWhenValue = negativeWhenValue; }
    public void setActive(Boolean active) { this.active = active; }
}
