import { theme } from "../../theme/theme";

const PRIMARY = theme.palette.primary.main; // #9e77ed

export const EXPANDED_WIDTH = 280;
export const COLLAPSED_WIDTH = 84;

export const sidebarStyles = {
  // Shell — width animates between the collapsed rail and the full panel (desktop
  // push mode). In overlay mode this is merged with `overlayPanel` below, which
  // takes it out of flow entirely (position: fixed) so it never reserves layout
  // space and can slide in on top of the dashboard.
  container: (collapsed) => ({
    height: "100%",
    width: collapsed ? `${COLLAPSED_WIDTH}px` : `${EXPANDED_WIDTH}px`,
    flexShrink: 0, // never let the flex row squeeze the rail below its target width
    willChange: "width", // hint the compositor so the width tween stays smooth
    overflowX: "hidden",
    overflowY: "auto",
    background: "linear-gradient(180deg, #1C2536 0%, #141A27 100%)",
    borderRight: "1px solid #232F42",
    transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    "&::-webkit-scrollbar": { width: "6px" },
    "&::-webkit-scrollbar-thumb": { backgroundColor: "#2D3748", borderRadius: "3px" },
    "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
    // Reveal keyframes for labels as the rail expands (declared once, referenced below).
    "@keyframes sidebarReveal": {
      from: { opacity: 0, transform: "translateX(-6px)" },
      to: { opacity: 1, transform: "translateX(0)" },
    },
  }),

  // Tablet/mobile overlay drawer. Merged onto `container` via sx array syntax
  // (only in overlay mode), so it inherits the background/scrollbar/etc and just
  // adds positioning + the slide transform.
  overlayPanel: (open) => ({
    position: "fixed",
    top: 0,
    left: 0,
    height: "100dvh",
    width: `${EXPANDED_WIDTH}px`,
    zIndex: 1301,
    transform: open ? "translateX(0)" : "translateX(-100%)",
    transition: "transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: open ? "8px 0 28px rgba(0, 0, 0, 0.45)" : "none",
  }),

  // Dim layer behind the overlay drawer; tapping it closes the drawer.
  backdrop: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(8, 11, 18, 0.55)",
    zIndex: 1300,
  },

  // Floating hamburger shown only while the overlay drawer is closed.
  mobileTrigger: {
    position: "fixed",
    top: 12,
    left: 12,
    zIndex: 1250,
    color: "#EDF2F7",
    backgroundColor: "#1C2536",
    border: "1px solid #232F42",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.35)",
    "&:hover": { backgroundColor: "#252E3E", borderColor: PRIMARY },
  },

  // ---- Phone bottom tab bar -------------------------------------------------
  bottomNav: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1200,
    height: "64px",
    // Content (icon + label) must never scroll or overflow this bar — a long
    // label like "Checklist Management" wrapping to two lines was previously
    // the only thing tall enough to push past 64px and read as a stray scroll.
    overflow: "hidden",
    overscrollBehavior: "contain", // stop a stray swipe here from scrolling the page behind it
    background: "linear-gradient(180deg, #1C2536 0%, #141A27 100%)",
    borderTop: "1px solid #232F42",
    boxShadow: "0 -4px 16px rgba(0, 0, 0, 0.35)",
    // Respect the home-indicator safe area on notched phones without adding
    // dead space on devices that don't have one.
    paddingBottom: "env(safe-area-inset-bottom, 0px)",
  },
  bottomNavAction: {
    color: "#7C889C",
    minWidth: "auto",
    maxWidth: "none",
    padding: "6px 4px",
    overflow: "hidden",
    "& .MuiBottomNavigationAction-label": {
      fontSize: "10.5px",
      fontWeight: 600,
      marginTop: "2px",
      // Clip to a single line with an ellipsis instead of wrapping — wrapping is
      // what let a long label grow taller than the bar and overflow it.
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "100%",
      "&.Mui-selected": { fontSize: "10.5px" }, // MUI bumps size on select by default — keep it steady
    },
    "&.Mui-selected": { color: PRIMARY },
  },

  // ---- Bottom sheets (quick-tab sub-menu + "More") --------------------------
  // Shared drag handle shown at the top of every bottom sheet.
  sheetHandle: {
    width: "36px",
    height: "4px",
    borderRadius: "2px",
    backgroundColor: "#3A4658",
    margin: "10px auto 6px auto",
  },
  sheetHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px 8px 16px",
  },
  sheetTitle: {
    fontSize: "15px",
    fontWeight: 700,
    color: "#EDF2F7",
  },
  // Small sheet for a single quick-tab's sub-items — sized to content, capped
  // so a long list still scrolls instead of covering the whole screen.
  subSheetPanel: {
    background: "linear-gradient(180deg, #1F2A3D 0%, #182030 100%)",
    borderTopLeftRadius: "16px",
    borderTopRightRadius: "16px",
    maxHeight: "60vh",
    paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))",
    overflowY: "auto",
    // Explicit, not just tidiness: leaving overflowX unset defaults to
    // 'visible', and per the CSS overflow spec a 'visible'/'auto' pairing gets
    // silently promoted so BOTH axes become scrollable. That let the rows'
    // hover translateX nudge (see navButton/subButton) flicker a horizontal
    // scrollbar in and out as the mouse moved between items.
    overflowX: "hidden",
  },
  // Larger "More" sheet — everything not pinned to a quick tab.
  bottomSheetPanel: {
    background: "linear-gradient(180deg, #1C2536 0%, #141A27 100%)",
    borderTopLeftRadius: "16px",
    borderTopRightRadius: "16px",
    maxHeight: "80vh",
    paddingBottom: "calc(16px + env(safe-area-inset-bottom, 0px))",
    overflowY: "auto",
    overflowX: "hidden", // see subSheetPanel above for why this has to be explicit
    "&::-webkit-scrollbar": { width: "6px" },
    "&::-webkit-scrollbar-thumb": { backgroundColor: "#2D3748", borderRadius: "3px" },
  },

  // Collapse toggle (desktop push rail) / close button (overlay drawer) — shares
  // the same row/position, only the icon and click target differ.
  toggleRow: (collapsed) => ({
    flexDirection: "row",
    justifyContent: collapsed ? "center" : "flex-end",
    padding: collapsed ? "12px 0 0 0" : "12px 14px 0 0",
  }),
  toggleButton: {
    color: "#A0AEC0",
    border: "1px solid #232F42",
    borderRadius: "8px",
    padding: "4px",
    transition: "color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease",
    "&:hover": {
      color: PRIMARY,
      backgroundColor: "#252E3E",
      borderColor: PRIMARY,
    },
  },
  toggleIcon: (collapsed) => ({
    fontSize: "20px",
    transition: "transform 0.25s ease",
    transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
  }),

  // Header / brand (original look preserved)
  header: (collapsed) => ({
    justifyContent: "center",
    alignItems: "center",
    padding: collapsed ? "10px 8px 6px 8px" : "12px 24px 8px 24px",
    gap: "5px",
    transition: "padding 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
  }),
  // Logo scales with the rail via CSS (not HTML attributes) so it tweens smoothly.
  logo: (collapsed) => ({
    width: collapsed ? "46px" : "74px",
    height: collapsed ? "31px" : "50px",
    transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1), height 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
  }),
  // Wrapper stays mounted and collapses its height/opacity for a smooth two-way transition.
  brandWrap: (collapsed) => ({
    width: "100%",
    display: "flex",
    justifyContent: "center",
    overflow: "hidden",
    maxHeight: collapsed ? 0 : "34px",
    opacity: collapsed ? 0 : 1,
    transform: collapsed ? "translateY(-4px)" : "translateY(0)",
    transition:
      "max-height 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease, transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
  }),
  brandRow: {
    flexDirection: "row",
    gap: 0.5,
    mt: 0.5,
    whiteSpace: "nowrap",
  },
  brandMis: {
    fontSize: ".9rem",
    fontWeight: 700,
    color: "#EDF2F7",
    lineHeight: 1.2,
    letterSpacing: 1,
  },
  brandHelpdesk: {
    fontSize: ".9rem",
    fontWeight: 400,
    color: "#EDF2F7",
    lineHeight: 1.2,
    letterSpacing: 1,
  },
  headerDivider: (collapsed) => ({
    borderColor: "#232F42",
    margin: collapsed ? "12px 14px 0 14px" : "14px 24px 0 24px",
  }),

  // Section label
  sectionLabel: {
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: 1.5,
    color: "#5B6678",
    margin: "18px 0 4px 26px",
    whiteSpace: "nowrap",
  },

  sectionLabelWrap: (collapsed) => ({
    overflow: "hidden",
    maxHeight: collapsed ? 0 : "26px",
    opacity: collapsed ? 0 : 1,
    transition: "max-height 0.22s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.18s ease",
  }),

  // Top-level list
  list: {
    marginLeft: "12px",
    marginRight: "12px",
    marginTop: 2,
    padding: 0,
  },
  navButton: (collapsed) => ({
    borderRadius: "12px",
    margin: "3px 0",
    padding: collapsed ? "10px" : "9px 12px",
    justifyContent: collapsed ? "center" : "flex-start",
    position: "relative",
    transition: "background-color 0.2s ease, transform 0.2s ease, padding 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      backgroundColor: "#252E3E",
      transform: collapsed ? "none" : "translateX(3px)",
    },
    "&.Mui-selected, &.Mui-selected:hover": {
      background: "linear-gradient(90deg, rgba(158, 119, 237, 0.22) 0%, rgba(158, 119, 237, 0.04) 100%)",
      "&::before": {
        content: '""',
        position: "absolute",
        left: 0,
        top: "22%",
        height: "56%",
        width: "3px",
        borderRadius: "0 4px 4px 0",
        backgroundColor: PRIMARY,
        boxShadow: `0 0 10px ${PRIMARY}`,
      },
      "& .MuiListItemIcon-root": { color: PRIMARY },
      "& .MuiListItemText-primary": { color: PRIMARY },
    },
  }),
  navIcon: (collapsed) => ({
    minWidth: collapsed ? 0 : "38px",
    justifyContent: "center",
    color: "#A9B4C6",
    transition: "min-width 0.25s cubic-bezier(0.4, 0, 0.2, 1), color 0.2s ease",
  }),
  navText: {
    fontSize: "14px",
    fontWeight: 600,
    lineHeight: "24px",
    mb: "2px",
    whiteSpace: "nowrap",
  },
  navLabelWrap: (collapsed) => ({
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "center",
    justifyContent: "space-between",
    flex: "1 1 auto",
    minWidth: 0,
    // Fluid instead of a fixed px cap — this row sits inside contexts of very
    // different widths (the 280px desktop rail vs. the much wider mobile "More"
    // sheet), and a hardcoded value only ever fit one of them. "100%" lets it
    // fill whatever space navButton's flex-start row actually leaves after the
    // icon, so justifyContent: space-between pushes the chevron flush to the
    // row's real right edge instead of stopping partway with dead space after it.
    maxWidth: collapsed ? 0 : "100%",
    opacity: collapsed ? 0 : 1,
    overflow: "hidden",
    whiteSpace: "nowrap",
    transition: "max-width 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.18s ease",
  }),
  // Single chevron that rotates instead of swapping icons — smoother open/close.
  chevron: (open) => ({
    color: "#7C889C",
    fontSize: "20px",
    transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    transform: open ? "rotate(180deg)" : "rotate(0deg)",
  }),

  // Notification dot for a top-level row (e.g. Ticketing/Approver). Rendered as a
  // sibling of navLabelWrap, positioned on the ListItemButton itself (which has
  // position: relative) — NOT nested inside navLabelWrap, since that has
  // overflow: hidden for the label-clip animation and would clip the dot.
  rowNotifDot: {
    position: "absolute",
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "#ef5350",
    boxShadow: "0 0 6px rgba(239, 83, 80, 0.8)",
    zIndex: 1,
  },

  // Sub items — indented against a vertical tree line
  subList: {
    position: "relative",
    marginTop: "2px",
    marginBottom: "6px",
    marginLeft: "30px",
    marginRight: "2px",
    padding: 0,
    borderLeft: "1px solid #2A374C",
  },
  subButton: {
    borderRadius: "10px",
    padding: "6px 10px",
    margin: "2px 0 2px 10px",
    position: "relative",
    transition: "background-color 0.2s ease, transform 0.2s ease",
    "&:hover": { backgroundColor: "#252E3E", transform: "translateX(2px)" },
    "&.Mui-selected, &.Mui-selected:hover": {
      backgroundColor: "rgba(158, 119, 237, 0.15)",
      "& .MuiListItemText-primary": { color: PRIMARY },
      "& .MuiListItemIcon-root": { color: PRIMARY },
      "&::before": {
        content: '""',
        position: "absolute",
        left: "-11px",
        top: "50%",
        transform: "translateY(-50%)",
        width: "7px",
        height: "7px",
        borderRadius: "50%",
        backgroundColor: PRIMARY,
        boxShadow: `0 0 8px ${PRIMARY}`,
      },
    },
  },
  subIcon: {
    minWidth: "28px",
    color: "#8B97AC",
    transition: "color 0.2s ease",
    "& .MuiSvgIcon-root": { fontSize: "18px" },
  },
  subText: {
    fontSize: "13.5px",
    fontWeight: 500,
    lineHeight: "22px",
  },
  subBadgeRow: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 0.75,
  },
  // Inline count chip — sits at the end of the row, never absolutely positioned,
  // so it can't overlap the label and the row transitions smoothly.
  subCount: {
    flexShrink: 0,
    minWidth: "18px",
    height: "18px",
    px: "5px",
    borderRadius: "9px",
    backgroundColor: "#ef5350",
    color: "#fff",
    fontSize: "0.65rem",
    fontWeight: 600,
    lineHeight: "18px",
    textAlign: "center",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },

  // Collapsed-rail hover flyout (portal-rendered, so it escapes the rail's overflow)
  flyoutPopper: {
    zIndex: 1300,
  },
  flyoutPaper: {
    minWidth: "212px",
    padding: "8px",
    background: "linear-gradient(180deg, #1F2A3D 0%, #182030 100%)",
    border: "1px solid #2A374C",
    borderRadius: "12px",
    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.45)",
    color: "#EDF2F7",
  },
  flyoutHeader: {
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: 0.6,
    color: "#EDF2F7",
    padding: "4px 10px 8px 10px",
    borderBottom: "1px solid #2A374C",
    marginBottom: "4px",
    whiteSpace: "nowrap",
  },
  flyoutList: {
    padding: 0,
  },
};
