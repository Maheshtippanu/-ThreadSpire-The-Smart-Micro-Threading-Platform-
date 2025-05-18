package com.threadspire.intern.controllers;

import com.threadspire.intern.dto.ReactionRequest;
import com.threadspire.intern.models.Reaction;
import com.threadspire.intern.services.ReactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reactions")
@RequiredArgsConstructor
public class ReactionController {

    private final ReactionService reactionService;

    @GetMapping
    public ResponseEntity<List<Reaction>> getAllReactions() {
        return ResponseEntity.ok(reactionService.findAll());
    }

    @PostMapping("/create")
    public ResponseEntity<Reaction> createReaction(@RequestBody Reaction reaction) {
        return ResponseEntity.ok(reactionService.save(reaction));
    }

    @PostMapping("/add")
    public ResponseEntity<Reaction> addReaction(@RequestParam Long userId, @RequestBody ReactionRequest request) {
        Reaction reaction = reactionService.addReaction(userId, request);
        return ResponseEntity.ok(reaction);
    }
}

