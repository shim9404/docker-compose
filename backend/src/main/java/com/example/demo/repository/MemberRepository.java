package com.example.demo.repository;

import com.example.demo.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {
    public Member findByEmail(String email);
    //select * from member where providerId = ?
    public Member findByProviderId(String providerId);
}
