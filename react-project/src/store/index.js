import { configureStore } from "@reduxjs/toolkit";

import TodoListSlice from "./TodoLists-slice";
import LoginStateSlice from "./LoginState-slice";

const store = configureStore({
  reducer: {
    TodoListSlice: TodoListSlice.reducer,
    LoginStateSlice: LoginStateSlice.reducer,
  },
});

export default store;
