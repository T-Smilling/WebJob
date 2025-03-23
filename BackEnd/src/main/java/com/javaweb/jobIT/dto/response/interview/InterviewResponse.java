package com.javaweb.jobIT.dto.response.interview;

import com.javaweb.jobIT.constant.InterviewStatus;
import com.javaweb.jobIT.constant.InterviewType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewResponse {
    private Long id;
    private Instant interviewDate;
    private InterviewType interviewType;
    private String location;
    private String meetingLink;
    private InterviewStatus interviewStatus;
    private String feedback;
}
