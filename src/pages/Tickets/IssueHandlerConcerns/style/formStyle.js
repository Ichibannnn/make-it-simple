import { theme } from "../../../../theme/theme";

const colorTokens = {
  bg: "#0b1018",
  panel: "#0c1421",
  line: "#243047",

  text: "#ffffff",
  accent: "#a47ef0",
  muted: "#8d97b0",
  ok: "#4cd39a",
  warning: "#ffb340",
  error: "#ef5350",

  violet: "#7c5cff",
  pink: "#ff4fa3",
};

const fonts = {
  lg: "16px",
  md: "14px",
  sm: "12px",
  xs: "10px",
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

export const formStyle = {
  titleText: { fontSize: f.lg, fontWeight: 700, color: t.ok },
  captionText: { fontSize: f.md, fontWeight: 700, color: t.muted },
  fieldText: { fontSize: f.md, fontWeight: 600, color: t.text },
  detailTitleText: { fontSize: f.md, fontWeight: 500, color: t.muted },
  detailDescText: { fontSize: f.md, fontWeight: 600, color: t.text },
  requiredDot: { color: t.error, fontSize: "10px" },

  select: {
    width: "100%",
    fontSize: "13px",
  },

  menuItem: {
    fontSize: "13px",
  },

  autoComplete: {
    "& .MuiInputBase-input": {
      fontSize: "13px",
    },
  },
  automCompleteProp: {
    popper: {
      sx: {
        "& .MuiAutocomplete-listbox": {
          fontSize: "13px",
        },
      },
    },
  },

  textField: { "& .MuiInputBase-input": { fontSize: "14px" } },

  datePickerSlotProp: {
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

  textFieldInputProps: {
    style: {
      fontSize: "13px",
    },
  },

  textFieldLabelProps: {
    style: {
      fontSize: "13px",
    },
  },

  textErrors: { fontSize: "12px", color: t.error },
  textArea: {},

  addConcernButton: {
    backgroundColor: "#1C2536",
    "&:hover": { backgroundColor: "#2f3c55" },
  },

  cancelButton: {
    backgroundColor: "#1C2536",
    "&:hover": { backgroundColor: "#2f3c55" },
  },

  closeIconButton: { fontSize: 16 },

  divider: {
    background: t.line,
    marginTop: 1.2,
    marginBottom: 1.2,
  },

  titleDetailBox: {
    width: "20%",
  },

  spacer: {
    width: "8%",
  },

  descDetailBox: {
    width: "72%",
  },

  dialogTitle: {},

  detailBox: {
    background: t.panel,
    width: "100%",
    height: "auto",
    border: `1px solid ${t.line}`,
    borderRadius: "10px",
    mt: 1,
    padding: 2,
  },

  closeDetailContent: {
    flexDirection: { xs: "column", md: "row" },
    ml: 2,
  },

  fieldSection: {
    marginTop: 1,
    gap: 2,
    padding: 1,
  },

  fieldSectionTickets: {
    gap: 1,
  },

  categoryBox: {
    flexDirection: { xs: "column", md: "row" },
    gap: 1,
  },

  twoColsBox: {
    flexDirection: { xs: "column", md: "row" },
    gap: 1,
  },

  fieldOneColStack: {
    gap: 0.5,
    width: "100%",
  },

  fieldTwoColsStack: {
    gap: 0.5,
    width: { xs: "100%", md: "50%" },
  },

  fieldTitleWithIconBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 0.5,
  },

  fieldTitle: {},

  // Attachments Dashed
  attachmentDashedBorder: {
    width: "100%",
    display: "flex",
    border: "2px dashed #2D3748",
    justifyContent: "left",
    padding: 1,
    gap: 1.5,
  },

  attachmentFileBox: {
    display: "flex",
    flexDirection: "row",
    gap: 1,
    alignItems: "center",
  },

  chooseFileText: { fontSize: "12px" },
  fileExtText: {
    color: t.muted,
    fontSize: "11px",
  },

  // Img Files
  imgAttachmentSection: { display: "flex", flexWrap: "wrap", gap: 1.5 },
  imgAttachmentBox: {
    position: "relative",
    width: 120,
    height: 116,
    borderRadius: "10px",
    overflow: "hidden",
    backgroundColor: t.panel,
    border: `1px solid ${t.line}`,
    cursor: "pointer",
  },

  imgContainer: {
    position: "relative",
    width: "100%",
    height: 80,
    backgroundColor: "rgba(255,255,255,0.04)",
  },

  imgIconButton: {
    position: "absolute",
    top: 4,
    right: 4,
    zIndex: 2,
    padding: "2px",
    backgroundColor: "rgba(0,0,0,0.55)",
    "&:hover": { backgroundColor: "rgba(0,0,0,0.75)" },
  },

  imgFileName: {
    fontSize: "11px",
    fontWeight: 500,
    color: t.text,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "block",
  },

  imgFileSize: {
    fontSize: "10px",
    color: t.muted,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "block",
  },

  previewUrlBox: {
    width: "100%",
    height: 80,
    objectFit: "cover",
    display: "block",
    transition: "opacity 0.15s ease",
  },

  showSpinnerBox: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  circularProgress: { color: theme.palette.text.secondary },

  // Non Img Files
  fileAttachmentSection: { width: "100%", gap: 1 },
  fileAttachmentBox: {
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    padding: "8px 10px",
    borderRadius: "8px",
    backgroundColor: t.panel,
    border: `1px solid ${t.line}`,
  },

  iconFile: { display: "flex", alignItems: "center", justifyContent: "center" },
  fileNameBox: { flex: 1, minWidth: 0 },
  fileNameText: { fontSize: f.sm, fontWeight: 500 },
  fileSizeText: { fontSize: f.sm, color: t.muted },
  fileDescWithIconBox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 0.5,
  },

  inProgressBox: {
    flexDirection: "row",
    alignItems: "center",
    spacing: 1,
    mt: 0.5,
  },
  linearProgress: { flex: 1, height: 4, borderRadius: 2 },
  uploadProgressText: { fontSize: f.xs, color: t.muted },

  // Manage Ticket
  manageTicketBox: {
    flexDirection: "row",
    gap: 0.5,
    alignItem: "center",
  },

  approvedText: {
    fontSize: "14px",
    fontWeight: 700,
    fontStyle: "italic",
    color: "#22B4BF",
  },

  attachmentTextBox: {
    flexDirection: "row",
    gap: 0.5,
    alignItems: "center",
  },

  titleHeaderMutedIcon: {
    fontSize: { xs: "16px", md: "18px" },
    color: t.muted,
  },

  addAttachmentBtn: { padding: "2px", borderRadius: "2px" },
  noAttachmentSection: {
    flex: 1,
    minHeight: "120px",
    justifyContent: "center",
    alignItems: "center",
  },
  noAttachmentContent: {
    flexDirection: "row",
    gap: 0.5,
    justifyContent: "center",
  },
  noAttachmentIcon: { color: t.muted },
  noAttachmentText: { color: t.muted },

  attachmentAndMenuBox: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 0.5,
  },

  // Section Header
  sectionHeader: {
    fontSize: { xs: f.sm, md: f.md },
    fontWeight: w.semibold,
    color: t.accent,
  },

  // Concern Details
  concern: {
    gap: 0.5,
    width: "100%",
    mt: 1,
  },

  notes: {
    gap: 0.5,
    width: "100%",
    mt: 1,
  },
};
