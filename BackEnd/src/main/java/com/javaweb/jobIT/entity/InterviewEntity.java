package com.javaweb.jobIT.entity;

import com.javaweb.jobIT.constant.InterviewStatus;
import com.javaweb.jobIT.constant.InterviewType;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "interviews")
public class InterviewEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "job_application_id")
    private JobApplicationEntity jobApplication;

    private Instant interviewDate;
    private String location;
    private String meetingLink;

    @Enumerated(EnumType.STRING)
    private InterviewType interviewType;

    @Enumerated(EnumType.STRING)
    private InterviewStatus interviewStatus;

    @Column(columnDefinition = "TEXT")
    private String feedback;
}
