package com.phlox.backend.service;

import com.phlox.backend.dto.AuthResponse;
import com.phlox.backend.dto.LoginRequest;
import com.phlox.backend.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
