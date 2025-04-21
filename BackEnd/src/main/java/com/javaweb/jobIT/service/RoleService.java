package com.javaweb.jobIT.service;

import com.javaweb.jobIT.constant.RoleEnum;
import com.javaweb.jobIT.dto.request.UpdateRoleRequest;
import com.javaweb.jobIT.dto.request.user.RoleRequest;
import com.javaweb.jobIT.dto.response.user.RoleResponse;
import com.javaweb.jobIT.entity.PermissionEntity;
import com.javaweb.jobIT.entity.RoleEntity;
import com.javaweb.jobIT.entity.UserEntity;
import com.javaweb.jobIT.exception.AppException;
import com.javaweb.jobIT.exception.ErrorCode;
import com.javaweb.jobIT.repository.PermissionRepository;
import com.javaweb.jobIT.repository.RoleRepository;
import com.javaweb.jobIT.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoleService {
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @PreAuthorize("hasRole('ADMIN')")
    public RoleResponse createRole(RoleRequest request) {
        RoleEntity roleEntity = modelMapper.map(request,RoleEntity.class);

        List<PermissionEntity> permissions = permissionRepository.findAllById(request.getPermissions());
        roleEntity.setPermissions(new HashSet<>(permissions));

        roleRepository.save(roleEntity);
        return modelMapper.map(roleEntity,RoleResponse.class);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<RoleResponse> getAllRoles() {
        return roleRepository.findAll().stream().map(role ->
                modelMapper.map(role,RoleResponse.class))
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteRole(String role) {
        roleRepository.deleteById(role);
    }

    @PreAuthorize("hasAnyRole('ADMIN','CANDIDATE')")
    public String updateRoleForUser(UpdateRoleRequest request) {
        var context = SecurityContextHolder.getContext();
        Authentication authentication = context.getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        String name = authentication.getName();
        UserEntity user = userRepository.findByUsername(name).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        if (!user.getEmail().equals(request.getEmail())) {
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        }
        RoleEntity employer = roleRepository.findById(String.valueOf(RoleEnum.EMPLOYER)).orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
        if (!user.getRoles().contains(employer)){
            user.getRoles().add(employer);
            userRepository.save(user);
            return "Update successfully";
        } else {
            return "Account already exists role";
        }
    }
}
