package com.javaweb.jobIT.dto.response.jobapplication;

import com.javaweb.jobIT.constant.ResumeStatusEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateStatusResponse {
    private ResumeStatusEnum statusResume;
}
