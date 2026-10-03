package com.ehp.backend.ai.service.impl;

import com.ehp.backend.ai.dto.EmergencyGuidanceResponse;
import com.ehp.backend.ai.service.EmergencyGuidanceService;
import com.ehp.backend.patient.entity.PatientHealthProfile;
import com.ehp.backend.patient.repository.PatientHealthProfileRepository;
import com.ehp.backend.user.entity.User;
import com.ehp.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmergencyGuidanceServiceImpl
        implements EmergencyGuidanceService {

    private final UserRepository userRepository;

    private final PatientHealthProfileRepository
            profileRepository;

    @Override
    @Transactional(readOnly = true)
    public EmergencyGuidanceResponse
    generateEmergencyGuidance(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        PatientHealthProfile profile =
                profileRepository.findByUserId(user.getId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Patient profile not found"
                                ));

        List<String> immediatePrecautions =
                new ArrayList<>();

        List<String> allergyWarnings =
                new ArrayList<>();

        List<String> conditionConsiderations =
                new ArrayList<>();

        List<String> medicationWarnings =
                new ArrayList<>();

        List<String> bloodGroupPrecautions =
                new ArrayList<>();

        List<String> priorityActions =
                new ArrayList<>();

        /*
         * ALLERGY GUIDANCE
         */

        if (hasText(profile.getAllergies())) {

            allergyWarnings.add(
                    "Recorded allergy: " +
                            profile.getAllergies()
            );

            immediatePrecautions.add(
                    "Verify allergy information before administering medication."
            );

            priorityActions.add(
                    "Clearly communicate the recorded allergy information to the treating medical team."
            );
        }

        /*
         * CHRONIC CONDITION GUIDANCE
         */

        if (hasText(profile.getChronicDiseases())) {

            conditionConsiderations.add(
                    "Recorded chronic condition: " +
                            profile.getChronicDiseases()
            );

            immediatePrecautions.add(
                    "Consider the patient's chronic medical conditions during emergency assessment."
            );

            priorityActions.add(
                    "Review chronic conditions for possible complications during emergency care."
            );
        }

        /*
         * MEDICATION GUIDANCE
         */

        if (hasText(profile.getCurrentMedications())) {

            medicationWarnings.add(
                    "Recorded medication: " +
                            profile.getCurrentMedications()
            );

            immediatePrecautions.add(
                    "Review current medications before administering additional drugs."
            );

            priorityActions.add(
                    "Check for possible medication interactions and independently verify the medication history."
            );
        }

        /*
         * BLOOD GROUP GUIDANCE
         */

        if (hasText(profile.getBloodGroup())) {

            bloodGroupPrecautions.add(
                    "Recorded blood group: " +
                            profile.getBloodGroup()
            );

            priorityActions.add(
                    "Independently verify blood group before any transfusion or blood-related procedure."
            );
        }

        /*
         * PREVIOUS SURGERIES
         */

        if (hasText(profile.getPreviousSurgeries())
                && !profile.getPreviousSurgeries()
                .equalsIgnoreCase("none")) {

            conditionConsiderations.add(
                    "Previous surgery history: " +
                            profile.getPreviousSurgeries()
            );

            priorityActions.add(
                    "Review previous surgical history before emergency procedures."
            );
        }

        /*
         * GENERAL FALLBACK GUIDANCE
         */

        if (immediatePrecautions.isEmpty()) {

            immediatePrecautions.add(
                    "No major emergency precautions were identified from the currently available profile."
            );
        }

        priorityActions.add(
                "Independently verify all patient information before making treatment decisions."
        );

        priorityActions.add(
                "Use this Emergency Health Passport as decision support and not as a replacement for professional medical judgment."
        );

        String emergencyPriority =
                determinePriority(
                        profile
                );

        String overallGuidance =
                buildOverallGuidance(
                        profile,
                        emergencyPriority
                );

        return EmergencyGuidanceResponse.builder()

                .patientName(user.getFullName())

                .emergencyPriority(
                        emergencyPriority
                )

                .immediatePrecautions(
                        immediatePrecautions
                )

                .allergyWarnings(
                        allergyWarnings
                )

                .conditionConsiderations(
                        conditionConsiderations
                )

                .medicationWarnings(
                        medicationWarnings
                )

                .bloodGroupPrecautions(
                        bloodGroupPrecautions
                )

                .priorityActions(
                        priorityActions
                )

                .overallGuidance(
                        overallGuidance
                )

                .disclaimer(
                        "This AI-assisted emergency guidance is intended for decision support only. Healthcare professionals must independently assess and verify all patient information before treatment."
                )

                .build();
    }

    private String determinePriority(
            PatientHealthProfile profile) {

        int factors = 0;

        if (hasText(profile.getAllergies())) {
            factors++;
        }

        if (hasText(profile.getChronicDiseases())) {
            factors++;
        }

        if (hasText(profile.getCurrentMedications())) {
            factors++;
        }

        if (hasText(profile.getPreviousSurgeries())
                && !profile.getPreviousSurgeries()
                .equalsIgnoreCase("none")) {
            factors++;
        }

        if (factors >= 3) {
            return "HIGH";
        }

        if (factors >= 1) {
            return "MODERATE";
        }

        return "LOW";
    }

    private String buildOverallGuidance(
            PatientHealthProfile profile,
            String priority) {

        return switch (priority) {

            case "HIGH" ->
                    "Multiple critical medical factors are available in the patient's Emergency Health Passport. Emergency healthcare professionals should review allergy information, chronic conditions, current medications, and previous medical history before treatment.";

            case "MODERATE" ->
                    "Some important medical factors are available in the patient's Emergency Health Passport. Healthcare professionals should review the relevant information during emergency assessment.";

            default ->
                    "Limited critical medical risk factors were identified from the currently available Emergency Health Passport information. Standard emergency assessment and independent verification are still required.";
        };
    }

    private boolean hasText(String value) {

        return value != null
                && !value.trim().isEmpty()
                && !value.equalsIgnoreCase("none")
                && !value.equalsIgnoreCase("not available");
    }
}