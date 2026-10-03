package com.ehp.backend.emergency.repository;

import com.ehp.backend.emergency.entity.EmergencyAccessLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmergencyAccessLogRepository
        extends JpaRepository<EmergencyAccessLog, Long> {

    List<EmergencyAccessLog> findByUserEmailOrderByAccessedAtDesc(
            String email
    );
}