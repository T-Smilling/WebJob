package com.javaweb.jobIT.dto.response.jobpost;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyForJobResponse {
    private Long id;
    private String companyName;
    private String logoUrl;
}
