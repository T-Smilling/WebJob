package com.javaweb.jobIT.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "subscribers")
public class SubscriberEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "email")
    private String email;
    private String phone;

    @ManyToOne
    @JoinColumn(name = "job_id")
    private JobPostEntity jobPost;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "subscriber_skill",
            joinColumns = @JoinColumn(name = "subscriber_id"),
            inverseJoinColumns = @JoinColumn(name = "skill_id"))
    private List<SkillEntity> skills = new ArrayList<>();
}
