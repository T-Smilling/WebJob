package com.javaweb.jobIT.repository;

import com.javaweb.jobIT.entity.SkillEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SkillRepository extends JpaRepository<SkillEntity, Long> {

    @Query("SELECT s FROM SkillEntity s WHERE s.name = :name")
    Optional<SkillEntity> findFirstByName(@Param("name") String name);
}
