package com.javaweb.jobIT.repository;

import com.javaweb.jobIT.entity.ResumeEntity;
import com.javaweb.jobIT.entity.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ResumeRepository extends JpaRepository<ResumeEntity,Long> {
    Page<ResumeEntity> findByUser(UserEntity user, Pageable pageable);
}
