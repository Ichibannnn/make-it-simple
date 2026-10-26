import { useEffect, useRef, useState } from "react";
import { Autocomplete, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, IconButton, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { AttachFile, AttachFileOutlined, CheckOutlined, FiberManualRecord, RestartAlt, ZoomIn, ZoomOut } from "@mui/icons-material";

import * as yup from "yup";
import moment from "moment";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { theme } from "../../../theme/theme";
import { LoadingButton } from "@mui/lab";
import { toast } from "sonner";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

import {
  useDeleteRequestorAttachmentMutation,
  useEditRequestorConcernMutation,
  useLazyGetBackjobTicketsQuery,
  useLazyGetRequestorAttachmentQuery,
} from "../../../features/api_request/concerns/concernApi";

import { useDispatch } from "react-redux";
import { getAttachmentIcon } from "../../../utils/getAttachmentIcon";
import { notificationApi } from "../../../features/api_notification/notificationApi";
import { notificationMessageApi } from "../../../features/api_notification_message/notificationMessageApi";
import { global } from "../../../styles/global";
import { formStyle as sx } from "../../Tickets/IssueHandlerConcerns/style/formStyle";

import { useLazyGetDownloadAttachmentQuery, useLazyGetViewAttachmentQuery } from "../../../features/api_attachments/attachmentsApi";
import { useLazyGetUsersQuery } from "../../../features/user_management_api/user/userApi";
import { useLazyGetCompanyQuery } from "../../../features/api masterlist/company/companyApi";
import { useLazyGetBusinessUnitQuery } from "../../../features/api masterlist/business-unit/businessUnitApi";
import { useLazyGetDepartmentQuery } from "../../../features/api masterlist/department/departmentApi";
import { useLazyGetUnitQuery } from "../../../features/api masterlist/unit/unitApi";
import { useLazyGetSubUnitQuery } from "../../../features/api masterlist/sub-unit/subUnitApi";
import { useLazyGetLocationWithPaginationQuery } from "../../../features/api masterlist/location/locationApi";
import { useLazyGetCategoryQuery } from "../../../features/api masterlist/category_api/categoryApi";
import { useLazyGetSubCategoryArrayQuery } from "../../../features/api masterlist/sub_category_api/subCategoryApi";
import { useLazyGetServiceProviderQuery } from "../../../features/api masterlist/service_provider/serviceProviderApi";
import { useLazyGetOneChargingQuery } from "../../../features/api masterlist/one_charging/oneChargingApi";

import ConcernViewMenuActions from "./ConcernViewMenuAction";
import { confirmDeleteAttachment } from "../../../utils/sweetAlert";

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

const ConcernViewDialog = ({ editData, open, onClose, refetch }) => {
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

  const [isLoading, setIsLoading] = useState(false);
  const dateNeededValidation = new moment();

  const requestorSchema = yup.object().shape({
    RequestConcernId: yup.string().nullable(),
    Concern: yup.string().min(2, "Concern must be at least 2 characters long").required("This field is required").label("Concern Details"),
    RequestAttachmentsFiles: yup.array().nullable(),

    Request_Type: yup.string().required("Request Type is required"),
    Severity: yup.string().oneOf(["Normal", "Urgent"], "Invalid Severity").required("Severity Type is required"),
    BackJobId: yup.object().notRequired(),
    Contact_Number: yup.string().matches(/^09\d{9}$/, {
      message: "Must start with 09 and be 11 digits long",
      excludeEmptyString: true,
    }),
    UserId: yup.object().required().label("Requestor is required"),
    CompanyId: yup.object().required().label("Company is required"),
    BusinessUnitId: yup.object().required().label("Business Unit"),
    DepartmentId: yup.object().required().label("Department is required"),
    UnitId: yup.object().required().label("Unit is required"),
    SubUnitId: yup.object().required().label("Sub Unit is required"),
    LocationId: yup.object().required().label("Location is required"),

    ServiceProvider: yup.object().required().label("Service Provider"),
    ChannelId: yup.object().notRequired(),
    CategoryId: yup.array(),
    SubCategoryId: yup.array(),
    DateNeeded: yup.date().required("Date needed is required"),
    TargetDate: yup.date().notRequired(),
    IssueHandler: yup.object().notRequired(),

    Notes: yup.string().notRequired(),
  });

  const fileInputRef = useRef();
  const dispatch = useDispatch();

  const [createEditRequestorConcern, { isLoading: isCreateEditRequestorConcernLoading, isFetching: isCreateEditRequestorConcernFetching }] = useEditRequestorConcernMutation();
  const [getUser, { data: userData, isLoading: userIsLoading, isSuccess: userIsSuccess }] = useLazyGetUsersQuery();
  const [getBackjobTicket, { data: backjobTicketData, isLoading: backjobTicketIsLoading, isSuccess: backjobTicketIsSuccess }] = useLazyGetBackjobTicketsQuery();
  const [getChargingCode, { data: chargingCodeData, isLoading: chargingCodeIsLoading, isSuccess: chargingCodeIsSuccess }] = useLazyGetOneChargingQuery();
  const [getCompany, { data: companyData, isLoading: companyIsLoading, isSuccess: companyIsSuccess }] = useLazyGetCompanyQuery();
  const [getBusinessUnit, { data: businessUnitData, isLoading: businessUnitIsLoading, isSuccess: businessUnitIsSuccess }] = useLazyGetBusinessUnitQuery();
  const [getDepartment, { data: departmentData, isLoading: departmentIsLoading, isSuccess: departmentIsSuccess }] = useLazyGetDepartmentQuery();
  const [getUnit, { data: unitData, isLoading: unitIsLoading, isSuccess: unitIsSuccess }] = useLazyGetUnitQuery();
  const [getSubUnit, { data: subUnitData, isLoading: subUnitIsLoading, isSuccess: subUnitIsSuccess }] = useLazyGetSubUnitQuery();
  const [getLocation, { data: locationData, isLoading: locationIsLoading, isSuccess: locationIsSuccess }] = useLazyGetLocationWithPaginationQuery();
  const [getServiceProvider, { data: serviceProviderData, isLoading: serviceProviderIsLoading, isSuccess: serviceProviderIsSuccess }] = useLazyGetServiceProviderQuery();
  const [getCategory, { data: categoryData, isLoading: categoryIsLoading, isSuccess: categoryIsSuccess }] = useLazyGetCategoryQuery();
  const [getSubCategory, { data: subCategoryData, isLoading: subCategoryIsLoading, isSuccess: subCategoryIsSuccess }] = useLazyGetSubCategoryArrayQuery();

  const [getRequestorAttachment] = useLazyGetRequestorAttachmentQuery();
  const [getViewAttachment] = useLazyGetViewAttachmentQuery();
  const [getDownloadAttachment] = useLazyGetDownloadAttachmentQuery();
  const [deleteRequestorAttachment, { isLoading: delAttachmentIsLoading, isFetching: delAttachmentIsFetching }] = useDeleteRequestorAttachmentMutation();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(requestorSchema),
    mode: "onChange",
    defaultValues: {
      Concern: "",
      RequestConcernId: "",
      RequestAttachmentsFiles: [],

      Request_Type: "",
      Severity: "Normal",
      BackJobId: null,
      Contact_Number: "",

      UserId: null,
      ChargingCode: null,
      CompanyId: null,
      BusinessUnitId: null,
      DepartmentId: null,
      UnitId: null,
      SubUnitId: null,
      LocationId: null,

      ServiceProvider: null,
      ChannelId: null,
      CategoryId: [],
      SubCategoryId: [],
      DateNeeded: null,
      TargetDate: null,
      IssueHandler: null,

      Notes: "",
    },
  });

  const onConcernFormSubmit = (formData) => {
    const payload = new FormData();

    payload.append("RequestConcernId", formData.RequestConcernId);
    payload.append("TicketConcernId", editData?.ticketRequestConcerns[0]?.ticketConcernId);

    payload.append("Request_Type", formData.Request_Type);
    payload.append("Severity", formData.Severity);
    payload.append("BackJobId", formData?.BackJobId === null ? "" : formData.BackJobId?.ticketConcernId);
    payload.append("UserId", formData.UserId?.id);
    payload.append("Contact_Number", formData.Contact_Number);
    payload.append("CompanyId", formData.CompanyId?.id);
    payload.append("BusinessUnitId", formData.BusinessUnitId?.id);
    payload.append("DepartmentId", formData.DepartmentId?.id);
    payload.append("UnitId", formData.UnitId?.id);
    payload.append("SubUnitId", formData.SubUnitId?.id);
    payload.append("Location_Code", formData.LocationId?.location_Code);

    payload.append("ServiceProviderId", formData.ServiceProvider?.id);
    payload.append("ChannelId", formData.ChannelId ? formData.ChannelId?.channelId : 0);
    payload.append("DateNeeded", moment(formData.DateNeeded).format("YYYY-MM-DD"));
    payload.append("TargetDate", formData.TargetDate ? moment(formData.TargetDate).format("YYYY-MM-DD") : "");
    payload.append("AssignTo", formData.IssueHandler ? formData.IssueHandler?.userId : "");
    payload.append("Concern", formData.Concern);
    payload.append("Notes", formData.Notes);

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

    createEditRequestorConcern(payload)
      .unwrap()
      .then(async () => {
        // Ticket saved successfully -> now delete the attachments the user removed
        if (idsToDelete.length > 0) {
          const results = await Promise.allSettled(idsToDelete.map((id) => deleteRequestorAttachment({ ticketAttachmentId: id }).unwrap()));

          const failedCount = results.filter((r) => r.status === "rejected").length;

          if (failedCount > 0) {
            toast.error("Error!", {
              description: `${failedCount} attachment(s) could not be deleted.`,
              duration: 2500,
            });
          }

          refetch();
        }

        toast.success("Success!", {
          description: "Concern updated successfully!",
          duration: 1500,
        });
        dispatch(notificationApi.util.resetApiState());
        dispatch(notificationMessageApi.util.resetApiState());
        setAttachments([]);
        reset({
          Request_Type: "New Request",
          Severity: "Normal",
          BackJobId: null,
          Contact_Number: "",

          DateNeeded: moment().format("YYYY-MM-DD"),
          ChannelId: null,
          CategoryId: [],
          SubCategoryId: [],

          Concern: "",
          Notes: "",
        });
        setIsLoading(false);
        setDeletedAttachmentIds([]);
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
    setAttachments((prevFiles) => prevFiles.filter((file) => file !== fileNameToDelete));

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

  const getAttachmentData = async (id) => {
    try {
      const res = await getRequestorAttachment({ Id: id }).unwrap();

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
    reset({
      Request_Type: "New Request",
      Severity: "Normal",
      BackJobId: null,
      Contact_Number: "",

      DateNeeded: null,
      ChannelId: null,
      CategoryId: [],
      SubCategoryId: [],

      Concern: "",
      Notes: "",
    });
    setAttachments([]);
    setDeletedAttachmentIds([]);
    onClose();
  };

  const imageAttachments = attachments?.filter((f) => isImageFile(f.name)) ?? [];
  const otherAttachments = attachments?.filter((f) => !isImageFile(f.name)) ?? [];

  const renderMenu = (fileName, compact = false) => (
    <ConcernViewMenuActions
      editData={editData}
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

  useEffect(() => {
    if (editData) {
      if (!chargingCodeIsSuccess) getChargingCode();
      if (!companyIsSuccess) getCompany();
      if (!businessUnitIsSuccess) getBusinessUnit();
      if (!departmentIsSuccess) getDepartment();
      if (!unitIsSuccess) getUnit();
      if (!subUnitIsSuccess) getSubUnit();
      if (!locationIsSuccess) getLocation();
      if (!serviceProviderIsSuccess) getServiceProvider({ Status: true });

      setValue("RequestConcernId", editData?.requestConcernId);
      setValue("Request_Type", editData?.request_Type);
      setValue("Severity", editData?.severity);
      setValue("Concern", editData?.concern);

      if (editData?.request_Type === "New Request") {
        setValue("BackJobId", null);
      } else {
        setValue("BackJobId", {
          ticketConcernId: editData?.backJobId,
          concern: editData?.back_Job_Concern,
        });
      }

      setValue("UserId", {
        id: editData?.requestorId,
        fullname: editData?.fullName,
      });

      if (editData.contact_Number === null) {
        setValue("Contact_Number", "");
      } else {
        setValue("Contact_Number", editData.contact_Number);
      }

      // setValue("ChargingCode", {
      //   code: userInformation?.oneChargingCode,
      //   name: userInformation?.oneChargingName,
      // });

      setValue("CompanyId", {
        id: editData?.companyId,
        company_Code: editData?.company_Code,
        company_Name: editData?.company_Name,
      });

      setValue("BusinessUnitId", {
        id: editData?.businessUnitId,
        business_Code: editData?.businessUnit_Code,
        business_Name: editData?.businessUnit_Name,
      });

      setValue("DepartmentId", {
        id: editData?.departmentId,
        department_Code: editData?.department_Code,
        department_Name: editData?.department_Name,
      });

      setValue("UnitId", {
        id: editData?.unitId,
        unit_Code: editData?.unit_Code,
        unit_Name: editData?.unit_Name,
      });

      setValue("SubUnitId", {
        id: editData?.subUnitId,
        subUnit_Code: editData?.subUnit_Code,
        subUnit_Name: editData?.subUnit_Name,
      });

      setValue("LocationId", {
        location_Code: editData?.location_Code,
        location_Name: editData?.location_Name,
      });

      if (editData?.channelId !== null) {
        setValue("ServiceProvider", {
          id: editData?.serviceProviderId,
          serviceProviderName: editData?.serviceProviderName,
        });
      } else {
        getServiceProvider({
          Status: true,
        });
        setValue("ServiceProvider", {
          id: editData?.serviceProviderId,
          serviceProviderName: editData?.serviceProviderName,
        });
      }

      if (editData?.channelId !== null) {
        setValue("ChannelId", {
          channelId: editData?.channelId,
          channelName: editData?.channel_Name,
        });
      } else {
        setValue("ChannelId", null);
      }

      setValue("DateNeeded", moment(editData?.date_Needed));

      if (editData?.targetDate !== null) {
        setValue("TargetDate", moment(editData?.targetDate));
      } else {
        setValue("TargetDate", null);
      }

      if (editData?.assignTo !== null) {
        setValue("IssueHandler", {
          userId: editData?.assignTo,
          fullname: editData?.assignToName,
        });
      } else {
        setValue("IssueHandler", null);
      }

      const category = editData?.getRequestTicketCategories?.map((item) => ({
        ticketCategoryId: item.ticketCategoryId,
        id: item.categoryId,
        category_Description: item.category_Description,
      }));

      const subCategory = editData?.getRequestSubTicketCategories.map((item) => ({
        ticketSubCategoryId: item.ticketSubCategoryId,
        subCategoryId: item.subCategoryId,
        sub_Category_Description: item.subCategory_Description,
      }));

      const categoryIdParams = editData?.getRequestTicketCategories?.map((item) => item?.categoryId);

      setValue("CategoryId", category);
      setValue("SubCategoryId", subCategory);

      if (editData.notes === null) {
        setValue("Notes", "");
      } else {
        setValue("Notes", editData.notes);
      }

      getAttachmentData(editData.ticketRequestConcerns.map((item) => item.ticketConcernId));
      getSubCategory({
        CategoryId: categoryIdParams,
      });
    }
  }, [editData, companyIsLoading, businessUnitIsLoading, departmentIsLoading, unitIsLoading, subUnitIsLoading, locationIsLoading]);

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
        maxWidth="lg"
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
        <form onSubmit={handleSubmit(onConcernFormSubmit)}>
          <DialogContent>
            <Stack direction="column" sx={{ padding: "1px", minHeight: "700px", gap: 1 }}>
              {/* Header */}
              <Stack mb={1}>
                <Typography sx={sx.titleText}>{!editData ? "New Request" : "View Request"}</Typography>
                <Typography sx={sx.captionText}>{`Ticket Number: ${moment(editData?.created_At).format("YYYY")}-${editData?.ticketRequestConcerns?.[0]?.ticketConcernId}`}</Typography>
              </Stack>

              {/* Fields */}
              <Stack sx={sx.fieldSectionTickets}>
                {/* Request Type */}
                <Stack sx={sx.fieldOneColStack}>
                  <Stack sx={sx.fieldTitleWithIconBox}>
                    <Typography sx={sx.fieldText}>Request Type</Typography>
                    <FiberManualRecord sx={sx.requiredDot} />
                  </Stack>

                  <Controller
                    name="Request_Type"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} label="Select Request type" size="small" inputProps={{ "aria-label": "Without label" }} sx={sx.select}>
                        <MenuItem value="New Request" sx={sx.menuItem}>
                          New Request
                        </MenuItem>
                        <MenuItem value="Rework" sx={sx.menuItem}>
                          Rework
                        </MenuItem>
                      </Select>
                    )}
                    disabled={editData?.concern_Status === "" || editData?.concern_Status === "For Approval" ? false : true}
                  />
                </Stack>

                {/* Backjob */}
                {watch("Request_Type") === "Rework" && (
                  <Stack sx={sx.fieldOneColStack}>
                    <Stack sx={sx.fieldTitleWithIconBox}>
                      <Typography sx={sx.fieldText}>Ticket Number:</Typography>
                      <FiberManualRecord sx={sx.requiredDot} />
                    </Stack>

                    <Controller
                      control={control}
                      name="BackJobId"
                      render={({ field: { ref, value, onChange } }) => {
                        return (
                          <Autocomplete
                            ref={ref}
                            size="small"
                            value={value}
                            options={backjobTicketData?.value || []}
                            loading={backjobTicketIsLoading}
                            renderInput={(params) => <TextField {...params} placeholder="Select Ticket Number" sx={sx.autoComplete} />}
                            onOpen={() => {
                              if (!backjobTicketIsSuccess) getBackjobTicket();
                            }}
                            onChange={(_, value) => onChange(value)}
                            getOptionLabel={(option) => `${option?.ticketConcernId} - ${option.concern}`}
                            noOptionsText={"No tickets available for backjob request"}
                            isOptionEqualToValue={(option, value) => option.ticketConcernId === value.ticketConcernId}
                            fullWidth
                            disableClearable
                            disabled={editData?.concern_Status === "" || editData?.concern_Status === "For Approval" ? false : true}
                            componentsProps={sx.automCompleteProp}
                          />
                        );
                      }}
                    />
                  </Stack>
                )}

                {/* Severity*/}
                <Stack sx={sx.fieldOneColStack}>
                  <Stack sx={sx.fieldTitleWithIconBox}>
                    <Typography sx={sx.fieldText}>Severity</Typography>
                    <FiberManualRecord sx={sx.requiredDot} />
                  </Stack>

                  <Controller
                    name="Severity"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        displayEmpty
                        size="small"
                        placeholder="Select Severity"
                        inputProps={{ "aria-label": "Without label" }}
                        sx={sx.select}
                        disabled={editData?.concern_Status === "" || editData?.concern_Status === "For Approval" ? false : true}
                      >
                        <MenuItem value="Normal" sx={sx.menuItem}>
                          Normal
                        </MenuItem>
                        <MenuItem value="Urgent" sx={sx.menuItem}>
                          Urgent
                        </MenuItem>
                      </Select>
                    )}
                  />
                </Stack>

                {/* Requestor Details*/}
                <Stack mt={2}>
                  <Typography sx={sx.sectionHeader}>Requestor Details:</Typography>
                </Stack>

                {/* Requestor and Contact Number */}
                <Stack sx={sx.twoColsBox}>
                  {/* Requestor */}
                  <Stack sx={sx.fieldTwoColsStack}>
                    <Typography sx={sx.fieldText}>Requestor Name</Typography>

                    <Controller
                      control={control}
                      name="UserId"
                      render={({ field: { ref, value, onChange } }) => {
                        return (
                          <Autocomplete
                            ref={ref}
                            size="small"
                            value={value}
                            options={userData?.value?.users || []}
                            loading={userIsLoading}
                            renderInput={(params) => <TextField {...params} placeholder="Requestor" sx={sx.autoComplete} />}
                            onOpen={() => {
                              if (!userIsSuccess)
                                getUser({
                                  Status: true,
                                });
                            }}
                            onChange={(_, value) => {
                              setValue("CompanyId", {
                                id: value?.companyId,
                                company_Code: value?.company_Code,
                                company_Name: value?.company_Name,
                              });
                              setValue("BusinessUnitId", {
                                id: value?.businessUnitId,
                                business_Code: value?.businessUnit_Code,
                                business_Name: value?.businessUnit_Name,
                              });
                              setValue("DepartmentId", {
                                id: value?.departmentId,
                                department_Code: value?.department_Code,
                                department_Name: value?.department_Name,
                              });
                              setValue("UnitId", {
                                id: value?.unitId,
                                unit_Code: value?.unit_Code,
                                unit_Name: value?.unit_Name,
                              });
                              setValue("SubUnitId", {
                                id: value?.subUnitId,
                                subUnit_Code: value?.subUnit_Code,
                                subUnit_Name: value?.subUnit_Name,
                              });
                              setValue("LocationId", {
                                location_Code: value?.location_Code,
                                location_Name: value?.location_Name,
                              });

                              onChange(value);
                            }}
                            getOptionLabel={(option) => option?.fullname}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            fullWidth
                            disabled
                            disableClearable
                            componentsProps={sx.automCompleteProp}
                          />
                        );
                      }}
                    />
                  </Stack>

                  {/* Contact Number */}
                  <Stack sx={sx.fieldTwoColsStack}>
                    <Typography sx={sx.fieldText}>Contact Number (Optional)</Typography>
                    <Controller
                      control={control}
                      name="Contact_Number"
                      rules={{
                        required: "Contact number is required",
                        pattern: {
                          value: /^[0-9]{11}$/,
                          message: "Contact number must be exactly 11 digits",
                        },
                      }}
                      render={({ field: { ref, value, onChange } }) => {
                        const handleInputChange = (event) => {
                          let input = event.target.value;

                          if (input && !input.startsWith("09")) {
                            input = "09" + input.replace(/[^0-9]/g, "");
                          } else {
                            input = input.replace(/[^0-9]/g, "");
                          }

                          if (input.length > 11) {
                            input = input.slice(0, 11);
                          }

                          onChange(input || null);
                        };

                        return (
                          <TextField
                            inputRef={ref}
                            size="small"
                            value={value}
                            placeholder="09"
                            onChange={handleInputChange}
                            error={!!errors.Contact_Number}
                            helperText={errors.Contact_Number ? errors.Contact_Number.message : ""}
                            InputProps={sx.textFieldInputProps}
                            InputLabelProps={sx.textFieldLabelProps}
                            autoComplete="off"
                            disabled={editData?.concern_Status === "" || editData?.concern_Status === "For Approval" ? false : true}
                            sx={{
                              width: "100%",
                            }}
                            fullWidth
                          />
                        );
                      }}
                    />
                  </Stack>
                </Stack>

                {/* Company and Business Unit*/}
                <Stack sx={sx.twoColsBox}>
                  {/* Company */}
                  <Stack sx={sx.fieldTwoColsStack}>
                    <Typography sx={sx.fieldText}>Company</Typography>
                    <Controller
                      control={control}
                      name="CompanyId"
                      render={({ field: { ref, value, onChange } }) => {
                        return (
                          <Autocomplete
                            ref={ref}
                            size="small"
                            value={value}
                            options={companyData?.value?.company || []}
                            loading={companyIsLoading}
                            renderInput={(params) => <TextField {...params} placeholder="Company" sx={sx.autoComplete} />}
                            onOpen={() => {
                              if (!companyIsSuccess) getCompany();
                            }}
                            onChange={(_, value) => onChange(value)}
                            getOptionLabel={(option) => `${option.company_Code} - ${option.company_Name}`}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            fullWidth
                            disabled
                            disableClearable
                            componentsProps={sx.automCompleteProp}
                          />
                        );
                      }}
                    />
                  </Stack>

                  {/* Business Unit */}
                  <Stack sx={sx.fieldTwoColsStack}>
                    <Typography sx={sx.fieldText}>Business Unit</Typography>
                    <Controller
                      control={control}
                      name="BusinessUnitId"
                      render={({ field: { ref, value, onChange } }) => {
                        return (
                          <Autocomplete
                            ref={ref}
                            size="small"
                            value={value}
                            options={businessUnitData?.value?.businessUnit?.filter((item) => item?.companyId === watch("CompanyId")?.id) || []}
                            loading={businessUnitIsLoading}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Business Unit"
                                sx={{
                                  "& .MuiInputBase-input": { fontSize: "13px" },
                                }}
                              />
                            )}
                            onChange={(_, value) => onChange(value)}
                            getOptionLabel={(option) => `${option.business_Code} - ${option.business_Name}`}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            sx={{
                              flex: 2,
                            }}
                            fullWidth
                            disabled
                            disablePortal
                            disableClearable
                            componentsProps={{
                              popper: {
                                sx: {
                                  "& .MuiAutocomplete-listbox": {
                                    fontSize: "13px",
                                  },
                                },
                              },
                            }}
                          />
                        );
                      }}
                    />
                  </Stack>
                </Stack>

                {/* Department and Unit */}
                <Stack sx={sx.twoColsBox}>
                  {/* Department */}
                  <Stack sx={sx.fieldTwoColsStack}>
                    <Typography sx={sx.fieldText}>Department</Typography>
                    <Controller
                      control={control}
                      name="DepartmentId"
                      render={({ field: { ref, value, onChange } }) => {
                        return (
                          <Autocomplete
                            ref={ref}
                            size="small"
                            value={value}
                            options={departmentData?.value?.department?.filter((item) => item.businessUnitId === watch("BusinessUnitId")?.id) || []}
                            loading={departmentIsLoading}
                            renderInput={(params) => <TextField {...params} placeholder="Department" sx={sx.autoComplete} />}
                            onChange={(_, value) => onChange(value)}
                            getOptionLabel={(option) => `${option.department_Code} - ${option.department_Name}`}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            fullWidth
                            disabled
                            disableClearable
                            componentsProps={sx.automCompleteProp}
                          />
                        );
                      }}
                    />
                  </Stack>

                  {/* Location */}
                  <Stack sx={sx.fieldTwoColsStack}>
                    <Typography sx={sx.fieldText}>Unit</Typography>

                    <Controller
                      control={control}
                      name="UnitId"
                      render={({ field: { ref, value, onChange } }) => {
                        return (
                          <Autocomplete
                            ref={ref}
                            size="small"
                            value={value}
                            options={unitData?.value?.unit.filter((item) => item.departmentId === watch("DepartmentId")?.id) || []}
                            loading={unitIsLoading}
                            renderInput={(params) => <TextField {...params} placeholder="Unit" sx={sx.autoComplete} />}
                            onChange={(_, value) => onChange(value)}
                            getOptionLabel={(option) => `${option.unit_Code} - ${option.unit_Name}`}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            fullWidth
                            disabled
                            disableClearable
                            componentsProps={sx.automCompleteProp}
                          />
                        );
                      }}
                    />
                  </Stack>
                </Stack>

                {/* Sub Unit and Location */}
                <Stack sx={sx.twoColsBox}>
                  {/* Sub Unit */}
                  <Stack sx={sx.fieldTwoColsStack}>
                    <Typography sx={sx.fieldText}>Sub Unit</Typography>
                    <Controller
                      control={control}
                      name="SubUnitId"
                      render={({ field: { ref, value, onChange } }) => {
                        return (
                          <Autocomplete
                            ref={ref}
                            size="small"
                            value={value}
                            options={subUnitData?.value?.subUnit?.filter((item) => item.unitId === watch("UnitId")?.id) || []}
                            loading={subUnitIsLoading}
                            onOpen={() => {
                              if (!subUnitIsSuccess)
                                getSubUnit({
                                  Status: true,
                                });
                            }}
                            renderInput={(params) => <TextField {...params} placeholder="Sub Unit" sx={sx.autoComplete} />}
                            onChange={(_, value) => onChange(value)}
                            getOptionLabel={(option) => `${option.subUnit_Code} - ${option.subUnit_Name}`}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            fullWidth
                            disabled
                            disableClearable
                            componentsProps={sx.automCompleteProp}
                          />
                        );
                      }}
                    />
                  </Stack>

                  {/* Location */}
                  <Stack sx={sx.fieldTwoColsStack}>
                    <Typography sx={sx.fieldText}>Location</Typography>
                    <Controller
                      control={control}
                      name="LocationId"
                      render={({ field: { ref, value, onChange } }) => {
                        return (
                          <Autocomplete
                            ref={ref}
                            size="small"
                            value={value}
                            options={locationData?.value?.location.filter((item) => item.subUnits.some((subUnitItem) => subUnitItem.subUnitId === watch("SubUnitId")?.id)) || []}
                            loading={locationIsLoading}
                            renderInput={(params) => <TextField {...params} placeholder="Location" sx={sx.autoComplete} />}
                            onChange={(_, value) => onChange(value)}
                            getOptionLabel={(option) => `${option.location_Code} - ${option.location_Name}`}
                            isOptionEqualToValue={(option, value) => option.location_Code === value.location_Code}
                            fullWidth
                            disabled
                            disableClearable
                            componentsProps={sx.automCompleteProp}
                          />
                        );
                      }}
                    />
                  </Stack>
                </Stack>

                {/* Concern Details */}
                <Stack mt={2}>
                  <Typography sx={sx.sectionHeader}>Concern Details:</Typography>
                </Stack>

                {/* Service Provider and Channel */}
                <Stack sx={sx.twoColsBox}>
                  {/* Service Provider */}
                  <Stack sx={sx.fieldTwoColsStack}>
                    <Typography sx={sx.fieldText}>Service Provider</Typography>
                    <Controller
                      control={control}
                      name="ServiceProvider"
                      render={({ field: { ref, value, onChange } }) => {
                        return (
                          <Autocomplete
                            ref={ref}
                            size="small"
                            value={value}
                            options={serviceProviderData?.value?.serviceProvider || []}
                            loading={serviceProviderIsLoading}
                            renderInput={(params) => <TextField {...params} placeholder="Select Service Provider" sx={sx.autoComplete} />}
                            onOpen={() => {
                              if (!serviceProviderIsSuccess)
                                getServiceProvider({
                                  Status: true,
                                });
                            }}
                            onChange={(_, value) => {
                              onChange(value);

                              setValue("ChannelId", null);
                              setValue("CategoryId", []);
                              setValue("SubCategoryId", []);
                            }}
                            getOptionLabel={(option) => option.serviceProviderName}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            fullWidth
                            disableClearable
                            disabled
                            componentsProps={sx.automCompleteProp}
                          />
                        );
                      }}
                    />
                  </Stack>

                  {/* Channel */}
                  <Stack sx={sx.fieldTwoColsStack}>
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
                            options={
                              editData
                                ? serviceProviderData?.value?.serviceProvider?.find((item) => item.id === watch("ServiceProvider")?.id)?.serviceChannel || []
                                : watch("ServiceProvider")?.serviceChannel || []
                            }
                            renderInput={(params) => <TextField {...params} placeholder="Select Channel" sx={sx.autoComplete} />}
                            onChange={(_, value) => {
                              onChange(value);

                              setValue("CategoryId", []);
                              setValue("SubCategoryId", []);
                            }}
                            getOptionLabel={(option) => option.channelName}
                            isOptionEqualToValue={(option, value) => option.channelId === value.channelId}
                            fullWidth
                            disabled
                            disableClearable
                            componentsProps={sx.automCompleteProp}
                          />
                        );
                      }}
                    />
                  </Stack>
                </Stack>

                {/* Category and Sub Category */}
                <Stack sx={sx.twoColsBox}>
                  {/* Category */}
                  <Stack sx={sx.fieldTwoColsStack}>
                    <Typography sx={sx.fieldText}>Category</Typography>
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
                            options={
                              editData
                                ? categoryData?.value?.category?.filter((item) => item.channelId === watch("ChannelId")?.channelId) || []
                                : categoryData?.value?.category?.filter((item) => item.channelId === watch("ChannelId")?.id) || []
                            }
                            loading={categoryIsLoading}
                            renderInput={(params) => <TextField {...params} placeholder="Select Category" sx={sx.autoComplete} />}
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
                            disabled
                            componentsProps={sx.automCompleteProp}
                          />
                        );
                      }}
                    />
                  </Stack>

                  {/* Sub Category */}
                  <Stack sx={sx.fieldTwoColsStack}>
                    <Typography sx={sx.fieldText}>Sub Category</Typography>
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
                            renderInput={(params) => <TextField {...params} placeholder="Select Sub Category" sx={sx.autoComplete} />}
                            onChange={(_, value) => {
                              onChange(value);
                            }}
                            getOptionLabel={(option) => option?.sub_Category_Description || ""}
                            isOptionEqualToValue={(option, value) => option?.subCategoryId === value?.subCategoryId}
                            getOptionDisabled={(option) => watch("SubCategoryId").some((item) => item.subCategoryId === option.subCategoryId)}
                            noOptionsText={"No sub category available"}
                            fullWidth
                            disableClearable
                            disabled
                            componentsProps={sx.automCompleteProp}
                          />
                        );
                      }}
                    />
                  </Stack>
                </Stack>

                {/* Date Needed */}
                <Stack sx={sx.fieldOneColStack}>
                  <Stack sx={sx.fieldTitleWithIconBox}>
                    <Typography sx={sx.fieldText}>Date Needed</Typography>
                    <FiberManualRecord sx={sx.requiredDot} />
                  </Stack>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <Controller
                      control={control}
                      name="DateNeeded"
                      render={({ field }) => {
                        return (
                          <DatePicker
                            value={field.value ? moment(field.value) : moment()}
                            onChange={(newValue) => {
                              const formattedValue = newValue ? moment(newValue).format("YYYY-MM-DD") : null;
                              field.onChange(formattedValue);
                            }}
                            slotProps={sx.datePickerSlotProp}
                            minDate={dateNeededValidation}
                            error={!!errors.DateNeeded}
                            helperText={errors.DateNeeded}
                            disabled={editData?.concern_Status === "" || editData?.concern_Status === "For Approval" ? false : true}
                          />
                        );
                      }}
                    />
                    {errors.DateNeeded && <Typography sx={{ color: "theme.palette.error.main" }}>{errors.DateNeeded.message}</Typography>}
                  </LocalizationProvider>
                </Stack>

                {/* Concern Details */}
                <Stack sx={sx.concern}>
                  {/* Concern */}
                  <Stack sx={sx.fieldTitleWithIconBox}>
                    <Typography sx={sx.fieldText}>Concern</Typography>
                    <FiberManualRecord sx={sx.requiredDot} />
                  </Stack>

                  <Controller
                    control={control}
                    name="Concern"
                    render={({ field: { ref, value, onChange } }) => {
                      return (
                        <TextField
                          inputRef={ref}
                          size="medium"
                          value={value}
                          placeholder="Enter Concern Details"
                          onChange={onChange}
                          error={!!errors.Concern}
                          InputProps={sx.textFieldInputProps}
                          InputLabelProps={sx.textFieldLabelProps}
                          disabled={editData?.concern_Status === "Ongoing" || editData?.concern_Status === "For Confirmation" || editData?.concern_Status === "Done" ? true : false}
                          autoComplete="off"
                          rows={6}
                          multiline
                        />
                      );
                    }}
                  />

                  {errors.Concern && <Typography sx={sx.textErrors}>{errors.Concern.message}</Typography>}
                </Stack>

                {/* Notes */}
                <Stack sx={sx.notes}>
                  <Typography sx={sx.fieldText}>Notes (Optional):</Typography>

                  <Controller
                    control={control}
                    name="Notes"
                    render={({ field: { ref, value, onChange } }) => {
                      return (
                        <TextField
                          inputRef={ref}
                          size="medium"
                          value={value}
                          placeholder="Add notes"
                          onChange={onChange}
                          InputProps={sx.textFieldInputProps}
                          InputLabelProps={sx.textFieldLabelProps}
                          autoComplete="off"
                          rows={6}
                          multiline
                          disabled={editData?.concern_Status === "" || editData?.concern_Status === "For Approval" ? false : true}
                          sx={{
                            width: "100%",
                          }}
                        />
                      );
                    }}
                  />
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

                      {(editData?.concern_Status === "For Approval" || editData?.concern_Status === "") && (
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

          <DialogActions
            sx={{
              position: "sticky",
              bottom: 0,
              backgroundColor: theme.palette.bgForm.black3,
            }}
          >
            <Button
              variant="contained"
              loading={isCreateEditRequestorConcernLoading || isCreateEditRequestorConcernFetching || isLoading}
              onClick={onCloseAction}
              sx={{
                ":disabled": {
                  backgroundColor: "none",
                  color: "black",
                },
                ...sx.cancelButton,
              }}
            >
              Close
            </Button>

            {editData?.concern_Status === "" || editData?.concern_Status === "For Approval" ? (
              <LoadingButton
                size="large"
                variant="contained"
                color="primary"
                type="submit"
                loading={isCreateEditRequestorConcernLoading || isCreateEditRequestorConcernFetching || isLoading || delAttachmentIsLoading || delAttachmentIsFetching}
                disabled={
                  !watch("ServiceProvider") ||
                  !watch("DateNeeded") ||
                  !watch("Concern") ||
                  moment(watch("DateNeeded")).format("MM-DD-YYYY") < moment(dateNeededValidation).format("MM-DD-YYYY") ||
                  (watch("Request_Type") === "Rework" && !watch("BackJobId"))
                }
              >
                Save Changes
              </LoadingButton>
            ) : (
              ""
            )}
          </DialogActions>
        </form>
      </Dialog>

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
    </>
  );
};

export default ConcernViewDialog;
