package com.ehp.backend.auth.service.impl;

import com.ehp.backend.auth.service.EmailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final RestClient restClient;
    private final String apiKey;
    private final String from;

    public EmailServiceImpl(
            @Value("${resend.api-key}") String apiKey,
            @Value("${resend.from:onboarding@resend.dev}") String from) {

        this.restClient = RestClient.create();
        this.apiKey = apiKey;
        this.from = from;
    }

    @Override
    public void sendOtpEmail(String to, String otp) {

        String text = """
                Dear User,

                Welcome to AI-Powered Emergency Health Passport.

                Your One-Time Password (OTP) is:

                %s

                This OTP is valid for 5 minutes.

                If you did not request this verification, please ignore this email.

                Regards,
                Emergency Health Passport Team
                """.formatted(otp);

        Map<String, Object> requestBody = Map.of(
                "from", from,
                "to", List.of(to),
                "subject", "Emergency Health Passport - Email Verification",
                "text", text
        );

        log.info("Sending OTP email through Resend");

        restClient.post()
                .uri("https://api.resend.com/emails")
                .header("Authorization", "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(requestBody)
                .retrieve()
                .toBodilessEntity();

        log.info("OTP email accepted by Resend");
    }
}