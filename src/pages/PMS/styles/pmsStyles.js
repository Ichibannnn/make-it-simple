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
  dialogTitleContainer: {
    flexDirection: "row",
    p: 2,
    justifyContent: "space-between",
    alignItems: "center",
  },
  dialogTitleBackground: {
    backgroundColor: theme.palette.bgForm.black1,
  },
  dialogTitleText: {
    fontWeight: 600,
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
  customSearch: {
    fontWeight: 400,
    lineHeight: "1.4375rem",
    borderRadius: "3px",
    fontSize: "13px",
  },
  tableSearch: {
    flex: "auto",
    fontWeight: 400,
    lineHeight: "1.4375rem",
    borderRadius: "3px",
    fontSize: "13px",
  },
  customSelect: {
    width: "100%",
    fontSize: "12px",
    background: theme.palette.primary.main,
  },
  menuItemsFont: {
    fontSize: "12px",
  },
  tableSelect: {
    width: "100%",
    fontSize: "12px",
    // background: theme.palette.primary.main,
  },
  tableMenuItemsFont: {
    fontSize: "14px",
  },
  inputLabel: {
    fontSize: "14px",
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
