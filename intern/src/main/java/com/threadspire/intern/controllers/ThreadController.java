package com.threadspire.intern.controllers;

import com.threadspire.intern.dto.CreateThreadRequest;
import com.threadspire.intern.models.Thread;
import com.threadspire.intern.services.ThreadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/threads")
@RequiredArgsConstructor
public class ThreadController {
    private final ThreadService threadService;

    @PostMapping
    public ResponseEntity<Thread> createThread(@RequestBody CreateThreadRequest request, @RequestParam Long userId) {
        Thread createdThread = threadService.createThread(request, userId);
        return ResponseEntity.ok(createdThread);
    }

    @GetMapping
    public ResponseEntity<List<Thread>> getAllThreads() {
        return ResponseEntity.ok(threadService.getAllThreads());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Thread> getThreadById(@PathVariable Long id) {
        return threadService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
