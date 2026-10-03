package com.ehp.backend.ai.controller;

import com.ehp.backend.ai.dto.AiHealthSummaryResponse;
import com.ehp.backend.ai.service.AiHealthSummaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AiHealthSummaryController {

    private final AiHealthSummaryService aiHealthSummaryService;

    @GetMapping("/health-summary")
    public ResponseEntity<AiHealthSummaryResponse>
    generateHealthSummary(
            Authentication authentication
    ) {

        AiHealthSummaryResponse response =
                aiHealthSummaryService.generateHealthSummary(
                        authentication.getName()
                );

        return ResponseEntity.ok(response);
    }
}