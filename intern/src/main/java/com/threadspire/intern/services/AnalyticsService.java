package com.threadspire.intern.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    public Map<String, Object> getAnalyticsForUser(Long userId) {
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("threadsCreated", 5);
        analytics.put("bookmarksReceived", 12);
        analytics.put("reactions", Map.of("💡", 7, "🔥", 3));
        analytics.put("mostForkedThread", "Thread ID 102");
        analytics.put("activityGraph", List.of(2, 3, 5, 1, 0, 4));
        return analytics;
    }
}
