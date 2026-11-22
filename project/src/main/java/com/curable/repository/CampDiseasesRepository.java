package com.curable.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import com.curable.domain.CampDisease;

@Repository
public interface CampDiseasesRepository extends JpaRepository<CampDisease, Long>, QuerydslPredicateExecutor<CampDisease> {

	List<CampDisease> findByCamp_IdAndIsRecordDeletedFalse(Long campId);
	List<CampDisease> findByDiseaseTestMaster_IdAndIsRecordDeletedFalse(Long diseaseTestMasterId);
}
