package com.curable.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.curable.domain.report.ReportConfigVersion;

public interface ReportConfigVersionRepository extends JpaRepository<ReportConfigVersion, Long> {
    Optional<ReportConfigVersion> findFirstByReportIdAndStatusOrderByVersionNumberDesc(Long reportId, String status);
}
