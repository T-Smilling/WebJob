package com.javaweb.jobIT.controller;

import com.javaweb.jobIT.dto.request.user.ChangePasswordRequest;
import com.javaweb.jobIT.dto.request.user.CreateUserRequest;
import com.javaweb.jobIT.dto.request.user.ForgotPasswordRequest;
import com.javaweb.jobIT.dto.request.user.UpdateUserRequest;
import com.javaweb.jobIT.dto.response.ApiResponse;
import com.javaweb.jobIT.dto.response.user.UserPagination;
import com.javaweb.jobIT.dto.response.user.UserResponse;
import com.javaweb.jobIT.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping(value = "/users")
@Slf4j
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/register")
    ApiResponse<UserResponse> createUser(@RequestBody @Valid CreateUserRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.createUser(request))
                .message("Created user successfully! Please check your email to active account")
                .build();
    }

    @GetMapping
    ApiResponse<UserPagination> getUsers(@RequestParam(defaultValue = "0", required = false) int page,
                                         @RequestParam(defaultValue = "10", required = false) int size) {
        return ApiResponse.<UserPagination>builder()
                .result(userService.getAllUsers(page, size))
                .message("Get all users successfully")
                .build();
    }

    @GetMapping("/{userId}")
    ApiResponse<UserResponse> getUser(@PathVariable("userId") String userId) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getUser(userId))
                .message("Get user successfully")
                .build();
    }

    @GetMapping("/my-info")
    ApiResponse<UserResponse> getMyInfo() {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getMyInfo())
                .message("Get user successfully")
                .build();
    }

    @DeleteMapping("/{userId}")
    ApiResponse<String> deleteUser(@PathVariable String userId) {
        userService.deleteUser(userId);
        return ApiResponse.<String>builder().result("User has been deleted").build();
    }

    @PutMapping("/{userId}")
    ApiResponse<UserResponse> updateUser(@PathVariable String userId, @ModelAttribute UpdateUserRequest request) throws IOException {
        return ApiResponse.<UserResponse>builder()
                .result(userService.updateUser(userId, request))
                .message("Updated user successfully")
                .build();
    }

    @PostMapping("/forgot-password")
    ApiResponse<String> forgotPassword(@RequestBody @Valid ForgotPasswordRequest request) {
        return ApiResponse.<String>builder()
                .result(userService.forgotPassword(request))
                .build();
    }

    @PostMapping("/change-password/{secretKey}")
    ApiResponse<String> changePassword(@PathVariable String secretKey, @RequestBody @Valid ChangePasswordRequest request) {
        return ApiResponse.<String>builder()
                .result(userService.changePassword(secretKey,request))
                .build();
    }

    @GetMapping("/confirm-account/{validKey}")
    ApiResponse<String> confirmAccount(@PathVariable String validKey) {
        return ApiResponse.<String>builder()
                .result(userService.verifiedEmail(validKey))
                .build();
    }
}
