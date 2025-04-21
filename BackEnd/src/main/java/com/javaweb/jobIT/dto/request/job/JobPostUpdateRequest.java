package com.javaweb.jobIT.dto.request.job;

import com.javaweb.jobIT.constant.JobLevelEnum;
import com.javaweb.jobIT.constant.JobTypeEnum;
import com.javaweb.jobIT.dto.request.skill.SkillRequest;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobPostUpdateRequest {
    @NotBlank(message = "Title job must not blank")
    private String title;
    private String description;
    @NotBlank(message = "Location job must not blank")
    private String location;
    private Double salary;
    private JobTypeEnum jobType;
    private JobLevelEnum jobLevel;
    private List<SkillRequest> updateSkills = new ArrayList<>();;
}
