package com.javaweb.jobIT.dto.request.user;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChangePasswordRequest {
    @NotBlank(message = "Password not be blank")
    private String password;
    @NotBlank(message = "Confirm Password not be blank")
    private String confirmPassword;
    @NotBlank(message = "OTP not be blank")
    private String otp;
}
