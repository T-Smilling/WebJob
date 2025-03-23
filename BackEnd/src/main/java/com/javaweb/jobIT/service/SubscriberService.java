package com.javaweb.jobIT.service;

import com.javaweb.jobIT.dto.request.subscriber.SubscriberRequest;
import com.javaweb.jobIT.dto.response.skill.SkillResponse;
import com.javaweb.jobIT.dto.response.subscriber.PageSubscriber;
import com.javaweb.jobIT.dto.response.subscriber.SubscriberResponse;
import com.javaweb.jobIT.entity.JobPostEntity;
import com.javaweb.jobIT.entity.SkillEntity;
import com.javaweb.jobIT.entity.SubscriberEntity;
import com.javaweb.jobIT.entity.UserEntity;
import com.javaweb.jobIT.exception.AppException;
import com.javaweb.jobIT.exception.ErrorCode;
import com.javaweb.jobIT.exception.ResourceNotFoundException;
import com.javaweb.jobIT.repository.JobPostRepository;
import com.javaweb.jobIT.repository.SkillRepository;
import com.javaweb.jobIT.repository.SubscriberRepository;

import com.javaweb.jobIT.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.concurrent.ConcurrentLinkedDeque;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class SubscriberService {
    private final SubscriberRepository subscriberRepository;
    private final JobPostRepository jobPostRepository;
    private final SkillRepository skillRepository;
    private final ModelMapper modelMapper;
    private final UserRepository userRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;

    @PreAuthorize("hasAnyRole('ADMIN','EMPLOYER')")
    @Async
    public String findSubscriberToSendMail(Long jobPostId) {
        JobPostEntity jobPostEntity = jobPostRepository.findById(jobPostId).orElseThrow(() -> new ResourceNotFoundException("Job Not Found"));

        UserEntity user = getUser();
        if (!jobPostEntity.getCreatedBy().equals(user.getUsername()) && checkRoleAdmin()) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        List<SubscriberEntity> subscriberEntities = jobPostEntity.getSubscribers();

        //Quản lý danh sách chờ
        ConcurrentLinkedDeque<String> messageQueue = new ConcurrentLinkedDeque<>();
        int batchSize = 1000;

        for (int i = 0; i < subscriberEntities.size(); i+=batchSize) {
            int end = Math.min(i+batchSize, subscriberEntities.size());
            List<SubscriberEntity> batch = subscriberEntities.subList(i, end);
            processBatch(batch, jobPostEntity, jobPostId, messageQueue);
        }
        for (SubscriberEntity subscriber : subscriberEntities) {
            kafkaTemplate.send("notification-job-topic",String.format("email=%s,jobTitle=%s,companyName=%s,jobPostId=%s,name=%s",
                    subscriber.getEmail(),jobPostEntity.getTitle(),jobPostEntity.getCompany().getCompanyName(),jobPostId.toString(),subscriber.getName()));
        }

        startConsumer(messageQueue);
        return "Send-mail successfully";
    }

    private void processBatch(List<SubscriberEntity> batch, JobPostEntity jobPostEntity, Long jobPostId, ConcurrentLinkedDeque<String> messagesQueue) {
        for (SubscriberEntity subscriber : batch) {
            String message = String.format("email=%s,jobTitle=%s,companyName=%s,jobPostId=%s,name=%s",
                    subscriber.getEmail(),jobPostEntity.getTitle(),jobPostEntity.getCompany().getCompanyName(),
                    jobPostId.toString(),subscriber.getName());
            messagesQueue.add(message);
        }
    }

    private void startConsumer(ConcurrentLinkedDeque<String> messageQueue) {
        ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
        scheduler.scheduleAtFixedRate(() -> {
            if (!messageQueue.isEmpty()) {
                String message = messageQueue.poll();
                if (message != null) {
                    kafkaTemplate.send("notification-job-topic", message)
                            .thenAccept(success -> log.info("Sent message: {}", message))
                            .exceptionally(failure -> {
                                log.error("Failed to send message: {}", failure.getMessage());
                                return null;
                            });
                } else {
                    scheduler.shutdown();
                }
            }
        }, 0, 1, TimeUnit.MILLISECONDS);
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

    private void setSkillForSubscriber(SubscriberRequest request,SubscriberEntity subscriberEntity){
        List<SkillEntity> newSkills = request.getUpdateSkills().stream()
                .map(skillDto -> skillRepository.findFirstByName(skillDto.getName())
                        .orElseGet(() -> {
                            SkillEntity newSkill = new SkillEntity();
                            newSkill.setName(skillDto.getName());
                            return skillRepository.save(newSkill);
                        }))
                .toList();

        Set<SkillEntity> updatedSkills = new HashSet<>(subscriberEntity.getSkills());
        updatedSkills.addAll(newSkills);

        subscriberEntity.setSkills(new ArrayList<>(updatedSkills));
    }

    public SubscriberResponse createSubscriber(Long jobPostId, SubscriberRequest request) {
        JobPostEntity jobPostEntity = jobPostRepository.findById(jobPostId).orElseThrow(() -> new ResourceNotFoundException("Job Not Found"));

        Optional<SubscriberEntity> existingSubscriber = subscriberRepository.findByEmailAndJobPost(request.getEmail(), jobPostEntity);
        SubscriberEntity subscriberEntity;

        if (existingSubscriber.isPresent()) {
            subscriberEntity = existingSubscriber.get();
        } else {
            subscriberEntity = modelMapper.map(request, SubscriberEntity.class);
            subscriberEntity.setJobPost(jobPostEntity);
            subscriberEntity.setSkills(new ArrayList<>());
            subscriberEntity = subscriberRepository.save(subscriberEntity);
        }

        setSkillForSubscriber(request, subscriberEntity);
        subscriberEntity = subscriberRepository.save(subscriberEntity);
        return getSubscriberResponse(subscriberEntity);
    }

    private SubscriberResponse getSubscriberResponse(SubscriberEntity subscriberEntity) {
        SubscriberResponse subscriberResponse = modelMapper.map(subscriberEntity, SubscriberResponse.class);
        subscriberResponse.setJobPostId(subscriberEntity.getJobPost().getId());
        subscriberResponse.setSkills(subscriberEntity.getSkills().stream().map(skill ->
                modelMapper.map(skill,SkillResponse.class)
        ).collect(Collectors.toList()));
        return subscriberResponse;
    }


    @PreAuthorize("hasAnyRole('ADMIN', 'CANDIDATE')")
    public SubscriberResponse updateSubscriber(Long jobId, Long subscriberId, SubscriberRequest request) {
        SubscriberEntity subscriberEntity = subscriberRepository.findByIdAndJobPost_Id(subscriberId,jobId).orElseThrow(() -> new ResourceNotFoundException("Subscriber Not Found"));

        subscriberEntity.setName(request.getName());
        subscriberEntity.setPhone(request.getPhone());
        subscriberEntity.setEmail(request.getEmail());

        setSkillForSubscriber(request, subscriberEntity);

        return getSubscriberResponse(subscriberRepository.save(subscriberEntity));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYER')")
    public PageSubscriber getAllSubscribersByJobId(Long id, int page, int size) {
        JobPostEntity jobPostEntity = jobPostRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Job Not Found"));

        UserEntity user = getUser();
        if (!jobPostEntity.getCreatedBy().equals(user.getUsername()) && checkRoleAdmin()) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        Pageable pageable = PageRequest.of(page,size, Sort.by("name").ascending());
        Page<SubscriberEntity> subscriberEntities = subscriberRepository.findByJobPost(jobPostEntity,pageable);
        Page<SubscriberResponse> result = subscriberEntities.map(this::getSubscriberResponse);

        return PageSubscriber.builder()
                .content(result.getContent())
                .page(result.getNumber())
                .size(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .build();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'CANDIDATE', 'EMPLOYER')")
    public String removeSubscriberFromJob(Long subscriberId, Long jobId) {
        JobPostEntity jobPost = jobPostRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        UserEntity user = getUser();
        if (!jobPost.getCreatedBy().equals(user.getUsername()) && checkRoleAdmin() && checkRoleCandidate()) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        jobPost.getSubscribers().removeIf(subscriber -> subscriber.getId().equals(subscriberId));
        jobPostRepository.save(jobPost);
        return "Delete success";
    }

    private boolean checkRoleCandidate() {
        return SecurityContextHolder.getContext().getAuthentication().getAuthorities()
                .stream().noneMatch(auth -> auth.getAuthority().equals("ROLE_CANDIDATE"));
    }
}
