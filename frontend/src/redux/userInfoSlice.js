import { createSlice } from "@reduxjs/toolkit";

const userInfoSlice = createSlice({
  name: 'userInfoSlice',
  initialState: {},
  reducers: {
    // Redux에서 action은 요청 객체. 그일을 하는데 필요한 데이터를 접근할 때 payload를 붙이도록 되어있음
    setMemberInfo: (state, action) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.username = action.payload.username;
      state.role = action.payload.role;
      state.provider = action.payload.provider;
      state.providerId = action.payload.providerId;
    }
  }
})

// 화면 컴포넌트에서 dispatch(setMemberInfo(member))형태로 사용
export const { setMemberInfo } = userInfoSlice.actions;
export default userInfoSlice;