import {
  Badge,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Collapse,
  Divider,
  Drawer,
  Fade,
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
import { Close, ExpandMore, MenuOpen, MoreHoriz } from "@mui/icons-material";

import { getMenuIcon, getSubMenuIcon } from "./GetIcon";
import { useSelector } from "react-redux";

import useDisclosure from "../hooks/useDisclosure";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetNotificationQuery } from "../features/api_notification/notificationApi";

import helpDeskLogo from "../assets/images/helpdesk_icon.png";
import { sidebarStyles as sx } from "./styles/sidebarStyles";


const OVERLAY_BREAKPOINT = 1281;
const MOBILE_BREAKPOINT = 640;
const RAIL_COLLAPSE_BREAKPOINT = 1639;
const MOBILE_QUICK_ITEM_NAMES = ["Overview", "Ticketing", "Checklist Management", "Reports"];
const MOBILE_MENU_ITEMS = [
  { id: 1, name: "Overview", path: "/overview", icon: "EqualizerOutlined" },
  {
    id: 2,
    name: "User Management",
    path: "/user-management",
    icon: "PeopleOutlinedIcon",
    sub: [
      {
        id: 1,
        name: "User Account",
        path: "/user-management/user-account",
        icon: "PermIdentityOutlinedIcon",
      },
      { id: 2, name: "User Role", path: "/user-management/user-role", icon: "ManageAccountsOutlinedIcon" },
      { id: 3, name: "User Type", path: "/user-management/user-type", icon: "SupervisorAccount" },
    ],
  },
  {
    id: 3,
    name: "Masterlist",
    path: "/masterlist",
    icon: "ChecklistOutlinedIcon",
    sub: [
      { id: 1, name: "One Charging", path: "/masterlist/one-charging", icon: "BusinessOutlinedIcon" },
      { id: 2, name: "Service Provider", path: "/masterlist/service-provider", icon: "HubOutlined" },
      { id: 3, name: "Channel Setup", path: "/masterlist/channel-setup", icon: "HubOutlined" },
      { id: 4, name: "Category", path: "/masterlist/category", icon: "CategoryOutlined" },
      { id: 5, name: "Sub Category", path: "/masterlist/sub-category", icon: "AutoAwesomeMotionOutlined" },
      {
        id: 6,
        name: "Concern Category",
        path: "/masterlist/concern-category",
        icon: "AutoAwesomeMotionOutlined",
      },
      { id: 7, name: "Receiver Setup", path: "/masterlist/receiver-setup", icon: "ContactsOutlined" },
      { id: 8, name: "Approver Setup", path: "/masterlist/approver-setup", icon: "GroupsOutlined" },
      { id: 9, name: "Sites", path: "/masterlist/sites", icon: "StoreMallDirectoryOutlined" },
      { id: 10, name: "PMS Type", path: "/masterlist/pms-type", icon: "BackupTableOutlined" },
      { id: 11, name: "Store List", path: "/masterlist/store-list", icon: "StorefrontOutlined" },
    ],
  },
  {
    id: 4,
    name: "Requestor",
    path: "/requestor",
    icon: "DynamicFeedOutlined",
    sub: [{ id: 1, name: "Requestor Concerns", path: "/requestor/requestor-concerns", icon: "DiscountOutlined" }],
  },
  {
    id: 5,
    name: "Receiver",
    path: "/receiver",
    icon: "DynamicFeedOutlined",
    sub: [{ id: 1, name: "Receiver Concerns", path: "/receiver/receiver-concerns", icon: "DiscountOutlined" }],
  },
  {
    id: 6,
    name: "Approver",
    path: "/Approver",
    icon: "CreditScoreOutlined",
    sub: [
      { id: 1, name: "Approval", path: "/approver/approval", icon: "FactCheckOutlined" },
      { id: 2, name: "View Tickets", path: "/approver/view-tickets", icon: "VisibilityOutlined" },
    ],
  },
  {
    id: 7,
    name: "Ticketing",
    path: "/ticketing",
    icon: "ConfirmationNumberOutlined",
    sub: [
      {
        id: 1,
        name: "Tickets",
        path: "/ticketing/issue-handler-tickets",
        icon: "ConfirmationNumberOutlined",
      },
    ],
  },
  { id: 8, name: "Checklist Management", path: "/checklist-management", icon: "FolderOutlined" },
  { id: 9, name: "PMS", path: "/pms", icon: "BuildCircleOutlined" },
  { id: 10, name: "Reports", path: "/reports", icon: "AssessmentOutlined" },
  { id: 11, name: "Filing", path: "/filing", icon: "AttachFileOutlined" },
  { id: 12, name: "Generate", path: "/generate", icon: "BallotOutlined" },
];

const Sidebar = () => {
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT}px)`);
  const isOverlay = useMediaQuery(`(max-width: ${OVERLAY_BREAKPOINT}px)`);
  const isSmallScreen = useMediaQuery(`(max-width: ${RAIL_COLLAPSE_BREAKPOINT}px)`);

  const [collapsed, setCollapsed] = useState(isSmallScreen);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Re-sync the rail's default when the viewport crosses the collapse breakpoint.
  useEffect(() => {
    setCollapsed(isSmallScreen);
  }, [isSmallScreen]);

  // Always start closed when crossing into/out of overlay mode (e.g. rotating a
  // tablet, or resizing a window) so it never gets stuck open behind the layout.
  useEffect(() => {
    setMobileOpen(false);
  }, [isOverlay]);

  // Lock background scroll while the tablet overlay drawer is open. (The phone
  // bottom-nav's own sheets handle their own scroll locking via MUI's Drawer.)
  useEffect(() => {
    if (!isOverlay || isMobile) return;
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOverlay, isMobile, mobileOpen]);

  // Phones: replace the side panel entirely with a fixed bottom tab bar.
  if (isMobile) {
    return <MobileBottomNav />;
  }

  if (isOverlay) {
    return (
      <>
        {/* Floating trigger — only shown while the drawer is closed. Move this into
            your topbar/header component if you'd rather trigger it from there;
            it just needs to call the same setMobileOpen(true). */}
        {!mobileOpen && (
          <IconButton onClick={() => setMobileOpen(true)} sx={sx.mobileTrigger} size="small">
            <MenuOpen sx={{ fontSize: 20 }} />
          </IconButton>
        )}

        <Fade in={mobileOpen} unmountOnExit>
          <Box sx={sx.backdrop} onClick={() => setMobileOpen(false)} />
        </Fade>

        <SidebarContent collapsed={false} overlayOpen={mobileOpen} onClose={() => setMobileOpen(false)} onNavigate={() => setMobileOpen(false)} />
      </>
    );
  }

  return <SidebarContent collapsed={collapsed} onToggleCollapse={() => setCollapsed((prev) => !prev)} />;
};

export default Sidebar;

// Single source of truth for the panel — used by the push rail (desktop) and the
// overlay drawer (tablet/mobile). `overlayOpen`/`onClose` are only passed in
// overlay mode; `onToggleCollapse` only in push-rail mode.
const SidebarContent = ({ collapsed, overlayOpen, onToggleCollapse, onClose, onNavigate }) => (
  <Stack sx={[sx.container(collapsed), onClose && sx.overlayPanel(overlayOpen)]}>
    <SidebarHeader collapsed={collapsed} onToggleCollapse={onToggleCollapse} onClose={onClose} />
    <SidebarList collapsed={collapsed} onExpand={() => collapsed && onToggleCollapse?.()} onNavigate={onNavigate} />
  </Stack>
);

const SidebarHeader = ({ collapsed, onToggleCollapse, onClose }) => {
  return (
    <>
      {(onToggleCollapse || onClose) && (
        <Stack sx={sx.toggleRow(collapsed)}>
          <Tooltip title={onClose ? "Close" : collapsed ? "Expand" : "Collapse"} placement="right" arrow>
            <IconButton onClick={onClose ?? onToggleCollapse} sx={sx.toggleButton} size="small">
              {onClose ? <Close sx={{ fontSize: 20 }} /> : <MenuOpen sx={sx.toggleIcon(collapsed)} />}
            </IconButton>
          </Tooltip>
        </Stack>
      )}

      <Stack sx={sx.header(collapsed)}>
        <Box component="img" src={helpDeskLogo} alt="MIS Helpdesk" className="logo-sidebar" sx={sx.logo(collapsed)} />

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

// A single top-level nav row. This ONE component handles both the collapsed rail
// and the expanded panel — nothing unmounts/remounts when `collapsed` flips, so
// the existing CSS transitions (padding, icon min-width, label max-width/opacity)
// can actually animate instead of popping. The hover flyout (Popper) is always
// mounted for items with sub-menus; it's just inert (`open={false}`) unless the
// rail happens to be collapsed.
const NavRow = ({ item, subs, hasSubs, collapsed, pathname, navigate, onExpand, onNavigate, openNotification, ticketApprovalNotification }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const closeTimer = useRef();
  const flyoutOpen = collapsed && hasSubs && Boolean(anchorEl);

  // Wrapped in Boolean(): when both counts are 0, "(name === X && 0) || (name === Y
  // && 0)" evaluates to the number 0 — falsy, but not `false`. React renders a bare
  // 0 as literal text in JSX (unlike false/null/undefined, which render nothing),
  // so without this cast the row would show a stray "0" instead of nothing.
  const hasRowNotif = Boolean((item.name === "Ticketing" && openNotification) || (item.name === "Approver" && ticketApprovalNotification));

  const openFlyout = (e) => {
    if (!collapsed || !hasSubs) return;
    clearTimeout(closeTimer.current);
    setAnchorEl(e.currentTarget);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setAnchorEl(null), 140);
  };

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const handleClick = () => {
    if (collapsed) onExpand(); // expand the rail first when triggered from the collapsed state
    if (hasSubs) {
      item.onToggle(); // just expands the group — don't close an overlay drawer for this
    } else {
      navigate(item.path);
      onNavigate?.(); // leaf item was actually navigated to — safe to close the drawer
    }
  };

  const handleSubClick = (subItem) => {
    if (!item.open) item.onToggle();
    navigate(subItem.path);
    setAnchorEl(null);
    onNavigate?.();
  };

  return (
    <Box onMouseEnter={openFlyout} onMouseLeave={scheduleClose} onFocus={openFlyout} onBlur={scheduleClose}>
      <NavTooltip collapsed={collapsed} title={item.name}>
        <ListItemButton onClick={handleClick} selected={item.path === pathname} sx={sx.navButton(collapsed)}>
          <ListItemIcon sx={sx.navIcon(collapsed)}>{getMenuIcon(item.icon)}</ListItemIcon>

          <Box sx={sx.navLabelWrap(collapsed)}>
            <ListItemText primary={item.name} primaryTypographyProps={sx.navText} />
            {hasSubs && <ExpandMore sx={sx.chevron(item.open)} />}
          </Box>

          {/* Rendered as a sibling, NOT inside navLabelWrap (which has overflow:
              hidden for the label-clip animation) — otherwise the dot gets clipped. */}
          {hasRowNotif && <Box sx={sx.rowNotifDot} />}
        </ListItemButton>
      </NavTooltip>

      {hasSubs && !collapsed && (
        <Collapse in={item.open} timeout={260} unmountOnExit>
          <List sx={sx.subList}>
            {subs.map((subItem, j) => (
              <SubMenuItem
                key={j}
                subItem={subItem}
                selected={subItem.path === pathname}
                onClick={() => {
                  navigate(subItem.path);
                  onNavigate?.();
                }}
                openNotification={openNotification}
                ticketApprovalNotification={ticketApprovalNotification}
              />
            ))}
          </List>
        </Collapse>
      )}

      {hasSubs && (
        <Popper open={flyoutOpen} anchorEl={anchorEl} placement="right-start" transition sx={sx.flyoutPopper} modifiers={[{ name: "offset", options: { offset: [0, 8] } }]}>
          {({ TransitionProps }) => (
            <Grow {...TransitionProps} style={{ transformOrigin: "left top" }} timeout={180}>
              <Paper elevation={8} sx={sx.flyoutPaper} onMouseEnter={() => clearTimeout(closeTimer.current)} onMouseLeave={scheduleClose}>
                <Typography sx={sx.flyoutHeader}>{item.name}</Typography>
                <List sx={sx.flyoutList}>
                  {subs.map((subItem, j) => (
                    <SubMenuItem
                      key={j}
                      subItem={subItem}
                      selected={subItem.path === pathname}
                      onClick={() => handleSubClick(subItem)}
                      openNotification={openNotification}
                      ticketApprovalNotification={ticketApprovalNotification}
                    />
                  ))}
                </List>
              </Paper>
            </Grow>
          )}
        </Popper>
      )}
    </Box>
  );
};

const SidebarList = ({ collapsed, onExpand, onNavigate }) => {
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
          name: "User Account",
          path: "/user-management/user-account",
          icon: "PermIdentityOutlinedIcon",
        },
        {
          id: 2,
          name: "User Role",
          path: "/user-management/user-role",
          icon: "ManageAccountsOutlinedIcon",
        },
        {
          id: 3,
          name: "User Types",
          path: "/user-management/user-types",
          icon: "SupervisorAccount",
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
          name: "Service Provider",
          path: "/masterlist/service-provider",
          icon: "HubOutlined",
        },
        {
          id: 3,
          name: "Channel Setup",
          path: "/masterlist/channel-setup",
          icon: "HubOutlined",
        },
        {
          id: 4,
          name: "Category",
          path: "/masterlist/category",
          icon: "CategoryOutlined",
        },
        {
          id: 5,
          name: "Sub Category",
          path: "/masterlist/sub-category",
          icon: "AutoAwesomeMotionOutlined",
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
          name: "Buildings",
          path: "/masterlist/buildings",
          icon: "ApartmentOutlined",
        },
        //         {
        //   id: 11,
        //   name: "Store List",
        //   path: "/masterlist/store-list",
        //   icon: "StorefrontOutlined",
        // },
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

            // Same NavRow for every item, collapsed or expanded — nothing swaps
            // component trees, so the width/padding/opacity CSS transitions can
            // actually animate instead of popping.
            return (
              <NavRow
                key={i}
                item={item}
                subs={visibleSubs}
                hasSubs={hasSubs}
                collapsed={collapsed}
                pathname={pathname}
                navigate={navigate}
                onExpand={onExpand}
                onNavigate={onNavigate}
                openNotification={openNotification}
                ticketApprovalNotification={ticketApprovalNotification}
              />
            );
          })}
      </List>
    </Stack>
  );
};

// A given top-level item counts as "active" if its own path matches, or the
// current route belongs to one of its sub-items.
const isMobileItemActive = (item, pathname) => item.path === pathname || item.sub?.some((s) => s.path === pathname);

// Phone bottom tab bar: a handful of curated quick-access tabs plus a "More" tab
// that opens a bottom sheet with everything else. Replaces the side panel
// entirely at this width — a left-edge drawer is hard to reach one-handed.
const MobileBottomNav = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const userPermission = useSelector((state) => state?.user?.permissions);
  const { data: notificationData } = useGetNotificationQuery();
  const openNotification = notificationData?.value?.openTicketNotif || 0;
  const ticketApprovalNotification = notificationData?.value?.forApprovalClosingNotif || 0;

  const [moreOpen, setMoreOpen] = useState(false);
  // Top-level item whose children are shown in the small quick-tab sub-sheet
  // (e.g. tapping "Ticketing" when it has sub-items, without opening full "More").
  const [subSheetItem, setSubSheetItem] = useState(null);

  const permittedItems = MOBILE_MENU_ITEMS.filter((item) => userPermission?.includes(item.name));

  const quickItems = MOBILE_QUICK_ITEM_NAMES.map((name) => permittedItems.find((item) => item.name === name))
    .filter(Boolean)
    .slice(0, 4);
  const quickNames = new Set(quickItems.map((item) => item.name));
  const restItems = permittedItems.filter((item) => !quickNames.has(item.name));

  // Highlight the matching quick tab, or the "More" tab if the current route
  // lives in the overflow list.
  const activeIndex = (() => {
    const quickIndex = quickItems.findIndex((item) => isMobileItemActive(item, pathname));
    if (quickIndex !== -1) return quickIndex;
    if (restItems.some((item) => isMobileItemActive(item, pathname))) return quickItems.length;
    return -1;
  })();

  const handleQuickTap = (item) => {
    const visibleSubs = item.sub?.filter((s) => userPermission.includes(s.name)) ?? [];
    if (visibleSubs.length) {
      setSubSheetItem({ ...item, sub: visibleSubs });
    } else {
      navigate(item.path);
    }
  };

  return (
    <>
      <BottomNavigation
        value={activeIndex}
        showLabels
        onChange={(_e, newValue) => {
          if (newValue === quickItems.length) {
            setMoreOpen(true);
          } else {
            handleQuickTap(quickItems[newValue]);
          }
        }}
        sx={sx.bottomNav}
      >
        {quickItems.map((item) => {
          const hasNotif = (item.name === "Ticketing" && openNotification) || (item.name === "Approver" && ticketApprovalNotification);
          return (
            <BottomNavigationAction
              key={item.id}
              label={item.name}
              sx={sx.bottomNavAction}
              icon={
                <Badge color="error" variant="dot" invisible={!hasNotif}>
                  {getMenuIcon(item.icon)}
                </Badge>
              }
            />
          );
        })}
        <BottomNavigationAction label="More" icon={<MoreHoriz />} sx={sx.bottomNavAction} />
      </BottomNavigation>

      {/* Small sheet for a quick tab's own sub-items only. */}
      <Drawer anchor="bottom" open={Boolean(subSheetItem)} onClose={() => setSubSheetItem(null)} PaperProps={{ sx: sx.subSheetPanel }}>
        {subSheetItem && (
          <>
            <Box sx={sx.sheetHandle} />
            <Typography sx={sx.flyoutHeader}>{subSheetItem.name}</Typography>
            <List sx={sx.flyoutList}>
              {subSheetItem.sub.map((s, j) => (
                <SubMenuItem
                  key={j}
                  subItem={s}
                  selected={s.path === pathname}
                  onClick={() => {
                    navigate(s.path);
                    setSubSheetItem(null);
                  }}
                  openNotification={openNotification}
                  ticketApprovalNotification={ticketApprovalNotification}
                />
              ))}
            </List>
          </>
        )}
      </Drawer>

      {/* "More" sheet — everything not pinned to a quick tab, same expand/collapse
          behavior as the desktop list. */}
      <Drawer anchor="bottom" open={moreOpen} onClose={() => setMoreOpen(false)} PaperProps={{ sx: sx.bottomSheetPanel }}>
        <Box sx={sx.sheetHandle} />
        <Stack sx={sx.sheetHeaderRow}>
          <Typography sx={sx.sheetTitle}>More</Typography>
          <IconButton onClick={() => setMoreOpen(false)} size="small" sx={sx.toggleButton}>
            <Close sx={{ fontSize: 18 }} />
          </IconButton>
        </Stack>
        <MoreMenuList items={restItems} pathname={pathname} onNavigate={() => setMoreOpen(false)} />
      </Drawer>
    </>
  );
};

// The overflow list inside the "More" sheet. Same look as the desktop expanded
// rail, but with a single-open accordion instead of six independent
// useDisclosure hooks — this list is dynamic (whatever didn't become a quick
// tab), so there's no fixed set of named groups to wire up individually.
const MoreMenuList = ({ items, pathname, onNavigate }) => {
  const navigate = useNavigate();
  const userPermission = useSelector((state) => state?.user?.permissions);
  const { data: notificationData } = useGetNotificationQuery();
  const openNotification = notificationData?.value?.openTicketNotif || 0;
  const ticketApprovalNotification = notificationData?.value?.forApprovalClosingNotif || 0;

  const [openId, setOpenId] = useState(() => items.find((item) => item.sub?.some((s) => s.path === pathname))?.id ?? null);

  return (
    <List sx={sx.list}>
      {items.map((item) => {
        const visibleSubs = item.sub?.filter((s) => userPermission.includes(s.name)) ?? [];
        const hasSubs = visibleSubs.length > 0;
        const isOpen = openId === item.id;
        // See the identical Boolean() cast in NavRow above — without it, a 0/0
        // notification count renders as a literal "0" next to the row instead
        // of nothing.
        const hasRowNotif = Boolean((item.name === "Ticketing" && openNotification) || (item.name === "Approver" && ticketApprovalNotification));

        return (
          <Fragment key={item.id}>
            <ListItemButton
              onClick={() => {
                if (hasSubs) {
                  setOpenId(isOpen ? null : item.id);
                } else {
                  navigate(item.path);
                  onNavigate?.();
                }
              }}
              selected={item.path === pathname}
              sx={sx.navButton(false)}
            >
              <ListItemIcon sx={sx.navIcon(false)}>{getMenuIcon(item.icon)}</ListItemIcon>
              <Box sx={sx.navLabelWrap(false)}>
                <ListItemText primary={item.name} primaryTypographyProps={sx.navText} />
                {hasSubs && <ExpandMore sx={sx.chevron(isOpen)} />}
              </Box>
              {hasRowNotif && <Box sx={sx.rowNotifDot} />}
            </ListItemButton>

            {hasSubs && (
              <Collapse in={isOpen} timeout={220} unmountOnExit>
                <List sx={sx.subList}>
                  {visibleSubs.map((s, j) => (
                    <SubMenuItem
                      key={j}
                      subItem={s}
                      selected={s.path === pathname}
                      onClick={() => {
                        navigate(s.path);
                        onNavigate?.();
                      }}
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
  );
};

// Version 1.1
// import {
//   Badge,
//   Box,
//   Collapse,
//   Divider,
//   Fade,
//   Grow,
//   IconButton,
//   List,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Paper,
//   Popper,
//   Stack,
//   Tooltip,
//   Typography,
//   useMediaQuery,
// } from "@mui/material";
// import { useEffect, useRef, useState } from "react";
// import { Close, ExpandMore, MenuOpen } from "@mui/icons-material";

// import { getMenuIcon, getSubMenuIcon } from "./GetIcon";
// import { useSelector } from "react-redux";

// import useDisclosure from "../hooks/useDisclosure";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useGetNotificationQuery } from "../features/api_notification/notificationApi";

// import helpDeskLogo from "../assets/images/helpdesk_icon.png";
// import { sidebarStyles as sx } from "./styles/sidebarStyles";

// const OVERLAY_BREAKPOINT = 1281;
// const RAIL_COLLAPSE_BREAKPOINT = 1639;

// const Sidebar = () => {
//   const isOverlay = useMediaQuery(`(max-width: ${OVERLAY_BREAKPOINT}px)`);
//   const isSmallScreen = useMediaQuery(`(max-width: ${RAIL_COLLAPSE_BREAKPOINT}px)`);

//   const [collapsed, setCollapsed] = useState(isSmallScreen);
//   const [mobileOpen, setMobileOpen] = useState(false);

//   // Re-sync the rail's default when the viewport crosses the collapse breakpoint.
//   useEffect(() => {
//     setCollapsed(isSmallScreen);
//   }, [isSmallScreen]);

//   // Always start closed when crossing into/out of overlay mode (e.g. rotating a
//   // tablet, or resizing a window) so it never gets stuck open behind the layout.
//   useEffect(() => {
//     setMobileOpen(false);
//   }, [isOverlay]);

//   // Lock background scroll while the overlay drawer is open.
//   useEffect(() => {
//     if (!isOverlay) return;
//     document.body.style.overflow = mobileOpen ? "hidden" : "";
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [isOverlay, mobileOpen]);

//   if (isOverlay) {
//     return (
//       <>
//         {/* Floating trigger — only shown while the drawer is closed. Move this into
//             your topbar/header component if you'd rather trigger it from there;
//             it just needs to call the same setMobileOpen(true). */}
//         {!mobileOpen && (
//           <IconButton onClick={() => setMobileOpen(true)} sx={sx.mobileTrigger} size="small">
//             <MenuOpen sx={{ fontSize: 20 }} />
//           </IconButton>
//         )}

//         <Fade in={mobileOpen} unmountOnExit>
//           <Box sx={sx.backdrop} onClick={() => setMobileOpen(false)} />
//         </Fade>

//         <SidebarContent
//           collapsed={false}
//           overlayOpen={mobileOpen}
//           onClose={() => setMobileOpen(false)}
//           onNavigate={() => setMobileOpen(false)}
//         />
//       </>
//     );
//   }

//   return <SidebarContent collapsed={collapsed} onToggleCollapse={() => setCollapsed((prev) => !prev)} />;
// };

// export default Sidebar;

// const SidebarContent = ({ collapsed, overlayOpen, onToggleCollapse, onClose, onNavigate }) => (
//   <Stack sx={[sx.container(collapsed), onClose && sx.overlayPanel(overlayOpen)]}>
//     <SidebarHeader collapsed={collapsed} onToggleCollapse={onToggleCollapse} onClose={onClose} />
//     <SidebarList
//       collapsed={collapsed}
//       onExpand={() => collapsed && onToggleCollapse?.()}
//       onNavigate={onNavigate}
//     />
//   </Stack>
// );

// const SidebarHeader = ({ collapsed, onToggleCollapse, onClose }) => {
//   return (
//     <>
//       {(onToggleCollapse || onClose) && (
//         <Stack sx={sx.toggleRow(collapsed)}>
//           <Tooltip title={onClose ? "Close" : collapsed ? "Expand" : "Collapse"} placement="right" arrow>
//             <IconButton onClick={onClose ?? onToggleCollapse} sx={sx.toggleButton} size="small">
//               {onClose ? <Close sx={{ fontSize: 20 }} /> : <MenuOpen sx={sx.toggleIcon(collapsed)} />}
//             </IconButton>
//           </Tooltip>
//         </Stack>
//       )}

//       <Stack sx={sx.header(collapsed)}>
//         <Box
//           component="img"
//           src={helpDeskLogo}
//           alt="MIS Helpdesk"
//           className="logo-sidebar"
//           sx={sx.logo(collapsed)}
//         />

//         {/* Kept mounted so it can fade/collapse smoothly in both directions */}
//         <Box sx={sx.brandWrap(collapsed)}>
//           <Stack sx={sx.brandRow}>
//             <Typography sx={sx.brandMis}>MIS</Typography>
//             <Typography sx={sx.brandHelpdesk}>HELPDESK</Typography>
//           </Stack>
//         </Box>
//       </Stack>

//       <Divider sx={sx.headerDivider(collapsed)} />
//     </>
//   );
// };

// // Wraps a nav button in a right-side tooltip only while the rail is collapsed.
// const NavTooltip = ({ collapsed, title, children }) =>
//   collapsed ? (
//     <Tooltip title={title} placement="right" arrow>
//       {children}
//     </Tooltip>
//   ) : (
//     children
//   );

// // Resolves the notification count a given sub-item should surface (0 when none).
// const subBadgeCount = (name, openNotification, ticketApprovalNotification) => {
//   if (name === "Tickets") return openNotification;
//   if (name === "Approval") return ticketApprovalNotification;
//   return 0;
// };

// // A single sub-menu row (icon + label + optional notification badge). Shared by the
// // expanded tree and the collapsed hover flyout so both stay in sync.
// const SubMenuItem = ({ subItem, selected, onClick, openNotification, ticketApprovalNotification }) => {
//   const badgeCount = subBadgeCount(subItem?.name, openNotification, ticketApprovalNotification);

//   return (
//     <ListItemButton onClick={onClick} selected={selected} sx={sx.subButton}>
//       <ListItemIcon sx={sx.subIcon}>{getSubMenuIcon(subItem.icon)}</ListItemIcon>
//       <ListItemText
//         primary={
//           badgeCount ? (
//             <Box sx={sx.subBadgeRow}>
//               <Typography sx={sx.subText}>{subItem.name}</Typography>
//               <Box component="span" sx={sx.subCount}>
//                 {badgeCount > 99 ? "99+" : badgeCount}
//               </Box>
//             </Box>
//           ) : (
//             subItem.name
//           )
//         }
//         primaryTypographyProps={sx.subText}
//       />
//     </ListItemButton>
//   );
// };

// const NavRow = ({
//   item,
//   subs,
//   hasSubs,
//   collapsed,
//   pathname,
//   navigate,
//   onExpand,
//   onNavigate,
//   openNotification,
//   ticketApprovalNotification,
// }) => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const closeTimer = useRef();
//   const flyoutOpen = collapsed && hasSubs && Boolean(anchorEl);

//   const hasRowNotif =
//     (item.name === "Ticketing" && openNotification) ||
//     (item.name === "Approver" && ticketApprovalNotification);

//   const openFlyout = (e) => {
//     if (!collapsed || !hasSubs) return;
//     clearTimeout(closeTimer.current);
//     setAnchorEl(e.currentTarget);
//   };
//   const scheduleClose = () => {
//     closeTimer.current = setTimeout(() => setAnchorEl(null), 140);
//   };

//   useEffect(() => () => clearTimeout(closeTimer.current), []);

//   const handleClick = () => {
//     if (collapsed) onExpand(); // expand the rail first when triggered from the collapsed state
//     if (hasSubs) {
//       item.onToggle(); // just expands the group — don't close an overlay drawer for this
//     } else {
//       navigate(item.path);
//       onNavigate?.(); // leaf item was actually navigated to — safe to close the drawer
//     }
//   };

//   const handleSubClick = (subItem) => {
//     if (!item.open) item.onToggle();
//     navigate(subItem.path);
//     setAnchorEl(null);
//     onNavigate?.();
//   };

//   return (
//     <Box onMouseEnter={openFlyout} onMouseLeave={scheduleClose} onFocus={openFlyout} onBlur={scheduleClose}>
//       <NavTooltip collapsed={collapsed} title={item.name}>
//         <ListItemButton onClick={handleClick} selected={item.path === pathname} sx={sx.navButton(collapsed)}>
//           <ListItemIcon sx={sx.navIcon(collapsed)}>{getMenuIcon(item.icon)}</ListItemIcon>

//           <Box sx={sx.navLabelWrap(collapsed)}>
//             <ListItemText primary={item.name} primaryTypographyProps={sx.navText} />
//             {hasSubs && <ExpandMore sx={sx.chevron(item.open)} />}
//           </Box>

//           {/* Rendered as a sibling, NOT inside navLabelWrap (which has overflow:
//               hidden for the label-clip animation) — otherwise the dot gets clipped. */}
//           {hasRowNotif && <Box sx={sx.rowNotifDot} />}
//         </ListItemButton>
//       </NavTooltip>

//       {hasSubs && !collapsed && (
//         <Collapse in={item.open} timeout={260} unmountOnExit>
//           <List sx={sx.subList}>
//             {subs.map((subItem, j) => (
//               <SubMenuItem
//                 key={j}
//                 subItem={subItem}
//                 selected={subItem.path === pathname}
//                 onClick={() => {
//                   navigate(subItem.path);
//                   onNavigate?.();
//                 }}
//                 openNotification={openNotification}
//                 ticketApprovalNotification={ticketApprovalNotification}
//               />
//             ))}
//           </List>
//         </Collapse>
//       )}

//       {hasSubs && (
//         <Popper
//           open={flyoutOpen}
//           anchorEl={anchorEl}
//           placement="right-start"
//           transition
//           sx={sx.flyoutPopper}
//           modifiers={[{ name: "offset", options: { offset: [0, 8] } }]}
//         >
//           {({ TransitionProps }) => (
//             <Grow {...TransitionProps} style={{ transformOrigin: "left top" }} timeout={180}>
//               <Paper
//                 elevation={8}
//                 sx={sx.flyoutPaper}
//                 onMouseEnter={() => clearTimeout(closeTimer.current)}
//                 onMouseLeave={scheduleClose}
//               >
//                 <Typography sx={sx.flyoutHeader}>{item.name}</Typography>
//                 <List sx={sx.flyoutList}>
//                   {subs.map((subItem, j) => (
//                     <SubMenuItem
//                       key={j}
//                       subItem={subItem}
//                       selected={subItem.path === pathname}
//                       onClick={() => handleSubClick(subItem)}
//                       openNotification={openNotification}
//                       ticketApprovalNotification={ticketApprovalNotification}
//                     />
//                   ))}
//                 </List>
//               </Paper>
//             </Grow>
//           )}
//         </Popper>
//       )}
//     </Box>
//   );
// };

// const SidebarList = ({ collapsed, onExpand, onNavigate }) => {
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
//           name: "Sites",
//           path: "/masterlist/sites",
//           icon: "StoreMallDirectoryOutlined",
//         },
//         {
//           id: 10,
//           name: "PMS Type",
//           path: "/masterlist/pms-type",
//           icon: "BackupTableOutlined",
//         },
//         {
//           id: 11,
//           name: "Store List",
//           path: "/masterlist/store-list",
//           icon: "StorefrontOutlined",
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
//           icon: "FactCheckOutlined",
//         },
//         {
//           id: 2,
//           name: "View Tickets",
//           path: "/approver/view-tickets",
//           icon: "VisibilityOutlined",
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
//       {/* <Box sx={sx.sectionLabelWrap(collapsed)}>
//         <Typography sx={sx.sectionLabel}>MENU</Typography>
//       </Box> */}

//       <List sx={sx.list}>
//         {sidebarMenu
//           .filter((item) => userPermission?.includes(item.name))
//           .map((item, i) => {
//             const visibleSubs = item.sub?.filter((subItem) => userPermission.includes(subItem.name)) ?? [];
//             const hasSubs = visibleSubs.length > 0;

//             // Same NavRow for every item, collapsed or expanded — nothing swaps
//             // component trees, so the width/padding/opacity CSS transitions can
//             // actually animate instead of popping.
//             return (
//               <NavRow
//                 key={i}
//                 item={item}
//                 subs={visibleSubs}
//                 hasSubs={hasSubs}
//                 collapsed={collapsed}
//                 pathname={pathname}
//                 navigate={navigate}
//                 onExpand={onExpand}
//                 onNavigate={onNavigate}
//                 openNotification={openNotification}
//                 ticketApprovalNotification={ticketApprovalNotification}
//               />
//             );
//           })}
//       </List>
//     </Stack>
//   );
// };

// Version 1.0
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
