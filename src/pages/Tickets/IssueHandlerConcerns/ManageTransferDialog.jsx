import { LoadingButton } from "@mui/lab";
import { Autocomplete, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, IconButton, Stack, TextField, Tooltip, Typography, useMediaQuery } from "@mui/material";
import {
  Add,
  AttachFile,
  AttachFileOutlined,
  CheckOutlined,
  Close,
  FiberManualRecord,
  FileDownloadOutlined,
  RemoveCircleOutline,
  RestartAlt,
  VisibilityOutlined,
  ZoomIn,
  ZoomOut,
} from "@mui/icons-material";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { toast } from "sonner";
import { theme } from "../../../theme/theme";
import Swal from "sweetalert2";
import { useDeleteRequestorAttachmentMutation } from "../../../features/api_request/concerns/concernApi";
import { useTransferIssueHandlerTicketsMutation } from "../../../features/api_ticketing/issue_handler/concernIssueHandlerApi";
import { useLazyGetDownloadAttachmentQuery, useLazyGetViewAttachmentQuery } from "../../../features/api_attachments/attachmentsApi";
import { useLazyGetChannelsQuery } from "../../../features/api_channel_setup/channel/channelApi";
import moment from "moment";
import { global } from "../../../styles/global";
import { formStyle as sx } from "./style/formStyle";
import getAttachmentIcon from "../../../utils/getAttachmentIcon";
import ManageTransferMenuActions from "./MenuActions/ManageTransferMenuActions";
import { confirmDeleteAttachment } from "../../../utils/sweetAlert";

const schema = yup.object().shape({
  TransferTicketId: yup.number(),
  TicketConcernId: yup.number(),
  TransferRemarks: yup.string().required().label("Remarks is required"),
  AddTransferAttachments: yup.array().nullable(),

  ChannelId: yup.object().required().label("Channel"),
  Transfer_To: yup.object().required().label("Issue handler"),
});

const EXT_TO_MIME = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
};

const ImageAttachmentPreviewCard = ({ fileName, onView, menu, isOpening }) => {
  const [getAttachmentPreview] = useLazyGetViewAttachmentQuery();
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewError, setPreviewError] = useState(false);
  const ext = fileName.name?.split(".").pop()?.toLowerCase();

  useEffect(() => {
    let cancelled = false;
    let objectUrl;

    setPreviewUrl(null);
    setPreviewError(false);

    (async () => {
      try {
        // New, not-yet-saved file
        if (fileName.file instanceof File) {
          objectUrl = URL.createObjectURL(fileName.file);
          setPreviewUrl(objectUrl);
          return;
        }

        // Neither a File nor a saved id (e.g. added by drag & drop) -> icon fallback
        if (!fileName.ticketAttachmentId) {
          setPreviewError(true);
          return;
        }

        // Saved attachment from a previous submit
        const response = await getAttachmentPreview(fileName.ticketAttachmentId);
        if (cancelled) return;

        if (response?.data) {
          const mime = EXT_TO_MIME[ext] || response.data.type || "application/octet-stream";
          objectUrl = URL.createObjectURL(new Blob([response.data], { type: mime }));
          setPreviewUrl(objectUrl);
        } else {
          setPreviewError(true);
        }
      } catch (error) {
        console.error("Thumbnail preview error:", error);
        if (!cancelled) setPreviewError(true);
      }
    })();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [fileName.file, fileName.ticketAttachmentId, ext, getAttachmentPreview]);

  return (
    <Box
      sx={{
        position: "relative",
        width: 120,
        height: 116,
        borderRadius: "10px",
        overflow: "hidden",
        border: "1px solid #2D3748",
        backgroundColor: theme.palette.bgForm?.black3 || "#1A202C",
        cursor: isOpening ? "wait" : "pointer",
      }}
      onClick={() => {
        // Ignore extra clicks while the full-size version is already being fetched
        if (isOpening) return;
        onView(fileName, previewUrl);
      }}
    >
      {/* Existing menu, repositioned as an overlay. stopPropagation keeps menu clicks
          (including the portaled MenuItems) from also opening the preview. */}
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          position: "absolute",
          top: 2,
          right: 2,
          zIndex: 2,
          display: "flex",
          borderRadius: "50%",
          backgroundColor: "rgba(0,0,0,0.55)",
        }}
      >
        {menu}
      </Box>

      <Box sx={{ position: "relative", zIndex: 1, width: "100%", height: 80, backgroundColor: "rgba(255,255,255,0.04)" }}>
        {previewUrl && !previewError && (
          <Box component="img" src={previewUrl} alt={fileName.name} onError={() => setPreviewError(true)} sx={{ width: "100%", height: 80, objectFit: "cover", display: "block" }} />
        )}

        {!previewUrl && !previewError && (
          <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CircularProgress size={20} thickness={4} sx={{ color: theme.palette.text.secondary }} />
          </Box>
        )}

        {previewError && <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>{getAttachmentIcon(fileName)}</Box>}

        {isOpening && (
          <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <CircularProgress size={22} thickness={4} sx={{ color: "#fff" }} />
          </Box>
        )}
      </Box>

      <Box sx={{ padding: "6px 8px", overflow: "hidden" }}>
        <Typography
          noWrap
          title={fileName.name}
          sx={{
            fontSize: "11px",
            fontWeight: 500,
            color: theme.palette.text.main,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "block",
          }}
        >
          {fileName.name}
        </Typography>

        <Stack direction="row" alignItems="center" gap={0.5}>
          <Typography noWrap sx={{ fontSize: "10px", color: theme.palette.text.secondary, minWidth: 0 }}>
            {ext?.toUpperCase()} · {fileName.size} MB
          </Typography>
          {/* Small check = already saved from a previous submit */}
          {!!fileName.ticketAttachmentId && <CheckOutlined color="success" sx={{ fontSize: 12 }} titleAccess="Attached file" />}
        </Stack>
      </Box>
    </Box>
  );
};

const ManageTransferDialog = ({ data, open, onClose, refetch }) => {
  const [attachments, setAttachments] = useState([]);
  const [ticketAttachmentId, setTicketAttachmentId] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null); // To handle the selected image
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false); // To control the view dialog

  const [viewIsLoading, setViewIsLoading] = useState(false);

  // Which saved attachment is being fetched for the full-size viewer (spinner on that thumbnail)
  const [loadingAttachmentId, setLoadingAttachmentId] = useState(null);
  const [downloadIsLoading, setDownloadIsLoading] = useState(false);
  const [deletedAttachmentIds, setDeletedAttachmentIds] = useState([]);

  const [isSaving, setIsSaving] = useState(false);

  // --- Zoom / pan state for the image viewer (same behavior as IssueViewDialog) ---
  const [zoom, setZoom] = useState(1);
  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 4;
  const ZOOM_STEP = 0.25;
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const positionStartRef = useRef({ x: 0, y: 0 });

  const fileInputRef = useRef();
  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));

  const [getChannel, { data: channelData, isLoading: channelIsLoading, isSuccess: channelIsSuccess }] = useLazyGetChannelsQuery();
  const [getIssueHandler, { data: issueHandlerData, isLoading: issueHandlerIsLoading, isSuccess: issueHandlerIsSuccess }] = useLazyGetChannelsQuery();

  const [getViewAttachment] = useLazyGetViewAttachmentQuery();
  const [getDownloadAttachment] = useLazyGetDownloadAttachmentQuery();
  const [manageTransferTickets] = useTransferIssueHandlerTicketsMutation();
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
      TransferTicketId: "",
      TicketConcernId: "",
      TransferRemarks: "",
      AddTransferAttachments: [],

      ChannelId: null,
      Transfer_To: null,
    },
  });

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
    const isSavedAttachment = Boolean(fileNameToDelete.ticketAttachmentId);

    // Only saved attachments (from the API) need confirmation
    if (isSavedAttachment) {
      const confirmed = await confirmDeleteAttachment({
        title: "Remove Attachment?",
        message: "Are you sure you want to remove this attachment?",
        note: "Note: The deletion will only take effect after you save your changes.",
        confirmText: "Remove",
        cancelText: "Cancel",
        // icon: "📎",
      });

      if (!confirmed) return;

      // Queue it for deletion. The DELETE API is called in onSubmitAction.
      setDeletedAttachmentIds((prev) => (prev.includes(fileNameToDelete.ticketAttachmentId) ? prev : [...prev, fileNameToDelete.ticketAttachmentId]));
    }

    // UI/form cleanup for both saved and newly added files
    setAttachments((prev) => prev.filter((f) => (isSavedAttachment ? f.ticketAttachmentId !== fileNameToDelete.ticketAttachmentId : f !== fileNameToDelete)));

    setValue(
      "AddTransferAttachments",
      watch("AddTransferAttachments").filter((file) => file.name !== fileNameToDelete.name),
    );

    // try {
    //   if (fileNameToDelete.ticketAttachmentId) {
    //     const deletePayload = {
    //       ticketAttachmentId: fileNameToDelete.ticketAttachmentId,
    //     };
    //     await deleteRequestorAttachment(deletePayload)
    //       .unwrap()
    //       .then(() => {
    //         toast.success("Success!", {
    //           description: "File deleted successfully.",
    //           duration: 1500,
    //         });
    //         refetch();
    //       })
    //       .catch((err) => {
    //         console.log("error: ", err);
    //         toast.error("Error!", {
    //           description: err.data.error.message,
    //           duration: 1500,
    //         });
    //       });
    //   }

    //   setAttachments((prevFiles) => prevFiles.filter((fileName) => fileName !== fileNameToDelete));

    //   setValue(
    //     "AddTransferAttachments",
    //     watch("AddTransferAttachments").filter((file) => file.name !== fileNameToDelete.name),
    //   );
    // } catch (error) {}
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

  const onSubmitAction = (formData) => {
    Swal.fire({
      title: "Confirmation",
      text: `Edit transfer ticket number ${moment(data?.created_At).format("YYYY")}-${data?.ticketConcernId}?`,
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
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      const payload = new FormData();

      payload.append("TransferTicketId", formData.TransferTicketId);
      payload.append("TicketConcernId", formData.TicketConcernId);
      payload.append("TransferRemarks", formData.TransferRemarks);

      payload.append("TransferChannelId", formData?.ChannelId?.id);
      payload.append("Transfer_To", formData?.Transfer_To?.userId);

      // Attachments
      const files = formData.AddTransferAttachments;
      for (let i = 0; i < files.length; i++) {
        payload.append(`AddTransferAttachments[${i}].ticketAttachmentId`, files[i].ticketAttachmentId || "");
        payload.append(`AddTransferAttachments[${i}].attachment`, files[i]);
      }

      if (files.length === 0) {
        payload.append(`AddTransferAttachments[0].ticketAttachmentId`, "");
        payload.append(`AddTransferAttachments[0].attachment`, "");
      }

      // console.log("Payload Entries: ", [...payload.entries()]);
      const idsToDelete = [...deletedAttachmentIds];
      setIsSaving(true);

      try {
        // API 1: save the tickets
        manageTransferTickets(payload).unwrap();

        // API 2: delete removed attachments
        let failedCount = 0;

        for (const id of idsToDelete) {
          try {
            await deleteRequestorAttachment({ ticketAttachmentId: id }).unwrap();
          } catch (err) {
            failedCount++;
            console.error("Delete failed:", id, err);
          }
        }

        if (failedCount > 0) {
          toast.error("Error!", {
            description: `${failedCount} attachment(s) could not be deleted.`,
            duration: 2500,
          });
        }

        if (idsToDelete.length > 0) {
          await refetch();
        }

        toast.success("Success!", {
          description: "Transfer updated successfully!",
          duration: 1500,
        });

        reset();
        setAttachments([]);
        setDeletedAttachmentIds([]);
        setIsSaving(false);
        onClose();
      } catch (err) {
        toast.error("Error!", {
          description: err?.data?.error?.message || "Something went wrong while saving.",
          duration: 1500,
        });
        setIsSaving(false);
      } finally {
        setIsSaving(false);
      }

      // Old payload
      // manageTransferTickets(payload)
      //   .unwrap()
      //   .then(async () => {
      //     // Ticket saved successfully -> now delete the attachments the user removed
      //     if (idsToDelete.length > 0) {
      //       const results = await Promise.allSettled(idsToDelete.map((id) => deleteRequestorAttachment({ ticketAttachmentId: id }).unwrap()));

      //       const failedCount = results.filter((r) => r.status === "rejected").length;
      //       if (failedCount > 0) {
      //         toast.error("Error!", {
      //           description: `${failedCount} attachment(s) could not be deleted.`,
      //           duration: 2500,
      //         });
      //       }

      //       refetch();
      //     }

      //     toast.success("Success!", {
      //       description: "Transfer updated successfully!",
      //       duration: 1500,
      //     });

      //     setAttachments([]);
      //     setDeletedAttachmentIds([]);
      //     reset();
      //     onClose();
      //   })
      //   .catch((err) => {
      //     toast.error("Error!", {
      //       description: err.data.error.message,
      //       duration: 1500,
      //     });
      //   });
    });
  };

  const onCloseHandler = () => {
    reset();
    setAttachments([]);
    setDeletedAttachmentIds([]);
    setIsSaving(false);
    onClose();
  };

  useEffect(() => {
    if (data) {
      setValue("TransferTicketId", data?.getForTransferTickets?.[0]?.transferTicketConcernId);
      setValue("TicketConcernId", data?.ticketConcernId);
      setValue("TransferRemarks", data?.getForTransferTickets?.[0]?.transfer_Remarks);

      setValue("ChannelId", {
        id: data?.transferChannelId,
        channel_Name: data?.transfer_Channel_Name,
      });

      setValue("Transfer_To", {
        userId: data?.getForTransferTickets?.[0]?.transfer_To,
        fullname: data?.getForTransferTickets?.[0]?.transfer_To_Name,
      });

      const manageTransferTicketArray = data?.getForTransferTickets?.map((item) =>
        item?.getAttachmentForTransferTickets?.map((subItem) => {
          return {
            ticketAttachmentId: subItem.ticketAttachmentId,
            name: subItem.fileName,
            size: (subItem.fileSize / (1024 * 1024)).toFixed(2),
            link: subItem.attachment,
          };
        }),
      );

      setAttachments(
        manageTransferTicketArray?.[0]?.map((item) => ({
          ticketAttachmentId: item.ticketAttachmentId,
          name: item.name,
          size: item.size,
          link: item.link,
        })),
      );
    }
  }, [data]);

  // Function to open image view dialog
  const handleViewImage = async (file) => {
    setViewIsLoading(true);
    setLoadingAttachmentId(file?.ticketAttachmentId);
    try {
      const response = await getViewAttachment(file?.ticketAttachmentId);

      if (response?.data) {
        const imageUrl = URL.createObjectURL(response.data); // Create a URL for the fetched image
        setSelectedImage(imageUrl); // Set the image URL to state
        setZoom(1);
        setPosition({ x: 0, y: 0 });
        setIsViewDialogOpen(true);
      }
      setViewIsLoading(false);
      setLoadingAttachmentId(null);
    } catch (error) {
      toast.error("Error!", {
        description: "View file error!",
        duration: 1500,
      });
      setViewIsLoading(false);
      setLoadingAttachmentId(null);
    }
  };

  const handleViewImageWithoutId = (file) => {
    try {
      const reader = new FileReader();

      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setZoom(1);
        setPosition({ x: 0, y: 0 });
        setIsViewDialogOpen(true);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  const handleDownloadAttachment = async (file) => {
    setDownloadIsLoading(true);
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
        setDownloadIsLoading(false);
      }
    } catch (error) {
      toast.error("Error!", {
        description: "Download file error!",
        duration: 1500,
      });
      setDownloadIsLoading(false);
    }
  };

  const handleViewClose = () => {
    setIsViewDialogOpen(false);
    setSelectedImage(null);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  // --- Zoom / pan handlers ---
  const handleZoomIn = () => setZoom((z) => Math.min(MAX_ZOOM, +(z + ZOOM_STEP).toFixed(2)));
  const handleZoomOut = () => setZoom((z) => Math.max(MIN_ZOOM, +(z - ZOOM_STEP).toFixed(2)));
  const handleZoomReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  // React attaches wheel listeners as passive, so preventDefault() isn't allowed here;
  // the dialog already locks page scroll, so it isn't needed.
  const handleWheelZoom = (event) => {
    if (event.deltaY < 0) handleZoomIn();
    else handleZoomOut();
  };

  // Snap the pan offset back to center whenever zoom returns to 100% or below.
  useEffect(() => {
    if (zoom <= 1) setPosition({ x: 0, y: 0 });
  }, [zoom]);

  // Dragging to pan: only active once zoomed in. Listens on window so a drag
  // that ends outside the image still releases cleanly.
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

  const isImageFile = (fileName) => {
    return /\.(jpg|jpeg|png)$/i.test(fileName);
  };

  const imageAttachments = attachments?.filter((f) => isImageFile(f.name)) ?? [];
  const otherAttachments = attachments?.filter((f) => !isImageFile(f.name)) ?? [];

  const renderMenu = (fileName, compact = false) => (
    <ManageTransferMenuActions
      data={data}
      fileName={fileName}
      onView={handleViewImage}
      onViewWithoutId={handleViewImageWithoutId}
      onDelete={handleDeleteFile}
      onDownload={handleDownloadAttachment}
      isImageFile={isImageFile}
      viewIsLoading={viewIsLoading}
      downloadIsLoading={downloadIsLoading}
      compact={compact}
    />
  );

  // Thumbnail click: reuse the already-loaded thumbnail image when we have it (instant, no
  // second request); otherwise fall back to the original view handlers.
  const handleOpenThumbnail = (fileName, src) => {
    if (src) {
      setSelectedImage(src);
      setZoom(1);
      setPosition({ x: 0, y: 0 });
      setIsViewDialogOpen(true);
    } else if (fileName.file) {
      handleViewImageWithoutId(fileName.file);
    } else if (fileName.ticketAttachmentId) {
      handleViewImage(fileName);
    }
  };

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={(event, reason) => {
          if (isSaving) return;
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
        <DialogContent>
          <Stack>
            <Stack id="closeticket" component="form" direction="row" gap={1} sx={{ width: "100%", height: "100%" }} onSubmit={handleSubmit(onSubmitAction)}>
              <Stack sx={{ padding: 1, width: "100%" }}>
                {/* Ticket Details */}
                <Stack>
                  <Typography sx={sx.titleText}>Manage Transfer</Typography>
                  <Stack sx={sx.manageTicketBox}>
                    <Typography sx={sx.captionText}>{` Ticket # ${moment(data?.created_At).format("YYYY")}-${data?.ticketConcernId}`}</Typography>
                  </Stack>
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
                    <Typography sx={sx.fieldText}>Channel:</Typography>
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
                              getIssueHandler({
                                Status: true,
                              });
                            }}
                            getOptionLabel={(option) => option.channel_Name}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            fullWidth
                            disablePortal
                            disabled
                            disableClearable
                            componentsProps={sx.automCompleteProp}
                          />
                        );
                      }}
                    />
                  </Stack>

                  {/* Transfer to */}
                  <Stack sx={sx.fieldOneColStack}>
                    <Typography sx={sx.fieldText}>Transfer to:</Typography>
                    <Controller
                      control={control}
                      name="Transfer_To"
                      render={({ field: { ref, value, onChange } }) => {
                        return (
                          <Autocomplete
                            ref={ref}
                            size="small"
                            value={value}
                            options={issueHandlerData?.value?.channel?.find((item) => item.id === watch("ChannelId")?.id)?.channelUsers || []}
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
                            fullWidth
                            disabled
                            disableClearable
                            componentsProps={sx.automCompleteProp}
                          />
                        );
                      }}
                    />
                  </Stack>

                  {/* Transfer Remarks */}
                  <Stack sx={sx.fieldOneColStack}>
                    <Stack sx={sx.fieldTitleWithIconBox}>
                      <Typography sx={sx.fieldText}>Transfer Remarks:</Typography>
                      <FiberManualRecord sx={sx.requiredDot} />
                    </Stack>

                    <Controller
                      control={control}
                      name="TransferRemarks"
                      render={({ field: { ref, value, onChange } }) => {
                        return (
                          <TextField
                            inputRef={ref}
                            size="medium"
                            value={value}
                            placeholder="Enter Remarks"
                            onChange={onChange}
                            autoComplete="off"
                            rows={6}
                            multiline
                            InputProps={sx.textFieldInputProps}
                            InputLabelProps={sx.textFieldLabelProps}
                            sx={{ "& .MuiInputBase-input": { fontSize: "14px" } }}
                          />
                        );
                      }}
                    />
                  </Stack>

                  {/* Attachments */}
                  <Stack>
                    <Stack onDragOver={handleDragOver} onDrop={handleDrop}>
                      <Stack
                        padding={2}
                        sx={{
                          border: "1px solid #2D3748",
                          borderRadius: "10px",
                          minHeight: "155px",
                          gap: 1.5,
                        }}
                      >
                        <Stack sx={sx.attachmentTextBox}>
                          <AttachFile sx={sx.titleHeaderMutedIcon} />
                          <Typography sx={sx.detailTitleText}>Attachment(s):</Typography>

                          {data?.getForTransferTickets?.[0]?.isApprove === false && (
                            <Button size="small" variant="contained" color="warning" onClick={handleUploadButtonClick} sx={sx.addAttachmentBtn}>
                              <Typography sx={{ fontSize: "11.5px", fontWeight: 500 }}>Add File</Typography>
                            </Button>
                          )}
                        </Stack>

                        {!attachments?.length ? (
                          <Stack sx={sx.noAttachmentSection}>
                            <Stack sx={sx.noAttachmentContent}>
                              <AttachFileOutlined sx={sx.noAttachmentIcon} />
                              <Typography sx={sx.noAttachmentText}>No attached file</Typography>
                            </Stack>
                          </Stack>
                        ) : (
                          <Stack sx={{ gap: 1.5 }}>
                            {/* Image thumbnails, grid layout */}
                            {imageAttachments.length > 0 && (
                              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                                {imageAttachments.map((fileName, index) => (
                                  <ImageAttachmentPreviewCard
                                    key={fileName.ticketAttachmentId ?? `${fileName.name}-${index}`}
                                    fileName={fileName}
                                    onView={handleOpenThumbnail}
                                    menu={renderMenu(fileName, true)}
                                    isOpening={!!fileName.ticketAttachmentId && loadingAttachmentId === fileName.ticketAttachmentId}
                                  />
                                ))}
                              </Box>
                            )}

                            {/* Non-image files, row list */}
                            {otherAttachments.map((fileName, index) => (
                              <Box key={fileName.ticketAttachmentId ?? `${fileName.name}-${index}`} sx={sx.fileAttachmentBox}>
                                {getAttachmentIcon(fileName)}
                                <Box sx={sx.attachmentAndMenuBox}>
                                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                                    <Typography sx={sx.fileNameText}>{fileName.name}</Typography>
                                    <Typography sx={sx.fileSizeText}>{fileName.size} Mb</Typography>
                                    <Box sx={sx.fileDescWithIconBox}>
                                      <Typography
                                        sx={{
                                          fontSize: "12px",
                                          fontWeight: 500,
                                          color: !!fileName.ticketAttachmentId ? theme.palette.success.main : theme.palette.primary.main,
                                        }}
                                      >
                                        {!!fileName.ticketAttachmentId ? "Attached file" : "Uploaded the file successfully"}
                                      </Typography>

                                      {!!fileName.ticketAttachmentId && <CheckOutlined color="success" sx={{ fontSize: "12px" }} />}
                                    </Box>
                                  </Box>

                                  <Box>{renderMenu(fileName)}</Box>
                                </Box>
                              </Box>
                            ))}
                          </Stack>
                        )}
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

                                const uniqueNewFiles = files.filter((item) => !value?.some((file) => file.name === item.name));

                                onChange([...value, ...uniqueNewFiles]);
                                fileInputRef.current.value = "";
                              }
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
          </Stack>
        </DialogContent>

        <DialogActions>
          <LoadingButton form="closeTicket" variant="contained" loading={isSaving} onClick={onCloseHandler} sx={sx.cancelButton}>
            Cancel
          </LoadingButton>

          {data?.getForTransferTickets?.[0]?.isApprove === false && (
            <LoadingButton type="submit" form="closeticket" variant="contained" loading={isSaving} disabled={!watch("TransferRemarks")}>
              Save
            </LoadingButton>
          )}
        </DialogActions>
      </Dialog>

      {selectedImage && (
        <>
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
                    zIndex: 2,
                    backgroundColor: "rgba(0,0,0,0.6)",
                    borderRadius: "20px",
                    padding: "2px 6px",
                  }}
                >
                  <IconButton size="small" onClick={handleZoomOut} disabled={zoom <= MIN_ZOOM} sx={{ color: "#fff" }}>
                    <ZoomOut fontSize="small" />
                  </IconButton>

                  <Typography sx={{ color: "#fff", fontSize: "12px", minWidth: 38, textAlign: "center" }}>{Math.round(zoom * 100)}%</Typography>

                  <IconButton size="small" onClick={handleZoomIn} disabled={zoom >= MAX_ZOOM} sx={{ color: "#fff" }}>
                    <ZoomIn fontSize="small" />
                  </IconButton>

                  <IconButton size="small" onClick={handleZoomReset} sx={{ color: "#fff" }}>
                    <RestartAlt fontSize="small" />
                  </IconButton>
                </Stack>

                {/* Fixed viewport — wheel zooms, drag pans once zoomed in */}
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
      )}
    </>
  );
};

export default ManageTransferDialog;
