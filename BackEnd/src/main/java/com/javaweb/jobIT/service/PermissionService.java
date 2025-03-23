package com.javaweb.jobIT.service;

import com.javaweb.jobIT.dto.request.user.PermissionRequest;
import com.javaweb.jobIT.dto.response.user.PermissionResponse;
import com.javaweb.jobIT.entity.PermissionEntity;
import com.javaweb.jobIT.repository.PermissionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PermissionService {
    private final PermissionRepository permissionRepository;
    private final ModelMapper modelMapper;

    @PreAuthorize("hasRole('ADMIN')")
    public PermissionResponse createPermission(PermissionRequest request) {
        PermissionEntity permission = modelMapper.map(request, PermissionEntity.class);
        permissionRepository.save(permission);
        return modelMapper.map(permission, PermissionResponse.class);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<PermissionResponse> getAllPermissions() {
        var permissions = permissionRepository.findAll();
        return permissions.stream().map(permission ->
                modelMapper.map(permission,PermissionResponse.class))
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deletePermission(String permission) {
        permissionRepository.deleteById(permission);
    }
}
