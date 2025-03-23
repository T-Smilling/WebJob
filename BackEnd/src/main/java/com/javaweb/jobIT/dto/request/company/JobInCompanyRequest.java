package com.javaweb.jobIT.dto.request.company;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobInCompanyRequest {
    @NotBlank(message = "Company name not blank")
    private String companyName;
    @NotBlank(message = "Address company not blank")
    private String address;
}
