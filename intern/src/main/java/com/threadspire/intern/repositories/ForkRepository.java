package com.threadspire.intern.repositories;

import com.threadspire.intern.models.Fork;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ForkRepository extends JpaRepository<Fork, Long> {
}
