import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const KakaoRedirect = () => {
  const navigate = useNavigate();
  // kakao에서 보내주는 인가코드 받기
  const code = new URL(window.location.href).searchParams.get('code');
  console.log(code);
  useEffect(()=> {
    const kakaoLogin = async() => {
      const response = await axios.post(`${import.meta.env.VITE_SPRING_IP}member/kakao/doLogin`,{code: code});
      const token = response.data.token
      console.log(response)

      if (token){
        navigate('/home');
      }else {
        alert("AccessToken이 없습니다.");
      }
    }
    kakaoLogin();
  },[])
  return (
    <>
      loading...
    </>
  )
}

export default KakaoRedirect
