import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import authReducer from "../features/auth/authSlice";
import userReducer from "../features/user/userSlice";

import { loginApi } from "../features/login/loginSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,

    [loginApi.reducerPath]: loginApi.reducer,
  },

  middleware: (getDefaultMiddleWare) =>
    getDefaultMiddleWare().concat([loginApi.middleware]),
});

setupListeners(store.dispatch);
