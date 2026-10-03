package com.ehp.backend.patient.service;

import com.ehp.backend.patient.dto.PatientProfileRequest;
import com.ehp.backend.patient.dto.PatientProfileResponse;

public interface PatientProfileService {

    PatientProfileResponse createOrUpdateProfile(
            String email,
            PatientProfileRequest request
    );

    PatientProfileResponse getProfile(String email);
}