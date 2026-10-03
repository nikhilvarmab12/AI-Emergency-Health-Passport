package com.ehp.backend.patient.dto;

import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientProfileRequest {

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

    @Pattern(
            regexp = "^[0-9+\\- ]{10,15}$",
            message = "Invalid emergency contact phone number"
    )
    private String emergencyContactPhone;

    private String emergencyContactRelation;

    private String medicalNotes;
}