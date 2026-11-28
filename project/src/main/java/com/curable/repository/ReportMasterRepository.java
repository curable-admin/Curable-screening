package com.curable.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.curable.domain.report.ReportMaster;

public interface ReportMasterRepository extends JpaRepository<ReportMaster, Long> {
    Optional<ReportMaster> findFirstByReportCodeAndActiveTrue(String reportCode);
      Optional<ReportMaster> findFirstByHospitalIdAndReportCodeAndActiveTrue(
            Long hospitalId,
            String reportCode);
}
