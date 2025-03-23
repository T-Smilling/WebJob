package com.javaweb.jobIT.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "resumes")
public class ResumeEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @OneToMany(mappedBy = "resume", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<JobApplicationEntity> jobApplications = new ArrayList<>();

    private String resumeUrl; // Link file PDF CV
}
