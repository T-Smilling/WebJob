package com.javaweb.jobIT.repository;

import com.javaweb.jobIT.entity.JobPostEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobPostRepository extends JpaRepository<JobPostEntity,Long>, JpaSpecificationExecutor<JobPostEntity> {
    List<JobPostEntity> findTop10ByOrderBySalaryDesc();

    @Query("SELECT DISTINCT j.location FROM JobPostEntity j WHERE j.location IS NOT NULL")
    List<String> findAllCities();

    Page<JobPostEntity> findByCompanyId(Long companyId, Pageable pageable);
}
