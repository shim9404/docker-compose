package com.example.demo.config;

import com.example.demo.model.Member;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Base64;
import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.util.Date;
import java.util.function.Function;

/*
* JWT토큰을 발급하는 스프링 컴포넌트
* 이메일과 권한 정보를 안전하게 암호화해서 토큰으로 반환
* 이 토큰으로 사용자의 인증/인가 처리
* 토큰은 만료시간이 있어, 보안성을 높이고, 세션리스서비스 구현에 적합함.
*/
@Component
public class JwtTokenProvider {
    //인코딩된 시크릿값
    private final String secretKey; // yaml파일에 등록되어있어야함
    private final int expiration; // 만료(분)
    private Key SECRET_KEY; // java

    // 생성자
    public JwtTokenProvider(@Value("${jwt.secret}") String secretKey, @Value("${jwt.expiration}") int expiration) {
        this.secretKey = secretKey;
        this.expiration = expiration;
        // 첫번째 파라미터로 디코드 후 두번째 파라미터로 암호화
        this.SECRET_KEY = new SecretKeySpec(Base64.getDecoder().decode(secretKey), SignatureAlgorithm.HS512.getJcaName());
    }

    /*
    *claims 생성
    * JWT의 payload부분(=실제 데이터에 들어갈 내용
    * setSubject(email) : 이 토큰의 주인은 email(주체정보)
    * claims.put("role",role): 사용자 권한(로우 하이어라키)
    * 토큰 생성
    * setIssuedAt(now): 토큼 발급 시간
    * setExpiration() : 토큰 만료시간(현재 시간+유효시간)
    * signWith(SECRET_KEY): 앞서 만든 KEY로 HS512에서 알고리즘으로 서명
    *
    * 토큰 반환
    * .compact(): JWT문자열 직렬화해서 반환
    * 이 토큰을 프론트엔드에게 응답하면, 프론트는 이 access 토큰을 저장하고 api를 요청할 때마다 Authorization헤더에 넣어서 인증을 받는다.
    */

    public String createToken(String email, String role) {
        //Claims는 jwt토큰의 payload부분을 의미함.
        //각종 사용자 정보를 payload에 넣을 수 있다.
        Claims claims = Jwts.claims().setSubject(email);//주된 정보는 이메일로함
        claims.put("role", role);
        Date now = new Date();
        String token = Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now) //발행시간
                //getTime()은 밀리세크 단위이다.
                .setExpiration(new Date(now.getTime() + expiration*1000L*60))
                .signWith(SECRET_KEY)
                .compact();

        return token;
    } // end of createToken

    /*
    AccessToken재발급에 사용
    */
    public String createRefreshToken(String email, String role) {
        //Claims는 jwt토큰의 payload부분을 의미함.
        //각종 사용자 정보를 payload에 넣을 수 있다.
        Claims claims = Jwts.claims().setSubject(email);//주된 정보는 이메일로함
        claims.put("role", role);
        Date now = new Date();
        String token = Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now) //발행시간
                //만료 시간을 7일로 설정하기
                .setExpiration(new Date(now.getTime() + expiration*1000L*60*60*24*7)) // ms -> s -> m -> h -> day * 7 = 7일
                .signWith(SECRET_KEY)
                .compact();

        return token;
    } // end of createRefreshToken

    // Claims::getSubject - 람다식
    // 토큰에서 이메일 추출
    public String extractEmail(String token){
        return extractClaim(token, Claims::getSubject);
    } // end of extractEmail
    
    // 토큰에서 특정 값을 꺼내는 공용 메서드
    // <T> 이 메서드는 T라는 타입을 사용한다.
    // 아직 반환 타입이 정해지지 않은 경우 T로 사용
    private <T> T extractClaim(String token, Function<Claims, T> caimsResolvers ) {
        final Claims claims = extractAllClaims(token);
        // T로 온 함수 실행
        return caimsResolvers.apply(claims);
    } // end of extractClaim

    // 서명 검증 + payload 꺼내기
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(SECRET_KEY).build().parseClaimsJws(token).getBody();
    }// end of extractAllClaims

    // 만료 여부
    // true : 만료
    // false : 유효
    public boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    } // end of isTokenExpired

    public boolean isTokenValid(String token, Member pmemVO) {
        final String email = extractEmail(token);
        return (email.equals(pmemVO.getEmail()) && !isTokenExpired(token));
    } // end of isTokenValid
}
