package com.ehp.backend.ai.service;

import com.ehp.backend.ai.dto.AiEmergencyRiskResponse;

public interface AiEmergencyRiskService {

    AiEmergencyRiskResponse generateEmergencyRiskAnalysis(
            String email
    );
}