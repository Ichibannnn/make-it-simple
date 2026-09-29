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
  dialogContent: {
    padding: 0,
  },

  // Custom Table
  table: {
    borderBottom: "none",
    fontSize: { xs: "10px", sm: "12px", md: "14px" },
  },
  tableHead: {
    whiteSpace: "nowrap",
  },
  headCell: {
    background: "#111927",
    color: "#D65DB1",
    fontWeight: 700,
    fontSize: "12px",
    // letterSpacing: "0.8px",
    // textTransform: "uppercase",
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
};
