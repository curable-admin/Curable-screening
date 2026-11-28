package com.curable.report.dynamic.DTO;
import java.util.List;
public class ClinicalReportRequest {
    private List<Long> campIds;
    private String startDate;
    private String endDate;
    public List<Long> getCampIds() { return campIds; }
    public void setCampIds(List<Long> campIds) { this.campIds = campIds; }
    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }
    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }
}
