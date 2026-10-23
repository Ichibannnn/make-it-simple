import { theme } from "../theme/theme";

export const global = {
  layoutContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    backgroundColor: theme.palette.bgForm.black1,
    color: "#fff",
    padding: {
      xs: "20px",
      md: "2px 64px 24px 64px",
    },
  },
  contentContainer: {
    mt: 2,
    width: "100%",
    height: "100%",
    alignItems: "flex-end",
    flexDirection: {
      xs: "column",
      md: "row",
    },
  },
  headerContainer: {
    flexDirection: {
      xs: "column",
      md: "row",
    },
  },
  paperDialog: {
    overflow: "auto",
    border: "2px solid #4b586f",
  },
  searchIcon: {
    marginRight: 0.5,
    color: "#A0AEC0",
  },
  tableCelHeader: {
    background: "#1C2536",
    color: "#D65DB1",
    fontWeight: 700,
    fontSize: "12px",
  },
  tableCellBody: {
    color: "#EDF2F7",
    fontSize: "14px",
    fontWeight: 500,
  },
  cardTypographyTitle: {
    fontWeight: 700,
    fontSize: "0.875rem",
    lineHeight: 1.57,
    color: "#D65DB1",
  },
  cardTypographyDescription: {
    fontWeight: 400,
    fontSize: "0.875rem",
    lineHeight: 1.57,
    color: theme.palette.text.main,
  },

  // Dialog
  dialog: { borderRadius: "none", padding: 0, backdropFilter: "blur(5px)" },
  dialogContent: {
    padding: 0,
  },

  // Custom Table
  table: {
    borderBottom: "none",
    fontSize: { xs: "10px", sm: "12px", md: "14px" },
    background: "#111927",
  },
  tableHead: {
    whiteSpace: "nowrap",
  },
  headCell: {
    background: "#111927",
    color: "#D65DB1",
    fontWeight: 700,
    fontSize: "12px",
    paddingY: "14px",
  },
  bodyCell: {
    color: "#EDF2F7",
    // background: "#1A222F",
    fontSize: "12px",
    fontWeight: 500,
    border: "2px solid #293242",
    paddingY: "14px",
  },
  tablePagination: {
    color: "#A0AEC0",
    fontWeight: 400,
    background: "#1C2536",
    borderRadius: "0px 0px 20px 20px",
  },

  customButtonText: { fontSize: "12px" },
  ticketNoText: {
    fontSize: { xs: "12px", md: "14px" },
    fontWeight: 700,
    background: "linear-gradient(90deg, #5c3ced, #ff8cc6)",
    WebkitBackgroundClip: "text",
    color: "transparent",
  },

  // Card Sections

  cards: {
    backgroundColor: theme.palette.bgForm.black3,
    borderRadius: "15px",
    border: "1px solid #2D3748",
    // borderColor: "#2D3748",
  },

  cardDetailBox: {
    width: "20%",
  },

  cardSpacer: {
    width: "10%",
  },

  cardDescDetailBox: {
    width: "60%",
  },

  cardRow: {
    flexDirection: "row",
    gap: 0.5,
    alignItems: "center",
  },

  cardTitle: {
    fontWeight: 700,
    fontSize: "0.775rem",
    lineHeight: 1.57,
    color: "#D65DB1",
  },

  cardDescription: {
    fontWeight: 400,
    fontSize: "0.775rem",
    lineHeight: 1.57,
    color: theme.palette.text.main,
    wordBreak: "break-word",
  },

  cardChip: {
    fontSize: "12px",
    backgroundColor: "#1D1F3B",
    color: theme.palette.primary.main,
    fontWeight: 800,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    mt: "5px",
    padding: "15px",
    gap: 4,
  },

  outlinedSearch: {
    flex: 1,
    borderRadius: "15px",
    fontSize: "small",
    fontWeight: 400,
    lineHeight: "1.4375rem",
  },

  searchIcon: {
    marginRight: 0.5,
    color: "#A0AEC0",
  },

  tabSection: {
    backgroundColor: theme.palette.bgForm.black3,
    borderRadius: "20px",
    marginTop: "10px",
    width: "100%",
  },

  tabBox: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },

  tabDivider: {
    background: "#2D3748",
    marginTop: "1px",
  },

  tabs: {
    ".MuiTab-root": {
      minWidth: { xs: "80px", md: "120px" },
      fontSize: { xs: "10px", sm: "12px", md: "13px" },
    },
    ".MuiTabs-scrollButtons": {
      color: "#fff",
      "&.Mui-disabled": {
        opacity: 0.3,
      },
    },
  },

  tab: {
    fontSize: "12px",
    fontWeight: 600,
  },

  badge: {
    ".MuiBadge-badge": {
      fontSize: "0.55rem",
      fontWeight: 400,
    },
  },

  anchorOrigin: {
    vertical: "top",
    horizontal: "left",
  },

  content: {
    width: "100%",
    justifyContent: "space-between",
  },

  dateFilterBox: {
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
  },
};
