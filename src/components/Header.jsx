import {
  Avatar,
  Badge,
  Box,
  Chip,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React from "react";
import { theme } from "../theme/theme";

import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import PersonIcon from "@mui/icons-material/Person";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  clearUserDetails,
  user,
} from "../features/user_management_api/user/userSlice";
import ReusableAlert from "../hooks/ReusableAlert";
import { toggleSidebar } from "../features/sidebar/sidebarSlice";
import { PermIdentityOutlined } from "@mui/icons-material";

import { concernApi } from "../features/api_request/concerns/concernApi";
import { concernReceiverApi } from "../features/api_request/concerns_receiver/concernReceiverApi";

const Header = () => {
  const hideMenu = useMediaQuery("(max-width: 1069px)");

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fullName = useSelector((state) => state.user.fullname);
  const userName = useSelector((state) => state.user.username);
  const userRoleName = useSelector((state) => state.user.userRoleName);

  const [showSidebar, setShowSidebar] = useState(false);

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

      dispatch(concernApi.util.resetApiState());
      dispatch(concernReceiverApi.util.resetApiState());

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

  const toggleSidebarHandler = () => {
    dispatch(toggleSidebar());
  };

  return (
    <Stack
      sx={{
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
      <Box>
        {hideMenu && (
          <Box>
            <IconButton onClick={toggleSidebarHandler}>
              <MenuOutlinedIcon />
            </IconButton>
          </Box>
        )}
      </Box>

      <Box>
        {/* <IconButton>
          <Tooltip title="Notification">
            <Badge badgeContent={1} color="primary">
              <NotificationsNoneOutlinedIcon />
            </Badge>
          </Tooltip>
        </IconButton> */}

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
        >
          <MenuItem onClick={closeHandler}>
            <Box
              sx={{
                flexDirection: "column",
                padding: "0px",
              }}
            >
              <Typography
                sx={{ fontSize: "1rem", fontWeight: "400", lineWeight: "1.5" }}
              >
                {fullName}
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                <Typography
                  sx={{
                    fontSize: ".8rem",
                    fontWeight: "400",
                    lineWeight: "1.5",
                    color: "#A0AEC0",
                  }}
                >
                  {userName}
                </Typography>

                {/* <Chip
                  icon={<PermIdentityOutlined color="primary" />}
                  label={userRoleName}
                  variant="outlined"
                  size="small"
                  color="primary"
                  sx={{
                    color: "#fff",
                  }}
                /> */}
              </Box>
            </Box>
          </MenuItem>
          <Divider color="#1C2536" variant="fullWidth" />
          <MenuItem onClick={closeHandler}>
            <ListItemIcon>
              <PersonAdd fontSize="small" />
            </ListItemIcon>
            <Typography>Add another account</Typography>
          </MenuItem>
          <MenuItem onClick={closeHandler}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            <Typography>Settings</Typography>
          </MenuItem>
          <MenuItem onClick={logoutHandler}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            <Typography>Logout</Typography>
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
