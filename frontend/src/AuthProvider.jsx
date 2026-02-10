import React from 'react'
import { Navigate } from 'react-router-dom';

// 토큰 유무 체크 -> 없으면 루트(이 프로젝트에선 로그인)페이지로 이동
const AuthProvider = ({ children }) => {

  const token = window.localStorage.getItem("accessToken");
  if (!token) {
    return <Navigate to="/" />
  } else {
    return children
  }

}

export default AuthProvider

