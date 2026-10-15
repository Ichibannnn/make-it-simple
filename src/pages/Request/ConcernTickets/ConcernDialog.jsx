import { useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";

import * as yup from "yup";
import moment from "moment";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { theme } from "../../../theme/theme";
import { LoadingButton } from "@mui/lab";
import { toast } from "sonner";

import Swal from "sweetalert2";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useCreateEditRequestorConcernMutation, useLazyGetBackjobTicketsQuery } from "../../../features/api_request/concerns/concernApi";
import { notificationApi } from "../../../features/api_notification/notificationApi";
import { notificationMessageApi } from "../../../features/api_notification_message/notificationMessageApi";
import { useLazyGetCompanyQuery } from "../../../features/api masterlist/company/companyApi";
import { useLazyGetBusinessUnitQuery } from "../../../features/api masterlist/business-unit/businessUnitApi";
import { useLazyGetDepartmentQuery } from "../../../features/api masterlist/department/departmentApi";
import { useLazyGetUnitQuery } from "../../../features/api masterlist/unit/unitApi";
import { useLazyGetSubUnitQuery } from "../../../features/api masterlist/sub-unit/subUnitApi";
import { useLazyGetLocationWithPaginationQuery } from "../../../features/api masterlist/location/locationApi";
import { useGetUsersQuery, useLazyGetUsersQuery } from "../../../features/user_management_api/user/userApi";
import { useLazyGetCategoryQuery } from "../../../features/api masterlist/category_api/categoryApi";
import { useLazyGetSubCategoryArrayQuery } from "../../../features/api masterlist/sub_category_api/subCategoryApi";
import { AddOutlined, Close, CloseOutlined, FiberManualRecord, RemoveCircleOutline, RestartAlt, ZoomIn, ZoomOut } from "@mui/icons-material";
import { useLazyGetServiceProviderWithParamsQuery } from "../../../features/api masterlist/service_provider/serviceProviderApi";
import ConcernMenuActions from "./ConcernMenuActions";
import { getAttachmentIcon } from "../../../utils/getAttachmentIcon";
import { formStyle as sx } from "../../Tickets/IssueHandlerConcerns/style/formStyle";

const ConcernDialog = ({ open, onClose }) => {
  const [userInformation, setUserInformation] = useState(null);

  // const [attachments, setAttachments] = useState([]);

  // const [selectedImage, setSelectedImage] = useState(null);
  // const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

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

  const [isLoading, setIsLoading] = useState(false);
  const dateNeededValidation = new moment();
  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));
  const userId = useSelector((state) => state?.user?.id);
  const userDetails = useSelector((state) => state?.user);

  const requestorSchema = yup.object().shape({
    RequestTransactionId: yup.string().nullable(),
    Concern: yup.array().of(yup.string().min(2, "Concern must be at least 2 characters long").trim().required("Concern cannot be empty or spaces only")).min(1, "At least one concern is required"),
    RequestConcernId: yup.string().nullable(),
    RequestAttachmentsFiles: yup.array().nullable(),

    Request_Type: yup.string().oneOf(["New Request", "Rework"], "Invalid Request Type").required("Request Type is required"),
    Severity: yup.string().oneOf(["Normal", "Urgent"], "Invalid Severity").required("Severity Type is required"),
    BackJobId: yup.object().notRequired(),
    Contact_Number: yup.string().matches(/^09\d{9}$/, {
      message: "Must start with 09 and be 12 digits long",
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
    IssueHandler: yup.string().notRequired(),

    AssetTag: yup.string().notRequired(),
    Notes: yup.string().notRequired(),
  });

  const dispatch = useDispatch();
  const fileInputRef = useRef();

  const [createEditRequestorConcern, { isLoading: isCreateEditRequestorConcernLoading, isFetching: isCreateEditRequestorConcernFetching }] = useCreateEditRequestorConcernMutation();

  const { data: userApiData, isSuccess: userApiIsSuccess } = useGetUsersQuery();
  const [getUser, { data: userData, isLoading: userIsLoading, isSuccess: userIsSuccess }] = useLazyGetUsersQuery();
  const [getBackjobTicket, { data: backjobTicketData, isLoading: backjobTicketIsLoading, isSuccess: backjobTicketIsSuccess }] = useLazyGetBackjobTicketsQuery();
  const [getCompany, { data: companyData, isLoading: companyIsLoading, isSuccess: companyIsSuccess }] = useLazyGetCompanyQuery();
  const [getBusinessUnit, { data: businessUnitData, isLoading: businessUnitIsLoading, isSuccess: businessUnitIsSuccess }] = useLazyGetBusinessUnitQuery();
  const [getDepartment, { data: departmentData, isLoading: departmentIsLoading, isSuccess: departmentIsSuccess }] = useLazyGetDepartmentQuery();
  const [getUnit, { data: unitData, isLoading: unitIsLoading, isSuccess: unitIsSuccess }] = useLazyGetUnitQuery();
  const [getSubUnit, { data: subUnitData, isLoading: subUnitIsLoading, isSuccess: subUnitIsSuccess }] = useLazyGetSubUnitQuery();
  const [getLocation, { data: locationData, isLoading: locationIsLoading, isSuccess: locationIsSuccess }] = useLazyGetLocationWithPaginationQuery();

  const [getServiceProvider, { data: serviceProviderData, isLoading: serviceProviderIsLoading, isSuccess: serviceProviderIsSuccess }] = useLazyGetServiceProviderWithParamsQuery();
  const [getCategory, { data: categoryData, isLoading: categoryIsLoading, isSuccess: categoryIsSuccess }] = useLazyGetCategoryQuery();
  const [getSubCategory, { data: subCategoryData, isLoading: subCategoryIsLoading, isSuccess: subCategoryIsSuccess }] = useLazyGetSubCategoryArrayQuery();

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
      RequestTransactionId: "",
      Concern: [""],
      RequestConcernId: "",
      RequestAttachmentsFiles: [],

      Request_Type: "New Request",
      Severity: "Normal",
      BackJobId: null,
      Contact_Number: "",

      UserId: null,
      CompanyId: null,
      BusinessUnitId: null,
      DepartmentId: null,
      UnitId: null,
      SubUnitId: null,
      LocationId: null,

      ServiceProvider: null,
      ChannelId: null,
      SubCategoryId: [],
      CategoryId: [],
      DateNeeded: moment().format("YYYY-MM-DD"),
      TargetDate: null,
      IssueHandler: "",

      AssetTag: "",
      Notes: "",
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "Concern",
  });

  // Show Concern #1 initially
  useEffect(() => {
    if (fields.length === 0) {
      append("");
    }
  }, [fields, append]);

  const onConcernFormSubmit = (formData) => {
    const payload = new FormData();

    payload.append("Request_Type", formData.Request_Type);
    payload.append("Severity", formData.Severity);
    payload.append("BackJobId", formData?.BackJobId === null ? "" : formData.BackJobId?.ticketConcernId);
    payload.append("UserId", formData.UserId?.id); // ~~~~ Requestor
    payload.append("Contact_Number", formData.Contact_Number);
    payload.append("ServiceProviderId", formData.ServiceProvider?.id);
    payload.append("ChannelId", formData.ChannelId ? formData.ChannelId?.channelId : 0);
    payload.append("DateNeeded", moment(formData.DateNeeded).format("YYYY-MM-DD"));
    payload.append("TargetDate", formData.TargetDate ? moment(formData.TargetDate).format("YYYY-MM-DD") : "");
    payload.append("AssignTo", formData.IssueHandler);
    payload.append("Notes", formData.Notes);

    // For Arrray Payload data
    const category = formData.CategoryId;
    for (let i = 0; i < category.length; i++) {
      payload.append(`AddRequestTicketCategories[${i}].ticketCategoryId`, "");
      payload.append(`AddRequestTicketCategories[${i}].categoryId`, category[i]?.id);
    }
    if (category.length === 0) {
      payload.append(`AddRequestTicketCategories[0].ticketCategoryId`, "");
      payload.append(`AddRequestTicketCategories[0].categoryId`, "");
    }
    const subCategory = formData.SubCategoryId;
    for (let i = 0; i < subCategory.length; i++) {
      payload.append(`AddRequestTicketSubCategories[${i}].ticketSubCategoryId`, "");
      payload.append(`AddRequestTicketSubCategories[${i}].subCategoryId`, subCategory[i]?.subCategoryId);
    }
    if (subCategory.length === 0) {
      payload.append(`AddRequestTicketSubCategories[0].ticketSubCategoryId`, "");
      payload.append(`AddRequestTicketSubCategories[0].subCategoryId`, "");
    }

    const concern = formData.Concern;
    for (let i = 0; i < concern.length; i++) {
      payload.append(`ListOfConcerns[${i}].concern`, concern[i]);
    }
    if (concern.length === 0) {
      payload.append(`ListOfConcerns[0].concern`, "");
    }

    const files = formData.RequestAttachmentsFiles;
    for (let i = 0; i < files.length; i++) {
      payload.append(`RequestAttachmentsFiles[${i}].ticketAttachmentId`, "");
      payload.append(`RequestAttachmentsFiles[${i}].attachment`, files[i]);
    }
    if (files.length === 0) {
      payload.append(`RequestAttachmentsFiles[0].ticketAttachmentId`, "");
      payload.append(`RequestAttachmentsFiles[0].attachment`, "");
    }

    // console.log("Payload Entries: ", [...payload.entries()]);

    if (formData?.Concern.length > 1) {
      // Without Message Box
      createEditRequestorConcern(payload)
        .unwrap()
        .then(() => {
          toast.success("Success!", {
            description: "Concern added successfully!",
            duration: 1500,
          });
          dispatch(notificationApi.util.resetApiState());
          dispatch(notificationMessageApi.util.resetApiState());
          setIsLoading(false);
          replace([{ value: "" }]);
          setTimeout(() => {
            reset({ Concern: [""] });
          }, 0);
          setAttachments([]);
          onClose();
        })
        .catch((err) => {
          console.log("Error: ", err);
          toast?.error("Error!", {
            description: err?.data?.error?.message,
            duration: 1500,
          });
        });
    } else {
      // With Message Box
      createEditRequestorConcern(payload)
        .unwrap()
        .then((res) => {
          console.log("Response: ", res);

          Swal.fire({
            title: "Success!",
            html: `Fresh Morning, ${res?.value?.requestorName}, ${res?.value?.requestorDepartment}.<br><br>
              <span style="color: gray; font-size: 13px;">
                Your request has been successfully created under Service Ticket #${moment(res?.value?.requestedDate).format("YYYY")}-${res?.value?.ticketConcernId}
                and forwarded to our ${res?.value?.channelName} for review. A member of the Support Team will contact you
                shortly to provide further assistance.
              </span>
              <br><br>
              <span style="color: gray; font-size: 13px;">
                Concern: ${res?.value?.concern}
              </span>
              `,
            icon: "success",
            color: "white",
            showCancelButton: true,
            background: "#111927",
            confirmButtonColor: "#9e77ed",
            confirmButtonText: `Copy`,
            cancelButtonText: "Close",
            cancelButtonColor: "#1C2536",
            allowOutsideClick: false,
            heightAuto: false,
            width: "30em",
            customClass: {
              container: "custom-container",
              title: "custom-title",
              htmlContainer: "custom-text",
              confirmButton: "custom-confirm-btn",
              cancelButton: "custom-cancel-btn",
            },
          }).then((result) => {
            if (result.isConfirmed) {
              console.log("result: ", result);

              const ticketMessage = `Fresh Morning, ${res?.value?.requestorName}, ${
                res?.value?.requestorDepartment
              }. Your request has been successfully created under Service Ticket #${moment(res?.value?.requestedDate).format("YYYY")}-${
                res?.value?.ticketConcernId
              } and forwarded to our ${res?.value?.channelName} for review. A member of the Support Team will contact you shortly to provide further assistance.\n\nConcern: ${res?.value?.concern}`;

              navigator.clipboard.writeText(ticketMessage).then(() => {
                Swal.fire({
                  title: "Copied!",
                  icon: "success",
                  color: "white",
                  background: "#111927",
                  text: `Copied to clipboard.`,
                  timer: 2000,
                  showConfirmButton: false,
                  heightAuto: false,
                  width: "30em",
                  customClass: {
                    container: "custom-container",
                    title: "custom-title",
                    htmlContainer: "custom-text",
                    confirmButton: "custom-confirm-btn",
                    cancelButton: "custom-cancel-btn",
                  },
                });
              });
            }
          });

          dispatch(notificationApi.util.resetApiState());
          dispatch(notificationMessageApi.util.resetApiState());

          setAttachments([]);
          setIsLoading(false);
          onCloseAction();
        })
        .catch((err) => {
          toast.error("Error!", {
            description: err.data.error.message,
            duration: 1500,
          });
        });
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

  const handleDeleteFile = (fileNameToDelete) => {
    setAttachments((prevFiles) => prevFiles.filter((fileName) => fileName !== fileNameToDelete));

    setValue(
      "RequestAttachmentsFiles",
      watch("RequestAttachmentsFiles").filter((file) => file.name !== fileNameToDelete.name),
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
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const isImageFile = (fileName) => {
    return /\.(jpg|jpeg|png)$/i.test(fileName);
  };

  const onCloseAction = () => {
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

  const assignCheckboxHandler = (event) => {
    if (event.target.checked === false) {
      setValue("TargetDate", null);
    }
  };

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

  useEffect(() => {
    if (watch("Request_Type") === "New Request") {
      setValue("BackJobId", null);
    }
  }, [watch("Request_Type")]);

  useEffect(() => {
    if (userApiIsSuccess && userApiData?.value?.users) {
      const getUserInfo = userApiData?.value?.users?.find((item) => item?.id === userId);

      if (getUserInfo) {
        setUserInformation(getUserInfo);
      } else {
        setUserInformation(null);
      }
    }
  }, [userApiIsSuccess, userApiData, userId]);

  useEffect(() => {
    if (!companyIsSuccess) getCompany();
    if (!businessUnitIsSuccess) getBusinessUnit();
    if (!departmentIsSuccess) getDepartment();
    if (!unitIsSuccess) getUnit();
    if (!subUnitIsSuccess) getSubUnit();
    if (!locationIsSuccess) getLocation();

    if (open && userInformation) {
      setValue("UserId", {
        id: userInformation?.id,
        fullname: userInformation?.fullname,
      });
    }

    setValue("CompanyId", {
      id: userInformation?.companyId,
      company_Code: userInformation?.company_Code,
      company_Name: userInformation?.company_Name,
    });
    setValue("BusinessUnitId", {
      id: userInformation?.businessUnitId,
      business_Code: userInformation?.businessUnit_Code,
      business_Name: userInformation?.businessUnit_Name,
    });
    setValue("DepartmentId", {
      id: userInformation?.departmentId,
      department_Code: userInformation?.department_Code,
      department_Name: userInformation?.department_Name,
    });

    setValue("UnitId", {
      id: userInformation?.unitId,
      unit_Code: userInformation?.unit_Code,
      unit_Name: userInformation?.unit_Name,
    });
    setValue("SubUnitId", {
      id: userInformation?.subUnitId,
      subUnit_Code: userInformation?.subUnit_Code,
      subUnit_Name: userInformation?.subUnit_Name,
    });
    setValue("LocationId", {
      // location_No: userInformation?.location_No,
      location_Code: userInformation?.location_Code,
      location_Name: userInformation?.location_Name,
    });
  }, [open, userInformation, companyIsLoading, businessUnitIsLoading, departmentIsLoading, unitIsLoading, subUnitIsLoading, locationIsLoading]);

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

  useEffect(() => {
    // if (!serviceProviderIsSuccess) getServiceProvider({ Status: true });

    if (userDetails?.userRoleName === "Helpdesk Associate" || userDetails?.userRoleName === "Helpdesk Associate / Technician") {
      setValue("ServiceProvider", {
        id: userDetails?.serviceProviders?.[0]?.id,
        serviceProviderName: userDetails?.serviceProviders?.[0]?.serviceProviderName,
      });

      setValue("ChannelId", {
        channelId: userDetails?.channels?.[0]?.channelId,
        channelName: userDetails?.channels?.[0]?.channelName,
      });

      getServiceProvider({ Status: true });
    } else {
      setValue("ServiceProvider", null);
      setValue("ChannelId", null);
    }
  }, [userDetails]);

  if (!watch("UserId")) {
    return (
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
        sx={{ borderRadius: "none", padding: 0, backdropFilter: "blur(5px)" }}
        PaperProps={{ style: { overflow: "auto" } }}
      >
        <DialogContent sx={{ paddingBottom: 8 }}>
          <Stack direction="column" spacing={3} sx={{ padding: 2, minHeight: "700px" }}>
            {/* Title */}
            <Skeleton variant="text" width={200} height={30} />

            {/* First row: Request Type & Severity */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Skeleton height={50} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Skeleton height={50} />
              </Grid>
            </Grid>

            {/* Section: Requestor Details */}
            <Skeleton variant="text" width={160} height={25} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Skeleton height={50} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Skeleton height={50} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Skeleton height={50} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Skeleton height={50} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Skeleton height={50} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Skeleton height={50} />
              </Grid>
            </Grid>

            {/* Section: Concern Details */}
            <Skeleton variant="text" width={160} height={25} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Skeleton height={50} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Skeleton height={50} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Skeleton height={50} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Skeleton height={50} />
              </Grid>
            </Grid>

            {/* Date + Asset Tag */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Skeleton height={50} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Skeleton height={50} />
              </Grid>
            </Grid>

            {/* Concern Details (Textarea) */}
            <Skeleton height={120} />

            {/* Actions */}
            <Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}>
              <Skeleton width={100} height={40} />
              <Skeleton width={100} height={40} />
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    );
  }

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
        sx={{ borderRadius: "none", padding: 0, backdropFilter: "blur(5px)" }}
        PaperProps={{ style: { overflow: "auto" } }}
      >
        <form onSubmit={handleSubmit(onConcernFormSubmit)}>
          <DialogContent>
            <Stack sx={{ padding: 1, minHeight: "700px", gap: 1 }}>
              {/* Header */}
              <Stack mb={1}>
                <Typography sx={sx.titleText}>New Request</Typography>
                <Typography sx={sx.captionText}>Fill out the form below to submit your concern.</Typography>
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
                      <Select {...field} displayEmpty size="small" inputProps={{ "aria-label": "Without label" }} sx={sx.select}>
                        <MenuItem value="New Request" sx={sx.menuItem}>
                          New Request
                        </MenuItem>
                        <MenuItem value="Rework" sx={sx.menuItem}>
                          Rework
                        </MenuItem>
                      </Select>
                    )}
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
                            componentsProps={sx.automCompleteProp}
                          />
                        );
                      }}
                    />
                  </Stack>
                )}

                {/* Severity */}
                <Stack sx={sx.fieldOneColStack}>
                  <Stack sx={sx.fieldTitleWithIconBox}>
                    <Typography sx={sx.fieldText}>Severity</Typography>
                    <FiberManualRecord sx={sx.requiredDot} />
                  </Stack>

                  <Controller
                    name="Severity"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} displayEmpty size="small" placeholder="Select Severity" inputProps={{ "aria-label": "Without label" }} sx={sx.select}>
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
                  {/* Requestor Name */}
                  <Stack sx={sx.fieldTwoColsStack}>
                    <Stack sx={sx.fieldTitleWithIconBox}>
                      <Typography sx={sx.fieldText}>Requestor Name</Typography>
                      <FiberManualRecord sx={sx.requiredDot} />
                    </Stack>

                    <Controller
                      control={control}
                      name="UserId"
                      render={({ field: { ref, value, onChange } }) => {
                        return (
                          <Autocomplete
                            ref={ref}
                            size="small"
                            value={value}
                            options={
                              userDetails?.userRoleName === "Helpdesk Associate" || userDetails?.userRoleName === "Helpdesk Associate / Technician" || userDetails?.userRoleName === "Technician"
                                ? userData?.value?.users || []
                                : userData?.value?.users?.filter((item) => item?.departmentId === watch("DepartmentId")?.id) || []
                            }
                            loading={userIsLoading}
                            renderInput={(params) => <TextField {...params} placeholder="Requestor" sx={sx.autoComplete} />}
                            onOpen={() => {
                              if (!userIsSuccess)
                                getUser({
                                  Status: true,
                                });
                            }}
                            onChange={(_, value) => {
                              setValue("ChargingCode", {
                                code: value?.oneChargingCode,
                                name: value?.oneChargingName,
                              });
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
                            disableClearable
                            componentsProps={sx.automCompleteProp}
                          />
                        );
                      }}
                    />
                  </Stack>

                  {/* Conctact Number */}
                  <Stack sx={sx.fieldTwoColsStack}>
                    <Typography sx={sx.fieldText}>Contact Number (Optional)</Typography>

                    <Controller
                      control={control}
                      name="Contact_Number"
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

                          onChange(input || "");
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
                            fullWidth
                          />
                        );
                      }}
                    />
                  </Stack>
                </Stack>

                {/* Company and Business Unit */}
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
                            getOptionLabel={(option) => `${option?.company_Code} - ${option?.company_Name}`}
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
                            options={businessUnitData?.value?.businessUnit?.filter((item) => item.companyId === watch("CompanyId")?.id) || []}
                            loading={businessUnitIsLoading}
                            renderInput={(params) => <TextField {...params} placeholder="Business Unit" sx={sx.autoComplete} />}
                            onChange={(_, value) => onChange(value)}
                            getOptionLabel={(option) => `${option.business_Code} - ${option.business_Name}`}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            fullWidth
                            disablePortal
                            disabled
                            componentsProps={sx.automCompleteProp}
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

                  {/* Unit */}
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
                            options={unitData?.value?.unit?.filter((item) => item.departmentId === watch("DepartmentId")?.id) || []}
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

                {/*  Sub Unit and Location*/}
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
                            options={locationData?.value?.location?.filter((item) => item?.subUnits?.some((subUnitItem) => subUnitItem?.subUnitId === watch("SubUnitId")?.id)) || []}
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
                  <Typography sx={sx.sectionHeader}>Concern Details</Typography>
                </Stack>

                {/* Service Provider and Channel */}
                <Stack sx={sx.twoColsBox}>
                  {/* Service Provider */}
                  <Stack sx={sx.fieldTwoColsStack}>
                    <Stack sx={sx.fieldTitleWithIconBox}>
                      <Typography sx={sx.fieldText}>Service Provider</Typography>
                      <FiberManualRecord sx={sx.requiredDot} />
                    </Stack>

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
                            componentsProps={sx.automCompleteProp}
                          />
                        );
                      }}
                    />
                  </Stack>

                  {/* Channel */}
                  <Stack sx={sx.fieldTwoColsStack}>
                    <Stack sx={sx.fieldTitleWithIconBox}>
                      <Typography sx={sx.fieldText}>Channel</Typography>
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
                            options={serviceProviderData?.value?.serviceProvider?.[0]?.serviceChannel || []}
                            renderInput={(params) => <TextField {...params} placeholder="Select Channel" sx={sx.autoComplete} />}
                            onChange={(_, value) => {
                              onChange(value);

                              setValue("CategoryId", []);
                              setValue("SubCategoryId", []);
                            }}
                            getOptionLabel={(option) => option.channelName}
                            isOptionEqualToValue={(option, value) => option.channelId === value.channelId}
                            fullWidth
                            disabled={!watch("ServiceProvider")}
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
                            options={categoryData?.value?.category.filter((item) => item.channelId === watch("ChannelId")?.channelId) || []}
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
                              getSubCategory({
                                CategoryId: categoryIdParams,
                              });

                              if (watch("CategoryId").length === 0) {
                                setValue("SubCategoryId", []);
                              }
                            }}
                            getOptionLabel={(option) => option.category_Description || ""}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            getOptionDisabled={(option) => watch("CategoryId").some((item) => item.id === option.id)}
                            fullWidth
                            disabled={!watch("ChannelId")}
                            disableClearable
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
                            value={value || []}
                            options={subCategoryData?.value || []}
                            loading={subCategoryIsLoading}
                            renderInput={(params) => <TextField {...params} placeholder="Select Sub Category" sx={sx.autoComplete} />}
                            onChange={(_, value) => {
                              onChange(value || []);
                            }}
                            getOptionLabel={(option) => option?.sub_Category_Description || ""}
                            isOptionEqualToValue={(option, value) => option?.subCategoryId === value?.subCategoryId}
                            getOptionDisabled={(option) => watch("SubCategoryId").some((item) => item.subCategoryId === option.subCategoryId)}
                            noOptionsText={"No sub category available"}
                            fullWidth
                            disableClearable
                            disabled={!watch("ChannelId") || watch("CategoryId")?.length === 0}
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

                  {fields.map((field, index) => (
                    <Stack key={field.id} direction="row">
                      <Controller
                        control={control}
                        name={`Concern.${index}`}
                        render={({ field: { ref, value, onChange } }) => (
                          <TextField
                            inputRef={ref}
                            value={value}
                            placeholder={`Concern #${index + 1}`}
                            onChange={onChange}
                            error={!!errors.Concern?.[index]}
                            multiline
                            rows={4}
                            InputProps={{
                              endAdornment:
                                fields.length > 1 ? (
                                  <InputAdornment position="end">
                                    <IconButton edge="end" onClick={() => remove(index)} size="small">
                                      <RemoveCircleOutline fontSize="small" />
                                    </IconButton>
                                  </InputAdornment>
                                ) : null,
                              style: {
                                fontSize: "13px",
                              },
                            }}
                            sx={{ width: "100%" }}
                          />
                        )}
                      />
                    </Stack>
                  ))}

                  {typeof errors.Concern === "string" && (
                    <Typography color="error" sx={{ fontSize: "12px" }}>
                      {errors.Concern}
                    </Typography>
                  )}

                  {Array.isArray(errors.Concern) &&
                    errors.Concern.map(
                      (err, idx) =>
                        err && (
                          <Typography key={idx} color="error" sx={{ fontSize: "12px" }}>
                            Concern #{idx + 1}: {err.message}
                          </Typography>
                        ),
                    )}

                  <Stack sx={{ width: "100%", mt: 1 }}>
                    <Button size="small" variant="outlined" onClick={() => append("")} startIcon={<AddOutlined />}>
                      Add Concern
                    </Button>
                  </Stack>
                </Stack>

                {/* Notes */}
                <Stack sx={sx.notes}>
                  <Typography sx={sx.fieldText}>Notes (Optional)</Typography>

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
                          rows={4}
                          multiline
                          sx={{
                            width: "100%",
                          }}
                        />
                      );
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
                  name="RequestAttachmentsFiles"
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
              variant="contained"
              disabled={isCreateEditRequestorConcernLoading || isCreateEditRequestorConcernFetching || isLoading}
              onClick={() => {
                onCloseAction();
              }}
              sx={sx.cancelButton}
            >
              Cancel
            </LoadingButton>

            <LoadingButton
              size="large"
              variant="contained"
              color="primary"
              type="submit"
              loading={isCreateEditRequestorConcernLoading || isCreateEditRequestorConcernFetching || isLoading}
              disabled={
                !watch("ServiceProvider") ||
                !watch("ChannelId") ||
                watch("CategoryId")?.length === 0 ||
                watch("Concern")?.length === 0 ||
                !watch("Request_Type") ||
                !watch("Severity") ||
                !watch("CompanyId") ||
                !watch("BusinessUnitId") ||
                !watch("DepartmentId") ||
                !watch("UnitId") ||
                !watch("SubUnitId") ||
                !watch("LocationId") ||
                !watch("DateNeeded") ||
                (watch("Request_Type") === "Rework" && !watch("BackJobId")) ||
                (watch("IssueHandler") && !watch("TargetDate")) ||
                (watch("IssueHandler") && !watch("ChannelId")) ||
                errors.Concern ||
                watch("Concern")?.some((c) => !c?.trim())
              }
            >
              Submit
            </LoadingButton>
          </DialogActions>
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

export default ConcernDialog;

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
