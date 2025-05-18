package com.threadspire.intern.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "bookmarks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Bookmark {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private Thread thread;

    private boolean isPrivate = true;
}
