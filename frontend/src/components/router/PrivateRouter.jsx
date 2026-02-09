

// 역할 기반 접근 제어 (백엔드 1차 -> 프론트 2차 가드)
// role : 현재 유저 권한

const PrivateRouter = ({role, children, allowedRoles}) => {
  const userRole = role;

  if (allowedRoles.includes(userRole)){
    return children;
  }else{
    // 권한 없음
    // 허용되지 않은 경우, 예를 들어 로그인 페이지나 접근 제한 페이지로 리다이렉트 될 수 있음
    // 아니면 에러 페이지로 이동 처리함(replace로 뒤로가기 접근 불가)
    return (
      <Navigate to="/error" replace/>
    )
  }

}

export default PrivateRouter
