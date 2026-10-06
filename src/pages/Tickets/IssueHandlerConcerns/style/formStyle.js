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
};

const fonts = {
  lg: "16px",
  md: "14px",
  sm: "12px",
  xs: "10px",
};

const t = colorTokens;
const f = fonts;

export const formStyle = {
  titleText: { fontSize: f.lg, fontWeight: 700, color: t.text },
  fieldText: { fontSize: f.md, fontWeight: 500, color: t.text },
  detailTitleText: { fontSize: f.md, fontWeight: 400, color: t.muted },
  detailDescText: { fontSize: f.md, fontWeight: 500, color: t.text },
  requiredDot: { color: t.error, fontSize: "10px" },

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

  textField: {},
  textArea: {},

  cancelButton: {
    backgroundColor: "#1C2536",
    "&:hover": { backgroundColor: "#2f3c55" },
  },

  divider: {
    background: t.line,
    marginTop: 0.5,
    marginBottom: 0.5,
  },

  titleDetailBox: {
    width: "20%",
  },

  spacer: {
    width: "5%",
  },

  descDetailBox: {
    width: "75%",
  },

  // Closing Dialog
  dialogTitle: {},

  closeDetailBox: {
    background: t.panel,
    width: "100%",
    height: "auto",
    border: `1px solid ${t.line}`,
    borderRadius: "10px",
    mt: 1,
    padding: 1,
  },

  closeDetailContent: {
    flexDirection: { xs: "column", md: "row" },
    ml: 2,
  },

  fieldSection: {
    marginTop: 2,
    gap: 1,
    padding: 1,
  },

  categoryBox: {
    flexDirection: { xs: "column", md: "row" },
    gap: 1,
  },

  categoryWithField: {
    gap: 0.5,
    width: { xs: "100%", md: "50%" },
  },

  fieldTitleWithIconBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 0.5,
  },

  fieldTitle: {},
};
