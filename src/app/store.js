import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import authReducer from "../features/auth/authSlice";
import userReducer from "../features/user/userSlice";
import sidebarReducer from "../features/sidebar/sidebarSlice";

import { loginApi } from "../features/login/loginSlice";
import { userApi } from "../features/user/userApi";
import { sedarApi } from "../features/sedar/sedarApi";
import { roleApi } from "../features/role/roleApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    sidebar: sidebarReducer,

    [loginApi.reducerPath]: loginApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [sedarApi.reducerPath]: sedarApi.reducer,
    [roleApi.reducerPath]: roleApi.reducer,
  },

  middleware: (getDefaultMiddleWare) =>
    getDefaultMiddleWare().concat([
      loginApi.middleware,
      userApi.middleware,
      sedarApi.middleware,
      roleApi.middleware,
    ]),
});

setupListeners(store.dispatch);
