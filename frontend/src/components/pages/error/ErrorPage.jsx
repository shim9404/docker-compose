import React from 'react'

const ErrorPage = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      <h1>권한이 없습니다.</h1>
      <p>접근할 수 없는 페이지입니다.</p>
    </div>
  )
}

export default ErrorPage