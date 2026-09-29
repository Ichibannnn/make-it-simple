import { theme } from "../../../../theme/theme";

export const ticketStyle = {
  // ------- Issue View Dialog ---------- //

  // ** Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 2,
    backgroundColor: theme.palette.bgForm.black2,
    border: "2px solid #293242",
    borderRadius: "15px",
  },

  secondaryText: {
    color: theme.palette.text.secondary,
    fontWeight: 500,
    fontSize: { xs: "10px", md: "12px" },
  },

  requestorText: {
    fontSize: { xs: "13px", md: "15px" },
    color: theme.palette.text.main,
    fontWeight: 600,
  },

  departmentText: {
    fontSize: { xs: "11px", md: "13px" },
    color: theme.palette.text.secondary,
    fontWeight: 500,
  },

  avatarIcon: { fontSize: { xs: "40px", md: "60px" } },

  // ** Ticket Details
  ticketDetailsSection: {
    width: { xs: "auto", md: "100%" },
    background: theme.palette.bgForm.black2,
    padding: 2,
    border: "2px solid #293242",
    borderRadius: "15px",
  },

  detailLayout: {
    flexDirection: { xs: "column", md: "row" },
  },

  detailBox: {
    flexDirection: "column",
    padding: 1,
    mt: 2,
    gap: 0.5,
    ml: 2,
  },

  detailRowTextLayout: { width: { xs: "auto", md: "18%" } },

  ticketTitleHeader: {
    flexDirection: "row",
    gap: 1,
    color: theme.palette.text.main,
    alignItems: "center",
    fontSize: { xs: "12px", md: "14px" },
  },

  attachmentTitleHeader: {
    flexDirection: "row",
    gap: 1,
    color: theme.palette.text.main,
    alignItems: "center",
    fontSize: { xs: "12px", md: "14px" },
  },

  receiptIcon: {
    fontSize: "18px",
  },

  attachmentIcon: {
    fontSize: { xs: "16px", md: "18px" },
  },

  ticketTitleLabel: {
    textAlign: { xs: "left", md: "left" },
    color: theme.palette.text.secondary,
    fontWeight: "500",
    fontSize: { xs: "12px", md: "13px" },
  },

  ticketDescLabel: {
    color: theme.palette.text.main,
    fontWeight: "500",
    fontSize: { xs: "12px", md: "13px" },
  },

  spacer: {
    display: { xs: "none", md: "block" },
    width: "10%",
  },

  valueBox: {
    ml: { xs: 0, md: 2 },
    width: { xs: "auto", md: "72%" },
  },

  // ** History
  accordionHistory: { background: theme.palette.bgForm.black2, border: "2px solid #293242", borderRadius: "15px" },

  accordionTitleHeader: {
    flexDirection: "row",
    gap: 1,
    color: theme.palette.text.main,
    alignItems: "center",
    fontSize: { xs: "12px", md: "14px" },
  },
};
