package com.ehp.backend.auth.controller;

import com.ehp.backend.auth.dto.LoginRequest;
import com.ehp.backend.auth.dto.LoginResponse;
import com.ehp.backend.auth.dto.RegisterRequest;
import com.ehp.backend.auth.service.AuthService;
import com.ehp.backend.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        String message = authService.register(request);

        ApiResponse response = ApiResponse.builder()
                .success(true)
                .message(message)
                .build();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        LoginResponse response = authService.login(request);

        return ResponseEntity.ok(response);
    }
}