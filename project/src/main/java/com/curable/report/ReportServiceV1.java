package com.curable.report;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.curable.domain.enums.ReportType;
import com.curable.service.ReportService;
import com.curable.service.dto.DownloadRequestDTO;
import com.curable.util.Header;

@Service
public class ReportServiceV1 {
	private final ReportStrategyFactory factory;

	public ReportServiceV1(ReportStrategyFactory factory) {
		this.factory = factory;
	}

	@Autowired
	ReportService reportService;

	public byte[] generateReport(DownloadRequestDTO downloadRequestDTO) throws Exception {
		ReportFactory strategy;
		if (downloadRequestDTO.getHospitalCode() == null && downloadRequestDTO.getHospitalId() == 4L) {
			downloadRequestDTO.setHospitalCode("VS");
		} else {
			downloadRequestDTO.setHospitalCode("CI");
		}

		switch (downloadRequestDTO.getReportType()) {
		case Outreachclinic:
			return reportService.generateCampsReportCsv(downloadRequestDTO);
		case Patientregistration:
			return reportService.generatePatientRegReportCsv(downloadRequestDTO);
		case Screening:
			strategy = factory.getStrategy(downloadRequestDTO.getHospitalCode());

			return CsvBuilder.build(
					strategy.getHeader(downloadRequestDTO.getReportType(), downloadRequestDTO.getHospitalCode()),
					strategy.generateScreeningReport(downloadRequestDTO, null));
		case SavedPatient:
			return reportService.generateSavedPatientCsv(downloadRequestDTO);
		case Clinical_Evaluation:
			strategy = factory.getStrategy(downloadRequestDTO.getHospitalCode());

			return CsvBuilder.build(
					strategy.getHeader(downloadRequestDTO.getReportType(), downloadRequestDTO.getHospitalCode()),
					strategy.generateClinicalReport(downloadRequestDTO, null));
		case UniquePatientReport:
			return reportService.uniquePatientReport(downloadRequestDTO, null);
		case Consolidated:
			strategy = factory.getStrategy(downloadRequestDTO.getHospitalCode());
			List<String> header = new ArrayList<>();
			Collections.addAll(header, Header.uniquePatientHeader());
			Collections.addAll(header, strategy.getHeader(ReportType.Screening, downloadRequestDTO.getHospitalCode()));
			Collections.addAll(header,
					strategy.getHeader(ReportType.Clinical_Evaluation, downloadRequestDTO.getHospitalCode()));
			Map<String, List<String>> consolidatedMap = new LinkedHashMap<>();
			strategy = factory.getStrategy(downloadRequestDTO.getHospitalCode());
			reportService.uniquePatientReport(downloadRequestDTO, consolidatedMap);
			strategy.generateScreeningReport(downloadRequestDTO, consolidatedMap);
			strategy.generateClinicalReport(downloadRequestDTO, consolidatedMap);
			List<String[]> rows = new ArrayList<>();
			for (List<String> row : consolidatedMap.values()) {
				rows.add(row.toArray(new String[0]));
			}
			
			return CsvBuilder.build(header.toArray(new String[0]), rows);

		default:
			break;
		}
		return null;
	}
}