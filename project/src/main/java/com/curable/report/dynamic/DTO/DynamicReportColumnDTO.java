package com.curable.report.dynamic.DTO;

public class DynamicReportColumnDTO {
    private String fieldKey;
    private String displayName;
    private String sectionName;
    private Integer displayOrder;
    private Integer columnWidth;
    private String dataType;

    public String getFieldKey() { return fieldKey; }
    public void setFieldKey(String fieldKey) { this.fieldKey = fieldKey; }
    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    public String getSectionName() { return sectionName; }
    public void setSectionName(String sectionName) { this.sectionName = sectionName; }
    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
    public Integer getColumnWidth() { return columnWidth; }
    public void setColumnWidth(Integer columnWidth) { this.columnWidth = columnWidth; }
    public String getDataType() { return dataType; }
    public void setDataType(String dataType) { this.dataType = dataType; }
}
