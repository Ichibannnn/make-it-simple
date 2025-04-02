import { Box } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";

const RequestsPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <Box height="100%">
        <Outlet />
      </Box>
    </Box>
  );
};

export default RequestsPage;
