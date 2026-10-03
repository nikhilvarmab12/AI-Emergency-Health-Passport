package com.ehp.backend.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiEmergencyRiskResponse {

    private String patientName;

    private Integer riskScore;

    private String riskLevel;

    private List<String> criticalFactors;

    private String aiAssessment;

    private List<String> recommendedActions;

    private String disclaimer;
}