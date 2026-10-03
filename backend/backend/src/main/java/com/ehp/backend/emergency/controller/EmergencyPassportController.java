package com.ehp.backend.emergency.controller;

import com.ehp.backend.emergency.dto.EmergencyPassportResponse;
import com.ehp.backend.emergency.service.EmergencyPassportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/emergency")
@RequiredArgsConstructor
public class EmergencyPassportController {

    private final EmergencyPassportService emergencyPassportService;

    @GetMapping("/passport")
    public ResponseEntity<EmergencyPassportResponse> getEmergencyPassport(
            Authentication authentication) {

        EmergencyPassportResponse response =
                emergencyPassportService.getEmergencyPassport(
                        authentication.getName()
                );

        return ResponseEntity.ok(response);
    }
}