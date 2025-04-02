import { Stack, useMediaQuery } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import { theme } from "../theme/theme";

const MainContent = () => {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Stack
      sx={{
        height: "100vh",
        backgroundColor: theme.palette.bgForm.black1,
        padding: isSmallScreen ? "8px" : "16px",
        overflowY: "auto",
      }}
    >
      <Outlet />
    </Stack>
  );
};

export default MainContent;
