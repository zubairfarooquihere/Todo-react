import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const LoginStateSlice = createSlice({
  name: "LoginState",
  initialState: {
    logIn: Cookies.get("token"),
    userName: Cookies.get("userName"),
  },
  reducers: {
    logIn(state, action) {
      const { token, expires, userName } = action.payload;
      const cookieValue = JSON.stringify({ token, userName });
      Cookies.set("token", cookieValue, { expires: expires / 24, secure: true, sameSite: "Strict" }); // Setting SameSite to Strict
      state.logIn = Cookies.get("token");
    },
    logOut(state) {
      Cookies.remove("token", { sameSite: "Strict" }); // Setting SameSite to Strict
      state.logIn = false;
    },
  },
});

export const LoginStateActions = LoginStateSlice.actions;
export default LoginStateSlice;
