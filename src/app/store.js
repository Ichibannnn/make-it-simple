import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import authReducer from "../features/auth/authSlice";
import userReducer from "../features/user/userSlice";
import sidebarReducer from "../features/sidebar/sidebarSlice";

import { loginApi } from "../features/login/loginSlice";
import { userApi } from "../features/user/userApi";
import { roleApi } from "../features/role/roleApi";
import { companyApi } from "../features/company/companyApi";
import { businessUnitApi } from "../features/business-unit/businessUnitApi";
import { departmentApi } from "../features/department/departmentApi";

import { sedarApi } from "../features/sedar/sedarApi";
import { ymirApi } from "../features/ymir/ymirApi";
import { unitApi } from "../features/unit/unitApi";
import { subUnitApi } from "../features/sub-unit/subUnitApi";
import { locationApi } from "../features/location/locationApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    sidebar: sidebarReducer,

    [loginApi.reducerPath]: loginApi.reducer,

    [userApi.reducerPath]: userApi.reducer,
    [roleApi.reducerPath]: roleApi.reducer,

    [companyApi.reducerPath]: companyApi.reducer,
    [businessUnitApi.reducerPath]: businessUnitApi.reducer,
    [departmentApi.reducerPath]: departmentApi.reducer,
    [unitApi.reducerPath]: unitApi.reducer,
    [subUnitApi.reducerPath]: subUnitApi.reducer,
    [locationApi.reducerPath]: locationApi.reducer,

    [sedarApi.reducerPath]: sedarApi.reducer,
    [ymirApi.reducerPath]: ymirApi.reducer,
  },

  middleware: (getDefaultMiddleWare) =>
    getDefaultMiddleWare().concat([
      loginApi.middleware,

      userApi.middleware,
      roleApi.middleware,

      companyApi.middleware,
      businessUnitApi.middleware,
      departmentApi.middleware,
      unitApi.middleware,
      subUnitApi.middleware,
      locationApi.middleware,

      sedarApi.middleware,
      ymirApi.middleware,
    ]),
});

setupListeners(store.dispatch);
