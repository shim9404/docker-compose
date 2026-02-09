package com.example.demo.model;

import lombok.Data;

@Data
public class JwtAuthenticationResponse {
    private Long id;
    private String accessToken;
    private String refreshToken;
    private String role;
    private String username;
    private String email;
}
