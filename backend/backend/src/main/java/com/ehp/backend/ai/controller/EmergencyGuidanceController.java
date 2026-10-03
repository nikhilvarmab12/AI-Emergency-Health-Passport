package com.ehp.backend.ai.controller;

import com.ehp.backend.ai.dto.EmergencyGuidanceResponse;
import com.ehp.backend.ai.service.EmergencyGuidanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class EmergencyGuidanceController {

    private final EmergencyGuidanceService
            emergencyGuidanceService;

    @GetMapping("/emergency-guidance")
    public ResponseEntity<EmergencyGuidanceResponse>
    generateEmergencyGuidance(
            Authentication authentication
    ) {

        EmergencyGuidanceResponse response =
                emergencyGuidanceService
                        .generateEmergencyGuidance(
                                authentication.getName()
                        );

        return ResponseEntity.ok(response);
    }
}