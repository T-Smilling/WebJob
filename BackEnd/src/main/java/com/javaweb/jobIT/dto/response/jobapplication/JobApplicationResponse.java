package com.javaweb.jobIT.dto.response.jobapplication;

import com.javaweb.jobIT.constant.ResumeStatusEnum;
import com.javaweb.jobIT.dto.response.interview.InterviewResponse;
import com.javaweb.jobIT.dto.response.resume.ResumeResponse;
import com.javaweb.jobIT.dto.response.user.UserResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobApplicationResponse {
    private Long id;
    private UserResponse user;
    private ResumeResponse resume;
    private ResumeStatusEnum statusResume;
    private List<InterviewResponse> interviews;
}
