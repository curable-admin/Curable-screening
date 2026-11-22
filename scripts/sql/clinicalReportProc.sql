CREATE  PROCEDURE `clinicalReport`(in camp_id varchar(1000), IN start_date VARCHAR(100),
    IN end_date VARCHAR(100))
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
		ct.lastModifiedBy
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
    WHERE FIND_IN_SET(ca.campId , camp_id)
      AND ct.diseaseTestMasterId = 20
      AND ct.testResult IS NOT NULL and
  ct.lastModifiedDate BETWEEN STR_TO_DATE(start_date, '%Y-%m-%d')
                        AND STR_TO_DATE(end_date, '%Y-%m-%d') + INTERVAL 1 DAY - INTERVAL 1 SECOND),
breast_grouped AS (
    SELECT
        candidateTestId,
        candidateId,
        createdDate,
        testName,
        MAX(singleVal) AS singleVal,
        GROUP_CONCAT(DISTINCT multiVal ORDER BY multiVal SEPARATOR ', ') AS multiVal,
         createdBy,
		lastModifiedBy
    FROM breast_all
    GROUP BY candidateTestId, candidateId, createdDate, testName
),
breast_pivot AS (
    SELECT
        candidateTestId,
        candidateId,
        createdDate,
        createdBy,
        lastModifiedBy,

        MAX(CASE WHEN testName = 'Breast Clinical Examination'
                 THEN COALESCE(singleVal, multiVal) END) AS breast_clinical_exam,

        MAX(CASE WHEN testName = 'UHID'
                 THEN COALESCE(singleVal, multiVal) END) AS breast_uhid,

        MAX(CASE WHEN testName = 'SCR OPD Number'
                 THEN COALESCE(singleVal, multiVal) END) AS breast_scr_opd_number,

        MAX(CASE WHEN testName = 'Mammogram'
                 THEN COALESCE(singleVal, multiVal) END) AS breast_mammogram,

        MAX(CASE WHEN testName = 'Mammogram – Right Breasts'
                 THEN COALESCE(singleVal, multiVal) END) AS breast_mammogram_right,

        MAX(CASE WHEN testName = 'Mammogram – Left Breasts'
                 THEN COALESCE(singleVal, multiVal) END) AS breast_mammogram_left,

        MAX(CASE WHEN testName = 'Mammogram Report Date'
                 THEN COALESCE(singleVal, multiVal) END) AS breast_mammogram_report_date,

        MAX(CASE WHEN testName = 'Ultrasound Breast'
                 THEN COALESCE(singleVal, multiVal) END) AS breast_ultrasound,

        MAX(CASE WHEN testName = 'Ultrasound – Right Breasts'
                 THEN COALESCE(singleVal, multiVal) END) AS breast_ultrasound_right,

        MAX(CASE WHEN testName = 'Ultrasound – Left Breasts'
                 THEN COALESCE(singleVal, multiVal) END) AS breast_ultrasound_left,

        MAX(CASE WHEN testName = 'Ultrasound Report Date'
                 THEN COALESCE(singleVal, multiVal) END) AS breast_ultrasound_report_date,

        MAX(CASE WHEN testName = 'Cytology'
                 THEN COALESCE(singleVal, multiVal) END) AS breast_cytology,

        MAX(CASE WHEN testName = 'Cytology Report Date'
                 THEN COALESCE(singleVal, multiVal) END) AS breast_cytology_report_date,

        MAX(CASE WHEN testName = 'Cytology Image'
                 THEN COALESCE(singleVal, multiVal) END) AS breast_cytology_image,

        MAX(CASE WHEN testName = 'Other findings'
                 THEN COALESCE(singleVal, multiVal) END) AS breast_other_findings,

        MAX(CASE WHEN testName = 'Biopsy'
                 THEN COALESCE(singleVal, multiVal) END) AS breast_biopsy,

        MAX(CASE WHEN testName = 'Biopsy Report Date'
                 THEN COALESCE(singleVal, multiVal) END) AS breast_biopsy_report_date,

        MAX(CASE WHEN testName = 'Biopsy Report'
                 THEN COALESCE(singleVal, multiVal) END) AS breast_biopsy_report,

        MAX(CASE WHEN testName = 'Additional Comments'
                 THEN COALESCE(singleVal, multiVal) END) AS breast_additional_comments,

        MAX(CASE WHEN testName = 'Final diagnosis'
                 THEN COALESCE(singleVal, multiVal) END) AS breast_final_diagnosis,

        MAX(CASE WHEN testName = 'Treatment'
                 THEN COALESCE(singleVal, multiVal) END) AS breast_treatment,

        MAX(CASE WHEN testName = 'Followup Advice'
                 THEN COALESCE(singleVal, multiVal) END) AS breast_followup_advice,
                  MAX(CASE WHEN testName = 'Mammogram taken date'
                 THEN COALESCE(singleVal, multiVal) END) AS breast_Mammogram_taken_date,
                 MAX(CASE WHEN testName = 'USG taken date'
                 THEN COALESCE(singleVal, multiVal) END) AS breast_USG_taken_date
                 
                 

    FROM breast_grouped
    GROUP BY candidateTestId, candidateId, createdDate, createdBy, lastModifiedBy
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
		ct.lastModifiedBy
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
    WHERE FIND_IN_SET(ca.campId , camp_id)
      AND ct.diseaseTestMasterId = 22
      AND ct.testResult IS NOT NULL and
  ct.lastModifiedDate BETWEEN STR_TO_DATE(start_date, '%Y-%m-%d')
                        AND STR_TO_DATE(end_date, '%Y-%m-%d') + INTERVAL 1 DAY - INTERVAL 1 SECOND
),
cervical_grouped AS (
    SELECT
        candidateTestId,
        candidateId,
        createdDate,
        testName,
        MAX(singleVal) AS singleVal,
        GROUP_CONCAT(DISTINCT multiVal ORDER BY multiVal SEPARATOR ', ') AS multiVal,
         createdBy,
		lastModifiedBy
    FROM cervical_all
    GROUP BY candidateTestId, candidateId, createdDate, testName
),
cervical_pivot AS (
    SELECT
        candidateTestId, candidateId, createdDate,
 createdBy,
		lastModifiedBy,
        MAX(CASE WHEN testName = 'Cervical Clinical Examination' 
                 THEN COALESCE(singleVal, multiVal) END) AS cervical_clinical_exam,

        MAX(CASE WHEN testName = 'UHID' 
                 THEN COALESCE(singleVal, multiVal) END) AS cervical_uhid,

        MAX(CASE WHEN testName = 'SCR OPD Number' 
                 THEN COALESCE(singleVal, multiVal) END) AS cervical_opd_number,

        MAX(CASE WHEN testName = 'Colposcopy' 
                 THEN COALESCE(singleVal, multiVal) END) AS cervical_colposcopy,

        MAX(CASE WHEN testName = 'Image' 
                 THEN COALESCE(singleVal, multiVal) END) AS cervical_image,

        MAX(CASE WHEN testName = 'Colposcopy Report' 
                 THEN COALESCE(singleVal, multiVal) END) AS cervical_colposcopy_report,

        MAX(CASE WHEN testName = 'Colposcopy Report Date' 
                 THEN COALESCE(singleVal, multiVal) END) AS cervical_colposcopy_report_date,

        MAX(CASE WHEN testName = 'Colpo Guided Biopsy' 
                 THEN COALESCE(singleVal, multiVal) END) AS cervical_colpo_biopsy,

        MAX(CASE WHEN testName = 'Colpo Guided Biopsy Report Date' 
                 THEN COALESCE(singleVal, multiVal) END) AS cervical_colpo_biopsy_report_date,

        MAX(CASE WHEN testName = 'Colpo Guided Biopsy Image' 
                 THEN COALESCE(singleVal, multiVal) END) AS cervical_colpo_biopsy_image,

        MAX(CASE WHEN testName = 'Additional Comments' 
                 THEN COALESCE(singleVal, multiVal) END) AS cervical_additional_comments,

        MAX(CASE WHEN testName = 'Treatment Plan' 
                 THEN COALESCE(singleVal, multiVal) END) AS cervical_treatment_plan,

        MAX(CASE WHEN testName = 'Treatment' 
                 THEN COALESCE(singleVal, multiVal) END) AS cervical_treatment,

        MAX(CASE WHEN testName = 'Followup Advice' 
                 THEN COALESCE(singleVal, multiVal) END) AS cervical_followup_advice

    FROM cervical_grouped
    GROUP BY candidateTestId, candidateId, createdDate
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
		ct.lastModifiedBy
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
    WHERE FIND_IN_SET(ca.campId , camp_id)
      AND ct.diseaseTestMasterId in (31,25)
      AND ct.testResult IS NOT NULL and
        ct.lastModifiedDate BETWEEN STR_TO_DATE(start_date, '%Y-%m-%d')
                        AND STR_TO_DATE(end_date, '%Y-%m-%d') + INTERVAL 1 DAY - INTERVAL 1 SECOND
),
oral_grouped AS (
    SELECT
        candidateTestId,
        candidateId,
        createdDate,
        testName,
        MAX(singleVal) AS singleVal,
        GROUP_CONCAT(DISTINCT multiVal ORDER BY multiVal SEPARATOR ', ') AS multiVal,
         createdBy,
		lastModifiedBy
    FROM oral_all
    GROUP BY candidateTestId, candidateId, createdDate, testName
),
oral_pivot AS (
    SELECT
        candidateTestId, candidateId, createdDate,
 createdBy,
		lastModifiedBy,
        MAX(CASE WHEN testName = 'Oral Clinical Evaluation' 
                 THEN COALESCE(singleVal, multiVal) END) AS oral_clinical_eval,

        MAX(CASE WHEN testName = 'UHID' 
                 THEN COALESCE(singleVal, multiVal) END) AS oral_uhid,

        MAX(CASE WHEN testName = 'SCR OPD Number' 
                 THEN COALESCE(singleVal, multiVal) END) AS oral_opd_number,

        MAX(CASE WHEN testName = 'Tobacco Counselling' 
                 THEN COALESCE(singleVal, multiVal) END) AS oral_tobacco_counselling,

        MAX(CASE WHEN testName = 'Tobacco counselling : Outcome of visit' 
                 THEN COALESCE(singleVal, multiVal) END) AS oral_tobacco_outcome,

        MAX(CASE WHEN testName = 'Tobacco Counselling : Report Date' 
                 THEN COALESCE(singleVal, multiVal) END) AS oral_tobacco_report_date,

        MAX(CASE WHEN testName = 'Head & Neck OPD' 
                 THEN COALESCE(singleVal, multiVal) END) AS oral_head_neck_opd,

        MAX(CASE WHEN testName = 'Head & Neck OPD : Outcome of visit' 
                 THEN COALESCE(singleVal, multiVal) END) AS oral_head_neck_report_date,

        MAX(CASE WHEN testName = 'Head & Neck OPD : Report Date' 
                 THEN COALESCE(singleVal, multiVal) END) AS oral_head_neck_outcome,

        MAX(CASE WHEN testName = 'Oral Cytology' 
                 THEN COALESCE(singleVal, multiVal) END) AS oral_cytology,

        MAX(CASE WHEN testName = 'Oral Cytology Report' 
                 THEN COALESCE(singleVal, multiVal) END) AS oral_cytology_report,

        MAX(CASE WHEN testName = 'Oral Cytology Report Date' 
                 THEN COALESCE(singleVal, multiVal) END) AS oral_cytology_report_date,

        MAX(CASE WHEN testName = 'Biopsy' 
                 THEN COALESCE(singleVal, multiVal) END) AS oral_biopsy,

        MAX(CASE WHEN testName = 'Biopsy Report' 
                 THEN COALESCE(singleVal, multiVal) END) AS oral_biopsy_report,

        MAX(CASE WHEN testName = 'Biopsy Report Date' 
                 THEN COALESCE(singleVal, multiVal) END) AS oral_biopsy_report_date,

        MAX(CASE WHEN testName = 'Additional Comments' 
                 THEN COALESCE(singleVal, multiVal) END) AS oral_additional_comments,

        MAX(CASE WHEN testName = 'Final diagnosis' 
                 THEN COALESCE(singleVal, multiVal) END) AS oral_final_diagnosis,

        MAX(CASE WHEN testName = 'Treatment' 
                 THEN COALESCE(singleVal, multiVal) END) AS oral_treatment,

        MAX(CASE WHEN testName = 'Followup Advice' 
                 THEN COALESCE(singleVal, multiVal) END) AS oral_followup_advice

    FROM oral_grouped
    GROUP BY candidateTestId, candidateId, createdDate
)
-- Final Output
SELECT 
    ca.registraionId                  AS registrationId,
    ca.name                           AS candidateName,

    -- Breast
    
DATE_FORMAT(CONVERT_TZ(bp.createdDate, '+00:00', '+05:30'), '%d-%m-%Y %H:%i:%s') AS breastCreatedDate,

     bp.createdBy                     AS breastcBy,
		bp.lastModifiedBy AS breastlBy,

    bp.breast_clinical_exam           AS breastClinicalExam,
    bp.breast_uhid                    AS breastUhid,
    bp.breast_scr_opd_number          AS breastScrOpdNumber,
    bp.breast_mammogram               AS breastMammogram,
    bp.breast_mammogram_right         AS breastMammogramRight,
    bp.breast_mammogram_left          AS breastMammogramLeft,
    bp.breast_mammogram_report_date   AS breastMammogramReportDate,
    bp.breast_ultrasound              AS breastUltrasound,
    bp.breast_ultrasound_right        AS breastUltrasoundRight,
    bp.breast_ultrasound_left         AS breastUltrasoundLeft,
    bp.breast_ultrasound_report_date  AS breastUltrasoundReportDate,
    bp.breast_cytology                AS breastCytology,
    bp.breast_cytology_report_date    AS breastCytologyReportDate,
    bp.breast_cytology_image          AS breastCytologyImage,
    bp.breast_other_findings          AS breastOtherFindings,
    bp.breast_biopsy                  AS breastBiopsy,
    bp.breast_biopsy_report_date      AS breastBiopsyReportDate,
    bp.breast_biopsy_report           AS breastBiopsyReport,
    bp.breast_additional_comments     AS breastAdditionalComments,
    bp.breast_final_diagnosis         AS breastFinalDiagnosis,
    bp.breast_treatment               AS breastTreatment,
    bp.breast_followup_advice         AS breastFollowupAdvice,
    bp.breast_USG_taken_date          as breastUSGTakenDate,
    bp.breast_Mammogram_taken_date    as breastMammogramTakenDate,

    -- Cervical

    DATE_FORMAT(CONVERT_TZ(cp.createdDate, '+00:00', '+05:30'), '%d-%m-%Y %H:%i:%s') AS cervicalCreatedDate,

    cp.createdBy                     AS cervicalcBy,
		cp.lastModifiedBy AS cervicallBy,
    cp.cervical_clinical_exam         AS cervicalClinicalExam,
    cp.cervical_uhid                  AS cervicalUhid,
    cp.cervical_opd_number            AS cervicalOpdNumber,
    cp.cervical_colposcopy            AS cervicalColposcopy,
    cp.cervical_image                 AS cervicalImage,
    cp.cervical_colposcopy_report     AS cervicalColposcopyReport,
    cp.cervical_colposcopy_report_date AS cervicalColposcopyReportDate,
    cp.cervical_colpo_biopsy          AS cervicalColpoBiopsy,
    cp.cervical_colpo_biopsy_report_date AS cervicalColpoBiopsyReportDate,
    cp.cervical_colpo_biopsy_image    AS cervicalColpoBiopsyImage,
    cp.cervical_additional_comments   AS cervicalAdditionalComments,
    cp.cervical_treatment_plan        AS cervicalTreatmentPlan,
    cp.cervical_treatment             AS cervicalTreatment,
    cp.cervical_followup_advice       AS cervicalFollowupAdvice,

    -- Oral

        DATE_FORMAT(CONVERT_TZ(op.createdDate, '+00:00', '+05:30'), '%d-%m-%Y %H:%i:%s') AS oralCreatedDate,

    op.createdBy                     AS oralcBy,
		op.lastModifiedBy AS orallBy,
    op.oral_clinical_eval             AS oralClinicalEvaluation,
    op.oral_uhid                      AS oralUhid,
    op.oral_opd_number                AS oralOpdNumber,
    op.oral_tobacco_counselling       AS oralTobaccoCounselling,
    op.oral_tobacco_outcome           AS oralTobaccoOutcome,
    op.oral_tobacco_report_date       AS oralTobaccoReportDate,
    op.oral_head_neck_opd             AS oralHeadNeckOpd,
    op.oral_head_neck_report_date     AS oralHeadNeckReportDate,
    op.oral_head_neck_outcome         AS oralHeadNeckOutcome,
    op.oral_cytology                  AS oralCytology,
    op.oral_cytology_report           AS oralCytologyReport,
    op.oral_cytology_report_date      AS oralCytologyReportDate,
    op.oral_biopsy                    AS oralBiopsy,
    op.oral_biopsy_report             AS oralBiopsyReport,
    op.oral_biopsy_report_date        AS oralBiopsyReportDate,
    op.oral_additional_comments       AS oralAdditionalComments,
    op.oral_final_diagnosis           AS oralFinalDiagnosis,
    op.oral_treatment                 AS oralTreatment,
    op.oral_followup_advice           AS oralFollowupAdvice

FROM candidate ca
LEFT JOIN breast_pivot bp ON bp.candidateId = ca.id
LEFT JOIN cervical_pivot cp ON cp.candidateId = ca.id
LEFT JOIN oral_pivot op ON op.candidateId = ca.id
WHERE FIND_IN_SET(ca.campId , camp_id)
ORDER BY ca.createdDate,ca.id, bp.createdDate, cp.createdDate, op.createdDate desc;
END