import { theme } from "../../theme/theme";

const PRIMARY = theme.palette.primary.main; // #9e77ed

export const EXPANDED_WIDTH = 280;
export const COLLAPSED_WIDTH = 84;

export const sidebarStyles = {
  // Shell — width animates between the collapsed rail and the full panel
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

  // Collapse toggle
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
    maxWidth: collapsed ? 0 : "220px",
    opacity: collapsed ? 0 : 1,
    overflow: "hidden",
    whiteSpace: "nowrap",
    transition: "max-width 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.18 ease  ",
  }),
  // Single chevron that rotates instead of swapping icons — smoother open/close.
  chevron: (open) => ({
    color: "#7C889C",
    fontSize: "20px",
    transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    transform: open ? "rotate(180deg)" : "rotate(0deg)",
  }),

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
