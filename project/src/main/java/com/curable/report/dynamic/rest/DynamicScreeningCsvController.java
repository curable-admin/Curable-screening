package com.curable.report.dynamic.rest;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
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
@RequestMapping("/api/reports/dynamic-screening")
public class DynamicScreeningCsvController {

    private final DynamicScreeningReportService reportService;

    public DynamicScreeningCsvController(DynamicScreeningReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping(value = "/csv", produces = "text/csv")
    public ResponseEntity<byte[]> downloadCsv(@RequestBody DynamicReportRequest request) throws Exception {
        byte[] csv = reportService.generateCsv(request);
        String fileName = "screening-report-" + LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE) + ".csv";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .contentType(new MediaType("text", "csv", java.nio.charset.StandardCharsets.UTF_8))
                .contentLength(csv.length)
                .body(csv);
    }
}
