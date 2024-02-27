import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import authReducer from "../features/auth/authSlice";
import userReducer from "../features/user/userSlice";
import sidebarReducer from "../features/sidebar/sidebarSlice";

import { loginApi } from "../features/login/loginSlice";
import { userApi } from "../features/user/userApi";
import { sedarApi } from "../features/sedar/sedarApi";
import { roleApi } from "../features/role/roleApi";
import { companyApi } from "../features/company/companyApi";
import { ymirApi } from "../features/ymir/ymirApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    sidebar: sidebarReducer,

    [loginApi.reducerPath]: loginApi.reducer,

    [userApi.reducerPath]: userApi.reducer,
    [roleApi.reducerPath]: roleApi.reducer,
    [companyApi.reducerPath]: companyApi.reducer,

    [sedarApi.reducerPath]: sedarApi.reducer,
    [ymirApi.reducerPath]: ymirApi.reducer,
  },

  middleware: (getDefaultMiddleWare) =>
    getDefaultMiddleWare().concat([
      loginApi.middleware,

      userApi.middleware,
      roleApi.middleware,
      companyApi.middleware,

      sedarApi.middleware,
      ymirApi.middleware,
    ]),
});

setupListeners(store.dispatch);
