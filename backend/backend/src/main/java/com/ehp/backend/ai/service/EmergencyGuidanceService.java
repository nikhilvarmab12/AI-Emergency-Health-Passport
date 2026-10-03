package com.ehp.backend.ai.service;

import com.ehp.backend.ai.dto.EmergencyGuidanceResponse;

public interface EmergencyGuidanceService {

    EmergencyGuidanceResponse generateEmergencyGuidance(
            String email
    );
}