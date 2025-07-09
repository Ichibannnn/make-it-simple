import { Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import React from "react";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import { theme } from "../../../../theme/theme";
import { LoadingButton } from "@mui/lab";
import { toast } from "sonner";

import { useDisapproveTargetMutation } from "../../../../features/api_ticketing/approver/ticketApprovalApi";
import { useDispatch } from "react-redux";
import { notificationApi } from "../../../../features/api_notification/notificationApi";
import { notificationMessageApi } from "../../../../features/api_notification_message/notificationMessageApi";

const schema = yup.object().shape({
  reject_Remarks: yup.string().required("Remarks is required."),
});

// Multiple
const DisapprovedSelectedTargetDialog = ({ open, onClose, selectedTickets, setSelectedTickets }) => {
  const [disapproveTarget, { isLoading, isFetching }] = useDisapproveTargetMutation();

  const dispatch = useDispatch();

  const {
    handleSubmit,
    register,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      reject_Remarks: "",
    },
  });

  const onSubmitAction = (formData) => {
    const disapprovePayload = {
      rejectDateRequests: selectedTickets.map((item) => ({
        approverDateId: item,
      })),

      reject_Remarks: formData?.reject_Remarks,
    };

    console.log("Disapprove: ", disapprovePayload);

    Swal.fire({
      title: "Confirmation",
      text: `Disapprove this selected request(s)?`,
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
        disapproveTarget(disapprovePayload)
          .unwrap()
          .then(() => {
            toast.success("Success!", {
              description: "Disapproved request successfully! ",
              duration: 1500,
            });
            dispatch(notificationApi.util.resetApiState());
            dispatch(notificationMessageApi.util.resetApiState());
            setSelectedTickets([]);
            reset();
            onClose();
          })
          .catch((error) => {
            toast.error("Error!", {
              description: error.data.error.message,
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

  return (
    <>
      <Dialog fullWidth maxWidth="sm" open={open}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "center",
            paddingTop: 0,
            paddingBottom: 0,
            marginBlockEnd: "5.28px",
            fontSize: "18px",
            fontWeight: 700,
            color: "#48BB78",
          }}
        >
          Remarks Form
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmitAction)}>
          <DialogContent>
            <Stack sx={{ padding: "5px", gap: 0.5 }}>
              <Typography
                sx={{
                  fontSize: "16px",
                }}
              >
                Remarks:
              </Typography>

              <TextField
                {...register("reject_Remarks")}
                variant="outlined"
                // label="Enters Re"
                placeholder="Enter Remarks"
                helperText={errors?.reject_Remarks?.message}
                error={!!errors?.reject_Remarks?.message}
                sx={{ borderColor: "primary" }}
                rows={6}
                multiline
                fullWidth
                autoComplete="off"
              />
            </Stack>
          </DialogContent>

          <DialogActions>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isLoading || isFetching}
              disabled={!watch("reject_Remarks")}
              sx={{
                ":disabled": {
                  backgroundColor: theme.palette.secondary.main,
                  color: "black",
                },
              }}
            >
              Submit
            </LoadingButton>
            <LoadingButton variant="outlined" loading={isLoading || isFetching} onClick={onCloseAction}>
              Close
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default DisapprovedSelectedTargetDialog;

// One at a timee
export const DisapproveTargetDialog = ({ data, open, onClose, approvalOnClose, setSelectedTickets }) => {
  const [disapproveTarget, { isLoading, isFetching }] = useDisapproveTargetMutation();
  const dispatch = useDispatch();

  const {
    handleSubmit,
    register,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      reject_Remarks: "",
    },
  });

  const onSubmitAction = (formData) => {
    const disapprovePayload = {
      rejectDateRequests: [
        {
          approverDateId: data?.approverDatesId,
        },
      ],
      reject_Remarks: formData?.reject_Remarks,
    };

    console.log("Disapprove: ", disapprovePayload);

    Swal.fire({
      title: "Confirmation",
      text: `Disapprove request?`,
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
        disapproveTarget(disapprovePayload)
          .unwrap()
          .then(() => {
            toast.success("Success!", {
              description: "Disapproved request successfully! ",
              duration: 1500,
            });
            dispatch(notificationApi.util.resetApiState());
            dispatch(notificationMessageApi.util.resetApiState());
            setSelectedTickets([]);
            reset();
            onClose();
            approvalOnClose();
          })
          .catch((error) => {
            toast.error("Error!", {
              description: error.data.error.message,
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

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={(event, reason) => {
          if (reason === "backdropClick") {
            event.stopPropagation();
            return;
          }
          onCloseAction();
        }}
        disableEscapeKeyDown={false}
        sx={{ borderRadius: "none", padding: 0, backdropFilter: "blur(5px)" }}
        PaperProps={{ style: { overflow: "auto" } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "center",
            paddingTop: 0,
            paddingBottom: 0,
            marginBlockEnd: "5.28px",
            fontSize: "18px",
            fontWeight: 700,
            color: "#48BB78",
          }}
        >
          Remarks Form
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmitAction)}>
          <DialogContent>
            <Stack sx={{ padding: "5px", gap: 0.5 }}>
              <Typography
                sx={{
                  fontSize: "16px",
                }}
              >
                Remarks:
              </Typography>

              <TextField
                {...register("reject_Remarks")}
                variant="outlined"
                // label="Enters Re"
                placeholder="Enter Remarks"
                helperText={errors?.reject_Remarks?.message}
                error={!!errors?.reject_Remarks?.message}
                sx={{ borderColor: "primary" }}
                rows={6}
                multiline
                fullWidth
                autoComplete="off"
              />
            </Stack>
          </DialogContent>

          <DialogActions>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isLoading || isFetching}
              disabled={!watch("reject_Remarks")}
              sx={{
                ":disabled": {
                  backgroundColor: theme.palette.secondary.main,
                  color: "black",
                },
              }}
            >
              Submit
            </LoadingButton>
            <LoadingButton variant="outlined" loading={isLoading || isFetching} onClick={onCloseAction}>
              Close
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
