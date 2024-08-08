import { Dialog, DialogContent, Divider, IconButton, Stack, Typography } from "@mui/material";
import React from "react";

import { theme } from "../../../theme/theme";
import { AccountCircleRounded, Close } from "@mui/icons-material";

const ViewTransferRemarksDialog = ({ data, open, onClose }) => {
  const onCloseAction = () => {
    onClose();
  };

  console.log("Data: ", data);

  return (
    <>
      <Dialog fullWidth maxWidth="sm" open={open}>
        <DialogContent>
          {/* REQUESTOR */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" gap={1} alignItems="center">
              <AccountCircleRounded sx={{ fontSize: "50px" }} />
              <Stack>
                <Typography sx={{ fontSize: "11px", color: theme.palette.primary.main, fontStyle: "italic", letterSpacing: 1, fontWeight: 400 }}>Transferred by: </Typography>
                <Typography sx={{ fontSize: "13px", color: "#6dc993", fontWeight: 700 }}> {data?.ticketRequestConcerns?.[0]?.transfer_By}</Typography>
                <Typography sx={{ fontSize: "12px", color: theme.palette.text.secondary }}>{data?.department_Name}</Typography>
                <Typography sx={{ fontSize: "12px", color: theme.palette.text.secondary }}>{data?.channel_Name}</Typography>
              </Stack>
            </Stack>

            <Stack direction="row" gap={0.5} alignItems="center">
              <IconButton onClick={onCloseAction}>
                <Close />
              </IconButton>
            </Stack>
          </Stack>

          <Divider variant="fullWidth" sx={{ background: "#2D3748", marginTop: 1 }} />

          <Stack sx={{ padding: "5px", gap: 0.5, marginTop: 5 }}>
            <Typography
              sx={{
                fontSize: "14px",
                color: theme.palette.text.secondary,
              }}
            >
              Remarks:
            </Typography>

            <Typography
              sx={{
                fontSize: "14px",
                fontStyle: "italic",
                color: theme.palette.warning.main,
              }}
              dangerouslySetInnerHTML={{
                __html: data?.ticketRequestConcerns?.[0]?.remarks.replace(/\r\n/g, "<br />"),
              }}
            />
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ViewTransferRemarksDialog;
