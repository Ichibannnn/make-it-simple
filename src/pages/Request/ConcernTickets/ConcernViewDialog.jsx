import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, Divider, IconButton, Paper, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { AttachFileOutlined, CheckOutlined, FileDownloadOutlined, FileUploadOutlined, RemoveCircleOutline, VisibilityOutlined } from "@mui/icons-material";

import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { theme } from "../../../theme/theme";
import { LoadingButton } from "@mui/lab";
import { toast, Toaster } from "sonner";

import { useCreateEditRequestorConcernMutation, useDeleteRequestorAttachmentMutation, useLazyGetRequestorAttachmentQuery } from "../../../features/api_request/concerns/concernApi";
import { notificationApi } from "../../../features/api_notification/notificationApi";
import { notificationMessageApi } from "../../../features/api_notification_message/notificationMessageApi";
import { useDispatch } from "react-redux";
import { useLazyGetDownloadAttachmentQuery, useLazyGetViewAttachmentQuery } from "../../../features/api_attachments/attachmentsApi";

const requestorSchema = yup.object().shape({
  RequestConcernId: yup.string().nullable(),
  Concern: yup.string().required().label("Concern Details"),
  RequestAttachmentsFiles: yup.array().nullable(),
});

const ConcernViewDialog = ({ editData, open, onClose }) => {
  const [attachments, setAttachments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ticketAttachmentId, setTicketAttachmentId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // To handle the selected image
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false); // To control the view dialog
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);

  const fileInputRef = useRef();
  const dispatch = useDispatch();

  const [createEditRequestorConcern, { isLoading: isCreateEditRequestorConcernLoading, isFetching: isCreateEditRequestorConcernFetching }] =
    useCreateEditRequestorConcernMutation();

  const [getRequestorAttachment, { data: attachmentData }] = useLazyGetRequestorAttachmentQuery();
  const [getViewAttachment] = useLazyGetViewAttachmentQuery();
  const [getDownloadAttachment] = useLazyGetDownloadAttachmentQuery();
  const [deleteRequestorAttachment] = useDeleteRequestorAttachmentMutation();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(requestorSchema),
    defaultValues: {
      Concern: "",
      RequestConcernId: "",
      RequestAttachmentsFiles: [],
    },
  });

  const onConcernFormSubmit = (formData) => {
    const payload = new FormData();

    payload.append("Concern", formData.Concern);
    payload.append("RequestConcernId", formData.RequestConcernId);

    const files = formData.RequestAttachmentsFiles;
    for (let i = 0; i < files.length; i++) {
      payload.append(`RequestAttachmentsFiles[${i}].ticketAttachmentId`, files[i].ticketAttachmentId || "");
      payload.append(`RequestAttachmentsFiles[${i}].attachment`, files[i]);
    }

    if (files.length === 0) {
      payload.append(`RequestAttachmentsFiles[0].ticketAttachmentId`, "");
      payload.append(`RequestAttachmentsFiles[0].attachment`, "");
    }

    console.log("Payload Entries: ", [...payload.entries()]);

    createEditRequestorConcern(payload)
      .unwrap()
      .then(() => {
        toast.success("Success!", {
          description: "Concern updated successfully!",
          duration: 1500,
        });
        dispatch(notificationApi.util.resetApiState());
        dispatch(notificationMessageApi.util.resetApiState());
        setAttachments([]);
        reset();
        setIsLoading(false);
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
    const newFiles = Array.from(event.target.files);

    const fileNames = newFiles.map((file) => ({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2),
      file,
    }));

    const uniqueNewFiles = fileNames.filter((newFile) => !attachments?.some((existingFile) => existingFile.name === newFile.name));
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

  // Multiple files handler event
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Drag and Drop handler event
  const handleDrop = (event) => {
    event.preventDefault();
    const fileList = event.dataTransfer.files;
    const allowedExtensions = [".png", ".docx", ".jpg", ".jpeg", ".pdf", ".xlxs"];
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

  const onCloseAction = () => {
    onClose();
    reset();
    setAttachments([]);
  };

  const getAttachmentData = async (id) => {
    try {
      const res = await getRequestorAttachment({ Id: id }).unwrap();

      // console.log("res", res);

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
    if (editData) {
      setValue("RequestConcernId", editData?.requestConcernId);
      setValue("Concern", editData?.concern);

      getAttachmentData(editData.ticketRequestConcerns.map((item) => item.ticketConcernId));
    }
  }, [editData]);

  return (
    <>
      <Toaster richColors position="top-right" closeButton />
      <Dialog fullWidth maxWidth="md" open={open} sx={{ borderRadius: "none", padding: 0 }} PaperProps={{ style: { overflow: "auto" } }}>
        <form onSubmit={handleSubmit(onConcernFormSubmit)}>
          <DialogContent sx={{ paddingBottom: 8 }}>
            <Stack direction="column" sx={{ padding: "5px" }}>
              <Stack>
                <Stack direction="row" gap={0.5}>
                  <Typography
                    sx={{
                      fontSize: "18px",
                      fontWeight: 700,
                      color: "#48BB78",
                    }}
                  >
                    {!editData ? "Add Concern" : "View Concern"}
                  </Typography>
                </Stack>
              </Stack>

              <Stack padding={5} gap={3}>
                <Stack
                  direction="row"
                  width="100%"
                  sx={{
                    paddingTop: 2,
                    gap: 2,
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography>Request Details*</Typography>

                  <Controller
                    control={control}
                    name="Concern"
                    render={({ field: { ref, value, onChange } }) => {
                      return (
                        <TextField
                          inputRef={ref}
                          size="medium"
                          value={value}
                          placeholder="Ex. System Name - Concern"
                          onChange={onChange}
                          sx={{
                            width: "80%",
                          }}
                          disabled={editData?.concern_Status === "Ongoing" || editData?.concern_Status === "For Confirmation" || editData?.concern_Status === "Done" ? true : false}
                          autoComplete="off"
                          rows={6}
                          multiline
                        />
                      );
                    }}
                  />
                </Stack>

                {/* Attachments */}
                <Stack
                  direction="row"
                  width="100%"
                  sx={{
                    paddingTop: 2,
                    gap: 2,
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography>Attachment*</Typography>

                  <Stack
                    sx={{
                      width: "80%",
                      display: "flex",
                      border: "2px dashed #2D3748",
                      justifyContent: "left",
                      padding: 1,
                    }}
                    onDragOver={handleDragOver}
                    // onDrop={handleDrop}
                  >
                    {(editData?.concern_Status === "For Approval" || editData?.concern_Status === "") && (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          gap: 1,
                          alignItems: "center",
                        }}
                      >
                        <Button size="small" variant="contained" color="warning" onClick={handleUploadButtonClick}>
                          Choose file
                        </Button>

                        <Typography sx={{ color: theme.palette.text.secondary }}>.docx, .jpg, .jpeg, .png, .pdf file</Typography>
                      </Box>
                    )}

                    <Divider
                      variant="fullWidth"
                      sx={{
                        display: !attachments?.length ? "none" : "flex",
                        background: "#2D3748",
                        marginTop: 1,
                      }}
                    />

                    {attachments === undefined ? (
                      <Stack sx={{ flexDirection: "column", maxHeight: "auto", padding: 4 }}>
                        <Stack direction="row" gap={0.5} justifyContent="center">
                          <AttachFileOutlined sx={{ color: theme.palette.text.secondary }} />
                          <Typography sx={{ color: theme.palette.text.secondary }}>No attached file</Typography>
                        </Stack>
                      </Stack>
                    ) : (
                      <Stack
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          maxHeight: "auto",
                        }}
                      >
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
                                <Typography sx={{ fontWeight: 500 }}>{fileName.name}</Typography>

                                <Typography
                                  sx={{
                                    fontSize: 13,
                                    fontWeight: 500,
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

                                {(editData?.concern_Status === "For Approval" || editData?.concern_Status === "") && (
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
                            const uniqueNewFiles = files.filter((item) => !value?.some((file) => file.name === item.name));

                            onChange([...files, ...value.filter((item) => item.ticketAttachmentId !== ticketAttachmentId), ...!uniqueNewFiles]);

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
                            const uniqueNewFiles = files.filter((item) => !attachments?.some((file) => file.name === item.name));

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
            <LoadingButton
              size="large"
              variant="contained"
              color="primary"
              type="submit"
              loading={isCreateEditRequestorConcernLoading || isCreateEditRequestorConcernFetching || isLoading}
              disabled={!watch("Concern")}
            >
              Save
            </LoadingButton>
            <Button
              variant="text"
              disabled={isCreateEditRequestorConcernLoading || isCreateEditRequestorConcernFetching || isLoading}
              onClick={onCloseAction}
              sx={{
                ":disabled": {
                  backgroundColor: "none",
                  color: "black",
                },
              }}
            >
              Close
            </Button>
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

export default ConcernViewDialog;
