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
import Company from "../pages/Masterlist/CompanySync/Company";
import Business from "../pages/Masterlist/BusinessUnitSync/Business";
import Department from "../pages/Masterlist/DepartmentSync/Department";
import Unit from "../pages/Masterlist/UnitSync/Unit";
import SubUnit from "../pages/Masterlist/SubUnitSync/SubUnit";
import Location from "../pages/Masterlist/LocationSync/Location";
import Category from "../pages/Masterlist/Category/Category";
import SubCategory from "../pages/Masterlist/Sub-Category/SubCategory";

import RequestsPage from "../pages/Request/RequestsPage";
import RequestTickets from "../pages/Request/RequestTickets/RequestTickets";
import ConcernTickets from "../pages/Request/ConcernTickets/ConcernTickets";

import ChannelPage from "../pages/ChannelSetup/ChannelPage";
import Receiver from "../pages/ChannelSetup/Receiver/Receiver";
import Channel from "../pages/ChannelSetup/Channel/Channel";
import Approver from "../pages/ChannelSetup/Approver/Approver";

import ReceiverPage from "../pages/Request/ReceiverPage";
import ReceiverConcerns from "../pages/Request/ConcernTickets_Receiver/ReceiverConcerns";
import ReceiverCloseTickets from "../pages/Receiver/ClosingTickets/ReceiverCloseTickets";

import TicketingPage from "../pages/Tickets/TicketingPage";
import IssueHandlerConcerns from "../pages/Tickets/IssueHandlerConcerns/IssueHandlerConcerns";
import ApproverPage from "../pages/Approver/ApproverPage";
import Approval from "../pages/Approver/Approval/Approval";
import NewReceiverConcern from "../pages/Request/ReceiverConcernV2/NewReceiverConcern";

import ReportsPage from "../pages/Reports/ReportsPage";
import ChangePassword from "../pages/ChangePassword/ChangePassword";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/",
    element: <Private Render={LandingPage} />,
    children: [
      // {
      //   path: "/",
      //   element: <LandingPage />,
      // },

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
            path: "/masterlist/company",
            element: <Company />,
          },
          {
            path: "/masterlist/business-unit",
            element: <Business />,
          },
          {
            path: "/masterlist/department",
            element: <Department />,
          },
          {
            path: "/masterlist/unit",
            element: <Unit />,
          },
          {
            path: "/masterlist/sub-unit",
            element: <SubUnit />,
          },
          {
            path: "/masterlist/location",
            element: <Location />,
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
            path: "/masterlist/receiver-setup",
            element: <Receiver />,
          },
          {
            path: "/masterlist/channel-setup",
            element: <Channel />,
          },
          {
            path: "/masterlist/approver-setup",
            element: <Approver />,
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
