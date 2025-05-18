package com.threadspire.intern.services;

import com.threadspire.intern.models.Collection;
import com.threadspire.intern.models.Thread;
import com.threadspire.intern.models.User;
import com.threadspire.intern.repositories.CollectionRepository;
import com.threadspire.intern.repositories.ThreadRepository;
import com.threadspire.intern.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CollectionService {
    private final CollectionRepository collectionRepository;
    private final UserRepository userRepository;
    private final ThreadRepository threadRepository;

    public Collection createCollection(Long userId, String name, List<Long> threadIds) {
        User user = userRepository.findById(userId).orElseThrow();

        Collection collection = new Collection();
        collection.setName(name);
        collection.setUser(user);

        Set<Thread> threads = new HashSet<>(threadRepository.findAllById(threadIds));
        collection.setThreads(threads);

        return collectionRepository.save(collection);
    }

    public List<Collection> getUserCollections(Long userId) {
        return collectionRepository.findByUserId(userId);
    }
}

