import React from 'react'
import { Navigate } from 'react-router-dom';

const AuthProvider = ({children}) => {

  const token = window.localStorage.getItem("accessToken");
  if (!token) {
    return <Navigate to="/" />
  } else {
    return children
  }

}

export default AuthProvider

