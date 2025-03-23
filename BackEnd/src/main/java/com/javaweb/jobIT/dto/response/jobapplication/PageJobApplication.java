package com.javaweb.jobIT.dto.response.jobapplication;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PageJobApplication {
    private List<JobApplicationResponse> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
}
