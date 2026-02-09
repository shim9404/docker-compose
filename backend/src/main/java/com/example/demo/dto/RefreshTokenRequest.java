package com.example.demo.dto;

import lombok.Data;

// 사용자로부터 입력 받거나 혹은 화면으로부터 읽어들인 값을 서버에 전달할 때 사용
@Data
public class RefreshTokenRequest {
    private String refreshToken;
}

