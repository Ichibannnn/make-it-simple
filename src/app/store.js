import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import authReducer from "../features/auth/authSlice";
import userReducer from "../features/user_management_api/user/userSlice";
import sidebarReducer from "../features/sidebar/sidebarSlice";
import attachmentReducer from "../features/global/attachmentSlice";
import rootReducer from "../features/global/rootSlice";
import webTicketsReducer from "../features/global/webTicketSlice";
import ticketingReducer from "../";

import { sedarApi } from "../features/sedar/sedarApi";
import { ymirApi } from "../features/ymir/ymirApi";

import { smsNotificationApi } from "../features/sms_notification/smsNotificationApi";
import { api } from "../features/index";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    sidebar: sidebarReducer,
    attachment: attachmentReducer,
    root: rootReducer,
    webTickets: webTicketsReducer,

    [api.reducerPath]: api.reducer,

    [sedarApi.reducerPath]: sedarApi.reducer,
    [ymirApi.reducerPath]: ymirApi.reducer,
    [smsNotificationApi.reducerPath]: smsNotificationApi.reducer,
  },

  middleware: (getDefaultMiddleWare) => getDefaultMiddleWare().concat([api.middleware, sedarApi.middleware, ymirApi.middleware, smsNotificationApi.middleware]),
});

setupListeners(store.dispatch);
