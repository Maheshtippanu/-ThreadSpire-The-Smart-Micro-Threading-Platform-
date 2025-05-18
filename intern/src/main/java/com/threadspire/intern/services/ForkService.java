package com.threadspire.intern.services;

import com.threadspire.intern.dto.ForkThreadRequest;
import com.threadspire.intern.models.Fork;
import com.threadspire.intern.models.Thread;
import com.threadspire.intern.models.User;
import com.threadspire.intern.repositories.ForkRepository;
import com.threadspire.intern.repositories.ThreadRepository;
import com.threadspire.intern.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ForkService {
    private final ForkRepository forkRepository;
    private final ThreadRepository threadRepository;
    private final UserRepository userRepository;

    public Thread forkThread(Long userId, ForkThreadRequest request) {
        User user = userRepository.findById(userId).orElseThrow();
        Thread original = threadRepository.findById(request.getThreadId()).orElseThrow();

        // Create new thread as a fork
        Thread forked = new Thread();
        forked.setTitle(original.getTitle() + " (Fork)");
        forked.setUser(user);
        forked.setPublished(false);
        forked.setPosts(original.getPosts());
        forked.setTags(original.getTags());

        Thread savedFork = threadRepository.save(forked);

        Fork fork = new Fork();
        fork.setUser(user);
        fork.setOriginalThread(original);
        fork.setForkedThread(savedFork);
        forkRepository.save(fork);

        original.setForkCount(original.getForkCount() + 1);
        threadRepository.save(original);

        return savedFork;
    }
}
