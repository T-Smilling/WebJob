package com.javaweb.jobIT.service;

import com.javaweb.jobIT.dto.response.resume.PageResume;
import com.javaweb.jobIT.dto.response.resume.ResumeResponse;
import com.javaweb.jobIT.dto.response.user.UserResponse;
import com.javaweb.jobIT.entity.ResumeEntity;
import com.javaweb.jobIT.entity.UserEntity;
import com.javaweb.jobIT.exception.AppException;
import com.javaweb.jobIT.exception.ErrorCode;
import com.javaweb.jobIT.exception.InvalidFormatException;
import com.javaweb.jobIT.exception.ResourceNotFoundException;
import com.javaweb.jobIT.repository.JobApplicationRepository;
import com.javaweb.jobIT.repository.ResumeRepository;
import com.javaweb.jobIT.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ResumeService {
    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final UploadImageService uploadImageService;
    private final JobApplicationRepository jobApplicationRepository;

    @PreAuthorize("hasAnyRole('ADMIN', 'CANDIDATE', 'EMPLOYER')")
    // Tải lên hoặc cập nhật CV
    public ResumeResponse uploadResume(MultipartFile file) throws IOException {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        UserEntity user = userRepository.findByUsername(name).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        ResumeEntity resume = ResumeEntity.builder()
                .user(user)
                .resumeUrl(uploadImageService.uploadImage(file))
                .build();

        return modelMapper.map(resumeRepository.save(resume), ResumeResponse.class);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'CANDIDATE', 'EMPLOYER')")
    // Lấy danh sách CV của một người dùng
    public PageResume getResumesByUser(int page, int size) {
        Pageable pageable = PageRequest.of(page,size);
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        UserEntity user = userRepository.findByUsername(name).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        Page<ResumeEntity> resumes = resumeRepository.findByUser(user,pageable);
        Page<ResumeResponse> result = resumes.map(resume -> modelMapper.map(resume, ResumeResponse.class));
        return PageResume.builder()
                .content(result.getContent())
                .page(result.getNumber())
                .size(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .build();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'CANDIDATE', 'EMPLOYER')")
    // Lấy chi tiết một CV
    public ResumeResponse getResumeById(Long resumeId) {
        ResumeEntity resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found"));

        return modelMapper.map(resume, ResumeResponse.class);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'CANDIDATE', 'EMPLOYER')")
    // Xóa CV
    public String deleteResume(Long resumeId) {
        if (!resumeRepository.existsById(resumeId)) {
            throw new ResourceNotFoundException("Resume not found");
        }
        if (jobApplicationRepository.existsByResumeId(resumeId)) {
            throw new InvalidFormatException("Không thể xóa CV vì đã được sử dụng trong đơn ứng tuyển.");
        }
        resumeRepository.deleteById(resumeId);
        return "Resume deleted successfully";
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'CANDIDATE', 'EMPLOYER')")
    public ResumeResponse getLatestResume() {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        UserEntity user = userRepository.findByUsername(name).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return user.getResumes().stream()
                .max(Comparator.comparing(ResumeEntity::getUpdatedAt))
                .map(resume -> modelMapper.map(resume, ResumeResponse.class))
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found"));
    }
}
