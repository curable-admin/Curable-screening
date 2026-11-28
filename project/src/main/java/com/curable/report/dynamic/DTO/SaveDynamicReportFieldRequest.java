package com.curable.report.dynamic.DTO;

public class SaveDynamicReportFieldRequest {
    private Long diseaseTestMasterId;
    private String sectionName;
    private String testName;
    private String fieldKey;
    private String displayName;
    private String sourceType = "JSON";
    private String sourceKey;
    private String valueType;
    private String dataType = "string";
    private Integer displayOrder = 0;
    private Integer columnWidth = 120;
    private Boolean visible = true;

    public Long getDiseaseTestMasterId() { return diseaseTestMasterId; }
    public void setDiseaseTestMasterId(Long diseaseTestMasterId) { this.diseaseTestMasterId = diseaseTestMasterId; }
    public String getSectionName() { return sectionName; }
    public void setSectionName(String sectionName) { this.sectionName = sectionName; }
    public String getTestName() { return testName; }
    public void setTestName(String testName) { this.testName = testName; }
    public String getFieldKey() { return fieldKey; }
    public void setFieldKey(String fieldKey) { this.fieldKey = fieldKey; }
    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    public String getSourceType() { return sourceType; }
    public void setSourceType(String sourceType) { this.sourceType = sourceType; }
    public String getSourceKey() { return sourceKey; }
    public void setSourceKey(String sourceKey) { this.sourceKey = sourceKey; }
    public String getValueType() { return valueType; }
    public void setValueType(String valueType) { this.valueType = valueType; }
    public String getDataType() { return dataType; }
    public void setDataType(String dataType) { this.dataType = dataType; }
    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
    public Integer getColumnWidth() { return columnWidth; }
    public void setColumnWidth(Integer columnWidth) { this.columnWidth = columnWidth; }
    public Boolean getVisible() { return visible; }
    public void setVisible(Boolean visible) { this.visible = visible; }
}
