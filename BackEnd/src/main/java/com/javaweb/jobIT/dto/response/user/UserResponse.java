package com.javaweb.jobIT.dto.response.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private String id;
    private String username;
    private String email;
    private boolean emailVerified;
    private String fullName;
    private String phone;
    private String avatarUrl;
    private String status;
}
