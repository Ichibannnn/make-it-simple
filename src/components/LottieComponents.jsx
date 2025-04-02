import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/system";
import Lottie from "lottie-react";
import React from "react";

import pageNotFound from "../assets/page-not-found.json";
import { ChevronLeft } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const StyledBox = styled(Box)(() => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 9999,
  display: "flex",
  justifyContent: "center",
  alignItem: "center",
  flexDirection: "column",
}));

export const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <StyledBox justifyContent="center" alignItems="center" sx={{ background: "#111927" }}>
      <Lottie animationData={pageNotFound} style={{ padding: 0, margin: 0, height: 800 }} />

      <Button variant="contained" size="large" startIcon={<ChevronLeft />} onClick={() => navigate(-1)} disableElevation>
        Go Back
      </Button>
    </StyledBox>
  );
};
