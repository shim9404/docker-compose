import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userInfoSlice from "./userInfoSlice";

const rootReducer = combineReducers({
  userInfoSlice: userInfoSlice.reducer
});

const store = configureStore({
  reducer: rootReducer
})

export default store;
