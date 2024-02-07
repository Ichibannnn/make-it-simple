import { createBrowserRouter } from "react-router-dom";
import { PageNotFound } from "../components/LottieComponents";

import Private from "../components/Private";
import Login from "../pages/Login/Login";
import LandingPage from "../pages/Layout/LandingPage";

import UserManagement from "../pages/UserManagement/UserManagement";
import UserAccounts from "../pages/UserManagement/UserAccounts/UserAccounts";
import Roles from "../pages/UserManagement/Roles/Roles";

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
    ],
  },
]);
