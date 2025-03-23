package com.javaweb.jobIT.dto.response.employee;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployerInCompanyResponse {
    private String companyName;
    private List<EmployerResponse> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
}
