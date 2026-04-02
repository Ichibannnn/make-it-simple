import { useMediaQuery } from "@mui/material";
import { theme } from "../../../theme/theme";

export const pmsStyles = {
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
  pmsContentContainer: {
    mt: 2,
    width: "100%",
    height: "100%",
    alignItems: "flex-end",
    flexDirection: {
      xs: "column",
      md: "row",
    },
  },
  pmsHeaderContainer: {
    flexDirection: {
      xs: "column",
      md: "row",
    },
  },
  dialog: {
    borderRadius: 0,
    padding: 0,
    backdropFilter: "blur(5px)",
  },
  dialogContent: {
    padding: 0,
  },
  dialogStackContainer: {
    paddingRight: 4,
    paddingLeft: 4,
    paddingTop: 4,
  },
  dashedUploadBox: {
    height: "300px",
    padding: 2,
    overflow: "auto",
    border: "1px solid #4b586f",
    borderRadius: "7px",
    borderStyle: "dashed",
    borderWidth: "2px",
    backgroundColor: theme.palette.bgForm.black2,
    justifyContent: "center",
    alignItems: "center",
  },
  buttons: {
    fontSize: "12px",
  },
  customSelect: {
    width: "100%",
    fontSize: "12px",
    background: theme.palette.primary.main,
  },
  customSearch: {
    fontWeight: 400,
    lineHeight: "1.4375rem",
    borderRadius: "3px",
    fontSize: "12px",
  },
  customSearchIcon: {
    marginRight: 0.5,
    color: "#A0AEC0",
  },
  menuItemsFont: {
    fontSize: "12px",
  },
  customTabs: {
    ".MuiTab-root": {
      minWidth: {
        xs: "80px",
        md: "120px",
      },
      fontSize: { xs: "10px", sm: "12px", md: "13px" },
    },
    ".MuiTabs-scrollButtons": {
      color: "#fff",
      "&.Mui-disabled": {
        opacity: 0.3,
      },
    },
  },
  customTab: {
    fontSize: "12px",
    fontWeight: 600,
    ".MuiBadge-badge": {
      color: "#ffff",
    },
  },
  selectFilterContainer: {
    width: {
      xs: "100%",
      md: "30%",
    },
    gap: 1,
  },

  searchContainer: {},
  selectFilterContainer: {
    width: {
      xs: "100%",
      md: "30%",
    },
    flexDirection: {
      xs: "column",
      md: "row",
    },
    gap: 1,
  },
  selectSiteContainer: {
    width: {
      xs: "100%",
      md: "48%",
    },
  },
  selectPmsTypeContainer: {
    width: {
      xs: "100%",
      md: "48%",
    },
  },
};
