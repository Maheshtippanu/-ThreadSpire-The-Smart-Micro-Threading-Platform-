package com.threadspire.intern.repositories;

import com.threadspire.intern.models.Reaction;
import com.threadspire.intern.models.Post;
import com.threadspire.intern.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ReactionRepository extends JpaRepository<Reaction, Long> {
    Optional<Reaction> findByUserAndPost(User user, Post post);
}

