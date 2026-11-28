package com.curable.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.curable.domain.report.ReportFieldConfig;

public interface ReportFieldConfigRepository extends JpaRepository<ReportFieldConfig, Long> {
    List<ReportFieldConfig> findByConfigVersionIdAndActiveTrueAndVisibleTrueOrderByDisplayOrderAscIdAsc(Long configVersionId);
    List<ReportFieldConfig> findByConfigVersionIdAndActiveTrueOrderByDisplayOrderAscIdAsc(Long configVersionId);
    List<ReportFieldConfig> findByIdInAndActiveTrue(List<Long> ids);
}
