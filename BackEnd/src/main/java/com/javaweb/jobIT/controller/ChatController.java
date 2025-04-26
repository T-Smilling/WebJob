package com.javaweb.jobIT.controller;

import com.javaweb.jobIT.dto.request.chat.ChatMessage;
import com.javaweb.jobIT.dto.request.chat.ChatMessageRequest;
import com.javaweb.jobIT.dto.response.ApiResponse;
import com.javaweb.jobIT.dto.response.chat.ChatHistoryResponse;
import com.javaweb.jobIT.dto.response.chat.ChatMessageResponse;
import com.javaweb.jobIT.service.GeminiService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatController {
    private final GeminiService geminiService;
    private static final String CHAT_HISTORY_KEY = "chatHistory";

    @PostMapping("/send")
    public ApiResponse<ChatMessageResponse> sendMessage(@Valid @RequestBody ChatMessageRequest request, HttpSession session) {
        String message = request.getMessage();

        // Lấy lịch sử chat từ session
        @SuppressWarnings("unchecked")
        List<ChatMessage> chatHistory = (List<ChatMessage>) session.getAttribute(CHAT_HISTORY_KEY);

        // Tạo lịch sử chat mới nếu chưa có
        if (chatHistory == null) {
            chatHistory = new ArrayList<>();
        }

        // Gửi tin nhắn đến Gemini API
        String aiResponse = geminiService.generateResponse(chatHistory, message);

        // Lưu tin nhắn người dùng và AI vào lịch sử
        chatHistory.add(new ChatMessage("user", message));
        chatHistory.add(new ChatMessage("model", aiResponse));

        // Giới hạn kích thước lịch sử chat
        if (chatHistory.size() > 100) {
            chatHistory = new ArrayList<>(chatHistory.subList(chatHistory.size() - 100, chatHistory.size()));
        }

        // Cập nhật lịch sử trong session
        session.setAttribute(CHAT_HISTORY_KEY, chatHistory);

        return ApiResponse.<ChatMessageResponse>builder()
                .result(new ChatMessageResponse(aiResponse))
                .message("Send message successfully")
                .build();
    }

    @DeleteMapping("/clear")
    public ApiResponse<String> clearChatHistory(HttpSession session) {
        // Xóa lịch sử chat
        session.removeAttribute(CHAT_HISTORY_KEY);
        return ApiResponse.<String>builder()
                .message("Clear chat history successfully")
                .build();
    }

    @GetMapping("/history")
    public ApiResponse<ChatHistoryResponse> getChatHistory(HttpSession session) {
        // Lấy lịch sử chat từ session
        @SuppressWarnings("unchecked")
        List<ChatMessage> chatHistory = (List<ChatMessage>) session.getAttribute(CHAT_HISTORY_KEY);

        if (chatHistory == null) {
            chatHistory = new ArrayList<>();
        }

        return ApiResponse.<ChatHistoryResponse>builder()
                .result(new ChatHistoryResponse(chatHistory))
                .message("Get chat history successfully")
                .build();
    }
}