package com.curable.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.curable.domain.report.ReportFieldOptionConfig;

public interface ReportFieldOptionConfigRepository extends JpaRepository<ReportFieldOptionConfig, Long> {
    List<ReportFieldOptionConfig> findByReportFieldConfigIdInAndActiveTrueOrderByDisplayOrderAscIdAsc(List<Long> fieldIds);
}
