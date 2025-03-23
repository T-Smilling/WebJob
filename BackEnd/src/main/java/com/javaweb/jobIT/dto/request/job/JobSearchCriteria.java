package com.javaweb.jobIT.dto.request.job;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class JobSearchCriteria {
    private String title;
    private String location;
    private String jobType;
    private String jobLevel;
    private Double minSalary;
    private Double maxSalary;
    private String skill;

    private Double parseDoubleSafely(String value) {
        if (value == null || value.isEmpty()) {
            return null;
        }
        try {
            return Double.parseDouble(value);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    public JobSearchCriteria(Map<String, String> params) {
        this.title = params.getOrDefault("title", null);
        this.location = params.getOrDefault("location", null);
        this.jobType = params.getOrDefault("jobType", null);
        this.jobLevel = params.getOrDefault("jobLevel", null);
        this.skill = params.getOrDefault("skill", null);
        this.minSalary = parseDoubleSafely(params.get("minSalary"));
        this.maxSalary = parseDoubleSafely(params.get("maxSalary"));
    }
}
