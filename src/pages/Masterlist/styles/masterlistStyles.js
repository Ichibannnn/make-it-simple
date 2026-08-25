import zIndex from "@mui/material/styles/zIndex";
import { theme } from "../../../theme/theme";

// Shared masterlist styling — mirrors the PmsType look so every Masterlist
// page (CRUD and read-only/sync) renders with the same visual language.
export const masterlistStyles = {
  // Page shell
  pageContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: theme.palette.bgForm.black1,
    color: "#fff",
    padding: { xs: "20px", md: "44px 94px 94px 94px" },
  },
  pageHeader: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: { xs: "flex-start", md: "center" },
    flexDirection: { xs: "column", md: "row" },
    gap: 2,
  },
  titleGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1.5,
  },
  pageTitle: {
    fontWeight: 700,
    letterSpacing: "-0.5px",
  },
  countChip: {
    height: "22px",
    fontSize: "11px",
    fontWeight: 600,
    borderRadius: "6px",
    backgroundColor: "rgba(158, 119, 237, 0.15)",
    color: "#b79af2",
    border: "1px solid rgba(158, 119, 237, 0.35)",
  },
  pageSubtitle: {
    fontSize: "13px",
    color: theme.palette.text.secondary,
    marginTop: "4px",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
  },
  addButton: {
    borderRadius: "10px",
    fontWeight: 600,
    textTransform: "none",
    background: "linear-gradient(135deg, #9e77ed 0%, #7c5ce0 100%)",
    boxShadow: "0 6px 16px rgba(158, 119, 237, 0.35)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    "&:hover": {
      transform: "translateY(-1px)",
      background: "linear-gradient(135deg, #a988f0 0%, #8a6be8 100%)",
      boxShadow: "0 8px 22px rgba(158, 119, 237, 0.5)",
    },
  },
  // Sync/primary LoadingButton — keeps the gradient readable while loading.
  syncButton: {
    borderRadius: "10px",
    fontWeight: 600,
    textTransform: "none",
    color: "#fff",
    background: "linear-gradient(135deg, #9e77ed 0%, #7c5ce0 100%)",
    boxShadow: "0 6px 16px rgba(158, 119, 237, 0.35)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    "&:hover": {
      transform: "translateY(-1px)",
      background: "linear-gradient(135deg, #a988f0 0%, #8a6be8 100%)",
      boxShadow: "0 8px 22px rgba(158, 119, 237, 0.5)",
    },
    "&.Mui-disabled": {
      color: "rgba(255, 255, 255, 0.7)",
      background: "linear-gradient(135deg, #6f57a8 0%, #5a45a0 100%)",
    },
  },
  // Secondary outlined action (e.g. "Add Sub Unit" next to a sync button).
  secondaryButton: {
    borderRadius: "10px",
    fontWeight: 600,
    textTransform: "none",
    borderColor: "rgba(158, 119, 237, 0.5)",
    color: "#b79af2",
    "&:hover": {
      borderColor: "#9e77ed",
      backgroundColor: "rgba(158, 119, 237, 0.08)",
    },
  },

  // Card wrapper around tabs + table
  contentContainer: {
    backgroundColor: theme.palette.bgForm.black3,
    borderRadius: "20px",
    marginTop: "24px",
    border: "1px solid #1E2A3D",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.28)",
  },

  // Tabs
  tabs: {
    paddingX: "8px",
    ".MuiTab-root": {
      minWidth: { xs: "80px", md: "120px" },
      fontSize: { xs: "10px", sm: "12px", md: "14px" },
      textTransform: "none",
      color: theme.palette.text.secondary,
      transition: "color 0.2s ease",
      "&.Mui-selected": { color: theme.palette.primary.main },
    },
    ".MuiTabs-indicator": {
      height: "3px",
      borderRadius: "3px 3px 0 0",
      backgroundColor: theme.palette.primary.main,
    },
    ".MuiTabs-scrollButtons": {
      color: "#fff",
      "&.Mui-disabled": { opacity: 0.3 },
    },
  },
  tab: {
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "0.3px",
  },
  divider: {
    background: "#2D3748",
    marginTop: "1px",
  },

  // Search
  searchContainer: {
    marginTop: "10px",
    padding: "20px",
  },
  searchInput: {
    flex: 1,
    maxWidth: "440px",
    borderRadius: "12px",
    fontSize: "small",
    fontWeight: 400,
    lineHeight: "1.4375rem",
    backgroundColor: theme.palette.bgForm.black1,
    transition: "box-shadow 0.2s ease",
    "&.Mui-focused": {
      boxShadow: "0 0 0 3px rgba(158, 119, 237, 0.22)",
    },
  },
  searchIcon: {
    marginRight: 0.5,
    color: "#A0AEC0",
  },

  // Table
  table: {
    borderBottom: "none",
    fontSize: { xs: "10px", sm: "12px", md: "14px" },
  },
  headCell: {
    background: "#1C2536",
    color: "#D65DB1",
    fontWeight: 700,
    fontSize: "11px",
    letterSpacing: "0.8px",
    textTransform: "uppercase",
    paddingY: "14px",
  },
  bodyCell: {
    color: "#EDF2F7",
    fontSize: "14px",
    fontWeight: 500,
    borderBottom: "1px solid #1E2A3D",
    paddingY: "14px",
  },

  // Status chip — glowing dot + pill, color depends on active state
  statusChip: (isActive) => ({
    height: "24px",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.5px",
    borderRadius: "8px",
    backgroundColor: isActive ? "#0F2B28" : "#2D2823",
    color: isActive ? "#10B981" : "#D27D0E",
    border: `1px solid ${isActive ? "rgba(16, 185, 129, 0.35)" : "rgba(210, 125, 14, 0.35)"}`,
    "& .MuiChip-label": { paddingLeft: "8px", paddingRight: "10px" },
    "&::before": {
      content: '""',
      display: "block",
      width: "6px",
      height: "6px",
      marginLeft: "8px",
      borderRadius: "50%",
      backgroundColor: isActive ? "#10B981" : "#D27D0E",
      boxShadow: `0 0 6px ${isActive ? "#10B981" : "#D27D0E"}`,
    },
  }),

  // Origin / neutral pill (e.g. Manual vs Syncing)
  originChip: {
    height: "24px",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.5px",
    borderRadius: "8px",
    backgroundColor: theme.palette.bgForm.black1,
    color: theme.palette.text.main,
    border: "1px solid #24344B",
  },

  // Mobile card layout
  card: {
    backgroundColor: theme.palette.bgForm.black2,
    borderRadius: "14px",
    border: "1px solid #24344B",
    borderLeft: "3px solid #9e77ed",
    transition: "transform 0.2s ease, border-color 0.2s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      borderColor: "#9e77ed",
    },
  },
  cardChip: {
    fontSize: "10px",
  },
  cardLabel: {
    fontWeight: 700,
    fontSize: "0.875rem",
    lineHeight: 1.57,
    color: "#D65DB1",
  },
  cardValue: {
    fontWeight: 400,
    fontSize: "0.875rem",
    lineHeight: 1.57,
    color: theme.palette.text.main,
  },

  // Shared feedback (loading / empty / error) block
  feedbackContainer: {
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
    gap: 1,
  },
  feedbackText: {
    color: "#EDF2F7",
  },

  // Pagination
  pagination: {
    color: "#A0AEC0",
    fontWeight: 400,
    borderTop: "1px solid #1E2A3D",
  },
  paginationMobile: {
    color: "#A0AEC0",
    fontWeight: 400,
    background: "#1C2536",
    borderRadius: "0px 0px 20px 20px",
  },

  // Dialog
  dialogPaper: {
    borderRadius: "16px",
    border: "1px solid #24344B",
    overflow: "unset",
    padding: 0,
  },
  dialogTitle: {
    display: "flex",
    justifyContent: "left",
    gap: 1,
    paddingTop: 3,
    paddingLeft: 3,
    fontSize: "16px",
    fontWeight: 500,
    color: theme.palette.text.main,
  },
  dialogTitleIcon: {
    fontSize: "22px",
    color: theme.palette.success.main,
  },
  dialogSubtitle: {
    fontSize: "12.5px",
    color: theme.palette.text.secondary,
    paddingLeft: 3,
    marginBottom: "4px",
  },
  dialogStack: {
    // padding: "5px",
    gap: 2,
    mb: 1,
  },

  disabledSaveButton: {
    ":disabled": {
      background: theme.palette.secondary.main,
      color: "black",
    },
  },

  formField: {
    justifyContent: "flex-start",
  },

  fieldText: {
    fontWeight: 500,
    fontSize: "13px",
    color: theme.palette.text.main,
  },
};
