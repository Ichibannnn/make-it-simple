import { Stack, Typography } from "@mui/material";
import React from "react";
import { theme } from "../theme/theme";

const Sidebar = () => {
  return (
    <Stack
      sx={{
        width: "280px",
        height: "100%",
        backgroundColor: theme.palette.bgForm.black2,
      }}
    >
      <SidebarHeader />
      <SidebarList />
      <SidebarFooter />
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
            fontSize: "13px",
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
  return <div>{/* Content */}</div>;
};

const SidebarFooter = () => {
  return <div>{/* Footer */}</div>;
};
