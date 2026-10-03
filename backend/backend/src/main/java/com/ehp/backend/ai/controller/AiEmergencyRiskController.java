package com.ehp.backend.ai.controller;

import com.ehp.backend.ai.dto.AiEmergencyRiskResponse;
import com.ehp.backend.ai.service.AiEmergencyRiskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AiEmergencyRiskController {

    private final AiEmergencyRiskService aiEmergencyRiskService;

    @GetMapping("/emergency-risk")
    public ResponseEntity<AiEmergencyRiskResponse>
    generateEmergencyRiskAnalysis(
            Authentication authentication
    ) {

        AiEmergencyRiskResponse response =
                aiEmergencyRiskService
                        .generateEmergencyRiskAnalysis(
                                authentication.getName()
                        );

        return ResponseEntity.ok(response);
    }
}
