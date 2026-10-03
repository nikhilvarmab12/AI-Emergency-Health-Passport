package com.ehp.backend.emergency.service.impl;

import com.ehp.backend.emergency.dto.EmergencyPassportResponse;
import com.ehp.backend.patient.entity.PatientHealthProfile;
import com.ehp.backend.patient.repository.PatientHealthProfileRepository;
import com.ehp.backend.user.entity.User;
import com.ehp.backend.user.repository.UserRepository;
import com.ehp.backend.emergency.service.EmergencyPassportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EmergencyPassportServiceImpl
        implements EmergencyPassportService {

    private final UserRepository userRepository;
    private final PatientHealthProfileRepository profileRepository;

    @Override
    @Transactional(readOnly = true)
    public EmergencyPassportResponse getEmergencyPassport(
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        PatientHealthProfile profile =
                profileRepository.findByUserId(user.getId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Patient health profile not found"
                                ));

        return EmergencyPassportResponse.builder()
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
}