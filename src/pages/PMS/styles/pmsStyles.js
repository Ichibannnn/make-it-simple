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

  // PMS Calendar layout
  parentContainer: {
    width: "100%",
    flexDirection: {
      xs: "column",
      md: "row",
    },
    height: "100%",
    justifyContent: "space-between",
    gap: { xs: 2, md: 0 },
  },

  calendarContainer: {
    width: {
      xs: "100%",
      md: "69%",
    },
    height: "100%",
    backgroundColor: theme.palette.bgForm.black3,
    padding: 1.5,
    borderRadius: "10px",
    order: { xs: 2, md: 1 },
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  calendarButtonContainer: {
    gap: 0.5,
    mb: 1,
    flexDirection: "row",
  },
  calendarHeaderButton: {
    fontSize: "12px",
    borderRadius: "6px",
  },

  // FullCalendar CSS var + selector overrides
  fullCalendarOverrides: {
    "& .fc": {
      "--fc-border-color": "#2a3446",
      "--fc-page-bg-color": "transparent",
      "--fc-neutral-bg-color": "#1a2233",
      "--fc-today-bg-color": "rgba(124, 92, 255, 0.12)",
    },
    "& .fc .fc-toolbar-title": {
      fontSize: "1.1rem",
      fontWeight: 700,
      color: "#fff",
    },
    "& .fc .fc-button": {
      textTransform: "capitalize",
      backgroundColor: "#232c3f",
      border: "none",
      borderRadius: "6px",
      boxShadow: "none",
      fontSize: "13px",
      padding: "4px 12px",
    },
    "& .fc .fc-button:hover": {
      backgroundColor: "#323d54",
    },
    "& .fc .fc-button-primary:not(:disabled).fc-button-active": {
      backgroundColor: theme.palette.primary.main,
    },
    "& .fc .fc-col-header-cell": {
      backgroundColor: "#161d2b",
      padding: "8px 0",
    },
    "& .fc .fc-col-header-cell-cushion": {
      fontSize: "12px",
      fontWeight: 600,
      color: "#8b93a7",
      textTransform: "uppercase",
    },
    "& .fc .fc-daygrid-day-number": {
      fontSize: "13px",
      color: "#c7cbd6",
      padding: "6px 8px",
    },
    "& .fc .fc-daygrid-day:hover": {
      backgroundColor: "rgba(255,255,255,0.03)",
      cursor: "pointer",
    },
  },

  calendarEventPill: {
    borderRadius: "5px",
    overflow: "hidden",
    width: "100%",
    py: "2px",
    px: "2px",
  },
  calendarTitle: {
    fontSize: "11px",
    fontWeight: 600,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    color: "#fff",
  },
  calendarLinkContent: {
    fontSize: "11px",
    fontWeight: 600,
  },
  searchAndTabContainer: {
    width: {
      xs: "100%",
      md: "70%",
    },
    flexDirection: "row",
    alignItems: "end",
    gap: 1,
  },

  skeletonHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  skeletonBody: {
    width: "100%",
    height: "100%",
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
    borderRadius: "10px",
    order: { xs: 1, md: 2 },
  },
  reminderTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
    mb: 0.5,
    "& svg": {
      fontSize: "22px",
      color: theme.palette.primary.main,
    },
    "& .MuiTypography-root": {
      fontSize: "1.1rem",
      fontWeight: 700,
    },
  },
  reminderLegend: {
    mb: 1,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
  },
  legendText: {
    fontSize: "11px",
    color: theme.palette.text.secondary,
  },
  reminderDropdownContainer: {
    mt: 2,
    gap: 1,
  },
  reminderDropdowns: {
    width: "100%",
    fontSize: "13px",
    borderRadius: "6px",
    backgroundColor: theme.palette.bgForm.black2,
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
    maxHeight: "425px",
    overflow: "auto",
    pr: 0.5,
  },
  reminderCard: {
    flexDirection: "row",
    borderRadius: "10px",
    backgroundColor: theme.palette.bgForm.black2,
    border: "1px solid transparent",
    transition: "border-color 0.15s ease",
    "&:hover": {
      borderColor: "#3a4560",
      cursor: "pointer",
    },
    // removed: overflow: "hidden"  ← this was clipping content
  },
  reminderStackContent: {
    p: 1.5,
    width: "100%",
    minWidth: 0, // allow this flex item to shrink instead of overflowing
  },
  reminderStoreHeader: {
    fontSize: "13px",
    fontWeight: 500,
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
    height: "490px",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  skeletonStyle: {
    backgroundColor: theme.palette.bgForm.black2,
    width: 420,
    overflow: "auto",
  },
  reminderNoStoreContainer: {
    spacing: 1,
    height: "420px",
    backgroundColor: theme.palette.bgForm.black2,
    justifyContent: "center",
    alignItems: "center",
  },

  stackIndicator: {
    width: "5px",
    flexShrink: 0,
    borderRadius: "10px 0 0 10px", // round the indicator's own corners instead of relying on parent overflow:hidden
  },
  chipStyle: {
    fontWeight: 600,
    fontSize: "11px",
    height: 20,
    borderRadius: "6px",
    width: "80px",
    color: "#ffffffde",
    "& .MuiChip-icon": {
      color: "#ffffffde",
      marginLeft: "6px",
      fontSize: "12px",
    },
    "& .MuiChip-label": {
      paddingLeft: "6px",
      paddingRight: "8px",
    },
    marginBottom: 0.75,
  },

  chipDateStyle: {
    fontWeight: 500,
    fontSize: "11px",
    height: 18,
    borderRadius: 1,
    width: "197px",
    alignItems: "center",
    color: "#ffffffde",
    "& .MuiChip-icon": {
      color: "#ffffffde",
      marginLeft: "3px",
    },
    "& .MuiChip-label": {
      paddingLeft: "8px",
    },
    marginBottom: 0.5,
  },

  chipIconStyle: {
    fontSize: 13,
    color: "#ffffffde",
  },

  skeletonContainer: {
    height: "100%",
  },

  // Store Visits Dialog
  dialogHeaderContainer: {
    borderBottom: "2px solid #4b586f",
  },
  dialogHeaderText: {
    padding: 2,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dialogHeaderDate: {
    fontSize: "13px",
    color: theme.palette.text.secondary,
  },
  storeContainer: {
    padding: 2,
    backgroundColor: theme.palette.bgForm.black2,
    border: "2px solid #4b586f",
    borderRadius: "12px",
  },
  storeStackDirection: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  storeStackName: {
    fontSize: "13px",
    fontWeight: 700,
  },
  storeStackStatus: {
    fontSize: "13px",
    fontWeight: 700,
  },
  storeStackArea: {
    fontSize: "12px",
    color: theme.palette.text.secondary,
  },
  reschedButton: {
    borderRadius: "5px",
    fontSize: "0.7rem",
    padding: "2px 6px",
    minWidth: "unset",
  },
  completionText: {
    fontSize: "12px",
    marginTop: 1,
  },
  noStoreVisitContainer: {
    height: "320px",
    justifyContent: "center",
    alignItems: "center",
  },

  // Reschedule Dialog
  rescheduleHeaderStack: {
    padding: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  currentScheduleContainer: {
    paddingRight: 4,
    paddingLeft: 4,
    paddingTop: 4,
    maxHeight: "400px",
  },
  currentScheduleBorder: {
    overflow: "auto",
    border: "1px solid #4b586f",
    borderRadius: "7px",
    padding: 2,
    mb: 1,
  },
  currentScheduleText: {
    fontSize: "12px",
    fontWeight: 700,
    color: theme.palette.text.secondary,
  },
  currentScheduleName: {
    fontSize: "13px",
    fontWeight: 800,
  },
  currentScheduleArea: {
    fontSize: "12px",
  },
  newRescheduleRemarksStack: {
    paddingRight: 4,
    paddingLeft: 4,
    paddingTop: 2,
    gap: 2,
  },
  newRescheduleRemarks: {
    width: "100%",
  },
  newReschedContainer: {
    alignItems: "center",
    gap: 0.5,
    flexDirection: "row",
  },
  datePicker: {
    textField: {
      variant: "outlined",
      sx: {
        "& .MuiInputBase-input": {
          padding: "8.5px 14px",
        },
        "& .MuiOutlinedInput-root": {
          fontSize: "13px",
        },
      },
    },
  },
  dialogActions: {
    width: "100%",
    padding: 2,
    flexDirection: "row",
    gap: 1,
  },
};
