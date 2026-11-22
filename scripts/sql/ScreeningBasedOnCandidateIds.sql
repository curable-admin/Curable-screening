CREATE  PROCEDURE `screeningReportV1`(IN camp_id VARCHAR(9000), IN candidate_ids LONGTEXT)
BEGIN
-- Breast Test
WITH breast_all AS (
    SELECT 
        ct.id AS candidateTestId,
        ct.candidateId,ct.lastModifiedDate,
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
        '$.params[*]'        COLUMNS (
            testName VARCHAR(100) PATH '$.testName',
            singleVal VARCHAR(255) PATH '$.selectedValue[0]',
            NESTED PATH '$.selectedValues[*]'
            COLUMNS (multiVal VARCHAR(255) PATH '$')
        )
    ) jt ON TRUE
    WHERE FIND_IN_SET(ca.campId , camp_id)
 
      AND FIND_IN_SET(ct.candidateId , candidate_ids)
      AND ct.diseaseTestMasterId = 21
      AND ct.testResult IS NOT NULL
    
),
breast_grouped AS (
    SELECT
        candidateTestId,
        candidateId,
        createdDate,
        revisitId,
        testName,lastModifiedDate,
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
        candidateTestId, candidateId, createdDate,createdBy,revisitId,
		lastModifiedBy, completed,lastModifiedDate,
        MAX(CASE WHEN testName = 'Breast Examination' THEN COALESCE(singleVal, multiVal) END) AS breast_exam,
        MAX(CASE WHEN testName = 'Symptoms' THEN COALESCE(singleVal, multiVal) END) AS breast_symptoms,
        MAX(CASE WHEN testName = 'Right Breast on palpation' THEN multiVal END) AS right_breast_on_palpation,
        MAX(CASE WHEN testName = 'Left Breast on palpation' THEN multiVal END) AS left_breast_on_palpation,
        MAX(CASE WHEN testName = 'Nipple Discharge' THEN multiVal END) AS breast_nipple_discharge,
        MAX(CASE WHEN testName = 'Referral' THEN multiVal END) AS breast_referral,
        MAX(CASE WHEN testName = 'Referred for' THEN multiVal END) AS breast_referred_for
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
        jt.multiVal,ct.lastModifiedDate,
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
        AND FIND_IN_SET(ct.candidateId , candidate_ids)

      AND ct.diseaseTestMasterId = 23
      AND ct.testResult IS NOT NULL
),
cervical_grouped AS (
    SELECT
        candidateTestId,
        candidateId,
        createdDate,
        testName,lastModifiedDate,
        revisitId,
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
        createdBy,lastModifiedDate,
		lastModifiedBy, completed,revisitId,
        MAX(CASE WHEN testName = 'Cervical Screening' THEN COALESCE(singleVal, multiVal) END) AS cervical_screening,
        MAX(CASE WHEN testName = 'Reason' THEN COALESCE(singleVal, multiVal) END) AS cervical_reason,
        MAX(CASE WHEN testName = 'Symptoms' THEN COALESCE(singleVal, multiVal) END) AS cervical_symptoms,
        MAX(CASE WHEN testName = 'Abnormal bleeding per vaginum' THEN COALESCE(singleVal, multiVal) END) AS cervical_abnormal_bleeding,
        MAX(CASE WHEN testName = 'Visual Inspection' THEN COALESCE(singleVal, multiVal) END) AS cervical_visual_inspection,
        MAX(CASE WHEN testName = 'Findings on Visual Inspection' THEN multiVal END) AS cervical_findings_on_visual_inspection,
        MAX(CASE WHEN testName = 'Referral' THEN multiVal END) AS cervical_referral,
        MAX(CASE WHEN testName = 'Referred for' THEN multiVal END) AS cervical_referred_for,
		MAX(CASE WHEN testName = 'HR-HPV DNA' THEN COALESCE(singleVal, multiVal) END) AS cervical_HR_HPV_DNA,
        MAX(CASE WHEN testName = 'HR-HPV DNA Sample Collection Date' THEN COALESCE(singleVal, multiVal) END) AS cervical_H_sample_collection_date,
        MAX(CASE WHEN testName = 'HR-HPV Sample Type' THEN COALESCE(singleVal, multiVal) END) AS cervical_H_sample_type,
        MAX(CASE WHEN testName = 'HR-HPV DNA Report Date' THEN COALESCE(singleVal, multiVal) END) AS cervical_H_sample_report_date,
        MAX(CASE WHEN testName = 'HR-HPV DNA Report' THEN COALESCE(singleVal, multiVal) END) AS cervical_H_report,
        MAX(CASE WHEN testName = 'Genotype' THEN COALESCE(singleVal, multiVal) END) AS Genotype,
		MAX(CASE WHEN testName = 'Cytology' THEN COALESCE(singleVal, multiVal) END) AS cervical_Cytology,
        MAX(CASE WHEN testName = 'Cytology Sample Collection Date' THEN COALESCE(singleVal, multiVal) END) AS cervical_C_sample_collection_date,
        MAX(CASE WHEN testName = 'Cytology Report Date' THEN COALESCE(singleVal, multiVal) END) AS cervical_C_report_date,
        MAX(CASE WHEN testName = 'Cytology Report' THEN COALESCE(singleVal, multiVal) END) AS cervical_C_report,   
        MAX(CASE WHEN testName = 'Visual Test' THEN COALESCE(singleVal, multiVal) END) AS cervical_Visual_Test,
        MAX(CASE WHEN testName = 'Visual Test Report Date' THEN COALESCE(singleVal, multiVal) END) AS cervical_V_report_date,
        MAX(CASE WHEN testName = 'Visual Test Report' THEN COALESCE(singleVal, multiVal) END) AS cervical_V_report          
        
    FROM cervical_grouped
    GROUP BY candidateTestId, candidateId, createdDate,revisitId
),

-- Oral Test
oral_all AS (
    SELECT 
        ct.id AS candidateTestId,
        ct.candidateId,
        ct.createdDate,ct.lastModifiedDate,
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
        AND FIND_IN_SET(ct.candidateId , candidate_ids)

      AND ct.diseaseTestMasterId in (24,30)
      AND ct.testResult IS NOT NULL
      
),
oral_grouped AS (
    SELECT
        candidateTestId,
        candidateId,
        createdDate,
        testName,lastModifiedDate,
        revisitId,
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
        createdBy, lastModifiedBy,completed,revisitId,lastModifiedDate,

        -- Core
        MAX(CASE WHEN testName = 'Oral Examination'                 THEN COALESCE(singleVal, multiVal) END) AS oral_exam,
        MAX(CASE WHEN testName = 'Symptoms'                         THEN COALESCE(singleVal, multiVal) END) AS oral_symptoms,
        MAX(CASE WHEN testName = 'Select Symptoms'                  THEN multiVal END)                       AS select_symptoms,
        MAX(CASE WHEN testName = 'Dental Hygiene'                   THEN COALESCE(singleVal, multiVal) END) AS dental_hygiene,

        -- Clinical findings + subtrees
        MAX(CASE WHEN testName = 'Clinical Findings'                THEN COALESCE(singleVal, multiVal) END) AS clinical_findings,
        MAX(CASE WHEN testName = 'Select Subtype'                   THEN multiVal END)                       AS select_subtype,

        -- Leukoplakia branch
        MAX(CASE WHEN testName = 'Oral Malignant: Leukoplakia'      THEN COALESCE(singleVal, multiVal) END) AS leukoplakia,
        MAX(CASE WHEN testName = 'Leukoplakia type'                 THEN COALESCE(singleVal, multiVal) END) AS leukoplakia_type,
        MAX(CASE WHEN testName = 'Lesion Site'                      THEN COALESCE(singleVal, multiVal) END) AS lesion_site,
        MAX(CASE WHEN testName = 'Lesion Size'                      THEN COALESCE(singleVal, multiVal) END) AS lesion_size,
        MAX(CASE WHEN testName = 'Lesion Subtype'                   THEN COALESCE(singleVal, multiVal) END) AS lesion_subtype,
        MAX(CASE WHEN testName = 'Multiple Lesion Site'             THEN COALESCE(singleVal, multiVal) END) AS multiple_lesion_site,
        MAX(CASE WHEN testName = 'Multiple Lesion Size'             THEN COALESCE(singleVal, multiVal) END) AS multiple_lesion_size,
        MAX(CASE WHEN testName = 'Multiple Lesion Subtype'          THEN COALESCE(singleVal, multiVal) END) AS multiple_lesion_subtype,

        -- Erythroplakia
        MAX(CASE WHEN testName = 'Oral Malignant: Erthyroplakia'    THEN COALESCE(singleVal, multiVal) END) AS erythroplakia,
        MAX(CASE WHEN testName = 'Erthyroplakia Site'               THEN COALESCE(singleVal, multiVal) END) AS erythroplakia_site,

        -- OSMF
        MAX(CASE WHEN testName = 'Oral Malignant: Oral Submucous Fibrosis' THEN COALESCE(singleVal, multiVal) END) AS osmf,
        MAX(CASE WHEN testName = 'Oral Submucous Fibrosis Type'     THEN COALESCE(singleVal, multiVal) END) AS osmf_type,

        -- Non-healing ulcer
        MAX(CASE WHEN testName = 'Oral Malignant: Non-Healing Ulcer' THEN COALESCE(singleVal, multiVal) END) AS non_healing_ulcer,
        MAX(CASE WHEN testName = 'Non-Healing Ulcer Site'           THEN COALESCE(singleVal, multiVal) END) AS non_healing_ulcer_site,
        MAX(CASE WHEN testName = 'Non-Healing Ulcer Size'           THEN COALESCE(singleVal, multiVal) END) AS non_healing_ulcer_size,

        -- Smoker’s palate
        MAX(CASE WHEN testName = 'Oral Malignant: Smoker’s Palate'  THEN COALESCE(singleVal, multiVal) END) AS smokers_palate,

        -- Lichen planus
        MAX(CASE WHEN testName = 'Oral Malignant: Lichen Planus'    THEN COALESCE(singleVal, multiVal) END) AS lichen_planus,
        MAX(CASE WHEN testName = 'Lichen Planus Site'               THEN COALESCE(singleVal, multiVal) END) AS lichen_planus_site,

        -- Oral lichenoid reaction
        MAX(CASE WHEN testName = 'Oral Malignant: Oral Lichenoid Reaction' THEN COALESCE(singleVal, multiVal) END) AS oral_lichenoid_reaction,
        MAX(CASE WHEN testName = 'Oral Lichenoid Reaction Site'     THEN COALESCE(singleVal, multiVal) END) AS oral_lichenoid_reaction_site,

        -- Other lesions (flag + free text)
        MAX(CASE WHEN testName = 'Oral Malignant: Other Lesions'    THEN COALESCE(singleVal, multiVal) END) AS other_lesions_flag,
        MAX(CASE WHEN testName = 'Other Lesions'                    THEN COALESCE(singleVal, multiVal) END) AS other_lesions_text,

        -- Invasive cancer details
        MAX(CASE WHEN testName = 'Lesion S/O Invasive Cancer: Site'       THEN COALESCE(singleVal, multiVal) END) AS lesion_invasive_site,
        MAX(CASE WHEN testName = 'Lesion S/O Invasive Cancer: Size'       THEN COALESCE(singleVal, multiVal) END) AS lesion_invasive_size,
        MAX(CASE WHEN testName = 'Lesion S/O Invasive Cancer: Appearance' THEN COALESCE(singleVal, multiVal) END) AS lesion_invasive_appearance,

        -- Referral
        MAX(CASE WHEN testName = 'Referral'                         THEN COALESCE(singleVal, multiVal) END) AS referral,
        MAX(CASE WHEN testName = 'Referred for'                     THEN multiVal END)                       AS referred_for
    FROM oral_grouped
    GROUP BY candidateTestId, candidateId, createdDate,revisitId
),
symptom_all AS (
    SELECT 
        ct.id AS candidateTestId,
        ct.candidateId,
        ct.createdDate,
        jt.testName,
        jt.singleVal,ct.lastModifiedDate, 
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
          AND FIND_IN_SET(ct.candidateId , candidate_ids)
      AND ct.diseaseTestMasterId in (33,34)
      AND ct.testResult IS NOT NULL
),
symptom_grouped AS (
    SELECT
        candidateTestId, candidateId,lastModifiedDate, createdDate, testName,revisitId,
        MAX(singleVal) AS singleVal,
        GROUP_CONCAT(DISTINCT multiVal ORDER BY multiVal SEPARATOR ', ') AS multiVal,
        createdBy, lastModifiedBy,completed
    FROM symptom_all
    GROUP BY candidateTestId, candidateId, createdDate, testName,revisitId
),
symptom_pivot AS (
    SELECT
        candidateTestId, candidateId, createdDate, lastModifiedDate,createdBy, lastModifiedBy,completed,revisitId,
        MAX(CASE WHEN testName = 'Symptoms Based Referral' THEN COALESCE(singleVal, multiVal) END) AS symp_based_referral,
        MAX(CASE WHEN testName = 'Symptoms' THEN multiVal END) AS symp_symptoms,
        MAX(CASE WHEN testName = 'Duration of symptoms' THEN COALESCE(singleVal, multiVal) END) AS symp_duration,
        MAX(CASE WHEN testName = 'Known cancer patient' THEN COALESCE(singleVal, multiVal) END) AS symp_known_cancer_patient,
        MAX(CASE WHEN testName = 'Cancer Site' THEN COALESCE(singleVal, multiVal) END) AS symp_cancer_site,
        MAX(CASE WHEN testName = 'Details of treatment' THEN COALESCE(singleVal, multiVal) END) AS symp_treatment,
        MAX(CASE WHEN testName = 'Referral' THEN COALESCE(singleVal, multiVal) END) AS symp_referral,
        MAX(CASE WHEN testName = 'Investigations' THEN COALESCE(singleVal, multiVal) END) AS symp_investigations,
        MAX(CASE WHEN testName = 'Reports' THEN COALESCE(singleVal, multiVal) END) AS symp_reports,
        MAX(CASE WHEN testName = 'Report findings' THEN COALESCE(singleVal, multiVal) END) AS symp_report_findings,
        MAX(CASE WHEN testName = 'Final Diagnosis' THEN COALESCE(singleVal, multiVal) END) AS symp_final_diagnosis
    FROM symptom_grouped
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
)


-- Final Output
SELECT 
cm.campIdPrefix,
cm.name,
ca.gender,
ca.id as id,
rm.revisitId as rid,
YEAR(CURDATE()) - YEAR(ca.dob) AS age,
    ca.registraionId AS registraionId,
    ca.name AS candidateName,
    DATE_FORMAT(CONVERT_TZ(bp.createdDate, '+00:00', '+05:30'), '%d-%m-%Y %H:%i:%s') AS breastCreatedDate,
         DATE_FORMAT(CONVERT_TZ(bp.lastModifiedDate, '+00:00', '+05:30'), '%d-%m-%Y %H:%i:%s') AS breastModifiedDate,

            bp.createdBy as breastcBy,
		bp.lastModifiedBy as breastlBy,
    bp.breast_exam AS breastExam,
    bp.completed as breastCompleted,
    bp.breast_symptoms AS breastSymptoms,
    bp.right_breast_on_palpation AS rightBreastOnPalpation,
    bp.left_breast_on_palpation AS leftBreastOnPalpation,
    bp.breast_nipple_discharge AS breastNippleDischarge,
    bp.breast_referral AS breastReferral,
    bp.breast_referred_for AS breastReferredFor,
        DATE_FORMAT(CONVERT_TZ(cp.createdDate, '+00:00', '+05:30'), '%d-%m-%Y %H:%i:%s') AS cervicalCreatedDate,
                               DATE_FORMAT(CONVERT_TZ(cp.lastModifiedDate, '+00:00', '+05:30'), '%d-%m-%Y %H:%i:%s') AS cervicalModifiedDate,

               cp.createdBy as cervicalcBy,
		cp.lastModifiedBy as cervicallBy,
    cp.cervical_screening AS cervicalScreening,
    cp.completed as cervicalCompleted,
    cp.cervical_reason AS cervicalReason,
    cp.cervical_symptoms AS cervicalSymptoms,
    cp.cervical_abnormal_bleeding AS cervicalAbnormalBleeding,
    cp.cervical_visual_inspection AS cervicalVisualInspection,
    cp.cervical_findings_on_visual_inspection AS cervicalFindingsOnVisualInspection,
    cp.cervical_referral AS cervicalReferral,
    cp.cervical_referred_for AS cervicalReferredFor,
    cp.cervical_HR_HPV_DNA as cervicalHRHPVDNA,
    cp.cervical_H_sample_collection_date as cervicalHSampleCollectionDate,
    cp.cervical_H_sample_type as cervicalHSampleType,
    cp.cervical_H_sample_report_date as cervicalHSampleReportDate,
    cp.cervical_H_report as cervicalHReport,
    cp.Genotype as genotype,
    cp.cervical_Cytology as cervicalCytology,
    cp.cervical_C_sample_collection_date as cervicalCSampleCollectionDate,
    cp.cervical_C_report_date as cervicalCReportDate,
    cp.cervical_C_report as cervicalCReport,
    cp.cervical_Visual_Test  as cervicalVisualTest,
    cp.cervical_V_report_date as cervicalVReportDate,
    cp.cervical_V_report as cervicalVReport,
    
DATE_FORMAT(CONVERT_TZ(op.createdDate, '+00:00', '+05:30'), '%d-%m-%Y %H:%i:%s') AS oralCreatedDate,
DATE_FORMAT(CONVERT_TZ(op.lastModifiedDate, '+00:00', '+05:30'), '%d-%m-%Y %H:%i:%s') AS oralModifiedDate

, op.createdBy    AS oralcBy
, op.lastModifiedBy AS orallBy
,op.completed as oralCompleted
, op.oral_exam           AS oralExam
, op.oral_symptoms       AS oralSymptoms
, op.select_symptoms     AS oralSelectSymptoms
, op.dental_hygiene      AS dentalHygiene
, op.clinical_findings   AS clinicalFindings
, op.select_subtype      AS oralSelectSubtype
, op.leukoplakia         AS oralMalignantLeukoplakia
, op.leukoplakia_type    AS leukoplakiaType
, op.lesion_site         AS lesionSite
, op.lesion_size         AS lesionSize
, op.lesion_subtype      AS lesionSubtype
, op.multiple_lesion_site      AS multipleLesionSite
, op.multiple_lesion_size      AS multipleLesionSize
, op.multiple_lesion_subtype   AS multipleLesionSubtype
, op.erythroplakia       AS oralMalignantErythroplakia
, op.erythroplakia_site  AS erythroplakiaSite
, op.osmf                AS oralSubmucousFibrosis
, op.osmf_type           AS osmfType
, op.non_healing_ulcer        AS nonHealingUlcer
, op.non_healing_ulcer_site   AS nonHealingUlcerSite
, op.non_healing_ulcer_size   AS nonHealingUlcerSize
, op.smokers_palate      AS smokersPalate
, op.lichen_planus       AS lichenPlanus
, op.lichen_planus_site  AS lichenPlanusSite
, op.oral_lichenoid_reaction      AS oralLichenoidReaction
, op.oral_lichenoid_reaction_site AS oralLichenoidReactionSite
, op.other_lesions_flag  AS otherLesionsFlag
, op.other_lesions_text  AS otherLesionsText
, op.lesion_invasive_site       AS lesionInvasiveSite
, op.lesion_invasive_size       AS lesionInvasiveSize
, op.lesion_invasive_appearance AS lesionInvasiveAppearance
, op.referral            AS oralReferral
, op.referred_for        AS oralReferredFor,

    -- ✅ Symptoms Based Cancer
    DATE_FORMAT(CONVERT_TZ(sp.createdDate, '+00:00', '+05:30'), '%d-%m-%Y %H:%i:%s') AS sympCreatedDate,
            DATE_FORMAT(CONVERT_TZ(sp.lastModifiedDate, '+00:00', '+05:30'), '%d-%m-%Y %H:%i:%s') AS sympModifiedDate,

    sp.createdBy AS sympcBy, sp.lastModifiedBy AS symplBy,
    sp.completed as symCompleted,
    sp.symp_based_referral as sympBasedReferral, sp.symp_symptoms as sympSymptoms, 
    sp.symp_duration as sympDuration,
    sp.symp_known_cancer_patient as sympKnownCancerPatient,
    sp.symp_cancer_site as sympCancerSite, 
    sp.symp_treatment as sympTreatment,
    sp.symp_referral as sympReferral, 
    sp.symp_investigations as sympInvestigations, 
    sp.symp_reports as sympReports,
    sp.symp_report_findings as sympReportFindings, 
    sp.symp_final_diagnosis as sympFinalDiagnosis
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
WHERE FIND_IN_SET(ca.campId , camp_id)
  AND FIND_IN_SET(ca.id , candidate_ids)
ORDER BY  bp.createdDate, cp.createdDate, op.createdDate
;

END