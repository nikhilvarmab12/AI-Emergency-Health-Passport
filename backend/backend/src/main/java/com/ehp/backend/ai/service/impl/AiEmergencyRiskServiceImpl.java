package com.ehp.backend.ai.service.impl;

import com.ehp.backend.ai.dto.AiEmergencyRiskResponse;
import com.ehp.backend.ai.service.AiEmergencyRiskService;
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
public class AiEmergencyRiskServiceImpl
        implements AiEmergencyRiskService {

    private final UserRepository userRepository;
    private final PatientHealthProfileRepository profileRepository;

    @Override
    @Transactional(readOnly = true)
    public AiEmergencyRiskResponse generateEmergencyRiskAnalysis(
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
                                        "Patient health profile not found"
                                )
                        );

        int riskScore = 0;

        List<String> criticalFactors = new ArrayList<>();
        List<String> recommendedActions = new ArrayList<>();

        /*
         * ALLERGY ANALYSIS
         */

        if (hasMeaningfulValue(profile.getAllergies())) {

            riskScore += 25;

            criticalFactors.add(
                    "Drug or medical allergy detected: "
                            + profile.getAllergies()
            );

            recommendedActions.add(
                    "Verify allergy information before administering any medication."
            );
        }

        /*
         * CHRONIC DISEASE ANALYSIS
         */

        if (hasMeaningfulValue(profile.getChronicDiseases())) {

            riskScore += 20;

            criticalFactors.add(
                    "Chronic medical condition detected: "
                            + profile.getChronicDiseases()
            );

            recommendedActions.add(
                    "Consider the patient's chronic medical conditions during emergency treatment."
            );
        }

        /*
         * CURRENT MEDICATION ANALYSIS
         */

        if (hasMeaningfulValue(profile.getCurrentMedications())) {

            riskScore += 15;

            criticalFactors.add(
                    "Current medication information available: "
                            + profile.getCurrentMedications()
            );

            recommendedActions.add(
                    "Review current medications to avoid potential drug interactions."
            );
        }

        /*
         * PREVIOUS SURGERY ANALYSIS
         */

        if (hasMeaningfulValue(profile.getPreviousSurgeries())
                && !profile.getPreviousSurgeries()
                .equalsIgnoreCase("None")) {

            riskScore += 10;

            criticalFactors.add(
                    "Previous surgery history detected: "
                            + profile.getPreviousSurgeries()
            );

            recommendedActions.add(
                    "Review previous surgical history before emergency procedures."
            );
        }

        /*
         * BLOOD GROUP AVAILABILITY
         */

        if (hasMeaningfulValue(profile.getBloodGroup())) {

            recommendedActions.add(
                    "Verify blood group before any transfusion or blood-related emergency procedure."
            );

        } else {

            riskScore += 10;

            criticalFactors.add(
                    "Blood group information is not available."
            );

            recommendedActions.add(
                    "Determine blood group before transfusion if required."
            );
        }

        /*
         * EMERGENCY CONTACT
         */

        if (!hasMeaningfulValue(
                profile.getEmergencyContactPhone()
        )) {

            riskScore += 5;

            criticalFactors.add(
                    "Emergency contact information is incomplete."
            );

            recommendedActions.add(
                    "Attempt to identify or contact the patient's next of kin."
            );
        }

        /*
         * LIMIT SCORE
         */

        riskScore = Math.min(riskScore, 100);

        String riskLevel;

        if (riskScore >= 70) {

            riskLevel = "HIGH";

        } else if (riskScore >= 40) {

            riskLevel = "MODERATE";

        } else {

            riskLevel = "LOW";
        }

        /*
         * AI ASSESSMENT
         */

        String aiAssessment = buildAssessment(
                profile,
                riskLevel
        );

        /*
         * DEFAULT ACTION
         */

        recommendedActions.add(
                "Medical professionals should independently verify all information before treatment."
        );

        return AiEmergencyRiskResponse.builder()

                .patientName(user.getFullName())

                .riskScore(riskScore)

                .riskLevel(riskLevel)

                .criticalFactors(criticalFactors)

                .aiAssessment(aiAssessment)

                .recommendedActions(recommendedActions)

                .disclaimer(
                        "This AI-generated emergency risk analysis is intended for decision support only and does not replace professional medical judgment."
                )

                .build();
    }

    private boolean hasMeaningfulValue(String value) {

        if (value == null) {
            return false;
        }

        String normalizedValue = value.trim();

        return !normalizedValue.isEmpty()
                && !normalizedValue.equalsIgnoreCase("none")
                && !normalizedValue.equalsIgnoreCase("not available")
                && !normalizedValue.equalsIgnoreCase("n/a");
    }

    private String buildAssessment(
            PatientHealthProfile profile,
            String riskLevel
    ) {

        if (riskLevel.equals("HIGH")) {

            return "The patient has multiple medical factors that may require special attention during emergency treatment. "
                    + "Healthcare professionals should carefully review allergy information, chronic conditions, "
                    + "current medications, and other available medical history before making treatment decisions.";
        }

        if (riskLevel.equals("MODERATE")) {

            return "The patient has recorded medical information that should be reviewed during emergency care. "
                    + "Healthcare professionals should verify the available health information before treatment.";
        }

        return "No major risk factors were identified from the currently available health profile. "
                + "However, all medical information should still be independently verified by healthcare professionals.";
    }
}