package com.ehp.backend.auth.service.impl;

import com.ehp.backend.auth.dto.LoginRequest;
import com.ehp.backend.auth.dto.LoginResponse;
import com.ehp.backend.auth.dto.RegisterRequest;
import com.ehp.backend.auth.service.AuthService;
import com.ehp.backend.auth.service.EmailVerificationService;
import com.ehp.backend.common.exception.EmailAlreadyExistsException;
import com.ehp.backend.common.exception.PhoneNumberAlreadyExistsException;
import com.ehp.backend.common.security.JwtService;
import com.ehp.backend.user.entity.Role;
import com.ehp.backend.user.entity.User;
import com.ehp.backend.user.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final EmailVerificationService emailVerificationService;

    public AuthServiceImpl(
            UserRepository userRepository,
            org.springframework.security.crypto.password.PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            EmailVerificationService emailVerificationService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.emailVerificationService = emailVerificationService;
    }

    @Override
    @Transactional
    public String register(RegisterRequest request) {

        String email = request.getEmail().trim().toLowerCase();
        String phoneNumber = request.getPhoneNumber().trim();

        /*
         * ---------------------------------------------------------
         * 1. Check whether email already belongs to a user
         * ---------------------------------------------------------
         */
        User existingEmailUser = userRepository.findByEmail(email)
                .orElse(null);

        /*
         * ---------------------------------------------------------
         * 2. Check whether phone already belongs to a user
         * ---------------------------------------------------------
         */
        User existingPhoneUser = userRepository
                .findByPhoneNumber(phoneNumber)
                .orElse(null);

        /*
         * ---------------------------------------------------------
         * 3. Email and phone belong to different users
         *
         * Never merge two accounts.
         * ---------------------------------------------------------
         */
        if (existingEmailUser != null
                && existingPhoneUser != null
                && !existingEmailUser.getId().equals(existingPhoneUser.getId())) {

            throw new EmailAlreadyExistsException(
                    "Email and phone number are already associated with different accounts."
            );
        }

        /*
         * ---------------------------------------------------------
         * 4. Existing VERIFIED email
         * ---------------------------------------------------------
         */
        if (existingEmailUser != null
                && Boolean.TRUE.equals(existingEmailUser.getEnabled())) {

            throw new EmailAlreadyExistsException(
                    "Email already exists. Please login."
            );
        }

        /*
         * ---------------------------------------------------------
         * 5. Existing VERIFIED phone
         * ---------------------------------------------------------
         */
        if (existingPhoneUser != null
                && Boolean.TRUE.equals(existingPhoneUser.getEnabled())) {

            throw new PhoneNumberAlreadyExistsException(
                    "Phone number already exists."
            );
        }

        /*
         * ---------------------------------------------------------
         * 6. Recover existing PENDING registration
         *
         * If the email already belongs to an unverified user,
         * reuse that user instead of creating another row.
         * ---------------------------------------------------------
         */
        if (existingEmailUser != null) {

            User user = existingEmailUser;

            /*
             * If the phone belongs to another account, reject it.
             */
            if (existingPhoneUser != null
                    && !existingPhoneUser.getId().equals(user.getId())) {

                throw new PhoneNumberAlreadyExistsException(
                        "Phone number already exists."
                );
            }

            /*
             * Update the pending registration.
             */
            user.setFullName(request.getFullName());
            user.setPassword(
                    passwordEncoder.encode(request.getPassword())
            );
            user.setPhoneNumber(phoneNumber);
            user.setRole(Role.PATIENT);
            user.setEnabled(false);

            userRepository.save(user);

            /*
             * Existing OTP will be deleted and a fresh OTP
             * will be generated by EmailVerificationService.
             */
            emailVerificationService.generateAndSendOtp(email);

            return "Registration is already pending. A new OTP has been sent to your email.";
        }

        /*
         * ---------------------------------------------------------
         * 7. Phone belongs to an existing PENDING account,
         *    but the email is different.
         *
         * Do NOT change that account's email.
         * ---------------------------------------------------------
         */
        if (existingPhoneUser != null) {

            throw new PhoneNumberAlreadyExistsException(
                    "Phone number is already associated with a pending registration. Please use the email used during registration."
            );
        }

        /*
         * ---------------------------------------------------------
         * 8. Completely NEW registration
         * ---------------------------------------------------------
         */
        User user = User.builder()
                .fullName(request.getFullName())
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(phoneNumber)
                .role(Role.PATIENT)
                .enabled(false)
                .build();

        userRepository.save(user);

        /*
         * Generate and send OTP.
         */
        emailVerificationService.generateAndSendOtp(email);

        return "Registration successful. OTP has been sent to your email.";
    }

    @Override
    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid email or password."
                        )
                );

        if (!Boolean.TRUE.equals(user.getEnabled())) {
            throw new RuntimeException(
                    "Please verify your email before logging in."
            );
        }

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getEmail(),
                                request.getPassword()
                        )
                );

        UserDetails userDetails =
                (UserDetails) authentication.getPrincipal();

        String token = jwtService.generateToken(userDetails);

        return LoginResponse.builder()
                .message("Login successful")
                .token(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}