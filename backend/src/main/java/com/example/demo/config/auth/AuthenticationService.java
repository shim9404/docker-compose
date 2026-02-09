package com.example.demo.config.auth;

import com.example.demo.config.JwtTokenProvider;
import com.example.demo.dto.MemberLoginDto;
import com.example.demo.dto.SignupRequest;
import com.example.demo.model.JwtAuthenticationResponse;
import com.example.demo.model.Member;
import com.example.demo.model.RoleType;
import com.example.demo.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Log4j2
@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final MemberRepository memberRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public JwtAuthenticationResponse signin(MemberLoginDto memberLoginDto) {
        Member member = memberRepository.findByEmail(memberLoginDto.getEmail());

        // 이메일 db에 없음 -> 미가입
        if (member == null) {
            throw new BadCredentialsException("이메일이 존재하지 않습니다.");
        }

        boolean isOk = bCryptPasswordEncoder.matches(memberLoginDto.getPassword(), member.getPassword());

        // 비번 체크
        if (!isOk) {
            throw new BadCredentialsException("비밀번호가 맞지 않습니다.");
        }

        log.info(member);
        Long id = member.getId();
        String username = member.getUsername();
        String role = member.getRole().toString();
        String email = member.getEmail();

        // accessToken과 refreshToken 추가
        String accessToken = jwtTokenProvider.createToken(member.getEmail(), member.getRole().name());
        String refreshToken = jwtTokenProvider.createRefreshToken(member.getEmail(), member.getRole().name());

        JwtAuthenticationResponse jaResponse = new JwtAuthenticationResponse();
        jaResponse.setId(id);
        jaResponse.setRole(role);
        jaResponse.setUsername(username);
        jaResponse.setAccessToken(accessToken);
        jaResponse.setRefreshToken(refreshToken);
        jaResponse.setEmail(email);

        return jaResponse;
    }

    public JwtAuthenticationResponse refreshToken(String prefreshToken) {
        String email = jwtTokenProvider.extractEmail(prefreshToken);
        Member rmember = memberRepository.findByEmail(email);
        if (jwtTokenProvider.isTokenValid(prefreshToken, rmember)) {
            String accessToken = jwtTokenProvider.createToken(rmember.getEmail(), rmember.getRole().name());
            String refreshToken = jwtTokenProvider.createRefreshToken(rmember.getEmail(), rmember.getRole().name());
            JwtAuthenticationResponse jaResponse = new JwtAuthenticationResponse();
            jaResponse.setRefreshToken(refreshToken);
            jaResponse.setAccessToken(accessToken);
            jaResponse.setRole(rmember.getRole().name());
            jaResponse.setEmail(rmember.getEmail());
            jaResponse.setUsername(rmember.getUsername());
            jaResponse.setId(rmember.getId());
            return jaResponse;
        }
        return null;
    }

    public Member signup(SignupRequest signupRequest) {
        Member member = new Member();
        member.setEmail(signupRequest.getEmail());
        member.setPassword(bCryptPasswordEncoder.encode(signupRequest.getPassword()));
        member.setUsername(signupRequest.getUsername());
        member.setRole(RoleType.valueOf(signupRequest.getRole()));
        return memberRepository.save(member);
    }
}
