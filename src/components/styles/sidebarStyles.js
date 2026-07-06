import { theme } from "../../theme/theme";

const PRIMARY = theme.palette.primary.main; // #9e77ed

export const EXPANDED_WIDTH = 280;
export const COLLAPSED_WIDTH = 84;

export const sidebarStyles = {
  // Shell — width animates between the collapsed rail and the full panel
  container: (collapsed) => ({
    height: "100%",
    width: collapsed ? `${COLLAPSED_WIDTH}px` : `${EXPANDED_WIDTH}px`,
    overflowX: "hidden",
    overflowY: "auto",
    background: "linear-gradient(180deg, #1C2536 0%, #141A27 100%)",
    borderRight: "1px solid #232F42",
    transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    "&::-webkit-scrollbar": { width: "6px" },
    "&::-webkit-scrollbar-thumb": { backgroundColor: "#2D3748", borderRadius: "3px" },
    "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
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
  }),
  brandRow: {
    flexDirection: "row",
    gap: 0.5,
    mt: 0.5,
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
  },

  // Top-level list
  list: {
    marginLeft: "12px",
    marginRight: "12px",
    padding: 0,
  },
  navButton: (collapsed) => ({
    borderRadius: "12px",
    margin: "3px 0",
    padding: collapsed ? "10px" : "9px 12px",
    justifyContent: collapsed ? "center" : "flex-start",
    position: "relative",
    transition: "background-color 0.2s ease, transform 0.2s ease",
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
    transition: "color 0.2s ease",
  }),
  navText: {
    fontSize: "14px",
    fontWeight: 600,
    lineHeight: "24px",
    mb: "2px",
  },
  chevron: {
    color: "#7C889C",
    fontSize: "20px",
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
  subText: {
    fontSize: "13.5px",
    fontWeight: 500,
    lineHeight: "22px",
  },
  subBadgeRow: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    gap: 0.5,
  },
  subBadge: {
    "& .MuiBadge-badge": {
      left: 92,
      top: 1,
      fontSize: "0.65rem",
      fontWeight: 400,
    },
  },
};
