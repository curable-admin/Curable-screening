package com.curable.report;

import java.util.List;

public class ReportSection {

    private final String title;
    private final String[] header;
    private final List<String[]> rows;

    public ReportSection(String title, String[] header, List<String[]> rows) {
        this.title = title;
        this.header = header;
        this.rows = rows;
    }

    public String getTitle() {
        return title;
    }

    public String[] getHeader() {
        return header;
    }

    public List<String[]> getRows() {
        return rows;
    }
}