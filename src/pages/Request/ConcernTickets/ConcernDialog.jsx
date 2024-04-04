import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  BorderColor,
  CloseOutlined,
  DeleteOutlineOutlined,
  DescriptionOutlined,
  InsertPhotoOutlined,
  PanoramaOutlined,
  PictureAsPdfOutlined,
  SaveOutlined,
  SyncOutlined,
  WallpaperOutlined,
} from "@mui/icons-material";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { theme } from "../../../theme/theme";
import { LoadingButton } from "@mui/lab";
import { Toaster, toast } from "sonner";

import { useCreateEditRequestorConcernMutation } from "../../../features/api_request/concerns/concernApi";

const requestorSchema = yup.object().shape({
  RequestGeneratorId: yup.string().nullable(),
  Concern: yup.string().required().label("Concern Details"),
  RequestConcernId: yup.string().nullable(),
  RequestAttachmentsFiles: yup.array().nullable(),
});

const ConcernDialog = ({ open, onClose, isSuccess }) => {
  const [attachments, setAttachments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef();

  const [
    createEditRequestorConcern,
    {
      isLoading: isCreateEditRequestorConcernLoading,
      isFetching: isCreateEditRequestorConcernFetching,
    },
  ] = useCreateEditRequestorConcernMutation();

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
      RequestGeneratorId: "",
      Concern: "",
      RequestConcernId: "",
      RequestAttachmentsFiles: [],
    },
  });

  const onConcernFormSubmit = (formData) => {
    setIsLoading(true);
    const payload = new FormData();

    payload.append("Concern", formData.Concern);

    const files = formData.RequestAttachmentsFiles;
    for (let i = 0; i < files.length; i++) {
      payload.append(`RequestAttachmentsFiles[${i}].ticketAttachmentId`, "");
      payload.append(`RequestAttachmentsFiles[${i}].attachment`, files[i]);
    }

    console.log("Payload: ", payload);

    createEditRequestorConcern(payload)
      .unwrap()
      .then(() => {
        toast.success("Success!", {
          description: "Concern added successfully!",
          duration: 1500,
        });
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

    // fetch("https://localhost:44355/api/request-concern/add-request-concern", {
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    //   method: "POST",
    //   body: payload,
    // })
    //   .then((res) => {
    //     console.log("success: ", res);
    //     toast.success("Success!", {
    //       description: "Concern added successfully!",
    //       duration: 1500,
    //     });
    //     setAttachments([]);
    //     reset();
    //     onClose();
    //   })
    //   .catch((err) => {
    //     console.log("error: ", err);
    //     toast.error("Error!", {
    //       description: err.data,
    //       duration: 1500,
    //     });
    //   });

    //   createEditRequestorConcern(newData)
    //     .unwrap()
    //     .then(() => {
    //       toast.success("Success!", {
    //         description: "Concern added successfully!",
    //         duration: 1500,
    //       });
    //       setAttachments([]);
    //       reset();
    //       onClose();
    //     })
    //     .catch((error) => {
    //       console.log("errors: ", error);
    //       toast.error("Error!", {
    //         description: error.data,
    //         duration: 1500,
    //       });
    //     });
  };

  const handleAttachments = (event) => {
    // console.log("event: ", event);
    const newFiles = Array.from(event.target.files);
    const fileNames = newFiles.map((file) => file.name);
    setAttachments((prevFiles) => [...prevFiles, ...fileNames]);
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleDeleteFile = (fileNameToDelete) => {
    setAttachments((prevFiles) =>
      prevFiles.filter((fileName) => fileName !== fileNameToDelete)
    );

    setValue(
      "RequestAttachmentsFiles",
      watch("RequestAttachmentsFiles").filter(
        (file) => file.name !== fileNameToDelete
      )
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
      .map((file) => file.name);
    const uniqueNewFiles = fileNames.filter(
      (fileName) => !attachments.includes(fileName)
    );
    setAttachments([...attachments, ...uniqueNewFiles]);
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    const iconMap = {
      png: <WallpaperOutlined />,
      jpg: <InsertPhotoOutlined />,
      pdf: <PictureAsPdfOutlined />,
      docx: <DescriptionOutlined />,
    };
    return iconMap[extension] || null;
  };

  const onCloseAction = () => {
    onClose();
    reset();
    setAttachments([]);
  };

  // console.log("Attachments: ", attachments);
  console.log("errors: ", errors);

  return (
    <>
      <Toaster richColors position="top-right" closeButton />
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        sx={{ borderRadius: "none", padding: 0 }}
        PaperProps={{ style: { overflow: "unset" } }}
      >
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
                    Add Concern
                  </Typography>
                </Stack>
              </Stack>

              {/* <Divider variant="fullWidth" sx={{ background: "#2D3748" }} /> */}

              <Stack padding={5} gap={3}>
                <Stack
                  direction="row"
                  width="100%"
                  sx={{
                    paddingTop: 2,
                    gap: 2,
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography>Concern Details*</Typography>

                  <Controller
                    control={control}
                    name="Concern"
                    render={({ field: { ref, value, onChange } }) => {
                      return (
                        <TextField
                          inputRef={ref}
                          size="small"
                          value={value}
                          placeholder="Ex. System Name - Concern"
                          onChange={onChange}
                          sx={{
                            width: "80%",
                          }}
                          autoComplete="off"
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

                  <Box
                    sx={{
                      width: "80%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      backgroundColor: theme.palette.bgForm.black1,
                      border: "2px dashed  #2D3748 ",
                      borderRadius: "10px",
                      minHeight: "200px",
                      paddingLeft: 2,
                      paddingTop: 2,
                      cursor: "pointer",
                      position: "relative",
                      overflowY: "auto",
                    }}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    {!attachments.length ? (
                      <Box className="upload-file">
                        <Typography>Upload your attachments</Typography>
                      </Box>
                    ) : (
                      <Box>
                        {attachments.map((fileName, index) => (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "2px",
                              padding: "5px",
                              background: theme.palette.bgForm.black2,
                              borderRadius: "5px",
                              maxWidth: "100%",
                              overflow: "hidden",
                            }}
                          >
                            <Box marginRight={1}>{getFileIcon(fileName)}</Box>

                            <Stack
                              width="100%"
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Typography size={{ fontSize: "5px" }}>
                                {fileName}
                              </Typography>
                              <IconButton
                                aria-label="delete"
                                onClick={() => handleDeleteFile(fileName)}
                                style={{ marginLeft: "2px" }}
                              >
                                <CloseOutlined />
                              </IconButton>
                            </Stack>
                          </div>
                        ))}
                      </Box>
                    )}
                  </Box>

                  <Controller
                    control={control}
                    name="RequestAttachmentsFiles"
                    render={({ field: { onChange } }) => (
                      <input
                        ref={fileInputRef}
                        accept=".png,.jpg,.jpeg,.docx,"
                        style={{ display: "none" }}
                        multiple
                        type="file"
                        onChange={(event) => {
                          handleAttachments(event);

                          const files = Array.from(event.target.files);
                          onChange(files);
                        }}
                      />
                    )}
                  />
                  {/* <input
                    ref={fileInputRef}
                    accept=".png,.jpg,.jpeg,.docx,"
                    style={{ display: "none" }}
                    multiple
                    type="file"
                    onChange={handleAttachments}
                  /> */}
                </Stack>

                <Box
                  width="100%"
                  sx={{
                    display: "flex",
                    justifyContent: "right",
                    paddingTop: 2,
                  }}
                >
                  <Button
                    size="small"
                    variant="contained"
                    color="warning"
                    onClick={handleUploadButtonClick}
                  >
                    Choose file
                  </Button>
                </Box>
              </Stack>
            </Stack>
          </DialogContent>

          <DialogActions>
            <LoadingButton
              size="large"
              variant="contained"
              color="primary"
              type="submit"
              loading={
                isCreateEditRequestorConcernLoading ||
                isCreateEditRequestorConcernFetching ||
                isLoading
              }
              disabled={!watch("Concern") || !attachments.length}
            >
              Save
            </LoadingButton>
            <Button variant="text" onClick={onCloseAction}>
              Close
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default ConcernDialog;
