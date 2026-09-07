import {
  Badge,
  Box,
  Collapse,
  Divider,
  Grow,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Fragment, useEffect, useRef, useState } from "react";
import { ExpandMore, MenuOpen } from "@mui/icons-material";

import { getMenuIcon, getSubMenuIcon } from "./GetIcon";
import { useSelector } from "react-redux";

import useDisclosure from "../hooks/useDisclosure";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetNotificationQuery } from "../features/api_notification/notificationApi";

import helpDeskLogo from "../assets/images/helpdesk_icon.png";
import { sidebarStyles as sx } from "./styles/sidebarStyles";

const Sidebar = () => {
  // A single always-visible collapsible rail for every screen size. Small screens
  // default to the collapsed rail; larger screens default to the expanded panel.
  const isSmallScreen = useMediaQuery("(max-width: 1639px)");
  const [collapsed, setCollapsed] = useState(isSmallScreen);

  // Re-sync the default when the viewport crosses the breakpoint.
  useEffect(() => {
    setCollapsed(isSmallScreen);
  }, [isSmallScreen]);

  return <SidebarContent collapsed={collapsed} onToggleCollapse={() => setCollapsed((prev) => !prev)} />;
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
        <Box
          component="img"
          src={helpDeskLogo}
          alt="MIS Helpdesk"
          className="logo-sidebar"
          sx={sx.logo(collapsed)}
        />

        {/* Kept mounted so it can fade/collapse smoothly in both directions */}
        <Box sx={sx.brandWrap(collapsed)}>
          <Stack sx={sx.brandRow}>
            <Typography sx={sx.brandMis}>MIS</Typography>
            <Typography sx={sx.brandHelpdesk}>HELPDESK</Typography>
          </Stack>
        </Box>
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

// Resolves the notification count a given sub-item should surface (0 when none).
const subBadgeCount = (name, openNotification, ticketApprovalNotification) => {
  if (name === "Tickets") return openNotification;
  if (name === "Approval") return ticketApprovalNotification;
  return 0;
};

// A single sub-menu row (icon + label + optional notification badge). Shared by the
// expanded tree and the collapsed hover flyout so both stay in sync.
const SubMenuItem = ({ subItem, selected, onClick, openNotification, ticketApprovalNotification }) => {
  const badgeCount = subBadgeCount(subItem?.name, openNotification, ticketApprovalNotification);

  return (
    <ListItemButton onClick={onClick} selected={selected} sx={sx.subButton}>
      <ListItemIcon sx={sx.subIcon}>{getSubMenuIcon(subItem.icon)}</ListItemIcon>
      <ListItemText
        primary={
          badgeCount ? (
            <Box sx={sx.subBadgeRow}>
              <Typography sx={sx.subText}>{subItem.name}</Typography>
              <Box component="span" sx={sx.subCount}>
                {badgeCount > 99 ? "99+" : badgeCount}
              </Box>
            </Box>
          ) : (
            subItem.name
          )
        }
        primaryTypographyProps={sx.subText}
      />
    </ListItemButton>
  );
};

// Collapsed rail: hovering (or focusing) a parent icon reveals a flyout with its
// sub-items so they can be picked without expanding the whole sidebar first.
const CollapsedGroup = ({
  item,
  subs,
  pathname,
  navigate,
  onExpand,
  openNotification,
  ticketApprovalNotification,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const closeTimer = useRef();
  const open = Boolean(anchorEl);

  const hasNotif =
    (item.name === "Ticketing" && openNotification) ||
    (item.name === "Approver" && ticketApprovalNotification);

  const openFlyout = (e) => {
    clearTimeout(closeTimer.current);
    setAnchorEl(e.currentTarget);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setAnchorEl(null), 140);
  };

  // Keep the group's expanded/collapsed state in sync so it stays open once the
  // rail is expanded again (onToggle also closes the other groups).
  const ensureGroupOpen = () => {
    if (!item.open) item.onToggle();
  };

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  return (
    <Box onMouseEnter={openFlyout} onMouseLeave={scheduleClose} onFocus={openFlyout} onBlur={scheduleClose}>
      <ListItemButton
        onClick={() => {
          ensureGroupOpen();
          onExpand();
        }}
        selected={item.path === pathname}
        sx={sx.navButton(true)}
      >
        <ListItemIcon sx={sx.navIcon(true)}>
          <Badge color="error" variant="dot" invisible={!hasNotif}>
            {getMenuIcon(item.icon)}
          </Badge>
        </ListItemIcon>
      </ListItemButton>

      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="right-start"
        transition
        sx={sx.flyoutPopper}
        modifiers={[{ name: "offset", options: { offset: [0, 8] } }]}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} style={{ transformOrigin: "left top" }} timeout={180}>
            <Paper
              elevation={8}
              sx={sx.flyoutPaper}
              onMouseEnter={() => clearTimeout(closeTimer.current)}
              onMouseLeave={scheduleClose}
            >
              <Typography sx={sx.flyoutHeader}>{item.name}</Typography>
              <List sx={sx.flyoutList}>
                {subs.map((subItem, j) => (
                  <SubMenuItem
                    key={j}
                    subItem={subItem}
                    selected={subItem.path === pathname}
                    onClick={() => {
                      ensureGroupOpen();
                      navigate(subItem.path);
                      setAnchorEl(null);
                    }}
                    openNotification={openNotification}
                    ticketApprovalNotification={ticketApprovalNotification}
                  />
                ))}
              </List>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
};

const SidebarList = ({ collapsed, onExpand }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const userPermission = useSelector((state) => state?.user?.permissions);
  const { data: notificationData } = useGetNotificationQuery();
  const openNotification = notificationData?.value?.openTicketNotif || 0;
  const ticketApprovalNotification = notificationData?.value?.forApprovalClosingNotif || 0;

  const {
    open: userManagementOpen,
    onToggle: userManagementOnToggle,
    onClose: userManagementOnClose,
  } = useDisclosure(!!pathname.match(/user-management/gi));
  const {
    open: masterListOpen,
    onToggle: masterListOnToggle,
    onClose: masterlistOnClose,
  } = useDisclosure(!!pathname.match(/masterlist/gi));
  const {
    open: requestOpen,
    onToggle: requestOnToggle,
    onClose: requestOnClose,
  } = useDisclosure(!!pathname.match(/requestor/gi));
  const {
    open: receiverOpen,
    onToggle: receiverOnToggle,
    onClose: receiverOnClose,
  } = useDisclosure(!!pathname.match(/receiver/gi));
  const {
    open: ticketingOpen,
    onToggle: ticketingOnToggle,
    onClose: ticketingOnClose,
  } = useDisclosure(!!pathname.match(/ticketing/gi));
  const {
    open: approverOpen,
    onToggle: approverOnToggle,
    onClose: approverOnClose,
  } = useDisclosure(!!pathname.match(/approver/gi));

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
          name: "Sites",
          path: "/masterlist/sites",
          icon: "StoreMallDirectoryOutlined",
        },
        {
          id: 10,
          name: "PMS Type",
          path: "/masterlist/pms-type",
          icon: "BackupTableOutlined",
        },
        {
          id: 11,
          name: "Store List",
          path: "/masterlist/store-list",
          icon: "StorefrontOutlined",
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
          icon: "FactCheckOutlined",
        },
        {
          id: 2,
          name: "View Tickets",
          path: "/approver/view-tickets",
          icon: "VisibilityOutlined",
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
      {/* <Box sx={sx.sectionLabelWrap(collapsed)}>
        <Typography sx={sx.sectionLabel}>MENU</Typography>
      </Box> */}

      <List sx={sx.list}>
        {sidebarMenu
          .filter((item) => userPermission?.includes(item.name))
          .map((item, i) => {
            const visibleSubs = item.sub?.filter((subItem) => userPermission.includes(subItem.name)) ?? [];
            const hasSubs = visibleSubs.length > 0;

            // Collapsed rail + a group with children → hover flyout to pick sub-items.
            if (collapsed && hasSubs) {
              return (
                <CollapsedGroup
                  key={i}
                  item={item}
                  subs={visibleSubs}
                  pathname={pathname}
                  navigate={navigate}
                  onExpand={onExpand}
                  openNotification={openNotification}
                  ticketApprovalNotification={ticketApprovalNotification}
                />
              );
            }

            return (
              <Fragment key={i}>
                {hasSubs ? (
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

                      <Box sx={sx.navLabelWrap(collapsed)}>
                        <ListItemText primary={item.name} primaryTypographyProps={sx.navText} />
                        {(item?.name === "Ticketing" && openNotification) ||
                        (item?.name === "Approver" && ticketApprovalNotification) ? (
                          <Badge color="error" variant="dot">
                            <ExpandMore sx={sx.chevron(item.open)} />
                          </Badge>
                        ) : (
                          <ExpandMore sx={sx.chevron(item.open)} />
                        )}
                      </Box>
                    </ListItemButton>
                  </NavTooltip>
                ) : (
                  <NavTooltip collapsed={collapsed} title={item.name}>
                    <ListItemButton
                      onClick={() => navigate(item.path)}
                      selected={item.path === pathname}
                      sx={sx.navButton(collapsed)}
                    >
                      <ListItemIcon sx={sx.navIcon(collapsed)}>{getMenuIcon(item.icon)}</ListItemIcon>
                      <Box sx={sx.navLabelWrap(collapsed)}>
                        <ListItemText primary={item.name} primaryTypographyProps={sx.navText} />
                      </Box>
                    </ListItemButton>
                  </NavTooltip>
                )}

                {!collapsed && hasSubs && (
                  <Collapse in={item.open} timeout={260} unmountOnExit>
                    <List sx={sx.subList}>
                      {visibleSubs.map((subItem, j) => (
                        <SubMenuItem
                          key={j}
                          subItem={subItem}
                          selected={subItem.path === pathname}
                          onClick={() => navigate(subItem.path)}
                          openNotification={openNotification}
                          ticketApprovalNotification={ticketApprovalNotification}
                        />
                      ))}
                    </List>
                  </Collapse>
                )}
              </Fragment>
            );
          })}
      </List>
    </Stack>
  );
};

// import {
//   Badge,
//   Box,
//   Collapse,
//   Drawer,
//   List,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Stack,
//   Typography,
//   useMediaQuery,
// } from "@mui/material";
// import { Fragment, useEffect, useState } from "react";
// import { ExpandLess, ExpandMore } from "@mui/icons-material";

// import { theme } from "../theme/theme";
// import { getMenuIcon } from "./GetIcon";
// import { useDispatch, useSelector } from "react-redux";
// import { setSidebar } from "../features/sidebar/sidebarSlice";

// import useDisclosure from "../hooks/useDisclosure";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useGetNotificationQuery } from "../features/api_notification/notificationApi";

// import helpDeskLogo from "../assets/images/helpdesk_icon.png";

// const Sidebar = () => {
//   const isVisible = useSelector((state) => state.sidebar.isVisible);
//   const hideSidebar = useMediaQuery("(max-width: 1639px)");
//   const [drawerOpen, setDrawerOpen] = useState(isVisible);

//   const dispatch = useDispatch();

//   // Sync drawerOpen state with isVisible from Redux store
//   useEffect(() => {
//     setDrawerOpen(isVisible);
//   }, [isVisible]);

//   useEffect(() => {
//     dispatch(setSidebar(!hideSidebar));
//   }, [dispatch, hideSidebar]);

//   const handleDrawerToggle = (open) => {
//     setDrawerOpen(open);
//     dispatch(setSidebar(open));
//   };

//   return (
//     <>
//       {hideSidebar && drawerOpen ? (
//         <Drawer
//           anchor="left"
//           open={isVisible}
//           onClose={() => handleDrawerToggle(false)}
//           ModalProps={{
//             keepMounted: true,
//           }}
//         >
//           <Stack
//             sx={{
//               height: "100%",
//               backgroundColor: theme.palette.bgForm.black2,
//               width: "280px",
//               overflow: "auto",
//             }}
//           >
//             <SidebarHeader />
//             <SidebarList />
//             <SidebarFooter />
//           </Stack>
//         </Drawer>
//       ) : (
//         isVisible && (
//           <Stack
//             sx={{
//               height: "100%",
//               backgroundColor: theme.palette.bgForm.black2,
//               width: "280px",
//               overflow: "auto",
//             }}
//           >
//             <SidebarHeader />
//             <SidebarList />
//             <SidebarFooter />
//           </Stack>
//         )
//       )}
//     </>
//   );
// };

// export default Sidebar;

// const SidebarHeader = () => {
//   return (
//     <Stack
//       sx={{
//         justifyContent: "center",
//         alignItems: "center",
//         padding: "24px 24px 10px 24px",
//         marginTop: 3,
//         gap: "5px",
//       }}
//     >
//       <img src={helpDeskLogo} alt="dotek-icon" width="74" height="50" className="logo-sidebar" />

//       <Stack direction="row" gap={0.5} mt={0.5}>
//         <Typography
//           sx={{
//             fontSize: ".9rem",
//             fontWeight: "700",
//             color: "#EDF2F7",
//             lineHeight: "1.2",
//             letterSpacing: 1,
//           }}
//         >
//           MIS
//         </Typography>

//         <Typography
//           sx={{
//             fontSize: ".9rem",
//             fontWeight: "400",
//             color: "#EDF2F7",
//             lineHeight: "1.2",
//             letterSpacing: 1,
//           }}
//         >
//           HELPDESK
//         </Typography>
//       </Stack>
//     </Stack>
//   );
// };

// const SidebarList = () => {
//   const navigate = useNavigate();
//   const { pathname } = useLocation();

//   const userPermission = useSelector((state) => state?.user?.permissions);
//   const { data: notificationData } = useGetNotificationQuery();
//   const openNotification = notificationData?.value?.openTicketNotif || 0;
//   const ticketApprovalNotification = notificationData?.value?.forApprovalClosingNotif || 0;

//   const {
//     open: userManagementOpen,
//     onToggle: userManagementOnToggle,
//     onClose: userManagementOnClose,
//   } = useDisclosure(!!pathname.match(/user-management/gi));
//   const {
//     open: masterListOpen,
//     onToggle: masterListOnToggle,
//     onClose: masterlistOnClose,
//   } = useDisclosure(!!pathname.match(/masterlist/gi));
//   const {
//     open: requestOpen,
//     onToggle: requestOnToggle,
//     onClose: requestOnClose,
//   } = useDisclosure(!!pathname.match(/requestor/gi));
//   const {
//     open: receiverOpen,
//     onToggle: receiverOnToggle,
//     onClose: receiverOnClose,
//   } = useDisclosure(!!pathname.match(/receiver/gi));
//   const {
//     open: ticketingOpen,
//     onToggle: ticketingOnToggle,
//     onClose: ticketingOnClose,
//   } = useDisclosure(!!pathname.match(/ticketing/gi));
//   const {
//     open: approverOpen,
//     onToggle: approverOnToggle,
//     onClose: approverOnClose,
//   } = useDisclosure(!!pathname.match(/approver/gi));

//   const sidebarMenu = [
//     {
//       id: 1,
//       name: "Overview",
//       path: "/overview",
//       icon: "EqualizerOutlined",
//     },
//     {
//       id: 2,
//       name: "User Management",
//       path: "/user-management",
//       icon: "PeopleOutlinedIcon",
//       open: userManagementOpen,
//       onToggle: () => {
//         userManagementOnToggle();
//         masterlistOnClose();
//         requestOnClose();
//         ticketingOnClose();
//         approverOnClose();
//       },
//       sub: [
//         {
//           id: 1,
//           menuId: 1,
//           name: "User Account",
//           path: "/user-management/user-account",
//           icon: "PermIdentityOutlinedIcon",
//         },
//         {
//           id: 2,
//           menuId: 1,
//           name: "User Role",
//           path: "/user-management/user-role",
//           icon: "ManageAccountsOutlinedIcon",
//         },
//       ],
//     },
//     {
//       id: 3,
//       name: "Masterlist",
//       path: "/masterlist",
//       icon: "ChecklistOutlinedIcon",
//       open: masterListOpen,
//       onToggle: () => {
//         masterListOnToggle();
//         userManagementOnClose();
//         requestOnClose();
//         receiverOnClose();
//         ticketingOnClose();
//         approverOnClose();
//       },
//       sub: [
//         {
//           id: 1,
//           name: "One Charging",
//           path: "/masterlist/one-charging",
//           icon: "BusinessOutlinedIcon",
//         },
//         {
//           id: 2,
//           name: "Channel Setup",
//           path: "/masterlist/channel-setup",
//           icon: "HubOutlined",
//         },
//         {
//           id: 3,
//           name: "Category",
//           path: "/masterlist/category",
//           icon: "CategoryOutlined",
//         },
//         {
//           id: 4,
//           name: "Sub Category",
//           path: "/masterlist/sub-category",
//           icon: "AutoAwesomeMotionOutlined",
//         },
//         {
//           id: 5,
//           name: "Service Provider",
//           path: "/masterlist/service-provider",
//           icon: "HubOutlined",
//         },
//         {
//           id: 6,
//           name: "Concern Category",
//           path: "/masterlist/concern-category",
//           icon: "AutoAwesomeMotionOutlined",
//         },
//         {
//           id: 7,
//           name: "Receiver Setup",
//           path: "/masterlist/receiver-setup",
//           icon: "ContactsOutlined",
//         },
//         {
//           id: 8,
//           name: "Approver Setup",
//           path: "/masterlist/approver-setup",
//           icon: "GroupsOutlined",
//         },
//         {
//           id: 9,
//           name: "PMS Type",
//           path: "/masterlist/pms-type",
//           icon: "GroupsOutlined",
//         },
//         {
//           id: 10,
//           name: "Sites",
//           path: "/masterlist/sites",
//           icon: "GroupsOutlined",
//         },
//       ],
//     },
//     {
//       id: 4,
//       name: "Requestor",
//       path: "/requestor",
//       icon: "DynamicFeedOutlined",
//       open: requestOpen,
//       onToggle: () => {
//         requestOnToggle();
//         userManagementOnClose();
//         masterlistOnClose();
//         receiverOnClose();
//         ticketingOnClose();
//         approverOnClose();
//       },
//       sub: [
//         {
//           id: 1,
//           name: "Requestor Concerns",
//           path: "/requestor/requestor-concerns",
//           icon: "DiscountOutlined",
//         },
//       ],
//     },
//     {
//       id: 5,
//       name: "Receiver",
//       path: "/receiver",
//       icon: "DynamicFeedOutlined",
//       open: receiverOpen,
//       onToggle: () => {
//         receiverOnToggle();
//         requestOnClose();
//         userManagementOnClose();
//         masterlistOnClose();
//         ticketingOnClose();
//         approverOnClose();
//       },
//       sub: [
//         {
//           id: 1,
//           name: "Receiver Concerns",
//           path: "/receiver/receiver-concerns",
//           icon: "DiscountOutlined",
//         },
//       ],
//     },
//     {
//       id: 6,
//       name: "Approver",
//       path: "/Approver",
//       icon: "CreditScoreOutlined",
//       open: approverOpen,
//       onToggle: () => {
//         approverOnToggle();
//         receiverOnClose();
//         requestOnClose();
//         userManagementOnClose();
//         masterlistOnClose();
//         ticketingOnClose();
//       },
//       sub: [
//         {
//           id: 1,
//           name: "Approval",
//           path: "/approver/approval",
//         },
//         {
//           id: 2,
//           name: "View Tickets",
//           path: "/approver/view-tickets",
//         },
//       ],
//     },
//     {
//       id: 7,
//       name: "Ticketing",
//       path: "/ticketing",
//       icon: "ConfirmationNumberOutlined",
//       open: ticketingOpen,
//       onToggle: () => {
//         ticketingOnToggle();
//         receiverOnClose();
//         requestOnClose();
//         userManagementOnClose();
//         masterlistOnClose();
//         approverOnClose();
//       },
//       sub: [
//         {
//           id: 1,
//           name: "Tickets",
//           path: "/ticketing/issue-handler-tickets",
//           icon: "ConfirmationNumberOutlined",
//         },
//       ],
//     },
//     {
//       id: 7,
//       name: "Checklist Management",
//       path: "/checklist-management",
//       icon: "FolderOutlined",
//     },
//     {
//       id: 8,
//       name: "PMS",
//       path: "/pms",
//       icon: "BuildCircleOutlined",
//     },
//     {
//       id: 9,
//       name: "Reports",
//       path: "/reports",
//       icon: "AssessmentOutlined",
//     },
//     {
//       id: 10,
//       name: "Filing",
//       path: "/filing",
//       icon: "AttachFileOutlined",
//     },
//     {
//       id: 11,
//       name: "Generate",
//       path: "/generate",
//       icon: "BallotOutlined",
//     },
//   ];

//   return (
//     <Stack>
//       <List
//         sx={{
//           marginTop: "35px",
//           marginLeft: "6px",
//           marginRight: "17px",
//           padding: "0px",
//         }}
//       >
//         {sidebarMenu
//           .filter((item) => userPermission?.includes(item.name))
//           .map((item, i) => (
//             <Fragment key={i}>
//               {item.sub?.length ? (
//                 <ListItemButton onClick={item.onToggle} selected={item.path === pathname}>
//                   <ListItemIcon>{getMenuIcon(item.icon)}</ListItemIcon>
//                   <ListItemText
//                     primary={item.name}
//                     primaryTypographyProps={{
//                       fontSize: "14px",
//                       fontWeight: "600",
//                       lineHeight: "24px",
//                       mb: "2px",
//                     }}
//                   />

//                   {(item?.name === "Ticketing" && openNotification) ||
//                   (item?.name === "Approver" && ticketApprovalNotification) ? (
//                     <Badge color="error" variant="dot">
//                       {item.open ? <ExpandLess /> : <ExpandMore />}
//                     </Badge>
//                   ) : item.open ? (
//                     <ExpandLess />
//                   ) : (
//                     <ExpandMore />
//                   )}
//                 </ListItemButton>
//               ) : (
//                 <ListItemButton onClick={() => navigate(item.path)} selected={item.path === pathname}>
//                   <ListItemIcon>{getMenuIcon(item.icon)}</ListItemIcon>

//                   <ListItemText
//                     primary={item.name}
//                     primaryTypographyProps={{
//                       fontSize: "14px",
//                       fontWeight: "600",
//                       lineHeight: "24px",
//                       mb: "2px",
//                     }}
//                   />
//                 </ListItemButton>
//               )}

//               {item.sub?.filter((subItem) => userPermission.includes(subItem.name)).length > 0 && (
//                 <Collapse
//                   in={item.open}
//                   timeout="auto"
//                   unmountOnExit
//                   sx={{
//                     maxHeight: item.open ? "250px" : "0",
//                     overflowY: "auto",
//                     transition: "max-height 0.3s ease-in-out",
//                   }}
//                 >
//                   <List
//                     sx={{
//                       marginTop: "4px",
//                       marginBottom: "4px",
//                       marginLeft: "25px",
//                       marginRight: "2px",
//                       padding: "0px",
//                       maxHeight: "500px", // Set max height
//                       overflowY: "auto", // Enable vertical scrolling
//                     }}
//                   >
//                     {item.sub
//                       .filter((subItem) => userPermission.includes(subItem.name))
//                       .map((subItem, j) => (
//                         <ListItemButton
//                           key={j}
//                           onClick={() => navigate(subItem.path)}
//                           selected={subItem.path === pathname}
//                           sx={{ padding: "2px" }}
//                         >
//                           {/* <ListItemIcon>{getSubMenuIcon(subItem.icon)}</ListItemIcon> */}

//                           <ListItemText
//                             primary={
//                               (subItem?.name === "Tickets" && openNotification) ||
//                               (subItem?.name === "Approval" && ticketApprovalNotification) ? (
//                                 <Box sx={{ display: "flex", width: "100%", alignItems: "center", gap: 0.5 }}>
//                                   <Typography
//                                     sx={{
//                                       fontSize: "14px",
//                                       fontWeight: 600,
//                                       lineHeight: "24px",
//                                     }}
//                                   >
//                                     {subItem.name}
//                                   </Typography>

//                                   <Badge
//                                     color="error"
//                                     badgeContent={
//                                       subItem?.name === "Tickets"
//                                         ? openNotification
//                                         : ticketApprovalNotification
//                                     }
//                                     sx={{
//                                       "& .MuiBadge-badge": {
//                                         left: 92,
//                                         top: 1,
//                                         fontSize: "0.65rem",
//                                         fontWeight: 400,
//                                       },
//                                     }}
//                                   />
//                                 </Box>
//                               ) : (
//                                 subItem.name
//                               )
//                             }
//                             primaryTypographyProps={{
//                               fontSize: "14px",
//                               fontWeight: "600",
//                               lineHeight: "24px",
//                               mb: "2px",
//                               marginLeft: "35px",
//                             }}
//                           />
//                         </ListItemButton>
//                       ))}
//                   </List>
//                 </Collapse>
//               )}
//             </Fragment>
//           ))}
//       </List>
//     </Stack>
//   );
// };

// const SidebarFooter = () => {
//   return <div>{/* Footer */}</div>;
// };
