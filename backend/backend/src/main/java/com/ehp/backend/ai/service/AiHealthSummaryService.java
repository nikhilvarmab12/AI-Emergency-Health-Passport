package com.ehp.backend.ai.service;

import com.ehp.backend.ai.dto.AiHealthSummaryResponse;

public interface AiHealthSummaryService {

    AiHealthSummaryResponse generateHealthSummary(
            String email
    );
}