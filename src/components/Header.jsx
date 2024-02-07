import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import { theme } from "../theme/theme";

import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import PersonIcon from "@mui/icons-material/Person";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUserDetails } from "../features/user/userSlice";
import ReusableAlert from "../hooks/ReusableAlert";

const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fullName = useSelector((state) => state.user.fullname);
  const userName = useSelector((state) => state.user.username);

  // console.log("Details: ", userDetails);

  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({
    severity: "",
    title: "",
    description: "",
  });

  const menuHandler = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeHandler = () => {
    setAnchorEl(null);
  };

  const logoutHandler = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");

      dispatch(clearUserDetails());
    } catch (error) {
      setAlertData({
        severity: "error",
        title: "Error!",
        description: `Something went wrong.`,
      });
      setShowAlert(true);
    }
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  return (
    <Stack
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: "64px",
        backgroundColor: theme.palette.bgForm.black1,
        color: "#fff",
        paddingLeft: "16px",
        paddingRight: "16px",
      }}
    >
      <Box></Box>

      <Box>
        <IconButton>
          <Tooltip title="Notification">
            <NotificationsNoneOutlinedIcon />
          </Tooltip>
        </IconButton>

        <IconButton onClick={menuHandler}>
          <Tooltip title="Account">
            <PermIdentityOutlinedIcon />
          </Tooltip>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={closeHandler}
          onClick={closeHandler}
          // sx={{ backgroundColor: "red" }}
          // transformOrigin={{ horizontal: "right", vertical: "top" }}
          // anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={closeHandler}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                padding: "0px",
              }}
            >
              <Typography
                sx={{ fontSize: "1rem", fontWeight: "400", lineWeight: "1.5" }}
              >
                {fullName}
              </Typography>
              <Typography
                sx={{ fontSize: "1rem", fontWeight: "400", lineWeight: "1.5" }}
              >
                {userName}
              </Typography>
            </Box>
          </MenuItem>
          <Divider />
          <MenuItem onClick={closeHandler}>
            <ListItemIcon>
              <PersonAdd fontSize="small" />
            </ListItemIcon>
            <Typography color="#A0AEC0">Add another account</Typography>
          </MenuItem>
          <MenuItem onClick={closeHandler}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
          <MenuItem onClick={logoutHandler}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Box>
      {showAlert && (
        <ReusableAlert
          severity={alertData.severity}
          title={alertData.title}
          description={alertData.description}
          onClose={handleAlertClose}
        />
      )}
    </Stack>
  );
};

export default Header;
