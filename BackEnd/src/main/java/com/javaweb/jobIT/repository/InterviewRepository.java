package com.javaweb.jobIT.repository;

import com.javaweb.jobIT.entity.CompanyEntity;
import com.javaweb.jobIT.entity.InterviewEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InterviewRepository extends JpaRepository<InterviewEntity,Long> {
    Optional<InterviewEntity> findByIdAndJobApplication_Id(Long interviewId, Long applicationId);

    boolean existsByIdAndJobApplication_Id(Long interviewId, Long jobApplicationId);
}
