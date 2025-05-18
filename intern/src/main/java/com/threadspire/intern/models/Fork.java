package com.threadspire.intern.models;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "forks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Fork {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private Thread originalThread;

    @ManyToOne
    private Thread forkedThread;
}
