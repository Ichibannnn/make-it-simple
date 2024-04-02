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
import Tickets from "../pages/Request/Tickets/Tickets";
import ConcernTickets from "../pages/Request/ConcernTickets/ConcernTickets";

import ChannelPage from "../pages/ChannelSetup/ChannelPage";
import Receiver from "../pages/ChannelSetup/Receiver/Receiver";
import Channel from "../pages/ChannelSetup/Channel/Channel";
import Approver from "../pages/ChannelSetup/Approver/Approver";

export const router = createBrowserRouter([
  {
    path: "*",
    element: <PageNotFound />,
  },
  {
    path: "/",
    element: <Login />,
  },
  {
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
        ],
      },
      {
        path: "/channel-setup",
        element: <ChannelPage />,
        children: [
          {
            path: "/channel-setup/receiver",
            element: <Receiver />,
          },
          {
            path: "/channel-setup/channel",
            element: <Channel />,
          },
          {
            path: "/channel-setup/approver",
            element: <Approver />,
          },
        ],
      },
      {
        path: "/request",
        element: <RequestsPage />,
        children: [
          {
            path: "/request/concerns",
            element: <ConcernTickets />,
          },
          // {
          //   path: "/request/tickets",
          //   element: <Tickets />,
          // },
          // {
          //   path: "/request/requested-tickets",
          //   element: <RequestTickets />,
          // },
        ],
      },
    ],
  },
]);
