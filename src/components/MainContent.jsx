import { Stack } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import { theme } from "../theme/theme";

const MainContent = () => {
  return (
    <Stack
      sx={{
        height: "100vh",
        backgroundColor: theme.palette.bgForm.black1,
      }}
    >
      <Outlet />
    </Stack>
  );
};

export default MainContent;
