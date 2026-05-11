import { createBrowserRouter } from "react-router-dom";
import { PageNotFound } from "../components/LottieComponents";

import Private from "../components/Private";
import Login from "../pages/Login/Login";
import LandingPage from "../pages/Layout/LandingPage";
import Overview from "../pages/Overview/Overview";

import UserManagement from "../pages/UserManagement/UserManagement";
import UserAccounts from "../pages/UserManagement/UserAccounts/UserAccounts";
import Roles from "../pages/UserManagement/Roles/Roles";

import MasterlistPage from "../pages/Masterlist/MasterlistPage";
import Category from "../pages/Masterlist/Category/Category";
import SubCategory from "../pages/Masterlist/Sub-Category/SubCategory";
import CategoryConcern from "../pages/Masterlist/ConcernCategory/CategoryConcern";
import OneCharging from "../pages/Masterlist/OneCharging/OneCharging";
import NewApprover from "../pages/ChannelSetup/ApproverSetup/NewApprover";
import PmsType from "../pages/Masterlist/PmsType/PmsType";
import Sites from "../pages/Masterlist/Sites/Sites";

import RequestsPage from "../pages/Request/RequestsPage";
import ConcernTickets from "../pages/Request/ConcernTickets/ConcernTickets";

import Receiver from "../pages/ChannelSetup/Receiver/Receiver";
import Channel from "../pages/ChannelSetup/Channel/Channel";
import ServiceProvider from "../pages/Masterlist/ServiceProvider/ServiceProvider";

import ReceiverPage from "../pages/Request/ReceiverPage";
import ReceiverCloseTickets from "../pages/Receiver/ClosingTickets/ReceiverCloseTickets";

import TicketingPage from "../pages/Tickets/TicketingPage";
import IssueHandlerConcerns from "../pages/Tickets/IssueHandlerConcerns/IssueHandlerConcerns";
import ApproverPage from "../pages/Approver/ApproverPage";
import Approval from "../pages/Approver/Approval/Approval";
import ViewTicketsPage from "../pages/Approver/ViewTickets/ViewTicketsPage";
import NewReceiverConcern from "../pages/Request/ReceiverConcernV2/NewReceiverConcern";

import ReportsPage from "../pages/Reports/ReportsPage";
import ChangePassword from "../pages/ChangePassword/ChangePassword";
import AuthRedirect from "./AuthRedirect";

import Redirect from "../pages/Redirect";
import Pms from "../pages/PMS/Pms";
import ChecklistManagementPage from "../pages/ChecklistManagement/ChecklistManagementPage";

export const router = createBrowserRouter([
  // {
  //   path: "/login",
  //   element: (
  //     <AuthRedirect>
  //       <Login />
  //     </AuthRedirect>
  //   ),
  // },

  {
    path: "/redirect",
    element: (
      <AuthRedirect>
        <Redirect />
      </AuthRedirect>
    ),
  },

  {
    path: "/",
    element: <Private Render={LandingPage} />,
    children: [
      {
        path: "/overview",
        element: <Overview />,
      },

      {
        path: "/user-management",
        element: <UserManagement />,
        children: [
          {
            path: "/user-management/user-account",
            element: <UserAccounts />,
          },
          {
            path: "/user-management/user-role",
            element: <Roles />,
          },
        ],
      },

      {
        path: "/masterlist",
        element: <MasterlistPage />,
        children: [
          {
            path: "/masterlist/one-charging",
            element: <OneCharging />,
          },

          {
            path: "/masterlist/category",
            element: <Category />,
          },
          {
            path: "/masterlist/sub-category",
            element: <SubCategory />,
          },
          {
            path: "/masterlist/concern-category",
            element: <CategoryConcern />,
          },
          {
            path: "/masterlist/receiver-setup",
            element: <Receiver />,
          },
          {
            path: "/masterlist/channel-setup",
            element: <Channel />,
          },
          {
            path: "/masterlist/service-provider",
            element: <ServiceProvider />,
          },
          {
            path: "/masterlist/approver-setup",
            element: <NewApprover />,
          },
          {
            path: "/masterlist/pms-type",
            element: <PmsType />,
          },
          {
            path: "/masterlist/sites",
            element: <Sites />,
          },
        ],
      },

      {
        path: "/requestor",
        element: <RequestsPage />,
        children: [
          {
            path: "/requestor/requestor-concerns",
            element: <ConcernTickets />,
          },
        ],
      },

      {
        path: "/receiver",
        element: <ReceiverPage />,
        children: [
          {
            path: "/receiver/receiver-concerns",
            element: <NewReceiverConcern />,
          },
          {
            path: "/receiver/close-tickets",
            element: <ReceiverCloseTickets />,
          },
        ],
      },

      {
        path: "/approver",
        element: <ApproverPage />,
        children: [
          {
            path: "/approver/approval",
            element: <Approval />,
          },
          {
            path: "/approver/view-tickets",
            element: <ViewTicketsPage />,
          },
        ],
      },

      {
        path: "/ticketing",
        element: <TicketingPage />,
        children: [
          {
            path: "/ticketing/issue-handler-tickets",
            element: <IssueHandlerConcerns />,
          },
        ],
      },

      {
        path: "/pms",
        element: <Pms />,
      },

      {
        path: "/checklist-management",
        element: <ChecklistManagementPage />,
      },

      {
        path: "/reports",
        element: <ReportsPage />,
      },

      {
        path: "*",
        element: <PageNotFound />,
      },
      {
        path: "/change-password",
        element: <ChangePassword />,
      },
    ],
  },
]);
