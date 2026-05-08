import { Box, Stack } from "@mui/material";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import MainContent from "../../components/MainContent";

const LandingPage = () => {
  return (
    <Stack sx={{ flexDirection: "row", height: "100vh" }}>
      <Sidebar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflowY: "auto",
          flex: 1,
        }}
      >
        <Header />
        <MainContent />
      </Box>
    </Stack>
  );
};

export default LandingPage;
