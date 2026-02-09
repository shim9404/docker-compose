package com.example.demo.service;

import com.example.demo.dto.MemberLoginDto;
import com.example.demo.model.Member;
import com.example.demo.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

@Log4j2
@Service
@RequiredArgsConstructor
public class MemberService {
    private final MemberRepository memberRepository;

    public void memberInsert(Member member) {
        memberRepository.save(member);
    }//end of memberInsert

    public Member getMemberEmail(MemberLoginDto memberLoginDto) {
        Member member = new Member();
        return member;
    }
}
