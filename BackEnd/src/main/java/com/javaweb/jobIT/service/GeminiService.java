package com.javaweb.jobIT.service;

import com.javaweb.jobIT.dto.request.chat.ChatMessage;
import com.javaweb.jobIT.entity.JobPostEntity;
import com.javaweb.jobIT.repository.JobPostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class GeminiService {
    private final JobPostRepository jobPostRepository;
    @Value("${spring.data.gemini.api-key}")
    private String apiKey;

    @Value("${spring.data.gemini.api-url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public String generateResponse(List<ChatMessage> messages, String userMessage) {
        List<JobPostEntity> jobs = getJobsBasedOnMessage(userMessage);
        if (jobs != null && !jobs.isEmpty()) {
            String formattedJobs = formatJobsToText(jobs);
            userMessage += "\nDưới đây là dữ liệu công việc liên quan:\n" + formattedJobs;
        }
        boolean isJobSearch = isJobSearchQuery(userMessage);

        // Nếu là truy vấn tìm kiếm công việc và không tìm thấy công việc
        if (isJobSearch && (jobs == null || jobs.isEmpty())) {
            return "Không tìm thấy công việc nào phù hợp.";
        }
        
        // Tạo danh sách tin nhắn mới với tin nhắn người dùng
        List<ChatMessage> updatedMessages = new ArrayList<>(messages);
        updatedMessages.add(new ChatMessage("user", userMessage));

        // Chuẩn bị dữ liệu gửi đến Gemini API
        Map<String, Object> requestBody = Map.of(
                "contents", convertMessagesToContents(updatedMessages)
        );

        // Thiết lập headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Thêm API key vào URL
        String url = UriComponentsBuilder.fromHttpUrl(apiUrl)
                .queryParam("key", apiKey)
                .toUriString();

        // Gửi request đến Gemini API
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        Map response = restTemplate.postForObject(url, entity, Map.class);

        // Xử lý response
        return extractResponseText(response);
    }

    private boolean isJobSearchQuery(String userMessage) {
        return userMessage.contains("lương cao") ||
                userMessage.contains("cao nhất") ||
                userMessage.contains("hôm nay") ||
                userMessage.contains("mới nhất") ||
                userMessage.contains("công ty") ||
                userMessage.contains("công việc");
    }

    private List<Map<String, Object>> convertMessagesToContents(List<ChatMessage> messages) {
        List<Map<String, Object>> contents = new ArrayList<>();

        for (ChatMessage message : messages) {
            Map<String, Object> content = Map.of(
                    "role", message.getRole(),
                    "parts", List.of(Map.of("text", message.getContent()))
            );
            contents.add(content);
        }

        return contents;
    }

    private String extractResponseText(Map<String, Object> response) {
        try {
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            return (String) parts.get(0).get("text");
        } catch (Exception e) {
            return "Error extracting response text: " + e.getMessage();
        }
    }

    private List<JobPostEntity> getJobsBasedOnMessage(String userMessage) {
        String lower = userMessage.toLowerCase();

        if (lower.contains("lương cao") || lower.contains("cao nhất")) {
            return jobPostRepository.findTop10ByOrderBySalaryDesc();
        } else if (lower.contains("hôm nay") || lower.contains("mới nhất")) {
            ZonedDateTime now = ZonedDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));
            ZonedDateTime startOfDay = now.truncatedTo(ChronoUnit.DAYS);
            ZonedDateTime endOfDay = startOfDay.plusDays(1);

            Instant startInstant = startOfDay.toInstant();
            Instant endInstant = endOfDay.toInstant();
            return jobPostRepository.findTodayJobs(startInstant, endInstant);
        } else if (lower.contains("công ty")) {
            String companyName = extractCompanyName(userMessage);
            if (companyName != null) {
                return jobPostRepository.findByCompanyNameLike(companyName);
            }
        }

        return Collections.emptyList();
    }

    private String extractCompanyName(String userMessage) {
        int index = userMessage.indexOf("công ty");
        if (index != -1) {
            return userMessage.substring(index + 8).trim();
        }
        return null;
    }

    private String formatJobsToText(List<JobPostEntity> jobs) {
        StringBuilder sb = new StringBuilder();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        ZonedDateTime now = ZonedDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));

        sb.append("### 💼 Danh sách công việc phù hợp với yêu cầu:\n\n");

        int idx = 1;
        for (JobPostEntity job : jobs) {
            String jobUrl = "https://localhost:3000/jobs/" + job.getId();
            ZonedDateTime endDateZoned = job.getEndDate() != null
                    ? job.getEndDate().atZone(ZoneId.of("Asia/Ho_Chi_Minh"))
                    : null;
            String endDateStr = endDateZoned != null ? formatter.format(endDateZoned) : "Chưa xác định";
            String expiryNote = "";
            if (endDateZoned != null && endDateZoned.isBefore(now)) {
                expiryNote = " _(Đã hết hạn)_";
            }
            String salary = job.getSalary().toString();
            StringBuilder append = sb.append(idx++).append(". **").append(job.getTitle()).append("**\n")
                    .append("- 🏢 ").append(job.getCompany().getCompanyName()).append("\n")
                    .append("- 📍 ").append(job.getLocation()).append("\n")
                    .append("- 💰 ").append(String.format("%s", salary)).append(" VNĐ\n")
                    .append("- ⏰ Hạn nộp: ").append(endDateStr).append(expiryNote).append("\n")
                    .append("- 🔗 [Xem chi tiết](").append(jobUrl).append(")\n\n");
        }

        if (jobs.isEmpty()) {
            sb.append("Không tìm thấy công việc nào phù hợp.\n");
        } else {
            sb.append("> **Lưu ý:** Hãy kiểm tra kỹ ngày hết hạn và mô tả công việc trước khi ứng tuyển.\n");
        }
        return sb.toString();
    }
}