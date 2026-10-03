package com.ehp.backend.emergency.entity;

import com.ehp.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "emergency_access_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmergencyAccessLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "user_id",
            nullable = false
    )
    private User user;

    @Column(nullable = false)
    private String accessType;

    @Column(nullable = false)
    private Boolean success;

    @Column(length = 128)
    private String token;

    @Column(nullable = false, updatable = false)
    private LocalDateTime accessedAt;

    @PrePersist
    public void onCreate() {
        accessedAt = LocalDateTime.now();
    }
}