import { LoadingButton } from "@mui/lab";
import { Autocomplete, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, Divider, IconButton, Stack, TextField, Tooltip, Typography } from "@mui/material";
import {
  Add,
  AttachFileOutlined,
  CheckOutlined,
  Close,
  FiberManualRecord,
  FileDownloadOutlined,
  FileUploadOutlined,
  RemoveCircleOutline,
  VisibilityOutlined,
} from "@mui/icons-material";

import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Toaster, toast } from "sonner";
import { theme } from "../../../theme/theme";
import Swal from "sweetalert2";
import { useDeleteRequestorAttachmentMutation } from "../../../features/api_request/concerns/concernApi";
import { useTransferIssueHandlerTicketsMutation } from "../../../features/api_ticketing/issue_handler/concernIssueHandlerApi";
import { useLazyGetDownloadAttachmentQuery, useLazyGetViewAttachmentQuery } from "../../../features/api_attachments/attachmentsApi";
import { useLazyGetChannelsQuery } from "../../../features/api_channel_setup/channel/channelApi";

const schema = yup.object().shape({
  TransferTicketId: yup.number(),
  TicketConcernId: yup.number(),
  TransferRemarks: yup.string().required().label("Remarks is required"),
  AddTransferAttachments: yup.array().nullable(),

  ChannelId: yup.object().required().label("Channel"),
  Transfer_To: yup.object().required().label("Issue handler"),
});

const ManageTransferDialog = ({ data, open, onClose }) => {
  const [attachments, setAttachments] = useState([]);
  const [ticketAttachmentId, setTicketAttachmentId] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null); // To handle the selected image
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false); // To control the view dialog
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);

  const fileInputRef = useRef();

  const [getChannel, { data: channelData, isLoading: channelIsLoading, isSuccess: channelIsSuccess }] = useLazyGetChannelsQuery();
  const [getIssueHandler, { data: issueHandlerData, isLoading: issueHandlerIsLoading, isSuccess: issueHandlerIsSuccess }] = useLazyGetChannelsQuery();

  const [getViewAttachment] = useLazyGetViewAttachmentQuery();
  const [getDownloadAttachment] = useLazyGetDownloadAttachmentQuery();
  const [manageTransferTickets, { isLoading: manageTransferTicketsIsLoading, isFetching: manageTransferTicketsIsFetching }] = useTransferIssueHandlerTicketsMutation();
  const [deleteRequestorAttachment, { isLoading: isDeleteRequestorAttachmentLoading, isFetching: isDeleteRequestorAttachmentFetching }] = useDeleteRequestorAttachmentMutation();

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
      TransferTicketId: "",
      TicketConcernId: "",
      TransferRemarks: "",
      AddTransferAttachments: [],

      ChannelId: null,
      Transfer_To: null,
    },
  });

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
        await deleteRequestorAttachment(deletePayload)
          .unwrap()
          .then()
          .catch((err) => {
            console.log("error: ", err);
            toast.error("Error!", {
              description: err.data.error.message,
              duration: 1500,
            });
          });
      }

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

    // console.log("Attachments: ", attachments)
  };

  const onSubmitAction = (formData) => {
    console.log("Form Data: ", formData);

    Swal.fire({
      title: "Confirmation",
      text: `Edit tranfer ticket number ${data?.ticketConcernId}?`,
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
        const payload = new FormData();

        payload.append("TransferTicketId", formData.TransferTicketId);
        payload.append("TicketConcernId", formData.TicketConcernId);
        payload.append("TransferRemarks", formData.TransferRemarks);

        payload.append("Transfer_To", formData?.Transfer_To?.userId);

        // Attachments
        const files = formData.AddTransferAttachments;
        for (let i = 0; i < files.length; i++) {
          payload.append(`AddTransferAttachments[${i}].ticketAttachmentId`, files[i].ticketAttachmentId || "");
          payload.append(`AddTransferAttachments[${i}].attachment`, files[i]);
        }

        if (files.length === 0) {
          payload.append(`AddTransferAttachments[0].ticketAttachmentId`, "");
          payload.append(`AddTransferAttachments[0].attachment`, "");
        }

        console.log("Payload Entries: ", [...payload.entries()]);

        manageTransferTickets(payload)
          .unwrap()
          .then(() => {
            toast.success("Success!", {
              description: "Transfer updated successfully!",
              duration: 1500,
            });

            setAttachments([]);
            reset();
            onClose();
          })
          .catch((err) => {
            toast.error("Error!", {
              description: err.data.error.message,
              duration: 1500,
            });
          });
      }
    });
  };

  const onCloseHandler = () => {
    onClose();
    reset();
    setAttachments([]);
  };

  useEffect(() => {
    if (data) {
      //   console.log("Data: ", data);

      setValue("TransferTicketId", data?.getForTransferTickets?.[0]?.transferTicketConcernId);
      setValue("TicketConcernId", data?.ticketConcernId);
      setValue("TransferRemarks", data?.getForTransferTickets?.[0]?.transfer_Remarks);

      setValue("ChannelId", {
        id: data?.channelId,
        channel_Name: data?.channel_Name,
      });

      setValue("Transfer_To", {
        userId: data?.getForTransferTickets?.[0]?.transfer_To,
        fullname: data?.getForTransferTickets?.[0]?.transfer_To_Name,
      });

      const manageTransferTicketArray = data?.getForTransferTickets?.map((item) =>
        item?.getAttachmentForTransferTickets?.map((subItem) => {
          return {
            ticketAttachmentId: subItem.ticketAttachmentId,
            name: subItem.fileName,
            size: (subItem.fileSize / (1024 * 1024)).toFixed(2),
            link: subItem.attachment,
          };
        })
      );

      setAttachments(
        manageTransferTicketArray?.[0]?.map((item) => ({
          ticketAttachmentId: item.ticketAttachmentId,
          name: item.name,
          size: item.size,
          link: item.link,
        }))
      );
    }
  }, [data]);

  // Function to open image view dialog
  const handleViewImage = async (file) => {
    setViewLoading(true);
    try {
      const response = await getViewAttachment(file?.ticketAttachmentId);

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
    setViewLoading(true);
    try {
      const reader = new FileReader();

      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setIsViewDialogOpen(true);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  const handleDownloadAttachment = async (file) => {
    setDownloadLoading(true);
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
        setDownloadLoading(false);
      } else {
        console.log("No data in the response");
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleViewClose = () => {
    setIsViewDialogOpen(false);
    setSelectedImage(null);
  };

  const isImageFile = (fileName) => {
    return /\.(jpg|jpeg|png)$/i.test(fileName);
  };

  return (
    <>
      <Toaster richColors position="top-right" closeButton />
      <Dialog fullWidth maxWidth="md" open={open}>
        <DialogContent>
          <Stack sx={{ minHeight: "600px" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" gap={0.5}>
                <Typography
                  sx={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: theme.palette.success.main,
                  }}
                >
                  Manage Transfer
                </Typography>
              </Stack>

              <Stack direction="row" gap={0.5} alignItems="center">
                <IconButton onClick={onCloseHandler}>
                  <Close />
                </IconButton>
              </Stack>
            </Stack>

            <Stack id="closeticket" component="form" direction="row" gap={1} sx={{ width: "100%", height: "100%" }} onSubmit={handleSubmit(onSubmitAction)}>
              {/* TICKET DETAILS */}

              <Stack sx={{ padding: 1, width: "100%" }}>
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
                  <Box sx={{ width: "50%", ml: 2 }}>
                    <Typography sx={{ color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Description:</Typography>
                  </Box>
                  <Box width={{ width: "50%", ml: 2 }}>
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
                          fullWidth
                          disabled
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

                <Stack gap={0.5} mt={2} onDragOver={handleDragOver} onDrop={handleDrop}>
                  <Stack direction="row" gap={0.5}>
                    <Typography
                      sx={{
                        fontSize: "14px",
                      }}
                    >
                      Attachment:
                    </Typography>

                    {data?.getForTransferTickets?.[0]?.isApprove === false && (
                      <Button size="small" variant="contained" color="warning" startIcon={<Add />} onClick={handleUploadButtonClick} sx={{ padding: "2px", borderRadius: "2px" }}>
                        <Typography sx={{ fontSize: "12px" }}>Add</Typography>
                      </Button>
                    )}
                  </Stack>

                  {attachments?.length === 0 ? (
                    <Stack sx={{ flexDirection: "column", border: "1px solid #2D3748", minHeight: "195px", justifyContent: "center", alignItems: "center" }}>
                      <Stack direction="row" gap={0.5} justifyContent="center">
                        <AttachFileOutlined sx={{ color: theme.palette.text.secondary }} />
                        <Typography sx={{ color: theme.palette.text.secondary }}>No attached file</Typography>
                      </Stack>
                    </Stack>
                  ) : (
                    <Box
                      sx={{
                        border: "1px solid #2D3748",
                        minHeight: "195px",
                        display: "flex",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
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
                            <Typography sx={{ fontSize: "12px" }}>{fileName.name}</Typography>

                            <Typography
                              sx={{
                                fontSize: "11px",
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
                                  fontSize: 11,
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
                                  <Tooltip title="View">
                                    <IconButton
                                      size="small"
                                      color="primary"
                                      onClick={() => handleViewImage(fileName)} // View image in dialog
                                      style={{ background: "none" }}
                                    >
                                      {viewLoading ? <CircularProgress size={14} /> : <VisibilityOutlined />}
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </>
                            ) : (
                              <>
                                {isImageFile(fileName.name) && (
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => handleViewImageWithoutId(fileName.file)} // View image in dialog
                                    style={{ background: "none" }}
                                  >
                                    <VisibilityOutlined />
                                  </IconButton>
                                )}
                              </>
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

                            {!!fileName.ticketAttachmentId && (
                              <Tooltip title="Download">
                                {downloadLoading ? (
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
                      ))}
                    </Box>
                  )}
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

                          const uniqueNewFiles = files.filter((item) => !value?.some((file) => file.name === item.name));

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
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Stack sx={{ width: "100%", paddingRight: 2, paddingLeft: 2 }}>
            {data?.getForTransferTickets?.[0]?.isApprove === false && (
              <LoadingButton
                type="submit"
                form="closeticket"
                variant="contained"
                loading={manageTransferTicketsIsLoading || manageTransferTicketsIsFetching}
                disabled={!watch("TransferRemarks")}
              >
                Save
              </LoadingButton>
            )}
          </Stack>
        </DialogActions>
      </Dialog>

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

export default ManageTransferDialog;
