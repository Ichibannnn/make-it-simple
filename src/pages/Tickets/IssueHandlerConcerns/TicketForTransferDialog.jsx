import { LoadingButton } from "@mui/lab";
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { Add, CheckOutlined, Close, FiberManualRecord, RemoveCircleOutline, VisibilityOutlined } from "@mui/icons-material";

import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Toaster, toast } from "sonner";
import { theme } from "../../../theme/theme";
import Swal from "sweetalert2";
import { useDeleteRequestorAttachmentMutation } from "../../../features/api_request/concerns/concernApi";
import { useTransferIssueHandlerTicketsMutation } from "../../../features/api_ticketing/issue_handler/concernIssueHandlerApi";
import { useDispatch } from "react-redux";
import { notificationApi } from "../../../features/api_notification/notificationApi";
import { notificationMessageApi } from "../../../features/api_notification_message/notificationMessageApi";
import { useLazyGetChannelsQuery } from "../../../features/api_channel_setup/channel/channelApi";
import useSignalRConnection from "../../../hooks/useSignalRConnection";
import { useSelector } from "react-redux";

const schema = yup.object().shape({
  TransferRemarks: yup.string().required().label("Remarks is required"),
  AddTransferAttachments: yup.array().nullable(),

  ChannelId: yup.object().required().label("Channel"),
  Transfer_To: yup.object().required().label("Issue handler"),
});

const TicketForTransferDialog = ({ data, open, onClose }) => {
  const [attachments, setAttachments] = useState([]);
  const [ticketAttachmentId, setTicketAttachmentId] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null); // To handle the selected image
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false); // To control the view dialog

  const userId = useSelector((state) => state?.user?.id);
  const fileInputRef = useRef();
  const dispatch = useDispatch();
  useSignalRConnection();

  const [getChannel, { data: channelData, isLoading: channelIsLoading, isSuccess: channelIsSuccess }] = useLazyGetChannelsQuery();
  const [getIssueHandler, { data: issueHandlerData, isLoading: issueHandlerIsLoading, isSuccess: issueHandlerIsSuccess }] = useLazyGetChannelsQuery();
  const [transferTicket, { isLoading: transferTicketIsLoading, isFetching: transferTicketIsFetching }] = useTransferIssueHandlerTicketsMutation();

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
      TransferRemarks: "",
      AddTransferAttachments: [],

      ChannelId: null,
      Transfer_To: null,
    },
  });

  const onSubmitAction = (formData) => {
    console.log("FormData: ", formData);
    // console.log("Data: ", data);

    const payload = new FormData();

    payload.append("TicketConcernId", data?.ticketConcernId);
    payload.append("TransferRemarks", formData?.TransferRemarks);

    payload.append("Transfer_To", formData?.Transfer_To?.userId);

    // Attachments
    const files = formData.AddTransferAttachments;
    for (let i = 0; i < files.length; i++) {
      payload.append(`AddTransferAttachments[${i}].ticketAttachmentId`, "");
      payload.append(`AddTransferAttachments[${i}].attachment`, files[i]);
    }

    if (files.length === 0) {
      payload.append(`AddTransferAttachments[0].ticketAttachmentId`, "");
      payload.append(`AddTransferAttachments[0].attachment`, "");
    }

    Swal.fire({
      title: "Confirmation",
      text: `Request to transfer this ticket number ${data?.ticketConcernId}?`,
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
        console.log("Payload Entries: ", [...payload.entries()]);

        transferTicket(payload)
          .unwrap()
          .then(() => {
            toast.success("Success!", {
              description: "Transfer ticket successfully!",
              duration: 1500,
            });
            dispatch(notificationApi.util.resetApiState());
            dispatch(notificationMessageApi.util.resetApiState());
            setAttachments([]);
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

  const handleAttachments = (event) => {
    // console.log("event: ", event);
    const newFiles = Array.from(event.target.files);

    const fileNames = newFiles.map((file) => ({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2),
      file,
    }));

    const uniqueNewFiles = fileNames.filter((newFile) => !attachments.some((existingFile) => existingFile.name === newFile.name));

    setAttachments((prevFiles) => [...prevFiles, ...uniqueNewFiles]);
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleDeleteFile = (fileNameToDelete) => {
    try {
      setAttachments((prevFiles) => prevFiles.filter((fileName) => fileName !== fileNameToDelete));

      setValue(
        "AddClosingAttachments",
        watch("AddClosingAttachments").filter((file) => file.name !== fileNameToDelete.name)
      );
    } catch (error) {}
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const onCloseHandler = () => {
    onClose();
    reset();
    setAttachments([]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const fileList = event.dataTransfer.files;
    const allowedExtensions = [".png", ".docx", ".jpg", ".jpeg", ".pdf"];
    const fileNames = Array.from(fileList)
      .filter((file) => {
        const extension = file.name.split(".").pop().toLowerCase();
        return allowedExtensions.includes(`.${extension}`);
      })
      .map((file) => ({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2),
      }));

    const uniqueNewFiles = fileNames.filter((fileName) => !attachments.includes(fileName));
    setAttachments([...attachments, ...uniqueNewFiles]);
  };

  const handleViewImage = (file) => {
    console.log("File: ", file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target.result);
      setIsViewDialogOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleViewClose = () => {
    setIsViewDialogOpen(false);
    setSelectedImage(null);
  };

  const isImageFile = (fileName) => {
    return /\.(jpg|jpeg|png)$/i.test(fileName);
  };

  useEffect(() => {
    if (data) {
      setValue("ChannelId", {
        id: data?.channelId,
        channel_Name: data?.channel_Name,
      });
    }
  }, [data]);

  // console.log("Attachments: ", attachments);
  // console.log("Channel Name: ", watch("ChannelId"));
  // console.log("UserId: ", userId);
  // console.log("Users: ", channelData);

  return (
    <>
      <Toaster richColors position="top-right" closeButton />
      <Dialog fullWidth maxWidth="md" open={open}>
        <form onSubmit={handleSubmit(onSubmitAction)}>
          <DialogContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="column">
                <Typography
                  sx={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: theme.palette.success.main,
                  }}
                >
                  Transfer Ticket
                </Typography>
              </Stack>

              <Stack direction="row" gap={0.5} alignItems="center">
                <IconButton onClick={onCloseHandler}>
                  <Close />
                </IconButton>
              </Stack>
            </Stack>

            {/* <Divider variant="fullWidth" sx={{ background: "#2D3748" }} /> */}

            <Stack direction="row" gap={0.5} alignItems="center" mt={2}>
              {/* TICKET DETAILS */}
              <Stack direction="row" gap={0.5} alignItems="center">
                <FiberManualRecord color="warning" fontSize="20px" />
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "16px",
                    color: theme.palette.text.main,
                  }}
                >
                  {` Ticket Number : #${data?.ticketConcernId}`}
                </Typography>
              </Stack>
            </Stack>

            <Stack direction="row" sx={{ justifyContent: "center", alignItems: "center", border: "1px solid #2D3748", padding: 1, mt: 1 }}>
              <Box sx={{ width: "15%", ml: 2 }}>
                <Typography sx={{ textAlign: "left", color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Description:</Typography>
              </Box>
              <Box sx={{ width: "10%" }} />
              <Box width={{ width: "75%", ml: 2 }}>
                <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>
                  {data?.concern_Description?.split("\r\n").map((line, index) => (
                    <span key={index}>
                      {line}
                      <br />
                    </span>
                  ))}
                </Typography>
              </Box>
            </Stack>

            <Stack sx={{ marginTop: 2, minHeight: "500px" }}>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "16px",
                  color: theme.palette.primary.main,
                }}
              >
                Transfer Ticket Form
              </Typography>

              <Stack gap={0.5} mt={2}>
                <Typography
                  sx={{
                    fontSize: "14px",
                  }}
                >
                  Channel Name:
                </Typography>
                <Controller
                  control={control}
                  name="ChannelId"
                  render={({ field: { ref, value, onChange } }) => {
                    return (
                      <Autocomplete
                        ref={ref}
                        size="small"
                        value={value}
                        options={channelData?.value?.channel || []}
                        loading={channelIsLoading}
                        renderInput={(params) => <TextField {...params} placeholder="Channel Name" sx={{ "& .MuiInputBase-input": { fontSize: "14px" } }} />}
                        onOpen={() => {
                          if (!channelIsSuccess)
                            getChannel({
                              Status: true,
                            });
                        }}
                        onChange={(_, value) => {
                          onChange(value);

                          setValue("Transfer_To", null);

                          getIssueHandler({
                            Status: true,
                          });
                        }}
                        getOptionLabel={(option) => option.channel_Name}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        fullWidth
                        disablePortal
                        disabled
                        disableClearable
                        componentsProps={{
                          popper: {
                            sx: {
                              "& .MuiAutocomplete-listbox": {
                                fontSize: "13px",
                              },
                            },
                          },
                        }}
                      />
                    );
                  }}
                />
              </Stack>

              <Stack gap={0.5} mt={2}>
                <Typography
                  sx={{
                    fontSize: "14px",
                  }}
                >
                  Transfer to:
                </Typography>
                <Controller
                  control={control}
                  name="Transfer_To"
                  render={({ field: { ref, value, onChange } }) => {
                    return (
                      <Autocomplete
                        ref={ref}
                        size="small"
                        value={value}
                        options={issueHandlerData?.value?.channel?.find((item) => item.id === watch("ChannelId")?.id)?.channelUsers || []}
                        loading={issueHandlerIsLoading}
                        renderInput={(params) => <TextField {...params} placeholder="Issue Handler" sx={{ "& .MuiInputBase-input": { fontSize: "14px" } }} />}
                        onOpen={() => {
                          if (!issueHandlerIsSuccess) getIssueHandler();
                        }}
                        onChange={(_, value) => {
                          onChange(value);
                        }}
                        getOptionLabel={(option) => option.fullname}
                        isOptionEqualToValue={(option, value) => option?.userId === value?.userId}
                        getOptionDisabled={(option) => userId === option.userId}
                        fullWidth
                        disablePortal
                        disableClearable
                        componentsProps={{
                          popper: {
                            sx: {
                              "& .MuiAutocomplete-listbox": {
                                fontSize: "14px",
                              },
                            },
                          },
                        }}
                      />
                    );
                  }}
                />
              </Stack>

              <Stack sx={{ gap: 0.5, mt: 2 }}>
                <Typography
                  sx={{
                    fontSize: "14px",
                  }}
                >
                  Transfer Remarks:
                </Typography>

                <Controller
                  control={control}
                  name="TransferRemarks"
                  render={({ field: { ref, value, onChange } }) => {
                    return (
                      <TextField
                        inputRef={ref}
                        size="medium"
                        value={value}
                        placeholder="Enter Remarks"
                        onChange={onChange}
                        autoComplete="off"
                        rows={6}
                        multiline
                        sx={{ "& .MuiInputBase-input": { fontSize: "14px" } }}
                      />
                    );
                  }}
                />
              </Stack>

              <Stack mt={1} gap={0.5}>
                <Stack gap={0.5} mt={2} onDragOver={handleDragOver}>
                  <Stack direction="row" gap={0.5}>
                    <Typography
                      sx={{
                        fontSize: "14px",
                      }}
                    >
                      Attachment:
                    </Typography>

                    <Button size="small" variant="contained" color="warning" startIcon={<Add />} onClick={handleUploadButtonClick} sx={{ padding: "2px", borderRadius: "2px" }}>
                      <Typography sx={{ fontSize: "12px" }}>Add</Typography>
                    </Button>
                  </Stack>

                  <Box
                    sx={{
                      border: "1px solid #2D3748",
                      minHeight: "195px",
                      display: "flex",
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      // justifyContent: "space-between",
                      padding: 1,
                    }}
                  >
                    {attachments?.map((fileName, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: 0.5,
                          borderBottom: "1px solid #2D3748",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Typography sx={{ fontSize: "14px" }}>{fileName.name}</Typography>

                          <Typography
                            sx={{
                              fontSize: "12px",
                              color: theme.palette.text.secondary,
                            }}
                          >
                            {fileName.size} Mb
                          </Typography>

                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "14px",
                                fontWeight: 500,
                                color: !!fileName.ticketAttachmentId ? theme.palette.success.main : theme.palette.primary.main,
                              }}
                            >
                              {!!fileName.ticketAttachmentId ? "Attached file" : "Uploaded the file successfully"}
                            </Typography>

                            {!!fileName.ticketAttachmentId && <CheckOutlined color="success" fontSize="small" />}
                          </Box>
                        </Box>

                        <Box>
                          {isImageFile(fileName.name) && (
                            <Tooltip title="Remove">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleViewImage(fileName.file)} // View image in dialog
                                style={{ background: "none" }}
                              >
                                <VisibilityOutlined />
                              </IconButton>
                            </Tooltip>
                          )}

                          <Tooltip title="Remove">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteFile(fileName)}
                              style={{
                                background: "none",
                              }}
                            >
                              <RemoveCircleOutline />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Stack>

                <Controller
                  control={control}
                  name="AddTransferAttachments"
                  render={({ field: { onChange, value } }) => (
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".png,.jpg,.jpeg,.docx"
                      onChange={(event) => {
                        handleAttachments(event);
                        const files = Array.from(event.target.files);
                        const uniqueNewFiles = files.filter((item) => !value.some((file) => file.name === item.name));

                        console.log("Controller Files: ", files);

                        onChange([...value, ...uniqueNewFiles]);
                        fileInputRef.current.value = "";
                      }}
                      hidden
                      multiple={!!ticketAttachmentId}
                    />
                  )}
                />
              </Stack>
            </Stack>
          </DialogContent>

          <DialogActions>
            <Stack sx={{ width: "100%", paddingRight: 2, paddingLeft: 2 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={transferTicketIsLoading || transferTicketIsFetching}
                disabled={!watch("TransferRemarks") || !watch("Transfer_To")}
                sx={{
                  ":disabled": {
                    backgroundColor: theme.palette.secondary.main,
                    color: "black",
                  },
                }}
              >
                Submit
              </LoadingButton>
            </Stack>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog to view image */}
      {selectedImage && (
        <>
          <Dialog fullWidth maxWidth="md" open={isViewDialogOpen} onClose={handleViewClose}>
            <DialogContent sx={{ height: "auto" }}>{selectedImage && <img src={selectedImage} alt="Preview" style={{ width: "100%" }} />}</DialogContent>
            <DialogActions>
              <Button onClick={handleViewClose}>Close</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  );
};

export default TicketForTransferDialog;
