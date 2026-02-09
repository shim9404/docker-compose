import "bootstrap/dist/css/bootstrap.min.css"
import { Route, Routes, useNavigate } from "react-router-dom"
import BoardPage from "./components/pages/BoardPage";
import HomePage from "./components/pages/HomePage";
import IsTokenExpiration from "./components/auth/IsTokenExpiration";
import { useEffect, useState } from "react";
import AppRouter from "./components/router/AppRouter";


function App() { 
  const navigate = useNavigate();
  // token의 상태를 관리하기 위해서 useState사용
  const [token, setToken] = useState(() => {
    return window.localStorage.getItem('accessToken');
  });

  const isTokenExpired = IsTokenExpiration(token, setToken);
  
  console.log(isTokenExpired) ; // true이면 만료

  useEffect(()=> {
    if (isTokenExpired) {
      console.log("토큰 만료");
      window.localStorage.clear();
      navigate("/", {replace: true});
    }

    if (token) {
      console.log("토큰 갱신");
    }
  },[token, isTokenExpired, navigate])

  return (
    <>
    {/* 내부 페이지 라우팅 처리 */}
      <AppRouter/>
    </>
  )
}

export default App
