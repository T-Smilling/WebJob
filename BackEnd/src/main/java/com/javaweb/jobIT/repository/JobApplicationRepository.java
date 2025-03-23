package com.javaweb.jobIT.repository;

import com.javaweb.jobIT.entity.JobApplicationEntity;
import com.javaweb.jobIT.entity.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplicationEntity,Long> {
    Optional<JobApplicationEntity> findByIdAndJobPostId(Long applicationId, Long jobPostId);

    Page<JobApplicationEntity> findByUser(UserEntity user, Pageable pageable);

    Page<JobApplicationEntity> findByJobPost_Id(Long jobPostId, Pageable pageable);

    Optional<JobApplicationEntity> findByIdAndJobPost_Id(Long applicationId, Long jobPostId);

    boolean existsByIdAndJobPost_Id(Long applicationId, Long jobPostId);

    @Query("SELECT COUNT(j) FROM JobApplicationEntity j WHERE j.jobPost.id = :jobPostId")
    Long countJobApplicationsByJobPostId(@Param("jobPostId") Long jobPostId);

    boolean existsByResumeId(Long resumeId);
}
