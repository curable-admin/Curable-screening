CREATE  PROCEDURE `PatientRegReport`(
    IN startDate VARCHAR(100),
    IN endDate VARCHAR(100),
    IN campIds VARCHAR(5000),
    IN hospitalId VARCHAR(1000)
)
BEGIN
    DECLARE campIdsNoSpaces VARCHAR(5000);

    SET campIdsNoSpaces = NULLIF(TRIM(REPLACE(campIds, ' ', '')), '');

    WITH em AS (
        SELECT eligibilityMetrics, candidateId,
               ROW_NUMBER() OVER (PARTITION BY candidateId ORDER BY createdDate DESC) rn
        FROM candidatehistory
        WHERE eligibilityMetrics IS NOT NULL
          AND isRecordDeleted = 0
    ),
    fm AS (
        SELECT familyMedicalMetrics, candidateId,
               ROW_NUMBER() OVER (PARTITION BY candidateId ORDER BY createdDate DESC) rn
        FROM candidatehistory
        WHERE familyMedicalMetrics IS NOT NULL
          AND isRecordDeleted = 0
    ),
    eligibility_params AS (
        SELECT em.candidateId, jt.testName, jt.selectedValue
        FROM em
        JOIN JSON_TABLE(
            em.eligibilityMetrics,
            '$.params[*]'
            COLUMNS (
                testName VARCHAR(100) PATH '$.testName',
                selectedValue VARCHAR(100) PATH '$.selectedValues[0]'
            )
        ) jt ON TRUE
        WHERE em.rn = 1
    ),
    eligibility_pivot AS (
        SELECT candidateId,
               MAX(CASE WHEN testName = 'Marital Status' THEN selectedValue END) AS eligibility_MaritalStatus,
               MAX(CASE WHEN testName = 'Hysterectomy Done' THEN selectedValue END) AS eligibility_HysterectomyDone
        FROM eligibility_params
        GROUP BY candidateId
    ),
    familyMedical_params_flat AS (
        SELECT fm.candidateId, jt_outer.idx AS rawIndex,
               jt_inner.testName, jt_inner.selectedValue
        FROM fm
        JOIN JSON_TABLE(
            fm.familyMedicalMetrics,
            '$[*]'
            COLUMNS (
                idx FOR ORDINALITY,
                params JSON PATH '$.params'
            )
        ) jt_outer ON TRUE
        JOIN JSON_TABLE(
            jt_outer.params,
            '$[*]'
            COLUMNS (
                testName VARCHAR(100) PATH '$.testName',
                selectedValue VARCHAR(100) PATH '$.selectedValues[0]'
            )
        ) jt_inner ON TRUE
        WHERE fm.rn = 1
    ),
    familyMedical_pivot_raw AS (
        SELECT candidateId, rawIndex,
               MAX(CASE WHEN testName = 'Relation ' THEN selectedValue END) AS familyMedical_Relation,
               MAX(CASE WHEN testName = 'Cancer Site' THEN selectedValue END) AS familyMedical_CancerSite,
               MAX(CASE WHEN testName = 'Age At Diagnosis' THEN selectedValue END) AS familyMedical_AgeAtDiagnosis,
               MAX(CASE WHEN testName = 'Outcome' THEN selectedValue END) AS familyMedical_Outcome
        FROM familyMedical_params_flat
        GROUP BY candidateId, rawIndex
    ),
    habit_rows_raw AS (
        SELECT
            ch.candidateId,
            ch.duration,
            ch.frequency,
            ch.habits,
            ch.howLong,
            ch.quit,
            ch.type,
            ROW_NUMBER() OVER (PARTITION BY ch.candidateId ORDER BY ch.id) AS rawIndex
        FROM candidatehabit ch
        INNER JOIN candidate ca2 ON ca2.id = ch.candidateId
        WHERE ch.isRecordDeleted = 0
          AND (campIdsNoSpaces IS NULL
               OR FIND_IN_SET(CAST(ca2.campId AS CHAR), campIdsNoSpaces) > 0)
          AND ca2.createdDate BETWEEN STR_TO_DATE(startDate, '%Y-%m-%d')
                                  AND STR_TO_DATE(endDate, '%Y-%m-%d')
                                      + INTERVAL 1 DAY - INTERVAL 1 SECOND
          AND ca2.isRecordDeleted = 0
          AND (ca2.reason = 'CurrentlyPregant' OR ca2.reason IS NULL)
    ),
    family_rows_raw AS (
        SELECT
            sm.parentCandidateId AS candidateId,
            sm.name,
            sm.relation,
            sm.gender,
            sm.age,
            sm.tobaccoUser,
            sm.maritalStatus,
            sm.registraionId,
            ROW_NUMBER() OVER (
                PARTITION BY sm.parentCandidateId
                ORDER BY sm.id
            ) AS rawIndex
        FROM candidate sm
        WHERE sm.parentCandidateId IS NOT NULL
    ),
    all_indexes AS (
        SELECT candidateId, rawIndex FROM habit_rows_raw
        UNION
        SELECT candidateId, rawIndex FROM familyMedical_pivot_raw
        UNION
        SELECT candidateId, rawIndex FROM family_rows_raw
    ),
    indexed_groups AS (
        SELECT candidateId, rawIndex,
               ROW_NUMBER() OVER (
                   PARTITION BY candidateId
                   ORDER BY rawIndex
               ) AS groupIndex
        FROM all_indexes
    ),
    habit_rows AS (
        SELECT hr.candidateId, ig.groupIndex,
               hr.duration, hr.frequency, hr.habits,
               hr.howLong, hr.quit, hr.type
        FROM habit_rows_raw hr
        JOIN indexed_groups ig
          ON hr.candidateId = ig.candidateId
         AND hr.rawIndex = ig.rawIndex
    ),
    familyMedical_pivot AS (
        SELECT fmpr.candidateId, ig.groupIndex,
               fmpr.familyMedical_Relation,
               fmpr.familyMedical_CancerSite,
               fmpr.familyMedical_AgeAtDiagnosis,
               fmpr.familyMedical_Outcome
        FROM familyMedical_pivot_raw fmpr
        JOIN indexed_groups ig
          ON fmpr.candidateId = ig.candidateId
         AND fmpr.rawIndex = ig.rawIndex
    ),
    family_members AS (
        SELECT fr.candidateId, ig.groupIndex,
               fr.name,
               fr.relation,
               fr.gender,
               fr.age,
               fr.tobaccoUser,
               fr.maritalStatus,
               fr.registraionId
        FROM family_rows_raw fr
        JOIN indexed_groups ig
          ON fr.candidateId = ig.candidateId
         AND fr.rawIndex = ig.rawIndex
    ),
    merged_family AS (
        SELECT
            ig.candidateId,
            ig.groupIndex,
            hr.duration,
            hr.frequency,
            hr.habits,
            hr.howLong,
            hr.quit,
            hr.type,
            fm.familyMedical_Relation,
            fm.familyMedical_CancerSite,
            fm.familyMedical_AgeAtDiagnosis,
            fm.familyMedical_Outcome
        FROM indexed_groups ig
        LEFT JOIN habit_rows hr
          ON ig.candidateId = hr.candidateId
         AND ig.groupIndex = hr.groupIndex
        LEFT JOIN familyMedical_pivot fm
          ON ig.candidateId = fm.candidateId
         AND ig.groupIndex = fm.groupIndex
    ),
    final_result AS (
        SELECT
            ca.campIdPrefix AS OutreachClinicID,
            ca.name AS OutreachClinicName,
            DATE_FORMAT(CONVERT_TZ(a.createdDate, '+00:00', '+05:30'),
                        '%d-%m-%Y %H:%i:%s') AS createdDate,
            a.createdBy,
            a.registraionId,
            a.name,
            a.mobileNo,
            a.gender,
            YEAR(CURDATE()) - YEAR(a.dob) AS age,
            a.address,
            a.streetId,
            a.fatherName,
            a.spouseName,
            a.alternateMobileNo,
            a.monthlyIncome,
            a.houseType,
            a.education,
            a.occupation,
            a.aadhar,
            a.voterId,
            a.rationCard,
            c.medicalhistory,
            c.bloodPressure,
            c.pulseRate,
            c.weight,
            c.historyOfSurgery,
            c.height,
            c.spo2,
            c.allergy,
            c.otherComplaints,
            c.ageAtMenarche,
            c.ageAtFirstChild,
            c.ageAtLastChild,
            c.ageAtMarriage,
            c.lastMentrution,
            c.abnormalBleedingVaginum,
            c.totalPregnancies,
            c.currentlyPregant,
            c.methodOfContraceptionUsed,
            c.undergoneCervicalBreastScrening,
            c.methodOfContraception AS breastFed,
            a.socialHabits,
            mf.duration,
            mf.frequency,
            mf.habits,
            mf.howLong,
            mf.quit,
            mf.type,
            ep.eligibility_MaritalStatus,
            ep.eligibility_HysterectomyDone,
            mf.familyMedical_Relation,
            mf.familyMedical_CancerSite,
            mf.familyMedical_AgeAtDiagnosis,
            mf.familyMedical_Outcome,
            mf.groupIndex,
            sm.name AS family_Name,
            sm.relation AS family_Relation,
            sm.gender AS family_Gender,
            sm.age AS family_Age,
            sm.tobaccoUser AS family_TobaccoOrAlcoholHabits,
            sm.maritalStatus AS family_MaritalStatus,
            sm.registraionId AS family_registraionId,
            ROW_NUMBER() OVER (
                PARTITION BY a.id
                ORDER BY mf.groupIndex
            ) rn
        FROM candidate a
        LEFT JOIN camp ca ON ca.id = a.campId
        LEFT JOIN candidatemedicaldetails c ON c.candidateId = a.id
        LEFT JOIN eligibility_pivot ep ON ep.candidateId = a.id
        LEFT JOIN merged_family mf ON mf.candidateId = a.id
        LEFT JOIN family_members sm
          ON sm.candidateId = a.id
         AND sm.groupIndex = mf.groupIndex
        WHERE (campIdsNoSpaces IS NULL
               OR FIND_IN_SET(CAST(a.campId AS CHAR), campIdsNoSpaces) > 0)
          AND a.createdDate BETWEEN STR_TO_DATE(startDate, '%Y-%m-%d')
                                AND STR_TO_DATE(endDate, '%Y-%m-%d')
                                    + INTERVAL 1 DAY - INTERVAL 1 SECOND
          AND a.isRecordDeleted = 0
          AND (a.reason = 'CurrentlyPregant' OR a.reason IS NULL)
    )
    SELECT
        OutreachClinicID, OutreachClinicName, createdDate, createdBy,
        registraionId, name, mobileNo, gender, age, address, streetId,
        fatherName, spouseName, alternateMobileNo, monthlyIncome, houseType,
        education, occupation, aadhar, voterId, rationCard, medicalhistory,
        bloodPressure, pulseRate, weight, historyOfSurgery, height, spo2,
        allergy, otherComplaints, ageAtMenarche, ageAtFirstChild, ageAtLastChild,
        ageAtMarriage, lastMentrution, abnormalBleedingVaginum, totalPregnancies,
        currentlyPregant, methodOfContraceptionUsed,
        undergoneCervicalBreastScrening, breastFed, socialHabits,
        duration, frequency, habits, howLong, quit, type,
        CASE WHEN rn = 1 THEN eligibility_MaritalStatus END AS eligibility_MaritalStatus,
        CASE WHEN rn = 1 THEN eligibility_HysterectomyDone END AS eligibility_HysterectomyDone,
        family_Name, family_Relation, family_Gender, family_Age,
        family_TobaccoOrAlcoholHabits, family_MaritalStatus,
        familyMedical_Relation, familyMedical_CancerSite,
        familyMedical_AgeAtDiagnosis, familyMedical_Outcome,
        family_registraionId, groupIndex
    FROM final_result
    ORDER BY createdDate DESC, groupIndex;
END