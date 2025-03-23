package com.javaweb.jobIT.repository;

import com.javaweb.jobIT.entity.JobPostEntity;
import com.javaweb.jobIT.entity.SubscriberEntity;
import com.javaweb.jobIT.entity.UserEntity;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriberRepository extends JpaRepository<SubscriberEntity,Long> {
    @Query("""
        SELECT s FROM SubscriberEntity s
        JOIN s.skills sk
        WHERE sk IN (
            SELECT rs FROM JobPostEntity j JOIN j.requiredSkills rs WHERE j.id = :jobId
        )
        GROUP BY s.id
        HAVING COUNT(sk) >= 2
    """)
    List<SubscriberEntity> findMatchingSubscribers(@Param("jobId") Long jobId);

    @Query("SELECT COUNT(s) FROM SubscriberEntity s WHERE s.jobPost.id = :jobPostId")
    Long countSubscribersByJobPostId(@Param("jobPostId") Long jobPostId);

    Page<SubscriberEntity> findByJobPost(JobPostEntity jobPostEntity, Pageable pageable);

    @Query("SELECT s FROM SubscriberEntity s LEFT JOIN FETCH s.skills WHERE s.id = :subscriberId AND s.jobPost.id = :jobId")
    Optional<SubscriberEntity> findByIdAndJobPost_Id(@Param("subscriberId") Long subscriberId, @Param("jobId") Long jobId);

    SubscriberEntity findByEmail(String email);

    Optional<SubscriberEntity> findByEmailAndJobPost(String email, JobPostEntity jobPostEntity);
}
