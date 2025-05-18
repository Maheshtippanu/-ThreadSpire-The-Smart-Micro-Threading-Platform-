package com.threadspire.intern.controllers;

import com.threadspire.intern.dto.ForkThreadRequest;
import com.threadspire.intern.models.Thread;
import com.threadspire.intern.services.ForkService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/forks")
@RequiredArgsConstructor
public class ForkController {
    private final ForkService forkService;

    @PostMapping
    public ResponseEntity<Thread> forkThread(@RequestParam Long userId, @RequestBody ForkThreadRequest request) {
        Thread forkedThread = forkService.forkThread(userId, request);
        return ResponseEntity.ok(forkedThread);
    }
}
