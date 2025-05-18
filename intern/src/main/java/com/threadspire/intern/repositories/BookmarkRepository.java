package com.threadspire.intern.repositories;
import com.threadspire.intern.models.Bookmark;

import com.threadspire.intern.models.User;
import com.threadspire.intern.models.Thread;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    Optional<Bookmark> findByUserAndThread(User user, Thread thread);
    List<Bookmark> findByUser(User user);
}
