package com.javaweb.jobIT.dto.response.chat;

import com.javaweb.jobIT.dto.request.chat.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatHistoryResponse {
    private List<ChatMessage> history;
}
