package com.ehp.backend.emergency.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmergencyQrResponse {

    private String message;

    private String accessToken;

    private String accessUrl;

    private Long patientId;

    private String patientName;

    private String bloodGroup;

    private String allergies;

    private String chronicDiseases;

    private String currentMedications;

    private String previousSurgeries;

    private String emergencyContactName;

    private String emergencyContactPhone;

    private String emergencyContactRelation;

    private String medicalNotes;
}