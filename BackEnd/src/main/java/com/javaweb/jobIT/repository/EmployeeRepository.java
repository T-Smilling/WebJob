package com.javaweb.jobIT.repository;

import com.javaweb.jobIT.entity.EmployeeEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<EmployeeEntity,Long> {
    Page<EmployeeEntity> findByCompany_Id(Long companyId, Pageable pageable);

    boolean existsByIdAndCompany_Id(Long employerId, Long companyId);

    Optional<EmployeeEntity> findByEmail(String email);
}
