package com.curable.repository;

import java.time.Instant;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.curable.domain.CandidateRevisit;

@Repository
public interface CandidateRevisitRepository extends JpaRepository<CandidateRevisit, Long> {

	/**
	 * Find all revisits for a specific candidate
	 */
	List<CandidateRevisit> findByCandidate_id(Long candidateId);

	/**
	 * Find revisits by status
	 */
	List<CandidateRevisit> findByRevisitStatus(String revisitStatus);

	/**
	 * Find revisits by candidate and status
	 */
	@Query("SELECT cr FROM CandidateRevisit cr WHERE cr.candidate.id = :candidateId AND cr.revisitStatus = :status")
	List<CandidateRevisit> findByCandidateAndStatus(@Param("candidateId") Long candidateId,
			@Param("status") String status);

	/**
	 * Count revisits for a candidate
	 */
	long countByCandidate_id(Long candidateId);

	@Query("select id from CandidateRevisit where revisitStatus =:status and candidate.id = :candidateId")
	Long getInProgressRevisitForCandidate(String status, Long candidateId);
	
	@Modifying(flushAutomatically = true,clearAutomatically = true)
	@Query("update CandidateRevisit set revisitStatus=:status,nextFollowUpDate=now() where id=:id")
	int updateRevisist(Long id, String  status);

	@Query("select distinct revisitDate from CandidateRevisit where candidate.id = :candidateId")
	List<Instant> getRevisitCreateDateForCandidate(@Param("candidateId") Long candidateId);


}
