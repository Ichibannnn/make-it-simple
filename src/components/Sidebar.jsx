import { Collapse, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Radio, Stack, Typography, useMediaQuery } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import { theme } from "../theme/theme";
import { useDispatch, useSelector } from "react-redux";

import { setSidebar } from "../features/sidebar/sidebarSlice";
import useDisclosure from "../hooks/useDisclosure";
import { useLocation, useNavigate } from "react-router-dom";
import { getMenuIcon, getSubMenuIcon } from "./GetIcon";
import { ExpandLess, ExpandMore, KeyboardArrowDown, KeyboardArrowDownOutlined } from "@mui/icons-material";

const Sidebar = () => {
  const isVisible = useSelector((state) => state.sidebar.isVisible);
  // const hideSidebar = useMediaQuery("(max-width: 1069px)");
  // const hideSidebar = useMediaQuery("(max-width: 1647px)");
  const hideSidebar = useMediaQuery("(max-width: 1639px)");
  const [drawerOpen, setDrawerOpen] = useState(isVisible);

  const dispatch = useDispatch();

  // Sync drawerOpen state with isVisible from Redux store
  useEffect(() => {
    setDrawerOpen(isVisible);
  }, [isVisible]);

  useEffect(() => {
    dispatch(setSidebar(!hideSidebar));
  }, [dispatch, hideSidebar]);

  const handleDrawerToggle = (open) => {
    setDrawerOpen(open);
    dispatch(setSidebar(open));
  };

  return (
    <>
      {hideSidebar && drawerOpen ? (
        <Drawer
          anchor="left"
          open={isVisible}
          onClose={() => handleDrawerToggle(false)}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <Stack
            sx={{
              height: "100%",
              backgroundColor: theme.palette.bgForm.black2,
              width: "280px",
              overflow: "auto",
            }}
          >
            <SidebarHeader />
            <SidebarList />
            <SidebarFooter />
          </Stack>
        </Drawer>
      ) : (
        isVisible && (
          <Stack
            sx={{
              height: "100%",
              backgroundColor: theme.palette.bgForm.black2,
              width: "280px",
              overflow: "auto",
            }}
          >
            <SidebarHeader />
            <SidebarList />
            <SidebarFooter />
          </Stack>
        )
      )}
    </>
  );
};

export default Sidebar;

const SidebarHeader = () => {
  return (
    <Stack
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: "24px",
        marginTop: 3,
        gap: "5px",
      }}
    >
      <img src="/images/dotek-login.png" alt="misLogo" width="56" height="38" className="logo-sidebar" />

      <Stack
        sx={{
          display: "flex",
          justifyContent: "start",
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        <Typography
          sx={{
            margin: "0",
            fontSize: "1rem",
            fontWeight: "700",
            color: "#EDF2F7",
            lineHeight: "1.2",
          }}
          variant="h6"
          className="logo-title"
        >
          Make It Simple
        </Typography>
        <Typography
          sx={{
            margin: "0",
            fontSize: "12px",
            fontWeight: "450",
            color: "#A0AEC0",
            lineHeight: "1.2",
          }}
          variant="h1"
        >
          Production
        </Typography>
      </Stack>
    </Stack>
  );
};

const SidebarList = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const userPermission = useSelector((state) => state?.user?.permissions);

  const { open: userManagementOpen, onToggle: userManagementOnToggle, onClose: userManagementOnClose } = useDisclosure(!!pathname.match(/user-management/gi));
  const { open: masterListOpen, onToggle: masterListOnToggle, onClose: masterlistOnClose } = useDisclosure(!!pathname.match(/masterlist/gi));
  const { open: requestOpen, onToggle: requestOnToggle, onClose: requestOnClose } = useDisclosure(!!pathname.match(/requestor/gi));
  const { open: receiverOpen, onToggle: receiverOnToggle, onClose: receiverOnClose } = useDisclosure(!!pathname.match(/receiver/gi));
  const { open: approverOpen, onToggle: approverOnToggle, onClose: approverOnClose } = useDisclosure(!!pathname.match(/approver/gi));
  const { open: ticketingOpen, onToggle: ticketingOnToggle, onClose: ticketingOnClose } = useDisclosure(!!pathname.match(/ticketing/gi));

  const sidebarMenu = [
    {
      id: 1,
      name: "Overview",
      path: "/overview",
      icon: "EqualizerOutlined",
    },
    {
      id: 2,
      name: "User Management",
      path: "/user-management",
      icon: "PeopleOutlinedIcon",
      open: userManagementOpen,
      onToggle: () => {
        userManagementOnToggle();
        masterlistOnClose();
        requestOnClose();
        // channelOnClose();
        ticketingOnClose();
        approverOnClose();
      },
      sub: [
        {
          id: 1,
          menuId: 1,
          name: "User Account",
          path: "/user-management/user-account",
          icon: "PermIdentityOutlinedIcon",
        },
        {
          id: 2,
          menuId: 1,
          name: "User Role",
          path: "/user-management/user-role",
          icon: "ManageAccountsOutlinedIcon",
        },
      ],
    },
    {
      id: 3,
      name: "Masterlist",
      path: "/masterlist",
      icon: "ChecklistOutlinedIcon",
      open: masterListOpen,
      onToggle: () => {
        masterListOnToggle();
        userManagementOnClose();
        requestOnClose();
        // channelOnClose();
        receiverOnClose();
        ticketingOnClose();
        approverOnClose();
      },
      sub: [
        {
          id: 1,
          name: "Company",
          path: "/masterlist/company",
          icon: "BusinessOutlinedIcon",
        },
        {
          id: 2,
          name: "Business Unit",
          path: "/masterlist/business-unit",
          icon: "LanOutlined",
        },
        {
          id: 3,
          name: "Department",
          path: "/masterlist/department",
          icon: "DomainAddOutlined",
        },
        {
          id: 4,
          name: "Unit",
          path: "/masterlist/unit",
          icon: "AccountTreeOutlined",
        },
        {
          id: 5,
          name: "Sub Unit",
          path: "/masterlist/sub-unit",
          icon: "ListOutlined",
        },
        {
          id: 6,
          name: "Location",
          path: "/masterlist/location",
          icon: "RoomOutlined",
        },
        {
          id: 7,
          name: "Category",
          path: "/masterlist/category",
          icon: "CategoryOutlined",
        },
        {
          id: 8,
          name: "Sub Category",
          path: "/masterlist/sub-category",
          icon: "AutoAwesomeMotionOutlined",
        },
        {
          id: 9,
          name: "Receiver Setup",
          path: "/masterlist/receiver-setup",
          icon: "ContactsOutlined",
        },
        {
          id: 10,
          name: "Channel Setup",
          path: "/masterlist/channel-setup",
          icon: "HubOutlined",
        },
        {
          id: 11,
          name: "Approver Setup",
          path: "/masterlist/approver-setup",
          icon: "GroupsOutlined",
        },
      ],
    },
    {
      id: 4,
      name: "Requestor",
      path: "/requestor",
      icon: "DynamicFeedOutlined",
      open: requestOpen,
      onToggle: () => {
        requestOnToggle();
        userManagementOnClose();
        masterlistOnClose();
        receiverOnClose();
        ticketingOnClose();
        approverOnClose();
      },
      sub: [
        {
          id: 1,
          name: "Requestor Concerns",
          path: "/requestor/requestor-concerns",
          icon: "DiscountOutlined",
        },
      ],
    },
    {
      id: 5,
      name: "Receiver",
      path: "/receiver",
      icon: "DynamicFeedOutlined",
      open: receiverOpen,
      onToggle: () => {
        receiverOnToggle();
        requestOnClose();
        userManagementOnClose();
        masterlistOnClose();
        ticketingOnClose();
        approverOnClose();
      },
      sub: [
        {
          id: 1,
          name: "Receiver Concerns",
          path: "/receiver/receiver-concerns",
          icon: "DiscountOutlined",
        },
        // {
        //   id: 2,
        //   name: "Close Tickets",
        //   path: "/receiver/close-tickets",
        //   icon: "DiscountOutlined",
        // },
      ],
    },
    {
      id: 6,
      name: "Approver",
      path: "/Approver",
      icon: "CreditScoreOutlined",
      open: approverOpen,
      onToggle: () => {
        approverOnToggle();
        receiverOnClose();
        requestOnClose();
        userManagementOnClose();
        masterlistOnClose();
        ticketingOnClose();
      },
      sub: [
        {
          id: 1,
          name: "Approval",
          path: "/approver/approval",
        },
      ],
    },
    {
      id: 7,
      name: "Ticketing",
      path: "/ticketing",
      icon: "ConfirmationNumberOutlined",
      open: ticketingOpen,
      onToggle: () => {
        ticketingOnToggle();
        receiverOnClose();
        requestOnClose();
        userManagementOnClose();
        masterlistOnClose();
        approverOnClose();
      },
      sub: [
        {
          id: 1,
          name: "Tickets",
          path: "/ticketing/issue-handler-tickets",
          icon: "ConfirmationNumberOutlined",
        },
      ],
    },
    {
      id: 7,
      name: "Reports",
      path: "/reports",
      icon: "AssessmentOutlined",
    },
    {
      id: 8,
      name: "Filing",
      path: "/filing",
      icon: "AttachFileOutlined",
    },
    {
      id: 9,
      name: "Generate",
      path: "/generate",
      icon: "BallotOutlined",
    },
  ];

  return (
    <Stack>
      <List
        sx={{
          marginTop: "35px",
          marginLeft: "6px",
          marginRight: "17px",
          padding: "0px",
        }}
      >
        {sidebarMenu
          .filter((item) => userPermission?.includes(item.name))
          .map((item, i) => (
            <Fragment key={i}>
              {item.sub?.length ? (
                <ListItemButton onClick={item.onToggle} selected={item.path === pathname}>
                  <ListItemIcon>{getMenuIcon(item.icon)}</ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    primaryTypographyProps={{
                      fontSize: "14px",
                      fontWeight: "600",
                      lineHeight: "24px",
                      mb: "2px",
                    }}
                  />
                  {item.open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              ) : (
                <ListItemButton onClick={() => navigate(item.path)} selected={item.path === pathname}>
                  <ListItemIcon>{getMenuIcon(item.icon)}</ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    primaryTypographyProps={{
                      fontSize: "14px",
                      fontWeight: "600",
                      lineHeight: "24px",
                      mb: "2px",
                    }}
                  />
                </ListItemButton>
              )}

              {item.sub?.filter((subItem) => userPermission.includes(subItem.name)).length > 0 && (
                <Collapse
                  in={item.open}
                  timeout="auto"
                  unmountOnExit
                  sx={{
                    maxHeight: item.open ? "250px" : "0",
                    overflowY: "auto",
                    transition: "max-height 0.3s ease-in-out",
                  }}
                >
                  <List
                    sx={{
                      marginTop: "4px",
                      marginBottom: "4px",
                      marginLeft: "25px",
                      marginRight: "2px",
                      padding: "0px",
                      maxHeight: "500px", // Set max height
                      overflowY: "auto", // Enable vertical scrolling
                    }}
                  >
                    {item.sub
                      .filter((subItem) => userPermission.includes(subItem.name))
                      .map((subItem, j) => (
                        <ListItemButton key={j} onClick={() => navigate(subItem.path)} selected={subItem.path === pathname} sx={{ padding: "2px" }}>
                          {/* <ListItemIcon>
                            {getSubMenuIcon(subItem.icon)}
                          </ListItemIcon> */}
                          <ListItemText
                            primary={subItem.name}
                            primaryTypographyProps={{
                              fontSize: "14px",
                              fontWeight: "600",
                              lineHeight: "24px",
                              mb: "2px",
                              marginLeft: "35px",
                            }}
                          />
                        </ListItemButton>
                      ))}
                  </List>
                </Collapse>
              )}
            </Fragment>
          ))}
      </List>
    </Stack>
  );
};

const SidebarFooter = () => {
  return <div>{/* Footer */}</div>;
};
