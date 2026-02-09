package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity
@Data
@Table(name="member")
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true, length = 50)
    private String username;
    @Column(nullable = false, length = 100)
    private String password;
    @Column(nullable = false, unique = true, length = 50)
    private String email;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private RoleType role;//ROLE_USER,ROLE_MANAGER ,ROLE_ADMIN
    @CreationTimestamp // 시간이 자동입력됨
    private Timestamp createDate;
    //소셜 로그인 - 카카오
    @Column(nullable = true, length = 50)
    private String provider;//google, kakao, naver
    @Column(nullable = true, length = 50)
    private String providerId; //uid, 카카오식별자, 네이버 식별자
}
