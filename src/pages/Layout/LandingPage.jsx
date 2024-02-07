import React from "react";
import Header from "../../components/Header";
import { Outlet } from "react-router-dom";
import { Box, Stack } from "@mui/material";
import Sidebar from "../../components/Sidebar";
import MainContent from "../../components/MainContent";

const LandingPage = () => {
  return (
    <Stack sx={{ flexDirection: "row", height: "100vh" }}>
      <Sidebar />
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <Header />
        <MainContent />
      </Box>
    </Stack>
  );
};

export default LandingPage;
