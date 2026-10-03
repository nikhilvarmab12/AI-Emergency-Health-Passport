package com.ehp.backend.emergency.repository;

import com.ehp.backend.emergency.entity.EmergencyAccessToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface EmergencyAccessTokenRepository
        extends JpaRepository<EmergencyAccessToken, Long> {

    Optional<EmergencyAccessToken> findByUserId(Long userId);

    Optional<EmergencyAccessToken> findByTokenAndActiveTrue(String token);

    boolean existsByUserId(Long userId);
    Optional<EmergencyAccessToken>
    findByTokenAndActiveTrueAndExpiresAtAfter(
            String token,
            LocalDateTime now
    );
}