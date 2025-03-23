package com.javaweb.jobIT.controller;

import com.javaweb.jobIT.dto.request.job.JobPostRequest;
import com.javaweb.jobIT.dto.request.job.JobPostUpdateRequest;
import com.javaweb.jobIT.dto.request.job.JobSearchCriteria;
import com.javaweb.jobIT.dto.response.ApiResponse;
import com.javaweb.jobIT.dto.response.company.CheckPermissionResponse;
import com.javaweb.jobIT.dto.response.jobpost.JobPostResponse;
import com.javaweb.jobIT.dto.response.jobpost.PageJobPost;
import com.javaweb.jobIT.dto.response.skill.SkillResponse;
import com.javaweb.jobIT.service.JobPostService;
import com.javaweb.jobIT.service.SubscriberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/jobs")
@Slf4j
@RequiredArgsConstructor
public class JobPostController {
    private final JobPostService jobPostService;
    private final SubscriberService subscriberService;

    @PostMapping("/{companyId}")
    ApiResponse<JobPostResponse> createJob(@PathVariable String companyId, @RequestBody @Valid JobPostRequest jobPostRequest) {
        return ApiResponse.<JobPostResponse>builder()
                .result(jobPostService.createJob(companyId, jobPostRequest))
                .message("Create job successful")
                .build();
    }

    @GetMapping("/search")
    public ApiResponse<PageJobPost> getSearchJobs(@RequestParam Map<String, String> params,
                                     @RequestParam(defaultValue = "0") int page,
                                     @RequestParam(defaultValue = "9") int size) {

        JobSearchCriteria criteria = new JobSearchCriteria(params);
        return ApiResponse.<PageJobPost>builder()
                .result(jobPostService.searchJobs(criteria,page, size))
                .message("Find job successful")
                .build();
    }
    @GetMapping
    ApiResponse<List<JobPostResponse>> findTop10Job(){
        return ApiResponse.<List<JobPostResponse>>builder()
                .result(jobPostService.findTop10Job())
                .message("Find successfully")
                .build();
    }
    @GetMapping("/all-jobs")
    ApiResponse<PageJobPost> getAllJob(@RequestParam(defaultValue = "0", required = false) int page,
                                       @RequestParam(defaultValue = "9", required = false) int size) {
        return ApiResponse.<PageJobPost>builder()
                .result(jobPostService.getAllJobPost(page, size))
                .message("Get all job successful")
                .build();
    }
    @GetMapping("/city")
    ApiResponse<List<String>> getCity(){
        return ApiResponse.<List<String>>builder()
                .result(jobPostService.findAllCity())
                .message("Find successfully")
                .build();
    }

    @GetMapping("/skill")
    ApiResponse<List<SkillResponse>> getSkill(){
        return ApiResponse.<List<SkillResponse>>builder()
                .result(jobPostService.findAllSkill())
                .message("Get all skill successfully")
                .build();
    }
    @PostMapping("/send-mail/{jobId}")
    ApiResponse<String> sendMailToSubscriber(@PathVariable Long jobId) {
        return ApiResponse.<String>builder()
                .result(subscriberService.findSubscriberToSendMail(jobId))
                .message("Send successful")
                .build();
    }

    @GetMapping("/{jobId}")
    ApiResponse<JobPostResponse> getJobById(@PathVariable Long jobId) {
        return ApiResponse.<JobPostResponse>builder()
                .result(jobPostService.getJobPostById(jobId))
                .message("Get job by id: " + jobId + " successfully")
                .build();
    }

    @PostMapping("/employee/{jobId}")
    public ApiResponse<CheckPermissionResponse> checkEmployeeForJob(@PathVariable Long jobId) {
        return ApiResponse.<CheckPermissionResponse>builder()
                .message("Check successfully")
                .result(jobPostService.checkPermission(jobId))
                .build();
    }

    @PutMapping("/{jobId}")
    ApiResponse<JobPostResponse> updateJob(@PathVariable Long jobId,@RequestBody @Valid JobPostUpdateRequest jobPostRequest) {
        return ApiResponse.<JobPostResponse>builder()
                .result(jobPostService.updateInfoJob(jobId, jobPostRequest))
                .message("Update job successful")
                .build();
    }

    @DeleteMapping("/{jobId}")
    ApiResponse<String> deleteJob(@PathVariable Long jobId) {
        return ApiResponse.<String>builder()
                .result(jobPostService.deleteJobPostById(jobId))
                .build();
    }
}
