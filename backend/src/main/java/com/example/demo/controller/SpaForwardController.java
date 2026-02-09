package com.example.demo.controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.extern.log4j.Log4j2;
/*
아래 코드는 **Spring Boot(서버) + React/Vue 같은 SPA(프론트)**를 같이
배포할 때, "새로고침(F5) / 주소 직접 입력" 시 404가 나는 문제를 막기 위한
라우팅 우회(포워딩) 컨트롤러입니다.
 * ✅ SPA Forward Controller
 * - React/Vue 등 SPA는 라우팅을 "브라우저에서" 처리함(예: /notice/3, /mypage).
 * - 사용자가 /notice/3로 직접 접속하거나 새로고침하면,
 *   서버(Spring)는 "이 URL에 해당하는 컨트롤러/정적파일이 있나?"를 먼저 찾는데,
 *   없으면 404가 발생할 수 있음.
 *
 * - 그래서 "확장자가 없는 요청(= 보통 SPA 라우트)"은 전부 index.html로 보내고,
 *   그 다음부터는 SPA 라우터(React Router 등)가 화면을 렌더링하도록 만든다.
*/
@Log4j2
@Controller
public class SpaForwardController {
    /**
     * ✅ RequestMapping 패턴 설명
     *
     * 1) "/{path:[^\\.]*}"
     *    - 최상위 경로 1단계 매칭
     *    - {path: ... } 는 PathVariable 같은 "가변 경로"를 의미하지만 여기서는 값을 쓰지 않음
     *    - 정규식 [^\\.]*  => "."(점)이 없는 문자열만 매칭
     *      예) /login, /about, /notice    ✅ 매칭
     *      예) /app.js, /style.css        ❌ 매칭 안됨 (정적 리소스 보호)
     */
    //2) "/**/{path:[^\\.]*}"
    /*
     *    - 하위 경로(여러 단계)까지 매칭
     *      예) /notice/3, /user/profile/edit  ✅ 매칭
     *      예) /assets/logo.png               ❌ 매칭 안됨 (점 포함)
     *
     * ✅ 즉, "확장자 없는 모든 경로"를 index.html로 forward 시킨다.
     */
    @RequestMapping(value = {"/{path:[^\\.]*}", "/**/{path:[^\\.]*}"})
    public String forward() {
        log.info("forward");
        /**
         * ✅ "forward:/index.html" 의미
         * - redirect가 아니라 forward임
         *
         * - redirect:/index.html :
         *    브라우저에게 "index.html로 다시 요청해"라고 지시(주소창이 바뀔 수 있음)
         *
         * - forward:/index.html :
         *    서버 내부에서 index.html로 "내부 위임" 처리(주소창은 그대로 유지)
         *    => SPA 라우팅에서는 이 방식이 흔히 사용됨.
         *
         * 결과:
         *  - /notice/3 로 접근해도 서버가 index.html을 반환
         *  - React Router가 URL(/notice/3)을 보고 해당 페이지 컴포넌트 렌더링
         */
        return "forward:/index.html";
    }
}