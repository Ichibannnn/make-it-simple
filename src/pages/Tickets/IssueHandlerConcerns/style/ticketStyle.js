import { alpha, keyframes } from "@mui/material";
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

  tablebg: "#1C2536",
  tableheader: "#D65DB1",
};

const t = tokens;

// tone -> color. "pending" = upcoming step that hasn't happened yet
export const toneColor = {
  ok: t.ok,
  error: t.error,
  pending: t.muted,
};

const pulse = keyframes`
  0%   { box-shadow: 0 0 0 0 ${alpha(t.violet, 0.55)}; }
  100% { box-shadow: 0 0 0 10px ${alpha(t.violet, 0)}; }
`;

export const ticketStyle = {
  // Ticketing
  remarksChip: {
    color: "#ffffff",
    borderRadius: "none",
    maxWidth: "210px",
    cursor: "pointer",
    "& .MuiChip-label": {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  },

  // ------- Issue View Dialog ---------- //
  //  ** Reusable
  titleHeader: {
    flexDirection: "row",
    gap: 1,
    color: theme.palette.text.secondary,
    alignItems: "center",
    fontSize: { xs: "10px", md: "14px" },
    fontWeight: 600,
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

  // Cards
  cards: {
    backgroundColor: theme.palette.bgForm.black3,
    borderRadius: "15px",
    border: "1px solid #2D3748",
    // borderColor: "#2D3748",
  },

  cardContent: {
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#1A222F",
      color: "#9e77ed",
    },
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

  titleHeaderIcon: {
    fontSize: { xs: "16px", md: "18px" },
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
  accordionHistory: {
    background: `linear-gradient(${t.panel}, ${t.panel}) padding-box, linear-gradient(135deg, #7c5cff66, ${t.line} 40%, #ff4fa355) border-box`,
    border: "1px solid transparent",
    borderRadius: "15px",
    overflow: "hidden",
    "&:before": { display: "none" },
    "&.Mui-expanded": { borderRadius: "15px", margin: 0 },
  },

  titleBar: {
    width: 3,
    height: 14,
    borderRadius: 2,
    background: `linear-gradient(${t.violet}, ${t.pink})`,
  },

  titleText: { fontSize: 13, fontWeight: 600, color: t.text },

  // ** Timeline
  timeline: {
    p: 0,
    m: 0,
    "& .MuiTimelineOppositeContent-root": {
      flex: { xs: 0.3, md: 0.2 },
      px: { xs: 0.5, md: 1.5 },
      pt: "14px",
      textAlign: "right",
    },
  },

  timelineContent: { py: 0, pl: { xs: 1, md: 2 }, pr: 0 },

  // Dot: filled for done steps, hollow for upcoming, pulsing for the next one
  dot: ({ tone, next }) => {
    const color = next ? t.violet : toneColor[tone];
    const hollow = tone === "pending";
    return {
      m: "16px 0 0",
      p: 0,
      width: 12,
      height: 12,
      boxSizing: "border-box",
      bgcolor: hollow ? t.panel : color,
      border: `2px solid ${color}`,
      boxShadow: hollow ? "none" : `0 0 0 4px ${alpha(color, 0.16)}`,
      ...(next && {
        animation: `${pulse} 1.8s ease-out infinite`,
        "@media (prefers-reduced-motion: reduce)": { animation: "none" },
      }),
    };
  },

  // Solid line for what happened, dashed for what's still to come
  connector: (pending) => ({
    width: 0,
    bgcolor: "transparent",
    borderLeft: `2px ${pending ? "dashed" : "solid"} ${t.line}`,
  }),

  // ** Date column
  dateDay: { fontSize: { xs: 10, md: 12 }, fontWeight: 600, color: t.text, lineHeight: 1.3 },
  dateTime: { fontSize: { xs: 10, md: 11 }, color: t.muted, lineHeight: 1.3 },
  pendingBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 0.5,
    color: t.muted,
    fontSize: { xs: 10, md: 12 },
  },

  // ** Entry card
  card: ({ tone }) => ({
    mb: 2,
    p: { xs: 1.25, md: 1.75 },
    borderRadius: "10px",
    bgcolor: t.panel2,
    border: `1px solid ${t.line}`,
    borderLeft: `3px solid ${toneColor[tone]}`,
    opacity: tone === "pending" ? 0.8 : 1,
  }),

  statusText: ({ tone, next }) => ({
    fontSize: { xs: 14, md: 16 },
    fontWeight: 800,
    color: next ? t.violet : toneColor[tone] === t.muted ? t.text : toneColor[tone],
  }),

  historyDesc: { fontSize: { xs: 12, md: 14 }, color: t.muted, mt: 0.25 },

  transactedByBox: { flexDirection: "row", alignItems: "center", gap: 1, mt: 1.25 },

  avatar: {
    width: 22,
    height: 22,
    fontSize: 10,
    fontWeight: 700,
    color: t.text,
    bgcolor: alpha(t.violet, 0.35),
    border: `1px solid ${alpha(t.violet, 0.6)}`,
  },

  transactedBy: { fontSize: { xs: 12, md: 13 }, fontWeight: 600, color: t.text },

  // ** Reason callout
  reasonBox: ({ tone }) => ({
    mt: 1.5,
    p: 1.25,
    borderRadius: "8px",
    bgcolor: alpha(toneColor[tone] === t.muted ? t.violet : toneColor[tone], 0.08),
    border: `1px solid ${alpha(toneColor[tone] === t.muted ? t.violet : toneColor[tone], 0.3)}`,
  }),

  reasonLabel: { fontSize: { xs: 12, md: 13 }, fontWeight: 700, color: t.text, mb: 0.5 },

  reasonText: ({ tone }) => ({
    fontSize: { xs: 12, md: 13 },
    lineHeight: 1.5,
    color: tone === "error" ? t.error : t.muted,
    whiteSpace: "pre-wrap",
    overflowWrap: "anywhere", // long unbroken strings / pasted code won't overflow the card
  }),

  reasonClamp: {
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },

  reasonToggle: {
    mt: 0.5,
    p: 0,
    minWidth: 0,
    fontSize: 12,
    textTransform: "none",
    color: t.muted,
    "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
  },

  emptyText: { fontSize: 13, color: t.muted, textAlign: "center", py: 3 },

  // Table
  tableCellHeader: {
    background: t.tablebg,
    color: t.tableheader,
    fontWeight: 700,
    fontSize: "12px",
  },

  tableCellBody: {
    color: "#EDF2F7",
    fontSize: "12px",
    fontWeight: 500,
  },

  customTableCellBody: {
    color: "#EDF2F7",
    fontSize: "12px",
    fontWeight: 500,
    width: "400px",
    wordBreak: "break-word",
  },

  tableHeaderWithChechBox: {
    flexDirection: "row",
    gap: 0.5,
    alignItems: "center",
  },

  sortIcon: {
    color: t.tableheader,
    fontSize: "20px",
  },

  titleTableText: {
    color: "#EDF2F7",
    fontSize: "12px",
    fontWeight: 500,
    wordBreak: "break-word",
  },

  descTableText: {
    color: theme.palette.text.secondary,
    fontSize: "12px",
    fontWeight: 500,
    wordBreak: "break-word",
  },

  titleAccentTableText: {
    fontSize: "12px",
    fontWeight: 600,
    fontWeight: 600,
    color: "#22B4BF",
  },

  descAccentTableText: {
    fontSize: "12px",
    fontWeight: 600,
    fontWeight: 600,
  },
};
