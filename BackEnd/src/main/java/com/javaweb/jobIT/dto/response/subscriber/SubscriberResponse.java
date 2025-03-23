package com.javaweb.jobIT.dto.response.subscriber;

import com.javaweb.jobIT.dto.response.skill.SkillResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriberResponse {
    private String id;
    private String name;
    private String email;
    private String phone;
    private Long jobPostId;
    private List<SkillResponse> skills;
}
