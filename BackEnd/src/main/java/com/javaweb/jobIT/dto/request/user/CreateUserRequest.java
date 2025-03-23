package com.javaweb.jobIT.dto.request.user;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.javaweb.jobIT.validator.DobConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateUserRequest {
    @Size(min = 4, message = "USERNAME_INVALID")
    private String username;

    @Size(min = 6, message = "INVALID_PASSWORD")
    private String password;

    private String fullName;
    private String phone;

    @Email(message = "INVALID_EMAIL")
    @NotBlank(message = "EMAIL_IS_REQUIRED")
    private String email;
}
