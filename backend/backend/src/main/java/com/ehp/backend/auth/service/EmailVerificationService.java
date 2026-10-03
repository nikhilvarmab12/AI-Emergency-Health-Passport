package com.ehp.backend.auth.service;

import org.apache.coyote.BadRequestException;

public interface EmailVerificationService {

    void generateAndSendOtp(String email);

    boolean verifyOtp(String email, String otp) throws BadRequestException;

}