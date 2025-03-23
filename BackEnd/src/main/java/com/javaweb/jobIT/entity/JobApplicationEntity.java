package com.javaweb.jobIT.entity;

import com.javaweb.jobIT.constant.ResumeStatusEnum;
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
@Table(name = "job_applications")
public class JobApplicationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @ManyToOne
    @JoinColumn(name = "job_post_id")
    private JobPostEntity jobPost;

    @ManyToOne
    @JoinColumn(name = "resume_id", nullable = false)
    private ResumeEntity resume;

    @OneToMany(mappedBy = "jobApplication")
    private List<InterviewEntity> interviews = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private ResumeStatusEnum statusResume;
}
