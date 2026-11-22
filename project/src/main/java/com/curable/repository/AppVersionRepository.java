package com.curable.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

import com.curable.domain.AppVersion;

public interface AppVersionRepository extends JpaRepository<AppVersion, Long>, QuerydslPredicateExecutor<AppVersion> {
	Optional<AppVersion> findTopByOrderByCreatedDateDesc();

}
