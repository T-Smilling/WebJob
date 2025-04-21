package com.javaweb.jobIT.repository;

import com.javaweb.jobIT.entity.JobPostEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface JobPostRepository extends JpaRepository<JobPostEntity,Long>, JpaSpecificationExecutor<JobPostEntity> {
    List<JobPostEntity> findTop10ByOrderBySalaryDesc();

    @Query("SELECT DISTINCT j.location FROM JobPostEntity j WHERE j.location IS NOT NULL")
    List<String> findAllCities();

    @Query("SELECT j FROM JobPostEntity j WHERE j.company.id = :companyId " +
            "ORDER BY CASE " +
            "   WHEN j.endDate IS NULL OR j.endDate > :currentTime THEN 0 " +
            "   ELSE 1 " +
            "END, j.createAt DESC")
    Page<JobPostEntity> findByCompanyIdSorted(@Param("companyId") Long companyId, @Param("currentTime") Instant currentTime, Pageable pageable);

    @Query("SELECT j FROM JobPostEntity j " +
            "ORDER BY CASE " +
            "   WHEN j.endDate IS NULL OR j.endDate > :currentTime THEN 0 " +
            "   ELSE 1 " +
            "END, j.createAt DESC")
    Page<JobPostEntity> findAllSorted(@Param("currentTime") Instant currentTime, Pageable pageable);

}
