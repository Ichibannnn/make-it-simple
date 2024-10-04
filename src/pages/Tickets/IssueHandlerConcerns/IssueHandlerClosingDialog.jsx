import { LoadingButton } from "@mui/lab";
import { Box, Button, Dialog, DialogActions, DialogContent, Divider, IconButton, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { Add, CheckOutlined, Close, FiberManualRecord, RemoveCircleOutline, VisibilityOutlined } from "@mui/icons-material";

import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Toaster, toast } from "sonner";
import { theme } from "../../../theme/theme";
import Swal from "sweetalert2";

import { useDeleteRequestorAttachmentMutation } from "../../../features/api_request/concerns/concernApi";
import { useCloseIssueHandlerTicketsMutation } from "../../../features/api_ticketing/issue_handler/concernIssueHandlerApi";
import useSignalRConnection from "../../../hooks/useSignalRConnection";
import { useDispatch } from "react-redux";
import { notificationApi } from "../../../features/api_notification/notificationApi";

const schema = yup.object().shape({
  ticketConcernId: yup.number(),
  resolution: yup.string().required().label("Resolution is required"),
  AddClosingAttachments: yup.array().nullable(),
});

const IssueHandlerClosingDialog = ({ data, refetch, open, onClose }) => {
  const [addAttachments, setAddAttachments] = useState([]);
  const [ticketAttachmentId, setTicketAttachmentId] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null); // To handle the selected image
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false); // To control the view dialog

  const dispatch = useDispatch();
  const fileInputRef = useRef();

  const [closeIssueHandlerTickets, { isLoading: closeIssueHandlerTicketsIsLoading, isFetching: closeIssueHandlerTicketsIsFetching }] = useCloseIssueHandlerTicketsMutation();
  const [deleteRequestorAttachment] = useDeleteRequestorAttachmentMutation();

  const connection = useSignalRConnection();

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
      ticketConcernId: "",
      resolution: "",
      AddClosingAttachments: [],
    },
  });

  const onSubmitAction = (formData) => {
    // console.log("FormData: ", formData);

    const payload = new FormData();

    payload.append("TicketConcernId", formData.ticketConcernId);
    payload.append("Resolution", formData.resolution);

    // Attachments
    const files = formData.AddClosingAttachments;
    for (let i = 0; i < files.length; i++) {
      payload.append(`AddClosingAttachments[${i}].ticketAttachmentId`, files[i].ticketAttachmentId || "");
      payload.append(`AddClosingAttachments[${i}].attachment`, files[i]);
    }

    if (files.length === 0) {
      payload.append(`AddClosingAttachments[0].ticketAttachmentId`, "");
      payload.append(`AddClosingAttachments[0].attachment`, "");
    }

    Swal.fire({
      title: "Confirmation",
      text: `Requesting to close this ticket number ${data?.ticketConcernId}?`,
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
        closeIssueHandlerTickets(payload)
          .unwrap()
          .then(() => {
            toast.success("Success!", {
              description: "Ticket submitted successfully!",
              duration: 1500,
            });

            // connection();

            // if (connection) {
            //   refetch();
            // }

            dispatch(notificationApi.util.resetApiState());

            setAddAttachments([]);
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
      file: file,
    }));

    const uniqueNewFiles = fileNames.filter((newFile) => !addAttachments.some((existingFile) => existingFile.name === newFile.name));

    setAddAttachments((prevFiles) => [...prevFiles, ...uniqueNewFiles]);
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleDeleteFile = async (fileNameToDelete) => {
    // console.log("File name: ", fileNameToDelete);

    try {
      if (fileNameToDelete.ticketAttachmentId) {
        const deletePayload = {
          removeAttachments: [
            {
              ticketAttachmentId: fileNameToDelete.ticketAttachmentId,
            },
          ],
        };
        await deleteRequestorAttachment(deletePayload).unwrap();
      }

      setAddAttachments((prevFiles) => prevFiles.filter((fileName) => fileName !== fileNameToDelete));

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
    setAddAttachments([]);
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

    const uniqueNewFiles = fileNames.filter((fileName) => !addAttachments.includes(fileName));
    setAddAttachments([...addAttachments, ...uniqueNewFiles]);
  };

  // Function to open image view dialog
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
      // console.log("Data: ", data);

      setValue("ticketConcernId", data?.ticketConcernId);
    }
  }, [data]);

  return (
    <>
      <Toaster richColors position="top-right" closeButton />
      <Dialog fullWidth maxWidth="md" open={open}>
        <DialogContent>
          <Stack sx={{ minHeight: "600px" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="column">
                <Typography
                  sx={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: theme.palette.success.main,
                  }}
                >
                  Ticket Details
                </Typography>
              </Stack>

              <Stack direction="row" gap={0.5} alignItems="center">
                <IconButton onClick={onCloseHandler}>
                  <Close />
                </IconButton>
              </Stack>
            </Stack>

            <Divider variant="fullWidth" sx={{ background: "#2D3748" }} />

            <Stack id="closeTicket" component="form" direction="row" gap={1} sx={{ width: "100%", height: "100%" }} onSubmit={handleSubmit(onSubmitAction)}>
              {/* TICKET DETAILS */}
              <Stack sx={{ padding: 1, width: "100%" }}>
                <Stack direction="row" gap={0.5} alignItems="center" mt={4}>
                  <FiberManualRecord color="warning" fontSize="20px" />
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "16px",
                      color: theme.palette.text.main,
                    }}
                  >
                    {` Ticket # : ${data?.ticketConcernId}`}
                  </Typography>
                </Stack>

                <Stack gap={0.5} mt={4}>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: "14px",
                      color: theme.palette.text.main,
                    }}
                  >
                    Ticket Description:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: "14px",
                      color: theme.palette.text.secondary,
                    }}
                    dangerouslySetInnerHTML={{
                      __html: data?.concern_Description.replace(/\r\n/g, "<br />"),
                    }}
                  />
                </Stack>

                <Stack sx={{ padding: 2, marginTop: 2, minHeight: "500px", bgcolor: theme.palette.bgForm.black2 }}>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: "16px",
                      color: theme.palette.text.main,
                    }}
                  >
                    Closing Ticket Form
                  </Typography>

                  <Stack gap={0.5} mt={2}>
                    <Typography
                      sx={{
                        fontSize: "14px",
                      }}
                    >
                      Resolution:
                    </Typography>

                    <Controller
                      control={control}
                      name="resolution"
                      render={({ field: { ref, value, onChange } }) => {
                        return (
                          <TextField
                            inputRef={ref}
                            size="medium"
                            value={value}
                            // placeholder="Enter resolution"
                            onChange={onChange}
                            autoComplete="off"
                            rows={6}
                            multiline
                            sx={{ fontSize: "10px" }}
                          />
                        );
                      }}
                    />

                    <Stack gap={0.5} mt={2} onDragOver={handleDragOver} onDrop={handleDrop}>
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
                        {addAttachments?.map((fileName, index) => (
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
                      name="AddClosingAttachments"
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
              </Stack>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Stack sx={{ width: "100%", paddingRight: 2, paddingLeft: 2 }}>
            <LoadingButton
              type="submit"
              form="closeTicket"
              variant="contained"
              loading={closeIssueHandlerTicketsIsLoading || closeIssueHandlerTicketsIsFetching}
              disabled={!watch("resolution")}
            >
              Submit
            </LoadingButton>
          </Stack>
        </DialogActions>

        {/* Dialog to view image */}
        <Dialog fullWidth maxWidth="md" open={isViewDialogOpen} onClose={handleViewClose}>
          <DialogContent sx={{ height: "auto" }}>{selectedImage && <img src={selectedImage} alt="Preview" style={{ width: "100%" }} />}</DialogContent>
          <DialogActions>
            <Button onClick={handleViewClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </Dialog>
    </>
  );
};

export default IssueHandlerClosingDialog;
