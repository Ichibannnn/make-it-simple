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
  const dispatch = useDispatch();
  const hideSidebar = useMediaQuery("(max-width: 1069px)");

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
  const location = useLocation();

  const userPermission = useSelector((state) => state.user.permissions);
  const { open: userManagementOpen, onToggle: userManagementOnToggle } =
    useDisclosure();
  const { open: masterListOpen, onToggle: masterListOnToggle } =
    useDisclosure();

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
          menuId: 2,
          name: "Company",
          path: "/masterlist-company",
          icon: "BusinessOutlinedIcon",
        },
        {
          id: 2,
          menuId: 2,
          name: "Department",
          path: "/masterlist-department",
          icon: "AccountTreeOutlinedIcon",
        },
      ],
    },
  ];

  return (
    <Stack>
      <List
        sx={{
          marginTop: "4px",
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
                <ListItemButton onClick={item.onToggle}>
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
                {item.sub
                  .filter((subItem) => userPermission.includes(subItem.name))
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
                            marginLeft: "17px",
                            marginRight: "17px",
                            padding: "0px",
                          }}
                        >
                          <ListItemButton
                            onClick={() => navigate(subItem.path)}
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
