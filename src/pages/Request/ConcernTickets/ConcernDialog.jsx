import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  CloseOutlined,
  DescriptionOutlined,
  Image,
  InsertPhotoOutlined,
  OutboundOutlined,
  PictureAsPdfOutlined,
  WallpaperOutlined,
} from "@mui/icons-material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { theme } from "../../../theme/theme";
import { LoadingButton } from "@mui/lab";
import { Toaster, toast } from "sonner";

import { useCreateEditRequestorConcernMutation } from "../../../features/api_request/concerns/concernApi";
import Dropzone, { useDropzone } from "react-dropzone";

const requestorSchema = yup.object().shape({
  RequestGeneratorId: yup.string().nullable(),
  Concern: yup.string().required().label("Concern Details"),
  RequestConcernId: yup.string().nullable(),
  RequestAttachmentsFiles: yup.array().nullable(),
});

const ConcernDialog = ({ open, onClose }) => {
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
    console.log("event: ", event);
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

  const onDrop = useCallback((acceptedFiles) => {
    // console.log("Accepted files: ", acceptedFiles);

    if (acceptedFiles?.length) {
      setAttachments((previousFiles) => [
        ...previousFiles,
        ...acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        ),
      ]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    // accept: { "image/*": [] },
  });

  const removeFile = (name) => {
    setAttachments((file) => file.filter((file) => file.name !== name));
  };

  console.log("Attachments: ", attachments);

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

                  {/* <div {...getRootProps()} className="drop-zone">
                    <input style={{ display: "none" }} {...getInputProps} />

                    {isDragActive ? (
                      <p>Drop the files here </p>
                    ) : (
                      <p>
                        Drag and drop some files here, or click to select files{" "}
                      </p>
                    )}
                  </div> */}

                  {/* UPLOADED FILES */}
                  {/* {attachments.length ? (
                    <div className="drop-zone">
                      <h3>Attached Files</h3>
                      <ul>
                        {attachments?.map((file) => {
                          <li key={file.name}>
                            <image
                              src={file.preview}
                              alt={file.name}
                              width={100}
                              height={100}
                              onLoad={() => {
                                URL.revokeObjectURL(file.preview);
                              }}
                              className="dropzone-image"
                            />
                            <button
                              type="button"
                              onClick={() => removeFile(file.name)}
                            >
                              <CloseOutlined />
                            </button>
                            <p>{file.name}</p>
                          </li>;
                        })}
                      </ul>
                    </div>
                  ) : (
                    ""
                  )} */}

                  <Box
                    sx={{
                      width: "80%",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "flex-start",
                      backgroundColor: theme.palette.bgForm.black1,
                      border: "2px dashed  #2D3748 ",
                      borderRadius: "10px",
                      minHeight: "100px",
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
                      <Box sx={{ display: "flex", gap: 2 }}>
                        {attachments.map((fileName, index) => (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              marginBottom: "2px",
                              padding: "5px",
                              background: theme.palette.bgForm.black2,
                              borderRadius: "5px",
                              maxWidth: "100%",
                              overflow: "hidden",
                            }}
                          >
                            <Stack
                              direction="column"
                              // justifyContent="center"
                              // alignItems="center"
                            >
                              <Stack
                                sx={{
                                  width: "100%",
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Box />
                                <IconButton
                                  size="sm"
                                  onClick={() => handleDeleteFile(fileName)}
                                  style={{
                                    marginLeft: "2px",
                                    background: "none",
                                  }}
                                >
                                  <CloseOutlined />
                                </IconButton>
                              </Stack>

                              <Box marginRight={1}>{getFileIcon(fileName)}</Box>
                              <Typography size={{ fontSize: "5px" }}>
                                {fileName}
                              </Typography>
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
