import axios from "axios";

export const RefreshTokenDB = async () => {
  const refreshToken = window.localStorage.getItem("refreshToken");
  if (!refreshToken) {
    throw new Error('No refresh token');
  }
  const url = `${import.meta.env.VITE_SPRING_IP}auth/refresh`;

  try {
    const res = axios.post(url,
      { "refreshToken": refreshToken },
      { 'headers': { 'Content-Type': 'application/json' } }
    );

    console.log(res);

    return res;

  } catch (e) {
    console.error("refresh token 요청 실패: " + e);
    throw e;
  }
}