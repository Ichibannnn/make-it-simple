import { Box, Divider, IconButton, ListItemIcon, Menu, MenuItem, Stack, Tooltip, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import { theme } from "../theme/theme";

import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import Logout from "@mui/icons-material/Logout";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { Password } from "@mui/icons-material";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUserDetails } from "../features/user_management_api/user/userSlice";
import { toggleSidebar } from "../features/sidebar/sidebarSlice";

import ReusableAlert from "../hooks/ReusableAlert";
import useDisclosure from "../hooks/useDisclosure";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { concernApi } from "../features/api_request/concerns/concernApi";
import { concernReceiverApi } from "../features/api_request/concerns_receiver/concernReceiverApi";
import { concernIssueHandlerApi } from "../features/api_ticketing/issue_handler/concernIssueHandlerApi";
import { ticketApprovalApi } from "../features/api_ticketing/approver/ticketApprovalApi";
import { closingTicketApi } from "../features/api_ticketing/receiver/closingTicketApi";

const Header = () => {
  // const hideMenu = useMediaQuery("(max-width: 1069px)");
  const hideMenu = useMediaQuery("(max-width: 1639px)");

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fullName = useSelector((state) => state.user.fullname);
  const userName = useSelector((state) => state.user.username);
  const userId = useSelector((state) => state.user.id);

  // console.log("User Details: ", details);

  const [showSidebar, setShowSidebar] = useState(false);

  const { open: openChangePassword, onToggle: changePasswordOnToggle, onClose: changePasswordOnClose } = useDisclosure();

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
      dispatch(concernIssueHandlerApi.util.resetApiState());
      dispatch(ticketApprovalApi.util.resetApiState());
      dispatch(closingTicketApi.util.resetApiState());

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

  const toggleChangePasswordHandler = () => {
    changePasswordOnToggle();
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
            <IconButton onClick={toggleSidebarHandler} aria-label="Toggle sidebar">
              <MenuOutlinedIcon />
            </IconButton>
          </Box>
        )}
      </Box>

      <Box>
        <IconButton onClick={menuHandler} aria-controls="account-menu" aria-haspopup="true">
          <Tooltip title="Account">
            <PermIdentityOutlinedIcon />
          </Tooltip>
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={closeHandler} onClick={closeHandler}>
          <MenuItem onClick={closeHandler}>
            <Box
              sx={{
                flexDirection: "column",
                padding: "0px",
              }}
            >
              <Typography sx={{ fontSize: "1rem", fontWeight: "400", lineWeight: "1.5" }}>{fullName}</Typography>

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
              </Box>
            </Box>
          </MenuItem>
          <Divider color="#1C2536" variant="fullWidth" />
          <MenuItem onClick={closeHandler}>
            <ListItemIcon>
              <Password fontSize="small" />
            </ListItemIcon>
            <Typography>Change Password</Typography>
          </MenuItem>

          <MenuItem onClick={logoutHandler}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            <Typography>Logout</Typography>
          </MenuItem>
        </Menu>
      </Box>

      {showAlert && <ReusableAlert severity={alertData.severity} title={alertData.title} description={alertData.description} onClose={handleAlertClose} />}

      {/* <ChangePassword
        userId={userId}
        // userPassword={userPassword}
        openChangePassword={openChangePassword}
        changePasswordOnClose={changePasswordOnClose}
      /> */}
    </Stack>
  );
};

export default Header;

// const changePasswordSchema = yup.object().shape({
//   id: yup.string().nullable(),
//   current_Password: yup.string().required().label("Current Password"),
//   new_Password: yup.string().required().label("New Password"),
//   confirm_Password: yup.string().required().label("Confirm Password"),
// });

// const ChangePassword = ({ openChangePassword, changePasswordOnClose }) => {
//   const {
//     control,
//     handleSubmit,
//     register,
//     watch,
//     setValue,
//     reset,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(changePasswordSchema),
//     defaultValues: {
//       id: null,
//       current_Password: "",
//       new_Password: "",
//       confirm_Password: "",
//     },
//   });

//   return <div>Change Password</div>;
// };
