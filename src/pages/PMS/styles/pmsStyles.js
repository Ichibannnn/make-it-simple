import { theme } from "../../../theme/theme";

export const pmsStyles = {
  // Upload Schedule
  dialog: {
    borderRadius: "none",
    padding: 0,
    backdropFilter: "blur(5px)",
  },
  dialogContent: {
    padding: 0,
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
};
