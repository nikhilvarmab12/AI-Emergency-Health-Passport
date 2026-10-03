package com.ehp.backend.ai.service.impl;

import com.ehp.backend.ai.dto.AiHealthSummaryResponse;
import com.ehp.backend.ai.service.AiHealthSummaryService;
import com.ehp.backend.patient.entity.PatientHealthProfile;
import com.ehp.backend.patient.repository.PatientHealthProfileRepository;
import com.ehp.backend.user.entity.User;
import com.ehp.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AiHealthSummaryServiceImpl
        implements AiHealthSummaryService {

    private final UserRepository userRepository;
    private final PatientHealthProfileRepository profileRepository;

    @Override
    @Transactional(readOnly = true)
    public AiHealthSummaryResponse generateHealthSummary(
            String email
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        PatientHealthProfile profile =
                profileRepository.findByUserId(user.getId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Patient profile not found. " +
                                                "Please complete your health profile first."
                                )
                        );

        List<String> criticalAlerts = new ArrayList<>();
        List<String> medicalConditions = new ArrayList<>();
        List<String> medications = new ArrayList<>();
        List<String> recommendations = new ArrayList<>();

        /*
         * CRITICAL ALLERGIES
         */
        if (hasMeaningfulValue(profile.getAllergies())) {

            criticalAlerts.add(
                    "Allergy: " + profile.getAllergies()
            );

            recommendations.add(
                    "Review documented allergies before administering medication."
            );
        }

        /*
         * CHRONIC DISEASES
         */
        if (hasMeaningfulValue(profile.getChronicDiseases())) {

            medicalConditions.addAll(
                    splitMedicalData(
                            profile.getChronicDiseases()
                    )
            );

            recommendations.add(
                    "Consider the patient's chronic medical conditions during emergency treatment."
            );
        }

        /*
         * CURRENT MEDICATIONS
         */
        if (hasMeaningfulValue(
                profile.getCurrentMedications()
        )) {

            medications.addAll(
                    splitMedicalData(
                            profile.getCurrentMedications()
                    )
            );

            recommendations.add(
                    "Review current medications before prescribing additional treatment."
            );
        }

        /*
         * BLOOD GROUP
         */
        if (hasMeaningfulValue(profile.getBloodGroup())) {

            criticalAlerts.add(
                    "Blood Group: " +
                            profile.getBloodGroup()
            );
        }

        /*
         * EMERGENCY CONTACT
         */
        if (hasMeaningfulValue(
                profile.getEmergencyContactName()
        )) {

            recommendations.add(
                    "Emergency contact available: " +
                            profile.getEmergencyContactName()
            );
        }

        /*
         * PREVIOUS SURGERIES
         */
        if (hasMeaningfulValue(
                profile.getPreviousSurgeries()
        )
                && !profile.getPreviousSurgeries()
                .equalsIgnoreCase("None")) {

            medicalConditions.add(
                    "Previous surgeries: " +
                            profile.getPreviousSurgeries()
            );
        }

        /*
         * MEDICAL NOTES
         */
        if (hasMeaningfulValue(
                profile.getMedicalNotes()
        )) {

            recommendations.add(
                    "Review additional medical notes before treatment."
            );
        }

        /*
         * DEFAULT VALUES
         */
        if (criticalAlerts.isEmpty()) {

            criticalAlerts.add(
                    "No critical allergies or alerts documented."
            );
        }

        if (medicalConditions.isEmpty()) {

            medicalConditions.add(
                    "No chronic medical conditions documented."
            );
        }

        if (medications.isEmpty()) {

            medications.add(
                    "No current medications documented."
            );
        }

        if (recommendations.isEmpty()) {

            recommendations.add(
                    "Review the complete patient health profile before treatment."
            );
        }

        String priority =
                determineEmergencyPriority(profile);

        String summary =
                generateSummary(
                        user,
                        profile,
                        priority
                );

        return AiHealthSummaryResponse.builder()
                .patientName(user.getFullName())
                .bloodGroup(
                        getDisplayValue(
                                profile.getBloodGroup()
                        )
                )
                .emergencyPriority(priority)
                .summary(summary)
                .criticalAlerts(criticalAlerts)
                .medicalConditions(medicalConditions)
                .currentMedications(medications)
                .emergencyRecommendations(recommendations)
                .disclaimer(
                        "AI-generated health summary for emergency assistance. " +
                                "This information is intended to support healthcare " +
                                "professionals and does not replace professional " +
                                "medical judgment."
                )
                .build();
    }

    private boolean hasMeaningfulValue(
            String value
    ) {

        return value != null
                && !value.trim().isEmpty()
                && !value.trim()
                .equalsIgnoreCase("none")
                && !value.trim()
                .equalsIgnoreCase("not available");
    }

    private List<String> splitMedicalData(
            String value
    ) {

        return Arrays.stream(
                        value.split("[,;]")
                )
                .map(String::trim)
                .filter(item -> !item.isEmpty())
                .collect(Collectors.toList());
    }

    private String determineEmergencyPriority(
            PatientHealthProfile profile
    ) {

        boolean hasAllergy =
                hasMeaningfulValue(
                        profile.getAllergies()
                );

        boolean hasChronicDisease =
                hasMeaningfulValue(
                        profile.getChronicDiseases()
                );

        boolean hasMedication =
                hasMeaningfulValue(
                        profile.getCurrentMedications()
                );

        if (hasAllergy
                && hasChronicDisease
                && hasMedication) {

            return "HIGH";
        }

        if (hasAllergy || hasChronicDisease) {

            return "MODERATE";
        }

        return "STANDARD";
    }

    private String generateSummary(
            User user,
            PatientHealthProfile profile,
            String priority
    ) {

        StringBuilder summary =
                new StringBuilder();

        summary.append(
                user.getFullName()
        ).append(
                " has an emergency health priority level of "
        ).append(
                priority
        ).append(
                ". "
        );

        if (hasMeaningfulValue(
                profile.getBloodGroup()
        )) {

            summary.append(
                    "Documented blood group is "
            ).append(
                    profile.getBloodGroup()
            ).append(
                    ". "
            );
        }

        if (hasMeaningfulValue(
                profile.getAllergies()
        )) {

            summary.append(
                    "Important allergy information: "
            ).append(
                    profile.getAllergies()
            ).append(
                    ". "
            );
        }

        if (hasMeaningfulValue(
                profile.getChronicDiseases()
        )) {

            summary.append(
                    "Documented chronic condition(s): "
            ).append(
                    profile.getChronicDiseases()
            ).append(
                    ". "
            );
        }

        if (hasMeaningfulValue(
                profile.getCurrentMedications()
        )) {

            summary.append(
                    "Current medication(s): "
            ).append(
                    profile.getCurrentMedications()
            ).append(
                    ". "
            );
        }

        summary.append(
                "Healthcare professionals should review " +
                        "the complete health profile before making " +
                        "clinical decisions."
        );

        return summary.toString();
    }

    private String getDisplayValue(
            String value
    ) {

        return hasMeaningfulValue(value)
                ? value
                : "Not documented";
    }
}