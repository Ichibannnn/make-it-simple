import { theme } from "../../../theme/theme";

export const pmsStyles = {
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

  // PMS Calendar
  parentContainer: {
    width: "100%",
    flexDirection: {
      xs: "column",
      md: "row",
    },
    height: "100%",
    justifyContent: "space-between",
  },
  calendarContainer: {
    width: {
      xs: "100%",
      md: "69%",
    },
    height: "100%",
    backgroundColor: theme.palette.bgForm.black3,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  calendarButtonContainer: {
    direction: "row",
    gap: 0.5,
    mb: 1,
    flexDirection: "row",
  },
  calendarHeaderButton: {
    fontSize: "12px",
  },
  calendarTitle: {
    fontSize: "11px",
    fontWeight: 500,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
  calendarLinkContent: {
    fontSize: "11px",
    fontWeight: 600,
  },

  // PMS Reminder
  reminderContainer: {
    width: {
      xs: "100%",
      md: "30%",
    },
    backgroundColor: theme.palette.bgForm.black3,
    height: "100%",
    p: 2,
  },
  reminderTitle: {
    flexDirection: "row",
    gap: 0.5,
  },
  reminderDropdownContainer: {
    mt: 4,
    gap: 1,
  },
  reminderDropdowns: {
    width: "100%",
    fontSize: "13px",
  },
  reminderMenuItems: {
    fontSize: "13px",
  },
  reminderDropdownTitles: {
    fontSize: "13px",
    fontWeight: 600,
    color: theme.palette.text.secondary,
  },
  reminderStoresContainer: {
    spacing: 1,
    maxHeight: "420px",
    overflow: "auto",
  },
  reminderStackContent: {
    spacing: 1,
    p: 1,
    width: "100%",
    backgroundColor: theme.palette.bgForm.black2,
  },
  reminderStoreHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    mb: 1,
  },
  reminderStoreHeader: {
    fontSize: "13px",
    fontWeight: 800,
  },
  reminderStoreStatus: {
    fontSize: "13px",
    fontWeight: 700,
  },
  reminderDetailsContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  reminderDetailsContent: {
    flexDirection: "row",
    gap: 0.5,
  },
  reminderCalendarIcon: {
    fontSize: "16px",
    color: theme.palette.text.secondary,
  },
  reminderContentTexts: {
    fontSize: "12px",
    color: theme.palette.text.secondary,
  },
  reminderSkeletonContainer: {
    spacing: 1,
    height: "420px",
    // backgroundColor: theme.palette.bgForm.black2,
    justifyContent: "center",
    alignItems: "center",
  },
  skeletonStyle: {
    backgroundColor: theme.palette.bgForm.black2,
  },
  reminderNoStoreContainer: {
    spacing: 1,
    height: "420px",
    backgroundColor: theme.palette.bgForm.black2,
    justifyContent: "center",
    alignItems: "center",
  },
};
