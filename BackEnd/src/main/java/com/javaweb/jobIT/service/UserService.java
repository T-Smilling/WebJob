package com.javaweb.jobIT.service;

import com.javaweb.jobIT.constant.RoleEnum;
import com.javaweb.jobIT.dto.request.user.ChangePasswordRequest;
import com.javaweb.jobIT.dto.request.user.CreateUserRequest;
import com.javaweb.jobIT.dto.request.user.ForgotPasswordRequest;
import com.javaweb.jobIT.dto.request.user.UpdateUserRequest;
import com.javaweb.jobIT.dto.response.user.UserPagination;
import com.javaweb.jobIT.dto.response.user.UserResponse;
import com.javaweb.jobIT.entity.RoleEntity;
import com.javaweb.jobIT.entity.UserEntity;
import com.javaweb.jobIT.exception.AppException;
import com.javaweb.jobIT.exception.ErrorCode;
import com.javaweb.jobIT.exception.InvalidFormatException;
import com.javaweb.jobIT.exception.ResourceNotFoundException;
import com.javaweb.jobIT.repository.RoleRepository;
import com.javaweb.jobIT.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataIntegrityViolationException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.UUID;


@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final UploadImageService uploadImageService;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final BaseRedisService baseRedisService;

    public UserResponse createUser(CreateUserRequest createUserRequest) {
        UserEntity userEntity = modelMapper.map(createUserRequest, UserEntity.class);
        userEntity.setPassword(passwordEncoder.encode(createUserRequest.getPassword()));

        HashSet<RoleEntity> roles = new HashSet<>();
        roleRepository.findById(String.valueOf(RoleEnum.CANDIDATE)).ifPresent(roles::add);

        userEntity.setRoles(roles);
        userEntity.setEmailVerified(false);
        userEntity.setStatus("active");
        userEntity.setAvatarUrl("https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png");
        try {
            userEntity = userRepository.save(userEntity);
            String resetToken = UUID.randomUUID().toString();

            baseRedisService.set("validToken:" + resetToken, userEntity.getEmail(), 1);
            kafkaTemplate.send("confirm-account-topic",String.format("email=%s,code=%s", userEntity.getEmail(),resetToken));

        } catch (DataIntegrityViolationException e) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        UserResponse userResponse = modelMapper.map(userEntity, UserResponse.class);
        userResponse.setId(userEntity.getId());

        return userResponse;
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'CANDIDATE', 'EMPLOYER')")
    public UserResponse getMyInfo() {
        log.info("In method get User is using");
        var context = SecurityContextHolder.getContext();
        Authentication authentication = context.getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        String name = authentication.getName();
        UserEntity user = userRepository.findByUsername(name).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return modelMapper.map(user, UserResponse.class);
    }

    @PreAuthorize("hasAnyRole('ADMIN','CANDIDATE','EMPLOYER')")
    public UserResponse updateUser(String userId, UpdateUserRequest request) throws IOException {
        UserEntity user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        UserEntity updatedUser = modelMapper.map(request, UserEntity.class);
        updatedUser.setId(user.getId());
        updatedUser.setStatus(user.getStatus());
        updatedUser.setEmail(user.getEmail());
        updatedUser.setUsername(user.getUsername());
        updatedUser.setEmailVerified(user.getEmailVerified());
        if (request.getPassword() != null){
            updatedUser.setPassword(passwordEncoder.encode(request.getPassword()));
        } else{
            updatedUser.setPassword(user.getPassword());
        }

        if (request.getAvatarUrl()!=null) {
            updatedUser.setAvatarUrl(uploadImageService.uploadImage(request.getAvatarUrl()));
        } else{
            updatedUser.setAvatarUrl(user.getAvatarUrl());
        }

        updatedUser.setRoles(new HashSet<>(user.getRoles()));

        userRepository.save(updatedUser);

        return modelMapper.map(updatedUser,UserResponse.class);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(String userId) {
        UserEntity userEntity = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        userEntity.setStatus("inactive");
        userRepository.save(userEntity);
    }

    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    public UserPagination getAllUsers(int page, int size) {
        log.info("In method get all Users");
        Pageable pageable = PageRequest.of(page,size, Sort.by("username").ascending());

        Page<UserResponse> result = userRepository.findAll(pageable).map(user -> modelMapper.map(user, UserResponse.class));
        return UserPagination.builder()
                .content(result.getContent())
                .page(result.getNumber())
                .size(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .build();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'CANDIDATE', 'EMPLOYER')")
    public UserResponse getUser(String id) {
        return modelMapper.map(
                userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED)), UserResponse.class);
    }

    public String forgotPassword(ForgotPasswordRequest request) {
        UserEntity userEntity = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (userEntity.getStatus().equals("inactive")){
            throw new InvalidFormatException("User is disabled");
        }
        String resetToken = UUID.randomUUID().toString();
        String OTP = String.format("%06d", new Random().nextInt(999999));

        baseRedisService.setForMinutes("resetToken:" + resetToken, request.getEmail(), 5);
        baseRedisService.setForMinutes("otp:" + resetToken, OTP, 5);

        kafkaTemplate.send("confirm-forgot-password-topic", String.format("email=%s,code=%s,otp=%s", request.getEmail(),resetToken,OTP));

        return "Please check your email!";
    }

    public String verifiedEmail(String validKey) {
        String email = (String) baseRedisService.get("validToken:"+ validKey);
        UserEntity user = userRepository.findByEmail(email).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        user.setEmailVerified(true);
        userRepository.save(user);
        baseRedisService.delete("validToken:"+ validKey);
        return "Account has been activated";
    }

    public String changePassword(String secretKey, ChangePasswordRequest request) {
        String email = (String) baseRedisService.get("resetToken:"+ secretKey);
        String storedOTP = (String) baseRedisService.get("otp:" + secretKey);
        UserEntity userEntity = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (userEntity.getStatus().equals("inactive")){
            throw new ResourceNotFoundException("User is disabled");
        }
        if (email == null || storedOTP == null) {
            throw new InvalidFormatException("Invalid or expired token");
        }

        if (!storedOTP.equals(request.getOtp())) {
            throw new InvalidFormatException("Invalid OTP");
        }

        if (!request.getPassword().equals(request.getConfirmPassword())){
            throw new ResourceNotFoundException("Passwords do not match");
        }
        userEntity.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(userEntity);
        baseRedisService.delete("resetToken:"+ secretKey);
        baseRedisService.delete("otp:" + secretKey);
        return "Password changed successfully!";
    }
}
