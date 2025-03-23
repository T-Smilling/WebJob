package com.javaweb.jobIT.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class MailService {
    private final SpringTemplateEngine templateEngine;
    private final JavaMailSender mailSender;

    @Value("${spring.mail.from}")
    private String emailFrom;

    @KafkaListener(topics = "confirm-account-topic", groupId = "confirm-account-group")
    public void sendConfirmLinkByKafka(String message) throws MessagingException, UnsupportedEncodingException {
        Map<String, String> data = parseMessage(message);
        String frontendUrl = "http://localhost:3000";
        String linkConfirm = frontendUrl + "/confirm-account/" + data.get("code");

        String subject = "Please confirm active your account";

        String templateName = "confirm-email.html";

        Map<String, Object> properties = new HashMap<>();
        properties.put("linkConfirm", linkConfirm);

        sendEmail(data.get("email"), subject, templateName, properties);
        log.info("Link has sent to user, email={}, linkConfirm={}", data.get("email"), linkConfirm);
    }

    @KafkaListener(topics = "confirm-forgot-password-topic", groupId = "confirm-account-group")
    public void sendConfirmLinkPasswordByKafka(String message) throws MessagingException, UnsupportedEncodingException {
        Map<String, String> data = parseMessage(message);
        String frontendUrl = "http://localhost:3000";
        String confirmLink = frontendUrl + "/change-password/" + data.get("code");
        String otp = data.get("otp");

        String subject = "Important Action Required - Update Your Account";

        String templateName = "confirm-reset-password.html";

        Map<String, Object> properties = new HashMap<>();
        properties.put("confirmLink", confirmLink);
        properties.put("otp", otp);
        properties.put("otpWarning", "Hãy nhớ mã OTP này và không chia sẻ cho bất kỳ ai");

        sendEmail(data.get("email"), subject, templateName, properties);
        log.info("Link has sent to user, email={}, confirmLink={}, otp={}", data.get("email"), confirmLink,otp);
    }

    @KafkaListener(topics = "confirm-job-application-topic", groupId = "confirm-account-group")
    public void sendConfirmApplicationByKafka(String message) throws MessagingException, UnsupportedEncodingException {
        Map<String, String> data = parseMessage(message);
        String linkCheck = "http://localhost:3000";
        String subject = "Chúc mừng! Bạn đã ứng tuyển thành công tại công ty [ " + data.get("company") + " ]";

        String templateName = "confirm-application.html";

        Map<String, Object> properties = new HashMap<>();
        properties.put("applicantName", data.get("name"));
        properties.put("companyName", data.get("company"));
        properties.put("jobTitle", data.get("job"));
        properties.put("linkCheck", linkCheck);

        sendEmail(data.get("email"), subject, templateName, properties);
    }

    @KafkaListener(topics = "confirm-job-interview-topic", groupId = "confirm-account-group")
    public void sendInterviewByKafka(String message) throws MessagingException, UnsupportedEncodingException {
        Map<String, String> data = parseMessage(message);

        String subject = "Thư mời phỏng vấn tại " + data.get("companyName") + " cho vị trí " + data.get("jobTitle");
        String templateName = "confirm-interview.html";

        Map<String, Object> properties = new HashMap<>();
        properties.put("interviewDate", data.get("interviewDate"));
        properties.put("interviewType", data.get("interviewType"));
        properties.put("companyName", data.get("companyName"));
        properties.put("jobTitle", data.get("jobTitle"));

        if ("Online".equalsIgnoreCase(data.get("interviewType"))) {
            properties.put("meetingLink", data.get("meetingLink"));
        } else {
            properties.put("location", data.get("location"));
        }

        sendEmail(data.get("email"), subject, templateName, properties);
    }

    @KafkaListener(topics = "notification-job-topic", groupId = "confirm-account-group")
    public void sendNotificationByKafka(String message) throws MessagingException, UnsupportedEncodingException {
        Map<String, String> data = parseMessage(message);

        String linkCheck = "http://localhost:3000/jobs/" + data.get("jobPostId");

        String subject = "Cơ hội nghề nghiệp tại " + data.get("companyName") + ": Bạn đã đủ điều kiện ứng tuyển vị trí " + data.get("jobTitle");
        String templateName = "notification.html";

        Map<String, Object> properties = new HashMap<>();
        properties.put("jobTitle", data.get("jobTitle"));
        properties.put("companyName", data.get("companyName"));
        properties.put("linkCheck", linkCheck);
        properties.put("name", data.get("name"));

        sendEmail(data.get("email"), subject, templateName, properties);
    }

    private Map<String, String> parseMessage(String message) {
        Map<String, String> data = new HashMap<>();
        String[] arr = message.split(",");
        for (String part : arr) {
            String[] keyValue = part.split("=");
            if (keyValue.length == 2) {
                data.put(keyValue[0].trim(), keyValue[1].trim());
            }
        }
        return data;
    }

    private void sendEmail(String emailTo, String subject, String template, Map<String, Object> properties) throws MessagingException, UnsupportedEncodingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());
        Context context = new Context();
        context.setVariables(properties);

        helper.setFrom(emailFrom, "Chu Thắng");
        helper.setTo(emailTo);
        helper.setSubject(subject);
        String html = templateEngine.process(template, context);
        helper.setText(html, true);
        mailSender.send(mimeMessage);
    }

}
