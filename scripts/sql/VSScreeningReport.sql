CREATE  PROCEDURE `VSclinicalReport`(
    IN camp_id VARCHAR(1000),
    IN start_date VARCHAR(100),
    IN end_date VARCHAR(100)
)
BEGIN
-- Breast Test
WITH breast_all AS (
    SELECT 
        ct.id AS candidateTestId,
        ct.candidateId,
        ct.createdDate,
        jt.testName,
        jt.singleVal,
        jt.multiVal,
        ct.createdBy,
        ct.lastModifiedBy,
        ct.revisitId
    FROM candidatetest ct
    INNER JOIN candidate ca ON ct.candidateId = ca.id
    JOIN JSON_TABLE(
        ct.testResult,
        '$.params[*]'
        COLUMNS (
            testName VARCHAR(100) PATH '$.testName',
            singleVal VARCHAR(255) PATH '$.selectedValue[0]',
            NESTED PATH '$.selectedValues[*]'
            COLUMNS (multiVal VARCHAR(255) PATH '$')
        )
    ) jt ON TRUE
    WHERE FIND_IN_SET(ca.campId, camp_id)
      AND ct.diseaseTestMasterId = 43
      AND ct.testResult IS NOT NULL
      AND ct.lastModifiedDate BETWEEN STR_TO_DATE(start_date, '%Y-%m-%d')
          AND STR_TO_DATE(end_date, '%Y-%m-%d') + INTERVAL 1 DAY - INTERVAL 1 SECOND
),
breast_grouped AS (
    SELECT
        candidateTestId,
        candidateId,
        createdDate,
        testName,
        revisitId,
        MAX(singleVal) AS singleVal,
        GROUP_CONCAT(DISTINCT multiVal ORDER BY multiVal SEPARATOR ', ') AS multiVal,
        createdBy,
        lastModifiedBy
    FROM breast_all
    GROUP BY candidateTestId, candidateId, createdDate, testName, revisitId
),
breast_pivot AS (
    SELECT
        candidateTestId,
        candidateId,
        createdDate,
        createdBy,
        lastModifiedBy,
        revisitId,
        MAX(CASE WHEN testName = 'Breast Clinical Examination'
                 THEN COALESCE(singleVal, multiVal) END) AS breast_clinical_exam,
        MAX(CASE WHEN testName = 'Doctor notes'
                 THEN COALESCE(singleVal, multiVal) END) AS breast_doctor_notes,
        MAX(CASE WHEN testName = 'Investigations suggested'
                 THEN COALESCE(singleVal, multiVal) END) AS breast_investigations,
        MAX(CASE WHEN testName = 'Ultrasound Breasts Report'
                 THEN COALESCE(singleVal, multiVal) END) AS breast_ultrasound_report,
        MAX(CASE WHEN testName = 'Ultrasound Breasts Report Date'
                 THEN COALESCE(singleVal, multiVal) END) AS breast_ultrasound_report_date,
        MAX(CASE WHEN testName = 'Biopsy Report'
                 THEN COALESCE(singleVal, multiVal) END) AS breast_biopsy_report,
        MAX(CASE WHEN testName = 'Biopsy Report Date'
                 THEN COALESCE(singleVal, multiVal) END) AS breast_biopsy_report_date,
        MAX(CASE WHEN testName = 'Final diagnosis'
                 THEN COALESCE(singleVal, multiVal) END) AS breast_final_diagnosis,
        MAX(CASE WHEN testName = 'Treatment Advised'
                 THEN COALESCE(singleVal, multiVal) END) AS breast_treatment_advised
    FROM breast_grouped
    GROUP BY candidateTestId, candidateId, createdDate, createdBy, lastModifiedBy, revisitId
),

-- Cervical Test
cervical_all AS (
    SELECT 
        ct.id AS candidateTestId,
        ct.candidateId,
        ct.createdDate,
        jt.testName,
        jt.singleVal,
        jt.multiVal,
        ct.createdBy,
        ct.lastModifiedBy,
        ct.revisitId
    FROM candidatetest ct
    INNER JOIN candidate ca ON ct.candidateId = ca.id
    JOIN JSON_TABLE(
        ct.testResult,
        '$.params[*]'
        COLUMNS (
            testName VARCHAR(100) PATH '$.testName',
            singleVal VARCHAR(255) PATH '$.selectedValue[0]',
            NESTED PATH '$.selectedValues[*]'
            COLUMNS (multiVal VARCHAR(255) PATH '$')
        )
    ) jt ON TRUE
    WHERE FIND_IN_SET(ca.campId, camp_id)
      AND ct.diseaseTestMasterId = 44
      AND ct.testResult IS NOT NULL
      AND ct.lastModifiedDate BETWEEN STR_TO_DATE(start_date, '%Y-%m-%d')
          AND STR_TO_DATE(end_date, '%Y-%m-%d') + INTERVAL 1 DAY - INTERVAL 1 SECOND
),
cervical_grouped AS (
    SELECT
        candidateTestId,
        candidateId,
        createdDate,
        testName,
        revisitId,
        MAX(singleVal) AS singleVal,
        GROUP_CONCAT(DISTINCT multiVal ORDER BY multiVal SEPARATOR ', ') AS multiVal,
        createdBy,
        lastModifiedBy
    FROM cervical_all
    GROUP BY candidateTestId, candidateId, createdDate, testName, revisitId
),
cervical_pivot AS (
    SELECT
        candidateTestId,
        candidateId,
        createdDate,
        createdBy,
        lastModifiedBy,
        revisitId,
        MAX(CASE WHEN testName = 'Cervical Clinical Examination'
                 THEN COALESCE(singleVal, multiVal) END) AS cervical_clinical_exam,
        MAX(CASE WHEN testName = 'Doctor notes'
                 THEN COALESCE(singleVal, multiVal) END) AS cervical_doctor_notes,
        MAX(CASE WHEN testName = 'Investigations suggested'
                 THEN COALESCE(singleVal, multiVal) END) AS cervical_investigations,
        MAX(CASE WHEN testName = 'Complete Blood Count Report'
                 THEN COALESCE(singleVal, multiVal) END) AS cervical_cbc_report,
        MAX(CASE WHEN testName = 'Complete Blood Count Report Date'
                 THEN COALESCE(singleVal, multiVal) END) AS cervical_cbc_report_date,
        MAX(CASE WHEN testName = 'Biopsy Report'
                 THEN COALESCE(singleVal, multiVal) END) AS cervical_biopsy_report,
        MAX(CASE WHEN testName = 'Biopsy Report Date'
                 THEN COALESCE(singleVal, multiVal) END) AS cervical_biopsy_report_date,
        MAX(CASE WHEN testName = 'Final diagnosis'
                 THEN COALESCE(singleVal, multiVal) END) AS cervical_final_diagnosis,
        MAX(CASE WHEN testName = 'Treatment Advised'
                 THEN COALESCE(singleVal, multiVal) END) AS cervical_treatment_advised
    FROM cervical_grouped
    GROUP BY candidateTestId, candidateId, createdDate, revisitId
),

-- Oral Test
oral_all AS (
    SELECT 
        ct.id AS candidateTestId,
        ct.candidateId,
        ct.createdDate,
        jt.testName,
        jt.singleVal,
        jt.multiVal,
        ct.createdBy,
        ct.lastModifiedBy,
        ct.revisitId
    FROM candidatetest ct
    INNER JOIN candidate ca ON ct.candidateId = ca.id
    JOIN JSON_TABLE(
        ct.testResult,
        '$.params[*]'
        COLUMNS (
            testName VARCHAR(100) PATH '$.testName',
            singleVal VARCHAR(255) PATH '$.selectedValue[0]',
            NESTED PATH '$.selectedValues[*]'
            COLUMNS (multiVal VARCHAR(255) PATH '$')
        )
    ) jt ON TRUE
    WHERE FIND_IN_SET(ca.campId, camp_id)
      AND ct.diseaseTestMasterId IN (41)
      AND ct.testResult IS NOT NULL
      AND ct.lastModifiedDate BETWEEN STR_TO_DATE(start_date, '%Y-%m-%d')
          AND STR_TO_DATE(end_date, '%Y-%m-%d') + INTERVAL 1 DAY - INTERVAL 1 SECOND
),
oral_grouped AS (
    SELECT
        candidateTestId,
        candidateId,
        createdDate,
        testName,
        revisitId,
        MAX(singleVal) AS singleVal,
        GROUP_CONCAT(DISTINCT multiVal ORDER BY multiVal SEPARATOR ', ') AS multiVal,
        createdBy,
        lastModifiedBy
    FROM oral_all
    GROUP BY candidateTestId, candidateId, createdDate, testName, revisitId
),
oral_pivot AS (
    SELECT
        candidateTestId,
        candidateId,
        createdDate,
        createdBy,
        lastModifiedBy,
        revisitId,
        MAX(CASE WHEN testName = 'Oral Clinical Evaluation'
                 THEN COALESCE(singleVal, multiVal) END) AS oral_clinical_evaluation,
        MAX(CASE WHEN testName = 'Doctor notes'
                 THEN COALESCE(singleVal, multiVal) END) AS oral_doctor_notes,
        MAX(CASE WHEN testName = 'Investigations suggested'
                 THEN COALESCE(singleVal, multiVal) END) AS oral_investigations,
        MAX(CASE WHEN testName = 'Biopsy'
                 THEN COALESCE(singleVal, multiVal) END) AS oral_biopsy,
        MAX(CASE WHEN testName = 'Biopsy Report'
                 THEN COALESCE(singleVal, multiVal) END) AS oral_biopsy_report,
        MAX(CASE WHEN testName = 'Biopsy Report Date'
                 THEN COALESCE(singleVal, multiVal) END) AS oral_biopsy_report_date,
        MAX(CASE WHEN testName = 'Final diagnosis'
                 THEN COALESCE(singleVal, multiVal) END) AS oral_final_diagnosis,
        MAX(CASE WHEN testName = 'Treatment'
                 THEN COALESCE(singleVal, multiVal) END) AS oral_treatment
    FROM oral_grouped
    GROUP BY candidateTestId, candidateId, createdDate, revisitId
),

-- Prostate Test
prostate_all AS (
    SELECT 
        ct.id AS candidateTestId,
        ct.candidateId,
        ct.createdDate,
        jt.testName,
        jt.singleVal,
        jt.multiVal,
        ct.createdBy,
        ct.lastModifiedBy,
        ct.revisitId
    FROM candidatetest ct
    INNER JOIN candidate ca ON ct.candidateId = ca.id
    JOIN JSON_TABLE(
        ct.testResult,
        '$.params[*]'
        COLUMNS (
            testName VARCHAR(100) PATH '$.testName',
            singleVal VARCHAR(255) PATH '$.selectedValues[0]',
            NESTED PATH '$.selectedValues[*]'
            COLUMNS (multiVal VARCHAR(255) PATH '$')
        )
    ) jt ON TRUE
    WHERE FIND_IN_SET(ca.campId, camp_id)
      AND ct.diseaseTestMasterId = 45
      AND ct.testResult IS NOT NULL
      AND ct.createdDate BETWEEN STR_TO_DATE(start_date, '%Y-%m-%d')
          AND STR_TO_DATE(end_date, '%Y-%m-%d') + INTERVAL 1 DAY - INTERVAL 1 SECOND
),
prostate_grouped AS (
    SELECT
        candidateTestId,
        candidateId,
        createdDate,
        testName,
        revisitId,
        MAX(singleVal) AS singleVal,
        GROUP_CONCAT(DISTINCT multiVal ORDER BY multiVal SEPARATOR ', ') AS multiVal,
        createdBy,
        lastModifiedBy
    FROM prostate_all
    GROUP BY candidateTestId, candidateId, createdDate, testName, revisitId
),
prostate_pivot AS (
    SELECT
        candidateTestId,
        candidateId,
        createdDate,
        createdBy,
        lastModifiedBy,
        revisitId,
        MAX(CASE WHEN testName = 'Prostate Clinical Examination'
                 THEN COALESCE(singleVal, multiVal) END) AS prostate_clinical_exam,
        MAX(CASE WHEN testName = 'Doctor notes'
                 THEN COALESCE(singleVal, multiVal) END) AS prostate_doctor_notes,
        MAX(CASE WHEN testName = 'Investigations suggested'
                 THEN COALESCE(singleVal, multiVal) END) AS prostate_investigations,
        MAX(CASE WHEN testName = 'Ultrasound KUB Report'
                 THEN COALESCE(singleVal, multiVal) END) AS prostate_ultrasound_kub_report,
        MAX(CASE WHEN testName = 'Ultrasound KUB Report Date'
                 THEN COALESCE(singleVal, multiVal) END) AS prostate_ultrasound_kub_report_date,
        MAX(CASE WHEN testName = 'Final diagnosis'
                 THEN COALESCE(singleVal, multiVal) END) AS prostate_final_diagnosis,
        MAX(CASE WHEN testName = 'Treatment Advised'
                 THEN COALESCE(singleVal, multiVal) END) AS prostate_treatment_advised
    FROM prostate_grouped
    GROUP BY candidateTestId, candidateId, createdDate, createdBy, lastModifiedBy, revisitId
),

revisit_master AS (
    SELECT candidateId, revisitId FROM breast_pivot
    UNION
    SELECT candidateId, revisitId FROM cervical_pivot
    UNION
    SELECT candidateId, revisitId FROM oral_pivot
    UNION
    SELECT candidateId, revisitId FROM prostate_pivot
)

SELECT 
    ca.registraionId AS registrationId,
    ca.name AS candidateName,
    rm.revisitId AS rid,

    DATE_FORMAT(CONVERT_TZ(bp.createdDate, '+00:00', '+05:30'), '%d-%m-%Y %H:%i:%s') AS breastCreatedDate,
    bp.createdBy AS breastcBy,
    bp.lastModifiedBy AS breastlBy,
    bp.breast_clinical_exam AS breastClinicalExam,
    bp.breast_doctor_notes AS breastDoctorNotes,
    bp.breast_investigations AS breastInvestigations,
    bp.breast_ultrasound_report AS breastUltrasoundReport,
    bp.breast_ultrasound_report_date AS breastUltrasoundReportDate,
    bp.breast_biopsy_report AS breastBiopsyReport,
    bp.breast_biopsy_report_date AS breastBiopsyReportDate,
    bp.breast_final_diagnosis AS breastFinalDiagnosis,
    bp.breast_treatment_advised AS breastTreatmentAdvised,

    DATE_FORMAT(CONVERT_TZ(cp.createdDate, '+00:00', '+05:30'), '%d-%m-%Y %H:%i:%s') AS cervicalCreatedDate,
    cp.createdBy AS cervicalcBy,
    cp.lastModifiedBy AS cervicallBy,
    cp.cervical_clinical_exam AS cervicalClinicalExam,
    cp.cervical_doctor_notes AS cervicalDoctorNotes,
    cp.cervical_investigations AS cervicalInvestigations,
    cp.cervical_cbc_report AS cervicalCBCReport,
    cp.cervical_cbc_report_date AS cervicalCBCReportDate,
    cp.cervical_biopsy_report AS cervicalBiopsyReport,
    cp.cervical_biopsy_report_date AS cervicalBiopsyReportDate,
    cp.cervical_final_diagnosis AS cervicalFinalDiagnosis,
    cp.cervical_treatment_advised AS cervicalTreatmentAdvised,

    DATE_FORMAT(CONVERT_TZ(op.createdDate, '+00:00', '+05:30'), '%d-%m-%Y %H:%i:%s') AS oralCreatedDate,
    op.createdBy AS oralcBy,
    op.lastModifiedBy AS orallBy,
    op.oral_clinical_evaluation AS oralClinicalEvaluation,
    op.oral_doctor_notes AS oralDoctorNotes,
    op.oral_investigations AS oralInvestigations,
    op.oral_biopsy AS oralBiopsy,
    op.oral_biopsy_report AS oralBiopsyReport,
    op.oral_biopsy_report_date AS oralBiopsyReportDate,
    op.oral_final_diagnosis AS oralFinalDiagnosis,
    op.oral_treatment AS oralTreatment,

    DATE_FORMAT(CONVERT_TZ(pp.createdDate, '+00:00', '+05:30'), '%d-%m-%Y %H:%i:%s') AS prostateCreatedDate,
    pp.createdBy AS prostatecBy,
    pp.lastModifiedBy AS prostatelBy,
    pp.prostate_clinical_exam AS prostateClinicalExam,
    pp.prostate_doctor_notes AS prostateDoctorNotes,
    pp.prostate_investigations AS prostateInvestigations,
    pp.prostate_ultrasound_kub_report AS prostateUltrasoundKUBReport,
    pp.prostate_ultrasound_kub_report_date AS prostateUltrasoundKUBReportDate,
    pp.prostate_final_diagnosis AS prostateFinalDiagnosis,
    pp.prostate_treatment_advised AS prostateTreatmentAdvised

FROM candidate ca
LEFT JOIN revisit_master rm ON rm.candidateId = ca.id
LEFT JOIN breast_pivot bp
    ON bp.candidateId = rm.candidateId
   AND bp.revisitId <=> rm.revisitId
LEFT JOIN cervical_pivot cp
    ON cp.candidateId = rm.candidateId
   AND cp.revisitId <=> rm.revisitId
LEFT JOIN oral_pivot op
    ON op.candidateId = rm.candidateId
   AND op.revisitId <=> rm.revisitId
LEFT JOIN prostate_pivot pp
    ON pp.candidateId = rm.candidateId
   AND pp.revisitId <=> rm.revisitId

WHERE FIND_IN_SET(ca.campId, camp_id)
ORDER BY ca.createdDate, ca.id, bp.createdDate, cp.createdDate, op.createdDate DESC;

END