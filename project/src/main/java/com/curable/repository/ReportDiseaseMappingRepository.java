package com.curable.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.curable.domain.report.ReportDiseaseMapping;

public interface ReportDiseaseMappingRepository extends JpaRepository<ReportDiseaseMapping, Long> {
    Optional<ReportDiseaseMapping> findByReportIdAndDiseaseTestMasterIdAndActiveTrue(Long reportId, Long diseaseTestMasterId);
    List<ReportDiseaseMapping> findByReportIdAndActiveTrueOrderBySectionOrderAsc(Long reportId);
}
