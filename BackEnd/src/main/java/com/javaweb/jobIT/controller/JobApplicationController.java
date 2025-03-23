package com.javaweb.jobIT.controller;

import com.javaweb.jobIT.dto.request.jobapplication.UpdateStatusRequest;
import com.javaweb.jobIT.dto.response.ApiResponse;
import com.javaweb.jobIT.dto.response.jobapplication.JobApplicationResponse;
import com.javaweb.jobIT.dto.response.jobapplication.PageJobApplication;
import com.javaweb.jobIT.dto.response.jobapplication.UpdateStatusResponse;
import com.javaweb.jobIT.service.JobApplicationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping(value = "/application")
@Slf4j
@RequiredArgsConstructor
public class JobApplicationController {
    private final JobApplicationService jobApplicationService;

    @PostMapping("/{jobPostId}")
    ApiResponse<JobApplicationResponse> applyJob(@PathVariable Long jobPostId ) {
        return ApiResponse.<JobApplicationResponse>builder()
                .result(jobApplicationService.applyJob(jobPostId))
                .message("Apply job successful")
                .build();
    }

    @GetMapping("/user")
    ApiResponse<PageJobApplication> getApplicationsByUser(@RequestParam(defaultValue = "0", required = false) int page,
                                                          @RequestParam(defaultValue = "9", required = false) int size) {
        return ApiResponse.<PageJobApplication>builder()
                .result(jobApplicationService.getApplicationsByUser(page, size))
                .message("Get application in job of user successful")
                .build();
    }

    @GetMapping("/{jobPostId}")
    ApiResponse<PageJobApplication> getApplicationsByJobPost(@PathVariable Long jobPostId,
                                                             @RequestParam(defaultValue = "0", required = false) int page,
                                                             @RequestParam(defaultValue = "9", required = false) int size) {
        return ApiResponse.<PageJobApplication>builder()
                .result(jobApplicationService.getApplicationsByJobPost(jobPostId,page,size))
                .message("Get all application in job successful")
                .build();
    }

    @GetMapping("/{jobPostId}/{applicationId}")
    ApiResponse<JobApplicationResponse> getApplicationById(@PathVariable Long jobPostId,@PathVariable Long applicationId ) {
        return ApiResponse.<JobApplicationResponse>builder()
                .result(jobApplicationService.getApplicationById(jobPostId,applicationId))
                .message("Get application in job successful")
                .build();
    }

    @PutMapping("/{jobPostId}/{applicationId}")
    ApiResponse<JobApplicationResponse> updateJobApplication(@PathVariable Long jobPostId,@PathVariable Long applicationId,@ModelAttribute MultipartFile file) throws IOException {
        return ApiResponse.<JobApplicationResponse>builder()
                .result(jobApplicationService.updateJobApplication(jobPostId,applicationId,file))
                .message("Update job application successful")
                .build();
    }

    @PutMapping("/{jobPostId}/{applicationId}/status")
    ApiResponse<UpdateStatusResponse> updateApplicationStatus(@PathVariable Long jobPostId,@PathVariable Long applicationId,@RequestBody UpdateStatusRequest request ) {
        return ApiResponse.<UpdateStatusResponse>builder()
                .result(jobApplicationService.updateApplicationStatus(jobPostId,applicationId,request))
                .message("Update status application successful")
                .build();
    }

    @DeleteMapping("/{jobPostId}/{applicationId}")
    ApiResponse<String> deleteApplication(@PathVariable Long jobPostId,@PathVariable Long applicationId) {
        return ApiResponse.<String>builder()
                .result(jobApplicationService.deleteApplication(jobPostId,applicationId))
                .build();
    }
}
