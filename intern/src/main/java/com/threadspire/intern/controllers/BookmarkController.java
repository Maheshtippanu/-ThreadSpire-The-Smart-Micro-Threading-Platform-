package com.threadspire.intern.controllers;
import com.threadspire.intern.models.Bookmark;
import com.threadspire.intern.services.BookmarkService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
public class BookmarkController {

    private final BookmarkService bookmarkService;

    @PostMapping
    public ResponseEntity<Bookmark> addBookmark(@RequestParam Long userId, @RequestParam Long threadId) {
        Bookmark bookmark = bookmarkService.addBookmark(userId, threadId);
        return ResponseEntity.ok(bookmark);
    }

    @GetMapping
    public ResponseEntity<List<Bookmark>> getBookmarks(@RequestParam Long userId) {
        return ResponseEntity.ok(bookmarkService.getBookmarksForUser(userId));
    }
}