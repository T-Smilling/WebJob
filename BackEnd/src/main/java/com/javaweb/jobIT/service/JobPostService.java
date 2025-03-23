package com.javaweb.jobIT.service;

import com.javaweb.jobIT.dto.request.job.JobPostRequest;
import com.javaweb.jobIT.dto.request.job.JobPostSpecification;
import com.javaweb.jobIT.dto.request.job.JobPostUpdateRequest;
import com.javaweb.jobIT.dto.request.job.JobSearchCriteria;
import com.javaweb.jobIT.dto.response.company.CheckPermissionResponse;
import com.javaweb.jobIT.dto.response.jobpost.JobPostResponse;
import com.javaweb.jobIT.dto.response.jobpost.PageJobPost;
import com.javaweb.jobIT.dto.response.skill.SkillResponse;
import com.javaweb.jobIT.entity.CompanyEntity;
import com.javaweb.jobIT.entity.JobPostEntity;
import com.javaweb.jobIT.entity.SkillEntity;
import com.javaweb.jobIT.entity.UserEntity;
import com.javaweb.jobIT.exception.AppException;
import com.javaweb.jobIT.exception.ErrorCode;
import com.javaweb.jobIT.exception.ResourceNotFoundException;
import com.javaweb.jobIT.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class JobPostService {
    private final JobPostRepository jobPostRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final SubscriberRepository subscriberRepository;
    private final SkillRepository skillRepository;
    private final ModelMapper modelMapper;
    private final CompanyRepository companyRepository;
    private final CompanyService companyService;
    private final UserRepository userRepository;

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

    public PageJobPost searchJobs(JobSearchCriteria criteria, int page, int size){
        JobPostSpecification specification = new JobPostSpecification(criteria);
        Pageable pageable = PageRequest.of(page,size);
        Page<JobPostResponse> result = jobPostRepository.findAll(specification,pageable).map(this::convertJobPostResponse);
        return PageJobPost.builder()
                .content(result.getContent())
                .page(result.getNumber())
                .size(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .build();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYER')")
    public JobPostResponse createJob(String companyId,JobPostRequest request){

        if (request.getCreateJobSkills() == null) {
            throw new IllegalArgumentException("Required skills must not be null");
        }
        CompanyEntity company = companyRepository.findById(Long.valueOf(companyId)).orElseThrow(() -> new ResourceNotFoundException("Company not found"));
        JobPostEntity jobPostEntity = modelMapper.map(request, JobPostEntity.class);
        UserEntity user = getUser();
        String userEmail = user.getEmail();
        boolean isEmployee = company.getEmployees().stream()
                .anyMatch(employee -> employee.getEmail().equals(userEmail));

        if (!isEmployee && checkRoleAdmin()) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        List<SkillEntity> newSkills = request.getCreateJobSkills().stream()
                .map(skillDto -> skillRepository.findFirstByName(skillDto.getName())
                        .orElseGet(() -> {
                            SkillEntity newSkill = new SkillEntity();
                            newSkill.setName(skillDto.getName());
                            return newSkill;
                        }))
                .toList();

        Set<SkillEntity> needSkills = new HashSet<>(newSkills);

        jobPostEntity.setRequiredSkills(new ArrayList<>(needSkills));
        jobPostEntity.setActive(true);

        jobPostEntity.setCompany(company);

        return convertJobPostResponse(jobPostRepository.save(jobPostEntity));
    }

    private JobPostResponse convertJobPostResponse(JobPostEntity jobPostEntity){
        JobPostResponse jobPostResponse = modelMapper.map(jobPostEntity, JobPostResponse.class);
        jobPostResponse.setNumberOfJobApplications(jobApplicationRepository.countJobApplicationsByJobPostId(jobPostEntity.getId()));
        jobPostResponse.setNumberOfSubscribers(subscriberRepository.countSubscribersByJobPostId(jobPostEntity.getId()));
        jobPostResponse.setCompany(companyService.getCompanyForJob(jobPostEntity.getCompany().getId()));
        jobPostResponse.setRequiredSkills(getSkillByJobId(jobPostEntity.getId()));
        return jobPostResponse;
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYER')")
    public JobPostResponse updateInfoJob(Long id, JobPostUpdateRequest request){
        JobPostEntity jobPostEntity = jobPostRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Job post not found"));
        modelMapper.map(request, jobPostEntity);

        UserEntity user = getUser();
        if (!jobPostEntity.getCreatedBy().equals(user.getUsername()) && checkRoleAdmin()) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        List<SkillEntity> newSkills = request.getUpdateSkills().stream()
                .map(skillDto -> skillRepository.findFirstByName(skillDto.getName())
                        .orElseGet(() -> {
                            SkillEntity newSkill = new SkillEntity();
                            newSkill.setName(skillDto.getName());
                            return newSkill;
                        }))
                .toList();

        Set<SkillEntity> updatedSkills = new HashSet<>(jobPostEntity.getRequiredSkills());
        updatedSkills.addAll(newSkills);

        jobPostEntity.setRequiredSkills(new ArrayList<>(updatedSkills));

        return convertJobPostResponse(jobPostRepository.save(jobPostEntity));
    }

    public PageJobPost getAllJobPost(int page, int size){
        Pageable pageable = PageRequest.of(page,size);
        Page<JobPostResponse> result = jobPostRepository.findAll(pageable).map(this::convertJobPostResponse);
        return PageJobPost.builder()
                .content(result.getContent())
                .page(result.getNumber())
                .size(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .build();
    }
    public List<JobPostResponse> findTop10Job(){
        List<JobPostEntity> jobPostEntities = jobPostRepository.findTop10ByOrderBySalaryDesc();
        return jobPostEntities.stream().map(this::convertJobPostResponse).toList();
    }
    private List<SkillResponse> getSkillByJobId(Long id){
        JobPostEntity jobPostEntity = jobPostRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        return jobPostEntity.getRequiredSkills().stream().map(skill ->
                modelMapper.map(skill,SkillResponse.class)
        ).collect(Collectors.toList());
    }

    public List<String> findAllCity(){
        return jobPostRepository.findAllCities();
    }

    public JobPostResponse getJobPostById(Long id){
        JobPostEntity jobPostEntity = jobPostRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        return convertJobPostResponse(jobPostEntity);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYER')")
    public String deleteJobPostById(Long id){
        JobPostEntity jobPostEntity = jobPostRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        UserEntity user = getUser();
        if (!jobPostEntity.getCreatedBy().equals(user.getUsername()) && checkRoleAdmin()) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        jobPostRepository.deleteById(id);
        return "Delete successful";
    }

    public List<SkillResponse> findAllSkill() {
        List<SkillEntity> skillEntities = skillRepository.findAll();
        return skillEntities.stream().map(skill ->
                modelMapper.map(skill,SkillResponse.class)).toList();
    }
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYER','CANDIDATE')")
    public CheckPermissionResponse checkPermission(Long jobId) {
        UserEntity user = getUser();
        JobPostEntity jobPostEntity = jobPostRepository.findById(jobId).orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        boolean isEmployee = false;
        String userName = user.getUsername();
        if (checkRoleAdmin() && jobPostEntity.getCreatedBy().equals(userName)) {
            isEmployee = true;
        }
        return CheckPermissionResponse.builder()
                .isEmployee(isEmployee)
                .build();
    }
}
