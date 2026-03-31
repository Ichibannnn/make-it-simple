import { Close } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, IconButton, Stack, Typography } from "@mui/material";
import React from "react";
import { theme } from "../../../theme/theme";

const PmsUploadSchedule = ({ openUploadSchedule, onCloseUploadSchedule }) => {
  return (
    <>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={openUploadSchedule}
        onClose={(event, reason) => {
          if (reason === "backdropClick") {
            event.stopPropagation();
            return;
          }
          onCloseUploadSchedule();
        }}
        disableEscapeKeyDown={false}
        sx={{ borderRadius: "none", padding: 0, backdropFilter: "blur(5px)" }}
        PaperProps={{ style: { overflow: "auto", border: "2px solid #4b586f" } }}
      >
        <DialogContent sx={{ padding: 0 }}>
          <Stack sx={{ borderBottom: "2px solid #4b586f" }}>
            <Stack p={2} direction="row" justifyContent="space-between" alignItems="center">
              <Stack>
                <Typography sx={{ fontWeight: 600 }}>Reschedule Store Visit</Typography>
              </Stack>

              <Stack direction="row" gap={0.5} alignItems="center">
                <IconButton onClick={onCloseUploadSchedule}>
                  <Close />
                </IconButton>
              </Stack>
            </Stack>
          </Stack>

          <Stack pr={4} pl={4} pt={4}>
            <Stack
              p={2}
              sx={{
                height: "200px",
                overflow: "auto",
                border: "1px solid #4b586f",
                borderRadius: "7px",
                borderStyle: "dashed",
                borderWidth: "2px",
                backgroundColor: theme.palette.bgForm.black2,
              }}
              justifyContent="center"
              alignItems="center"
            ></Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Stack sx={{ width: "100%", padding: 2 }} direction="row" gap={1}>
            <Button variant="outlined" onClick={onCloseUploadSchedule} fullWidth>
              Cancel
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PmsUploadSchedule;
