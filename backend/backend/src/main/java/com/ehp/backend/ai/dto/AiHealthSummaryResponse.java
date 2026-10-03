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
public class AiHealthSummaryResponse {

    private String patientName;

    private String bloodGroup;

    private String emergencyPriority;

    private String summary;

    private List<String> criticalAlerts;

    private List<String> medicalConditions;

    private List<String> currentMedications;

    private List<String> emergencyRecommendations;

    private String disclaimer;
}