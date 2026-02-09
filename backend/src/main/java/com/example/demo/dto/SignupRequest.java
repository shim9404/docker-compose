package com.example.demo.dto;

import lombok.Data;

@Data
public class SignupRequest {
    private Long id;
    private String username;
    private String email;
    private String password;
    private String role;
}
