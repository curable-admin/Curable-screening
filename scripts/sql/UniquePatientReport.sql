CREATE  PROCEDURE `UniquePatientReport`(in camp_ids varchar(10000), IN start_date VARCHAR(100),
    IN end_date VARCHAR(100))
BEGIN
SELECT 
            ca.campIdPrefix AS OutreachClinicID,
            ca.name AS OutreachClinicName,
            DATE_FORMAT(CONVERT_TZ(a.createdDate, '+00:00', '+05:30'), '%d-%m-%Y %H:%i:%s') AS createdDate,
            a.createdBy,
            a.registraionId,
            a.name,
            a.mobileNo,
            a.gender,
            a.age,
            a.address,
    LPAD(CAST(a.streetId AS CHAR), 3, '0') AS streetId,
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
            a.socialHabits,b.eligibilityMetrics
        FROM candidate a
        LEFT JOIN camp ca ON ca.id = a.campId
        LEFT JOIN candidatemedicaldetails c ON c.candidateId = a.id
        LEFT JOIN (
    SELECT eligibilityMetrics,candidateId
    FROM (
        SELECT *,
               ROW_NUMBER() OVER (PARTITION BY candidateId ORDER BY createdDate DESC) AS rn
        FROM candidatehistory
        WHERE eligibilityMetrics IS NOT NULL
    ) t
    WHERE rn = 1
) b ON b.candidateId = a.id 
WHERE a.enrolled = 1 and FIND_IN_SET(campId, camp_ids)
and  a.createdDate BETWEEN STR_TO_DATE(start_date, '%Y-%m-%d')
                        AND STR_TO_DATE(end_date, '%Y-%m-%d') + INTERVAL 1 DAY - INTERVAL 1 SECOND order by createdDate desc;
	
END