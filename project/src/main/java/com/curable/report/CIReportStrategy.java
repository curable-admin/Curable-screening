package com.curable.report;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.curable.domain.enums.ReportType;
import com.curable.repository.CandidateRepository;
import com.curable.service.ReportService;
import com.curable.service.dto.ClinicalReportDTO;
import com.curable.service.dto.DownloadRequestDTO;
import com.curable.service.dto.ScreeningReportDTO;
import com.curable.util.CommonUtil;
import com.curable.util.Header;

@Service("CIReportStrategy")
public class CIReportStrategy implements ReportFactory {

	@Autowired
	CandidateRepository candidateRepository;

	@Autowired
	ReportService reportService;

	@Override
	public List<String[]> generateScreeningReport(DownloadRequestDTO downloadRequestDTO,
			Map<String, List<String>> consolidatedMap) throws Exception {
		String campIdsStr = downloadRequestDTO.getIds().stream().map(String::valueOf).collect(Collectors.joining(","));
		List<ScreeningReportDTO> reportData = new ArrayList<ScreeningReportDTO>();
		if (consolidatedMap == null) {
			reportData = candidateRepository.screeningReport(campIdsStr, downloadRequestDTO.getStartDate(),
					downloadRequestDTO.getEndDate());
		} else {
			String ids = consolidatedMap.keySet().stream().map(key -> key.substring(0, key.indexOf('#')))
					.collect(Collectors.joining(","));
			reportData = candidateRepository.screeningReportForConsolidation(campIdsStr, ids);
		}

		if (reportData.isEmpty()) {
			return null;
		}
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
		reportData.sort(Comparator.comparing(
				dto -> dto.getBreastCreatedDate() == null ? null
						: LocalDateTime.parse(dto.getBreastCreatedDate(), formatter),
				Comparator.nullsLast(Comparator.reverseOrder())));
		List<String[]> rows = new ArrayList<String[]>();

		/*
		 * Map<String, Long> count = reportData.stream().filter(a ->
		 * a.getRegistraionId() != null)
		 * .collect(Collectors.groupingBy(ScreeningReportDTO::getRegistraionId,
		 * Collectors.counting()));
		 * 
		 * count.entrySet().stream().filter(e -> e.getValue() >
		 * 1).forEach(System.out::println);
		 */
		for (ScreeningReportDTO dto : reportData) {
			if (dto.getBreastExam() == null && dto.getCervicalScreening() == null && dto.getOralExam() == null
					&& dto.getSympBasedReferral() == null) {
				continue;
			}
			List<String> data = new ArrayList<>();

			// General Info
			data.add(CommonUtil.convertUpperCaseWithForceText(dto.getCampIdPrefix()));
			data.add(CommonUtil.convertUpperCase(dto.getName()));
			data.add(CommonUtil.convertUpperCaseWithForceText(dto.getRegistraionId()));
			data.add(CommonUtil.convertUpperCase(dto.getCandidateName()));
			data.add(CommonUtil.convertUpperCase(dto.getGender()));
			data.add(CommonUtil.convertUpperCase(dto.getAge()));

			// --- Breast ---
			data.add(CommonUtil.convertUpperCaseWithForceText(dto.getBreastCreatedDate()));
			data.add(CommonUtil.convertUpperCase(dto.getBreastcBy()));
			data.add(CommonUtil.convertUpperCaseWithForceText(dto.getBreastModifiedDate()));
			data.add(CommonUtil.convertUpperCase(dto.getBreastlBy()));
			data.add(CommonUtil.convertUpperCase(dto.getBreastExam()));
			data.add(CommonUtil.convertUpperCase(dto.getBreastSymptoms()));
			data.add(CommonUtil.convertUpperCase(dto.getRightBreastOnPalpation()));
			data.add(CommonUtil.convertUpperCase(dto.getLeftBreastOnPalpation()));
			data.add(CommonUtil.convertUpperCase(dto.getBreastNippleDischarge()));
			data.add(CommonUtil.convertUpperCase(dto.getBreastReferral()));
			/*
			 * "BREAST/PATHOLOGY AXILLARY", "BASELINE MAMMOGRAM", "USG BREAST",
			 */
			String bC1 = "";
			String bC2 = "";
			String bC3 = "";
			if (dto.getBreastReferral() != null && dto.getBreastReferral().equals("Yes")
					&& dto.getBreastReferredFor() != null) {
				// Normalize list to upper case, trimmed
				Set<String> referredSet = Arrays.stream(dto.getBreastReferredFor().split(",")).map(String::trim)
						.map(String::toUpperCase).collect(Collectors.toSet());
				bC1 = referredSet.contains("BREAST/PATHOLOGY AXILLARY") ? "YES" : "NO";
				bC2 = referredSet.contains("BASELINE MAMMOGRAM") ? "YES" : "NO";
				bC3 = referredSet.contains("USG BREAST") ? "YES" : "NO";

			} else if (dto.getBreastReferral() != null && dto.getBreastReferral().equals("No")) {
				bC1 = "NO";
				bC2 = "NO";
				bC3 = "NO";
			}
			data.add(CommonUtil.convertUpperCase(bC1));
			data.add(CommonUtil.convertUpperCase(bC2));
			data.add(CommonUtil.convertUpperCase(bC3));
			data.add((dto.getBreastCompleted() != null && dto.getBreastCompleted() == 1) ? "COMPLETED" : "PENDING");
			// --- Cervical ---
			data.add(CommonUtil.convertUpperCaseWithForceText(dto.getCervicalCreatedDate()));
			data.add(CommonUtil.convertUpperCase(dto.getCervicalcBy()));
			data.add(CommonUtil.convertUpperCaseWithForceText(dto.getCervicalModifiedDate()));
			data.add(CommonUtil.convertUpperCase(dto.getCervicallBy()));
			data.add(CommonUtil.convertUpperCase(dto.getCervicalScreening()));
			data.add(CommonUtil.convertUpperCase(dto.getCervicalReason()));
			data.add(CommonUtil.convertUpperCase(dto.getCervicalSymptoms()));
			data.add(CommonUtil.convertUpperCase(dto.getCervicalAbnormalBleeding()));
			data.add(CommonUtil.convertUpperCase(dto.getCervicalVisualInspection()));
			data.add(CommonUtil.convertUpperCase(dto.getCervicalFindingsOnVisualInspection()));
			data.add(CommonUtil.convertUpperCase(dto.getCervicalHRHPVDNA()));
			data.add(CommonUtil.convertUpperCase(dto.getCervicalHSampleCollectionDate()));
			data.add(CommonUtil.convertUpperCase(dto.getCervicalHSampleType()));
			data.add(CommonUtil.convertUpperCase(dto.getCervicalHSampleReportDate()));
			data.add(CommonUtil.convertUpperCase(dto.getCervicalHReport()));
			data.add(CommonUtil.convertUpperCase(dto.getGenotype()));
			data.add(CommonUtil.convertUpperCase(dto.getCervicalCytology()));
			data.add(CommonUtil.convertUpperCase(dto.getCervicalCSampleCollectionDate()));
			data.add(CommonUtil.convertUpperCase(dto.getCervicalCReportDate()));
			data.add(CommonUtil.convertUpperCase(dto.getCervicalCReport()));
			data.add(CommonUtil.convertUpperCase(dto.getCervicalVisualTest()));
			data.add(CommonUtil.convertUpperCase(dto.getCervicalVReport()));
			data.add(CommonUtil.convertUpperCase(dto.getCervicalVReportDate()));
			data.add(CommonUtil.convertUpperCase(dto.getCervicalReferral()));

			/*
			 * "COLPOSCOPY","COLPO GUIDED BIOPSY", "OTHERS",
			 */
			String cC1 = "";
			String cC2 = "";
			String cC3 = "";
			if (dto.getCervicalReferral() != null && dto.getCervicalReferral().equals("Yes")
					&& dto.getCervicalReferredFor() != null) {
				// Normalize list to upper case, trimmed
				Set<String> referredSet = Arrays.stream(dto.getCervicalReferredFor().split(",")).map(String::trim)
						.map(String::toUpperCase).collect(Collectors.toSet());
				cC1 = referredSet.contains("COLPOSCOPY") ? "YES" : "NO";
				cC2 = referredSet.contains("COLPO GUIDED BIOPSY") ? "YES" : "NO";
				cC3 = referredSet.contains("OTHERS") ? "YES" : "NO";

			} else if (dto.getCervicalReferral() != null && dto.getCervicalReferral().equals("No")) {
				cC1 = "NO";
				cC2 = "NO";
				cC3 = "NO";
			}
			data.add(CommonUtil.convertUpperCase(cC1));
			data.add(CommonUtil.convertUpperCase(cC2));
			data.add(CommonUtil.convertUpperCase(cC3));
			data.add((dto.getCervicalCompleted() != null && dto.getCervicalCompleted() == 1) ? "COMPLETED" : "PENDING");

			// --- Oral ---
			data.add(CommonUtil.convertUpperCaseWithForceText(dto.getOralCreatedDate()));
			data.add(CommonUtil.convertUpperCase(dto.getOralcBy()));
			data.add(CommonUtil.convertUpperCaseWithForceText(dto.getOralModifiedDate()));
			data.add(CommonUtil.convertUpperCase(dto.getOrallBy()));
			data.add(CommonUtil.convertUpperCase(dto.getOralExam()));
			data.add(CommonUtil.convertUpperCase(dto.getOralSymptoms()));
			data.add(CommonUtil.convertUpperCase(dto.getOralSelectSymptoms()));
			data.add(CommonUtil.convertUpperCase(dto.getDentalHygiene()));
			data.add(CommonUtil.convertUpperCase(dto.getClinicalFindings()));
			data.add(CommonUtil.convertUpperCase(dto.getOralSelectSubtype()));
			data.add(CommonUtil.convertUpperCase(dto.getOralMalignantLeukoplakia()));
			data.add(CommonUtil.convertUpperCase(dto.getLeukoplakiaType()));
			data.add(CommonUtil.convertUpperCase(dto.getLesionSite()));
			data.add(CommonUtil.convertUpperCase(dto.getLesionSize()));
			data.add(CommonUtil.convertUpperCase(dto.getLesionSubtype()));
			data.add(CommonUtil.convertUpperCase(dto.getMultipleLesionSite()));
			data.add(CommonUtil.convertUpperCase(dto.getMultipleLesionSize()));
			data.add(CommonUtil.convertUpperCase(dto.getMultipleLesionSubtype()));
			data.add(CommonUtil.convertUpperCase(dto.getOralMalignantErythroplakia()));
			data.add(CommonUtil.convertUpperCase(dto.getErythroplakiaSite()));
			data.add(CommonUtil.convertUpperCase(dto.getOralSubmucousFibrosis()));
			data.add(CommonUtil.convertUpperCase(dto.getOsmfType()));
			data.add(CommonUtil.convertUpperCase(dto.getNonHealingUlcer()));
			data.add(CommonUtil.convertUpperCase(dto.getNonHealingUlcerSite()));
			data.add(CommonUtil.convertUpperCase(dto.getNonHealingUlcerSize()));
			data.add(CommonUtil.convertUpperCase(dto.getSmokersPalate()));
			data.add(CommonUtil.convertUpperCase(dto.getLichenPlanus()));
			data.add(CommonUtil.convertUpperCase(dto.getLichenPlanusSite()));
			data.add(CommonUtil.convertUpperCase(dto.getOralLichenoidReaction()));
			data.add(CommonUtil.convertUpperCase(dto.getOralLichenoidReactionSite()));
			data.add(CommonUtil.convertUpperCase(dto.getOtherLesionsFlag()));
			data.add(CommonUtil.convertUpperCase(dto.getOtherLesionsText()));
			data.add(CommonUtil.convertUpperCase(dto.getLesionInvasiveSite()));
			data.add(CommonUtil.convertUpperCase(dto.getLesionInvasiveSize()));
			data.add(CommonUtil.convertUpperCase(dto.getLesionInvasiveAppearance()));
			data.add(CommonUtil.convertUpperCase(dto.getOralReferral()));

			/*
			 * "TOBACCO CESSATION COUNSELING",
			 * "ORAL MALIGNANT POTENTIAL DISEASE","CANCEROUS OR INVASIVE LESION", "OTHERS",
			 */
			String oC1 = "";
			String oC2 = "";
			String oC3 = "";
			String oC4 = "";
			if (dto.getOralReferral() != null && dto.getOralReferral().equals("Yes")
					&& dto.getOralReferredFor() != null) {
				// Normalize list to upper case, trimmed
				Set<String> referredSet = Arrays.stream(dto.getOralReferredFor().split(",")).map(String::trim)
						.map(String::toUpperCase).collect(Collectors.toSet());
				oC1 = referredSet.contains("TOBACCO CESSATION COUNSELING") ? "YES" : "NO";
				oC2 = referredSet.contains("ORAL MALIGNANT POTENTIAL DISEASE") ? "YES" : "NO";
				oC3 = referredSet.contains("CANCEROUS OR INVASIVE LESION") ? "YES" : "NO";
				oC4 = referredSet.contains("OTHERS") ? "YES" : "NO";

			} else if (dto.getOralReferral() != null && dto.getOralReferral().equals("Yes")) {
				oC1 = "NO";
				oC2 = "NO";
				oC3 = "NO";
				oC4 = "NO";
			}
			data.add(CommonUtil.convertUpperCase(oC1));
			data.add(CommonUtil.convertUpperCase(oC2));
			data.add(CommonUtil.convertUpperCase(oC3));
			data.add(CommonUtil.convertUpperCase(oC4));
			data.add((dto.getOralCompleted() != null && dto.getOralCompleted() == 1) ? "COMPLETED" : "PENDING");
			// --- Symptoms Based Cancer ---
			data.add(CommonUtil.convertUpperCaseWithForceText(dto.getSympCreatedDate()));
			data.add(CommonUtil.convertUpperCase(dto.getSympcBy()));
			data.add(CommonUtil.convertUpperCaseWithForceText(dto.getSympModifiedDate()));
			data.add(CommonUtil.convertUpperCase(dto.getSymplBy()));
			data.add(CommonUtil.convertUpperCase(dto.getSympBasedReferral()));
			data.add(CommonUtil.convertUpperCase(dto.getSympSymptoms()));
			data.add(CommonUtil.convertUpperCaseWithForceText(dto.getSympDuration()));
			data.add(CommonUtil.convertUpperCase(dto.getSympKnownCancerPatient()));
			data.add(CommonUtil.convertUpperCase(dto.getSympCancerSite()));
			data.add(CommonUtil.convertUpperCase(dto.getSympTreatment()));
			data.add(CommonUtil.convertUpperCase(dto.getSympReferral()));
			data.add(CommonUtil.convertUpperCase(dto.getSympInvestigations()));
			data.add(CommonUtil.convertUpperCase(dto.getSympReports()));
			data.add(CommonUtil.convertUpperCase(dto.getSympReportFindings()));
			data.add(CommonUtil.convertUpperCase(dto.getSympFinalDiagnosis()));
			data.add((dto.getSymCompleted() != null && dto.getSymCompleted() == 1) ? "COMPLETED" : "PENDING");
			// csvWriter.writeNext(data.toArray(new String[0]), true);
			rows.add(data.toArray(new String[0]));
			if (consolidatedMap != null) {
				String key = dto.getId() + "#" + dto.getRid();
				List<String> patientRecord = consolidatedMap.get(key);
				if (patientRecord != null) {
					List<String> mutableList = new ArrayList<>(patientRecord);
					mutableList.addAll(data);
					consolidatedMap.put(key, mutableList);
				}
			}

		}
		return rows;
	}

	@Override
	public List<String[]> generateClinicalReport(DownloadRequestDTO downloadRequestDTO,
			Map<String, List<String>> consolidatedMap) throws IOException {
		String campIdStr = downloadRequestDTO.getIds().stream().map(String::valueOf).collect(Collectors.joining(","));
		List<ClinicalReportDTO> reports;
		if (consolidatedMap == null) {
			reports = candidateRepository.clinicalReport(campIdStr, downloadRequestDTO.getStartDate(),
					downloadRequestDTO.getEndDate());
		} else {
			String ids = consolidatedMap.keySet().stream().map(key -> key.substring(0, key.indexOf('#')))
					.collect(Collectors.joining(","));
			reports = candidateRepository.clinicalReportForConsolidation(campIdStr, ids);
		}

		if (reports.isEmpty()) {
			return null;
		}

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
		reports.sort(Comparator.comparing(
				dto -> dto.getBreastCreatedDate() == null ? null
						: LocalDateTime.parse(dto.getBreastCreatedDate(), formatter),
				Comparator.nullsLast(Comparator.reverseOrder())));
		List<String[]> rows = new ArrayList<String[]>();

		for (ClinicalReportDTO dto : reports) {
			if (dto.getBreastClinicalExam() == null && dto.getCervicalClinicalExam() == null
					&& dto.getOralClinicalEvaluation() == null) {
				continue;
			}
			String[] row = {
					// General Info
					CommonUtil.convertUpperCaseWithForceText(dto.getCampIdPrefix()),
					CommonUtil.convertUpperCase(dto.getName()),
					CommonUtil.convertUpperCaseWithForceText(dto.getRegistrationId()),
					CommonUtil.convertUpperCase(dto.getCandidateName()), CommonUtil.convertUpperCase(dto.getGender()),
					CommonUtil.convertUpperCase(dto.getAge()),

					// --- Breast ---
					CommonUtil.convertUpperCaseWithForceText(
							dto.getBreastCreatedDate() != null ? dto.getBreastCreatedDate() : ""),
					CommonUtil.convertUpperCase(dto.getBreastcBy()),
					CommonUtil.convertUpperCaseWithForceText(dto.getBreastModifiedDate()),
					CommonUtil.convertUpperCase(dto.getBreastlBy()),
					CommonUtil.convertUpperCase(dto.getBreastClinicalExam()),
					CommonUtil.convertUpperCase(dto.getBreastUhid()),
					CommonUtil.convertUpperCase(dto.getBreastScrOpdNumber()),
					CommonUtil.convertUpperCase(dto.getBreastMammogram()),
					CommonUtil.convertUpperCase(dto.getBreastMammogramRight()),
					CommonUtil.convertUpperCase(dto.getBreastMammogramLeft()),
					CommonUtil.convertUpperCase(dto.getBreastMammogramTakenDate()),
					CommonUtil.convertUpperCase(dto.getBreastMammogramReportDate()),

					CommonUtil.convertUpperCase(dto.getBreastUltrasound()),
					CommonUtil.convertUpperCase(dto.getBreastUltrasoundRight()),
					CommonUtil.convertUpperCase(dto.getBreastUltrasoundLeft()),
					CommonUtil.convertUpperCase(dto.getBreastUltraTakenDate()),
					CommonUtil.convertUpperCase(dto.getBreastUltrasoundReportDate()),

					CommonUtil.convertUpperCase(dto.getBreastCytology()),
					CommonUtil.convertUpperCase(dto.getBreastCytologyReportDate()),
					CommonUtil.convertUpperCase(dto.getBreastCytologyImage()),
					CommonUtil.convertUpperCase(dto.getBreastOtherFindings()),
					CommonUtil.convertUpperCase(dto.getBreastBiopsy()),
					CommonUtil.convertUpperCase(dto.getBreastBiopsyReportDate()),
					CommonUtil.convertUpperCase(dto.getBreastBiopsyReport()),
					CommonUtil.convertUpperCase(dto.getBreastAdditionalComments()),
					CommonUtil.convertUpperCase(dto.getBreastFinalDiagnosis()),
					CommonUtil.convertUpperCase(dto.getBreastTreatment()),
					CommonUtil.convertUpperCase(dto.getBreastAddnotes()),
					CommonUtil.convertUpperCase(dto.getBreastFollowupAdvice()),
					dto.getBreastCompleted() != null && dto.getBreastCompleted() == 1 ? "COMPLETED" : "PENDING",

					// --- Cervical ---
					CommonUtil.convertUpperCaseWithForceText(
							dto.getCervicalCreatedDate() != null ? dto.getCervicalCreatedDate() : ""),
					CommonUtil.convertUpperCase(dto.getCervicalcBy()),
					CommonUtil.convertUpperCaseWithForceText(dto.getCervicalModifiedDate()),
					CommonUtil.convertUpperCase(dto.getCervicallBy()),
					CommonUtil.convertUpperCase(dto.getCervicalClinicalExam()),
					CommonUtil.convertUpperCase(dto.getCervicalUhid()),
					CommonUtil.convertUpperCase(dto.getCervicalOpdNumber()),
					CommonUtil.convertUpperCase(dto.getCervicalColposcopy()),
					CommonUtil.convertUpperCase(dto.getCervicalImage()),
					CommonUtil.convertUpperCase(dto.getCervicalColposcopyReport()),
					CommonUtil.convertUpperCase(dto.getCervicalColposcopyReportDate()),
					CommonUtil.convertUpperCase(dto.getCervicalColpoBiopsy()),
					CommonUtil.convertUpperCase(dto.getCervicalColpoBiopsyReportDate()),
					CommonUtil.convertUpperCase(dto.getCervicalColpoBiopsyImage()),
					CommonUtil.convertUpperCase(dto.getCervicalAdditionalComments()),
					CommonUtil.convertUpperCase(dto.getCervicalTreatmentPlan()),
					CommonUtil.convertUpperCase(dto.getCervicalTreatment()),
					CommonUtil.convertUpperCase(dto.getCervicalAddnotes()),
					CommonUtil.convertUpperCase(dto.getCervicalFollowupAdvice()),
					dto.getCervicalCompleted() != null && dto.getCervicalCompleted() == 1 ? "COMPLETED" : "PENDING",


					// --- Oral ---
					CommonUtil.convertUpperCaseWithForceText(
							dto.getOralCreatedDate() != null ? dto.getOralCreatedDate() : ""),
					CommonUtil.convertUpperCase(dto.getOralcBy()), 
					CommonUtil.convertUpperCaseWithForceText(dto.getOralModifiedDate()),
					CommonUtil.convertUpperCase(dto.getOrallBy()),
					CommonUtil.convertUpperCase(dto.getOralClinicalEvaluation()),
					CommonUtil.convertUpperCase(dto.getOralUhid()), CommonUtil.convertUpperCase(dto.getOralOpdNumber()),
					CommonUtil.convertUpperCase(dto.getOralTobaccoCounselling()),
					CommonUtil.convertUpperCase(dto.getOralTobaccoOutcome()),
					CommonUtil.convertUpperCase(dto.getOralTobaccoReportDate()),
					CommonUtil.convertUpperCase(dto.getOralHeadNeckOpd()),
					CommonUtil.convertUpperCase(dto.getOralHeadNeckReportDate()),
					CommonUtil.convertUpperCase(dto.getOralHeadNeckOutcome()),
					CommonUtil.convertUpperCase(dto.getOralCytology()),
					CommonUtil.convertUpperCase(dto.getOralCytologyReport()),
					CommonUtil.convertUpperCase(dto.getOralCytologyReportDate()),
					CommonUtil.convertUpperCase(dto.getOralBiopsy()),
					CommonUtil.convertUpperCase(dto.getOralBiopsyReport()),
					CommonUtil.convertUpperCase(dto.getOralBiopsyReportDate()),
					CommonUtil.convertUpperCase(dto.getOralAdditionalComments()),
					CommonUtil.convertUpperCase(dto.getOralFinalDiagnosis()),
					CommonUtil.convertUpperCase(dto.getOralTreatment()),
					CommonUtil.convertUpperCase(dto.getOralAddnotes()),
					CommonUtil.convertUpperCase(dto.getOralFollowupAdvice()),
					dto.getOralCompleted() != null && dto.getOralCompleted() == 1 ? "COMPLETED" : "PENDING"
		
			};
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
