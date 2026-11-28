package com.curable.report.dynamic.DTO;

public class SaveReportOptionRequest {
    private String optionValue;
    private String outputFieldKey;
    private String displayName;
    private Integer displayOrder;
    private String negativeWhenTestName;
    private String negativeWhenValue;

    public String getOptionValue() { return optionValue; }
    public void setOptionValue(String optionValue) { this.optionValue = optionValue; }
    public String getOutputFieldKey() { return outputFieldKey; }
    public void setOutputFieldKey(String outputFieldKey) { this.outputFieldKey = outputFieldKey; }
    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
    public String getNegativeWhenTestName() { return negativeWhenTestName; }
    public void setNegativeWhenTestName(String negativeWhenTestName) { this.negativeWhenTestName = negativeWhenTestName; }
    public String getNegativeWhenValue() { return negativeWhenValue; }
    public void setNegativeWhenValue(String negativeWhenValue) { this.negativeWhenValue = negativeWhenValue; }
}
