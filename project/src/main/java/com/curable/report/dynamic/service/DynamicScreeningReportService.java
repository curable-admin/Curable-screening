package com.curable.report.dynamic.service;

import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.Date;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.sql.DataSource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.curable.domain.report.ReportConfigVersion;
import com.curable.domain.report.ReportFieldConfig;
import com.curable.domain.report.ReportFieldOptionConfig;
import com.curable.domain.report.ReportMaster;
import com.curable.report.dynamic.DTO.DynamicReportColumnDTO;
import com.curable.report.dynamic.DTO.DynamicReportRequest;
import com.curable.repository.ReportConfigVersionRepository;
import com.curable.repository.ReportFieldConfigRepository;
import com.curable.repository.ReportFieldOptionConfigRepository;
import com.curable.repository.ReportMasterRepository;
import com.curable.service.ReportService;
import com.curable.service.dto.DownloadRequestDTO;
import com.opencsv.CSVWriter;

@Service
public class DynamicScreeningReportService {

    private static final String SCREENING = "SCREENING";
    private static final String CLINICAL = "CLINICAL";
    private static final String CONSOLIDATION = "CONSOLIDATION";
    private static final String PUBLISHED = "PUBLISHED";

    private static final String DATE_BASED_PROCEDURE =
            "curabled.sp_generate_dynamic_screening_report";

    private static final String CANDIDATE_BASED_PROCEDURE =
            "curabled.sp_generate_dynamic_report_by_candidates";

    private final DataSource dataSource;
    private final ReportMasterRepository reportMasterRepository;
    private final ReportConfigVersionRepository versionRepository;
    private final ReportFieldConfigRepository fieldRepository;
    private final ReportFieldOptionConfigRepository optionRepository;
    private final ReportService reportService;

    public DynamicScreeningReportService(
            DataSource dataSource,
            ReportMasterRepository reportMasterRepository,
            ReportConfigVersionRepository versionRepository,
            ReportFieldConfigRepository fieldRepository,
            ReportFieldOptionConfigRepository optionRepository,
            ReportService reportService) {

        this.dataSource = dataSource;
        this.reportMasterRepository = reportMasterRepository;
        this.versionRepository = versionRepository;
        this.fieldRepository = fieldRepository;
        this.optionRepository = optionRepository;
        this.reportService = reportService;
    }

    // ============================================================
    // MAIN METHOD
    // Supports SCREENING, CLINICAL and CONSOLIDATION
    // ============================================================

    public byte[] generateCsv(DynamicReportRequest request) throws Exception {

        validateRequest(request);

        String reportType = request.getReportType()
                .trim()
                .toUpperCase();

        if (SCREENING.equals(reportType)) {
            Long versionId = resolvePublishedVersion(
                    request.getHospitalId(), SCREENING);

            return generateDateBasedReport(request, versionId);
        }

        if (CLINICAL.equals(reportType)) {
            Long versionId = resolvePublishedVersion(
                    request.getHospitalId(), CLINICAL);

            return generateDateBasedReport(request, versionId);
        }

        if (CONSOLIDATION.equals(reportType)) {
            return generateConsolidationReport(request);
        }

        throw new IllegalArgumentException(
                "Unsupported report type: " + reportType);
    }

    // ============================================================
    // 1. SCREENING AND CLINICAL REPORT
    // Both use the same generic stored procedure.
    // The configVersionId determines the report fields.
    // ============================================================

    private byte[] generateDateBasedReport(
            DynamicReportRequest request,
            Long configVersionId) throws Exception {

        Map<String, String> displayNames =
                loadDisplayNames(configVersionId);

        String campIdsJson = toJsonArray(request.getCampIds());

        StringWriter output = new StringWriter();

        try (CSVWriter csvWriter = new CSVWriter(output);
             Connection connection = dataSource.getConnection();
             CallableStatement statement = connection.prepareCall(
                     "{CALL " + DATE_BASED_PROCEDURE + "(?,?,?,?)}")) {

            statement.setLong(1, configVersionId);
            statement.setString(2, campIdsJson);
            statement.setDate(
                    3, Date.valueOf(LocalDate.parse(request.getStartDate())));
            statement.setDate(
                    4, Date.valueOf(LocalDate.parse(request.getEndDate())));

            boolean hasResult = statement.execute();

            while (!hasResult && statement.getUpdateCount() != -1) {
                hasResult = statement.getMoreResults();
            }

            if (!hasResult) {
                throw new IllegalStateException(
                        "Date-based report procedure did not return a result set");
            }

            try (ResultSet rs = statement.getResultSet()) {

                ResultSetMetaData metadata = rs.getMetaData();
                int columnCount = metadata.getColumnCount();

                String[] header = new String[columnCount];

                for (int i = 1; i <= columnCount; i++) {
                    String columnKey = metadata.getColumnLabel(i);

                    header[i - 1] = displayNames.containsKey(columnKey)
                            ? displayNames.get(columnKey)
                            : columnKey;
                }

                csvWriter.writeNext(header);

                while (rs.next()) {

                    String[] row = new String[columnCount];

                    for (int i = 1; i <= columnCount; i++) {
                        Object value = rs.getObject(i);

                        row[i - 1] = value == null
                                ? ""
                                : String.valueOf(value);
                    }

                    csvWriter.writeNext(row);
                }
            }
        }

        return output.toString().getBytes(StandardCharsets.UTF_8);
    }

    // ============================================================
    // 2. CONSOLIDATION REPORT
    //
    // Step 1: Existing Unique Patient report
    // Step 2: Extract candidate IDs
    // Step 3: Fetch Screening data by candidate IDs
    // Step 4: Fetch Clinical data by candidate IDs
    // Step 5: Merge using candidateId#revisitId
    // ============================================================

    private byte[] generateConsolidationReport(
            DynamicReportRequest request) throws Exception {

        Long screeningVersionId = resolvePublishedVersion(
                request.getHospitalId(), SCREENING);

        Long clinicalVersionId = resolvePublishedVersion(
                request.getHospitalId(), CLINICAL);

        /*
         * Existing unique patient report populates this map.
         *
         * Key format:
         * candidateId#revisitId
         *
         * Value:
         * Existing unique patient CSV row.
         */
        Map<String, List<String>> uniquePatientRows =
                new LinkedHashMap<String, List<String>>();

        DownloadRequestDTO uniquePatientRequest =
                new DownloadRequestDTO();

        List<String> campIds = request.getCampIds().stream()
                .map(String::valueOf)
                .collect(Collectors.toList());

        uniquePatientRequest.setIds(campIds);
        uniquePatientRequest.setHospitalId(request.getHospitalId());
        uniquePatientRequest.setStartDate(request.getStartDate());
        uniquePatientRequest.setEndDate(request.getEndDate());

        /*
         * This is your existing method from:
         * com.curable.service.ReportService
         *
         * It uses candidateRepository.uniquePatientReport(...)
         * and creates the existing unique-patient rows.
         */
        reportService.uniquePatientReport(
                uniquePatientRequest, uniquePatientRows);

        if (uniquePatientRows.isEmpty()) {
            return new byte[0];
        }

        /*
         * Extract candidate IDs from map keys.
         *
         * Example:
         * 1001#0
         * 1002#1
         * 1003#0
         *
         * Candidate IDs sent to the stored procedure:
         * [1001,1002,1003]
         */
        List<Long> candidateIds = extractCandidateIds(
                uniquePatientRows);

        if (candidateIds.isEmpty()) {
            return new byte[0];
        }

        /*
         * Fetch Screening data.
         *
         * No candidateTest date restriction is applied here.
         * Candidate IDs have already been selected using the
         * unique-patient report date range.
         */
        ProcedureResult screeningResult = executeCandidateProcedure(
                screeningVersionId, candidateIds);

        /*
         * Fetch Clinical data.
         */
        ProcedureResult clinicalResult = executeCandidateProcedure(
                clinicalVersionId, candidateIds);

        /*
         * Load display labels from the respective configurations.
         */
        Map<String, String> screeningDisplayNames =
                loadDisplayNames(screeningVersionId);

        Map<String, String> clinicalDisplayNames =
                loadDisplayNames(clinicalVersionId);

        /*
         * Identify dynamic columns.
         *
         * Excludes:
         * - six fixed columns
         * - _candidateId
         * - _rid
         */
        List<Integer> screeningColumnIndexes =
                getDynamicColumnIndexes(screeningResult);

        List<Integer> clinicalColumnIndexes =
                getDynamicColumnIndexes(clinicalResult);

        /*
         * Build dynamic headers.
         */
        List<String> screeningHeaders = getDynamicHeaders(
                screeningResult,
                screeningColumnIndexes,
                screeningDisplayNames);

        List<String> clinicalHeaders = getDynamicHeaders(
                clinicalResult,
                clinicalColumnIndexes,
                clinicalDisplayNames);

        /*
         * Build lookup maps.
         *
         * Key:
         * candidateId#revisitId
         *
         * Value:
         * Dynamic report values.
         */
        Map<String, List<String>> screeningRows =
                buildDynamicRowMap(
                        screeningResult, screeningColumnIndexes);

        Map<String, List<String>> clinicalRows =
                buildDynamicRowMap(
                        clinicalResult, clinicalColumnIndexes);

        /*
         * Create final CSV.
         */
        StringWriter output = new StringWriter();

        try (CSVWriter csvWriter = new CSVWriter(output)) {

            List<String> finalHeader = new ArrayList<String>();

            // Existing unique-patient report header.
            finalHeader.addAll(
                    Arrays.asList(getUniquePatientHeader()));

            // Screening dynamic columns.
            finalHeader.addAll(screeningHeaders);

            // Clinical dynamic columns.
            finalHeader.addAll(clinicalHeaders);

            csvWriter.writeNext(
                    finalHeader.toArray(
                            new String[finalHeader.size()]));

            /*
             * Preserve the original unique-patient row order.
             * Even when no Screening or Clinical row exists,
             * the unique-patient row is retained.
             */
            for (Map.Entry<String, List<String>> entry
                    : uniquePatientRows.entrySet()) {

                String mergeKey = entry.getKey();

                List<String> finalRow =
                        new ArrayList<String>(entry.getValue());

                List<String> screeningValues =
                        screeningRows.get(mergeKey);

                List<String> clinicalValues =
                        clinicalRows.get(mergeKey);

                if (screeningValues == null) {
                    screeningValues = emptyValues(
                            screeningHeaders.size());
                }

                if (clinicalValues == null) {
                    clinicalValues = emptyValues(
                            clinicalHeaders.size());
                }

                finalRow.addAll(screeningValues);
                finalRow.addAll(clinicalValues);

                csvWriter.writeNext(
                        finalRow.toArray(
                                new String[finalRow.size()]));
            }
        }

        return output.toString().getBytes(StandardCharsets.UTF_8);
    }

    // ============================================================
    // Execute candidate-based stored procedure
    // ============================================================

    private ProcedureResult executeCandidateProcedure(
            Long configVersionId,
            List<Long> candidateIds) throws Exception {

        String candidateIdsJson = toJsonArray(candidateIds);

        try (Connection connection = dataSource.getConnection();
             CallableStatement statement = connection.prepareCall(
                     "{CALL " + CANDIDATE_BASED_PROCEDURE + "(?,?)}")) {

            statement.setLong(1, configVersionId);
            statement.setString(2, candidateIdsJson);

            boolean hasResult = statement.execute();

            while (!hasResult && statement.getUpdateCount() != -1) {
                hasResult = statement.getMoreResults();
            }

            if (!hasResult) {
                throw new IllegalStateException(
                        "Candidate-based procedure did not return a result set");
            }

            try (ResultSet rs = statement.getResultSet()) {
                return readProcedureResult(rs);
            }
        }
    }

    // ============================================================
    // Read stored procedure result into memory
    // ============================================================

    private ProcedureResult readProcedureResult(
            ResultSet rs) throws Exception {

        ProcedureResult result = new ProcedureResult();

        ResultSetMetaData metadata = rs.getMetaData();

        int columnCount = metadata.getColumnCount();

        for (int i = 1; i <= columnCount; i++) {
            result.columnNames.add(metadata.getColumnLabel(i));
        }

        while (rs.next()) {

            List<String> row = new ArrayList<String>();

            for (int i = 1; i <= columnCount; i++) {

                Object value = rs.getObject(i);

                row.add(value == null
                        ? ""
                        : String.valueOf(value));
            }

            result.rows.add(row);
        }

        return result;
    }

    // ============================================================
    // Extract dynamic column indexes
    // ============================================================

    private List<Integer> getDynamicColumnIndexes(
            ProcedureResult result) {

        List<Integer> indexes = new ArrayList<Integer>();

        for (int i = 0; i < result.columnNames.size(); i++) {

            String columnName = result.columnNames.get(i);

            if (isFixedColumn(columnName)) {
                continue;
            }

            if ("_candidateId".equalsIgnoreCase(columnName)
                    || "_rid".equalsIgnoreCase(columnName)) {
                continue;
            }

            indexes.add(i);
        }

        return indexes;
    }

    private boolean isFixedColumn(String columnName) {

        return "OUTREACHCLINICID".equalsIgnoreCase(columnName)
                || "OUTREACHCLINICNAME".equalsIgnoreCase(columnName)
                || "REGISTRATIONID".equalsIgnoreCase(columnName)
                || "CANDIDATENAME".equalsIgnoreCase(columnName)
                || "GENDER".equalsIgnoreCase(columnName)
                || "AGE".equalsIgnoreCase(columnName);
    }

    // ============================================================
    // Get dynamic headers with configured display names
    // ============================================================

    private List<String> getDynamicHeaders(
            ProcedureResult result,
            List<Integer> dynamicIndexes,
            Map<String, String> displayNames) {

        List<String> headers = new ArrayList<String>();

        for (Integer index : dynamicIndexes) {

            String fieldKey = result.columnNames.get(index);

            String displayName = displayNames.get(fieldKey);

            headers.add(displayName == null
                    ? fieldKey
                    : displayName);
        }

        return headers;
    }

    // ============================================================
    // Build candidateId#revisitId -> dynamic values map
    // ============================================================

    private Map<String, List<String>> buildDynamicRowMap(
            ProcedureResult result,
            List<Integer> dynamicIndexes) {

        Map<String, List<String>> rows =
                new LinkedHashMap<String, List<String>>();

        int candidateIdIndex =
                findColumnIndex(result, "_candidateId");

        int revisitIdIndex =
                findColumnIndex(result, "_rid");

        if (candidateIdIndex < 0 || revisitIdIndex < 0) {
            throw new IllegalStateException(
                    "Candidate-based procedure must return "
                            + "_candidateId and _rid columns");
        }

        for (List<String> row : result.rows) {

            String candidateId = row.get(candidateIdIndex);
            String revisitId = row.get(revisitIdIndex);

            String mergeKey = candidateId + "#" + revisitId;

            List<String> dynamicValues =
                    new ArrayList<String>();

            for (Integer index : dynamicIndexes) {
                dynamicValues.add(row.get(index));
            }

            rows.put(mergeKey, dynamicValues);
        }

        return rows;
    }

    private int findColumnIndex(
            ProcedureResult result,
            String columnName) {

        for (int i = 0; i < result.columnNames.size(); i++) {

            if (columnName.equalsIgnoreCase(
                    result.columnNames.get(i))) {
                return i;
            }
        }

        return -1;
    }

    // ============================================================
    // Extract unique candidate IDs from unique-patient map
    // ============================================================

    private List<Long> extractCandidateIds(
            Map<String, List<String>> patientRows) {

        List<Long> candidateIds = new ArrayList<Long>();

        for (String mergeKey : patientRows.keySet()) {

            String[] parts = mergeKey.split("#", -1);

            if (parts.length < 2 || parts[0].trim().isEmpty()) {
                continue;
            }

            Long candidateId = Long.valueOf(parts[0]);

            if (!candidateIds.contains(candidateId)) {
                candidateIds.add(candidateId);
            }
        }

        return candidateIds;
    }

    // ============================================================
    // Resolve published configuration by hospital and report code
    // ============================================================

    private Long resolvePublishedVersion(
            Long hospitalId,
            String reportCode) {

        ReportMaster master = reportMasterRepository
                .findFirstByHospitalIdAndReportCodeAndActiveTrue(
                        hospitalId, reportCode)
                .orElseThrow(() -> new IllegalStateException(
                        reportCode
                                + " report configuration not found for hospitalId "
                                + hospitalId));

        ReportConfigVersion version = versionRepository
                .findFirstByReportIdAndStatusOrderByVersionNumberDesc(
                        master.getId(), PUBLISHED)
                .orElseThrow(() -> new IllegalStateException(
                        "Published " + reportCode
                                + " configuration not found for hospitalId "
                                + hospitalId));

        return version.getId();
    }

    // ============================================================
    // Load display names for configured fields and option columns
    // ============================================================

    private Map<String, String> loadDisplayNames(Long versionId) {

        Map<String, String> displayNames =
                new LinkedHashMap<String, String>();

        displayNames.put(
                "OUTREACHCLINICID", "OUTREACHCLINICID");
        displayNames.put(
                "OUTREACHCLINICNAME", "OUTREACHCLINICNAME");
        displayNames.put(
                "REGISTRATIONID", "REGISTRATIONID");
        displayNames.put(
                "CANDIDATENAME", "CANDIDATENAME");
        displayNames.put(
                "GENDER", "GENDER");
        displayNames.put(
                "AGE", "AGE");

        /*
         * Visible fields.
         */
        List<ReportFieldConfig> visibleFields =
                fieldRepository
                        .findByConfigVersionIdAndActiveTrueAndVisibleTrueOrderByDisplayOrderAscIdAsc(
                                versionId);

        for (ReportFieldConfig field : visibleFields) {
            displayNames.put(
                    field.getFieldKey(),
                    field.getDisplayName());
        }

        /*
         * Active options.
         *
         * Options may exist under a hidden parent field, so load
         * all active parent fields before loading their options.
         */
        List<ReportFieldConfig> activeFields =
                fieldRepository
                        .findByConfigVersionIdAndActiveTrueOrderByDisplayOrderAscIdAsc(
                                versionId);

        List<Long> fieldIds = activeFields.stream()
                .map(ReportFieldConfig::getId)
                .collect(Collectors.toList());

        if (!fieldIds.isEmpty()) {

            List<ReportFieldOptionConfig> options =
                    optionRepository
                            .findByReportFieldConfigIdInAndActiveTrueOrderByDisplayOrderAscIdAsc(
                                    fieldIds);

            for (ReportFieldOptionConfig option : options) {
                displayNames.put(
                        option.getOutputFieldKey(),
                        option.getDisplayName());
            }
        }

        return displayNames;
    }

    // ============================================================
    // Existing dynamic column metadata method
    // Retained from your original service.
    // ============================================================

    @Transactional(readOnly = true)
    public List<DynamicReportColumnDTO> getColumns(Long versionId) {

        List<ReportFieldConfig> visibleFields =
                fieldRepository
                        .findByConfigVersionIdAndActiveTrueAndVisibleTrueOrderByDisplayOrderAscIdAsc(
                                versionId);

        List<ReportFieldConfig> activeFields =
                fieldRepository
                        .findByConfigVersionIdAndActiveTrueOrderByDisplayOrderAscIdAsc(
                                versionId);

        List<Long> activeIds = activeFields.stream()
                .map(ReportFieldConfig::getId)
                .collect(Collectors.toList());

        List<ReportFieldOptionConfig> options =
                activeIds.isEmpty()
                        ? new ArrayList<ReportFieldOptionConfig>()
                        : optionRepository
                                .findByReportFieldConfigIdInAndActiveTrueOrderByDisplayOrderAscIdAsc(
                                        activeIds);

        Map<Long, ReportFieldConfig> parentById =
                new LinkedHashMap<Long, ReportFieldConfig>();

        for (ReportFieldConfig field : activeFields) {
            parentById.put(field.getId(), field);
        }

        List<DynamicReportColumnDTO> columns =
                new ArrayList<DynamicReportColumnDTO>();

        for (ReportFieldConfig field : visibleFields) {

            columns.add(toColumn(
                    field.getFieldKey(),
                    field.getDisplayName(),
                    field.getSectionName(),
                    field.getDisplayOrder(),
                    field.getColumnWidth(),
                    field.getDataType()));
        }

        for (ReportFieldOptionConfig option : options) {

            ReportFieldConfig parent =
                    parentById.get(option.getReportFieldConfigId());

            if (parent != null) {

                columns.add(toColumn(
                        option.getOutputFieldKey(),
                        option.getDisplayName(),
                        parent.getSectionName(),
                        option.getDisplayOrder(),
                        120,
                        "string"));
            }
        }

        columns.sort((first, second) -> {

            int firstOrder = first.getDisplayOrder() == null
                    ? 0 : first.getDisplayOrder();

            int secondOrder = second.getDisplayOrder() == null
                    ? 0 : second.getDisplayOrder();

            int orderComparison = Integer.compare(
                    firstOrder, secondOrder);

            if (orderComparison != 0) {
                return orderComparison;
            }

            return first.getFieldKey().compareTo(
                    second.getFieldKey());
        });

        return columns;
    }

    private DynamicReportColumnDTO toColumn(
            String fieldKey,
            String displayName,
            String sectionName,
            Integer displayOrder,
            Integer columnWidth,
            String dataType) {

        DynamicReportColumnDTO dto =
                new DynamicReportColumnDTO();

        dto.setFieldKey(fieldKey);
        dto.setDisplayName(displayName);
        dto.setSectionName(sectionName);
        dto.setDisplayOrder(displayOrder);
        dto.setColumnWidth(columnWidth);
        dto.setDataType(dataType);

        return dto;
    }

    // ============================================================
    // Exact existing unique-patient header from your ReportService
    // ============================================================

    private String[] getUniquePatientHeader() {

        return new String[] {
            "OUTREACH CLINIC ID",
            "OUTREACH CLINIC NAME",
            "CREATED DATE",
            "REVISIT CREATED DATE",
            "CREATED BY",
            "REGISTRATIONID",
            "NAME",
            "MOBILE NO",
            "GENDER",
            "AGE",
            "ADDRESS",
            "STREETID",
            "REASON",
            "ELIGIBILITY METRICS",
            "FATHER NAME",
            "SPOUSE NAME",
            "ALTERNATE MOBILE NO",
            "MONTHLY INCOME",
            "HOUSE TYPE",
            "EDUCATION",
            "OCCUPATION",
            "AADHAR",
            "VOTER ID",
            "RATION CARD",
            "MEDICAL HISTORY",
            "BLOOD PRESSURE",
            "PULSE RATE",
            "WEIGHT",
            "HISTORY OF SURGERY",
            "HEIGHT",
            "SPO2",
            "ALLERGY",
            "OTHER COMPLAINTS",
            "AGE AT MENARCHE",
            "AGE AT FIRST CHILD",
            "AGE AT LAST CHILD",
            "AGE AT MARRIAGE",
            "LAST MENSTRUATION",
            "ABNORMAL BLEEDING VAGINUM",
            "TOTAL PREGNANCIES",
            "CURRENTLY PREGNANT",
            "METHOD OF CONTRACEPTION USED",
            "UNDERGONE CERVICAL BREAST SCREENING",
            "BREAST FED",
            "SOCIAL HABITS"
        };
    }

    // ============================================================
    // Utility methods
    // ============================================================

    private List<String> emptyValues(int count) {

        List<String> values = new ArrayList<String>();

        for (int i = 0; i < count; i++) {
            values.add("");
        }

        return values;
    }

    private String toJsonArray(List<?> values) {

        return values.stream()
                .map(String::valueOf)
                .collect(Collectors.joining(",", "[", "]"));
    }

    private void validateRequest(DynamicReportRequest request) {

        if (request == null) {
            throw new IllegalArgumentException(
                    "Report request is required");
        }

        if (request.getHospitalId() == null
                || request.getHospitalId() <= 0) {
            throw new IllegalArgumentException(
                    "Valid hospitalId is required");
        }

        if (request.getReportType() == null
                || request.getReportType().trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "reportType is required");
        }

        if (request.getCampIds() == null
                || request.getCampIds().isEmpty()) {
            throw new IllegalArgumentException(
                    "At least one campId is required");
        }

        for (Long campId : request.getCampIds()) {
            if (campId == null || campId <= 0) {
                throw new IllegalArgumentException(
                        "All campIds must be positive numbers");
            }
        }

        try {

            LocalDate startDate =
                    LocalDate.parse(request.getStartDate());

            LocalDate endDate =
                    LocalDate.parse(request.getEndDate());

            if (startDate.isAfter(endDate)) {
                throw new IllegalArgumentException(
                        "startDate must be before or equal to endDate");
            }

        } catch (DateTimeParseException ex) {
            throw new IllegalArgumentException(
                    "Dates must be in yyyy-MM-dd format", ex);
        }

        String reportType =
                request.getReportType().trim().toUpperCase();

        if (!SCREENING.equals(reportType)
                && !CLINICAL.equals(reportType)
                && !CONSOLIDATION.equals(reportType)) {

            throw new IllegalArgumentException(
                    "reportType must be SCREENING, CLINICAL or CONSOLIDATION");
        }
    }

    // ============================================================
    // Internal stored procedure result holder
    // ============================================================

    private static class ProcedureResult {

        private final List<String> columnNames =
                new ArrayList<String>();

        private final List<List<String>> rows =
                new ArrayList<List<String>>();
    }
}