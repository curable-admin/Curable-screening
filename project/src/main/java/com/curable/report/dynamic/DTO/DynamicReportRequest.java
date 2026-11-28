package com.curable.report.dynamic.DTO;

import java.util.List;

public class DynamicReportRequest {

    private Long hospitalId;
    private List<Long> campIds;
    private String startDate;
    private String endDate;
    private String reportType;

    public Long getHospitalId() {
        return hospitalId;
    }

    public void setHospitalId(Long hospitalId) {
        this.hospitalId = hospitalId;
    }

    public List<Long> getCampIds() {
        return campIds;
    }

    public void setCampIds(List<Long> campIds) {
        this.campIds = campIds;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public String getReportType() {
        return reportType;
    }

    public void setReportType(String reportType) {
        this.reportType = reportType;
    }
}