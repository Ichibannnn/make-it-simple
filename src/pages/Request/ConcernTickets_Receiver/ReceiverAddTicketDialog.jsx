import React, { useEffect, useRef, useState } from "react";
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, Divider, MenuItem, Select, Stack, TextField, Typography, useMediaQuery } from "@mui/material";

import { Controller, set, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import moment from "moment";
import { theme } from "../../../theme/theme";
import { LoadingButton } from "@mui/lab";
import { Toaster, toast } from "sonner";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

import { notificationApi } from "../../../features/api_notification/notificationApi";
import { notificationMessageApi } from "../../../features/api_notification_message/notificationMessageApi";
import ReceiverMenuAction from "./ReceiverMenuAction";
import { useGetUsersQuery, useLazyGetUsersQuery } from "../../../features/user_management_api/user/userApi";
import { useLazyGetCompanyQuery } from "../../../features/api masterlist/company/companyApi";
import { useLazyGetBusinessUnitQuery } from "../../../features/api masterlist/business-unit/businessUnitApi";
import { useLazyGetDepartmentQuery } from "../../../features/api masterlist/department/departmentApi";
import { useLazyGetUnitQuery } from "../../../features/api masterlist/unit/unitApi";
import { useLazyGetSubUnitQuery } from "../../../features/api masterlist/sub-unit/subUnitApi";
import { useLazyGetLocationWithPaginationQuery } from "../../../features/api masterlist/location/locationApi";
import { useLazyGetChannelsQuery } from "../../../features/api_channel_setup/channel/channelApi";
import { useLazyGetCategoryQuery } from "../../../features/api masterlist/category_api/categoryApi";
import { useLazyGetSubCategoryArrayQuery } from "../../../features/api masterlist/sub_category_api/subCategoryApi";
import { useCreateEditReceiverConcernMutation } from "../../../features/api_request/concerns_receiver/concernReceiverApi";

const ReceiverAddTicketDialog = ({ open, onClose }) => {
  const [attachments, setAttachments] = useState([]);
  const [userInformation, setUserInformation] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const dateNeededValidation = new moment();
  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));
  const userId = useSelector((state) => state?.user?.id);

  const requestorSchema = yup.object().shape({
    RequestTransactionId: yup.string().nullable(),
    Concern: yup.string().min(2, "Concern must be more than 1 character long").required("This field is required").label("Concern Details"),
    RequestConcernId: yup.string().nullable(),
    RequestAttachmentsFiles: yup.array().nullable(),

    Request_Type: yup.string().required("Request Type is required"),
    Contact_Number: yup.string().matches(/^09\d{9}$/, {
      message: "Must start with 09 and be 11 digits long",
      excludeEmptyString: true,
    }),
    Requestor_By: yup.object().required().label("Requestor is required"),
    UserId: yup.object().required().label("Issue Handler is required"),
    Target_Date: yup.date().required("Target date is required"),
    CompanyId: yup.object().required().label("Company is required"),
    BusinessUnitId: yup.object().required().label("Business Unit"),
    DepartmentId: yup.object().required().label("Department is required"),
    UnitId: yup.object().required().label("Unit is required"),
    SubUnitId: yup.object().required().label("Sub Unit is required"),
    LocationId: yup.object().required().label("Location is required"),

    DateNeeded: yup.date().required("Date needed is required"),
    ChannelId: yup.object().required().label("Channel"),
    CategoryId: yup.array().required().label("Category"),
    SubCategoryId: yup.array().required().label("Sub Category"),

    Notes: yup.string().notRequired(),
  });

  const dispatch = useDispatch();
  const fileInputRef = useRef();

  const [createTicketConcern, { isLoading: isCreateTicketConcernLoading, isFetching: isCreateTicketConcernFetching }] = useCreateEditReceiverConcernMutation();

  const { data: userApiData, isSuccess: userApiIsSuccess } = useGetUsersQuery();
  const [getUser, { data: userData, isLoading: userIsLoading, isSuccess: userIsSuccess }] = useLazyGetUsersQuery();
  const [getCompany, { data: companyData, isLoading: companyIsLoading, isSuccess: companyIsSuccess }] = useLazyGetCompanyQuery();
  const [getBusinessUnit, { data: businessUnitData, isLoading: businessUnitIsLoading, isSuccess: businessUnitIsSuccess }] = useLazyGetBusinessUnitQuery();
  const [getDepartment, { data: departmentData, isLoading: departmentIsLoading, isSuccess: departmentIsSuccess }] = useLazyGetDepartmentQuery();
  const [getUnit, { data: unitData, isLoading: unitIsLoading, isSuccess: unitIsSuccess }] = useLazyGetUnitQuery();
  const [getSubUnit, { data: subUnitData, isLoading: subUnitIsLoading, isSuccess: subUnitIsSuccess }] = useLazyGetSubUnitQuery();
  const [getLocation, { data: locationData, isLoading: locationIsLoading, isSuccess: locationIsSuccess }] = useLazyGetLocationWithPaginationQuery();

  const [getChannel, { data: channelData, isLoading: channelIsLoading, isSuccess: channelIsSuccess }] = useLazyGetChannelsQuery();
  const [getIssueHandler, { isLoading: issueHandlerIsLoading, isSuccess: issueHandlerIsSuccess }] = useLazyGetChannelsQuery();
  const [getCategory, { data: categoryData, isLoading: categoryIsLoading, isSuccess: categoryIsSuccess }] = useLazyGetCategoryQuery();
  const [getSubCategory, { data: subCategoryData, isLoading: subCategoryIsLoading, isSuccess: subCategoryIsSuccess }] = useLazyGetSubCategoryArrayQuery();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(requestorSchema),
    mode: "onChange",
    defaultValues: {
      RequestTransactionId: "",
      Concern: "",
      RequestConcernId: "",
      ConcernAttachments: [],

      Request_Type: "New Request",
      Contact_Number: "",

      Requestor_By: null,
      UserId: null,
      Target_Date: null,
      CompanyId: null,
      BusinessUnitId: null,
      DepartmentId: null,
      UnitId: null,
      SubUnitId: null,
      LocationId: null,

      DateNeeded: null,
      ChannelId: null,
      CategoryId: [],
      SubCategoryId: [],

      Notes: "",
    },
  });

  const onConcernFormSubmit = (formData) => {
    console.log("FormData:", formData);

    const payload = new FormData();

    payload.append("Request_Type", formData.Request_Type);
    payload.append("Requestor_By", formData.Requestor_By?.id);
    payload.append("UserId", formData.UserId?.userId);
    payload.append("Contact_Number", formData.Contact_Number);
    // payload.append("CompanyId", formData.CompanyId?.id);
    // payload.append("BusinessUnitId", formData.BusinessUnitId?.id);
    // payload.append("DepartmentId", formData.DepartmentId?.id);
    // payload.append("UnitId", formData.UnitId?.id);
    // payload.append("SubUnitId", formData.SubUnitId?.id);
    // payload.append("Location_Code", formData.LocationId?.location_Code);

    payload.append("DateNeeded", moment(formData.DateNeeded).format("YYYY-MM-DD"));
    payload.append("Target_Date", moment(formData.Target_Date).format("YYYY-MM-DD"));
    payload.append("ChannelId", formData.ChannelId?.id);

    const category = formData.CategoryId;
    for (let i = 0; i < category.length; i++) {
      payload.append(`RequestorTicketCategories[${i}].ticketCategoryId`, "");
      payload.append(`RequestorTicketCategories[${i}].categoryId`, category[i]?.id);
    }

    if (category.length === 0) {
      payload.append(`RequestorTicketCategories[0].ticketCategoryId`, "");
      payload.append(`RequestorTicketCategories[0].categoryId`, "");
    }

    const subCategory = formData.SubCategoryId;
    for (let i = 0; i < subCategory.length; i++) {
      payload.append(`RequestorTicketSubCategories[${i}].ticketSubCategoryId`, "");
      payload.append(`RequestorTicketSubCategories[${i}].subCategoryId`, subCategory[i]?.subCategoryId);
    }

    if (subCategory.length === 0) {
      payload.append(`RequestorTicketSubCategories[0].ticketSubCategoryId`, "");
      payload.append(`RequestorTicketSubCategories[0].subCategoryId`, "");
    }

    payload.append("Concern", formData.Concern);
    payload.append("Notes", formData.Notes);

    const files = formData.ConcernAttachments;
    for (let i = 0; i < files.length; i++) {
      console.log("i: ", i);

      payload.append(`ConcernAttachments[${i}].ticketAttachmentId`, "");
      payload.append(`ConcernAttachments[${i}].attachment`, files[i]);
    }

    if (files.length === 0) {
      payload.append(`ConcernAttachments[0].ticketAttachmentId`, "");
      payload.append(`ConcernAttachments[0].attachment`, "");
    }

    console.log("Payload Entries: ", [...payload.entries()]);

    createTicketConcern(payload)
      .unwrap()
      .then(() => {
        toast.success("Success!", {
          description: "Concern added successfully!",
          duration: 1500,
        });
        dispatch(notificationApi.util.resetApiState());
        dispatch(notificationMessageApi.util.resetApiState());
        reset({
          Request_Type: "New Request",
          Requestor_By: null,
          UserId: null,
          Contact_Number: "",

          CompanyId: null,
          BusinessUnitId: null,
          DepartmentId: null,
          UnitId: null,
          SubUnitId: null,
          LocationId: null,

          DateNeeded: null,
          Target_Date: null,
          ChannelId: null,
          CategoryId: [],
          SubCategoryId: [],

          Concern: "",
          Notes: "",
        });
        setAttachments([]);
        setIsLoading(false);
        onClose();
      })
      .catch((err) => {
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

  const updateAttachments = (newFiles) => {
    const allowedExtensions = [".png", ".docx", ".jpg", ".jpeg", ".pdf", ".xlxs"];
    const filteredFiles = newFiles
      .filter((file) => {
        const extension = file.name.split(".").pop().toLowerCase();
        return allowedExtensions.includes(`.${extension}`);
      })
      .map((file) => ({
        name: file.name,
        size: file.size,
      }));

    const currentAttachments = watch("ConcernAttachments") || [];
    const uniqueNewFiles = filteredFiles.filter((newFile) => !currentAttachments.some((existingFile) => existingFile.name === newFile.name));
    const updatedAttachments = [...currentAttachments, ...uniqueNewFiles];

    setAttachments(updatedAttachments);
    setValue("ConcernAttachments", updatedAttachments);
  };

  const onCloseAction = () => {
    reset({
      UserId: {
        id: userInformation?.id || "",
        fullname: userInformation?.fullname || "",
      },
    });
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
      "ConcernAttachments",
      watch("ConcernAttachments").filter((file) => file.name !== fileNameToDelete.name)
    );
  };

  const handleViewClose = () => {
    setIsViewDialogOpen(false);
    setSelectedImage(null);
  };

  const isImageFile = (fileName) => {
    return /\.(jpg|jpeg|png)$/i.test(fileName);
  };

  useEffect(() => {
    const selectedCategories = watch("CategoryId");
    const selectedSubCategories = watch("SubCategoryId");

    if (selectedCategories.length > 0) {
      const filteredSubCategories = selectedSubCategories.filter((subCategory) =>
        selectedCategories.some((category) => subCategoryData?.value?.some((item) => item.subCategoryId === subCategory.subCategoryId && item.categoryId === category.id))
      );
      setValue("SubCategoryId", filteredSubCategories);
    } else {
      setValue("SubCategoryId", []);
    }
  }, [subCategoryData]);

  return (
    <>
      <Toaster richColors position="top-right" closeButton />
      <Dialog fullWidth maxWidth="lg" open={open} sx={{ borderRadius: "none", padding: 0 }} PaperProps={{ style: { overflow: "auto" } }}>
        <form onSubmit={handleSubmit(onConcernFormSubmit)}>
          <DialogContent sx={{ paddingBottom: 8 }} dividers>
            <Stack direction="column" sx={{ padding: "1px", minHeight: "700px" }}>
              <Stack>
                <Stack direction="row" gap={0.5}>
                  <Typography
                    sx={{
                      fontSize: "18px",
                      fontWeight: 700,
                      color: "#48BB78",
                    }}
                  >
                    New Ticket
                  </Typography>
                </Stack>
              </Stack>

              <Stack padding={5}>
                {/* REQUEST TYPE */}
                <Stack
                  width="100%"
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 1,
                  }}
                >
                  <Typography sx={{ fontSize: "13px", mb: 0.5 }}>Request Type:</Typography>
                  <Controller
                    name="Request_Type"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} displayEmpty size="small" inputProps={{ "aria-label": "Without label" }} sx={{ width: "100%", fontSize: "13px" }}>
                        <MenuItem value="New Request" sx={{ fontSize: "13px" }}>
                          New Request
                        </MenuItem>
                      </Select>
                    )}
                  />
                </Stack>

                {/* REQUESTOR DETAILS */}
                <Typography sx={{ fontSize: "15px", color: theme.palette.primary.main, mb: 1 }}>Requestor Details</Typography>
                <Stack direction="row" sx={{ width: "100%" }}>
                  <Stack direction={isScreenSmall ? "column" : "row"} sx={{ width: "100%", gap: 1 }}>
                    <Stack sx={{ width: isScreenSmall ? "100%" : "50%" }}>
                      <Typography sx={{ fontSize: "13px", mb: 0.5 }}>Requestor Name:</Typography>
                      <Controller
                        control={control}
                        name="Requestor_By"
                        render={({ field: { ref, value, onChange } }) => {
                          return (
                            <Autocomplete
                              ref={ref}
                              size="small"
                              value={value}
                              options={userData?.value?.users || []}
                              loading={userIsLoading}
                              renderInput={(params) => <TextField {...params} placeholder="Requestor" sx={{ "& .MuiInputBase-input": { fontSize: "13px" } }} />}
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

                    <Stack sx={{ width: isScreenSmall ? "100%" : "50%" }}>
                      <Typography sx={{ fontSize: "13px", mb: 0.5 }}>Contact Number (Optional):</Typography>
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
                              autoComplete="off"
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
                </Stack>

                <Stack direction="row" sx={{ width: "100%", mt: 1 }}>
                  <Stack direction={isScreenSmall ? "column" : "row"} sx={{ width: "100%", gap: 1 }}>
                    <Stack sx={{ width: isScreenSmall ? "100%" : "50%" }}>
                      <Typography sx={{ fontSize: "13px", mb: 0.5 }}>Company:</Typography>
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
                              renderInput={(params) => <TextField {...params} placeholder="Company" sx={{ "& .MuiInputBase-input": { fontSize: "13px" } }} />}
                              onOpen={() => {
                                if (!companyIsSuccess) getCompany();
                              }}
                              onChange={(_, value) => onChange(value)}
                              getOptionLabel={(option) => `${option.company_Code} - ${option.company_Name}`}
                              isOptionEqualToValue={(option, value) => option.id === value.id}
                              sx={{
                                flex: 2,
                              }}
                              fullWidth
                              disablePortal
                              disableClearable
                              disabled
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

                    <Stack sx={{ width: isScreenSmall ? "100%" : "50%" }}>
                      <Typography sx={{ fontSize: "13px", mb: 0.5 }}>Business Unit:</Typography>
                      <Controller
                        control={control}
                        name="BusinessUnitId"
                        render={({ field: { ref, value, onChange } }) => {
                          return (
                            <Autocomplete
                              ref={ref}
                              size="small"
                              value={value}
                              options={businessUnitData?.value?.businessUnit.filter((item) => item.companyId === watch("CompanyId")?.id) || []}
                              loading={businessUnitIsLoading}
                              renderInput={(params) => <TextField {...params} placeholder="Business Unit" sx={{ "& .MuiInputBase-input": { fontSize: "13px" } }} />}
                              onChange={(_, value) => onChange(value)}
                              getOptionLabel={(option) => `${option.business_Code} - ${option.business_Name}`}
                              isOptionEqualToValue={(option, value) => option.id === value.id}
                              sx={{
                                flex: 2,
                              }}
                              fullWidth
                              disablePortal
                              disableClearable
                              disabled
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
                </Stack>

                <Stack direction="row" sx={{ width: "100%", mt: 1 }}>
                  <Stack direction={isScreenSmall ? "column" : "row"} sx={{ width: "100%", gap: 1 }}>
                    <Stack sx={{ width: isScreenSmall ? "100%" : "50%" }}>
                      <Typography sx={{ fontSize: "13px", mb: 0.5 }}>Department:</Typography>
                      <Controller
                        control={control}
                        name="DepartmentId"
                        render={({ field: { ref, value, onChange } }) => {
                          return (
                            <Autocomplete
                              ref={ref}
                              size="small"
                              value={value}
                              options={departmentData?.value?.department.filter((item) => item.businessUnitId === watch("BusinessUnitId")?.id) || []}
                              loading={departmentIsLoading}
                              renderInput={(params) => <TextField {...params} placeholder="Department" sx={{ "& .MuiInputBase-input": { fontSize: "13px" } }} />}
                              onChange={(_, value) => onChange(value)}
                              getOptionLabel={(option) => `${option.department_Code} - ${option.department_Name}`}
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

                    <Stack sx={{ width: isScreenSmall ? "100%" : "50%" }}>
                      <Typography sx={{ fontSize: "13px", mb: 0.5 }}>Unit:</Typography>
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
                              renderInput={(params) => <TextField {...params} placeholder="Unit" sx={{ "& .MuiInputBase-input": { fontSize: "13px" } }} />}
                              onChange={(_, value) => onChange(value)}
                              getOptionLabel={(option) => `${option.unit_Code} - ${option.unit_Name}`}
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
                </Stack>

                <Stack direction="row" sx={{ width: "100%", mt: 1 }}>
                  <Stack direction={isScreenSmall ? "column" : "row"} sx={{ width: "100%", gap: 1 }}>
                    <Stack sx={{ width: isScreenSmall ? "100%" : "50%" }}>
                      <Typography sx={{ fontSize: "13px", mb: 0.5 }}>Sub Unit:</Typography>
                      <Controller
                        control={control}
                        name="SubUnitId"
                        render={({ field: { ref, value, onChange } }) => {
                          return (
                            <Autocomplete
                              ref={ref}
                              size="small"
                              value={value}
                              options={subUnitData?.value?.subUnit.filter((item) => item.unitId === watch("UnitId")?.id) || []}
                              loading={subUnitIsLoading}
                              onOpen={() => {
                                if (!subUnitIsSuccess)
                                  getSubUnit({
                                    Status: true,
                                  });
                              }}
                              renderInput={(params) => <TextField {...params} placeholder="Sub Unit" sx={{ "& .MuiInputBase-input": { fontSize: "13px" } }} />}
                              onChange={(_, value) => onChange(value)}
                              getOptionLabel={(option) => `${option.subUnit_Code} - ${option.subUnit_Name}`}
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

                    <Stack sx={{ width: isScreenSmall ? "100%" : "50%" }}>
                      <Typography sx={{ fontSize: "13px", mb: 0.5 }}>Location:</Typography>
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
                              renderInput={(params) => <TextField {...params} placeholder="Location" sx={{ "& .MuiInputBase-input": { fontSize: "13px" } }} />}
                              onChange={(_, value) => onChange(value)}
                              getOptionLabel={(option) => `${option.location_Code} - ${option.location_Name}`}
                              isOptionEqualToValue={(option, value) => option.location_Code === value.location_Code}
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
                </Stack>

                {/* CONCERN INFORMATION */}
                <Typography sx={{ fontSize: "15px", color: theme.palette.primary.main, mt: 2 }}>Concern Details</Typography>

                <Stack direction="row" sx={{ width: "100%", mt: 1 }}>
                  <Stack direction={isScreenSmall ? "column" : "row"} sx={{ width: "100%", gap: 1 }}>
                    <Stack sx={{ width: isScreenSmall ? "100%" : "50%" }}>
                      <Typography sx={{ fontSize: "13px", mb: 0.5 }}>Date Needed:</Typography>
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <Controller
                          control={control}
                          name="DateNeeded"
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
                                      fontSize: "13px",
                                    },
                                  },
                                },
                              }}
                              minDate={dateNeededValidation}
                              error={!!errors.DateNeeded}
                              helperText={errors.DateNeeded}
                            />
                          )}
                        />
                        {errors.DateNeeded && <Typography sx={{ color: "theme.palette.error.main" }}>{errors.targetDate.DateNeeded}</Typography>}
                      </LocalizationProvider>
                    </Stack>

                    <Stack sx={{ width: isScreenSmall ? "100%" : "50%" }}>
                      <Typography sx={{ fontSize: "13px", mb: 0.5 }}>Channel:</Typography>
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
                              renderInput={(params) => <TextField {...params} placeholder="Channel Name" sx={{ "& .MuiInputBase-input": { fontSize: "13px" } }} />}
                              onOpen={() => {
                                if (!channelIsSuccess)
                                  getChannel({
                                    Status: true,
                                  });
                              }}
                              onChange={(_, value) => {
                                onChange(value);

                                setValue("UserId", null);
                                setValue("CategoryId", []);
                                setValue("SubCategoryId", []);
                              }}
                              getOptionLabel={(option) => option.channel_Name}
                              isOptionEqualToValue={(option, value) => option.id === value.id}
                              sx={{
                                flex: 2,
                              }}
                              fullWidth
                              disablePortal
                              disableClearable
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
                    <Stack sx={{ width: isScreenSmall ? "100%" : "50%" }}>
                      <Typography sx={{ fontSize: "13px", mb: 0.5 }}>Target Date:</Typography>
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <Controller
                          control={control}
                          name="Target_Date"
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
                                      fontSize: "13px",
                                    },
                                  },
                                },
                              }}
                              minDate={new moment()}
                              error={!!errors.Target_Date}
                              helperText={errors.Target_Date ? errors.Target_Date.message : null}
                            />
                          )}
                        />
                        {errors.DateNeeded && <Typography sx={{ color: "theme.palette.error.main" }}>{errors.targetDate.DateNeeded}</Typography>}
                      </LocalizationProvider>
                    </Stack>

                    <Stack sx={{ width: isScreenSmall ? "100%" : "50%" }}>
                      <Typography sx={{ fontSize: "13px", mb: 0.5 }}>Assign To:</Typography>
                      <Controller
                        control={control}
                        name="UserId"
                        render={({ field: { ref, value, onChange } }) => {
                          return (
                            <Autocomplete
                              ref={ref}
                              size="small"
                              value={value}
                              options={channelData?.value?.channel?.find((item) => item.id === watch("ChannelId")?.id)?.channelUsers || []}
                              loading={issueHandlerIsLoading}
                              renderInput={(params) => <TextField {...params} placeholder="Issue Handler" sx={{ "& .MuiInputBase-input": { fontSize: "13px" } }} />}
                              onOpen={() => {
                                if (!issueHandlerIsSuccess) getIssueHandler();
                              }}
                              onChange={(_, value) => {
                                onChange(value);
                              }}
                              getOptionLabel={(option) => option.fullname}
                              isOptionEqualToValue={(option, value) => option?.userId === value?.userId}
                              // getOptionDisabled={(option) => watch("userId")?.some((item) => item?.userId === option?.userId)}
                              sx={{
                                flex: 2,
                              }}
                              fullWidth
                              disablePortal
                              disableClearable
                              disabled={!watch("ChannelId")}
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
                    <Stack sx={{ width: isScreenSmall ? "100%" : "50%" }}>
                      <Typography sx={{ fontSize: "13px", mb: 0.5 }}>Category:</Typography>
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
                              options={categoryData?.value?.category.filter((item) => item.channelId === watch("ChannelId")?.id) || []}
                              loading={categoryIsLoading}
                              renderInput={(params) => <TextField {...params} placeholder="Category" sx={{ "& .MuiInputBase-input": { fontSize: "13px" } }} />}
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

                    <Stack sx={{ width: isScreenSmall ? "100%" : "50%" }}>
                      <Typography sx={{ fontSize: "13px", mb: 0.5 }}>Sub Category:</Typography>
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
                              renderInput={(params) => <TextField {...params} placeholder="Sub Category" sx={{ "& .MuiInputBase-input": { fontSize: "13px" } }} />}
                              onOpen={() => {
                                if (!subCategoryIsSuccess) getSubCategory();
                              }}
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
                </Stack>

                {/* DESCRIPTION AND ATTACHMENT */}
                <Stack
                  width="100%"
                  sx={{
                    paddingTop: 2,
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography sx={{ fontSize: "13px" }}>Description:</Typography>

                  <Controller
                    control={control}
                    name="Concern"
                    render={({ field: { ref, value, onChange } }) => {
                      return (
                        <TextField
                          inputRef={ref}
                          size="medium"
                          value={value}
                          placeholder="Ex. System Name - Description"
                          onChange={onChange}
                          error={!!errors.Concern}
                          sx={{
                            width: "100%",
                          }}
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
                          autoComplete="off"
                          rows={6}
                          multiline
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

                <Stack
                  width="100%"
                  sx={{
                    paddingTop: 2,
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography sx={{ fontSize: "13px" }}>Notes (Optional):</Typography>

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
                              fontSize: "13px",
                            },
                          }}
                          InputLabelProps={{
                            style: {
                              fontSize: "13px",
                            },
                          }}
                          autoComplete="off"
                          rows={4}
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
                  <Typography sx={{ fontSize: "13px" }}>Attachment:</Typography>

                  <Stack
                    sx={{
                      width: "100%",
                      display: "flex",
                      border: "2px dashed #2D3748",
                      justifyContent: "left",
                      padding: 1,
                    }}
                    onDragOver={handleDragOver}
                    // onDrop={handleDrop}
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

                      <Typography sx={{ color: theme.palette.text.secondary, fontSize: "13px" }}>.docx, .jpg, .jpeg, .png, .pdf file</Typography>
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
                            flexDirection: "column",
                            padding: 1,
                            maxWidth: "100%",
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            sx={{
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
                              <Typography sx={{ fontWeight: 500, fontSize: "13px" }}>{fileName.name}</Typography>

                              <Typography
                                sx={{
                                  fontSize: "13px",
                                  fontWeight: 500,
                                  color: theme.palette.text.secondary,
                                }}
                              >
                                {fileName.size} Mb
                              </Typography>

                              <Typography
                                sx={{
                                  fontSize: "13px",
                                  fontWeight: 500,
                                  color: theme.palette.success.main,
                                }}
                              >
                                Uploaded the file successfully
                              </Typography>
                            </Box>

                            <Box>
                              <ReceiverMenuAction fileName={fileName} onView={handleViewImage} onDelete={handleDeleteFile} isImageFile={isImageFile} />
                              {/* {isImageFile(fileName.name) && (
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => handleViewImage(fileName.file)} // View image in dialog
                                  style={{ background: "none" }}
                                >
                                  <VisibilityOutlined />
                                </IconButton>
                              )}

                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteFile(fileName)}
                                style={{
                                  background: "none",
                                }}
                              >
                                <RemoveCircleOutline />
                              </IconButton> */}
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </Stack>

                  <Controller
                    control={control}
                    name="ConcernAttachments"
                    render={({ field: { onChange, value } }) => (
                      <input
                        ref={fileInputRef}
                        accept=".png,.jpg,.jpeg,.docx"
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

          <DialogActions>
            <LoadingButton
              size="large"
              variant="contained"
              color="primary"
              type="submit"
              loading={isCreateTicketConcernLoading || isCreateTicketConcernFetching || isLoading}
              disabled={
                !watch("Concern") ||
                !watch("Requestor_By") ||
                !watch("Request_Type") ||
                !watch("CompanyId") ||
                !watch("BusinessUnitId") ||
                !watch("DepartmentId") ||
                !watch("UnitId") ||
                !watch("SubUnitId") ||
                !watch("LocationId") ||
                !watch("DateNeeded") ||
                !watch("ChannelId") ||
                watch("CategoryId").length === 0 ||
                watch("SubCategoryId").length === 0
              }
            >
              Save
            </LoadingButton>

            <LoadingButton
              variant="text"
              disabled={isCreateTicketConcernLoading || isCreateTicketConcernFetching || isLoading}
              onClick={onCloseAction}
              sx={{
                ":disabled": {
                  backgroundColor: "none",
                  color: "black",
                },
              }}
            >
              Close
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

export default ReceiverAddTicketDialog;
