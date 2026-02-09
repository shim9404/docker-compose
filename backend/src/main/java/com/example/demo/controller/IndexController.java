package com.example.demo.controller;

import com.example.demo.model.Member;
import com.example.demo.model.RoleType;
import com.example.demo.service.MemberService;
import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
// 스포츠 센터
// 역할(ROLE - 인가) : user, manager ,admin

@Log4j2
@Controller // - 각 메서드가 view를 리턴한다.
@RequiredArgsConstructor
public class IndexController {
    private final MemberService memberService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    // http://localhost:5173 => http://localhost:8000/index
    @GetMapping({ "/index" })
    public String index() {
        log.info("index");
        // -> /WEB-INF/views/{{index}}.jsp
        // 어노테이션이 RestController에서 Controller 변경됨
        // @RestController = @Controller + @ResponseBody -> 문자열 포맷
        // @Controller => 문자열이 출력으로 나갈 화면 이름이다.
        return "redirect:/index.jsp";// -> ViewResolver
    }// end of home
     // http://localhost:8000/user
     // @RestController = @Controller + @ResponseBody
     // @Controller를 사용하면 리턴값 String으로 화면이름을 찾음.
     // 그런데 @ResponseBody를 두면 평문으로 출력됨.

    @RolesAllowed("ROLE_USER")
    @GetMapping("/user")
    // public @ResponseBody String user(){
    public String user() {
        log.info("user");
        return "redirect:/userPage.jsp";
    }// end of user

    // http://localhost:8000/teacher
    @RolesAllowed("ROLE_TEACHER")
    @GetMapping("/teacher")
    public String teacher() {
        log.info("teacher");
        return "redirect:/teacherPage.jsp";
    }// end of teacher

    // http://localhost:8000/manager
    @RolesAllowed("ROLE_MANAGER")
    @GetMapping("/manager")
    public String manager() {
        log.info("manager");
        return "redirect:/managerPage.jsp";
    }// end of manager

    // http://localhost:8000/admin
    @RolesAllowed("ROLE_ADMIN")
    @GetMapping("/admin")
    public String admin() {
        log.info("admin");
        return "redirect:/adminPage.jsp";
    }// end of admin

    // 로그인 화면 요청하기
    // http://localhost:8000/loginForm
    @GetMapping("/loginForm")
    public String loginForm() {
        log.info("loginForm");
        return "redirect:/auth/loginForm.jsp";
    }// end of loginForm

    // 회원가입 화면 호출하기
    // http://localhost:8000/joinForm
    @GetMapping("/joinForm")
    public String joinForm() {
        log.info("joinForm");
        // auth/joinForm -> 응답페이지 화면 이름이다.
        // yaml -> /WEB-INF/views/ 접두어
        // 접미어 -> .jsp
        return "redirect:/auth/joinForm.jsp";
    }

    // http://localhost:8000/login-error
    @GetMapping("/login-error")
    public @ResponseBody String loginError() {
        log.info("login-error");
        return "아이디나 비밀번호가 맞지 않습니다.";
    }// end of loginError
     // 회원가입 구현하기

    @PostMapping("/join")
    public String join(Member member, @RequestParam("role") String role) {
        log.info("join");
        log.info("Member:: ");
        log.info(member);

        RoleType roleType = RoleType.valueOf(role);
        member.setRole(roleType);
        // 패스워드 암호화 하기
        String rawPassword = member.getPassword();
        String encPassword = bCryptPasswordEncoder.encode(rawPassword);
        // 비번 123으로 등록은 됨. 그러나 시큐리티 로그인 할 수 없음
        // 왜냐면 암호화가 되지 않은 비번에 대해서는 처리안됨
        member.setPassword(encPassword);
        memberService.memberInsert(member);
        return "redirect:/auth/loginForm.jsp";
    }

    @GetMapping("/access-denied")
    public String accessDenied() {
        log.info("accessDenied");
        return "redirect:/accessDenied.jsp";
    }// end of accessDenied
}
