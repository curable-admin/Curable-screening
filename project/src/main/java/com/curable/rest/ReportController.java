package com.curable.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.curable.report.ReportServiceV1;
import com.curable.service.dto.DownloadRequestDTO;

@RestController
public class ReportController {
	@Autowired
	private ReportServiceV1 service;

	@PostMapping("/camps-report")
	public ResponseEntity<byte[]> downloadCampsReport(@RequestBody DownloadRequestDTO downloadRequestDTO)
			throws Exception {
		byte[] csvData = service.generateReport(downloadRequestDTO);

		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION,
						"attachment; filename=" + downloadRequestDTO.getReportType().toString() + ".csv")
				.contentType(MediaType.parseMediaType("text/csv")).body(csvData);
	}

}
