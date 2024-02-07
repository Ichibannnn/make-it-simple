import React from "react";
import Header from "../../components/Header";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Sidebar from "../../components/Sidebar";
import MainContent from "../../components/MainContent";

const LandingPage = () => {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <Header />
        <MainContent />
      </Box>
    </Box>
  );
};

export default LandingPage;
