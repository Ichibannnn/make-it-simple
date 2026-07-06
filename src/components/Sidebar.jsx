import { Badge, Box, Collapse, Divider, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Stack, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { ExpandLess, ExpandMore, MenuOpen } from "@mui/icons-material";

import { getMenuIcon } from "./GetIcon";
import { useDispatch, useSelector } from "react-redux";
import { setSidebar } from "../features/sidebar/sidebarSlice";

import useDisclosure from "../hooks/useDisclosure";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetNotificationQuery } from "../features/api_notification/notificationApi";

import helpDeskLogo from "../assets/images/helpdesk_icon.png";
import { sidebarStyles as sx } from "./styles/sidebarStyles";

const Sidebar = () => {
  const isVisible = useSelector((state) => state.sidebar.isVisible);
  const hideSidebar = useMediaQuery("(max-width: 1639px)");
  const [drawerOpen, setDrawerOpen] = useState(isVisible);
  const [collapsed, setCollapsed] = useState(false);

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
        // Mobile: temporary drawer is always full-width (no collapse rail).
        <Drawer
          anchor="left"
          open={isVisible}
          onClose={() => handleDrawerToggle(false)}
          ModalProps={{
            keepMounted: true,
          }}
        >
          <SidebarContent collapsed={false} />
        </Drawer>
      ) : (
        isVisible && <SidebarContent collapsed={collapsed} onToggleCollapse={() => setCollapsed((prev) => !prev)} />
      )}
    </>
  );
};

export default Sidebar;

// Single source of truth for the panel — used by both the fixed and drawer variants.
const SidebarContent = ({ collapsed, onToggleCollapse }) => (
  <Stack sx={sx.container(collapsed)}>
    <SidebarHeader collapsed={collapsed} onToggleCollapse={onToggleCollapse} />
    <SidebarList collapsed={collapsed} onExpand={() => collapsed && onToggleCollapse?.()} />
  </Stack>
);

const SidebarHeader = ({ collapsed, onToggleCollapse }) => {
  return (
    <>
      {onToggleCollapse && (
        <Stack sx={sx.toggleRow(collapsed)}>
          <Tooltip title={collapsed ? "Expand" : "Collapse"} placement="right" arrow>
            <IconButton onClick={onToggleCollapse} sx={sx.toggleButton} size="small">
              <MenuOpen sx={sx.toggleIcon(collapsed)} />
            </IconButton>
          </Tooltip>
        </Stack>
      )}

      <Stack sx={sx.header(collapsed)}>
        <img
          src={helpDeskLogo}
          alt="MIS Helpdesk"
          width={collapsed ? "46" : "74"}
          height={collapsed ? "31" : "50"}
          className="logo-sidebar"
        />

        {!collapsed && (
          <Stack sx={sx.brandRow}>
            <Typography sx={sx.brandMis}>MIS</Typography>
            <Typography sx={sx.brandHelpdesk}>HELPDESK</Typography>
          </Stack>
        )}
      </Stack>

      <Divider sx={sx.headerDivider(collapsed)} />
    </>
  );
};

// Wraps a nav button in a right-side tooltip only while the rail is collapsed.
const NavTooltip = ({ collapsed, title, children }) =>
  collapsed ? (
    <Tooltip title={title} placement="right" arrow>
      {children}
    </Tooltip>
  ) : (
    children
  );

const SidebarList = ({ collapsed, onExpand }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const userPermission = useSelector((state) => state?.user?.permissions);
  const { data: notificationData } = useGetNotificationQuery();
  const openNotification = notificationData?.value?.openTicketNotif || 0;
  const ticketApprovalNotification = notificationData?.value?.forApprovalClosingNotif || 0;

  const { open: userManagementOpen, onToggle: userManagementOnToggle, onClose: userManagementOnClose } = useDisclosure(!!pathname.match(/user-management/gi));
  const { open: masterListOpen, onToggle: masterListOnToggle, onClose: masterlistOnClose } = useDisclosure(!!pathname.match(/masterlist/gi));
  const { open: requestOpen, onToggle: requestOnToggle, onClose: requestOnClose } = useDisclosure(!!pathname.match(/requestor/gi));
  const { open: receiverOpen, onToggle: receiverOnToggle, onClose: receiverOnClose } = useDisclosure(!!pathname.match(/receiver/gi));
  const { open: ticketingOpen, onToggle: ticketingOnToggle, onClose: ticketingOnClose } = useDisclosure(!!pathname.match(/ticketing/gi));
  const { open: approverOpen, onToggle: approverOnToggle, onClose: approverOnClose } = useDisclosure(!!pathname.match(/approver/gi));

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
        receiverOnClose();
        ticketingOnClose();
        approverOnClose();
      },
      sub: [
        {
          id: 1,
          name: "One Charging",
          path: "/masterlist/one-charging",
          icon: "BusinessOutlinedIcon",
        },
        {
          id: 2,
          name: "Channel Setup",
          path: "/masterlist/channel-setup",
          icon: "HubOutlined",
        },
        {
          id: 3,
          name: "Category",
          path: "/masterlist/category",
          icon: "CategoryOutlined",
        },
        {
          id: 4,
          name: "Sub Category",
          path: "/masterlist/sub-category",
          icon: "AutoAwesomeMotionOutlined",
        },
        {
          id: 5,
          name: "Service Provider",
          path: "/masterlist/service-provider",
          icon: "HubOutlined",
        },
        {
          id: 6,
          name: "Concern Category",
          path: "/masterlist/concern-category",
          icon: "AutoAwesomeMotionOutlined",
        },
        {
          id: 7,
          name: "Receiver Setup",
          path: "/masterlist/receiver-setup",
          icon: "ContactsOutlined",
        },
        {
          id: 8,
          name: "Approver Setup",
          path: "/masterlist/approver-setup",
          icon: "GroupsOutlined",
        },
        {
          id: 9,
          name: "PMS Type",
          path: "/masterlist/pms-type",
          icon: "GroupsOutlined",
        },
        {
          id: 10,
          name: "Sites",
          path: "/masterlist/sites",
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
        {
          id: 2,
          name: "View Tickets",
          path: "/approver/view-tickets",
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
      name: "Checklist Management",
      path: "/checklist-management",
      icon: "FolderOutlined",
    },
    {
      id: 8,
      name: "PMS",
      path: "/pms",
      icon: "BuildCircleOutlined",
    },
    {
      id: 9,
      name: "Reports",
      path: "/reports",
      icon: "AssessmentOutlined",
    },
    {
      id: 10,
      name: "Filing",
      path: "/filing",
      icon: "AttachFileOutlined",
    },
    {
      id: 11,
      name: "Generate",
      path: "/generate",
      icon: "BallotOutlined",
    },
  ];

  return (
    <Stack>
      {!collapsed && <Typography sx={sx.sectionLabel}>MENU</Typography>}

      <List sx={sx.list}>
        {sidebarMenu
          .filter((item) => userPermission?.includes(item.name))
          .map((item, i) => (
            <Fragment key={i}>
              {item.sub?.length ? (
                <NavTooltip collapsed={collapsed} title={item.name}>
                  <ListItemButton
                    onClick={() => {
                      onExpand(); // in the rail, opening a group expands the sidebar first
                      item.onToggle();
                    }}
                    selected={item.path === pathname}
                    sx={sx.navButton(collapsed)}
                  >
                    <ListItemIcon sx={sx.navIcon(collapsed)}>{getMenuIcon(item.icon)}</ListItemIcon>

                    {!collapsed && (
                      <>
                        <ListItemText primary={item.name} primaryTypographyProps={sx.navText} />

                        {(item?.name === "Ticketing" && openNotification) || (item?.name === "Approver" && ticketApprovalNotification) ? (
                          <Badge color="error" variant="dot">
                            {item.open ? <ExpandLess sx={sx.chevron} /> : <ExpandMore sx={sx.chevron} />}
                          </Badge>
                        ) : item.open ? (
                          <ExpandLess sx={sx.chevron} />
                        ) : (
                          <ExpandMore sx={sx.chevron} />
                        )}
                      </>
                    )}
                  </ListItemButton>
                </NavTooltip>
              ) : (
                <NavTooltip collapsed={collapsed} title={item.name}>
                  <ListItemButton onClick={() => navigate(item.path)} selected={item.path === pathname} sx={sx.navButton(collapsed)}>
                    <ListItemIcon sx={sx.navIcon(collapsed)}>{getMenuIcon(item.icon)}</ListItemIcon>
                    {!collapsed && <ListItemText primary={item.name} primaryTypographyProps={sx.navText} />}
                  </ListItemButton>
                </NavTooltip>
              )}

              {!collapsed && item.sub?.filter((subItem) => userPermission.includes(subItem.name)).length > 0 && (
                <Collapse in={item.open} timeout="auto" unmountOnExit>
                  <List sx={sx.subList}>
                    {item.sub
                      .filter((subItem) => userPermission.includes(subItem.name))
                      .map((subItem, j) => (
                        <ListItemButton key={j} onClick={() => navigate(subItem.path)} selected={subItem.path === pathname} sx={sx.subButton}>
                          <ListItemText
                            primary={
                              (subItem?.name === "Tickets" && openNotification) || (subItem?.name === "Approval" && ticketApprovalNotification) ? (
                                <Box sx={sx.subBadgeRow}>
                                  <Typography sx={sx.subText}>{subItem.name}</Typography>

                                  <Badge
                                    color="error"
                                    badgeContent={subItem?.name === "Tickets" ? openNotification : ticketApprovalNotification}
                                    sx={sx.subBadge}
                                  />
                                </Box>
                              ) : (
                                subItem.name
                              )
                            }
                            primaryTypographyProps={sx.subText}
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
