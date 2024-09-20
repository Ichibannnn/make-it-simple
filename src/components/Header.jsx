import { Badge, Box, IconButton, List, ListItem, ListItemIcon, Menu, MenuItem, Stack, Tooltip, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import { theme } from "../theme/theme";

import Logout from "@mui/icons-material/Logout";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { AccountCircleRounded, NotificationsNoneOutlined, NotificationsOffOutlined, NotificationsRounded, Password } from "@mui/icons-material";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUserDetails } from "../features/user_management_api/user/userSlice";
import { toggleSidebar } from "../features/sidebar/sidebarSlice";

import ReusableAlert from "../hooks/ReusableAlert";
import useDisclosure from "../hooks/useDisclosure";

import { concernApi } from "../features/api_request/concerns/concernApi";
import { concernReceiverApi } from "../features/api_request/concerns_receiver/concernReceiverApi";
import { concernIssueHandlerApi } from "../features/api_ticketing/issue_handler/concernIssueHandlerApi";
import { ticketApprovalApi } from "../features/api_ticketing/approver/ticketApprovalApi";
import { closingTicketApi } from "../features/api_ticketing/receiver/closingTicketApi";
import { notificationApi } from "../features/api_notification/notificationApi";
import { notificationMessageApi, useGetNotificationMessageQuery, useGetNotificationNavMutation } from "../features/api_notification_message/notificationMessageApi";
import useSignalRConnection from "../hooks/useSignalRConnection";
import moment from "moment";
import { useEffect } from "react";
import { toast, Toaster } from "sonner";

const Header = () => {
  // const hideMenu = useMediaQuery("(max-width: 1069px)");
  const hideMenu = useMediaQuery("(max-width: 1639px)");

  const [notificationAnchor, setNotificationAnchor] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const notificationOpen = Boolean(notificationAnchor);

  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useSignalRConnection();

  // console.log("Notification Message: ", notificationMessage);

  const fullName = useSelector((state) => state?.user?.fullname);
  const userName = useSelector((state) => state?.user?.username);
  const userRole = useSelector((state) => state?.user?.userRoleName);

  const [notificationNav] = useGetNotificationNavMutation();

  const { data: notificationMessage } = useGetNotificationMessageQuery();
  const { open: openChangePassword, onToggle: changePasswordOnToggle, onClose: changePasswordOnClose } = useDisclosure();

  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({
    severity: "",
    title: "",
    description: "",
  });
  const [showBadge, setShowBadge] = useState(false);

  const notificationHandler = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const menuHandler = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeHandler = () => {
    setAnchorEl(null);
  };

  const notificationCloseHandler = () => {
    setNotificationAnchor(null);
  };

  const logoutHandler = () => {
    try {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      dispatch(notificationApi.util.resetApiState());
      dispatch(notificationMessageApi.util.resetApiState());
      dispatch(concernApi.util.resetApiState());
      dispatch(concernReceiverApi.util.resetApiState());
      dispatch(concernIssueHandlerApi.util.resetApiState());
      dispatch(ticketApprovalApi.util.resetApiState());
      dispatch(closingTicketApi.util.resetApiState());

      dispatch(clearUserDetails());
      navigate("/");
    } catch (error) {
      setAlertData({
        severity: "error",
        title: "Error!",
        description: `Something went wrong.`,
      });
      setShowAlert(true);
    }
  };

  const onNavigateAction = (data) => {
    console.log("Data: ", data);

    const navigationId = {
      id: data?.id,
    };

    notificationNav(navigationId)
      .unwrap()
      .then(() => {
        dispatch(notificationMessageApi.util.resetApiState());
        navigate(data?.modules);
      })
      .catch(() => {
        toast.error("Error!", {
          description: "Something went wrong",
        });
      });
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

  useEffect(() => {
    if (notificationMessage?.value?.length > 0) {
      setShowBadge(true);
    } else {
      setShowBadge(false);
    }
  }, [notificationMessage]);

  console.log("Length: ", notificationMessage);

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
      <Toaster richColors position="top-right" />
      <Box>
        {hideMenu && (
          <IconButton onClick={toggleSidebarHandler} aria-label="Toggle sidebar">
            <MenuOutlinedIcon />
          </IconButton>
        )}
      </Box>

      <Box>
        <Box
          sx={{
            display: "flex",
            direction: "row",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: theme.palette.bgForm.black1,
            borderRadius: "20px",
          }}
        >
          <IconButton onClick={notificationHandler} ml={1}>
            <Tooltip title="Notifications">
              <Badge color="error" variant="dot" invisible={!showBadge}>
                <NotificationsNoneOutlined />
              </Badge>
            </Tooltip>
          </IconButton>

          <IconButton onClick={menuHandler} ml={1}>
            <Tooltip title="Account">
              <AccountCircleRounded />
            </Tooltip>
          </IconButton>

          <Stack mt={0.5}>
            <Typography className="capitalize-letter" sx={{ fontSize: "13px", fontWeight: 500 }}>
              {fullName}
            </Typography>

            <Typography sx={{ fontSize: "13px", color: theme.palette.text.secondary }}>{userRole}</Typography>
          </Stack>
        </Box>

        {/* Notification */}
        <Menu anchorEl={notificationAnchor} open={notificationOpen} onClose={notificationCloseHandler}>
          <Stack sx={{ maxHeight: 400, width: "350px" }}>
            <Stack sx={{ width: "100%", padding: "6px 16px" }}>
              <Typography>Notifications</Typography>
            </Stack>

            {notificationMessage?.value?.length > 0 ? (
              <List sx={{ maxHeight: 300, overflowY: "auto" }}>
                {notificationMessage?.value?.map((data) => (
                  <ListItem
                    key={data.id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: theme.palette.bgForm.black2,
                      },
                    }}
                    onClick={() => onNavigateAction(data)}
                  >
                    <Stack direction="row" gap={0.5} alignItems="center">
                      <AccountCircleRounded />

                      <div style={{ flexGrow: 1, marginLeft: "10px" }}>
                        <Typography variant="body2" sx={{ fontWeight: "semibold" }}>
                          {data.message}
                        </Typography>

                        <Typography variant="caption" color="textSecondary">
                          {moment(data.created_At).format("LLL")}
                        </Typography>
                      </div>
                    </Stack>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Stack sx={{ width: "100%", justifyContent: "center", alignItems: "center", gap: 0.5, padding: 4 }}>
                <NotificationsOffOutlined sx={{ color: theme.palette.text.secondary }} />
                <Typography sx={{ fontSize: "14px", color: theme.palette.text.secondary }}>No notifications</Typography>
              </Stack>
            )}
          </Stack>
        </Menu>

        {/* Account */}
        <Menu anchorEl={anchorEl} open={open} onClose={closeHandler} onClick={closeHandler}>
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
