package com.javaweb.jobIT.controller;

import com.javaweb.jobIT.dto.request.interview.InterviewRequest;
import com.javaweb.jobIT.dto.response.ApiResponse;
import com.javaweb.jobIT.dto.response.interview.InterviewResponse;
import com.javaweb.jobIT.service.InterviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/interview")
@Slf4j
@RequiredArgsConstructor
public class InterviewController {
    private final InterviewService interviewService;

    @PostMapping("/{applicationId}")
    ApiResponse<InterviewResponse> createInterview(@RequestBody @Valid InterviewRequest request, @PathVariable Long applicationId ) {
        return ApiResponse.<InterviewResponse>builder()
                .result(interviewService.createInterview(request,applicationId))
                .message("Created interview successful")
                .build();
    }

    @GetMapping("/{applicationId}/{interviewId}")
    ApiResponse<InterviewResponse> getInterview(@PathVariable Long applicationId,@PathVariable Long interviewId) {
        return ApiResponse.<InterviewResponse>builder()
                .result(interviewService.getInterview(interviewId, applicationId))
                .message("Get interview in job successful")
                .build();
    }

    @PutMapping("/{applicationId}/{interviewId}")
    ApiResponse<InterviewResponse> updateInterview(@PathVariable Long applicationId,
                                                 @RequestBody @Valid InterviewRequest request,
                                                 @PathVariable Long interviewId) {
        return ApiResponse.<InterviewResponse>builder()
                .result(interviewService.updateInterview(applicationId,request,interviewId))
                .message("Update interview by id: " + interviewId + " in application successful")
                .build();
    }


    @DeleteMapping("/{applicationId}/{interviewId}")
    ApiResponse<String> deleteResume(@PathVariable Long applicationId,@PathVariable Long interviewId) {
        return ApiResponse.<String>builder()
                .result(interviewService.deleteInterview(applicationId,interviewId))
                .build();
    }
}
