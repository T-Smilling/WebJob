package com.javaweb.jobIT.dto.response.employee;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployerResponse {
    private Long id;
    private String fullName;
    private String email;
}
