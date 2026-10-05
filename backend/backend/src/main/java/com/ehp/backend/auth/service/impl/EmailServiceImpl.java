
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
    private final String senderName;

    public EmailServiceImpl(
            @Value("${brevo.api-key}") String apiKey,
            @Value("${brevo.from}") String from,
            @Value("${brevo.sender-name:AI Emergency Health Passport}")
            String senderName) {

        this.restClient = RestClient.create();
        this.apiKey = apiKey;
        this.from = from;
        this.senderName = senderName;
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
                "sender", Map.of(
                        "name", senderName,
                        "email", from
                ),
                "to", List.of(Map.of("email", to)),
                "subject", "Emergency Health Passport - Email Verification",
                "textContent", text
        );

        log.info("Sending OTP email through Brevo");

        restClient.post()
                .uri("https://api.brevo.com/v3/smtp/email")
                .header("api-key", apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(requestBody)
                .retrieve()
                .toBodilessEntity();

        log.info("OTP email accepted by Brevo");
    }
}