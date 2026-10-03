package com.ehp.backend.emergency.service.impl;

import com.ehp.backend.ai.dto.EmergencyGuidanceResponse;
import com.ehp.backend.emergency.dto.EmergencyAccessLogResponse;
import com.ehp.backend.emergency.dto.EmergencyQrResponse;
import com.ehp.backend.emergency.entity.EmergencyAccessToken;
import com.ehp.backend.emergency.repository.EmergencyAccessTokenRepository;
import com.ehp.backend.emergency.service.EmergencyAccessService;
import com.ehp.backend.emergency.util.EmergencyTokenGenerator;
import com.ehp.backend.patient.entity.PatientHealthProfile;
import com.ehp.backend.patient.repository.PatientHealthProfileRepository;
import com.ehp.backend.user.entity.User;
import com.ehp.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ehp.backend.ai.service.EmergencyGuidanceService;
import com.ehp.backend.emergency.entity.EmergencyAccessLog;
import com.ehp.backend.emergency.repository.EmergencyAccessLogRepository;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.beans.factory.annotation.Value;

import java.time.LocalDateTime;
import java.util.List;


@Service
@RequiredArgsConstructor
public class EmergencyAccessServiceImpl
        implements EmergencyAccessService {

    private final UserRepository userRepository;

    private final EmergencyAccessTokenRepository tokenRepository;

    private final PatientHealthProfileRepository patientHealthProfileRepository;
    private final EmergencyGuidanceService emergencyGuidanceService;
    private final EmergencyAccessLogRepository emergencyAccessLogRepository;
    @Value("${app.base-url}")
    private String baseUrl;
    @Override
    @Transactional
    public EmergencyQrResponse generateQrToken(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        PatientHealthProfile profile =
                patientHealthProfileRepository.findByUserId(user.getId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Patient health profile not found"
                                ));

        EmergencyAccessToken accessToken =
                tokenRepository.findByUserId(user.getId())
                        .orElse(null);

        String token = EmergencyTokenGenerator.generateToken();

        if (accessToken == null) {

            accessToken = EmergencyAccessToken.builder()
                    .user(user)
                    .token(token)
                    .active(true)
                    .expiresAt(LocalDateTime.now().plusDays(30))
                    .build();

        } else {

            accessToken.setToken(token);
            accessToken.setActive(true);
            accessToken.setExpiresAt(LocalDateTime.now().plusDays(30));
        }

        tokenRepository.save(accessToken);

        String accessUrl =
                baseUrl + "/api/v1/emergency/access/" + token;

        return EmergencyQrResponse.builder()
                .message("Emergency QR token generated successfully")
                .accessToken(token)
                .accessUrl(accessUrl)
                .build();
    }

    @Override
    @Transactional
    public void revokeQrToken(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        tokenRepository.findByUserId(user.getId())
                .ifPresent(accessToken -> {

                    accessToken.setActive(false);
                    tokenRepository.save(accessToken);

                    EmergencyAccessLog accessLog =
                            EmergencyAccessLog.builder()
                                    .user(user)
                                    .accessType("QR_REVOKED")
                                    .success(true)
                                    .build();

                    emergencyAccessLogRepository.save(accessLog);
                });
    }
    @Override
    @Transactional
    public EmergencyQrResponse getEmergencyAccess(String token) {

        EmergencyAccessToken accessToken =
                tokenRepository
                        .findByTokenAndActiveTrueAndExpiresAtAfter(
                                token,
                                LocalDateTime.now()
                        )
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.UNAUTHORIZED,
                                        "Invalid or expired emergency access token."
                                )
                        );
        User user = accessToken.getUser();

        PatientHealthProfile profile =
                patientHealthProfileRepository
                        .findByUserId(user.getId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Patient profile not found."
                                )
                        );

        // SAVE SUCCESSFUL ACCESS LOG
        EmergencyAccessLog accessLog =
                EmergencyAccessLog.builder()
                        .user(user)
                        .accessType("PASSPORT_VIEWED")
                        .success(true)
                        .token(token)
                        .build();

        emergencyAccessLogRepository.save(accessLog);

        return EmergencyQrResponse.builder()
                .message(
                        "Emergency Health Passport accessed successfully"
                )
                .accessToken(accessToken.getToken())
                .accessUrl(
                        baseUrl + "/api/v1/emergency/access/" + token
                )
                .patientId(user.getId())
                .patientName(user.getFullName())
                .bloodGroup(profile.getBloodGroup())
                .allergies(profile.getAllergies())
                .chronicDiseases(profile.getChronicDiseases())
                .currentMedications(
                        profile.getCurrentMedications()
                )
                .previousSurgeries(
                        profile.getPreviousSurgeries()
                )
                .emergencyContactName(
                        profile.getEmergencyContactName()
                )
                .emergencyContactPhone(
                        profile.getEmergencyContactPhone()
                )
                .emergencyContactRelation(
                        profile.getEmergencyContactRelation()
                )
                .medicalNotes(profile.getMedicalNotes())
                .build();
    }
    @Override
    @Transactional(readOnly = true)
    public EmergencyGuidanceResponse getEmergencyGuidance(
            String token
    ) {

        EmergencyAccessToken accessToken =
                tokenRepository
                        .findByTokenAndActiveTrueAndExpiresAtAfter(
                                token,
                                LocalDateTime.now()
                        )
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.UNAUTHORIZED,
                                        "Invalid or expired emergency access token."
                                )
                        );

        User user = accessToken.getUser();

        return emergencyGuidanceService
                .generateEmergencyGuidance(
                        user.getEmail()
                );
    }
    @Override
    @Transactional(readOnly = true)
    public List<EmergencyAccessLogResponse> getAccessHistory(
            String email
    ) {

        List<EmergencyAccessLog> accessLogs =
                emergencyAccessLogRepository
                        .findByUserEmailOrderByAccessedAtDesc(email);

        return accessLogs.stream()
                .map(log ->
                        EmergencyAccessLogResponse.builder()
                                .id(log.getId())
                                .accessType(log.getAccessType())
                                .success(log.getSuccess())
                                .accessedAt(log.getAccessedAt())
                                .build()
                )
                .toList();
    }
}