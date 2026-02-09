package com.example.demo.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
public class JwtTokenFilter extends GenericFilter {
    @Value("${jwt.secret}")
    private String secretKey;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        String token = httpRequest.getHeader("Authorization");
        try{
            if (token != null) {
                if(!token.substring(0, 7).equals("Bearer ")) {
                    // 예외 던짐
                    throw new AuthenticationServiceException("Bearer 형식이 아닙니다.");
                }
                String jwtToken = token.substring(7);
                // 이 토큰을 가지고 검증하고 여기서 clasims는 payload를 가리키는데, 이것을 꺼내서 Authenitcation이라는 인증객체를 만들 때 사용
                Claims claims = Jwts.parserBuilder()
                        .setSigningKey(secretKey)
                        .build()
                        .parseClaimsJws(jwtToken)
                        .getBody();//검증을 하고 Claims를 꺼내는 메서드임
                List<GrantedAuthority> authorities = new ArrayList<>();//권한이 여러가지 일 수 있으므로 List에 담아줌.
                authorities.add(new SimpleGrantedAuthority("ROLE_" + claims.get("role")));
                UserDetails userDetails = new User(claims.getSubject(), "", authorities);
                Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, jwtToken, userDetails.getAuthorities());
                //인증정보는 SecurityContextHolder> SecurityContext > Authentication에 들어있다.
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
            // 토큰에 대한 검증이 완료되었으니 다시 원래 프로세스로 돌아간다.
            // 다음 체인 연결
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            e.printStackTrace();
            httpResponse.setStatus(HttpStatus.UNAUTHORIZED.value());//401응답줌
            httpResponse.setContentType("application/json");
            httpResponse.getWriter().write("invalid token");
        }

    }

}
