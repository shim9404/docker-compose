import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const GoogleRedirect = () => {
  const navigate = useNavigate();
  // 구글에서 보내주는 인가코드 받기
  const code = new URL(window.location.href).searchParams.get('code');
  console.log(code);
  useEffect(()=> {
    const googleLogin = async() => {
      const response = await axios.post(`${import.meta.env.VITE_SPRING_IP}member/google/doLogin`,{code: code});
      const token = response.data.token;
      const email = response.data.email;
      localStorage.setItem("token", token);
      localStorage.setItem("email", email);
      console.log(response)
      // 토큰이 생성되면 홈화면으로 이동
      if (token){
        navigate('/home');
      }else {
        alert("AccessToken이 없습니다.");
      }
    }

    googleLogin();
  },[])

  return (
    <>
      loading...
    </>
  )
}

export default GoogleRedirect
