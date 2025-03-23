package com.javaweb.jobIT.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "companies")
public class CompanyEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name company not blank")
    private String companyName;

    @Column(columnDefinition = "MEDIUMTEXT")
    private String description;
    private String website;
    private String logoUrl;

    @NotBlank(message = "Address company not blank")
    private String address;

    @OneToMany(mappedBy = "company")
    private List<EmployeeEntity> employees = new ArrayList<>();

    @OneToMany(mappedBy = "company")
    private List<JobPostEntity> jobPosts = new ArrayList<>();
}
