import { theme } from "../../../theme/theme";

export const tokens = {
  bg: "#080D16",
  panel: "#0E1521",
  line: "#252D3B",

  text: "#e8edf8",
  muted: "#A0AEC0",

  violet: "#7c5cff",
  pink: "#ff4fa3",
  ok: "#34d399",
  warn: "#fbbf24",
  error: "#EF5350",
};

const fonts = {
  md: "15px",
  sm: "13px",
  xs: "12px",
};

const weights = {
  regular: 400,
  medium: 500,
  semibold: 600,
};

const t = tokens;
const f = fonts;
const w = weights;

export const approverStyles = {
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 2,
    background: t.panel,
    border: `1px solid ${t.line}`,
    borderRadius: "15px",
  },

  avatarIcon: { width: 46, height: 46, borderRadius: "50%", background: `linear-gradient(135deg, ${t.violet}, ${t.pink})`, display: "grid", placeItems: "center", fontWeight: 700, fontSize: 16 },

  secondaryText: {
    color: t.muted,
    fontWeight: w.medium,
    fontSize: { xs: f.xs, md: f.sm },
  },

  requestorText: {
    fontSize: { xs: f.sm, md: f.md },
    color: t.text,
    fontWeight: w.semibold,
  },

  channelText: {
    fontSize: { xs: f.xs, md: f.sm },
    color: t.muted,
    fontWeight: w.medium,
  },

  sectionHeader: {
    fontSize: { xs: f.sm, md: f.md },
    fontWeight: w.semibold,
    color: t.violet,
  },

  label: {
    fontSize: { xs: f.sm, md: f.md },
    fontWeight: w.regular,
    color: t.muted,
  },

  description: {
    fontSize: { xs: f.sm, md: f.md },
    fontWeight: w.medium,
    color: t.text,
    wordBreak: "break-word",
  },

  detailBox: {
    background: t.panel,
    width: "100%",
    height: "auto",
    border: `1px solid ${t.line}`,
    borderRadius: "10px",
    mt: 1,
    padding: 1,
  },

  formBox: {
    background: t.panel,
    width: "100%",
    height: "auto",
    border: `1px solid ${t.line}`,
    borderRadius: "10px",
    mt: 1,
    padding: 2,
    gap: 2,
  },

  divider: {
    background: t.line,
    marginTop: 1,
    marginBottom: 1,
  },

  rowContent: {
    flexDirection: { xs: "column", md: "row" },
    ml: 2,
  },

  titleDetailBox: {
    width: "20%",
  },

  spacer: {
    width: "8%",
  },

  descDetailBox: {
    width: "72%",
    flexDirection: "column",
  },

  //   View Detail Dialog
  avatarIcon: {
    width: 46,
    height: 46,
    borderRadius: "50%",
    background: `linear-gradient(135deg, ${t.violet}, ${t.pink})`,
    display: "grid",
    placeItems: "center",
    fontWeight: 700,
    fontSize: 14,
  },

  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 2,
  },

  avatarAndTitleBox: {
    flexDirection: "row",
    gap: 1,
    alignItems: "center",
  },

  section: {
    marginTop: 2,
    justifyContent: "space-between",
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

  fontSize: {
    fontSize: { xs: "12px", md: "13px" },
  },

  titleSubIcon: {
    color: theme.palette.text.secondary,
    fontSize: { xs: "16px", md: "18px" },
  },

  titleSubText: {
    color: theme.palette.text.secondary,
    fontSize: { xs: "12px", md: "14px" },
  },

  attachmentCards: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 1,
    border: `1px solid ${t.line}`,
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

  closeButton: {
    backgroundColor: "#1C2536",
    "&:hover": { backgroundColor: "#2f3c55" },
  },
};
