// Modified
import { useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Select,
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
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import { notificationApi } from "../../../features/api_notification/notificationApi";
import { notificationMessageApi } from "../../../features/api_notification_message/notificationMessageApi";
import { useCreateEditRequestorConcernMutation, useLazyGetBackjobTicketsQuery } from "../../../features/api_request/concerns/concernApi";
import { useGetUsersQuery, useLazyGetUsersQuery } from "../../../features/user_management_api/user/userApi";
import { useLazyGetCategoryQuery } from "../../../features/api masterlist/category_api/categoryApi";
import { useLazyGetSubCategoryArrayQuery } from "../../../features/api masterlist/sub_category_api/subCategoryApi";
import { AddOutlined, Close, CloseOutlined, FiberManualRecord, RemoveCircleOutline, RestartAlt, ZoomIn, ZoomOut } from "@mui/icons-material";
import { useLazyGetServiceProviderQuery } from "../../../features/api masterlist/service_provider/serviceProviderApi";
import { getAttachmentIcon } from "../../../utils/getAttachmentIcon";

const AddTicketDialog = ({ open, onClose }) => {
  const [attachments, setAttachments] = useState([]);
  // const [userInformation, setUserInformation] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));
  const userId = useSelector((state) => state?.user?.id);
  const userDetails = useSelector((state) => state?.user);

  // For viewing of attachment picture
  const [zoom, setZoom] = useState(1);
  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 4;
  const ZOOM_STEP = 0.25;

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const positionStartRef = useRef({ x: 0, y: 0 });

  const requestorSchema = yup.object().shape({
    RequestTransactionId: yup.string().nullable(),
    Concern: yup.array().of(yup.string().min(2, "Ticket must be at least 2 characters long").trim().required("Concern cannot be empty or spaces only")).min(1, "At least one ticket is required"),
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
    ServiceProvider: yup.object().required().label("Service Provider"),
    ChannelId: yup.object().notRequired(),
    CategoryId: yup.array(),
    SubCategoryId: yup.array(),
    DateNeeded: yup.date().notRequired(),
    TargetDate: yup.date().notRequired(),
    IssueHandler: yup.string().notRequired(),

    Notes: yup.string().notRequired(),
  });

  const dispatch = useDispatch();
  const fileInputRef = useRef();

  const [createEditRequestorConcern, { isLoading: isCreateEditRequestorConcernLoading, isFetching: isCreateEditRequestorConcernFetching }] = useCreateEditRequestorConcernMutation();

  const { data: userApiData, isSuccess: userApiIsSuccess } = useGetUsersQuery();
  const [getUser, { data: userData, isLoading: userIsLoading, isSuccess: userIsSuccess }] = useLazyGetUsersQuery();
  const [getBackjobTicket, { data: backjobTicketData, isLoading: backjobTicketIsLoading, isSuccess: backjobTicketIsSuccess }] = useLazyGetBackjobTicketsQuery();

  const [getServiceProvider, { data: serviceProviderData, isLoading: serviceProviderIsLoading, isSuccess: serviceProviderIsSuccess }] = useLazyGetServiceProviderQuery();
  const [getCategory, { data: categoryData, isLoading: categoryIsLoading, isSuccess: categoryIsSuccess }] = useLazyGetCategoryQuery();
  const [getSubCategory, { data: subCategoryData, isLoading: subCategoryIsLoading }] = useLazyGetSubCategoryArrayQuery();

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
      IssueHandler: userId,

      Notes: "",
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "Concern",
  });

  const defaultValue = {
    Request_Type: "New Request",
    Severity: "Normal",
    BackJobId: null,
    UserId: {
      id: userDetails?.id || "",
      fullname: userDetails?.fullname || "",
    },
    Contact_Number: "",
    DateNeeded: null,
    CategoryId: [],
    SubCategoryId: [],
    TargetDate: null,
    IssueHandler: userId,

    Concern: [""],
    Notes: "",
  };

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
    payload.append("DateNeeded", "");
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
      console.log("i: ", i);

      payload.append(`RequestAttachmentsFiles[${i}].ticketAttachmentId`, "");
      payload.append(`RequestAttachmentsFiles[${i}].attachment`, files[i]);
    }

    if (files.length === 0) {
      payload.append(`RequestAttachmentsFiles[0].ticketAttachmentId`, "");
      payload.append(`RequestAttachmentsFiles[0].attachment`, "");
    }

    // console.log("Payload Entries: ", [...payload.entries()]);

    createEditRequestorConcern(payload)
      .unwrap()
      .then(() => {
        toast.success("Success!", {
          description: "Ticket added successfully!",
          duration: 1500,
        });
        dispatch(notificationApi.util.resetApiState());
        dispatch(notificationMessageApi.util.resetApiState());
        reset(defaultValue);
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
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const isImageFile = (fileName) => {
    return /\.(jpg|jpeg|png)$/i.test(fileName);
  };

  const onCloseAction = () => {
    reset({
      UserId: {
        id: userDetails?.id || "",
        fullname: userDetails?.fullname || "",
      },
      IssueHandler: userId,
    });
    setAttachments([]);
    onClose();
  };

  useEffect(() => {
    if (watch("Request_Type") === "New Request") {
      setValue("BackJobId", null);
    }
  }, [watch("Request_Type")]);

  useEffect(() => {
    if (open && userDetails) {
      setValue("UserId", {
        id: userDetails?.id,
        fullname: userDetails?.fullname,
      });
    }
  }, [open, userDetails]);

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
    if (watch("IssueHandler") && userDetails) {
      setValue("ServiceProvider", {
        id: userDetails?.serviceProviders?.[0]?.id,
        serviceProviderName: userDetails?.serviceProviders?.[0]?.serviceProviderName,
      });

      setValue("ChannelId", {
        channelId: userDetails?.channels?.[0]?.channelId,
        channelName: userDetails?.channels?.[0]?.channelName,
      });
    } else {
      setValue("ServiceProvider", null);
      setValue("ChannelId", null);
    }
  }, [watch("IssueHandler"), userDetails]);

  // console.log("Token: ", userDetails);
  // console.log("subCategoryData: ", subCategoryData);

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
                {/* REQUEST TYPE */}
                <Stack
                  width="100%"
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 1,
                  }}
                >
                  <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
                    <Typography sx={{ fontSize: "11px" }}>Request Type</Typography>
                    <FiberManualRecord color="error" sx={{ fontSize: "10px" }} />
                  </Stack>

                  <Controller
                    name="Request_Type"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} displayEmpty size="small" inputProps={{ "aria-label": "Without label" }} sx={{ width: "100%", fontSize: "11px" }}>
                        <MenuItem value="New Request" sx={{ fontSize: "11px" }}>
                          New Request
                        </MenuItem>
                        <MenuItem value="Rework" sx={{ fontSize: "11px" }}>
                          Rework
                        </MenuItem>
                      </Select>
                    )}
                  />
                </Stack>

                {watch("Request_Type") === "Rework" && (
                  <Stack sx={{ width: "100%", mb: 1 }}>
                    <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
                      <Typography sx={{ fontSize: "11px" }}>Ticket Number</Typography>
                      <FiberManualRecord color="error" sx={{ fontSize: "10px" }} />
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
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Select Ticket Number"
                                sx={{
                                  "& .MuiInputBase-input": { fontSize: "11px" },
                                }}
                              />
                            )}
                            onOpen={() => {
                              if (!backjobTicketIsSuccess) getBackjobTicket();
                            }}
                            onChange={(_, value) => onChange(value)}
                            getOptionLabel={(option) => `${option?.ticketConcernId} - ${option.concern}`}
                            noOptionsText={"No tickets available for backjob request"}
                            isOptionEqualToValue={(option, value) => option.ticketConcernId === value.ticketConcernId}
                            fullWidth
                            disablePortal
                            disableClearable
                            componentsProps={{
                              popper: {
                                sx: {
                                  "& .MuiAutocomplete-listbox": {
                                    fontSize: "11px",
                                  },
                                },
                              },
                            }}
                          />
                        );
                      }}
                    />
                  </Stack>
                )}

                {/* SEVERITY*/}
                <Stack
                  width="100%"
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 1,
                  }}
                >
                  <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
                    <Typography sx={{ fontSize: "11px" }}>Severity</Typography>
                    <FiberManualRecord color="error" sx={{ fontSize: "10px" }} />
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
                        sx={{
                          width: "100%",
                          fontSize: "11px",
                          "& .MuiSelect-select": {
                            color: "#fff",
                          },
                        }}
                      >
                        <MenuItem value="Normal" sx={{ fontSize: "11px" }}>
                          Normal
                        </MenuItem>

                        <MenuItem value="Urgent" sx={{ fontSize: "11px" }}>
                          Urgent
                        </MenuItem>
                      </Select>
                    )}
                  />
                </Stack>

                {/* Ticket Information */}
                <Typography
                  sx={{
                    fontSize: "13px",
                    color: theme.palette.primary.main,
                    mt: 2,
                  }}
                >
                  Ticket Details
                </Typography>

                <Stack sx={{ width: "100%", mt: 1, display: "none" }}>
                  {/* Self-Assign */}
                  <Controller
                    name="IssueHandler"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked
                            onChange={(e) => {
                              onChange(e.target.checked ? userId : "");
                            }}
                          />
                        }
                        label="Self-Assign (Note: This will assign the concern/ticket to you with the target date)"
                        sx={{
                          "& .MuiFormControlLabel-label": {
                            fontSize: "14px",
                            fontStyle: "italic",
                          },
                        }}
                      />
                    )}
                  />
                </Stack>

                <Stack direction="row" sx={{ width: "100%" }}>
                  <Stack direction={isScreenSmall ? "column" : "row"} sx={{ width: "100%", gap: 1 }}>
                    <Stack sx={{ width: isScreenSmall ? "100%" : "50%" }}>
                      {/* Service Provider */}
                      <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
                        <Typography sx={{ fontSize: "11px" }}>Service Provider</Typography>
                        <FiberManualRecord color="error" sx={{ fontSize: "10px" }} />
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
                              options={watch("IssueHandler") ? userDetails?.serviceProviders : serviceProviderData?.value?.serviceProvider || []}
                              loading={serviceProviderIsLoading}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Select Service Provider"
                                  sx={{
                                    "& .MuiInputBase-input": {
                                      fontSize: "11px",
                                    },
                                  }}
                                />
                              )}
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
                              sx={{
                                flex: 2,
                              }}
                              fullWidth
                              componentsProps={{
                                popper: {
                                  sx: {
                                    "& .MuiAutocomplete-listbox": {
                                      fontSize: "12px",
                                    },
                                  },
                                },
                              }}
                            />
                          );
                        }}
                      />
                    </Stack>

                    {/* Channel */}
                    <Stack sx={{ width: isScreenSmall ? "100%" : "50%" }}>
                      <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
                        <Typography sx={{ fontSize: "11px" }}>Channel</Typography>
                        <FiberManualRecord color="error" sx={{ fontSize: "10px" }} />
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
                              options={watch("IssueHandler") ? userDetails?.channels : watch("ServiceProvider")?.serviceChannel || []}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Select Channel"
                                  sx={{
                                    "& .MuiInputBase-input": {
                                      fontSize: "11px",
                                    },
                                  }}
                                />
                              )}
                              onChange={(_, value) => {
                                onChange(value);

                                setValue("CategoryId", []);
                                setValue("SubCategoryId", []);
                              }}
                              getOptionLabel={(option) => option.channelName}
                              isOptionEqualToValue={(option, value) => option.channelId === value.channelId}
                              sx={{
                                flex: 2,
                              }}
                              fullWidth
                              disabled={!watch("ServiceProvider")}
                              componentsProps={{
                                popper: {
                                  sx: {
                                    "& .MuiAutocomplete-listbox": {
                                      fontSize: "12px",
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
                </Stack>

                <Stack direction="row" sx={{ width: "100%", mt: 1 }}>
                  <Stack direction={isScreenSmall ? "column" : "row"} sx={{ width: "100%", gap: 1 }}>
                    {/* Category */}
                    <Stack sx={{ width: isScreenSmall ? "100%" : "50%" }}>
                      <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
                        <Typography sx={{ fontSize: "11px" }}>Category</Typography>
                        <FiberManualRecord color="error" sx={{ fontSize: "10px" }} />
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
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Select Category"
                                  sx={{
                                    "& .MuiInputBase-input": {
                                      fontSize: "11px",
                                    },
                                  }}
                                />
                              )}
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
                              sx={{
                                flex: 2,
                              }}
                              fullWidth
                              disabled={!watch("ChannelId")}
                              disablePortal
                              disableClearable
                              componentsProps={{
                                popper: {
                                  sx: {
                                    "& .MuiAutocomplete-listbox": {
                                      fontSize: "11px",
                                    },
                                  },
                                },
                              }}
                            />
                          );
                        }}
                      />
                    </Stack>

                    {/* Sub Category */}
                    <Stack sx={{ width: isScreenSmall ? "100%" : "50%" }}>
                      <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
                        <Typography sx={{ fontSize: "11px" }}>Sub Category</Typography>
                        <FiberManualRecord color="error" sx={{ fontSize: "10px" }} />
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
                              value={value || []}
                              options={subCategoryData?.value || []}
                              loading={subCategoryIsLoading}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Select Sub Category"
                                  sx={{
                                    "& .MuiInputBase-input": {
                                      fontSize: "11px",
                                    },
                                  }}
                                />
                              )}
                              renderOption={(props, option) => {
                                const { key, ...rest } = props; // avoid passing the label-based key
                                return (
                                  <li key={option.subCategoryId} {...rest}>
                                    {option.sub_Category_Description}
                                  </li>
                                );
                              }}
                              renderTags={(tagValue, getTagProps) =>
                                tagValue.map((option, index) => {
                                  const { key, ...tagProps } = getTagProps({ index });
                                  return (
                                    <Chip
                                      key={option.subCategoryId}
                                      size="small"
                                      label={`${option.category_Description?.trim()} - ${option.sub_Category_Description?.trim()}`}
                                      sx={{ fontSize: "11px" }}
                                      {...tagProps}
                                    />
                                  );
                                })
                              }
                              onChange={(_, value) => {
                                onChange(value || []);
                              }}
                              getOptionLabel={(option) => option?.sub_Category_Description || ""}
                              isOptionEqualToValue={(option, value) => option?.subCategoryId === value?.subCategoryId}
                              getOptionDisabled={(option) => watch("SubCategoryId").some((item) => item.subCategoryId === option.subCategoryId)}
                              noOptionsText={"No sub category available"}
                              sx={{
                                flex: 2,
                              }}
                              fullWidth
                              disablePortal
                              disableClearable
                              disabled={!watch("ChannelId") || watch("CategoryId")?.length === 0}
                              componentsProps={{
                                popper: {
                                  sx: {
                                    "& .MuiAutocomplete-listbox": {
                                      fontSize: "11px",
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
                </Stack>

                <Stack direction="row" sx={{ width: "100%", mt: 1 }}>
                  {/* Target Date */}
                  <Stack direction={isScreenSmall ? "column" : "row"} sx={{ width: "100%", gap: 1 }}>
                    <Stack sx={{ width: "100%" }}>
                      <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
                        <Typography sx={{ fontSize: "11px" }}>Target Date</Typography>
                        <FiberManualRecord color="error" sx={{ fontSize: "10px" }} />
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
                              slotProps={{
                                textField: {
                                  variant: "outlined",
                                  sx: {
                                    "& .MuiInputBase-input": {
                                      padding: "8.5px 14px",
                                    },
                                    "& .MuiOutlinedInput-root": {
                                      fontSize: "11px",
                                    },
                                  },
                                },
                              }}
                              minDate={new moment()}
                              error={!!errors.TargetDate}
                              helperText={errors.TargetDate ? errors.TargetDate.message : null}
                              disabled={!watch("IssueHandler")}
                            />
                          )}
                        />
                        {errors.TargetDate && <Typography>{errors.TargetDate.message}</Typography>}
                      </LocalizationProvider>
                    </Stack>
                  </Stack>
                </Stack>

                {/* Description */}
                <Stack
                  sx={{
                    width: "100%",
                    paddingTop: 2,
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  {/* Ticket Description */}
                  <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
                    <Typography sx={{ fontSize: "11px" }}>Ticket Description</Typography>
                    <FiberManualRecord color="error" sx={{ fontSize: "10px" }} />
                  </Stack>

                  {fields.map((field, index) => (
                    <Stack key={field.id} direction="row" alignItems="flex-start" sx={{ width: "100%", mt: 1 }}>
                      <Controller
                        control={control}
                        name={`Concern.${index}`}
                        render={({ field: { ref, value, onChange } }) => (
                          <TextField
                            inputRef={ref}
                            value={value}
                            placeholder={`Ticket #${index + 1}`}
                            onChange={onChange}
                            error={!!errors.Concern?.[index]}
                            multiline
                            rows={3}
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
                                fontSize: "11px",
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
                            Ticket #{idx + 1}: {err.message}
                          </Typography>
                        ),
                    )}

                  <Stack sx={{ width: "100%", mt: 1 }}>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => append("")}
                      startIcon={<AddOutlined />}
                      sx={{
                        borderRadius: "0%",
                        ":disabled": {
                          backgroundColor: "none",
                          color: "black",
                        },
                      }}
                    >
                      <Typography sx={{ fontSize: "11px" }}>Add Ticket</Typography>
                    </Button>
                  </Stack>
                </Stack>

                <Stack
                  width="100%"
                  sx={{
                    paddingTop: 2,
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography sx={{ fontSize: "11px" }}>Notes (Optional)</Typography>
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
                          sx={{
                            width: "100%",
                          }}
                          InputProps={{
                            style: {
                              fontSize: "11px",
                            },
                          }}
                          InputLabelProps={{
                            style: {
                              fontSize: "11px",
                            },
                          }}
                          autoComplete="off"
                          rows={3}
                          multiline
                        />
                      );
                    }}
                  />
                </Stack>

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
                      gap: 1.5,
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
                      }}
                    />
                    {/* Image thumbnails, grid layout */}
                    {imageAttachments.length > 0 && (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                        {imageAttachments.map((fileName, index) => (
                          <ImageAttachmentCard key={`img-${index}`} fileName={fileName} onView={handleViewImage} onDelete={handleDeleteFile} />
                        ))}
                      </Box>
                    )}

                    {/* Non-image files, row list */}
                    {fileAttachments.length > 0 && (
                      <Stack sx={{ width: "100%", gap: 1 }}>
                        {fileAttachments.map((fileName, index) => (
                          <FileAttachmentRow key={`file-${index}`} fileName={fileName} onDelete={handleDeleteFile} />
                        ))}
                      </Stack>
                    )}
                  </Stack>

                  <Controller
                    control={control}
                    name="RequestAttachmentsFiles"
                    render={({ field: { onChange, value } }) => (
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".png,.jpg,.jpeg,.docx,.pdf,.xls,.xlsx"
                        style={{ display: "none" }}
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
              disabled={isCreateEditRequestorConcernLoading || isCreateEditRequestorConcernFetching}
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

            <LoadingButton
              size="small"
              variant="contained"
              color="primary"
              type="submit"
              loading={isCreateEditRequestorConcernLoading || isCreateEditRequestorConcernFetching}
              disabled={
                !watch("ServiceProvider") ||
                watch("Concern")?.length === 0 ||
                !watch("Request_Type") ||
                !watch("Severity") ||
                (watch("Request_Type") === "Rework" && !watch("BackJobId")) ||
                !watch("TargetDate") ||
                !watch("ChannelId") ||
                watch("CategoryId")?.length === 0 ||
                watch("SubCategoryId")?.length === 0 ||
                errors.Concern ||
                watch("Concern")?.some((c) => !c?.trim())
              }
            >
              <Typography sx={{ fontSize: "11px" }}>Submit</Typography>
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

            {/* Fixed viewport — no native scroll, so wheel events go straight
                to handleWheelZoom instead of competing with browser scroll.
                Panning is done manually via drag + CSS transform below. */}
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
          <Button onClick={handleViewClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddTicketDialog;

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
    <Box
      sx={{
        position: "relative",
        width: 120,
        height: 116,
        borderRadius: "10px",
        overflow: "hidden",
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.bgForm?.black3 || "#1A202C",
        cursor: "pointer",
      }}
      onClick={() => onView(fileName.file)}
    >
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(fileName);
        }}
        sx={{
          position: "absolute",
          top: 4,
          right: 4,
          zIndex: 2,
          padding: "2px",
          backgroundColor: "rgba(0,0,0,0.55)",
          "&:hover": { backgroundColor: "rgba(0,0,0,0.75)" },
        }}
      >
        <CloseOutlined sx={{ fontSize: 14, color: "#fff" }} />
      </IconButton>

      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: 80,
          backgroundColor: "rgba(255,255,255,0.04)",
        }}
      >
        {previewUrl && (
          <Box
            component="img"
            src={previewUrl}
            alt={fileName.name}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgLoaded(true)}
            sx={{
              width: "100%",
              height: 80,
              objectFit: "cover",
              display: "block",
              opacity: showSpinner ? 0 : 1,
              transition: "opacity 0.15s ease",
            }}
          />
        )}

        {showSpinner && (
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
        <Typography
          noWrap
          sx={{
            fontSize: "10px",
            color: theme.palette.text.secondary,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "block",
          }}
        >
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
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        padding: "8px 10px",
        borderRadius: "8px",
        backgroundColor: theme.palette.bgForm?.black3 || "#1A202C",
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>{getAttachmentIcon(fileName)}</Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography noWrap sx={{ fontSize: "12px", fontWeight: 500 }}>
          {fileName.name}
        </Typography>

        {inProgress ? (
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
            <LinearProgress variant="determinate" value={uploadProgress} sx={{ flex: 1, height: 4, borderRadius: 2 }} />
            <Typography sx={{ fontSize: "10px", color: theme.palette.text.secondary }}>{uploadProgress}%</Typography>
          </Stack>
        ) : (
          <Typography sx={{ fontSize: "10px", color: theme.palette.text.secondary }}>
            {fileName.name.split(".").pop()?.toUpperCase()} · {fileName.size} MB
          </Typography>
        )}
      </Box>

      <IconButton size="small" onClick={() => onDelete(fileName)}>
        <Close sx={{ fontSize: 16 }} />
      </IconButton>
    </Box>
  );
};
