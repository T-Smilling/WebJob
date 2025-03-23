package com.javaweb.jobIT.dto.request.jobapplication;

import com.javaweb.jobIT.constant.ResumeStatusEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateStatusRequest {
    private ResumeStatusEnum statusResume;
}
