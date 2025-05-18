package com.threadspire.intern.services;


import com.threadspire.intern.models.Thread;
import com.threadspire.intern.repositories.ThreadRepository;

import com.threadspire.intern.dto.CreateThreadRequest;
import com.threadspire.intern.models.*;
import com.threadspire.intern.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ThreadService {
    private final ThreadRepository threadRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;

    @Transactional
    public Thread createThread(CreateThreadRequest request, Long userId) {
        User user = userRepository.findById(userId).orElseThrow();

        Thread thread = new Thread();
        thread.setTitle(request.getTitle());
        thread.setUser(user);
        thread.setPublished(request.isPublished());

        // Save thread first to get ID for posts
        thread = threadRepository.save(thread);

        List<Post> posts = new ArrayList<>();
        int position = 0;
        for (String content : request.getSegments()) {
            Post post = new Post();
            post.setContent(content);
            post.setPosition(position++);
            post.setThread(thread);
            posts.add(post);
        }
        postRepository.saveAll(posts);
        thread.setPosts(posts);

        // Handle tags
        Set<Tag> tags = request.getTags() == null ? Set.of() :
                request.getTags().stream()
                        .map(name -> tagRepository.findByName(name).orElseGet(() -> {
                            Tag t = new Tag();
                            t.setName(name);
                            return tagRepository.save(t);
                        }))
                        .collect(Collectors.toSet());
        thread.setTags(tags);

        return threadRepository.save(thread);
    }

    public List<Thread> getAllThreads() {
        return threadRepository.findAll();
    }

    public Optional<Thread> findById(Long id) {
        return threadRepository.findById(id);
    }

    // Add update, delete, fetch by tag, etc.
}
