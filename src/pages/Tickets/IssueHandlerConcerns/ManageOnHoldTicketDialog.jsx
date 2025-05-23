import { LoadingButton } from "@mui/lab";
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, IconButton, Stack, TextField, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { Add, CheckOutlined, Close, FiberManualRecord, FileDownloadOutlined, RemoveCircleOutline, VisibilityOutlined } from "@mui/icons-material";

import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Toaster, toast } from "sonner";
import { theme } from "../../../theme/theme";
import Swal from "sweetalert2";

import useSignalRConnection from "../../../hooks/useSignalRConnection";
import { useDispatch } from "react-redux";
import { notificationApi } from "../../../features/api_notification/notificationApi";
import { notificationMessageApi } from "../../../features/api_notification_message/notificationMessageApi";
import { useDeleteRequestorAttachmentMutation } from "../../../features/api_request/concerns/concernApi";
import { useHoldIssueHandlerTicketsMutation } from "../../../features/api_ticketing/issue_handler/concernIssueHandlerApi";
import { useLazyGetDownloadAttachmentQuery, useLazyGetViewAttachmentQuery } from "../../../features/api_attachments/attachmentsApi";

const schema = yup.object().shape({
  id: yup.number(),
  ticketConcernId: yup.number(),
  Reason: yup.string().required().label("Resolution is required"),
  OnHoldAttachments: yup.array().nullable(),
});

const ManageOnHoldTicketDialog = ({ data, open, onClose }) => {
  const [addAttachments, setAddAttachments] = useState([]);
  const [ticketAttachmentId, setTicketAttachmentId] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null); // To handle the selected image
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false); // To control the view dialog
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);

  const dispatch = useDispatch();
  const fileInputRef = useRef();
  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));
  useSignalRConnection();

  const [getViewAttachment] = useLazyGetViewAttachmentQuery();
  const [getDownloadAttachment] = useLazyGetDownloadAttachmentQuery();
  const [holdIssueHandlerTickets, { isLoading: holdIssueHandlerTicketsIsLoading, isFetching: holdIssueHandlerTicketsIsFetching }] = useHoldIssueHandlerTicketsMutation();
  const [deleteRequestorAttachment] = useDeleteRequestorAttachmentMutation();

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
      id: "",
      ticketConcernId: "",
      Reason: "",
      OnHoldAttachments: [],
    },
  });

  const onSubmitAction = (formData) => {
    console.log("FormData: ", formData);

    const payload = new FormData();

    payload.append("Id", formData.id);
    payload.append("TicketConcernId", formData.ticketConcernId);
    payload.append("Reason", formData.Reason);

    // Attachments
    const files = formData.OnHoldAttachments;
    for (let i = 0; i < files.length; i++) {
      payload.append(`OnHoldAttachments[${i}].ticketAttachmentId`, files[i].ticketAttachmentId || "");
      payload.append(`OnHoldAttachments[${i}].attachment`, files[i]);
    }

    if (files.length === 0) {
      payload.append(`OnHoldAttachments[0].ticketAttachmentId`, "");
      payload.append(`OnHoldAttachments[0].attachment`, "");
    }

    console.log("Payload Entries: ", [...payload.entries()]);
    holdIssueHandlerTickets(payload)
      .unwrap()
      .then(() => {
        toast.success("Success!", {
          description: "Ticket submitted successfully!",
          duration: 1500,
        });

        dispatch(notificationApi.util.resetApiState());
        dispatch(notificationMessageApi.util.resetApiState());

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

      setAddAttachments((prevFiles) => prevFiles.filter((fileName) => fileName !== fileNameToDelete));

      setValue(
        "OnHoldAttachments",
        watch("OnHoldAttachments").filter((file) => file.name !== fileNameToDelete.name)
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

  useEffect(() => {
    if (data) {
      setValue("ticketConcernId", data?.ticketConcernId);
      setValue("id", data?.getForOnHolds?.[0]?.id);
      setValue("Reason", data?.getForOnHolds?.[0]?.reason);

      const manageTicketArray = data?.getForOnHolds?.map((item) =>
        item?.getAttachmentForOnHoldTickets?.map((subItem) => {
          return {
            id: item.id,
            ticketAttachmentId: subItem.ticketAttachmentId,
            name: subItem.fileName,
            size: (subItem.fileSize / (1024 * 1024)).toFixed(2),
            link: subItem.attachment,
          };
        })
      );

      console.log("manageTicketArray: ", manageTicketArray);

      setAddAttachments(
        manageTicketArray?.[0]?.map((item) => ({
          ticketAttachmentId: item.ticketAttachmentId,
          name: item.name,
          size: item.size,
          link: item.link,
        }))
      );
    }
  }, [data]);

  //   console.log("Attachments: ", addAttachments);

  return (
    <>
      {/* <Toaster richColors position="top-right" closeButton /> */}
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
                  Manage Hold Ticket
                </Typography>
              </Stack>

              <Stack direction="row" gap={0.5} alignItems="center">
                <IconButton onClick={onCloseHandler}>
                  <Close />
                </IconButton>
              </Stack>
            </Stack>

            {/* <Divider variant="fullWidth" sx={{ background: "#2D3748" }} /> */}
            <Stack id="closeTicket" component="form" direction="row" gap={1} sx={{ width: "100%", height: "100%" }} onSubmit={handleSubmit(onSubmitAction)}>
              {/* TICKET DETAILS */}
              <Stack sx={{ padding: 2, width: "100%", mt: 1 }}>
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

                {isScreenSmall ? (
                  <Stack sx={{ width: "100%", border: "1px solid #2D3748", padding: 1, mt: 1 }}>
                    <Typography sx={{ textAlign: "left", color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Ticket Description:</Typography>

                    <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>
                      {data?.concern_Description?.split("\r\n").map((line, index) => (
                        <span key={index}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </Typography>
                  </Stack>
                ) : (
                  <Stack direction="row" sx={{ justifyContent: "center", alignItems: "center", border: "1px solid #2D3748", padding: 1, mt: 1 }}>
                    <Box sx={{ width: "20%", ml: 2 }}>
                      <Typography sx={{ textAlign: "left", color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Ticket Description:</Typography>
                    </Box>
                    <Box sx={{ width: "5%" }} />
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
                )}

                <Stack sx={{ marginTop: 4, minHeight: "500px" }}>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: "16px",
                      color: theme.palette.primary.main,
                    }}
                  >
                    Hold Ticket Form
                  </Typography>

                  <Stack mt={2} gap={0.5}>
                    <Stack gap={0.5}>
                      <Typography
                        sx={{
                          fontSize: "14px",
                        }}
                      >
                        Reason:
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
                              // placeholder="Enter resolution"
                              onChange={onChange}
                              autoComplete="off"
                              rows={6}
                              multiline
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
                              {!!fileName.ticketAttachmentId ? (
                                <>
                                  {isImageFile(fileName.name) && (
                                    <IconButton
                                      size="small"
                                      color="primary"
                                      onClick={() => handleViewImage(fileName)} // View image in dialog
                                      style={{ background: "none" }}
                                    >
                                      {viewLoading ? <CircularProgress size={14} /> : <VisibilityOutlined />}
                                    </IconButton>
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
                    </Stack>

                    <Controller
                      control={control}
                      name="OnHoldAttachments"
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
              loading={holdIssueHandlerTicketsIsLoading || holdIssueHandlerTicketsIsFetching}
              disabled={!watch("Reason")}
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

export default ManageOnHoldTicketDialog;
