import { jwtDecode } from 'jwt-decode';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshTokenDB } from '../../service/authApi';

/**
 * ✅ 기능 요약
 * 1) accessToken 만료 여부 체크
 * 2) 만료 임박(remain <= 90초)하면 confirm을 "딱 1번" 띄움
 * 3) 사용자가 동의하면 refresh API 호출해서 새 토큰으로 교체
 * @param {string} token accessToken
 * @returns {boolean} isTokenExpired => 토큰이 만료되었는지 여부
 */
const useTokenExpiration = (token, setToken) => {
  const navigate = useNavigate();

  /**
   * useRef를 쓰는 이유 (매우 중요)
   * - state처럼 렌더링을 발생시키지 않음
   * - 값이 바뀌어도 화면 갱신이 필요 없는 "플래그"에 적합
   * - interval로 반복 체크할 때, 값이 계속 유지되어야 함
   */

  // ✅ askedRef: "이번 만료 임박 구간에서" confirm을 이미 띄웠는지
  // -> true가 되면, 남은 시간이 계속 90초 이하이어도 confirm을 다시 띄우지 않음  
  const askedRef = useRef(false);  
  // ✅ refreshingRef: refresh API 호출 중인지
  // -> refresh 요청 중에 check가 또 실행되어 중복 호출되는 것 방지
  const refreshingRef = useRef(false);   
  // ✅ 최종적으로 컴포넌트(App 등)가 받아서 "만료됨" 처리에 쓰는 값
  const [isTokenExpired, setIsTokenExpired] = useState(false);
  // ✅ 디코딩한 exp(만료 시간, 초 단위 epoch)를 저장하려고 만듦
  const expRef = useRef(0);

  useEffect(() => {
    /**
     * check(): 토큰 만료/임박 여부를 검사하는 함수
     * - interval로 10초마다 반복 호출됨
     * - 내부에서 refresh까지 수행할 수 있으므로 async
    */    
    const check = async () => {
      // 1) 토큰이 없으면 = 로그인 상태가 아니거나 토큰이 삭제됨
      if (!token) {
        setIsTokenExpired(true);
        return;
      }
      // 2) jwtDecode로 토큰 해석 (payload의 exp를 얻기 위함)
      let decoded;
      try {
        decoded = jwtDecode(token);
        expRef.current = decoded.exp;
      } catch (e) {
        console.log(e);
        // 토큰이 깨졌거나 형식이 이상하면 만료로 처리
        setIsTokenExpired(true);
        return;
      }
      // 3) 현재 시간 (초 단위) - JWT exp는 보통 "초" 단위 epoch timestamp
      const now = Date.now() / 1000;
      // 4) exp가 없거나 exp <= now면 이미 만료
      if (!decoded?.exp || decoded.exp <= now) {
        setIsTokenExpired(true);
        return;
      }

      // 5) 여기까지 왔으면 "일단 유효"
      setIsTokenExpired(false);

      /**
       * ⚠ 주의:
       * jwt:
          secret: jbGFzcy4=
          expiration: ２ #분단위 - 2분으로 놓고 프론트는 90초 보다 작거나 같을 때로 테스트 
       * 6) 남은 시간(remain) 계산
      */
      let remain = expRef.current - now;
      console.log(remain);
      /**
       * 7) 만료 임박 조건:
       * - remain <= 90초
       * - 아직 confirm 안 띄움(askedRef false)
       * - refresh 진행 중 아님(refreshingRef false)
       *
       * ✅ 이 3조건을 모두 만족할 때만 confirm을 띄워서
       * "딱 한 번만" 사용자에게 묻는다.
      */
      if (remain <= 90 && !askedRef.current && !refreshingRef.current) {
        // confirm을 띄우기 전에 먼저 askedRef를 true로 잠금
        // -> confirm이 떠있는 동안 check()가 또 돌아도 팝업이 중복되지 않음        
        askedRef.current = true; // 먼저 잠금(중복팝업 방지)
        const agreed = window.confirm('토큰을 연장하시겠습니까?');

        // 8) 사용자가 동의하면 refresh 진행
        // - askedRef는 true 상태 유지 (같은 만료구간에서 다시 안 물어봄)
        if(agreed){
          refreshingRef.current = true;

          try {
            /**
             * RefreshTokenDB():
             * - refreshToken을 이용해 새 accessToken을 발급받는 API
             * - 성공하면 res.data.accessToken 등 내려온다고 가정
            */            
            const res = await RefreshTokenDB();
            const newAccessToken = res.data.accessToken;

            // 새 accessToken을 다시 decode하여 exp 갱신
            const newDecoded = jwtDecode(newAccessToken);
            expRef.current = newDecoded.exp;
            // 10) 새 토큰/사용자 정보 localStorage 갱신
            // -> 이후 요청에서 최신 accessToken 사용            
            localStorage.setItem("id", res.data.id);
            localStorage.setItem("accessToken", newAccessToken);
            localStorage.setItem("refreshToken", res.data.refreshToken);
            localStorage.setItem("email", res.data.email);
            localStorage.setItem("username", res.data.username);
            setToken(newAccessToken);
            console.log("갱신 완료");
            askedRef.current = false;  
            /**
             * (참고)
             * 여기서 "상위 컴포넌트가 token을 state로 들고 있지 않고"
             * localStorage에서만 읽는 구조라면,
             * 새 accessToken을 반영하기 위해 리렌더/상태 갱신이 필요할 수 있음.
             * (현재 훅은 매개변수 token을 기준으로 돌기 때문)
            */            
          } catch (err) {
            // refresh 실패 = refreshToken 만료/위변조/서버에러 가능
            console.log(err);
            setIsTokenExpired(true);
            navigate('/');// 로그인 페이지 등으로 이동
          } finally {
            refreshingRef.current = false;
          }
        }//end of else
      } else {
        console.log("remain > 90 " + remain);
        /**
         * 11) remain이 다시 충분히 커지면 askedRef를 false로 리셋
         * -> 다음번 만료 임박 시 다시 confirm 띄울 수 있음
         *
         * 예: refresh 성공해서 exp가 늘어나면 remain이 커짐
        */
        if (remain > 90) askedRef.current = false;
      }
    }//end of check

    // ✅ 마운트 직후 즉시 1회 체크
    check();

    // ✅ 10초마다 체크 (너무 자주 하면 성능/팝업 스트레스 ↑)
    const interval = setInterval(check, 1000 * 10);
    // ✅ 언마운트 시 interval 정리 (메모리 누수 방지)
    return () => clearInterval(interval);
  }, [token, navigate]);//주의:currentExp추가하면 연장여부 팝업계속 열림
  // end of useEffect

  // ✅ 외부(App 등)에서 "만료 여부"만 쉽게 쓸 수 있게 리턴
  return isTokenExpired;
};

export default useTokenExpiration;