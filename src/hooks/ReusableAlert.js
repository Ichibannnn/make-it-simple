import React from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { Snackbar } from "@mui/material";

const ReusableAlert = ({
  severity,
  title,
  description,
  autoHideDuration = 3000,
  onClose,
}) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={true}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
    >
      <Alert variant="filled" severity={severity} onClose={onClose}>
        <AlertTitle sx={{ textAlign: "left" }}>{title}</AlertTitle>
        {description}
      </Alert>
    </Snackbar>
  );
};

export default ReusableAlert;
