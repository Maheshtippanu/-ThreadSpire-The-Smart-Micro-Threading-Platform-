package com.threadspire.intern.controllers;
import com.threadspire.intern.dto.CreateCollectionRequest;
import com.threadspire.intern.models.Collection;
import com.threadspire.intern.services.CollectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/collections")
@RequiredArgsConstructor
public class CollectionController {

    private final CollectionService collectionService;
    @PostMapping
    public ResponseEntity<Collection> createCollection(@RequestParam Long userId, @RequestBody CreateCollectionRequest request) {
        Collection collection = collectionService.createCollection(userId, request.getName(), request.getThreadIds());
        return ResponseEntity.ok(collection);
    }

    @GetMapping
    public ResponseEntity<List<Collection>> getUserCollections(@RequestParam Long userId) {
        return ResponseEntity.ok(collectionService.getUserCollections(userId));
    }
}

