package com.ehp.backend.auth.service.impl;

import com.ehp.backend.auth.entity.EmailVerification;
import com.ehp.backend.auth.repository.EmailVerificationRepository;
import com.ehp.backend.auth.service.EmailService;
import com.ehp.backend.auth.service.EmailVerificationService;
import com.ehp.backend.auth.util.OtpGenerator;
import com.ehp.backend.common.exception.ResourceNotFoundException;
import com.ehp.backend.user.entity.User;
import com.ehp.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EmailVerificationServiceImpl implements EmailVerificationService {

    private final EmailVerificationRepository emailVerificationRepository;
    private final EmailService emailService;
    private final UserRepository userRepository;

    @Transactional
    @Override
    public void generateAndSendOtp(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        if (Boolean.TRUE.equals(user.getEnabled())) {
            throw new IllegalStateException("Account already verified.");
        }

        // Delete existing OTP if present
        emailVerificationRepository.deleteByEmail(email);
        emailVerificationRepository.flush();

        String otp = OtpGenerator.generateOtp();

        EmailVerification verification = EmailVerification.builder()
                .email(email)
                .otp(otp)
                .expiresAt(LocalDateTime.now().plusMinutes(5))
                .verified(false)
                .build();

        emailVerificationRepository.save(verification);

        emailService.sendOtpEmail(email, otp);
    }

    @Transactional
    @Override
    public boolean verifyOtp(String email, String otp) throws BadRequestException {

        EmailVerification verification = emailVerificationRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BadRequestException("OTP not found."));

        if (verification.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("OTP expired.");
        }

        if (!verification.getOtp().equals(otp)) {
            throw new BadRequestException("Invalid OTP.");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        user.setEnabled(true);

        userRepository.save(user);

        emailVerificationRepository.deleteByEmail(email);

        return true;
    }
}