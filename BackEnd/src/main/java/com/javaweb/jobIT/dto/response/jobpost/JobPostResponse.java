package com.javaweb.jobIT.dto.response.jobpost;

import com.javaweb.jobIT.constant.JobLevelEnum;
import com.javaweb.jobIT.constant.JobTypeEnum;
import com.javaweb.jobIT.dto.response.company.CompanyResponse;
import com.javaweb.jobIT.dto.response.skill.SkillResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobPostResponse {
    private Long id;
    private String title;
    private String description;
    private String location;
    private Double salary;
    private JobTypeEnum jobType;
    private JobLevelEnum jobLevel;
    private Integer quantity;
    private Instant startDate;
    private Instant endDate;
    private Instant createAt;
    private boolean active;

    private CompanyForJobResponse company;
    private Long numberOfJobApplications;
    private Long NumberOfSubscribers;

    private List<SkillResponse> requiredSkills;
}
