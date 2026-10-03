package com.ehp.backend.auth.service.impl;

import com.ehp.backend.auth.dto.LoginRequest;
import com.ehp.backend.auth.dto.LoginResponse;
import com.ehp.backend.auth.dto.RegisterRequest;
import com.ehp.backend.auth.service.AuthService;
import com.ehp.backend.auth.service.EmailVerificationService;
import com.ehp.backend.common.exception.EmailAlreadyExistsException;
import com.ehp.backend.common.exception.PhoneNumberAlreadyExistsException;
import com.ehp.backend.common.security.JwtService;
import com.ehp.backend.user.entity.User;
import com.ehp.backend.user.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import com.ehp.backend.user.entity.Role;

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
    public String register(RegisterRequest request) {

        // Check duplicate email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(
                    "Email already exists."
            );
        }

        // Check duplicate phone number
        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new PhoneNumberAlreadyExistsException(
                    "Phone number already exists."
            );
        }

        // Create user
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .role(Role.PATIENT)
                .enabled(false)
                .build();

        // Save user
        userRepository.save(user);

        // Generate and send OTP
        emailVerificationService.generateAndSendOtp(
                request.getEmail()
        );

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