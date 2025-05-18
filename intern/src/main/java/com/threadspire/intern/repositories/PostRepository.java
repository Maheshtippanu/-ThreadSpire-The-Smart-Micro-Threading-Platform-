package com.threadspire.intern.repositories;


import com.threadspire.intern.models.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
}

