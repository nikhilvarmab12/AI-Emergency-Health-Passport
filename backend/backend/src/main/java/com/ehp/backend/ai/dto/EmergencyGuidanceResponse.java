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
public class EmergencyGuidanceResponse {

    private String patientName;

    private String emergencyPriority;

    private List<String> immediatePrecautions;

    private List<String> allergyWarnings;

    private List<String> conditionConsiderations;

    private List<String> medicationWarnings;

    private List<String> bloodGroupPrecautions;

    private List<String> priorityActions;

    private String overallGuidance;

    private String disclaimer;
}