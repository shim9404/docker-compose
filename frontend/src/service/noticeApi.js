import axios from "axios";


const api = axios.create({
  baseURL: import.meta.env.VITE_SPRING_IP,
  headers: { "Content-Type": "application/json;charset=utf-8", }
})

// 요청 시 localStorage의 accessToken 헤더에 담기
api.interceptors.request.use((config) => {
  const accessToken = window.localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
})

// 공지사항 등록하기 json포맷
export const noticeInsertDB = async (notice) => {
  const res = await api.post('notice', notice);
  console.log(res.data);
  return res;
}

export const noticeUpdateDB = async (notice) => {
  const res = await api.put(`notice/${notice.no}`, notice);
  console.log(res.data);
  return res;
}

export const noticeListDB = async (params) => {
  const res = await api.get('notice/list', { params });
  // const res = await api.get(`notice/list?gubun=${params.gubun}&keyword=${params.keyword}`)
  console.log(res)
  return res;
}

