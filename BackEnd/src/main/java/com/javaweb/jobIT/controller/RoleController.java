package com.javaweb.jobIT.controller;

import com.javaweb.jobIT.dto.request.UpdateRoleRequest;
import com.javaweb.jobIT.dto.request.user.RoleRequest;
import com.javaweb.jobIT.dto.response.ApiResponse;
import com.javaweb.jobIT.dto.response.user.RoleResponse;
import com.javaweb.jobIT.service.RoleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/roles")
@Slf4j
@RequiredArgsConstructor
public class RoleController {
    private final RoleService roleService;

    @PostMapping
    ApiResponse<RoleResponse> createRole(@RequestBody RoleRequest request) {
        return ApiResponse.<RoleResponse>builder()
                .result(roleService.createRole(request))
                .message("Role created")
                .build();
    }

    @GetMapping
    ApiResponse<List<RoleResponse>> getAllRoles() {
        return ApiResponse.<List<RoleResponse>>builder()
                .result(roleService.getAllRoles())
                .message("All roles")
                .build();
    }
    @PostMapping("/update")
    ApiResponse<String> updateRoleForUser(@RequestBody UpdateRoleRequest request) {
        return ApiResponse.<String>builder()
                .result(roleService.updateRoleForUser(request))
                .message("Successfully")
                .build();
    }

    @DeleteMapping("/{role}")
    ApiResponse<Void> deleteRole(@PathVariable String role) {
        roleService.deleteRole(role);
        return ApiResponse.<Void>builder()
                .message("Delete successfully").build();
    }
}
