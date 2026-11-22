package com.curable.report;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import com.curable.domain.enums.ReportType;
import com.curable.service.dto.DownloadRequestDTO;

public interface ReportFactory {

	List<String[]> generateScreeningReport(DownloadRequestDTO downloadRequestDTO,
			Map<String, List<String>> consolidatedMap) throws Exception;

	List<String[]> generateClinicalReport(DownloadRequestDTO downloadRequestDTO,
			Map<String, List<String>> consolidatedMap) throws IOException;

	String[] getHeader(ReportType reportType, String hospitalCode);

}
