import { theme } from "../../../../theme/theme";

const colorTokens = {
  bg: "#080D16",
  panel: "#0E1521",
  line: "#252D3B",

  text: "#F5F7FC",
  accent: "#A855F7",
  muted: "#A0AEC0",

  ok: "#4CD39A",
  warning: "#FFB340",
  error: "#EF5350",

  violet: "#7c5cff",
  pink: "#ff4fa3",
};

const fonts = {
  lg: "16px",
  md: "15px",
  sm: "14px",
  xs: "13px",
};

const weights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

const t = colorTokens;
const f = fonts;
const w = weights;

export const receiverStyle = {
  header: {
    fontSize: { xs: f.md, md: f.lg },
    fontWeight: w.semibold,
    color: t.text,
  },

  subHeader: {
    fontSize: { xs: f.xs, md: f.sm },
    fontWeight: w.semibold,
    color: t.muted,
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

  container: {
    backgroundColor: t.panel,
    border: `1px solid ${t.line}`,
    borderRadius: "14px",
  },

  row: {
    borderBottom: `1px solid ${t.line}`,
    padding: "9px 0",
  },
  status: {
    success: {
      color: t.ok,
      fontWeight: w.semibold,
    },
    warning: {
      color: t.warning,
      fontWeight: w.semibold,
    },
    error: {
      color: t.error,
      fontWeight: w.semibold,
    },
  },

  chip: {
    fontSize: f.sm,
    fontWeight: w.medium,
    color: t.text,
    backgroundColor: t.panel,
    border: `1px solid ${t.line}`,
    borderRadius: "20px",
    padding: "3px 10px",
  },

  closeButton: {
    backgroundColor: "#1C2536",
    "&:hover": { backgroundColor: "#2f3c55" },
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
};
