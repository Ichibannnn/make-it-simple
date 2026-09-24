import { useEffect, useRef, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, Divider, Stack, Typography } from "@mui/material";

import * as yup from "yup";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { theme } from "../../../theme/theme";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getAttachmentIcon } from "../../../utils/getAttachmentIcon";

const AddTicketDialog = ({ open, onClose }) => {
  const [attachments, setAttachments] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const requestorSchema = yup.object().shape({
    RequestAttachmentsFiles: yup.array().nullable(),
  });

  const fileInputRef = useRef();

  const { control, handleSubmit, setValue, watch } = useForm({
    resolver: yupResolver(requestorSchema),
    mode: "onChange",
    defaultValues: {
      RequestAttachmentsFiles: [],
    },
  });

  // Show Concern #1 initially
  useEffect(() => {
    if (fields.length === 0) {
      append("");
    }
  }, [fields, append]);

  const onConcernFormSubmit = (formData) => {
    const payload = new FormData();
    const files = formData.RequestAttachmentsFiles;
    for (let i = 0; i < files.length; i++) {
      console.log("i: ", i);

      payload.append(`RequestAttachmentsFiles[${i}].ticketAttachmentId`, "");
      payload.append(`RequestAttachmentsFiles[${i}].attachment`, files[i]);
    }

    if (files.length === 0) {
      payload.append(`RequestAttachmentsFiles[0].ticketAttachmentId`, "");
      payload.append(`RequestAttachmentsFiles[0].attachment`, "");
    }
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

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const onCloseAction = () => {
    setAttachments([]);
    onClose();
  };

  const handleViewImage = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target.result);
      setIsViewDialogOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteFile = (fileNameToDelete) => {
    setAttachments((prevFiles) => prevFiles.filter((fileName) => fileName !== fileNameToDelete));

    setValue(
      "RequestAttachmentsFiles",
      watch("RequestAttachmentsFiles").filter((file) => file.name !== fileNameToDelete.name),
    );
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
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={(event, reason) => {
          if (reason === "backdropClick") {
            event.stopPropagation();
            return;
          }
          onCloseAction();
        }}
        disableEscapeKeyDown={false}
        sx={{ borderRadius: "none", backdropFilter: "blur(5px)" }}
        PaperProps={{ style: { overflow: "auto" } }}
      >
        <form onSubmit={handleSubmit(onConcernFormSubmit)}>
          <DialogContent>
            <Stack direction="column">
              <Stack sx={{ width: "100%", padding: 1 }}>
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: theme.palette.success.main,
                  }}
                >
                  New Ticket
                </Typography>
                <Typography
                  sx={{
                    fontSize: "11px",
                    color: theme.palette.text.secondary,
                  }}
                >
                  Fill all information below.
                </Typography>
              </Stack>

              <Stack padding={1}>
                {/* ATTACHMENTS */}
                <Stack
                  width="100%"
                  sx={{
                    paddingTop: 2,
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography sx={{ fontSize: "11px" }}>Attachment (Optional)</Typography>
                  <Stack
                    sx={{
                      width: "100%",
                      display: "flex",
                      border: "2px dashed #2D3748",
                      justifyContent: "left",
                      padding: 1,
                    }}
                    onDragOver={handleDragOver}
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
                        <Typography sx={{ fontSize: "12px" }}>Choose File</Typography>
                      </Button>

                      <Typography
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: "11px",
                        }}
                      >
                        .docx, .jpg, .jpeg, .png, .pdf file
                      </Typography>
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
                            flexDirection: "row",
                            alignItems: "center",
                            padding: 1,
                            maxWidth: "100%",
                            overflow: "hidden",
                          }}
                        >
                          {getAttachmentIcon(fileName)}
                          <Box
                            sx={{
                              width: "100%",
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
                              <Typography sx={{ fontWeight: 500, fontSize: "11px" }}>{fileName.name}</Typography>

                              <Typography
                                sx={{
                                  fontSize: "11px",
                                  fontWeight: 500,
                                  color: theme.palette.text.secondary,
                                }}
                              >
                                {fileName.size} Mb
                              </Typography>

                              <Typography
                                sx={{
                                  fontSize: "11px",
                                  fontWeight: 500,
                                  color: theme.palette.success.main,
                                }}
                              >
                                Uploaded the file successfully
                              </Typography>
                            </Box>

                            <Box>
                              <ConcernMenuActions fileName={fileName} onView={handleViewImage} onDelete={handleDeleteFile} isImageFile={isImageFile} />
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
                        accept=".png,.jpg,.jpeg,.docx,.pdf,.xls,.xlsx"
                        style={{ display: "none" }}
                        multiple
                        type="file"
                        onChange={(event) => {
                          handleAttachments(event);
                          const files = Array.from(event.target.files);
                          const uniqueNewFiles = files.filter((item) => !value.some((file) => file.name === item.name));

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

          <DialogActions
            sx={{
              position: "sticky",
              bottom: 0,
              backgroundColor: theme.palette.bgForm.black3,
            }}
          >
            <LoadingButton
              variant="outlined"
              size="small"
              onClick={onCloseAction}
              sx={{
                ":disabled": {
                  backgroundColor: "none",
                  color: "black",
                },
              }}
            >
              <Typography sx={{ fontSize: "11px" }}>Cancel</Typography>
            </LoadingButton>

            <LoadingButton size="small" variant="contained" color="primary" type="submit">
              <Typography sx={{ fontSize: "11px" }}>Submit</Typography>
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

export default AddTicketDialog;
