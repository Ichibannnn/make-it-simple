import {
  Collapse,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Radio,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import { theme } from "../theme/theme";
import { useDispatch, useSelector } from "react-redux";

import { setSidebar } from "../features/sidebar/sidebarSlice";
import useDisclosure from "../hooks/useDisclosure";
import { useLocation, useNavigate } from "react-router-dom";
import { getMenuIcon, getSubMenuIcon } from "./GetIcon";
import {
  ExpandLess,
  ExpandMore,
  KeyboardArrowDown,
  KeyboardArrowDownOutlined,
} from "@mui/icons-material";

const Sidebar = () => {
  const isVisible = useSelector((state) => state.sidebar.isVisible);
  const hideSidebar = useMediaQuery("(max-width: 1069px)");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSidebar(!hideSidebar));
  }, [dispatch, hideSidebar]);

  return (
    <Stack>
      {isVisible && (
        <Stack
          sx={{
            height: "100%",
            backgroundColor: theme.palette.bgForm.black2,
            width: "280px",
          }}
        >
          <SidebarHeader />
          <SidebarList />
          <SidebarFooter />
        </Stack>
      )}
    </Stack>
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
        // width: "280px",
      }}
    >
      <img
        src="/images/dotek-login.png"
        alt="misLogo"
        width="56"
        height="38"
        className="logo-sidebar"
      />

      <Stack
        sx={{
          display: "flex",
          justifyContent: "start",
          flexDirection: "column",
          // alignItems: "center",
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

  console.log("path: ", pathname);

  const userPermission = useSelector((state) => state.user.permissions);
  const { open: userManagementOpen, onToggle: userManagementOnToggle } =
    useDisclosure(!!pathname.match(/user-management/gi));
  const { open: masterListOpen, onToggle: masterListOnToggle } = useDisclosure(
    !!pathname.match(/masterlist/gi)
  );
  const { open: requestOpen, onToggle: requestOnToggle } = useDisclosure();
  const { open: channelOpen, onToggle: channelOnToggle } = useDisclosure();
  const { open: filingOpen, onToggle: filingOnToggle } = useDisclosure();
  const { open: generateOpen, onToggle: generateOnToggle } = useDisclosure();

  const sidebarMenu = [
    {
      id: 1,
      name: "User Management",
      path: "/user-management",
      icon: "PeopleOutlinedIcon",
      open: userManagementOpen,
      onToggle: userManagementOnToggle,
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
      id: 2,
      name: "Masterlist",
      path: "/masterlist",
      icon: "ChecklistOutlinedIcon",
      open: masterListOpen,
      onToggle: masterListOnToggle,
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
      ],
    },
    {
      id: 3,
      name: "Request",
      path: "/request",
      icon: "DynamicFeedOutlined",
      open: requestOpen,
      onToggle: requestOnToggle,
    },
    {
      id: 4,
      name: "Channel",
      path: "/channel",
      icon: "NumbersOutlined",
      open: channelOpen,
      onToggle: channelOnToggle,
    },
    {
      id: 5,
      name: "Filing",
      path: "/filing",
      icon: "AttachFileOutlined",
      open: filingOpen,
      onToggle: filingOnToggle,
    },
    {
      id: 6,
      name: "Generate",
      path: "/generate",
      icon: "BallotOutlined",
      open: generateOpen,
      onToggle: generateOnToggle,
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
          .filter((item) => userPermission.includes(item.name))
          .map((item, i) => {
            return (
              <Fragment key={i}>
                {item.sub?.length && (
                  <ListItemButton
                    onClick={item.onToggle}
                    selected={item.path === pathname}
                  >
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
                )}

                {!item.sub?.length && (
                  <ListItemButton
                    onClick={() => navigate(item.path)}
                    selected={item.path === pathname}
                  >
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

                {item.sub
                  ?.filter((subItem) => userPermission.includes(subItem.name))
                  .map((subItem, i) => {
                    return (
                      <Collapse
                        in={item.open}
                        timeout="auto"
                        unmountOnExit
                        key={i}
                      >
                        <List
                          sx={{
                            marginTop: "4px",
                            marginBottom: "4px",
                            marginLeft: "25px",
                            marginRight: "2px",
                            padding: "0px",
                          }}
                        >
                          <ListItemButton
                            onClick={() => navigate(subItem.path)}
                            selected={subItem.path === pathname}
                            sx={{ padding: "2px" }}
                          >
                            <ListItemIcon>
                              {getSubMenuIcon(subItem.icon)}
                            </ListItemIcon>

                            <ListItemText
                              primary={subItem.name}
                              primaryTypographyProps={{
                                fontSize: "14px",
                                fontWeight: "600",
                                lineHeight: "24px",
                                mb: "2px",
                              }}
                            />
                          </ListItemButton>
                        </List>
                      </Collapse>
                    );
                  })}
              </Fragment>
            );
          })}
      </List>
    </Stack>
  );
};

const SidebarFooter = () => {
  return <div>{/* Footer */}</div>;
};
