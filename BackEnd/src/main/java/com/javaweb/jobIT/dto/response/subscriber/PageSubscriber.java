package com.javaweb.jobIT.dto.response.subscriber;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PageSubscriber {
    private List<SubscriberResponse> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
}