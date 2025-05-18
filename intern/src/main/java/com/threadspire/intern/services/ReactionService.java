package com.threadspire.intern.services;


import com.threadspire.intern.dto.ReactionRequest;
import com.threadspire.intern.models.Post;
import com.threadspire.intern.models.Reaction;
import com.threadspire.intern.models.ReactionType;
import com.threadspire.intern.models.User;
import com.threadspire.intern.repositories.ReactionRepository;
import com.threadspire.intern.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReactionService {

    private final ReactionRepository reactionRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public List<Reaction> findAll() {
        return reactionRepository.findAll();
    }

    public Reaction save(Reaction reaction) {
        return reactionRepository.save(reaction);
    }
    public Reaction addReaction(Long userId, ReactionRequest request) {
        User user = userRepository.findById(userId).orElseThrow();
        Post post = postRepository.findById(request.getPostId()).orElseThrow();

        // Check if user already reacted
        if (reactionRepository.findByUserAndPost(user, post).isPresent()) {
            throw new RuntimeException("User has already reacted to this post");
        }

        Reaction reaction = new Reaction();
        reaction.setUser(user);
        reaction.setPost(post);
       // reaction.setType(ReactionType.valueOf(request.getReactionType()));
        return reactionRepository.save(reaction);
    }
}

