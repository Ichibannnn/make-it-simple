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

import { receiverApi } from "../features/api_channel_setup/receiver/receiverApi";
import { channelApi } from "../features/api_channel_setup/channel/channelApi";
import { approverApi } from "../features/api_channel_setup/approver/approverApi";

import { concernApi } from "../features/api_request/concerns/concernApi";
import { concernReceiverApi } from "../features/api_request/concerns_receiver/concernReceiverApi";

import { sedarApi } from "../features/sedar/sedarApi";
import { ymirApi } from "../features/ymir/ymirApi";
import { concernIssueHandlerApi } from "../features/api_ticketing/issue_handler/concernIssueHandlerApi";

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
    [channelApi.reducerPath]: channelApi.reducer,
    [approverApi.reducerPath]: approverApi.reducer,

    [concernApi.reducerPath]: concernApi.reducer,
    [concernReceiverApi.reducerPath]: concernReceiverApi.reducer,

    [concernIssueHandlerApi.reducerPath]: concernIssueHandlerApi.reducer,

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
      channelApi.middleware,
      approverApi.middleware,

      concernApi.middleware,
      concernReceiverApi.middleware,

      concernIssueHandlerApi.middleware,

      sedarApi.middleware,
      ymirApi.middleware,
    ]),
});

setupListeners(store.dispatch);
