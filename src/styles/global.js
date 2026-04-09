import { theme } from "../theme/theme";

export const global = {
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
};
