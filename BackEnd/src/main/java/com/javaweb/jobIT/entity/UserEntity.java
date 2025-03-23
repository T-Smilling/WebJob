package com.javaweb.jobIT.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class UserEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "username", unique = true)
    private String username;
    private String password;

    @Column(name = "email", unique = true)
    private String email;

    private String fullName;

    @Column(name = "status")
    private String status;
    private String phone;
    private String avatarUrl;

    @Column(name = "email_verified", nullable = false)
    private Boolean emailVerified;

    @ManyToMany
    @JoinTable(name="user_role",
            joinColumns = @JoinColumn(name="user_id"),
            inverseJoinColumns = @JoinColumn(name="role_name"))
    private Set<RoleEntity> roles;

    @OneToMany(mappedBy = "user")
    private List<JobApplicationEntity> jobApplications;

    @OneToMany(mappedBy = "user")
    private List<ResumeEntity> resumes;
}

