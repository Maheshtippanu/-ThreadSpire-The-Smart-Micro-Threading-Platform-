package com.threadspire.intern.services;

import com.threadspire.intern.models.Bookmark;
import com.threadspire.intern.models.Thread;
import com.threadspire.intern.models.User;
import com.threadspire.intern.repositories.BookmarkRepository;
import com.threadspire.intern.repositories.ThreadRepository;
import com.threadspire.intern.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookmarkService {
    private final BookmarkRepository bookmarkRepository;
    private final UserRepository userRepository;
    private final ThreadRepository threadRepository;

    public Bookmark addBookmark(Long userId, Long threadId) {
        User user = userRepository.findById(userId).orElseThrow();
        Thread thread = threadRepository.findById(threadId).orElseThrow();

        Bookmark bookmark = new Bookmark();
        bookmark.setUser(user);
        bookmark.setThread(thread);
        bookmark.setPrivate(true);
        return bookmarkRepository.save(bookmark);
    }

    public List<Bookmark> getBookmarksForUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return bookmarkRepository.findByUser(user);
    }
}