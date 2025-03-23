package com.javaweb.jobIT.repository;

import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import com.javaweb.jobIT.entity.UserEntity;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity,String> {

     Optional<UserEntity> findByUsername(String name);

     Optional<UserEntity> findByEmail(String email);
}