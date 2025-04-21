package com.javaweb.jobIT.service;

import com.javaweb.jobIT.constant.ResumeStatusEnum;
import com.javaweb.jobIT.dto.request.jobapplication.UpdateStatusRequest;
import com.javaweb.jobIT.dto.response.interview.InterviewResponse;
import com.javaweb.jobIT.dto.response.jobapplication.JobApplicationResponse;
import com.javaweb.jobIT.dto.response.jobapplication.PageJobApplication;
import com.javaweb.jobIT.dto.response.jobapplication.UpdateStatusResponse;
import com.javaweb.jobIT.dto.response.resume.ResumeResponse;
import com.javaweb.jobIT.dto.response.user.UserResponse;
import com.javaweb.jobIT.entity.JobApplicationEntity;
import com.javaweb.jobIT.entity.JobPostEntity;
import com.javaweb.jobIT.entity.ResumeEntity;
import com.javaweb.jobIT.entity.UserEntity;
import com.javaweb.jobIT.exception.AppException;
import com.javaweb.jobIT.exception.ErrorCode;
import com.javaweb.jobIT.exception.ResourceNotFoundException;
import com.javaweb.jobIT.repository.JobApplicationRepository;
import com.javaweb.jobIT.repository.JobPostRepository;
import com.javaweb.jobIT.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.util.Comparator;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class JobApplicationService {
    private final JobApplicationRepository jobApplicationRepository;
    private final JobPostRepository jobPostRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final UploadImageService uploadImageService;
    private final KafkaTemplate<String, String> kafkaTemplate;

    public ResumeEntity getLatestResume(UserEntity user) {
        return user.getResumes().stream()
                .max(Comparator.comparing(ResumeEntity::getUpdatedAt))
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found"));
    }

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
//    Ứng tuyển vào job
    @PreAuthorize("hasAnyRole('CANDIDATE','ADMIN')")
    public JobApplicationResponse applyJob(Long jobPostId){
        JobPostEntity jobPostEntity = jobPostRepository.findById(jobPostId).
                orElseThrow(() -> new ResourceNotFoundException("Job Not Found"));
        UserEntity user = getUser();
        if (user.getResumes().isEmpty()){
            throw new AppException(ErrorCode.NOT_FOUND_RESUME);
        }
        if (jobPostEntity.getEndDate() != null && jobPostEntity.getEndDate().isBefore(Instant.now())) {
            throw new AppException(ErrorCode.JOB_APPLICATION_EXPIRED);
        }
        JobApplicationEntity jobApplicationEntity = new JobApplicationEntity();
        jobApplicationEntity.setJobPost(jobPostEntity);
        jobApplicationEntity.setUser(user);
        jobApplicationEntity.setResume(getLatestResume(user));
        jobApplicationEntity.setStatusResume(ResumeStatusEnum.PENDING);
        jobApplicationEntity = jobApplicationRepository.save(jobApplicationEntity);

        kafkaTemplate.send("confirm-job-application-topic",String.format("email=%s,job=%s,company=%s,name=%s",user.getEmail(),
                jobPostEntity.getTitle(),jobPostEntity.getCompany().getCompanyName(),user.getFullName()));
        return convertToJobApplicationResponse(jobApplicationEntity);
    }
    private JobApplicationResponse convertToJobApplicationResponse(JobApplicationEntity jobApplicationEntity) {
        return JobApplicationResponse.builder()
                .id(jobApplicationEntity.getId())
                .user(modelMapper.map(jobApplicationEntity.getUser(), UserResponse.class))
                .statusResume(jobApplicationEntity.getStatusResume())
                .interviews(jobApplicationEntity.getInterviews().stream()
                    .map(interview -> modelMapper.map(interview, InterviewResponse.class))
                    .collect(Collectors.toList()))
                .resume(modelMapper.map(jobApplicationEntity.getResume(), ResumeResponse.class))
                .build();
    }

//    Lấy danh sách ứng tuyển của một người dùng
    @PreAuthorize("hasAnyRole('CANDIDATE','ADMIN')")
    public PageJobApplication getApplicationsByUser(int page, int size) {
        Pageable pageable = PageRequest.of(page,size);
        UserEntity user = getUser();
        Page<JobApplicationEntity> listApplication = jobApplicationRepository.findByUser(user,pageable);
        Page<JobApplicationResponse> result = listApplication.map(this::convertToJobApplicationResponse);
        return PageJobApplication.builder()
                .content(result.getContent())
                .page(result.getNumber())
                .size(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .build();
    }

//    Lấy danh sách ứng tuyển của một công việc (Người đăng mới xem được)
    @PreAuthorize("hasAnyRole('EMPLOYER','ADMIN')")
    public PageJobApplication getApplicationsByJobPost(Long jobPostId, int page, int size) {
        Pageable pageable = PageRequest.of(page,size);
        JobPostEntity jobPostEntity = jobPostRepository.findById(jobPostId).orElseThrow(() -> new ResourceNotFoundException("Job Not Found"));

        UserEntity user = getUser();
        if (!jobPostEntity.getCreatedBy().equals(user.getUsername()) && checkRoleAdmin()) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        Page<JobApplicationEntity> listApplication = jobApplicationRepository.findByJobPost_Id(jobPostId,pageable);
        Page<JobApplicationResponse> result = listApplication.map(this::convertToJobApplicationResponse);
        return PageJobApplication.builder()
                .content(result.getContent())
                .page(result.getNumber())
                .size(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .build();
    }

//    Xem chi tiết một đơn ứng tuyển (Người đăng mới xem được)
    @PreAuthorize("hasAnyRole('EMPLOYER','ADMIN')")
    public JobApplicationResponse getApplicationById(Long jobPostId, Long applicationId) {
        JobApplicationEntity jobApplication = jobApplicationRepository.findByIdAndJobPost_Id(applicationId, jobPostId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Application with ID %d not found in job post ID %d", applicationId, jobPostId)));
        UserEntity user = getUser();
        if (!jobApplication.getJobPost().getCreatedBy().equals(user.getUsername()) && checkRoleAdmin()) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        return convertToJobApplicationResponse(jobApplication);
    }

//    Cập nhật nếu trạng thái đang chờ
    @PreAuthorize("hasAnyRole('ADMIN','CANDIDATE')")
    public JobApplicationResponse updateJobApplication(Long jobPostId, Long applicationId, MultipartFile file) throws IOException {
        JobApplicationEntity jobApplication = jobApplicationRepository.findByIdAndJobPost_Id(applicationId, jobPostId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Application with ID %d not found in job post ID %d", applicationId, jobPostId)));

        UserEntity user = getUser();
        if (!user.getEmail().equals(jobApplication.getUser().getEmail()) && checkRoleAdmin()) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        if (!jobApplication.getStatusResume().equals(ResumeStatusEnum.PENDING)) throw new AppException(ErrorCode.NOT_UPDATE);

        ResumeEntity resume = jobApplication.getResume();
        resume.setResumeUrl(uploadImageService.uploadImage(file));
        jobApplication.setResume(resume);

        return convertToJobApplicationResponse(jobApplicationRepository.save(jobApplication));
    }

//    Cập nhật trạng thái đơn ứng tuyển (Người đăng mới xem được)
    @PreAuthorize("hasAnyRole('EMPLOYER','ADMIN')")
    public UpdateStatusResponse updateApplicationStatus(Long jobPostId, Long applicationId, UpdateStatusRequest request) {
        JobApplicationEntity application = jobApplicationRepository.findByIdAndJobPostId(applicationId, jobPostId)
                .orElseThrow(() -> new ResourceNotFoundException("Job application not found for this job post"));

        UserEntity user = getUser();
        if (!application.getJobPost().getCreatedBy().equals(user.getUsername()) && checkRoleAdmin()) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        // Cập nhật trạng thái đơn ứng tuyển
        application.setStatusResume(request.getStatusResume());
        jobApplicationRepository.save(application);
        application = jobApplicationRepository.save(application);

        return UpdateStatusResponse.builder()
                .statusResume(application.getStatusResume())
                .build();
    }

//    Xóa đơn ứng tuyển
    @PreAuthorize("hasAnyRole('EMPLOYER','ADMIN','CANDIDATE')")
    public String deleteApplication(Long jobPostId, Long applicationId) {
        if (!jobApplicationRepository.existsByIdAndJobPost_Id(applicationId,jobPostId)) {
            throw new RuntimeException("Job application not found in job");
        }
        JobApplicationEntity application = jobApplicationRepository.findByIdAndJobPostId(applicationId, jobPostId)
                .orElseThrow(() -> new ResourceNotFoundException("Job application not found for this job post"));

        UserEntity user = getUser();
        if (!application.getJobPost().getCreatedBy().equals(user.getUsername()) && checkRoleAdmin()) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        jobApplicationRepository.deleteById(applicationId);
        return "Job application deleted";
    }
}

