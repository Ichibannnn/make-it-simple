import { LoadingButton } from "@mui/lab";
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, IconButton, LinearProgress, Stack, TextField, Typography, useMediaQuery } from "@mui/material";
import { Add, CheckOutlined, Close, CloseOutlined, FiberManualRecord, RestartAlt, ZoomIn, ZoomOut } from "@mui/icons-material";

import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import moment from "moment";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { theme } from "../../../theme/theme";
import { formStyle as sx } from "./style/formStyle";

import { useDispatch } from "react-redux";
import { notificationApi } from "../../../features/api_notification/notificationApi";
import { notificationMessageApi } from "../../../features/api_notification_message/notificationMessageApi";
import { useDeleteRequestorAttachmentMutation } from "../../../features/api_request/concerns/concernApi";
import { useHoldIssueHandlerTicketsMutation } from "../../../features/api_ticketing/issue_handler/concernIssueHandlerApi";

import OnHoldMenuActions from "./MenuActions/OnHoldMenuActions";
import getAttachmentIcon from "../../../utils/getAttachmentIcon";

const schema = yup.object().shape({
  ticketConcernId: yup.number(),
  Reason: yup.string().required().label("Resolution is required"),
  OnHoldAttachments: yup.array().nullable(),
});

const IssueHandlerHoldDialog = ({ data, open, onClose, viewOnClose }) => {
  const [attachments, setAttachments] = useState([]);
  const [ticketAttachmentId, setTicketAttachmentId] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null); // To handle the selected image
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false); // To control the view dialog

  // For viewing of attachment picture
  const [zoom, setZoom] = useState(1);
  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 4;
  const ZOOM_STEP = 0.25;

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const positionStartRef = useRef({ x: 0, y: 0 });

  const dispatch = useDispatch();
  const fileInputRef = useRef();
  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));
  // useSignalRConnection();

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
      ticketConcernId: "",
      Reason: "",
      OnHoldAttachments: [],
    },
  });

  const onSubmitAction = (formData) => {
    const payload = new FormData();

    payload.append("TicketConcernId", formData.ticketConcernId);
    payload.append("Reason", formData.Reason);

    // Attachments
    const files = formData.OnHoldAttachments;
    for (let i = 0; i < files.length; i++) {
      payload.append(`OnHoldAttachments[${i}].ticketAttachmentId`, "");
      payload.append(`OnHoldAttachments[${i}].attachment`, files[i]);
    }

    if (files.length === 0) {
      payload.append(`OnHoldAttachments[0].ticketAttachmentId`, "");
      payload.append(`OnHoldAttachments[0].attachment`, "");
    }

    Swal.fire({
      title: "Confirmation",
      text: `Requesting to hold this ticket number ${moment(data?.created_At).format("YYYY")}-${data?.ticketConcernId}?`,
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
        holdIssueHandlerTickets(payload)
          .unwrap()
          .then(() => {
            toast.success("Success!", {
              description: "Ticket submitted successfully!",
              duration: 1500,
            });

            dispatch(notificationApi.util.resetApiState());
            dispatch(notificationMessageApi.util.resetApiState());

            setAttachments([]);
            reset();
            viewOnClose();
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

  const handleDeleteFile = async (fileNameToDelete) => {
    setAttachments((prevFiles) => prevFiles.filter((fileName) => fileName !== fileNameToDelete));

    setValue(
      "OnHoldAttachments",
      watch("OnHoldAttachments").filter((file) => file.name !== fileNameToDelete.name),
    );
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleViewImage = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target.result);
      setZoom(1);
      setPosition({ x: 0, y: 0 });
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

  const onCloseHandler = () => {
    onClose();
    reset();
    setAttachments([]);
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

  useEffect(() => {
    if (data) {
      setValue("ticketConcernId", data?.ticketConcernId);
    }
  }, [data]);

  const handleZoomIn = () => setZoom((z) => Math.min(MAX_ZOOM, +(z + ZOOM_STEP).toFixed(2)));
  const handleZoomOut = () => setZoom((z) => Math.max(MIN_ZOOM, +(z - ZOOM_STEP).toFixed(2)));
  const handleZoomReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleWheelZoom = (event) => {
    event.preventDefault();
    if (event.deltaY < 0) handleZoomIn();
    else handleZoomOut();
  };

  useEffect(() => {
    if (zoom <= 1) setPosition({ x: 0, y: 0 });
  }, [zoom]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (event) => {
      const dx = event.clientX - dragStartRef.current.x;
      const dy = event.clientY - dragStartRef.current.y;
      setPosition({
        x: positionStartRef.current.x + dx,
        y: positionStartRef.current.y + dy,
      });
    };
    const handleMouseUp = () => setIsDragging(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleImageMouseDown = (event) => {
    if (zoom <= 1) return;
    event.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { x: event.clientX, y: event.clientY };
    positionStartRef.current = { ...position };
  };

  // Split into images (grid) vs everything else (row list), matching the target layout.
  const imageAttachments = attachments.filter((a) => isImageFile(a.name));
  const fileAttachments = attachments.filter((a) => !isImageFile(a.name));

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
          onCloseHandler();
        }}
        disableEscapeKeyDown={false}
        sx={{ borderRadius: "none", padding: 0, backdropFilter: "blur(5px)" }}
        PaperProps={{ style: { overflow: "auto" } }}
      >
        <DialogContent>
          <Stack>
            <Stack id="closeTicket" component="form" direction="row" gap={1} sx={{ width: "100%", height: "100%" }} onSubmit={handleSubmit(onSubmitAction)}>
              {/* Ticket Details */}

              <Stack sx={{ padding: 1, width: "100%" }}>
                {/* Ticket Number */}
                <Stack>
                  <Typography sx={sx.titleText}>Hold Ticket</Typography>
                  <Typography sx={sx.captionText}>{` Ticket # ${moment(data?.created_At).format("YYYY")}-${data?.ticketConcernId}`}</Typography>
                </Stack>

                {/*   Ticket Detail Section*/}

                <Stack sx={sx.detailBox}>
                  <Stack sx={sx.closeDetailContent}>
                    <Box sx={sx.titleDetailBox}>
                      <Typography sx={sx.detailTitleText}>Ticket Description:</Typography>
                    </Box>

                    <Box sx={sx.spacer} />

                    <Box sx={sx.descDetailBox}>
                      <Typography sx={sx.detailDescText}>
                        {data?.concern_Description?.split("\r\n").map((line, index) => (
                          <span key={index}>
                            {line}
                            <br />
                          </span>
                        ))}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>

                {/* Fields */}
                <Stack sx={sx.fieldSection}>
                  <Stack sx={sx.fieldOneColStack}>
                    {/* Reason */}
                    <Stack gap={0.5}>
                      <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
                        <Typography
                          sx={{
                            fontSize: "14px",
                          }}
                        >
                          Reason:
                        </Typography>
                        <FiberManualRecord color="error" sx={{ fontSize: "10px" }} />
                      </Stack>

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

                    {/* Attachment */}
                    <Stack sx={sx.fieldOneColStack} onDragOver={handleDragOver} onDrop={handleDrop}>
                      <Typography sx={sx.fieldText}>Attachment (Optional)</Typography>

                      <Stack sx={sx.attachmentDashedBorder} onDragOver={handleDragOver}>
                        <Box sx={sx.attachmentFileBox}>
                          <Button size="small" variant="contained" color="warning" onClick={handleUploadButtonClick}>
                            <Typography sx={sx.chooseFileText}>Choose File</Typography>
                          </Button>

                          <Typography sx={sx.fileExtText}>.docx, .jpg, .jpeg, .png, .pdf file</Typography>
                        </Box>

                        {/* Image thumbnails, grid layout */}
                        {imageAttachments.length > 0 && (
                          <Box sx={sx.imgAttachmentSection}>
                            {imageAttachments.map((fileName, index) => (
                              <ImageAttachmentCard key={`img-${index}`} fileName={fileName} onView={handleViewImage} onDelete={handleDeleteFile} />
                            ))}
                          </Box>
                        )}

                        {/* Non-image files, row list */}
                        {fileAttachments.length > 0 && (
                          <Stack sx={sx.fileAttachmentSection}>
                            {fileAttachments.map((fileName, index) => (
                              <FileAttachmentRow key={`file-${index}`} fileName={fileName} onDelete={handleDeleteFile} />
                            ))}
                          </Stack>
                        )}
                      </Stack>
                    </Stack>

                    <Controller
                      control={control}
                      name="OnHoldAttachments"
                      render={({ field: { onChange, value } }) => (
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".png,.jpg,.jpeg,.docx,.pdf,.xls,.xlsx"
                          onChange={(event) => {
                            handleAttachments(event);
                            const files = Array.from(event.target.files);
                            const uniqueNewFiles = files.filter((item) => !value.some((file) => file.name === item.name));

                            console.log("Controller Files: ", files);

                            onChange([...value, ...uniqueNewFiles]);
                            fileInputRef.current.value = "";
                          }}
                          hidden
                          multiple
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
            <LoadingButton type="submit" form="closeTicket" variant="contained" loading={holdIssueHandlerTicketsIsLoading || holdIssueHandlerTicketsIsFetching} disabled={!watch("Reason")}>
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

      {/* Dialog to view image */}
      <Dialog fullWidth maxWidth="md" open={isViewDialogOpen} onClose={handleViewClose}>
        <DialogContent sx={{ height: "auto", padding: 0 }}>
          <Box sx={{ position: "relative" }}>
            {/* Zoom controls */}
            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                zIndex: 1,
                backgroundColor: "rgba(0,0,0,0.6)",
                borderRadius: "20px",
                padding: "2px 6px",
              }}
            >
              <IconButton size="small" onClick={handleZoomOut} disabled={zoom <= MIN_ZOOM} sx={{ color: "#fff" }}>
                <ZoomOut fontSize="small" />
              </IconButton>

              <Typography
                sx={{
                  color: "#fff",
                  fontSize: "12px",
                  minWidth: 38,
                  textAlign: "center",
                }}
              >
                {Math.round(zoom * 100)}%
              </Typography>

              <IconButton size="small" onClick={handleZoomIn} disabled={zoom >= MAX_ZOOM} sx={{ color: "#fff" }}>
                <ZoomIn fontSize="small" />
              </IconButton>

              <IconButton size="small" onClick={handleZoomReset} sx={{ color: "#fff" }}>
                <RestartAlt fontSize="small" />
              </IconButton>
            </Stack>

            {/* Fixed viewport — no native scroll, so wheel events go straight to handleWheelZoom instead of competing with browser scroll. Panning is done manually via drag + CSS transform below. */}
            <Box
              onWheel={handleWheelZoom}
              sx={{
                width: "100%",
                height: "70vh",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#000",
              }}
            >
              {selectedImage && (
                <img
                  src={selectedImage}
                  alt="Preview"
                  onMouseDown={handleImageMouseDown}
                  draggable={false}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "70vh",
                    display: "block",
                    userSelect: "none",
                    transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                    transformOrigin: "center center",
                    transition: isDragging ? "none" : "transform 0.15s ease",
                    cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
                  }}
                />
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleViewClose} sx={sx.cancelButton}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default IssueHandlerHoldDialog;

const ImageAttachmentCard = ({ fileName, onView, onDelete }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const url = URL.createObjectURL(fileName.file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [fileName.file]);

  const ext = fileName.name.split(".").pop()?.toUpperCase();
  const showSpinner = !previewUrl || !imgLoaded;

  return (
    <Box sx={sx.imgAttachmentBox} onClick={() => onView(fileName.file)}>
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(fileName);
        }}
        sx={sx.imgIconButton}
      >
        <CloseOutlined sx={{ fontSize: 14, color: "#fff" }} />
      </IconButton>

      <Box sx={sx.imgContainer}>
        {previewUrl && (
          <Box component="img" src={previewUrl} alt={fileName.name} onLoad={() => setImgLoaded(true)} onError={() => setImgLoaded(true)} sx={{ ...sx.previewUrlBox, opacity: showSpinner ? 0 : 1 }} />
        )}

        {showSpinner && (
          <Box sx={sx.showSpinnerBox}>
            <CircularProgress size={20} thickness={4} sx={sx.circularProgress} />
          </Box>
        )}
      </Box>

      <Box sx={{ padding: "6px 8px", overflow: "hidden" }}>
        <Typography noWrap title={fileName.name} sx={sx.imgFileName}>
          {fileName.name}
        </Typography>
        <Typography noWrap sx={sx.imgFileSize}>
          {ext} · {fileName.size} MB
        </Typography>
      </Box>
    </Box>
  );
};

// One row for a non-image attachment (bottom list in the target design).
const FileAttachmentRow = ({ fileName, onDelete, uploadProgress }) => {
  const inProgress = typeof uploadProgress === "number" && uploadProgress < 100;

  return (
    <Box sx={sx.fileAttachmentBox}>
      <Box sx={sx.iconFile}>{getAttachmentIcon(fileName)}</Box>

      <Box sx={sx.fileNameBox}>
        <Typography noWrap sx={sx.fileNameText}>
          {fileName.name}
        </Typography>

        {inProgress ? (
          <Stack sx={sx.inProgressBox}>
            <LinearProgress variant="determinate" value={uploadProgress} sx={sx.linearProgress} />
            <Typography sx={sx.uploadProgressText}>{uploadProgress}%</Typography>
          </Stack>
        ) : (
          <Typography sx={sx.fileSizeText}>
            {fileName.name.split(".").pop()?.toUpperCase()} · {fileName.size} MB
          </Typography>
        )}
      </Box>

      <IconButton size="small" onClick={() => onDelete(fileName)}>
        <Close sx={sx.closeIconButton} />
      </IconButton>
    </Box>
  );
};
