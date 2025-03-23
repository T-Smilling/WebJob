package com.javaweb.jobIT.dto.response.jobpost;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobPostResponseForCompany {
    private Long id;
    private String title;
    private String description;
    private Long numberOfJobApplications;
}
