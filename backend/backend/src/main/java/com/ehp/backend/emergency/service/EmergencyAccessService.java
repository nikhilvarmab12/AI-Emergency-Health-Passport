package com.ehp.backend.emergency.service;

import com.ehp.backend.emergency.dto.EmergencyAccessLogResponse;
import com.ehp.backend.emergency.dto.EmergencyQrResponse;
import com.ehp.backend.ai.dto.EmergencyGuidanceResponse;

import java.util.List;

public interface EmergencyAccessService {

    EmergencyQrResponse generateQrToken(String email);
    void revokeQrToken(String email);
    EmergencyQrResponse getEmergencyAccess(String token);
    EmergencyGuidanceResponse getEmergencyGuidance(
            String token
    );
    List<EmergencyAccessLogResponse> getAccessHistory(
            String email
    );
}