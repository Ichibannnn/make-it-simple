import {
  Drawer,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { theme } from "../theme/theme";
import { useDispatch, useSelector } from "react-redux";

import { setSidebar, toggleSidebar } from "../features/sidebar/sidebarSlice";
import { user } from "../features/user/userSlice";

const Sidebar = () => {
  const isVisible = useSelector((state) => state.sidebar.isVisible);
  const dispatch = useDispatch();
  const hideSidebar = useMediaQuery("(max-width: 1069px)");

  useEffect(() => {
    dispatch(setSidebar(!hideSidebar));
  }, [dispatch, hideSidebar]);

  console.log("sidebar: ", hideSidebar);

  return (
    <Stack>
      {isVisible && (
        <Stack
          sx={{
            height: "100%",
            backgroundColor: theme.palette.bgForm.black2,
            width: "280px",
          }}
        >
          <SidebarHeader />
          <SidebarList />
          <SidebarFooter />
        </Stack>
      )}
    </Stack>
  );
};

export default Sidebar;

const SidebarHeader = () => {
  return (
    <Stack
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: "24px",
        gap: "5px",
        // width: "280px",
      }}
    >
      <img
        src="/images/dotek-login.png"
        alt="misLogo"
        width="56"
        height="38"
        className="logo-sidebar"
      />

      <Stack
        sx={{
          display: "flex",
          justifyContent: "start",
          flexDirection: "column",
          // alignItems: "center",
          flexGrow: 1,
        }}
      >
        <Typography
          sx={{
            margin: "0",
            fontSize: "1rem",
            fontWeight: "700",
            color: "#EDF2F7",
            lineHeight: "1.2",
          }}
          variant="h6"
          className="logo-title"
        >
          Make It Simple
        </Typography>
        <Typography
          sx={{
            margin: "0",
            fontSize: "14px",
            fontWeight: "450",
            color: "#A0AEC0",
            lineHeight: "1.2",
          }}
          variant="h1"
        >
          Development
        </Typography>
      </Stack>
    </Stack>
  );
};

const SidebarList = () => {
  const userPermission = useSelector((state) => state.user.permissions);

  return (
    <Stack>
      {/* {
        userPermission.includes("User Management") && (
          
        )
      } */}
    </Stack>
  );
};

const SidebarFooter = () => {
  return <div>{/* Footer */}</div>;
};
