import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import authReducer from "../features/auth/authSlice";
import userReducer from "../features/user_management_api/user/userSlice";
import sidebarReducer from "../features/sidebar/sidebarSlice";

import { loginApi } from "../features/login/loginSlice";

import { roleApi } from "../features/user_management_api/role/roleApi";
import { userApi } from "../features/user_management_api/user/userApi";

import { companyApi } from "../features/api masterlist/company/companyApi";
import { businessUnitApi } from "../features/api masterlist/business-unit/businessUnitApi";
import { unitApi } from "../features/api masterlist/unit/unitApi";
import { departmentApi } from "../features/api masterlist/department/departmentApi";
import { subUnitApi } from "../features/api masterlist/sub-unit/subUnitApi";
import { locationApi } from "../features/api masterlist/location/locationApi";
import { categoryApi } from "../features/api masterlist/category_api/categoryApi";
import { subCategoryApi } from "../features/api masterlist/sub_category_api/subCategoryApi";

import { sedarApi } from "../features/sedar/sedarApi";
import { ymirApi } from "../features/ymir/ymirApi";
import { receiverApi } from "../features/api_channel_setup/receiver/receiverApi";

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
    [categoryApi.reducerPath]: categoryApi.reducer,
    [subCategoryApi.reducerPath]: subCategoryApi.reducer,

    [receiverApi.reducerPath]: receiverApi.reducer,

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
      categoryApi.middleware,
      subCategoryApi.middleware,

      receiverApi.middleware,

      sedarApi.middleware,
      ymirApi.middleware,
    ]),
});

setupListeners(store.dispatch);
