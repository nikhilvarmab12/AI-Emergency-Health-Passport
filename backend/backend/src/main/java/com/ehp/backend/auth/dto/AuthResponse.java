package com.ehp.backend.auth.dto;

import com.ehp.backend.user.entity.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String token;

    private Long userId;

    private String fullName;

    private String email;

    private Role role;

    private String message;
}