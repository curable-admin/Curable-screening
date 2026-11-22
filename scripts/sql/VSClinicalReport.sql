CREATE PROCEDURE `VSscreeningReport`(in camp_id varchar(9000), IN start_date VARCHAR(100),
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
		ct.lastModifiedBy,
        ct.completed,
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
            COLUMNS (multiVal VARCHAR(2559) PATH '$')
        )
    ) jt ON TRUE
    WHERE FIND_IN_SET(ca.campId , camp_id)
      AND ct.diseaseTestMasterId = 35 
      AND ct.testResult IS NOT NULL and
      ct.lastModifiedDate BETWEEN STR_TO_DATE(start_date, '%Y-%m-%d')
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
		lastModifiedBy,
         completed
    FROM breast_all
    GROUP BY candidateTestId, candidateId, createdDate, testName,revisitId
),
breast_pivot AS (
    SELECT
        candidateTestId, candidateId, createdDate,createdBy,
		lastModifiedBy, completed,revisitId,
        MAX(CASE WHEN testName = 'Is patient willing for Breast  Screening' THEN COALESCE(singleVal, multiVal) END) AS breast_exam,
        MAX(CASE WHEN testName = 'Symptoms' THEN COALESCE(singleVal, multiVal) END) AS breast_symptoms,
        MAX(CASE WHEN testName = 'Tests to be done' THEN multiVal END) AS test_to_be_done,
        MAX(CASE WHEN testName = 'Visual Examination Report' THEN multiVal END) AS visualReport,
        MAX(CASE WHEN testName = 'Thermal screening Report' THEN multiVal END) AS thermalReport,
        MAX(CASE WHEN testName = 'Mammogram Report' THEN multiVal END) AS mammoReport,
        MAX(CASE WHEN testName = 'Findings' THEN multiVal END) AS findings,
		 MAX(CASE WHEN testName = 'Referral' THEN multiVal END) AS breast_referred
    FROM breast_grouped
    GROUP BY candidateTestId, candidateId, createdDate,revisitId
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
		ct.lastModifiedBy, ct.completed,ct.revisitId
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
      AND ct.diseaseTestMasterId = 38
      AND ct.testResult IS NOT NULL and
      ct.lastModifiedDate BETWEEN STR_TO_DATE(start_date, '%Y-%m-%d')
                        AND STR_TO_DATE(end_date, '%Y-%m-%d') + INTERVAL 1 DAY - INTERVAL 1 SECOND
),
cervical_grouped AS (
    SELECT
        candidateTestId,
        candidateId,
        createdDate,
        testName,revisitId,
        MAX(singleVal) AS singleVal,
        GROUP_CONCAT(DISTINCT multiVal ORDER BY multiVal SEPARATOR ', ') AS multiVal,
                createdBy,
		lastModifiedBy, completed
    FROM cervical_all
    GROUP BY candidateTestId, candidateId, createdDate, testName,revisitId
),
cervical_pivot AS (
    SELECT
        candidateTestId, candidateId, createdDate,
        createdBy,
		lastModifiedBy, completed,revisitId,
        MAX(CASE WHEN testName = 'Is patient willing for Cervical Screening' THEN COALESCE(singleVal, multiVal) END) AS cervical_screening,
        MAX(CASE WHEN testName = 'Symptoms' THEN COALESCE(singleVal, multiVal) END) AS cervical_symptoms,
        MAX(CASE WHEN testName = 'Pap smear' THEN COALESCE(singleVal, multiVal) END) AS pap,
        MAX(CASE WHEN testName = 'Report' THEN COALESCE(singleVal, multiVal) END) AS report,
        MAX(CASE WHEN testName = 'Date' THEN COALESCE(singleVal, multiVal) END) AS date,
        MAX(CASE WHEN testName = 'Referral'  THEN COALESCE(singleVal, multiVal) END) AS cervical_referral
        
    FROM cervical_grouped
    GROUP BY candidateTestId, candidateId, createdDate,revisitId
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
		ct.lastModifiedBy,ct.completed,ct.revisitId
    FROM candidatetest ct
    left JOIN candidate ca ON ct.candidateId = ca.id
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
      AND ct.diseaseTestMasterId in (36)
      AND ct.testResult IS NOT NULL and
       ct.lastModifiedDate BETWEEN STR_TO_DATE(start_date, '%Y-%m-%d')
                        AND STR_TO_DATE(end_date, '%Y-%m-%d') + INTERVAL 1 DAY - INTERVAL 1 SECOND
      
),
oral_grouped AS (
    SELECT
        candidateTestId,
        candidateId,
        createdDate,
        testName,revisitId,
        MAX(singleVal) AS singleVal,
        GROUP_CONCAT(DISTINCT multiVal ORDER BY multiVal SEPARATOR ', ') AS multiVal,
                createdBy,
		lastModifiedBy,completed
    FROM oral_all
    GROUP BY candidateTestId, candidateId, createdDate, testName,revisitId
),
oral_pivot AS (
    SELECT
        candidateTestId, candidateId, createdDate,
        createdBy, lastModifiedBy,completed,revisitId,
        MAX(CASE WHEN testName = 'Oral Examination'                 THEN COALESCE(singleVal, multiVal) END) AS oral_exam,
        MAX(CASE WHEN testName = 'Symptoms'                         THEN COALESCE(singleVal, multiVal) END) AS oral_symptoms,
        MAX(CASE WHEN testName = 'Select Symptoms'                  THEN multiVal END)                       AS select_symptoms,
        MAX(CASE WHEN testName = 'General Dental Tooth Issues'                   THEN COALESCE(singleVal, multiVal) END) AS gdToothIssues,
        MAX(CASE WHEN testName = 'General Dental Gums Issues'                THEN COALESCE(singleVal, multiVal) END) AS gdGumsIssue,
        MAX(CASE WHEN testName = 'General Dental Difficulty Chewing Issues'     THEN multiVal END)      AS gdChewingIssues,
        MAX(CASE WHEN testName = 'General Dental Bad Breath'      THEN COALESCE(singleVal, multiVal) END) AS gdBadBreath,
        MAX(CASE WHEN testName = 'General Dental Spacing/Alignment issues'  THEN COALESCE(singleVal, multiVal) END) AS gdAdIssues,
        MAX(CASE WHEN testName = 'General Dental Ulcers Issues'                      THEN COALESCE(singleVal, multiVal) END) AS gdUlcerIssues,
        MAX(CASE WHEN testName = 'Doctor notes'                      THEN COALESCE(singleVal, multiVal) END) AS drNotes,
        MAX(CASE WHEN testName = 'Referral'                         THEN COALESCE(singleVal, multiVal) END) AS referral
    FROM oral_grouped
    GROUP BY candidateTestId, candidateId, createdDate,revisitId
),
symptom_all AS (
    SELECT 
        ct.id AS candidateTestId,
        ct.candidateId,
        ct.createdDate,
        jt.testName,
        jt.singleVal,
        jt.multiVal,
        ct.createdBy,
        ct.lastModifiedBy,ct.completed,ct.revisitId
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
      AND ct.diseaseTestMasterId in (40)
      AND ct.testResult IS NOT NULL
      AND ct.lastModifiedDate BETWEEN STR_TO_DATE(start_date, '%Y-%m-%d')
                              AND STR_TO_DATE(end_date, '%Y-%m-%d') + INTERVAL 1 DAY - INTERVAL 1 SECOND
),
symptom_grouped AS (
    SELECT
        candidateTestId, candidateId, createdDate, testName,
        MAX(singleVal) AS singleVal,
        GROUP_CONCAT(DISTINCT multiVal ORDER BY multiVal SEPARATOR ', ') AS multiVal,
        createdBy, lastModifiedBy,completed,revisitId
    FROM symptom_all
    GROUP BY candidateTestId, candidateId, createdDate, testName,revisitId
),
symptom_pivot AS (
    SELECT
        candidateTestId, candidateId, createdDate, createdBy, lastModifiedBy,completed,revisitId,
        MAX(CASE WHEN testName = 'Investigations suggested' THEN COALESCE(singleVal, multiVal) END) AS symp_based_referral,
        MAX(CASE WHEN testName = 'Findings on Lab Investigations ' THEN multiVal END) AS symp_symptoms,
        MAX(CASE WHEN testName = 'Referral' THEN COALESCE(singleVal, multiVal) END) AS symp_referral
       
    FROM symptom_grouped
    GROUP BY candidateTestId, candidateId, createdDate,revisitId
),
prostate_all AS (
    SELECT 
        ct.id AS candidateTestId,
        ct.candidateId,
        ct.createdDate,
        jt.testName,
        jt.singleVal,
        jt.multiVal,
        ct.createdBy,
        ct.lastModifiedBy,ct.completed,ct.revisitId
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
      AND ct.diseaseTestMasterId in (39)
      AND ct.testResult IS NOT NULL
      AND ct.lastModifiedDate BETWEEN STR_TO_DATE(start_date, '%Y-%m-%d')
                              AND STR_TO_DATE(end_date, '%Y-%m-%d') + INTERVAL 1 DAY - INTERVAL 1 SECOND
),
prostate_grouped AS (
    SELECT
        candidateTestId, candidateId, createdDate, testName,
        MAX(singleVal) AS singleVal,revisitId,
        GROUP_CONCAT(DISTINCT multiVal ORDER BY multiVal SEPARATOR ', ') AS multiVal,
        createdBy, lastModifiedBy,completed
    FROM prostate_all
    GROUP BY candidateTestId, candidateId, createdDate, testName,revisitId
),
prostate_pivot AS (
    SELECT
        candidateTestId, candidateId, createdDate, createdBy, lastModifiedBy,completed,revisitId,
        MAX(CASE WHEN testName = 'Is patient willing for Prostate Screening' THEN COALESCE(singleVal, multiVal) END) AS prostate,
        MAX(CASE WHEN testName = 'Symptoms' THEN multiVal END) AS prostate_symptoms,
		MAX(CASE WHEN testName = 'PSA Test' THEN COALESCE(singleVal, multiVal) END) AS prostate_psa,
        MAX(CASE WHEN testName = 'Report' THEN COALESCE(singleVal, multiVal) END) AS prostate_report,
        MAX(CASE WHEN testName = 'Date' THEN COALESCE(singleVal, multiVal) END) AS  prostate_date,
        MAX(CASE WHEN testName = 'Referral' THEN COALESCE(singleVal, multiVal) END) AS prostate_referral
       
    FROM prostate_grouped
    GROUP BY candidateTestId, candidateId, createdDate,revisitId
),

revisit_master AS (
    SELECT candidateId, revisitId FROM breast_pivot
    UNION
    SELECT candidateId, revisitId FROM cervical_pivot
    UNION
    SELECT candidateId, revisitId FROM oral_pivot
    UNION
    SELECT candidateId, revisitId FROM symptom_pivot
    UNION
    SELECT candidateId, revisitId FROM  prostate_pivot
)
-- Final Output
SELECT 
cm.campIdPrefix,
cm.name,
ca.gender,
    ca.registraionId AS registraionId,
    ca.name AS candidateName,
ca.id as id,
rm.revisitId as rid,
    /* ---------------- Breast ---------------- */
    DATE_FORMAT(CONVERT_TZ(bp.createdDate, '+00:00', '+05:30'), '%d-%m-%Y %H:%i:%s') AS breastCreatedDate,
    bp.createdBy AS breastCreatedBy,
    bp.lastModifiedBy AS breastLastModifiedBy,
    bp.completed AS breastCompleted,
    bp.breast_exam AS breastExam,
    bp.breast_symptoms AS breastSymptoms,
    bp.test_to_be_done AS breastTestToBeDone,
    bp.visualReport AS breastVisualReport,
    bp.thermalReport AS breastThermalReport,
    bp.mammoReport AS breastMammogramReport,
    bp.findings AS breastFindings,
    bp.breast_referred AS breastReferral,

    /* ---------------- Cervical ---------------- */
    DATE_FORMAT(CONVERT_TZ(cp.createdDate, '+00:00', '+05:30'), '%d-%m-%Y %H:%i:%s') AS cervicalCreatedDate,
    cp.createdBy AS cervicalCreatedBy,
    cp.lastModifiedBy AS cervicalLastModifiedBy,
    cp.completed AS cervicalCompleted,
    cp.cervical_screening AS cervicalScreening,
    cp.cervical_symptoms AS cervicalSymptoms,
    cp.pap AS cervicalPapSmear,
    cp.report AS cervicalReport,
    cp.date AS cervicalReportDate,
    cp.cervical_referral AS cervicalReferral,

    /* ---------------- Oral ---------------- */
    DATE_FORMAT(CONVERT_TZ(op.createdDate, '+00:00', '+05:30'), '%d-%m-%Y %H:%i:%s') AS oralCreatedDate,
    op.createdBy AS oralCreatedBy,
    op.lastModifiedBy AS oralLastModifiedBy,
    op.completed AS oralCompleted,
    op.oral_exam AS oralExam,
    op.oral_symptoms AS oralSymptoms,
    op.select_symptoms AS oralSelectSymptoms,
    op.gdToothIssues AS oralToothIssues,
    op.gdGumsIssue AS oralGumsIssues,
    op.gdChewingIssues AS oralChewingIssues,
    op.gdBadBreath AS oralBadBreath,
    op.gdAdIssues AS oralAlignmentIssues,
    op.gdUlcerIssues AS oralUlcerIssues,
    op.drNotes AS oralDoctorNotes,
    op.referral AS oralReferral,

    /* ---------------- Symptom Based Cancer ---------------- */
    DATE_FORMAT(CONVERT_TZ(sp.createdDate, '+00:00', '+05:30'), '%d-%m-%Y %H:%i:%s') AS sympCreatedDate,
    sp.createdBy AS sympCreatedBy,
    sp.lastModifiedBy AS sympLastModifiedBy,
    sp.completed AS sympCompleted,
    sp.symp_based_referral AS sympBasedReferral,
    sp.symp_symptoms AS sympSymptoms,
    sp.symp_referral AS sympReferral,
	/* ---------------- Prostate ---------------- */
DATE_FORMAT(CONVERT_TZ(pp.createdDate, '+00:00', '+05:30'), '%d-%m-%Y %H:%i:%s') AS prostateCreatedDate,
pp.createdBy AS prostateCreatedBy,
pp.lastModifiedBy AS prostateLastModifiedBy,
pp.completed AS prostateCompleted,
pp.prostate AS prostateScreening,
pp.prostate_symptoms AS prostateSymptoms,
pp.prostate_psa AS prostatePSA,
pp.prostate_report AS prostateReport,
pp.prostate_date AS prostateReportDate,
pp.prostate_referral AS prostateReferral

FROM candidate ca
left join camp cm on cm.id=ca.campId
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

LEFT JOIN symptom_pivot sp
    ON sp.candidateId = rm.candidateId
   AND sp.revisitId <=> rm.revisitId
   
   LEFT JOIN prostate_pivot pp
    ON pp.candidateId = rm.candidateId
   AND pp.revisitId <=> rm.revisitId

WHERE FIND_IN_SET(ca.campId, camp_id)
ORDER BY 
    bp.createdDate,
    cp.createdDate,
    op.createdDate,
    sp.createdDate,
	 pp.createdDate;

END