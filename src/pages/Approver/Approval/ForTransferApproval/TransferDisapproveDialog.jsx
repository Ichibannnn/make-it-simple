import { Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material";

import * as yup from "yup";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { LoadingButton } from "@mui/lab";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { theme } from "../../../../theme/theme";
import { yupResolver } from "@hookform/resolvers/yup";
import { formStyle as sx } from "../../../Tickets/IssueHandlerConcerns/style/formStyle";

import { useRejectTransferMutation } from "../../../../features/api_ticketing/approver/ticketApprovalApi";
import { notificationApi } from "../../../../features/api_notification/notificationApi";
import { notificationMessageApi } from "../../../../features/api_notification_message/notificationMessageApi";

const schema = yup.object().shape({
  reject_Remarks: yup.string().required("Remarks is required."),
});

const TransferDisapproveDialog = ({ data, open, onClose, approvalOnClose }) => {
  const [disapproveTransfer, { isLoading, isFetching }] = useRejectTransferMutation();

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
      rejectTransferTicketRequests: [
        {
          transferTicketId: data?.transferTicketId,
        },
      ],
      reject_Remarks: formData?.reject_Remarks,
    };

    Swal.fire({
      title: "Confirmation",
      text: `Disapproved this request transfer ticket number ${data?.ticketNumber}?`,
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
        disapproveTransfer(disapprovePayload)
          .unwrap()
          .then(() => {
            toast.success("Success!", {
              description: "Disapproved request successfully! ",
              duration: 1500,
            });
            dispatch(notificationApi.util.resetApiState());
            dispatch(notificationMessageApi.util.resetApiState());
            reset();
            onClose();
            approvalOnClose();
          })
          .catch((error) => {
            console.log("error: ", error);
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
          Disapprove Remarks
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
            <LoadingButton variant="contained" loading={isLoading || isFetching} onClick={onCloseAction} sx={sx.cancelButton}>
              Cancel
            </LoadingButton>
            <LoadingButton type="submit" variant="contained" loading={isLoading || isFetching} disabled={!watch("reject_Remarks")}>
              Submit
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default TransferDisapproveDialog;

export const DisapproveSelectedDialog = ({ open, onClose, selectedTickets, setSelectedTickets }) => {
  const [disapproveTransfer, { isLoading, isFetching }] = useRejectTransferMutation();

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
      rejectTransferTicketRequests: selectedTickets.map((item) => ({
        transferTicketId: item,
      })),
      reject_Remarks: formData?.reject_Remarks,
    };

    Swal.fire({
      title: "Confirmation",
      text: `Disapproved selected ticket number(s)?`,
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
        disapproveTransfer(disapprovePayload)
          .unwrap()
          .then(() => {
            toast.success("Success!", {
              description: "Disapproved request successfully! ",
              duration: 1500,
            });
            dispatch(notificationApi.util.resetApiState());
            dispatch(notificationMessageApi.util.resetApiState());
            reset();
            setSelectedTickets([]);
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
            <LoadingButton variant="contained" loading={isLoading || isFetching} onClick={onCloseAction} sx={sx.cancelButton}>
              Cancel
            </LoadingButton>
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
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
