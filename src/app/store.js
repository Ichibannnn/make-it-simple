import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import authReducer from "../features/auth/authSlice";
import userReducer from "../features/user_management_api/user/userSlice";
import sidebarReducer from "../features/sidebar/sidebarSlice";

import { sedarApi } from "../features/sedar/sedarApi";
import { ymirApi } from "../features/ymir/ymirApi";

import { smsNotificationApi } from "../features/sms_notification/smsNotificationApi";
import { api } from "../features/index";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    sidebar: sidebarReducer,

    [api.reducerPath]: api.reducer,

    [sedarApi.reducerPath]: sedarApi.reducer,
    [ymirApi.reducerPath]: ymirApi.reducer,
    [smsNotificationApi.reducerPath]: smsNotificationApi.reducer,
  },

  middleware: (getDefaultMiddleWare) => getDefaultMiddleWare().concat([api.middleware, sedarApi.middleware, ymirApi.middleware, smsNotificationApi.middleware]),
});

setupListeners(store.dispatch);
