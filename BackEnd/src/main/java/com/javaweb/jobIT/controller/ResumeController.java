package com.javaweb.jobIT.controller;

import com.javaweb.jobIT.dto.response.ApiResponse;
import com.javaweb.jobIT.dto.response.resume.PageResume;
import com.javaweb.jobIT.dto.response.resume.ResumeResponse;
import com.javaweb.jobIT.service.JobApplicationService;
import com.javaweb.jobIT.service.ResumeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping(value = "/resume")
@Slf4j
@RequiredArgsConstructor
public class ResumeController {
    private final ResumeService resumeService;

    @PostMapping
    ApiResponse<ResumeResponse> uploadResume(@RequestParam("file") MultipartFile file) throws IOException {
        return ApiResponse.<ResumeResponse>builder()
                .result(resumeService.uploadResume(file))
                .message("Upload resume successful")
                .build();
    }

    @GetMapping
    ApiResponse<PageResume> getResumeByUser(@RequestParam(defaultValue = "0", required = false) int page,
                                          @RequestParam(defaultValue = "9", required = false) int size) {
        return ApiResponse.<PageResume>builder()
                .result(resumeService.getResumesByUser(page, size))
                .message("Get all resume successful")
                .build();
    }

    @GetMapping("/{resumeId}")
    ApiResponse<ResumeResponse> getResumeById(@PathVariable Long resumeId) {
        return ApiResponse.<ResumeResponse>builder()
                .result(resumeService.getResumeById(resumeId))
                .message("Get resume by id: " + resumeId + "successful")
                .build();
    }
    @GetMapping("/last-resume")
    ApiResponse<ResumeResponse> getLastResume() {
        return ApiResponse.<ResumeResponse>builder()
                .result(resumeService.getLatestResume())
                .message("Get last resume successful")
                .build();
    }

    @DeleteMapping("/{resumeId}")
    ApiResponse<String> deleteResume(@PathVariable Long resumeId) {
        return ApiResponse.<String>builder()
                .result(resumeService.deleteResume(resumeId))
                .build();
    }
}
