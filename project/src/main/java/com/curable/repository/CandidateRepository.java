package com.curable.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.curable.domain.Candidate;
import com.curable.domain.enums.Gender;
import com.curable.service.dto.CandidateCustomDTO;
import com.curable.service.dto.CandidateDTO;
import com.curable.service.dto.ClinicalReportDTO;
import com.curable.service.dto.PatientRegReportDTO;
import com.curable.service.dto.SavedPatientDTO;
import com.curable.service.dto.ScreeningReportDTO;
import com.curable.service.dto.custom.VSClinicalReportDTO;
import com.curable.service.dto.custom.VSScreeningReportDTO;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, Long>, QuerydslPredicateExecutor<Candidate> {

	List<Candidate> findByCamp_IdAndIsRecordDeletedFalse(Long campId);

	@Query("select new com.curable.service.dto.CandidateDTO(a.id,a.name,a.gender,a.age,a.mobileNo,a.hospital.id,a.registraionId) from Candidate a where a.hospital.id =:hospitalId and a.consentDate is null and  a.isRecordDeleted=false and (a.name like %:search% or a.registraionId like %:search%  or a.mobileNo like %:search% ) order by a.createdDate desc")
	List<CandidateDTO> getScreeningData(Long hospitalId, String search);

	@Modifying(flushAutomatically = true)
	@Query("update Candidate set fatherName=:fatherName , spouseName=:spouseName,alternateMobileNo=:alternateMobileNo,monthlyIncome=:monthlyIncome,houseType=:houseType,education=:education,occupation=:occupation,voterId=:voterId,rationCard=:rationCard,aadhar=:aadhar,tobaccoUser=:tobaccoUser,socialHabits=:socialHabits "
			+ "where id=:id")
	int updateCandidateById(Long id, String fatherName, String spouseName, String alternateMobileNo,
							Integer monthlyIncome, String houseType, String education, String occupation, String voterId,
							String rationCard, String aadhar, Boolean tobaccoUser, Boolean socialHabits);

	@Query("select DISTINCT new com.curable.service.dto.CandidateDTO( a.id,a.name,a.gender,a.age,a.mobileNo,a.hospital.id, a.registraionId) from Candidate a  left join CandidateTest b on b.candidate.id=a.id "
			+ "where a.hospital.id =:hospitalId and b.referral=true and a.optionalId <> 2 and  a.isRecordDeleted=false and (a.name like %:search% or a.registraionId like %:search% or a.mobileNo like %:search% ) order by a.createdDate desc")
	List<CandidateDTO> getClinicalData(Long hospitalId, String search);

	@Modifying(flushAutomatically = true)
	@Query("update Candidate set optionalId=:option,consentDate=now() where id=:id")
	int updateCandidateById(Long id, Long option);

	@Modifying(flushAutomatically = true)
	@Query("update Candidate set optionalId=:option,revisitStatus=0,consentDate=now() where id=:id")
	int updateCandidate(Long id, Long option);
	
	@Modifying(flushAutomatically = true)
	@Query("update Candidate set optionalId=:option where id=:id")
	int updateCandidateOld(Long id, Long option);
	void deleteByParentCandidateId(Long parentCandidateId);

	@Query("select new  com.curable.service.dto.CandidateDTO(fatherName,spouseName,alternateMobileNo,monthlyIncome,houseType,education,occupation,aadhar,"
			+ "voterId,rationCard,tobaccoUser,socialHabits) from Candidate where id=:candidateId ")
	CandidateDTO getCandidate(Long candidateId);

	@Query("select new com.curable.service.dto.CandidateDTO(a.id,a.name,a.gender,a.dob,a.mobileNo,a.hospital.id,a.registraionId,a.spouseName,a.fatherName,a.consentDate,CASE WHEN a.optionalId = 2 AND a.revisitStatus = 0 THEN 1 WHEN a.revisitStatus = 1 THEN 2 ELSE 0 END,CASE WHEN (a.optionalId = 2 or a.revisitStatus=1) THEN a.lastModifiedDate ELSE null END,a.enrolled ,a.createdDate) from Candidate a where a.hospital.id =:hospitalId and a.surveyStatus is null and (a.name like %:search% or a.registraionId like %:search%  or a.mobileNo like %:search% or a.address like %:search%) order by a.createdDate desc")
	List<CandidateDTO> getCandidateData(Long hospitalId, String search);

	@Modifying(flushAutomatically = true)
	@Query("update Candidate set consentDate=now(),reason=:reason where id=:id")
	int markAsNoEvaluationNeeded(Long id, String reason);

	@Modifying(flushAutomatically = true)
	@Query("update Candidate set isRecordDeleted=:isDeleted,name=:name,mobileNo=:mobileNo,gender=:gender,age=:age,address=:address,streetId=:streetId,dob=:dob,enrolled=:isEntrolled where id=:id")
	int markAsActive(Long id, String name, String mobileNo, Gender gender, Integer age, String address,
					 Integer streetId, LocalDate dob, boolean isDeleted, boolean isEntrolled);

	@Query("select new com.curable.service.dto.CandidateDTO(a.id,a.name,a.gender,a.dob,a.mobileNo,a.hospital.id,a.registraionId,a.spouseName,a.fatherName,a.consentDate,CASE WHEN a.optionalId = 2 AND a.revisitStatus = 0 THEN 1 WHEN a.revisitStatus = 1 THEN 2 ELSE 0 END,CASE WHEN (a.optionalId = 2 or a.revisitStatus=1) THEN a.lastModifiedDate ELSE null END,a.enrolled,a.createdDate) from Candidate a  left join CampStaff b on b.camp.id=a.camp.id"
			+ " where b.hospitalEmployee.id =:userId and a.hospital.id=:hospitalId and a.surveyStatus is null and (a.name like %:search% or a.registraionId like %:search%  or a.mobileNo like %:search% or a.address like %:search%) order by a.createdDate desc")
	List<CandidateDTO> getCandidateForOtherRole(Long userId, String search, Long hospitalId);

	/*
	 * @Query("select new com.curable.service.dto.CandidateDTO(a.id,a.name,a.gender,a.age,a.mobileNo,a.hospital.id,a.registraionId,a.spouseName,a.fatherName) from Camp b  left join Candidate a on a.camp.id=b.id"
	 * +
	 * " where b.createdBy =:LoggedInUser and a.hospital.id=:hospitalId and a.optionalId is null and (a.name like %:search% or a.registraionId like %:search%  or a.mobileNo like %:search% or a.address like %:search%) order by a.createdDate desc"
	 * ) List<CandidateDTO> getCandidateForCampCoordinator(String LoggedInUser,
	 * String search, Long hospitalId);
	 */

	@Query(value = "call getScreeningDataProcedure(:hospitalId,:search,:roleId,:userId,:loginId)", nativeQuery = true)
	List<CandidateCustomDTO> getScreeningDataProcedure(Long hospitalId, String search, Long roleId, Long userId,
													   String loginId);

	@Query(value = "call getClinicalDataProcedure(:hospitalId,:search,:roleId,:userId,:loginId)", nativeQuery = true)
	List<CandidateCustomDTO> getClinicalDataProcedure(Long hospitalId, String search, Long roleId, Long userId,
													  String loginId);

	@Query(value = "call PatientRegReport(:startDate,:endDate,:campIds,:hospitalId)", nativeQuery = true)
	List<PatientRegReportDTO> report(String startDate, String endDate, String campIds, Long hospitalId);

	@Query(value = "call screeningReport(:campIds,:startDate,:endDate)", nativeQuery = true)
	List<ScreeningReportDTO> screeningReport(String campIds, String startDate, String endDate);

	@Query(value = "CALL savedPatient(:campIds, :startDate, :endDate)", nativeQuery = true)
	List<SavedPatientDTO> findSavedPatients(@Param("campIds") String campIds, @Param("startDate") String startDate,
											@Param("endDate") String endDate);

	@Query(value = "call clinicalReport(:campIds,:startDate,:endDate)", nativeQuery = true)
	List<ClinicalReportDTO> clinicalReport(String campIds, String startDate, String endDate);

	@Query("select new  com.curable.service.dto.CandidateDTO(id,name,gender,age,maritalStatus,tobaccoHabbits,parentCandidateId,relation) from Candidate where parentCandidateId=:candidateId and (reason is null or reason <> 'Family Personal Details Removed')")
	List<CandidateDTO> getChildCandidate(Long candidateId);

	List<Candidate> findByParentCandidateId(Long parentCandidateId);

	@Query(value = "call UniquePatientReport(:campIds,:startDate,:endDate)", nativeQuery = true)
	List<SavedPatientDTO> uniquePatientReport(String campIds, String startDate, String endDate);

	@Modifying(flushAutomatically = true)
	@Query("update Candidate set isRecordDeleted=:isDeleted,name=:name,mobileNo=:mobileNo,gender=:gender,age=:age,address=:address,streetId=:streetId,dob=:dob,enrolled=:isEntrolled,reason=:reason where id=:id")
	int markAsActiveV1(Long id, String name, String mobileNo, Gender gender, Integer age, String address,
					   Integer streetId, LocalDate dob, boolean isDeleted, boolean isEntrolled, String reason);

	@Query(value = "call VSScreeningReport(:campIds,:startDate,:endDate)", nativeQuery = true)
	List<VSScreeningReportDTO> vsScreeningReport(String campIds, String startDate, String endDate);
	
	@Query(value = "call VSClinicalReport(:campIds,:startDate,:endDate)", nativeQuery = true)
	List<VSClinicalReportDTO> vsClinicalReport(String campIds, String startDate, String endDate);
	
	@Modifying(flushAutomatically = true)
	@Query("update Candidate set revisitStatus=:option,optionalId=0,consentDate=null, lastModifiedDate=now(),lastModifiedBy=:modifiedBy where id=:id")
	int updateCandidateByIdForRevisit(Long id, Integer option,String modifiedBy);
	
	@Query(value = "call screeningReportV1(:campIds,:cIds)", nativeQuery = true)
	List<ScreeningReportDTO> screeningReportForConsolidation(String campIds,String cIds );
	
	@Query(value = "call clinicalReportV1(:campIds,:cIds)", nativeQuery = true)
	List<ClinicalReportDTO> clinicalReportForConsolidation(String campIds, String cIds);

}
