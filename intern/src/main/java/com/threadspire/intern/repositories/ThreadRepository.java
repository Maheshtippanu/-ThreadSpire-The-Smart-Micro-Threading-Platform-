package com.threadspire.intern.repositories;
import com.threadspire.intern.models.Thread;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ThreadRepository extends JpaRepository<Thread, Long> {
}
