package com.javaweb.jobIT.controller;

import com.javaweb.jobIT.dto.request.subscriber.SubscriberRequest;
import com.javaweb.jobIT.dto.response.ApiResponse;
import com.javaweb.jobIT.dto.response.subscriber.PageSubscriber;
import com.javaweb.jobIT.dto.response.subscriber.SubscriberResponse;
import com.javaweb.jobIT.service.SubscriberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/subscriber")
@Slf4j
@RequiredArgsConstructor
public class SubscriberController {
    private final SubscriberService subscriberService;

    @PostMapping("/{jobPostId}")
    ApiResponse<SubscriberResponse> createSubscriber(@PathVariable Long jobPostId, @RequestBody @Valid SubscriberRequest subscriberRequest) {
        return ApiResponse.<SubscriberResponse>builder()
                .result(subscriberService.createSubscriber(jobPostId,subscriberRequest))
                .message("Create subscriber successful")
                .build();
    }

    @GetMapping("/{jobId}")
    ApiResponse<PageSubscriber> getAllSubscribersByJobId(@PathVariable Long jobId,
                                              @RequestParam(defaultValue = "0", required = false) int page,
                                              @RequestParam(defaultValue = "9", required = false) int size) {
        return ApiResponse.<PageSubscriber>builder()
                .result(subscriberService.getAllSubscribersByJobId(jobId, page, size))
                .message("Get all subscriber successful")
                .build();
    }


    @PutMapping("/{jobId}/{subscriberId}")
    ApiResponse<SubscriberResponse> updateSubscriber(@PathVariable Long jobId,@PathVariable Long subscriberId,@RequestBody @Valid SubscriberRequest subscriberRequest) {
        return ApiResponse.<SubscriberResponse>builder()
                .result(subscriberService.updateSubscriber(jobId,subscriberId, subscriberRequest))
                .message("Update subscriber successful")
                .build();
    }

    @DeleteMapping("/{jobId}/{subscriberId}")
    ApiResponse<String> removeSubscriberFromJob(@PathVariable Long jobId,@PathVariable Long subscriberId) {
        return ApiResponse.<String>builder()
                .result(subscriberService.removeSubscriberFromJob(subscriberId,jobId))
                .build();
    }
}
