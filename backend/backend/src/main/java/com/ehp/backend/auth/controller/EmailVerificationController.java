package com.ehp.backend.auth.controller;

import com.ehp.backend.auth.dto.SendOtpRequest;
import com.ehp.backend.auth.dto.VerifyOtpRequest;
import com.ehp.backend.auth.service.EmailVerificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class EmailVerificationController {

    private final EmailVerificationService emailVerificationService;

    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(
            @Valid @RequestBody SendOtpRequest request) {

        emailVerificationService.generateAndSendOtp(request.getEmail());

        return ResponseEntity.ok("OTP sent successfully.");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request) throws BadRequestException {

        emailVerificationService.verifyOtp(
                request.getEmail(),
                request.getOtp()
        );

        return ResponseEntity.ok("Email verified successfully.");
    }
}