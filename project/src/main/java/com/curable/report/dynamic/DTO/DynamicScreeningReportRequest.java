package com.curable.report.dynamic.DTO;

import java.util.List;

public class DynamicScreeningReportRequest {
    private Long configVersionId;
    private List<Long> campIds;
    private String startDate;
    private String endDate;
    private String format = "CSV";

    public Long getConfigVersionId() { return configVersionId; }
    public void setConfigVersionId(Long configVersionId) { this.configVersionId = configVersionId; }
    public List<Long> getCampIds() { return campIds; }
    public void setCampIds(List<Long> campIds) { this.campIds = campIds; }
    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }
    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }
    public String getFormat() { return format; }
    public void setFormat(String format) { this.format = format; }
}
