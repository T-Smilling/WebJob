package com.javaweb.jobIT.entity;

import com.javaweb.jobIT.constant.JobLevelEnum;
import com.javaweb.jobIT.constant.JobTypeEnum;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "job_posts")
public class JobPostEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "MEDIUMTEXT")
    private String description;
    private String location;
    private Double salary;

    @Enumerated(EnumType.STRING)
    private JobTypeEnum jobType;

    @Enumerated(EnumType.STRING)
    private JobLevelEnum jobLevel;

    private Integer quantity;
    private Instant startDate;
    private Instant endDate;
    private boolean active;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private CompanyEntity company;

    @OneToMany(mappedBy = "jobPost", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<JobApplicationEntity> jobApplications = new ArrayList<>();

    @OneToMany(mappedBy = "jobPost", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<SubscriberEntity> subscribers = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST,CascadeType.MERGE})
    @JoinTable(name = "job_post_skill",
            joinColumns = @JoinColumn(name = "job_id"),
            inverseJoinColumns = @JoinColumn(name = "skill_id"))
    private List<SkillEntity> requiredSkills = new ArrayList<>();

}
