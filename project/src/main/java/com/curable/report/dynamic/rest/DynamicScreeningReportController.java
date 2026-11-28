package com.curable.report.dynamic.rest;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.curable.report.dynamic.DTO.DynamicReportRequest;
import com.curable.report.dynamic.DTO.DynamicScreeningReportRequest;
import com.curable.report.dynamic.service.DynamicScreeningReportService;

@RestController
@RequestMapping("/api/dynamic-reports")
public class DynamicScreeningReportController {

    private final DynamicScreeningReportService reportService;

    public DynamicScreeningReportController(DynamicScreeningReportService reportService) {
        this.reportService = reportService;
    }

    /**
     * CSV endpoint for validating and downloading the dynamic MySQL report.
     * Header labels come from the published report configuration.
     */
    @PostMapping(value = "/screening/csv", produces = "text/csv")
    public ResponseEntity<byte[]> generateCsv(
            @RequestBody DynamicReportRequest request) throws Exception {

        byte[] content = reportService.generateCsv(request);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=dynamic-screening-report.csv")
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(content);
    }
}
