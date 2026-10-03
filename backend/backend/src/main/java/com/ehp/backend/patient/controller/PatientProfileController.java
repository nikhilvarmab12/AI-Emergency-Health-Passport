package com.ehp.backend.patient.controller;

import com.ehp.backend.patient.dto.PatientProfileRequest;
import com.ehp.backend.patient.dto.PatientProfileResponse;
import com.ehp.backend.patient.service.PatientProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/patients/profile")
@RequiredArgsConstructor
public class PatientProfileController {

    private final PatientProfileService patientProfileService;

    @PostMapping
    public ResponseEntity<PatientProfileResponse> createOrUpdateProfile(
            @Valid @RequestBody PatientProfileRequest request,
            Authentication authentication) {

        PatientProfileResponse response =
                patientProfileService.createOrUpdateProfile(
                        authentication.getName(),
                        request
                );

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<PatientProfileResponse> getProfile(
            Authentication authentication) {

        PatientProfileResponse response =
                patientProfileService.getProfile(
                        authentication.getName()
                );

        return ResponseEntity.ok(response);
    }
}