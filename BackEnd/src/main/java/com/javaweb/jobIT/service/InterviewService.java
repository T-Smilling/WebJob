package com.javaweb.jobIT.service;

import com.javaweb.jobIT.constant.ResumeStatusEnum;
import com.javaweb.jobIT.constant.RoleEnum;
import com.javaweb.jobIT.dto.request.interview.InterviewRequest;
import com.javaweb.jobIT.dto.response.interview.InterviewResponse;
import com.javaweb.jobIT.entity.*;
import com.javaweb.jobIT.exception.AppException;
import com.javaweb.jobIT.exception.ErrorCode;
import com.javaweb.jobIT.exception.ResourceNotFoundException;
import com.javaweb.jobIT.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class InterviewService {
    private final InterviewRepository interviewRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final ModelMapper modelMapper;
    private final UserRepository userRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final RoleRepository roleRepository;
    private final EmployeeRepository employeeRepository;

    public UserEntity getUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        String name = authentication.getName();
        return userRepository.findByUsername(name).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }

    private boolean checkRoleAdmin() {
        return SecurityContextHolder.getContext().getAuthentication().getAuthorities()
                .stream().noneMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
    }

    @PreAuthorize("hasAnyRole('EMPLOYER','ADMIN')")
    public InterviewResponse createInterview(InterviewRequest interviewRequest,Long applicationId){
        InterviewEntity interviewEntity = modelMapper.map(interviewRequest, InterviewEntity.class);
        JobApplicationEntity jobApplication = jobApplicationRepository.findById(applicationId).orElseThrow(() -> new ResourceNotFoundException("Job application not found"));

        UserEntity user = getUser();
        if (checkRoleAdmin()) {
            EmployeeEntity employee = employeeRepository.findByEmail(user.getEmail()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

            RoleEntity roleEmployee = roleRepository.findById(String.valueOf(RoleEnum.EMPLOYER)).orElseThrow(()-> new ResourceNotFoundException("Role not found"));

            if (!jobApplication.getJobPost().getCompany().getEmployees().contains(employee) && user.getRoles().contains(roleEmployee)){
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }
        }
        if (!jobApplication.getStatusResume().equals(ResumeStatusEnum.APPROVED)) throw new AppException(ErrorCode.NOT_CREATED_INTERVIEW);
        interviewEntity.setJobApplication(jobApplication);
        interviewEntity = interviewRepository.save(interviewEntity);

        String email = interviewEntity.getJobApplication().getUser().getEmail();
        String companyName = jobApplication.getJobPost().getCompany().getCompanyName();
        String jobTitle = jobApplication.getJobPost().getTitle();

        kafkaTemplate.send("confirm-job-interview-topic",String.format("email=%s,interviewDate=%s,interviewType=%s," +
                        "location=%s,meetingLink=%s,companyName=%s,jobTitle=%s",
                email,interviewEntity.getInterviewDate(),interviewEntity.getInterviewType(),
                interviewRequest.getLocation(),interviewRequest.getMeetingLink(),companyName,jobTitle
        ));

        return modelMapper.map(interviewEntity, InterviewResponse.class);
    }
    @PreAuthorize("hasAnyRole('EMPLOYER','ADMIN','CANDIDATE')")
    public InterviewResponse getInterview(Long interviewId,Long applicationId){
        InterviewEntity interview = interviewRepository.findByIdAndJobApplication_Id(interviewId,applicationId).orElseThrow(() -> new ResourceNotFoundException("Interview not found"));

        UserEntity user = getUser();
        if (checkRoleAdmin()){
            EmployeeEntity employee = employeeRepository.findByEmail(user.getEmail()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

            RoleEntity roleCandidate = roleRepository.findById(String.valueOf(RoleEnum.CANDIDATE)).orElseThrow(()-> new ResourceNotFoundException("Role not found"));
            RoleEntity roleEmployee = roleRepository.findById(String.valueOf(RoleEnum.EMPLOYER)).orElseThrow(()-> new ResourceNotFoundException("Role not found"));

            if ((!interview.getJobApplication().getUser().getUsername().equals(user.getUsername()) && user.getRoles().contains(roleCandidate))
                    || (!interview.getJobApplication().getJobPost().getCompany().getEmployees().contains(employee) && user.getRoles().contains(roleEmployee))
            ){
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }
        }
        return modelMapper.map(interview, InterviewResponse.class);
    }

    @PreAuthorize("hasAnyRole('EMPLOYER','ADMIN')")
    public InterviewResponse updateInterview(Long applicationId, InterviewRequest interviewRequest,Long interviewId){
        InterviewEntity interview = interviewRepository.findByIdAndJobApplication_Id(interviewId,applicationId).orElseThrow(() -> new ResourceNotFoundException("Interview not found"));
        UserEntity user = getUser();

        if (checkRoleAdmin()){
            EmployeeEntity employee = employeeRepository.findByEmail(user.getEmail()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

            RoleEntity roleEmployee = roleRepository.findById(String.valueOf(RoleEnum.EMPLOYER)).orElseThrow(()-> new ResourceNotFoundException("Role not found"));
            JobApplicationEntity jobApplication = interview.getJobApplication();
            if (!jobApplication.getJobPost().getCompany().getEmployees().contains(employee) && user.getRoles().contains(roleEmployee)){
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }
        }
        modelMapper.map(interviewRequest, interview);
        return modelMapper.map(interviewRepository.save(interview), InterviewResponse.class);
    }

    @PreAuthorize("hasAnyRole('EMPLOYER','ADMIN')")
    public String deleteInterview(Long jobApplicationId, Long interviewId) {
        if (!interviewRepository.existsByIdAndJobApplication_Id(interviewId, jobApplicationId)) {
            throw new RuntimeException("Interview not found for this job application");
        }
        UserEntity user = getUser();
        if (checkRoleAdmin()){
            EmployeeEntity employee = employeeRepository.findByEmail(user.getEmail()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

            RoleEntity roleEmployee = roleRepository.findById(String.valueOf(RoleEnum.EMPLOYER)).orElseThrow(()-> new ResourceNotFoundException("Role not found"));
            JobApplicationEntity jobApplication = jobApplicationRepository.findById(jobApplicationId).orElseThrow(() -> new ResourceNotFoundException("Job application not found"));
            if (!jobApplication.getJobPost().getCompany().getEmployees().contains(employee) && user.getRoles().contains(roleEmployee)){
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }
        }

        interviewRepository.deleteById(interviewId);
        return "Interview deleted";
    }
}
