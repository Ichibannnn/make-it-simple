const colorTokens = {
  bg: "#0b1018",
  text: "#ffffff",
  accent: "#a47ef0",
  muted: "#8d97b0",
  line: "#243047",
  ok: "#4cd39a",
  warning: "#ffb340",
};

const fonts = {
  lg: "22px",
  md: "14px",
  sm: "12px",
  xs: "10px",
};

const t = colorTokens;
const f = fonts;

export const formStyle = {
  titleText: {
    fontSize: f.lg,
    fontWeight: 700,
    color: t.text,
  },

  subTitleText: {
    fontSize: f.md,
    fontWeight: 600,
    color: t.text,
  },

  detailTitleText: {
    fontSize: f.md,
    fontWeight: 400,
    color: t.muted,
  },

  detailDescText: {
    fontSize: f.md,
    fontWeight: 600,
    color: t.text,
  },
};
