import { LoadingButton } from "@mui/lab";
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, Divider, IconButton, Stack, TextField, Tooltip, Typography } from "@mui/material";
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
import { useCloseIssueHandlerTicketsMutation } from "../../../features/api_ticketing/issue_handler/concernIssueHandlerApi";
import { useLazyGetDownloadAttachmentQuery, useLazyGetViewAttachmentQuery } from "../../../features/api_attachments/attachmentsApi";

const schema = yup.object().shape({
  ticketConcernId: yup.number(),
  closingTicketId: yup.number(),
  resolution: yup.string().required().label("Resolution is required"),
  AddClosingAttachments: yup.array().nullable(),
});

const ManageTicketDialog = ({ data, open, onClose }) => {
  const [attachments, setAttachments] = useState([]);
  const [ticketAttachmentId, setTicketAttachmentId] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null); // To handle the selected image
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false); // To control the view dialog
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);

  const fileInputRef = useRef();

  const [getViewAttachment] = useLazyGetViewAttachmentQuery();
  const [getDownloadAttachment] = useLazyGetDownloadAttachmentQuery();
  const [closeIssueHandlerTickets, { isLoading: closeIssueHandlerTicketsIsLoading, isFetching: closeIssueHandlerTicketsIsFetching }] = useCloseIssueHandlerTicketsMutation();
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
      ticketConcernId: "",
      closingTicketId: "",
      resolution: "",
      AddClosingAttachments: [],
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
      text: `Edit this ticket number ${data?.ticketConcernId}?`,
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

        payload.append("TicketConcernId", formData.ticketConcernId);
        payload.append("ClosingTicketId", formData.closingTicketId);
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

        closeIssueHandlerTickets(payload)
          .unwrap()
          .then(() => {
            toast.success("Success!", {
              description: "Ticket updated successfully!",
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
      setValue("ticketConcernId", data?.ticketConcernId);
      setValue("closingTicketId", data?.getForClosingTickets?.[0]?.closingTicketId);
      setValue("resolution", data?.getForClosingTickets?.[0]?.resolution);

      const manageTicketArray = data?.getForClosingTickets?.map((item) =>
        item?.getAttachmentForClosingTickets?.map((subItem) => {
          return {
            ticketAttachmentId: subItem.ticketAttachmentId,
            name: subItem.fileName,
            size: (subItem.fileSize / (1024 * 1024)).toFixed(2),
            link: subItem.attachment,
          };
        })
      );

      setAttachments(
        manageTicketArray?.[0]?.map((item) => ({
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

  console.log("attachments: ", attachments);

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

            <Stack id="closeticket" component="form" direction="row" gap={1} sx={{ width: "100%", height: "100%" }} onSubmit={handleSubmit(onSubmitAction)}>
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

                  {data?.getForClosingTickets?.[0]?.isApprove === true ? (
                    <Typography
                      sx={{
                        fontSize: "16px",
                        fontWeight: 700,
                        fontStyle: "italic",
                        color: "#22B4BF",
                      }}
                    >
                      (Approved)
                    </Typography>
                  ) : (
                    ""
                  )}
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
                    {data?.getForClosingTickets?.[0]?.isApprove === false ? "Manage Ticket Form" : "View Ticket Form"}
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
                            onChange={onChange}
                            disabled={data?.getForClosingTickets?.[0]?.isApprove === true ? true : false}
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

                        {data?.getForClosingTickets?.[0]?.isApprove === false && (
                          <Button
                            size="small"
                            variant="contained"
                            color="warning"
                            startIcon={<Add />}
                            onClick={handleUploadButtonClick}
                            sx={{ padding: "2px", borderRadius: "2px" }}
                          >
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
                            justifyContent: "space-between",
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

                                {data?.getForClosingTickets?.[0]?.isApprove === false && (
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

                                {/* {!!fileName.ticketAttachmentId && data?.getForClosingTickets?.[0]?.isApprove === false && (
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
                      name="AddClosingAttachments"
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
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Stack sx={{ width: "100%", paddingRight: 2, paddingLeft: 2 }}>
            {data?.getForClosingTickets?.[0]?.isApprove === false && (
              <LoadingButton
                type="submit"
                form="closeticket"
                variant="contained"
                loading={closeIssueHandlerTicketsIsLoading || closeIssueHandlerTicketsIsFetching}
                disabled={!watch("resolution")}
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

export default ManageTicketDialog;
