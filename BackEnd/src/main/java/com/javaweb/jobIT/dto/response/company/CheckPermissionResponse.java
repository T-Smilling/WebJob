package com.javaweb.jobIT.dto.response.company;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckPermissionResponse {
    private Boolean isEmployee;
}
