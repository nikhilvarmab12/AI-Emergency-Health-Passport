package com.ehp.backend.patient.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientProfileResponse {

    private Long id;

    private Long userId;

    private String fullName;

    private String email;

    private LocalDate dateOfBirth;

    private String gender;

    private String bloodGroup;

    private Double heightCm;

    private Double weightKg;

    private String allergies;

    private String chronicDiseases;

    private String currentMedications;

    private String previousSurgeries;

    private String emergencyContactName;

    private String emergencyContactPhone;

    private String emergencyContactRelation;

    private String medicalNotes;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}