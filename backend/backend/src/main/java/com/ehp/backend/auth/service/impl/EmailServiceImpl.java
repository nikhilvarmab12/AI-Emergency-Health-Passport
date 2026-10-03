package com.ehp.backend.auth.service.impl;

import com.ehp.backend.auth.service.EmailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendOtpEmail(String to, String otp) {

        log.info("Preparing OTP email for: {}", to);

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);
        message.setSubject(
                "Emergency Health Passport - Email Verification"
        );

        message.setText(
                """
                Dear User,

                Welcome to AI-Powered Emergency Health Passport.

                Your One-Time Password (OTP) is:

                %s

                This OTP is valid for 5 minutes.

                If you did not request this verification, please ignore this email.

                Regards,
                Emergency Health Passport Team
                """.formatted(otp)
        );

        log.info("Sending OTP email...");

        mailSender.send(message);

        log.info("OTP email sent successfully to: {}", to);
    }
}