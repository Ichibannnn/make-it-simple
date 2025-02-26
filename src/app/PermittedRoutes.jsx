import React from "react";
import { useSelector } from "react-redux";

import { useLocation } from "react-router-dom";
import { PageNotFound } from "../components/LottieComponents";

import { sidebarNavigationData } from "./navigationData";

const PermittedRoutes = ({ Render }) => {
  const { pathname } = useLocation();
  const permissions = useSelector((state) => state.user.permissions);

  const allowedNavigationData = sidebarNavigationData.filter((item) => {
    return permissions?.includes(item.name);
  });

  // console.log("permissions: ", permissions);
  // console.log("allowedNavigationData: ", allowedNavigationData);

  const currentNavItem = allowedNavigationData.find((item) => pathname?.includes(item.path));
  // console.log("currentNavItem: ", currentNavItem);

  const currentSubNav = currentNavItem?.sub?.filter((subItem) => permissions?.includes(subItem.name));

  const permittedParentPath = allowedNavigationData?.map((item) => {
    return permissions?.includes(item.name) ? item.path : null;
  });

  const permittedSubPath = currentSubNav?.map((item) => {
    return permissions?.includes(item.name) ? item.path : null;
  });

  if (permittedParentPath?.includes(pathname) || permittedSubPath?.includes(pathname) || pathname === "/") {
    return <Render />;
  }

  return (
    <>
      <PageNotFound text={"You are not permitted to access this page"} />
    </>
  );
};

export default PermittedRoutes;
