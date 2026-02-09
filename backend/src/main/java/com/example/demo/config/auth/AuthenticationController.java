package com.example.demo.config.auth;

import com.example.demo.dto.MemberLoginDto;
import com.example.demo.dto.RefreshTokenRequest;
import com.example.demo.dto.SignupRequest;
import com.example.demo.model.JwtAuthenticationResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@Log4j2
@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest signupRequest) {
        return ResponseEntity.ok(authenticationService.signup(signupRequest));
    }

    @PostMapping("/signin")
    public ResponseEntity<Map<String, Object>> signin(@RequestBody MemberLoginDto memberLoginDto) {
        JwtAuthenticationResponse jaResponse = authenticationService.signin(memberLoginDto);
        Map<String, Object> loginInfo = new HashMap<>();
        log.info("signin!");
        log.info(memberLoginDto);
        loginInfo.put("id", jaResponse.getId());
        loginInfo.put("accessToken", jaResponse.getAccessToken());
        loginInfo.put("refreshToken", jaResponse.getRefreshToken());
        loginInfo.put("role", jaResponse.getRole());
        loginInfo.put("email", jaResponse.getEmail());
        loginInfo.put("username", jaResponse.getUsername());

        return new ResponseEntity<>(loginInfo, HttpStatus.OK);
    }// end of signin

    @PostMapping("/refresh")
    public ResponseEntity<Map<String, Object>> refreshToken(@RequestBody RefreshTokenRequest refreshTokenRequest) {
        JwtAuthenticationResponse jaResponse = authenticationService
                .refreshToken(refreshTokenRequest.getRefreshToken());
        Map<String, Object> loginInfo = new HashMap<>();

        loginInfo.put("id", jaResponse.getId());
        loginInfo.put("accessToken", jaResponse.getAccessToken());
        loginInfo.put("refreshToken", jaResponse.getRefreshToken());
        loginInfo.put("role", jaResponse.getRole());
        loginInfo.put("email", jaResponse.getEmail());
        loginInfo.put("username", jaResponse.getUsername());

        return new ResponseEntity<>(loginInfo, HttpStatus.OK);
    }// end of signin

}
