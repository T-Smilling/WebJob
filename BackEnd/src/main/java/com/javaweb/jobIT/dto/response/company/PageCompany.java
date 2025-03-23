package com.javaweb.jobIT.dto.response.company;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PageCompany {
    private List<CompanyResponse> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
}
