import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { theme } from "../../../theme/theme";

export const BusinessErrorDialog = ({ errorData, open, onClose }) => {
  const onCloseAction = () => {
    onClose();
  };

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      sx={{ borderRadius: "none", paddingBottom: 0 }}
    >
      <DialogTitle sx={{ paddingTop: 0, paddingBottom: 0 }}>Error!</DialogTitle>
      <DialogContent>
        <Stack sx={{ padding: "5px" }}>
          <Typography
            sx={{
              color: theme.palette.text.secondary,
              fontSize: "13px",
            }}
          >
            <Chip
              variant="filled"
              sx={{
                color: "red",
              }}
              label={
                "Unsuccessful syncing of business unit due to the following error(s): "
              }
            />
          </Typography>
        </Stack>

        <Stack direction="column"></Stack>
      </DialogContent>

      <DialogActions>
        <Button variant="text" onClick={onCloseAction}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
