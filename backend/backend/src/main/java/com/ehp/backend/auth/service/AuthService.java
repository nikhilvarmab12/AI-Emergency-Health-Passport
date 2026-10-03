package com.ehp.backend.auth.service;

import com.ehp.backend.auth.dto.LoginRequest;
import com.ehp.backend.auth.dto.LoginResponse;
import com.ehp.backend.auth.dto.RegisterRequest;

public interface AuthService {

    String register(RegisterRequest request);

    LoginResponse login(LoginRequest request);
}