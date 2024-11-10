import { Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";

import * as yup from "yup";
import moment from "moment";
import Swal from "sweetalert2";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { theme } from "../../../theme/theme";
import { LoadingButton } from "@mui/lab";
import { Toaster, toast } from "sonner";

import { useDispatch } from "react-redux";
import { notificationApi } from "../../../features/api_notification/notificationApi";
import { notificationMessageApi } from "../../../features/api_notification_message/notificationMessageApi";

import useSignalRConnection from "../../../hooks/useSignalRConnection";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

import { useApproveTransferTicketMutation } from "../../../features/api_ticketing/issue_handler/concernIssueHandlerApi";

const schema = yup.object().shape({
  transferTicketId: yup.string().nullable(),
  targetDate: yup.date().required("Target date is required"),
});

const ApproveTransferTicket = ({ data, open, onClose }) => {
  console.log("Data: ", data);

  const [approveTransferTicket, { isLoading: approveTransferTicketIsLoading, isFetching: approveTransferTicketIsFetching }] = useApproveTransferTicketMutation();

  const dispatch = useDispatch();
  useSignalRConnection();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      transferTicketId: "",
      targetDate: null,
    },
  });

  const onSubmitAction = (formData) => {
    console.log("FormData: ", formData);

    const approvePayload = {
      transferTicketId: formData?.transferTicketId,
      target_Date: moment(formData?.targetDate).format("YYYY-MM-DD"),
    };

    Swal.fire({
      title: "Confirmation",
      text: "Approve this requested transfer ticket?",
      icon: "info",
      color: "white",
      showCancelButton: true,
      background: "#111927",
      confirmButtonColor: "#9e77ed",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      cancelButtonColor: "#1C2536",
      heightAuto: false,
      width: "30em",
      customClass: {
        container: "custom-container",
        title: "custom-title",
        htmlContainer: "custom-text",
        icon: "custom-icon",
        confirmButton: "custom-confirm-btn",
        cancelButton: "custom-cancel-btn",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        approveTransferTicket(approvePayload)
          .unwrap()
          .then(() => {
            toast.success("Success!", {
              description: "Transferred successfully!",
              duration: 1500,
            });

            dispatch(notificationApi.util.resetApiState());
            dispatch(notificationMessageApi.util.resetApiState());

            reset();
            onClose();
          })
          .catch((err) => {
            console.log("Error", err);
            toast.error("Error!", {
              description: err.data.error.message,
              duration: 1500,
            });
          });
      }
    });
  };

  const onCloseAction = () => {
    reset();
    onClose();
  };

  useEffect(() => {
    if (data) {
      setValue("transferTicketId", data?.transferApprovalTickets?.[0]?.transferTicketConcernId);
    }
  }, [data]);

  return (
    <>
      <Toaster richColors position="top-right" closeButton />
      <Dialog fullWidth maxWidth="xs" open={open}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "left",
            paddingTop: 0,
            paddingBottom: 0,
            marginBlockEnd: "5.28px",
            fontSize: "18px",
            fontWeight: 600,
            color: theme.palette.success.main,
          }}
        >
          {`Tranfer Ticket Number: ${data?.ticketConcernId}`}
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmitAction)}>
          <DialogContent>
            <Stack sx={{ width: "100%", gap: 1 }}>
              <Stack gap={0.5}>
                <Typography
                  sx={{
                    fontSize: "14px",
                  }}
                >
                  Target Date:
                </Typography>

                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <Controller
                    control={control}
                    name="targetDate"
                    render={({ field }) => (
                      <DatePicker
                        value={field.value ? moment(field.value) : null}
                        onChange={(newValue) => {
                          const formattedValue = newValue ? moment(newValue).format("YYYY-MM-DD") : null;
                          field.onChange(formattedValue);
                        }}
                        slotProps={{
                          textField: {
                            variant: "outlined",
                            sx: {
                              "& .MuiInputBase-input": {
                                padding: "10.5px 14px",
                              },
                              "& .MuiOutlinedInput-root": {
                                fontSize: "15px",
                              },
                            },
                          },
                        }}
                        minDate={new moment()}
                        error={!!errors.targetDate}
                        helperText={errors.targetDate ? errors.targetDate.message : null}
                      />
                    )}
                  />
                  {errors.targetDate && <Typography>{errors.targetDate.message}</Typography>}
                </LocalizationProvider>
              </Stack>
            </Stack>
          </DialogContent>

          <DialogActions>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={approveTransferTicketIsLoading || approveTransferTicketIsFetching}
              disabled={!watch("targetDate")}
              sx={{
                ":disabled": {
                  backgroundColor: theme.palette.secondary.main,
                  color: "black",
                },
              }}
            >
              Approve
            </LoadingButton>
            <LoadingButton variant="outlined" onClick={onCloseAction}>
              Close
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default ApproveTransferTicket;
