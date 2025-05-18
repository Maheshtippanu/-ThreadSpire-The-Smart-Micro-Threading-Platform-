package com.threadspire.intern.controllers;

import com.threadspire.intern.services.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserAnalytics(@PathVariable Long userId) {
        return ResponseEntity.ok(analyticsService.getAnalyticsForUser(userId));
    }
}
