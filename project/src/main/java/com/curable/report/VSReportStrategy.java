package com.curable.report;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.curable.domain.enums.ReportType;
import com.curable.repository.CandidateRepository;
import com.curable.service.dto.DownloadRequestDTO;
import com.curable.service.dto.custom.VSClinicalReportDTO;
import com.curable.service.dto.custom.VSScreeningReportDTO;
import com.curable.util.CommonUtil;
import com.curable.util.Header;

@Service("VSReportStrategy")
public class VSReportStrategy implements ReportFactory {
	@Autowired
	CandidateRepository candidateRepository;

	@Override
	public List<String[]> generateScreeningReport(DownloadRequestDTO downloadRequestDTO,
			Map<String, List<String>> consolidatedMap) throws Exception {
		String campIdsStr = downloadRequestDTO.getIds().stream().map(String::valueOf).collect(Collectors.joining(","));
		List<VSScreeningReportDTO> reportData = candidateRepository.vsScreeningReport(campIdsStr,
				downloadRequestDTO.getStartDate(), downloadRequestDTO.getEndDate());
		if (reportData.isEmpty()) {
			return null;
		}
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
		reportData.sort(Comparator.comparing(
				dto -> dto.getBreastCreatedDate() == null ? null
						: LocalDateTime.parse(dto.getBreastCreatedDate(), formatter),
				Comparator.nullsLast(Comparator.reverseOrder())));
		List<String[]> rows = new ArrayList<String[]>();
		for (VSScreeningReportDTO dto : reportData) {
			if (dto.getBreastExam() == null && dto.getCervicalScreening() == null && dto.getOralExam() == null
					&& dto.getSympBasedReferral() == null && dto.getProstateScreening() == null) {
				continue;
			}
			String[] row = new String[] {

					/* -------- Candidate -------- */
					CommonUtil.convertUpperCaseWithForceText(dto.getCampIdPrefix()),
					CommonUtil.convertUpperCase(dto.getName()),
					CommonUtil.convertUpperCaseWithForceText(dto.getRegistraionId()),
					CommonUtil.convertUpperCase(dto.getCandidateName()), CommonUtil.convertUpperCase(dto.getGender()),
					CommonUtil.convertUpperCase(dto.getAge()),

					/* -------- Breast -------- */
					CommonUtil.convertUpperCaseWithForceText(dto.getBreastCreatedDate()),
					CommonUtil.convertUpperCase(dto.getBreastCreatedBy()),
					CommonUtil.convertUpperCase(dto.getBreastLastModifiedBy()),
					(dto.getBreastCompleted() != null && dto.getBreastCompleted() == 1) ? "COMPLETED" : "PENDING",
					CommonUtil.convertUpperCase(dto.getBreastExam()),
					CommonUtil.convertUpperCase(dto.getBreastSymptoms()),
					CommonUtil.convertUpperCase(dto.getBreastTestToBeDone()),
					CommonUtil.convertUpperCase(dto.getBreastVisualReport()),
					CommonUtil.convertUpperCase(dto.getBreastThermalReport()),
					CommonUtil.convertUpperCase(dto.getBreastMammogramReport()),
					CommonUtil.convertUpperCase(dto.getBreastFindings()),
					CommonUtil.convertUpperCase(dto.getBreastReferral()),

					/* -------- Cervical -------- */
					CommonUtil.convertUpperCaseWithForceText(dto.getCervicalCreatedDate()),
					CommonUtil.convertUpperCase(dto.getCervicalCreatedBy()),
					CommonUtil.convertUpperCase(dto.getCervicalLastModifiedBy()),
					(dto.getCervicalCompleted() != null && dto.getCervicalCompleted() == 1) ? "COMPLETED" : "PENDING",
					CommonUtil.convertUpperCase(dto.getCervicalScreening()),
					CommonUtil.convertUpperCase(dto.getCervicalSymptoms()),
					CommonUtil.convertUpperCase(dto.getCervicalPapSmear()),
					CommonUtil.convertUpperCase(dto.getCervicalReport()),
					CommonUtil.convertUpperCase(dto.getCervicalReportDate()),
					CommonUtil.convertUpperCase(dto.getCervicalReferral()),

					/* -------- Oral -------- */
					CommonUtil.convertUpperCaseWithForceText(dto.getOralCreatedDate()),
					CommonUtil.convertUpperCase(dto.getOralCreatedBy()),
					CommonUtil.convertUpperCase(dto.getOralLastModifiedBy()),
					(dto.getOralCompleted() != null && dto.getOralCompleted() == 1) ? "COMPLETED" : "PENDING",
					CommonUtil.convertUpperCase(dto.getOralExam()), CommonUtil.convertUpperCase(dto.getOralSymptoms()),
					CommonUtil.convertUpperCase(dto.getOralSelectSymptoms()),
					CommonUtil.convertUpperCase(dto.getOralToothIssues()),
					CommonUtil.convertUpperCase(dto.getOralGumsIssues()),
					CommonUtil.convertUpperCase(dto.getOralChewingIssues()),
					CommonUtil.convertUpperCase(dto.getOralBadBreath()),
					CommonUtil.convertUpperCase(dto.getOralAlignmentIssues()),
					CommonUtil.convertUpperCase(dto.getOralUlcerIssues()),
					CommonUtil.convertUpperCase(dto.getOralDoctorNotes()),
					CommonUtil.convertUpperCase(dto.getOralReferral()),

					/* -------- Symptom Based Cancer -------- */
					CommonUtil.convertUpperCaseWithForceText(dto.getSympCreatedDate()),
					CommonUtil.convertUpperCase(dto.getSympCreatedBy()),
					CommonUtil.convertUpperCase(dto.getSympLastModifiedBy()),

					(dto.getSympCompleted() != null && dto.getSympCompleted() == 1) ? "COMPLETED" : "PENDING",
					CommonUtil.convertUpperCase(dto.getSympBasedReferral()),
					CommonUtil.convertUpperCase(dto.getSympSymptoms()),
					CommonUtil.convertUpperCase(dto.getSympReferral()),

					/* -------- Prostate -------- */
					CommonUtil.convertUpperCaseWithForceText(dto.getProstateCreatedDate()),
					CommonUtil.convertUpperCase(dto.getProstateCreatedBy()),
					CommonUtil.convertUpperCase(dto.getProstateLastModifiedBy()),
					(dto.getProstateCompleted() != null && dto.getProstateCompleted() == 1) ? "COMPLETED" : "PENDING",
					CommonUtil.convertUpperCase(dto.getProstateScreening()),
					CommonUtil.convertUpperCase(dto.getProstateSymptoms()),
					CommonUtil.convertUpperCase(dto.getProstatePSA()),
					CommonUtil.convertUpperCase(dto.getProstateReport()),
					CommonUtil.convertUpperCase(dto.getProstateReportDate()),
					CommonUtil.convertUpperCase(dto.getProstateReferral()) };

			rows.add(row);
			if (consolidatedMap != null) {
				String key = dto.getId() + "#" + dto.getRid();
				List<String> patientRecord = consolidatedMap.get(key);
				if (patientRecord != null) {
					List<String> mutableList = new ArrayList<>(patientRecord);
					mutableList.addAll(Arrays.asList(row));
					consolidatedMap.put(key, mutableList);
				}
			}
		}

		return rows;
	}

	@Override
	public List<String[]> generateClinicalReport(DownloadRequestDTO downloadRequestDTO,
			Map<String, List<String>> consolidatedMap) throws IOException {
		// TODO Auto-generated method stub
		String campIdsStr = downloadRequestDTO.getIds().stream().map(String::valueOf).collect(Collectors.joining(","));
		List<VSClinicalReportDTO> reportData = candidateRepository.vsClinicalReport(campIdsStr,
				downloadRequestDTO.getStartDate(), downloadRequestDTO.getEndDate());

		if (reportData == null || reportData.isEmpty()) {
			return null;
		}
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
		// Sort by latest activity (Breast → fallback others if needed)
		reportData.sort(Comparator.comparing(
				dto -> dto.getBreastCreatedDate() == null ? null
						: LocalDateTime.parse(dto.getBreastCreatedDate(), formatter),
				Comparator.nullsLast(Comparator.reverseOrder())));
		List<String[]> rows = new ArrayList<>();
		for (VSClinicalReportDTO dto : reportData) {

			// Skip empty records
			if (dto.getBreastClinicalExam() == null && dto.getCervicalClinicalExam() == null
					&& dto.getOralClinicalEvaluation() == null && dto.getProstateClinicalExam() == null) {
				continue;
			}

			String[] row = new String[] {

					CommonUtil.convertUpperCaseWithForceText(dto.getCampIdPrefix()),
					CommonUtil.convertUpperCase(dto.getName()),
					CommonUtil.convertUpperCaseWithForceText(dto.getRegistrationId()),
					CommonUtil.convertUpperCase(dto.getCandidateName()), CommonUtil.convertUpperCase(dto.getGender()),
					CommonUtil.convertUpperCase(dto.getAge()),

					/* -------- Breast -------- */
					CommonUtil.convertUpperCaseWithForceText(dto.getBreastCreatedDate()),
					CommonUtil.convertUpperCase(dto.getBreastcBy()), CommonUtil.convertUpperCase(dto.getBreastlBy()),
					(dto.getBreastCompleted() != null && dto.getBreastCompleted() == 1) ? "COMPLETED" : "PENDING",

					CommonUtil.convertUpperCase(dto.getBreastClinicalExam()),
					CommonUtil.convertUpperCase(dto.getBreastDoctorNotes()),
					CommonUtil.convertUpperCase(dto.getBreastInvestigations()),
					CommonUtil.convertUpperCase(dto.getBreastUltrasoundReport()),
					CommonUtil.convertUpperCase(dto.getBreastUltrasoundReportDate()),
					CommonUtil.convertUpperCase(dto.getBreastBiopsyReport()),
					CommonUtil.convertUpperCase(dto.getBreastBiopsyReportDate()),
					CommonUtil.convertUpperCase(dto.getBreastFinalDiagnosis()),
					CommonUtil.convertUpperCase(dto.getBreastTreatmentAdvised()),

					/* -------- Cervical -------- */
					CommonUtil.convertUpperCaseWithForceText(dto.getCervicalCreatedDate()),
					CommonUtil.convertUpperCase(dto.getCervicalcBy()),
					CommonUtil.convertUpperCase(dto.getCervicallBy()),
					(dto.getCervicalCompleted() != null && dto.getCervicalCompleted() == 1) ? "COMPLETED" : "PENDING",

					CommonUtil.convertUpperCase(dto.getCervicalClinicalExam()),
					CommonUtil.convertUpperCase(dto.getCervicalDoctorNotes()),
					CommonUtil.convertUpperCase(dto.getCervicalInvestigations()),
					CommonUtil.convertUpperCase(dto.getCervicalCBCReport()),
					CommonUtil.convertUpperCase(dto.getCervicalCBCReportDate()),
					CommonUtil.convertUpperCase(dto.getCervicalBiopsyReport()),
					CommonUtil.convertUpperCase(dto.getCervicalBiopsyReportDate()),
					CommonUtil.convertUpperCase(dto.getCervicalFinalDiagnosis()),
					CommonUtil.convertUpperCase(dto.getCervicalTreatmentAdvised()),

					/* -------- Oral -------- */
					CommonUtil.convertUpperCaseWithForceText(dto.getOralCreatedDate()),
					CommonUtil.convertUpperCase(dto.getOralcBy()), CommonUtil.convertUpperCase(dto.getOrallBy()),
					(dto.getOralCompleted() != null && dto.getOralCompleted() == 1) ? "COMPLETED" : "PENDING",

					CommonUtil.convertUpperCase(dto.getOralClinicalEvaluation()),
					CommonUtil.convertUpperCase(dto.getOralDoctorNotes()),
					CommonUtil.convertUpperCase(dto.getOralInvestigations()),
					CommonUtil.convertUpperCase(dto.getOralBiopsy()),
					CommonUtil.convertUpperCase(dto.getOralBiopsyReport()),
					CommonUtil.convertUpperCase(dto.getOralBiopsyReportDate()),
					CommonUtil.convertUpperCase(dto.getOralFinalDiagnosis()),
					CommonUtil.convertUpperCase(dto.getOralTreatment()),

					/* -------- Prostate -------- */
					CommonUtil.convertUpperCaseWithForceText(dto.getProstateCreatedDate()),
					CommonUtil.convertUpperCase(dto.getProstatecBy()),
					CommonUtil.convertUpperCase(dto.getProstatelBy()),
					(dto.getProstateCompleted() != null && dto.getProstateCompleted() == 1) ? "COMPLETED" : "PENDING",

					CommonUtil.convertUpperCase(dto.getProstateClinicalExam()),
					CommonUtil.convertUpperCase(dto.getProstateDoctorNotes()),
					CommonUtil.convertUpperCase(dto.getProstateInvestigations()),
					CommonUtil.convertUpperCase(dto.getProstateUltrasoundKUBReport()),
					CommonUtil.convertUpperCase(dto.getProstateUltrasoundKUBReportDate()),
					CommonUtil.convertUpperCase(dto.getProstateFinalDiagnosis()),
					CommonUtil.convertUpperCase(dto.getProstateTreatmentAdvised()) };

			rows.add(row);
			if (consolidatedMap != null) {
				String key = dto.getId() + "#" + dto.getRid();
				List<String> patientRecord = consolidatedMap.get(key);
				if (patientRecord != null) {
					List<String> mutableList = new ArrayList<>(patientRecord);
					mutableList.addAll(Arrays.asList(row));
					consolidatedMap.put(key, mutableList);
				}
			}
		}

		return rows;
	}

	@Override
	public String[] getHeader(ReportType reportType, String hospitalCode) {
		if (ReportType.Screening == reportType) {
			return Header.getHeaderForScreening(hospitalCode);
		} else {
			return Header.getHeaderForClinical(hospitalCode);
		}
	}

}
