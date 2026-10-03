package com.ehp.backend.emergency.controller;

import com.ehp.backend.emergency.dto.EmergencyAccessLogResponse;
import com.ehp.backend.emergency.dto.EmergencyQrResponse;
import com.ehp.backend.emergency.service.EmergencyAccessService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.ehp.backend.ai.dto.EmergencyGuidanceResponse;

import java.util.List;

@RestController
@RequestMapping("/api/v1/emergency")
@RequiredArgsConstructor
public class EmergencyAccessController {

    private final EmergencyAccessService emergencyAccessService;

    @PostMapping("/qr")
    public ResponseEntity<EmergencyQrResponse> generateQr(
            Authentication authentication) {

        EmergencyQrResponse response =
                emergencyAccessService.generateQrToken(
                        authentication.getName()
                );

        return ResponseEntity.ok(response);
    }
    @DeleteMapping("/qr")
    public ResponseEntity<Void> revokeQr(
            Authentication authentication) {

        emergencyAccessService.revokeQrToken(
                authentication.getName()
        );

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/access/{token}")
    public ResponseEntity<EmergencyQrResponse> accessEmergencyPassport(
            @PathVariable String token) {

        EmergencyQrResponse response =
                emergencyAccessService.getEmergencyAccess(token);

        return ResponseEntity.ok(response);
    }
    @GetMapping("/access/{token}/ai-guidance")
    public ResponseEntity<EmergencyGuidanceResponse>
    getEmergencyGuidance(
            @PathVariable String token
    ) {

        EmergencyGuidanceResponse response =
                emergencyAccessService
                        .getEmergencyGuidance(token);

        return ResponseEntity.ok(response);
    }
    @GetMapping("/access-history")
    public ResponseEntity<List<EmergencyAccessLogResponse>>
    getAccessHistory(Authentication authentication) {

        List<EmergencyAccessLogResponse> response =
                emergencyAccessService.getAccessHistory(
                        authentication.getName()
                );

        return ResponseEntity.ok(response);
    }
}