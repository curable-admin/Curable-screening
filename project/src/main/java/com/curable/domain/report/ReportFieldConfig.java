package com.curable.domain.report;

import javax.persistence.*;

@Entity
@Table(name = "report_field_config")
public class ReportFieldConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "configVersionId", nullable = false)
    private Long configVersionId;

    @Column(name = "diseaseTestMasterId")
    private Long diseaseTestMasterId;

    @Column(name = "sectionName", nullable = false, length = 100)
    private String sectionName;

    @Column(name = "testName", length = 255)
    private String testName;

    @Column(name = "fieldKey", nullable = false, length = 100)
    private String fieldKey;

    @Column(name = "displayName", nullable = false, length = 255)
    private String displayName;

    @Column(name = "sourceType", nullable = false, length = 20)
    private String sourceType;

    @Column(name = "sourceKey", length = 100)
    private String sourceKey;

    @Column(name = "valueType", length = 50)
    private String valueType;

    @Column(name = "dataType", nullable = false, length = 30)
    private String dataType;

    @Column(name = "displayOrder", nullable = false)
    private Integer displayOrder;

    @Column(name = "columnWidth", nullable = false)
    private Integer columnWidth;

    @Column(name = "isVisible", nullable = false)
    private Boolean visible;

    @Column(name = "isActive", nullable = false)
    private Boolean active;

    public Long getId() { return id; }
    public Long getConfigVersionId() { return configVersionId; }
    public Long getDiseaseTestMasterId() { return diseaseTestMasterId; }
    public String getSectionName() { return sectionName; }
    public String getTestName() { return testName; }
    public String getFieldKey() { return fieldKey; }
    public String getDisplayName() { return displayName; }
    public String getSourceType() { return sourceType; }
    public String getSourceKey() { return sourceKey; }
    public String getValueType() { return valueType; }
    public String getDataType() { return dataType; }
    public Integer getDisplayOrder() { return displayOrder; }
    public Integer getColumnWidth() { return columnWidth; }
    public Boolean getVisible() { return visible; }
    public Boolean getActive() { return active; }
    public void setId(Long id) { this.id = id; }
    public void setConfigVersionId(Long configVersionId) { this.configVersionId = configVersionId; }
    public void setDiseaseTestMasterId(Long diseaseTestMasterId) { this.diseaseTestMasterId = diseaseTestMasterId; }
    public void setSectionName(String sectionName) { this.sectionName = sectionName; }
    public void setTestName(String testName) { this.testName = testName; }
    public void setFieldKey(String fieldKey) { this.fieldKey = fieldKey; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    public void setSourceType(String sourceType) { this.sourceType = sourceType; }
    public void setSourceKey(String sourceKey) { this.sourceKey = sourceKey; }
    public void setValueType(String valueType) { this.valueType = valueType; }
    public void setDataType(String dataType) { this.dataType = dataType; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
    public void setColumnWidth(Integer columnWidth) { this.columnWidth = columnWidth; }
    public void setVisible(Boolean visible) { this.visible = visible; }
    public void setActive(Boolean active) { this.active = active; }
}
