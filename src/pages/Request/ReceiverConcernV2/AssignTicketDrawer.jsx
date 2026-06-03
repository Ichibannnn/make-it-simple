import {
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FiberManualRecord, Warning } from "@mui/icons-material";

import * as yup from "yup";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import moment from "moment";
import { theme } from "../../../theme/theme";
import { LoadingButton } from "@mui/lab";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

import { useDispatch } from "react-redux";
import { useLazyGetChannelsQuery } from "../../../features/api_channel_setup/channel/channelApi";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { useSelector } from "react-redux";
import { useTakeCherryPickTicketMutation } from "../../../features/api_request/concerns/concernApi";
import Swal from "sweetalert2";
import { notificationApi } from "../../../features/api_notification/notificationApi";
import { notificationMessageApi } from "../../../features/api_notification_message/notificationMessageApi";
import { toast } from "sonner";

const schema = yup.object().shape({
  ChannelId: yup.object().notRequired(),
  TargetDate: yup.date().notRequired(),
  IssueHandler: yup.object().nullable(),
  Reason: yup.string().notRequired(),
});

const AssignTicketDrawer = ({ open, onClose, selectedIds, setSelectedIds }) => {
  const [showReason, setShowReason] = useState(false);

  const userId = useSelector((state) => state?.user?.id);
  const userDetails = useSelector((state) => state?.user);
  const channelNameValidation = useSelector((state) => state?.user?.channels?.[0]?.channelName);

  const dispatch = useDispatch();

  // useSignalRConnection();
  // const [smsNotification] = useSendSmsNotificationMutation();
  // const attachments = useSelector((state) => state.attachment.attachments);

  const [getChannel, { data: channelData, isLoading: channelIsLoading }] = useLazyGetChannelsQuery();
  const [takeTicket, { isLoading: takeTicketIsLoading, isFetching: takeTicketIsFetching }] =
    useTakeCherryPickTicketMutation();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      ChannelId: null,
      TargetDate: null,
      IssueHandler: null,
      Reason: "",
    },
  });

  const onCloseAction = () => {
    reset();
    onClose();
  };

  const onSubmitAction = (formData) => {
    const payload = {
      ticketConcernIdCherryLists: selectedIds?.map((item) => item),
      targetDate: moment(formData?.TargetDate).format("YYYY-MM-DD"),
      assignTo: userDetails?.userRoleName?.includes("Approver") ? formData?.IssueHandler?.userId : userId,
      reason: formData?.Reason,
    };

    // const smsPayload = {
    //   system_name: "Make It Simple",
    //   message: `Fresh Morning! Concern #${data?.requestConcernId} has been assigned to your account. Kindly check your ticket list.`,
    //   mobile_number: data?.contact_Number,
    // };

    Swal.fire({
      title: "Confirmation",
      text: "Approve this concern?",
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
        takeTicket(payload)
          .unwrap()
          .then(() => {
            toast.success("Success!", {
              description: "Ticket created successfully!",
              duration: 1500,
            });

            dispatch(notificationApi.util.resetApiState());
            dispatch(notificationMessageApi.util.resetApiState());
            setShowReason(false);
            setSelectedIds([]);
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

        // SEND SMS STATUS
        // try {
        //   smsNotification(smsPayload).unwrap();
        // } catch (error) {
        //   console.log(error);
        //   toast.error("Error!", {
        //     description: "Sms notification error!",
        //     duration: 1500,
        //   });
        // }
      }
    });
  };

  useEffect(() => {
    if (userDetails) {
      setValue("ChannelId", {
        channelId: userDetails?.channels?.[0]?.channelId,
        channelName: userDetails?.channels?.[0]?.channelName,
      });
    } else {
      setValue("ChannelId", null);
    }

    getChannel({
      Status: true,
    });
  }, [userDetails]);

  useEffect(() => {
    if (!watch("TargetDate")) {
      setShowReason(false);
      return;
    }

    const today = moment().format("YYYY-MM-DD");
    const diff = moment(watch("TargetDate")).diff(today, "days");

    setShowReason(channelNameValidation === "HMU - IT Hardware Support" ? diff > 3 : diff > 2);
  }, [watch("TargetDate")]);

  console.log("Channel: ", channelNameValidation);

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
            color: theme.palette.success.main,
          }}
        >
          Concern Details
        </DialogTitle>

        <Stack sx={{ width: "100%", height: "auto", mb: 4, borderRadius: "20px", padding: 2 }}>
          <form onSubmit={handleSubmit(onSubmitAction)}>
            <DialogContent>
              <Stack sx={{ width: "100%", height: "auto", gap: 2 }}>
                {/* Channel */}
                <Stack>
                  <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
                    <Typography
                      sx={{
                        fontSize: "13px",
                      }}
                    >
                      Channel
                    </Typography>
                    <FiberManualRecord color="error" sx={{ fontSize: "10px" }} />
                  </Stack>

                  <Controller
                    control={control}
                    name="ChannelId"
                    render={({ field: { ref, value, onChange } }) => {
                      return (
                        <Autocomplete
                          ref={ref}
                          size="small"
                          value={value}
                          options={userDetails?.channels || []}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Channel Name"
                              sx={{ "& .MuiInputBase-input": { fontSize: "13px" } }}
                            />
                          )}
                          onChange={(_, value) => {
                            onChange(value);
                            setValue("CategoryId", []);
                            setValue("SubCategoryId", []);
                            setValue("userId", null);
                          }}
                          getOptionLabel={(option) => option.channelName || ""}
                          isOptionEqualToValue={(option, value) => option.channelId === value.channelId}
                          sx={{
                            flex: 2,
                          }}
                          componentsProps={{
                            popper: {
                              sx: {
                                "& .MuiAutocomplete-listbox": {
                                  fontSize: "13px",
                                },
                              },
                            },
                          }}
                          fullWidth
                          disableClearable
                        />
                      );
                    }}
                  />
                </Stack>

                {/* Assign to if user is matches Approver role */}
                {userDetails?.userRoleName?.includes("Approver") && (
                  <Stack gap={0.5}>
                    <Typography
                      sx={{
                        fontSize: "13px",
                      }}
                    >
                      Assign To:
                    </Typography>
                    <Controller
                      control={control}
                      name="IssueHandler"
                      render={({ field: { ref, value, onChange } }) => {
                        return (
                          <Autocomplete
                            ref={ref}
                            size="small"
                            value={value}
                            options={
                              channelData?.value?.channel?.find(
                                (item) => item.id === watch("ChannelId")?.channelId,
                              )?.channelUsers || []
                            }
                            loading={channelIsLoading}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Issue Handler"
                                sx={{ "& .MuiInputBase-input": { fontSize: "13px" } }}
                              />
                            )}
                            onChange={(_, value) => {
                              onChange(value);
                            }}
                            getOptionLabel={(option) => option.fullname}
                            isOptionEqualToValue={(option, value) => option?.userId === value?.userId}
                            sx={{
                              flex: 2,
                            }}
                            componentsProps={{
                              popper: {
                                sx: {
                                  "& .MuiAutocomplete-listbox": {
                                    fontSize: "13px",
                                  },
                                },
                              },
                            }}
                            fullWidth
                          />
                        );
                      }}
                    />
                  </Stack>
                )}

                {/* Target Date */}
                <Stack>
                  <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
                    <Typography
                      sx={{
                        fontSize: "13px",
                      }}
                    >
                      Target Date
                    </Typography>
                    <FiberManualRecord color="error" sx={{ fontSize: "10px" }} />
                  </Stack>

                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <Controller
                      control={control}
                      name="TargetDate"
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
                                  fontSize: "13px",
                                },
                              },
                            },
                          }}
                          minDate={new moment()}
                          error={!!errors.TargetDate}
                          helperText={errors.TargetDate ? errors.TargetDate.message : null}
                        />
                      )}
                    />
                    {errors.TargetDate && <Typography>{errors.TargetDate.message}</Typography>}
                  </LocalizationProvider>
                </Stack>

                {/* Reason */}
                {showReason && (
                  <Stack>
                    <Typography
                      sx={{
                        fontSize: "13px",
                      }}
                    >
                      Reason
                    </Typography>

                    <Controller
                      control={control}
                      name="Reason"
                      render={({ field: { ref, value, onChange } }) => {
                        return (
                          <TextField
                            inputRef={ref}
                            size="medium"
                            value={value}
                            placeholder="Enter reason"
                            onChange={onChange}
                            sx={{
                              width: "100%",
                            }}
                            InputProps={{
                              style: {
                                fontSize: "13px",
                              },
                            }}
                            InputLabelProps={{
                              style: {
                                fontSize: "13px",
                              },
                            }}
                            autoComplete="off"
                            rows={4}
                            multiline
                          />
                        );
                      }}
                    />

                    <Stack alignItems="center" direction="row" gap={0.5} mt={1}>
                      <Warning color="warning" sx={{ fontSize: "15px" }} />
                      <Typography
                        sx={{ fontSize: "12px", color: theme.palette.warning.main, fontStyle: "italic" }}
                      >
                        {`Note: Please input a reason if the target date is more than ${channelNameValidation === "HMU - IT Hardware Support" ? 3 : 2} days from today.`}
                      </Typography>
                    </Stack>
                  </Stack>
                )}
              </Stack>
            </DialogContent>

            <DialogActions>
              <LoadingButton
                size="small"
                variant="outlined"
                loading={takeTicketIsLoading || takeTicketIsFetching}
                onClick={onCloseAction}
              >
                Cancel
              </LoadingButton>
              <LoadingButton
                size="small"
                type="submit"
                variant="contained"
                loading={takeTicketIsLoading || takeTicketIsFetching}
                disabled={
                  !watch("ChannelId") ||
                  !watch("TargetDate") ||
                  (userDetails?.userRoleName?.includes("Approver") && !watch("IssueHandler")) ||
                  (showReason === true && !watch("Reason")) ||
                  selectedIds?.length === 0
                }
                sx={{
                  ":disabled": {
                    backgroundColor: theme.palette.secondary.main,
                    color: "black",
                  },
                }}
              >
                Confirm
              </LoadingButton>
            </DialogActions>
          </form>
        </Stack>
      </Dialog>
    </>
  );
};

export default AssignTicketDrawer;
