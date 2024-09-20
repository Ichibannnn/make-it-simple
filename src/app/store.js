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
import { ticketApprovalApi } from "../features/api_ticketing/approver/ticketApprovalApi";
import { closingTicketApi } from "../features/api_ticketing/receiver/closingTicketApi";

import { notificationApi } from "../features/api_notification/notificationApi";
import { notificationMessageApi } from "../features/api_notification_message/notificationMessageApi";
import notificationMiddleware from "../middleware/notificationMiddleware";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    sidebar: sidebarReducer,

    [notificationApi.reducerPath]: notificationApi.reducer,
    [notificationMessageApi.reducerPath]: notificationMessageApi.reducer,

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

    [ticketApprovalApi.reducerPath]: ticketApprovalApi.reducer,
    [closingTicketApi.reducerPath]: closingTicketApi.reducer,

    [sedarApi.reducerPath]: sedarApi.reducer,
    [ymirApi.reducerPath]: ymirApi.reducer,
  },

  middleware: (getDefaultMiddleWare) =>
    getDefaultMiddleWare().concat([
      notificationApi.middleware,
      notificationMessageApi.middleware,

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

      ticketApprovalApi.middleware,
      closingTicketApi.middleware,

      sedarApi.middleware,
      ymirApi.middleware,

      // notificationMiddleware,
    ]),
});

setupListeners(store.dispatch);
