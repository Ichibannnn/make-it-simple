import { LoadingButton } from "@mui/lab";
import { Autocomplete, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, IconButton, LinearProgress, Stack, TextField, Typography } from "@mui/material";
import { Close, CloseOutlined, FiberManualRecord, RestartAlt, ZoomIn, ZoomOut } from "@mui/icons-material";

import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import * as yup from "yup";
import moment from "moment";
import Swal from "sweetalert2";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { theme } from "../../../theme/theme";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getAttachmentIcon } from "../../../utils/getAttachmentIcon";
import { global } from "../../../styles/global";
import { formStyle as sx } from "./style/formStyle";

import { notificationApi } from "../../../features/api_notification/notificationApi";
import { notificationMessageApi } from "../../../features/api_notification_message/notificationMessageApi";
import { useLazyGetChannelsQuery } from "../../../features/api_channel_setup/channel/channelApi";
import { useLazyGetForTransferUsersQuery, useTransferIssueHandlerTicketsMutation } from "../../../features/api_ticketing/issue_handler/concernIssueHandlerApi";

const schema = yup.object().shape({
  TransferRemarks: yup.string().required().label("Remarks is required"),
  AddTransferAttachments: yup.array().nullable(),

  ChannelId: yup.object().required().label("Channel"),
  Transfer_To: yup.object().required().label("Issue handler"),
});

const TicketForTransferDialog = ({ data, open, onClose, viewOnClose }) => {
  const [attachments, setAttachments] = useState([]);

  const [selectedImage, setSelectedImage] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

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
  const userId = useSelector((state) => state?.user?.id);

  const [getChannel, { data: channelData, isLoading: channelIsLoading, isSuccess: channelIsSuccess }] = useLazyGetChannelsQuery();
  const [getIssueHandler, { isLoading: issueHandlerIsLoading, isSuccess: issueHandlerIsSuccess }] = useLazyGetForTransferUsersQuery();
  const [transferTicket, { isLoading: transferTicketIsLoading, isFetching: transferTicketIsFetching }] = useTransferIssueHandlerTicketsMutation();

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
      TransferRemarks: "",
      AddTransferAttachments: [],

      ChannelId: null,
      Transfer_To: null,
    },
  });

  const onSubmitAction = (formData) => {
    const payload = new FormData();

    payload.append("TicketConcernId", data?.ticketConcernId);
    payload.append("TransferRemarks", formData?.TransferRemarks);

    payload.append("TransferChannelId", formData?.ChannelId?.id);
    payload.append("Transfer_To", formData?.Transfer_To?.userId);

    // Attachments
    const files = formData.AddTransferAttachments;
    for (let i = 0; i < files.length; i++) {
      payload.append(`AddTransferAttachments[${i}].ticketAttachmentId`, "");
      payload.append(`AddTransferAttachments[${i}].attachment`, files[i]);
    }

    if (files.length === 0) {
      payload.append(`AddTransferAttachments[0].ticketAttachmentId`, "");
      payload.append(`AddTransferAttachments[0].attachment`, "");
    }

    console.log("Payload Entries: ", [...payload.entries()]);

    Swal.fire({
      title: "Confirmation",
      text: `Request to transfer this ticket number ${moment(data?.created_At).format("YYYY")}-${data?.ticketConcernId}?`,
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
        transferTicket(payload)
          .unwrap()
          .then(() => {
            toast.success("Success!", {
              description: "Transfer ticket successfully!",
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
      file,
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
      "AddTransferAttachments",
      watch("AddTransferAttachments").filter((file) => file.name !== fileNameToDelete.name),
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
      if (!channelIsSuccess) getChannel();

      setValue("ChannelId", {
        id: data?.channelId,
        channel_Name: data?.channel_Name,
      });

      getIssueHandler(data?.ticketConcernId);
      // getIssueHandler();
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
        sx={global.dialog}
        PaperProps={{ style: { overflow: "auto" } }}
      >
        <form onSubmit={handleSubmit(onSubmitAction)}>
          <DialogContent>
            {/* Ticket Number */}
            <Stack>
              <Typography sx={sx.titleText}>Transfer Ticket</Typography>
              <Typography sx={sx.captionText}>{` Ticket # ${moment(data?.created_At).format("YYYY")}-${data?.ticketConcernId}`}</Typography>
            </Stack>

            {/* Ticket Detail Section */}
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
              {/* Channel */}
              <Stack sx={sx.fieldOneColStack}>
                <Stack sx={sx.fieldTitleWithIconBox}>
                  <Typography sx={sx.fieldText}>Channel:</Typography>
                  <FiberManualRecord sx={sx.requiredDot} />
                </Stack>

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
                        renderInput={(params) => <TextField {...params} placeholder="Select Channel" sx={sx.autoComplete} />}
                        onOpen={() => {
                          if (!channelIsSuccess)
                            getChannel({
                              Status: true,
                            });
                        }}
                        onChange={(_, value) => {
                          onChange(value);
                          setValue("Transfer_To", null);
                        }}
                        getOptionLabel={(option) => option.channel_Name}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        fullWidth
                        disableClearable
                        componentsProps={sx.automCompleteProp}
                      />
                    );
                  }}
                />
              </Stack>

              {/* Transfer to */}
              <Stack sx={sx.fieldOneColStack}>
                <Stack sx={sx.fieldTitleWithIconBox}>
                  <Typography sx={sx.fieldText}>Transfer to:</Typography>
                  <FiberManualRecord sx={sx.requiredDot} />
                </Stack>

                <Controller
                  control={control}
                  name="Transfer_To"
                  render={({ field: { ref, value, onChange } }) => {
                    return (
                      <Autocomplete
                        ref={ref}
                        size="small"
                        value={value}
                        options={channelData?.value?.channel?.find((item) => item.id === watch("ChannelId")?.id)?.channelUsers || []}
                        loading={issueHandlerIsLoading}
                        renderInput={(params) => <TextField {...params} placeholder="Issue Handler" sx={sx.autoComplete} />}
                        onOpen={() => {
                          if (!issueHandlerIsSuccess) getIssueHandler();
                        }}
                        onChange={(_, value) => {
                          onChange(value);
                        }}
                        getOptionLabel={(option) => option.fullname}
                        isOptionEqualToValue={(option, value) => option?.userId === value?.userId}
                        getOptionDisabled={(option) => userId === option?.userId}
                        sx={{
                          flex: 2,
                        }}
                        componentsProps={sx.automCompleteProp}
                        fullWidth
                      />
                    );
                  }}
                />
              </Stack>

              {/* Transfer Remarks */}
              <Stack sx={sx.fieldOneColStack}>
                <Stack direction="row" sx={sx.fieldTitleWithIconBox}>
                  <Typography sx={sx.fieldText}>Transfer Remarks:</Typography>
                  <FiberManualRecord sx={sx.requiredDot} />
                </Stack>

                <Controller
                  control={control}
                  name="TransferRemarks"
                  render={({ field: { ref, value, onChange } }) => {
                    return <TextField inputRef={ref} size="medium" value={value} placeholder="Enter Remarks" onChange={onChange} autoComplete="off" rows={6} multiline sx={sx.textField} />;
                  }}
                />
              </Stack>

              {/* Attachments */}
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
                name="AddTransferAttachments"
                render={({ field: { onChange, value } }) => (
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".png,.jpg,.jpeg,.docx,.pdf,.xls,.xlsx"
                    onChange={(event) => {
                      handleAttachments(event);
                      const files = Array.from(event.target.files);
                      const uniqueNewFiles = files.filter((item) => !value.some((file) => file.name === item.name));

                      onChange([...value, ...uniqueNewFiles]);
                      fileInputRef.current.value = "";
                    }}
                    hidden
                    multiple
                  />
                )}
              />
            </Stack>
          </DialogContent>

          <DialogActions>
            <LoadingButton form="closeTicket" variant="contained" loading={transferTicketIsLoading || transferTicketIsFetching} onClick={onCloseHandler} sx={sx.cancelButton}>
              Cancel
            </LoadingButton>

            <LoadingButton
              type="submit"
              variant="contained"
              loading={transferTicketIsLoading || transferTicketIsFetching}
              disabled={!watch("TransferRemarks") || !watch("Transfer_To")}
              sx={{
                ":disabled": {
                  backgroundColor: theme.palette.secondary.main,
                  color: "black",
                },
              }}
            >
              Transfer
            </LoadingButton>
          </DialogActions>

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
        </form>
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

export default TicketForTransferDialog;

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
