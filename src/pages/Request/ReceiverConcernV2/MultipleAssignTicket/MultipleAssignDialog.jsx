import React, { useRef } from "react";
import { LoadingButton } from "@mui/lab";
import { Accordion, AccordionDetails, AccordionSummary, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography, useMediaQuery } from "@mui/material";
import { DiscountOutlined, ExpandMore } from "@mui/icons-material";

import * as yup from "yup";
import moment from "moment";
import { theme } from "../../../../theme/theme";
import { useDispatch } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import useSignalRConnection from "../../../../hooks/useSignalRConnection";

const MultipleAssignDialog = ({ selectedTickets, open, onClose }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef();
  const today = moment();
  useSignalRConnection();

  console.log("ArrayData: ", selectedTickets);

  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));

  const onCloseAction = () => {
    onClose();
  };

  return (
    <>
      <Dialog fullWidth maxWidth="md" open={open}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "center",
            paddingTop: 0,
            paddingBottom: 0,
            marginBlockEnd: "5.28px",
            fontSize: "18px",
            fontWeight: 700,
            color: "#fff",
          }}
        >
          Assign Ticket
        </DialogTitle>

        <DialogContent>
          <Stack sx={{ width: "100%", gap: 1, mt: 4 }}>
            {selectedTickets?.map((item) => (
              <Accordion sx={{ background: theme.palette.bgForm.black2, padding: 1 }}>
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1-content" id="panel1-header">
                  <Stack direction="row" gap={0.5} sx={{ width: "100%", alignItems: "center" }}>
                    <DiscountOutlined sx={{ fontSize: isScreenSmall ? "16px " : "18px" }} />
                    <Typography sx={{ fontSize: isScreenSmall ? "14px " : "16px" }}>{`Concern No. ${item.requestConcernId}`}</Typography>
                  </Stack>
                </AccordionSummary>

                <AccordionDetails>
                  <Stack sx={{ width: "100%", height: "auto", background: theme.palette.bgForm.black2, borderRadius: "20px" }}>{item.fullName}</Stack>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </DialogContent>

        <DialogActions>
          <LoadingButton
            type="submit"
            variant="contained"
            sx={{
              ":disabled": {
                backgroundColor: theme.palette.secondary.main,
                color: "black",
              },
            }}
          >
            Assign
          </LoadingButton>
          <LoadingButton variant="outlined" onClick={onCloseAction}>
            Close
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MultipleAssignDialog;
