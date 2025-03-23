package com.javaweb.jobIT.dto.request.company;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyRequest {
    @NotBlank(message = "Company name not blank")
    private String companyName;
    private String description;
    private String website;
    private MultipartFile logoUrl;
    @NotBlank(message = "Address company not blank")
    private String address;
}
