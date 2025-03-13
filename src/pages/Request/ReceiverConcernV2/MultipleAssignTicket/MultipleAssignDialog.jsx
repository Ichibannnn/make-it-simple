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
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

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
      <Dialog fullWidth maxWidth="xl" open={open}>
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
          {/* <Stack sx={{ width: "100%", gap: 1, mt: 4 }}> */}

          <Swiper
            // install Swiper modules
            pagination={true}
            modules={[Pagination]}
            className="mySwiper"
          >
            {selectedTickets?.map((item) => (
              <SwiperSlide key={item.requestConcernId}>
                <Stack sx={{ width: "100%", height: "auto", background: theme.palette.bgForm.black2, borderRadius: "20px", padding: 2 }}>
                  <Stack direction="row" gap={0.5} sx={{ alignItems: "center" }}>
                    <DiscountOutlined sx={{ fontSize: isScreenSmall ? "16px" : "18px" }} />
                    <Typography sx={{ fontSize: isScreenSmall ? "14px" : "16px" }}>{`Concern No. ${item.requestConcernId}`}</Typography>
                  </Stack>
                  <Typography mt={2}>{item.fullName}</Typography>
                </Stack>
              </SwiperSlide>
            ))}
          </Swiper>
          {/* </Stack> */}
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
