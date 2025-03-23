package com.javaweb.jobIT.dto.response.resume;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeResponse {
    private Long id;
    private String resumeUrl;
    private Instant updatedAt;
}
