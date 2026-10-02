import { theme } from "../../../../theme/theme";

export const tokens = {
  bg: "#0b1020",
  panel: "#121a2e",
  panel2: "#0e1526",
  line: "#223052",
  text: "#e8edf8",
  muted: "#8f9bb8",
  violet: "#7c5cff",
  pink: "#ff4fa3",
  ok: "#34d399",
  warn: "#fbbf24",
  error: "#f87171",
};

const t = tokens;
const statusColor = { success: t.ok, error: t.error, pending: t.muted };

export const NEGATIVE_REQUESTS = ["Rejected", "Disapprove", "Cancel"];

export const getStatus = (request) => (!request ? "pending" : NEGATIVE_REQUESTS.includes(request) ? "error" : "success");

export const ticketStyle = {
  // ------- Issue View Dialog ---------- //

  //  ** Reusable
  titleHeader: {
    flexDirection: "row",
    gap: 1,
    color: theme.palette.text.secondary,
    alignItems: "center",
    fontSize: { xs: "10px", md: "14px" },
    fontWeight: 600,
    "&::before": {
      content: '""',
      width: 3,
      height: 14,
      borderRadius: "2px",
      background: `linear-gradient(${t.violet}, ${t.pink})`,
    },
  },

  titleHeaderIcon: {
    fontSize: { xs: "16px", md: "18px" },
  },

  titleSubIcon: {
    color: theme.palette.text.secondary,
    fontSize: { xs: "16px", md: "18px" },
  },

  titleSubText: {
    color: theme.palette.text.secondary,
    fontSize: { xs: "12px", md: "14px" },
  },

  fontSize: {
    fontSize: { xs: "12px", md: "13px" },
  },

  fontSizeSub: {
    fontSize: { xs: "12px", md: "13px" },
    color: theme.palette.text.secondary,
  },

  // ** Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 2,
    background: `linear-gradient(${t.panel}, ${t.panel}) padding-box, linear-gradient(135deg, #7c5cff66, ${t.line} 40%, #ff4fa355) border-box`,
    border: "1px solid transparent",
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
    fontWeight: 700,
  },

  departmentText: {
    fontSize: { xs: "11px", md: "13px" },
    color: theme.palette.text.secondary,
    fontWeight: 500,
  },

  avatarIcon: { width: 46, height: 46, borderRadius: "50%", background: `linear-gradient(135deg, ${t.violet}, ${t.pink})`, display: "grid", placeItems: "center", fontWeight: 700, fontSize: 16 },

  // ** Ticket Details
  ticketDetailsSection: {
    width: { xs: "auto", md: "100%" },
    padding: 2,
    background: `linear-gradient(${t.panel}, ${t.panel}) padding-box, linear-gradient(135deg, #7c5cff66, ${t.line} 40%, #ff4fa355) border-box`,
    border: "1px solid transparent",
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

  // ** Attachment
  attachmentBox: {
    width: "100%",
    background: `linear-gradient(${t.panel}, ${t.panel}) padding-box, linear-gradient(135deg, #7c5cff66, ${t.line} 40%, #ff4fa355) border-box`,
    border: "1px solid transparent",
    borderRadius: "15px",
  },

  noAttachmentBox: {
    width: "100%",
    borderRadius: "15px",
  },

  attachmentContent: {
    flexDirection: "row",
    gap: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },

  attachmentCards: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 1,
    background: `linear-gradient(${t.panel}, ${t.panel}) padding-box, linear-gradient(135deg, #7c5cff66, ${t.line} 40%, #ff4fa355) border-box`,
    border: "1px solid transparent",
    borderRadius: "15px",
  },

  attachmentNameBox: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 0.5,
    // borderBottom: "1px solid #2D3748",
  },

  // ** History
  accordionHistory: {
    background: `linear-gradient(${t.panel}, ${t.panel}) padding-box, linear-gradient(135deg, #7c5cff66, ${t.line} 40%, #ff4fa355) border-box`,
    border: "1px solid transparent",
    borderRadius: "15px",
    overflow: "hidden",

    "&:before": {
      display: "none",
    },

    "&.Mui-expanded": {
      borderRadius: "15px",
    },
  },

  transactionDateText: {
    fontSize: { xs: "10px", md: "12px" },
  },

  statusText: {
    fontSize: { xs: "13px", md: "15px" },
    fontWeight: 900,
  },

  historyDesc: { fontSize: { xs: "12px", md: "14px" } },

  transactedByBox: {
    flexDirection: "row",
    gap: 0.5,
    mt: 1,
    alignItems: "center",
  },

  trasactedByIcon: {
    fontSize: { xs: "17px", md: "19px" },
    color: theme.palette.text.main,
  },

  transactedBy: {
    fontSize: { xs: "12px", md: "14px" },
    fontStyle: "italic",
    fontWeight: 500,
    color: theme.palette.text.main,
  },

  reasonLabel: {
    fontSize: { xs: "12px", md: "14px" },
    fontWeight: 500,
    color: theme.palette.text.main,
  },

  reasonErrorText: {
    fontSize: { xs: "12px", md: "14px" },
    fontWeight: 500,
    color: theme.palette.error.main,
  },

  pendingBox: { display: "flex", direction: "row", alignItems: "center", justifyContent: "end", gap: 0.3 },

  // Timeline
  labTimeline: {
    p: 0,
    m: 0,
    "& .MuiTimelineOppositeContent-root": { flex: 0.28, pt: "2px", px: 2 },
  },
  labDot: (status = "pending", current = false) => {
    const color = statusColor[status];
    const filled = status !== "pending";
    return {
      m: "4px 0",
      p: "4px",
      bgcolor: filled ? color : "transparent",
      borderColor: current ? t.violet : color,
      borderWidth: 2,
      boxShadow: filled ? `0 0 0 4px ${color}22` : "none",
      ...(current && {
        animation: "tlPulse 1.8s ease-out infinite",
        "@keyframes tlPulse": {
          "0%": { boxShadow: `0 0 0 0 ${t.violet}66` },
          "100%": { boxShadow: `0 0 0 10px ${t.violet}00` },
        },
      }),
    };
  },

  // line fades from this step's color into the next step's color
  labConnector: (status = "pending", next = "pending") => ({
    width: 2,
    background: `linear-gradient(${status === "pending" ? t.line : statusColor[status]}, ${next === "pending" ? t.line : statusColor[next]})`,
  }),

  dateChip: {
    display: "inline-flex",
    alignItems: "center",
    gap: 0.5,
    mt: "6px",
    px: "8px",
    py: "2px",
    borderRadius: "99px",
    fontSize: 11,
    color: t.muted,
    background: "#ffffff08",
    border: `1px solid ${t.line}`,
    "& svg": { fontSize: 13 },
  },

  stepTitle: (status = "pending") => ({
    fontWeight: 600,
    fontSize: 14,
    color: status === "pending" ? t.text : statusColor[status],
  }),
  dateText: { fontSize: 12, color: t.muted },
  pendingBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 0.5,
    color: t.muted,
    "& svg": { fontSize: 16 },
  },
  whoRow: {
    display: "flex",
    alignItems: "center",
    gap: 0.5,
    mt: 1,
    "& svg": { fontSize: 16, color: t.muted },
  },
  whoText: { fontSize: 12, fontWeight: 600, color: "#c9d3ee" },
  reasonBox: (status = "pending") => ({
    mt: 1.5,
    p: "10px 12px",
    borderRadius: "10px",
    background: `${statusColor[status]}12`,
    borderLeft: `3px solid ${statusColor[status]}`,
  }),
  reasonLabel: { fontSize: 11, fontWeight: 600, color: t.muted, textTransform: "uppercase", letterSpacing: ".5px" },
  reasonText: { fontSize: 13, color: t.text },
};
