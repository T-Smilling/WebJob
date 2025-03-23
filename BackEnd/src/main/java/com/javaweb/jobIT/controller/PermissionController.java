package com.javaweb.jobIT.controller;

import com.javaweb.jobIT.dto.request.user.PermissionRequest;
import com.javaweb.jobIT.dto.response.ApiResponse;
import com.javaweb.jobIT.dto.response.user.PermissionResponse;
import com.javaweb.jobIT.service.PermissionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/permissions")
@Slf4j
@RequiredArgsConstructor
public class PermissionController {
    private final PermissionService permissionService;

    @PostMapping
    ApiResponse<PermissionResponse> createPermission(@RequestBody PermissionRequest request) {
        return ApiResponse.<PermissionResponse>builder()
                .result(permissionService.createPermission(request))
                .message("Permission created")
                .build();
    }

    @GetMapping
    ApiResponse<List<PermissionResponse>> getAllPermissions() {
        return ApiResponse.<List<PermissionResponse>>builder()
                .result(permissionService.getAllPermissions())
                .message("All permissions")
                .build();
    }

    @DeleteMapping("/{permission}")
    ApiResponse<Void> deletePermission(@PathVariable String permission) {
        permissionService.deletePermission(permission);
        return ApiResponse.<Void>builder()
                .message("Delete successfully")
                .build();
    }
}
