package com.threadspire.intern.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String name;

    // Relations
    @OneToMany(mappedBy = "user")
    private Set<Thread> threads;

    @OneToMany(mappedBy = "user")
    private Set<Bookmark> bookmarks;

    @OneToMany(mappedBy = "user")
    private Set<Collection> collections;
}
