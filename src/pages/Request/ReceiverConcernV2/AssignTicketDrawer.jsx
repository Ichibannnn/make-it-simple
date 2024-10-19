import { Autocomplete, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, TextField, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import { theme } from "../../../theme/theme";
import { LoadingButton } from "@mui/lab";
import { Toaster, toast } from "sonner";

import { useDispatch } from "react-redux";
import { notificationApi } from "../../../features/api_notification/notificationApi";
import { useLazyGetChannelsQuery } from "../../../features/api_channel_setup/channel/channelApi";
import {
  useApproveReceiverConcernMutation,
  useCreateEditReceiverConcernMutation,
  useLazyGetReceiverAttachmentQuery,
} from "../../../features/api_request/concerns_receiver/concernReceiverApi";
import moment from "moment";
import useSignalRConnection from "../../../hooks/useSignalRConnection";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useDeleteRequestorAttachmentMutation } from "../../../features/api_request/concerns/concernApi";
import { useLazyGetDownloadAttachmentQuery, useLazyGetViewAttachmentQuery } from "../../../features/api_attachments/attachmentsApi";
import { Add, AttachFileOutlined, CheckOutlined, FileDownloadOutlined, GetAppOutlined, RemoveCircleOutline, VisibilityOutlined } from "@mui/icons-material";
import { notificationMessageApi } from "../../../features/api_notification_message/notificationMessageApi";

const schema = yup.object().shape({
  Requestor_By: yup.string().nullable(),
  concern_Details: yup.array().nullable(),
  ticketConcernId: yup.string().nullable(),
  ChannelId: yup.object().required().label("Channel"),
  userId: yup.object().required().label("Issue handler"),
  targetDate: yup.date().required("Target date is required"),
  RequestConcernId: yup.string().nullable(),
  RequestAttachmentsFiles: yup.array().nullable(),
});

const AssignTicketDrawer = ({ data, setData, open, onClose, viewConcernDetailsOnClose }) => {
  const [attachments, setAttachments] = useState([]);
  const [ticketAttachmentId, setTicketAttachmentId] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null); // To handle the selected image
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false); // To control the view dialog
  const [formClosed, setFormClosed] = useState(false);

  const [loading, setLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);

  const dispatch = useDispatch();
  const fileInputRef = useRef();
  const today = moment();
  useSignalRConnection();

  const [getChannel, { data: channelData, isLoading: channelIsLoading, isSuccess: channelIsSuccess }] = useLazyGetChannelsQuery();
  const [getIssueHandler, { isLoading: issueHandlerIsLoading, isSuccess: issueHandlerIsSuccess }] = useLazyGetChannelsQuery();
  const [createEditReceiverConcern, { isLoading: isCreateEditReceiverConcernLoading, isFetching: isCreateEditReceiverConcernFetching }] = useCreateEditReceiverConcernMutation();
  const [approveReceiverConcern, { isLoading: approveReceiverConcernIsLoading, isFetching: approveReceiverConcernIsFetching }] = useApproveReceiverConcernMutation();

  const [deleteRequestorAttachment] = useDeleteRequestorAttachmentMutation();
  const [getAddReceiverAttachment] = useLazyGetReceiverAttachmentQuery();
  const [getViewAttachment] = useLazyGetViewAttachmentQuery();
  const [getDownloadAttachment] = useLazyGetDownloadAttachmentQuery();

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
      Requestor_By: "",
      concern_Details: [],
      ticketConcernId: "",

      ChannelId: null,
      userId: null,
      targetDate: null,

      RequestConcernId: "",
      RequestAttachmentsFiles: [],
    },
  });

  const handleAttachments = (event) => {
    const newFiles = Array.from(event.target.files);

    const fileNames = newFiles.map((file) => ({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2),
      file,
    }));

    const uniqueNewFiles = fileNames?.filter((newFile) => !attachments?.some((existingFile) => existingFile?.name === newFile?.name));
    setAttachments((prevFiles) => (Array.isArray(prevFiles) ? [...prevFiles, ...uniqueNewFiles] : [...uniqueNewFiles]));
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleUpdateFile = (id) => {
    setTicketAttachmentId(id);
    fileInputRef.current.click();
  };

  const handleDeleteFile = async (fileNameToDelete) => {
    console.log("File name: ", fileNameToDelete);

    try {
      if (fileNameToDelete.ticketAttachmentId) {
        const deletePayload = {
          ticketAttachmentId: fileNameToDelete.ticketAttachmentId,
        };
        await deleteRequestorAttachment(deletePayload).unwrap();
      }

      setAttachments((prevFiles) => prevFiles.filter((fileName) => fileName !== fileNameToDelete));

      setValue(
        "RequestAttachmentsFiles",
        watch("RequestAttachmentsFiles").filter((file) => file.name !== fileNameToDelete.name)
      );
    } catch (error) {}
  };

  const handleDragOver = (event) => {
    event.preventDefault();
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

  const getAddAttachmentData = async (id) => {
    try {
      const res = await getAddReceiverAttachment({ Id: id }).unwrap();

      setAttachments(
        res?.value?.[0]?.attachments?.map((item) => ({
          ticketAttachmentId: item.ticketAttachmentId,
          name: item.fileName,
          size: (item.fileSize / (1024 * 1024)).toFixed(2),
          link: item.attachment,
        }))
      );
    } catch (error) {}
  };

  const handleViewImage = async (file) => {
    console.log("File: ", file);
    setViewLoading(true);
    try {
      const response = await getViewAttachment(file?.ticketAttachmentId);

      console.log("Res: ", response);

      if (response?.data) {
        const imageUrl = URL.createObjectURL(response.data); // Create a URL for the fetched image
        setSelectedImage(imageUrl); // Set the image URL to state
        setIsViewDialogOpen(true);
        setViewLoading(false);
      }
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  const handleViewImageWithoutId = (file) => {
    console.log("File: ", file);
    setViewLoading(true);
    const reader = new FileReader();
    try {
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setIsViewDialogOpen(true);
      };
      reader.readAsDataURL(file);
      setViewLoading(false);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  const isImageFile = (fileName) => {
    return /\.(jpg|jpeg|png)$/i.test(fileName);
  };

  const handleDownloadAttachment = async (file) => {
    setLoading(true);
    try {
      const response = await getDownloadAttachment(file?.ticketAttachmentId);

      if (response?.data) {
        const blob = new Blob([response.data], { type: response.data.type });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${file?.name || "attachment"}`); // Default to 'attachment' if no name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Clean up after download
        setLoading(false);
      } else {
        console.log("No data in the response");
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const onCloseAction = () => {
    reset();
    setFormClosed((prev) => !prev);
    onClose();
  };

  // console.log("Data: ", data);
  // console.log("Requestor by: ", watch("Requestor_By"));

  const handleViewImageClose = () => {
    setIsViewDialogOpen(false);
    setSelectedImage(null);
  };

  const onSubmitAction = (formData) => {
    // console.log("FormData: ", formData);

    const payload = new FormData();

    payload.append("TicketConcernId", formData.ticketConcernId);
    payload.append("ChannelId", formData.ChannelId.id);
    payload.append("Requestor_By", formData.Requestor_By);
    payload.append("UserId", formData.userId?.userId);
    payload.append("Concern_Details", formData.concern_Details);
    payload.append("Target_Date", moment(formData.targetDate).format("YYYY-MM-DD"));

    // Attachments
    const files = formData.RequestAttachmentsFiles;
    for (let i = 0; i < files.length; i++) {
      payload.append(`ConcernAttachments[${i}].ticketAttachmentId`, files[i].ticketAttachmentId || "");
      payload.append(`ConcernAttachments[${i}].attachment`, files[i]);
    }

    if (files.length === 0) {
      payload.append(`ConcernAttachments[0].ticketAttachmentId`, "");
      payload.append(`ConcernAttachments[0].attachment`, "");
    }

    console.log("Payload Entries: ", [...payload.entries()]);

    const approvePayload = {
      ticketConcernId: formData.ticketConcernId,
    };

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
        createEditReceiverConcern(payload)
          .unwrap()
          .then(() => {
            // Approve API
            approveReceiverConcern(approvePayload)
              .unwrap()
              .then(() => {
                setData(null);
                onClose();
              })
              .catch((err) => {
                console.log("Error", err);
                toast.error("Error!", {
                  description: err.data.error.message,
                  duration: 1500,
                });
              });

            toast.success("Success!", {
              description: "Approve concern successfully!",
              duration: 1500,
            });

            dispatch(notificationApi.util.resetApiState());
            dispatch(notificationMessageApi.util.resetApiState());

            setAttachments([]);
            // setApproveStatus("false");
            reset();
            setData(null);
            viewConcernDetailsOnClose();
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

  useEffect(() => {
    if (data) {
      if (!channelIsSuccess) getChannel();

      setValue("Requestor_By", data?.requestorId);
      setValue("concern_Details", [data?.concern]);
      setValue("ticketConcernId", data?.ticketRequestConcerns?.[0]?.ticketConcernId);

      setValue("ChannelId", {
        id: data?.channelId,
        channel_Name: data?.channel_Name,
      });

      getAddAttachmentData(data.requestConcernId);
    }
  }, [data, formClosed]);

  return (
    <>
      <Toaster richColors position="top-right" closeButton />
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
            color: "#fff",
          }}
        >
          Create Ticket
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
                        renderInput={(params) => <TextField {...params} placeholder="Channel Name" />}
                        onOpen={() => {
                          if (!channelIsSuccess)
                            getChannel({
                              Status: true,
                            });
                        }}
                        onChange={(_, value) => {
                          onChange(value);

                          setValue("userId", null);
                        }}
                        getOptionLabel={(option) => option.channel_Name}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        sx={{
                          flex: 2,
                        }}
                        fullWidth
                        disabled
                        disablePortal
                        disableClearable
                      />
                    );
                  }}
                />
              </Stack>

              <Stack gap={0.5}>
                <Typography
                  sx={{
                    fontSize: "14px",
                  }}
                >
                  Assign To:
                </Typography>
                <Controller
                  control={control}
                  name="userId"
                  render={({ field: { ref, value, onChange } }) => {
                    return (
                      <Autocomplete
                        // multiple
                        ref={ref}
                        size="small"
                        value={value}
                        options={channelData?.value?.channel?.find((item) => item.id === watch("ChannelId")?.id)?.channelUsers || []}
                        loading={issueHandlerIsLoading}
                        renderInput={(params) => <TextField {...params} placeholder="Issue Handler" />}
                        onOpen={() => {
                          if (!issueHandlerIsSuccess) getIssueHandler();
                        }}
                        onChange={(_, value) => {
                          onChange(value);
                        }}
                        getOptionLabel={(option) => option.fullname}
                        isOptionEqualToValue={(option, value) => option?.userId === value?.userId}
                        // getOptionDisabled={(option) => watch("userId")?.some((item) => item?.userId === option?.userId)}
                        sx={{
                          flex: 2,
                        }}
                        fullWidth
                        disablePortal
                        // disableClearable
                      />
                    );
                  }}
                />
              </Stack>

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
                        // disabled={!watch("startDate")}
                      />
                    )}
                  />
                  {errors.targetDate && <Typography>{errors.targetDate.message}</Typography>}
                </LocalizationProvider>
              </Stack>

              {/* Attachments */}
              <Stack padding={2} marginTop={3} gap={1.5} sx={{ border: "1px solid #2D3748", borderRadius: "20px" }}>
                <Stack direction="row" gap={1} alignItems="center" onDragOver={handleDragOver}>
                  <GetAppOutlined sx={{ color: theme.palette.text.secondary }} />

                  <Typography
                    sx={{
                      fontSize: "14px",
                    }}
                  >
                    Attachments:
                  </Typography>

                  <Button size="small" variant="contained" color="warning" startIcon={<Add />} onClick={handleUploadButtonClick}>
                    <Typography sx={{ fontSize: "12px" }}>Add</Typography>
                  </Button>
                </Stack>

                {attachments === undefined ? (
                  <Stack sx={{ flexDirection: "column", maxHeight: "auto", padding: 4 }}>
                    <Stack direction="row" gap={0.5} justifyContent="center">
                      <AttachFileOutlined sx={{ color: theme.palette.text.secondary }} />
                      <Typography sx={{ color: theme.palette.text.secondary }}>No attached file</Typography>
                    </Stack>
                  </Stack>
                ) : (
                  <Stack sx={{ flexDirection: "column", maxHeight: "auto" }}>
                    {attachments?.map((fileName, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          width: "100%",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          padding: 1,
                        }}
                      >
                        <Box
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
                                fontSize: "14px",
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
                                  fontSize: 13,
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
                            {!!fileName.ticketAttachmentId ? (
                              <>
                                {isImageFile(fileName.name) && (
                                  <IconButton size="small" color="primary" onClick={() => handleViewImage(fileName)} style={{ background: "none" }}>
                                    {viewLoading ? <CircularProgress size={14} /> : <VisibilityOutlined />}
                                  </IconButton>
                                  // <ViewAttachment fileName={fileName} loading={loading} handleViewImage={handleViewImage} />
                                )}
                              </>
                            ) : (
                              <>
                                {isImageFile(fileName.name) && (
                                  <IconButton size="small" color="primary" onClick={() => handleViewImageWithoutId(fileName.file)} style={{ background: "none" }}>
                                    <VisibilityOutlined />
                                  </IconButton>
                                )}
                              </>
                            )}

                            {!fileName.ticketAttachmentId && (
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
                            )}

                            {/* {fileName.ticketAttachmentId === null && (
                                    <Tooltip title="Upload">
                                      <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleUpdateFile(fileName.ticketAttachmentId)}
                                        style={{
                                          background: "none",
                                        }}
                                      >
                                        <FileUploadOutlined />
                                      </IconButton>
                                    </Tooltip>
                                  )} */}

                            {!!fileName.ticketAttachmentId && (
                              <Tooltip title="Download">
                                {loading ? (
                                  <CircularProgress size={14} />
                                ) : (
                                  <IconButton
                                    size="small"
                                    color="error"
                                    // onClick={() => {
                                    //   window.location = fileName.link;
                                    // }}
                                    onClick={() => handleDownloadAttachment(fileName)}
                                    style={{
                                      background: "none",
                                    }}
                                  >
                                    <FileDownloadOutlined />
                                  </IconButton>
                                )}
                              </Tooltip>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Stack>

              <Controller
                control={control}
                name="RequestAttachmentsFiles"
                render={({ field: { onChange, value } }) => (
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".png,.jpg,.jpeg,.docx"
                    onChange={(event) => {
                      if (ticketAttachmentId) {
                        const files = Array.from(event.target.files);
                        files[0].ticketAttachmentId = ticketAttachmentId;

                        onChange([...files, ...value.filter((item) => item.ticketAttachmentId !== ticketAttachmentId)]);

                        setAttachments((prevFiles) => [
                          ...prevFiles.filter((item) => item.ticketAttachmentId !== ticketAttachmentId),
                          {
                            ticketAttachmentId: ticketAttachmentId,
                            name: files[0].name,
                            size: (files[0].size / (1024 * 1024)).toFixed(2),
                          },
                        ]);

                        fileInputRef.current.value = "";
                        setTicketAttachmentId(null);
                      } else {
                        handleAttachments(event);
                        const files = Array.from(event.target.files);

                        const uniqueNewFiles = files.filter((item) => !value.some((file) => file.name === item.name));

                        onChange([...value, ...uniqueNewFiles]);
                        fileInputRef.current.value = "";
                      }
                    }}
                    hidden
                    multiple={!!ticketAttachmentId}
                  />
                )}
              />
            </Stack>
          </DialogContent>

          <DialogActions>
            <LoadingButton
              type="submit"
              variant="contained"
              //   loading={isLoading || isFetching}
              disabled={!watch("ChannelId") || !watch("userId") || !watch("targetDate")}
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
        </form>

        {/* Dialog to view image */}
        {selectedImage && (
          <>
            <Dialog fullWidth maxWidth="md" open={isViewDialogOpen} onClose={handleViewImageClose}>
              <DialogContent sx={{ height: "auto" }}>{selectedImage && <img src={selectedImage} alt="Preview" style={{ width: "100%" }} />}</DialogContent>
              <DialogActions>
                <Button onClick={handleViewImageClose}>Close</Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </Dialog>
    </>
  );
};

export default AssignTicketDrawer;
