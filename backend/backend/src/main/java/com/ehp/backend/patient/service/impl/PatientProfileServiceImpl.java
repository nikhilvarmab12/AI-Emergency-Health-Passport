package com.ehp.backend.patient.service.impl;

import com.ehp.backend.patient.dto.PatientProfileRequest;
import com.ehp.backend.patient.dto.PatientProfileResponse;
import com.ehp.backend.patient.entity.PatientHealthProfile;
import com.ehp.backend.patient.repository.PatientHealthProfileRepository;
import com.ehp.backend.patient.service.PatientProfileService;
import com.ehp.backend.user.entity.User;
import com.ehp.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PatientProfileServiceImpl
        implements PatientProfileService {

    private final PatientHealthProfileRepository profileRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public PatientProfileResponse createOrUpdateProfile(
            String email,
            PatientProfileRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        PatientHealthProfile profile =
                profileRepository.findByUserId(user.getId())
                        .orElse(
                                PatientHealthProfile.builder()
                                        .user(user)
                                        .build()
                        );

        profile.setDateOfBirth(request.getDateOfBirth());
        profile.setGender(request.getGender());
        profile.setBloodGroup(request.getBloodGroup());
        profile.setHeightCm(request.getHeightCm());
        profile.setWeightKg(request.getWeightKg());
        profile.setAllergies(request.getAllergies());
        profile.setChronicDiseases(request.getChronicDiseases());
        profile.setCurrentMedications(
                request.getCurrentMedications()
        );
        profile.setPreviousSurgeries(
                request.getPreviousSurgeries()
        );
        profile.setEmergencyContactName(
                request.getEmergencyContactName()
        );
        profile.setEmergencyContactPhone(
                request.getEmergencyContactPhone()
        );
        profile.setEmergencyContactRelation(
                request.getEmergencyContactRelation()
        );
        profile.setMedicalNotes(request.getMedicalNotes());

        PatientHealthProfile saved =
                profileRepository.save(profile);

        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PatientProfileResponse getProfile(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        PatientHealthProfile profile =
                profileRepository.findByUserId(user.getId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Patient profile not found"
                                ));

        return mapToResponse(profile);
    }

    private PatientProfileResponse mapToResponse(
            PatientHealthProfile profile) {

        User user = profile.getUser();

        return PatientProfileResponse.builder()
                .id(profile.getId())
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .dateOfBirth(profile.getDateOfBirth())
                .gender(profile.getGender())
                .bloodGroup(profile.getBloodGroup())
                .heightCm(profile.getHeightCm())
                .weightKg(profile.getWeightKg())
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
                .createdAt(profile.getCreatedAt())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }
}