package com.javaweb.jobIT.dto.request.subscriber;

import com.javaweb.jobIT.dto.request.skill.SkillRequest;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriberRequest {
    private String name;
    @NotBlank(message = "Email not blank")
    private String email;
    @NotBlank(message = "Phone not blank")
    private String phone;
    private List<SkillRequest> updateSkills = new ArrayList<>();
}
