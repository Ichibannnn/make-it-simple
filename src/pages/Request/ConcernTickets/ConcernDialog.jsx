import React, { useRef, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, Divider, IconButton, Stack, TextField, Typography } from "@mui/material";
import { Refresh, RemoveCircleOutline, Visibility, VisibilityOutlined, ZoomIn, ZoomOut } from "@mui/icons-material";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { theme } from "../../../theme/theme";
import { LoadingButton } from "@mui/lab";
import { Toaster, toast } from "sonner";

import { useCreateEditRequestorConcernMutation } from "../../../features/api_request/concerns/concernApi";
import { useDispatch } from "react-redux";
import { notificationApi } from "../../../features/api_notification/notificationApi";
import { notificationMessageApi } from "../../../features/api_notification_message/notificationMessageApi";
import { useSelector } from "react-redux";

const requestorSchema = yup.object().shape({
  RequestTransactionId: yup.string().nullable(),
  Concern: yup.string().required().label("Concern Details"),
  RequestConcernId: yup.string().nullable(),
  RequestAttachmentsFiles: yup.array().nullable(),
});

const ConcernDialog = ({ open, onClose }) => {
  const [attachments, setAttachments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // To handle the selected image
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false); // To control the view dialog

  const userRole = useSelector((state) => state?.user?.userRoleName);

  const dispatch = useDispatch();
  const fileInputRef = useRef();

  const [createEditRequestorConcern, { isLoading: isCreateEditRequestorConcernLoading, isFetching: isCreateEditRequestorConcernFetching }] =
    useCreateEditRequestorConcernMutation();

  const { control, handleSubmit, setValue, watch, reset } = useForm({
    resolver: yupResolver(requestorSchema),
    defaultValues: {
      RequestTransactionId: "",
      Concern: "",
      RequestConcernId: "",
      RequestAttachmentsFiles: [],
    },
  });

  const onConcernFormSubmit = (formData) => {
    const payload = new FormData();

    payload.append("Concern", formData.Concern);

    const files = formData.RequestAttachmentsFiles;
    for (let i = 0; i < files.length; i++) {
      payload.append(`RequestAttachmentsFiles[${i}].ticketAttachmentId`, "");
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
          description: "Concern added successfully!",
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
      file: file,
    }));

    const uniqueNewFiles = fileNames.filter((newFile) => !attachments.some((existingFile) => existingFile.name === newFile.name));

    setAttachments((prevFiles) => [...prevFiles, ...uniqueNewFiles]);
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleDeleteFile = (fileNameToDelete) => {
    console.log("File to Delete: ", fileNameToDelete);

    setAttachments((prevFiles) => prevFiles.filter((fileName) => fileName !== fileNameToDelete));

    setValue(
      "RequestAttachmentsFiles",
      watch("RequestAttachmentsFiles").filter((file) => file.name !== fileNameToDelete.name)
    );
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

  const updateAttachments = (newFiles) => {
    const allowedExtensions = [".png", ".docx", ".jpg", ".jpeg", ".pdf", ".xlxs"];
    const filteredFiles = newFiles
      .filter((file) => {
        const extension = file.name.split(".").pop().toLowerCase();
        return allowedExtensions.includes(`.${extension}`);
      })
      .map((file) => ({
        name: file.name,
        size: file.size,
      }));

    const currentAttachments = watch("RequestAttachmentsFiles") || [];
    const uniqueNewFiles = filteredFiles.filter((newFile) => !currentAttachments.some((existingFile) => existingFile.name === newFile.name));
    const updatedAttachments = [...currentAttachments, ...uniqueNewFiles];

    setAttachments(updatedAttachments);
    setValue("RequestAttachmentsFiles", updatedAttachments);
  };

  const onCloseAction = () => {
    onClose();
    reset();
    setAttachments([]);
  };

  // Function to open image view dialog
  const handleViewImage = (file) => {
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
                    Create Request
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
                          placeholder="Ex. System Name - Description"
                          onChange={onChange}
                          sx={{
                            width: "80%",
                          }}
                          autoComplete="off"
                          rows={6}
                          multiline
                        />
                      );
                    }}
                  />
                </Stack>

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

                    <Divider
                      variant="fullWidth"
                      sx={{
                        display: !attachments.length ? "none" : "flex",
                        background: "#2D3748",
                        marginTop: 1,
                      }}
                    />

                    <Stack
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        maxHeight: "auto",
                      }}
                    >
                      {attachments.map((fileName, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            width: "100%",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            padding: 1,
                            maxWidth: "100%",
                            overflow: "hidden",
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

                              <Typography
                                sx={{
                                  fontSize: 13,
                                  fontWeight: 500,
                                  color: theme.palette.success.main,
                                }}
                              >
                                Uploaded the file successfully
                              </Typography>
                            </Box>

                            <Box>
                              {isImageFile(fileName.name) && (
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => handleViewImage(fileName.file)} // View image in dialog
                                  style={{ background: "none" }}
                                >
                                  <VisibilityOutlined />
                                </IconButton>
                              )}

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
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </Stack>

                  <Controller
                    control={control}
                    name="RequestAttachmentsFiles"
                    render={({ field: { onChange, value } }) => (
                      <input
                        ref={fileInputRef}
                        accept=".png,.jpg,.jpeg,.docx"
                        style={{ display: "none" }}
                        multiple
                        type="file"
                        onChange={(event) => {
                          handleAttachments(event);
                          const files = Array.from(event.target.files);
                          const uniqueNewFiles = files.filter((item) => !value.some((file) => file.name === item.name));

                          console.log("Controller Files: ", files);

                          onChange([...value, ...uniqueNewFiles]);
                          fileInputRef.current.value = "";
                        }}
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

            <LoadingButton
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
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog to view image */}
      <Dialog fullWidth maxWidth="md" open={isViewDialogOpen} onClose={handleViewClose}>
        <DialogContent sx={{ height: "auto" }}>{selectedImage && <img src={selectedImage} alt="Preview" style={{ width: "100%" }} />}</DialogContent>
        <DialogActions>
          <Button onClick={handleViewClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConcernDialog;
