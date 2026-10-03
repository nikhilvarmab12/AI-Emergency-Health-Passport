package com.ehp.backend.emergency.service;

import com.ehp.backend.emergency.dto.EmergencyPassportResponse;

public interface EmergencyPassportService {

    EmergencyPassportResponse getEmergencyPassport(String email);
}