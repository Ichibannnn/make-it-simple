import { Autocomplete, Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Stack, TextField, Typography } from "@mui/material";
import { Add, AttachFile, AttachFileOutlined, CheckOutlined, FiberManualRecord, GetAppOutlined, RestartAlt, ZoomIn, ZoomOut } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";

import moment from "moment";
import { theme } from "../../../theme/theme";
import { LoadingButton } from "@mui/lab";
import { toast } from "sonner";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

import { useDispatch } from "react-redux";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useSelector } from "react-redux";
import { useLazyGetChannelsQuery } from "../../../features/api_channel_setup/channel/channelApi";
import { useLazyGetCategoryQuery } from "../../../features/api masterlist/category_api/categoryApi";
import { useLazyGetSubCategoryArrayQuery } from "../../../features/api masterlist/sub_category_api/subCategoryApi";
import { useDeleteRequestorAttachmentMutation, useEditRequestorConcernMutation } from "../../../features/api_request/concerns/concernApi";
import { useLazyGetReceiverAttachmentQuery } from "../../../features/api_request/concerns_receiver/concernReceiverApi";
import { useLazyGetDownloadAttachmentQuery, useLazyGetViewAttachmentQuery } from "../../../features/api_attachments/attachmentsApi";
import { notificationApi } from "../../../features/api_notification/notificationApi";
import { notificationMessageApi } from "../../../features/api_notification_message/notificationMessageApi";
import AssignDialogMenuAction from "../../Request/ReceiverConcernV2/AssignDialogMenuAction";
import { getAttachmentIcon } from "../../../utils/getAttachmentIcon";
import { global } from "../../../styles/global";
import { formStyle as sx } from "./style/formStyle";
import { confirmDeleteAttachment } from "../../../utils/sweetAlert";

const schema = yup.object().shape({
  Concern: yup.string().min(2, "Concern must be more than 1 character long").required("This field is required").label("Concern Details"),
  RequestAttachmentsFiles: yup.array().nullable(),

  ChannelId: yup.object().notRequired(),
  CategoryId: yup.array(),
  SubCategoryId: yup.array(),
  TargetDate: yup.date().notRequired(),
  IssueHandler: yup.string().notRequired(),
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

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          height: 80,
          backgroundColor: "rgba(255,255,255,0.04)",
        }}
      >
        {previewUrl && !previewError && (
          <Box
            component="img"
            src={previewUrl}
            alt={fileName.name}
            onError={() => setPreviewError(true)}
            sx={{
              width: "100%",
              height: 80,
              objectFit: "cover",
              display: "block",
            }}
          />
        )}

        {!previewUrl && !previewError && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress size={20} thickness={4} sx={{ color: theme.palette.text.secondary }} />
          </Box>
        )}

        {previewError && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {getAttachmentIcon(fileName)}
          </Box>
        )}

        {isOpening && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
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
          <Typography
            noWrap
            sx={{
              fontSize: "10px",
              color: theme.palette.text.secondary,
              minWidth: 0,
            }}
          >
            {ext?.toUpperCase()} · {fileName.size} MB
          </Typography>
          {/* Small check = already saved from a previous submit */}
          {!!fileName.ticketAttachmentId && <CheckOutlined color="success" sx={{ fontSize: 12 }} titleAccess="Attached file" />}
        </Stack>
      </Box>
    </Box>
  );
};

const RejectDateDialog = ({ data, open, onClose, refetch }) => {
  const [attachments, setAttachments] = useState([]);
  const [ticketAttachmentId, setTicketAttachmentId] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewIsLoading, setViewIsLoading] = useState(false);

  const [loadingAttachmentId, setLoadingAttachmentId] = useState(null);
  const [downloadIsLoading, setDownloadIsLoading] = useState(false);
  const [deletedAttachmentIds, setDeletedAttachmentIds] = useState([]); // pending deletes

  const [zoom, setZoom] = useState(1);
  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 4;
  const ZOOM_STEP = 0.25;
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const positionStartRef = useRef({ x: 0, y: 0 });

  const [formClosed, setFormClosed] = useState(false);
  const userId = useSelector((state) => state?.user?.id);
  const userDetails = useSelector((state) => state?.user);

  const dispatch = useDispatch();
  const fileInputRef = useRef();
  // useSignalRConnection();

  const [getChannel, { data: channelData, isLoading: channelIsLoading, isSuccess: channelIsSuccess }] = useLazyGetChannelsQuery();
  const [getCategory, { data: categoryData, isLoading: categoryIsLoading, isSuccess: categoryIsSuccess }] = useLazyGetCategoryQuery();
  const [getSubCategory, { data: subCategoryData, isLoading: subCategoryIsLoading, isSuccess: subCategoryIsSuccess }] = useLazyGetSubCategoryArrayQuery();
  const [createEditReceiverConcern, { isLoading: isCreateEditReceiverConcernLoading, isFetching: isCreateEditReceiverConcernFetching }] = useEditRequestorConcernMutation();
  // const [smsNotification] = useSendSmsNotificationMutation();

  const [deleteRequestorAttachment] = useDeleteRequestorAttachmentMutation();
  const [getAddReceiverAttachment] = useLazyGetReceiverAttachmentQuery();
  const [getViewAttachment] = useLazyGetViewAttachmentQuery();
  const [getDownloadAttachment] = useLazyGetDownloadAttachmentQuery();

  const [isSaving, setIsSaving] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      Concern: "",
      RequestAttachmentsFiles: [],

      ChannelId: null,
      CategoryId: [],
      SubCategoryId: [],
      TargetDate: null,
      IssueHandler: userId,
    },
  });

  const handleAttachments = (event) => {
    const newFiles = Array.from(event.target.files);

    const fileNames = newFiles.map((file) => ({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2),
      file,
    }));

    // setAttachments((prevFiles) => [...prevFiles, ...uniqueNewFiles]);
    setAttachments((prevFiles) => {
      const safePrev = Array.isArray(prevFiles) ? prevFiles : [];

      const uniqueNewFiles = fileNames.filter((newFile) => !safePrev.some((existing) => existing.name === newFile.name));

      return [...safePrev, ...uniqueNewFiles];
    });
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
      "RequestAttachmentsFiles",
      watch("RequestAttachmentsFiles").filter((file) => file.name !== fileNameToDelete.name),
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
    //     "RequestAttachmentsFiles",
    //     watch("RequestAttachmentsFiles").filter((file) => file.name !== fileNameToDelete.name),
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

  const getAddAttachmentData = async (id) => {
    try {
      const res = await getAddReceiverAttachment({ Id: id }).unwrap();

      setAttachments(
        res?.value?.[0]?.attachments?.map((item) => ({
          ticketAttachmentId: item.ticketAttachmentId,
          name: item.fileName,
          size: (item.fileSize / (1024 * 1024)).toFixed(2),
          link: item.attachment,
        })),
      );
    } catch (error) {}
  };

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
      console.log("Error", error);
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

  const handleZoomIn = () => setZoom((z) => Math.min(MAX_ZOOM, +(z + ZOOM_STEP).toFixed(2)));
  const handleZoomOut = () => setZoom((z) => Math.max(MIN_ZOOM, +(z - ZOOM_STEP).toFixed(2)));

  const handleZoomReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleWheelZoom = (event) => {
    if (event.deltaY < 0) handleZoomIn();
    else handleZoomOut();
  };

  useEffect(() => {
    if (zoom <= 1) setPosition({ x: 0, y: 0 });
  }, [zoom]);

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

  const onCloseAction = () => {
    reset();
    setFormClosed((prev) => !prev);
    setAttachments([]);
    setIsSaving(false);
    onClose();
  };

  const imageAttachments = attachments?.filter((f) => isImageFile(f.name)) ?? [];
  const otherAttachments = attachments?.filter((f) => !isImageFile(f.name)) ?? [];

  const renderMenu = (fileName, compact = false) => (
    <AssignDialogMenuAction
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

  const onSubmitAction = (formData) => {
    // const smsPayload = {
    //   system_name: "Make It Simple",
    //   message: `Fresh Morning! Concern #${data?.requestConcernId} has been assigned to your account. Kindly check your ticket list.`,
    //   mobile_number: data?.contact_Number,
    // };

    Swal.fire({
      title: "Confirmation",
      text: `Are you sure you want to save changes to ticket ${moment(data?.created_At).format("YYYY")}-${data?.ticketConcernId}?`,
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

      payload.append("RequestConcernId", formData?.RequestConcernId);
      payload.append("TicketConcernId", data?.ticketConcernId);
      payload.append("Request_Type", data?.request_Type);
      payload.append("Severity", data?.severity);
      payload.append("BackJobId", data?.backJobId === null ? "" : data?.backJobId);
      payload.append("UserId", data?.requestor_By);
      payload.append("Contact_Number", data?.contact_Number === null ? "" : data?.contact_Number);

      payload.append("ServiceProviderId", data?.serviceProviderId);
      payload.append("DateNeeded", data.date_Needed ? moment(data.date_Needed).format("YYYY-MM-DD") : "");
      payload.append("Notes", data?.notes === null ? "" : data?.notes);

      payload.append("ChannelId", formData.ChannelId ? formData.ChannelId?.channelId : 0);
      payload.append("TargetDate", moment(formData.TargetDate).format("YYYY-MM-DD"));
      payload.append("AssignTo", formData.IssueHandler ? formData.IssueHandler : "");
      payload.append("Concern", formData.Concern);

      const category = formData.CategoryId;
      for (let i = 0; i < category.length; i++) {
        payload.append(`AddRequestTicketCategory[${i}].ticketCategoryId`, category[i].ticketCategoryId || "");
        payload.append(`AddRequestTicketCategory[${i}].categoryId`, category[i]?.id);
      }

      if (category.length === 0) {
        payload.append(`AddRequestTicketCategory[0].ticketCategoryId`, "");
        payload.append(`AddRequestTicketCategory[0].categoryId`, "");
      }

      const subCategory = formData.SubCategoryId;
      for (let i = 0; i < subCategory.length; i++) {
        payload.append(`AddRequestTicketSubCategory[${i}].ticketSubCategoryId`, subCategory[i].ticketSubCategoryId || "");
        payload.append(`AddRequestTicketSubCategory[${i}].subCategoryId`, subCategory[i]?.subCategoryId);
      }

      if (subCategory.length === 0) {
        payload.append(`AddRequestTicketSubCategory[0].ticketSubCategoryId`, "");
        payload.append(`AddRequestTicketSubCategory[0].subCategoryId`, "");
      }

      const files = formData.RequestAttachmentsFiles;
      for (let i = 0; i < files.length; i++) {
        payload.append(`RequestAttachmentsFile[${i}].ticketAttachmentId`, files[i].ticketAttachmentId || "");
        payload.append(`RequestAttachmentsFile[${i}].attachment`, files[i]);
      }

      if (files.length === 0) {
        payload.append(`RequestAttachmentsFile[0].ticketAttachmentId`, "");
        payload.append(`RequestAttachmentsFile[0].attachment`, "");
      }

      // console.log("Payload Entries: ", [...payload.entries()]);
      const idsToDelete = [...deletedAttachmentIds];
      setIsSaving(true);

      try {
        await createEditReceiverConcern(payload).unwrap();

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
          description: "Ticket updated successfully!",
          duration: 1500,
        });

        dispatch(notificationApi.util.resetApiState());
        dispatch(notificationMessageApi.util.resetApiState());

        setAttachments([]);
        setDeletedAttachmentIds([]);
        setIsSaving(false);
        reset();
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

      // createEditReceiverConcern(payload)
      //   .unwrap()
      //   .then(() => {
      //     toast.success("Success!", {
      //       description: "Ticket updated successfully!",
      //       duration: 1500,
      //     });

      //     dispatch(notificationApi.util.resetApiState());
      //     dispatch(notificationMessageApi.util.resetApiState());

      //     setAttachments([]);
      //     reset();
      //     onClose();
      //   })
      //   .catch((err) => {
      //     console.log("Error", err);
      //     toast.error("Error!", {
      //       description: err.data.error.message,
      //       duration: 1500,
      //     });
      //   });

      // SEND SMS STATUS
      // try {
      //   smsNotification(smsPayload).unwrap();
      // } catch (error) {
      //   console.log(error);
      //   toast.error("Error!", {
      //     description: "Sms notification error!",
      //     duration: 1500,
      //   });
      // }
    });
  };

  useEffect(() => {
    if (data) {
      if (!channelIsSuccess) getChannel();

      setValue("Concern", data?.concern_Description);
      setValue("RequestConcernId", data?.requestConcernId);

      if (data?.channelId !== null) {
        setValue("ChannelId", {
          channelId: data?.channelId,
          channelName: data?.channel_Name,
        });
      } else {
        setValue("ChannelId", null);
      }

      const category = data?.getOpenTicketCategories?.map((item) => ({
        ticketCategoryId: item.ticketCategoryId,
        id: item.categoryId,
        category_Description: item.category_Description,
      }));

      const subCategory = data?.getOpenTicketSubCategories?.map((item) => ({
        ticketSubCategoryId: item.ticketSubCategoryId,
        subCategoryId: item.subCategoryId,
        sub_Category_Description: item.subCategory_Description,
      }));

      const categoryIdParams = data?.getOpenTicketCategories?.map((item) => item?.categoryId);

      setValue("CategoryId", category);
      setValue("SubCategoryId", subCategory);

      //   setValue("TargetDate", data?.targetDate ? moment(data?.targetDate) : null);

      getAddAttachmentData(data?.ticketConcernId);
      getSubCategory({
        CategoryId: categoryIdParams,
      });
    }
  }, [data, formClosed]);

  useEffect(() => {
    const selectedCategories = watch("CategoryId");
    const selectedSubCategories = watch("SubCategoryId");

    if (selectedCategories.length > 0) {
      const filteredSubCategories = selectedSubCategories.filter((subCategory) =>
        selectedCategories.some((category) => subCategoryData?.value?.some((item) => item.subCategoryId === subCategory.subCategoryId && item.categoryId === category.id)),
      );
      setValue("SubCategoryId", filteredSubCategories);
    } else {
      setValue("SubCategoryId", []);
    }
  }, [subCategoryData]);

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
        sx={global.dialog}
        PaperProps={{ style: { overflow: "auto" } }}
      >
        <form onSubmit={handleSubmit(onSubmitAction)}>
          <DialogContent>
            <Stack sx={{ width: "100%", padding: 1 }}>
              {/* Ticket Number */}
              <Stack>
                <Typography sx={sx.titleText}>Reject Details</Typography>
                <Typography sx={sx.captionText}>{` Ticket # ${moment(data?.created_At).format("YYYY")}-${data?.ticketConcernId}`}</Typography>
              </Stack>

              {/* Ticket Detail Section */}
              <Stack sx={sx.detailBox}>
                <Stack sx={sx.closeDetailContent}>
                  <Box sx={sx.titleDetailBox}>
                    <Typography sx={sx.detailTitleText}>Date Needed:</Typography>
                  </Box>

                  <Box sx={sx.spacer} />

                  <Box sx={sx.descDetailBox}>
                    <Typography sx={sx.detailDescText}>{data?.date_Needed ? moment(data?.date_Needed).format("LL") : "--"}</Typography>
                  </Box>
                </Stack>

                <Divider variant="fullWidth" sx={sx.divider} />

                <Stack sx={sx.closeDetailContent}>
                  <Box sx={sx.titleDetailBox}>
                    <Typography sx={sx.detailTitleText}>Service Provider:</Typography>
                  </Box>

                  <Box sx={sx.spacer} />

                  <Box sx={sx.descDetailBox}>
                    <Typography sx={sx.detailDescText}>{data?.serviceProviderName}</Typography>
                  </Box>
                </Stack>
              </Stack>

              {/* Fields */}
              <Stack sx={sx.fieldSection}>
                {/* Channel */}
                <Stack sx={sx.fieldOneColStack}>
                  <Typography sx={sx.fieldText}>Channel</Typography>
                  <Controller
                    control={control}
                    name="ChannelId"
                    render={({ field: { ref, value, onChange } }) => {
                      return (
                        <Autocomplete
                          ref={ref}
                          size="small"
                          value={value}
                          options={userDetails?.channels || []}
                          renderInput={(params) => <TextField {...params} placeholder="Channel Name" sx={sx.autoComplete} />}
                          onChange={(_, value) => {
                            onChange(value);
                            setValue("CategoryId", []);
                            setValue("SubCategoryId", []);
                            setValue("userId", null);
                          }}
                          getOptionLabel={(option) => option.channelName || ""}
                          isOptionEqualToValue={(option, value) => option.channelId === value.channelId}
                          componentsProps={sx.automCompleteProp}
                          fullWidth
                          disableClearable
                          disabled
                        />
                      );
                    }}
                  />
                </Stack>

                {/* Category */}
                <Stack sx={sx.fieldOneColStack}>
                  <Stack sx={sx.fieldTitleWithIconBox}>
                    <Typography sx={sx.fieldText}>Category</Typography>
                    <FiberManualRecord sx={sx.requiredDot} />
                  </Stack>

                  <Controller
                    control={control}
                    name="CategoryId"
                    render={({ field: { ref, value, onChange } }) => {
                      return (
                        <Autocomplete
                          multiple
                          ref={ref}
                          size="small"
                          value={value}
                          options={categoryData?.value?.category?.filter((item) => item.channelId === watch("ChannelId")?.channelId) || []}
                          loading={categoryIsLoading}
                          renderInput={(params) => <TextField {...params} placeholder="Category" sx={sx.autoComplete} />}
                          onOpen={() => {
                            if (!categoryIsSuccess)
                              getCategory({
                                Status: true,
                              });
                          }}
                          onChange={(_, value) => {
                            onChange(value);
                            const categoryIdParams = value?.map((category) => category?.id);
                            if (watch("CategoryId").length === 0) {
                              setValue("SubCategoryId", []);
                            }
                            getSubCategory({
                              CategoryId: categoryIdParams,
                            });
                          }}
                          getOptionLabel={(option) => option.category_Description || ""}
                          isOptionEqualToValue={(option, value) => option.id === value.id}
                          getOptionDisabled={(option) => watch("CategoryId").some((item) => item.id === option.id)}
                          fullWidth
                          disableClearable
                          componentsProps={sx.automCompleteProp}
                        />
                      );
                    }}
                  />
                </Stack>

                {/* Sub Category */}
                <Stack>
                  <Stack direction="row" sx={sx.fieldTitleWithIconBox}>
                    <Typography sx={sx.fieldText}>Sub Category</Typography>
                    <FiberManualRecord color="error" sx={sx.requiredDot} />
                  </Stack>

                  <Controller
                    control={control}
                    name="SubCategoryId"
                    render={({ field: { ref, value, onChange } }) => {
                      return (
                        <Autocomplete
                          multiple
                          ref={ref}
                          size="small"
                          value={value}
                          options={subCategoryData?.value || []}
                          loading={subCategoryIsLoading}
                          renderInput={(params) => <TextField {...params} placeholder="Sub Category" sx={sx.autoComplete} />}
                          onOpen={() => {
                            if (!subCategoryIsSuccess) getSubCategory();
                          }}
                          onChange={(_, value) => {
                            onChange(value);
                          }}
                          getOptionLabel={(option) => option?.sub_Category_Description || ""}
                          isOptionEqualToValue={(option, value) => option?.subCategoryId === value?.subCategoryId}
                          getOptionDisabled={(option) => watch("SubCategoryId").some((item) => item.subCategoryId === option.subCategoryId)}
                          noOptionsText={"No sub category available"}
                          fullWidth
                          // disablePortal
                          disableClearable
                          disabled={!watch("ChannelId")}
                          componentsProps={sx.autoComplete}
                        />
                      );
                    }}
                  />
                </Stack>

                {/* Target Date */}
                <Stack sx={sx.fieldOneColStack}>
                  <Stack sx={sx.fieldTitleWithIconBox}>
                    <Typography sx={sx.fieldText}>Target Date</Typography>
                    <FiberManualRecord sx={sx.requiredDot} />
                  </Stack>

                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <Controller
                      control={control}
                      name="TargetDate"
                      render={({ field }) => (
                        <DatePicker
                          value={field.value ? moment(field.value) : null}
                          onChange={(newValue) => {
                            const formattedValue = newValue ? moment(newValue).format("YYYY-MM-DD") : null;
                            field.onChange(formattedValue);
                          }}
                          slotProps={sx.datePickerSlotProp}
                          minDate={new moment()}
                          error={!!errors.TargetDate}
                          helperText={errors.TargetDate ? errors.TargetDate.message : null}
                        />
                      )}
                    />
                    {errors.TargetDate && <Typography sx={sx.textErrors}>{errors.TargetDate.message}</Typography>}
                  </LocalizationProvider>
                </Stack>

                {/* Ticket Description */}
                <Stack sx={sx.fieldOneColStack}>
                  <Typography sx={sx.fieldText}>Ticket Description</Typography>
                  <Controller
                    control={control}
                    name="Concern"
                    render={({ field: { ref, value, onChange } }) => {
                      return (
                        <TextField
                          inputRef={ref}
                          size="small"
                          value={value}
                          placeholder="Description"
                          onChange={onChange}
                          error={!!errors.Concern}
                          InputProps={sx.textFieldInputProps}
                          InputLabelProps={sx.textFieldLabelProps}
                          autoComplete="off"
                          rows={6}
                          multiline
                          disabled
                        />
                      );
                    }}
                  />
                  {errors.Concern && (
                    <Typography color="error" sx={{ fontSize: "12px" }}>
                      {errors.Concern.message}
                    </Typography>
                  )}
                </Stack>

                {/* Attachments */}
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

                      <Button size="small" variant="contained" color="warning" onClick={handleUploadButtonClick} sx={sx.addAttachmentBtn}>
                        <Typography sx={{ fontSize: "11.5px", fontWeight: 500 }}>Add File</Typography>
                      </Button>
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
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 1.5,
                            }}
                          >
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
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
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
                </Stack>

                <Controller
                  control={control}
                  name="RequestAttachmentsFiles"
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

                          const uniqueNewFiles = files?.filter((item) => !value?.some((file) => file.name === item.name));

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
          </DialogContent>

          <DialogActions>
            <LoadingButton variant="contained" onClick={onCloseAction} size="small" loading={isSaving} sx={sx.cancelButton}>
              Cancel
            </LoadingButton>

            <LoadingButton
              size="small"
              type="submit"
              variant="contained"
              loading={isSaving}
              disabled={!watch("ChannelId") || watch("CategoryId").length === 0 || watch("SubCategoryId").length === 0 || !watch("IssueHandler") || !watch("TargetDate")}
            >
              Save
            </LoadingButton>
          </DialogActions>
        </form>

        {/* Dialog to view image */}
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
      </Dialog>
    </>
  );
};

export default RejectDateDialog;
