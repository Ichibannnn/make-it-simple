import React, { useEffect, useRef, useState } from "react";
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, Divider, IconButton, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { Refresh, RemoveCircleOutline, Visibility, VisibilityOutlined, ZoomIn, ZoomOut } from "@mui/icons-material";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { theme } from "../../../theme/theme";
import { LoadingButton } from "@mui/lab";
import { Toaster, toast } from "sonner";

import { useCreateEditRequestorConcernMutation } from "../../../features/api_request/concerns/concernApi";
import { useDispatch } from "react-redux";
import { notificationApi } from "../../../features/api_notification/notificationApi";
import { notificationMessageApi } from "../../../features/api_notification_message/notificationMessageApi";
import { useSelector } from "react-redux";
import { useLazyGetCompanyQuery } from "../../../features/api masterlist/company/companyApi";
import { useLazyGetBusinessUnitQuery } from "../../../features/api masterlist/business-unit/businessUnitApi";
import { useLazyGetDepartmentQuery } from "../../../features/api masterlist/department/departmentApi";
import { useLazyGetUnitQuery } from "../../../features/api masterlist/unit/unitApi";
import { useLazyGetSubUnitQuery } from "../../../features/api masterlist/sub-unit/subUnitApi";
import { useLazyGetLocationWithPaginationQuery } from "../../../features/api masterlist/location/locationApi";
import { useGetUsersQuery, useLazyGetUsersQuery, userApi } from "../../../features/user_management_api/user/userApi";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { useLazyGetChannelsQuery } from "../../../features/api_channel_setup/channel/channelApi";
import { useLazyGetCategoryQuery } from "../../../features/api masterlist/category_api/categoryApi";
import { useLazyGetSubCategoryQuery } from "../../../features/api masterlist/sub_category_api/subCategoryApi";

const ConcernDialog = ({ open, onClose }) => {
  const [attachments, setAttachments] = useState([]);
  const [userInformation, setUserInformation] = useState(null); // get the user information to autofill from the dialog
  const [userCompany, setUserCompany] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const dateNeededValidation = new moment();

  const userId = useSelector((state) => state?.user?.id);

  const requestorSchema = yup.object().shape({
    RequestTransactionId: yup.string().nullable(),
    Concern: yup.string().required().label("Concern Details"),
    RequestConcernId: yup.string().nullable(),
    RequestAttachmentsFiles: yup.array().nullable(),

    Request_Type: yup.string().oneOf(["New Request", "Back Job"], "Invalid Request Type").required("Request Type is required"),
    Contact_Number: yup.string().notRequired(),

    UserId: yup.object().required().label("Requestor is required"),
    CompanyId: yup.object().required().label("Company is required"),
    BusinessUnitId: yup.object().required().label("Business Unit"),
    DepartmentId: yup.object().required().label("Department is required"),
    UnitId: yup.object().required().label("Unit is required"),
    SubUnitId: yup.object().required().label("Sub Unit is required"),
    LocationId: yup.object().required().label("Location is required"),

    DateNeeded: yup.date().required("Date needed is required"),
    ChannelId: yup.object().required().label("Channel"),
    CategoryId: yup.object().required().label("Category"),
    SubCategoryId: yup.object().required().label("Sub category"),

    Notes: yup.string().notRequired(),
  });

  // console.log("UserID: ", userId);

  const dispatch = useDispatch();
  const fileInputRef = useRef();

  const [createEditRequestorConcern, { isLoading: isCreateEditRequestorConcernLoading, isFetching: isCreateEditRequestorConcernFetching }] =
    useCreateEditRequestorConcernMutation();

  const { data: userApiData, isSuccess: userApiIsSuccess } = useGetUsersQuery();
  const [getUser, { data: userData, isLoading: userIsLoading, isSuccess: userIsSuccess }] = useLazyGetUsersQuery();
  const [getCompany, { data: companyData, isLoading: companyIsLoading, isSuccess: companyIsSuccess }] = useLazyGetCompanyQuery();
  const [getBusinessUnit, { data: businessUnitData, isLoading: businessUnitIsLoading, isSuccess: businessUnitIsSuccess }] = useLazyGetBusinessUnitQuery();
  const [getDepartment, { data: departmentData, isLoading: departmentIsLoading, isSuccess: departmentIsSuccess }] = useLazyGetDepartmentQuery();
  const [getUnit, { data: unitData, isLoading: unitIsLoading, isSuccess: unitIsSuccess }] = useLazyGetUnitQuery();
  const [getSubUnit, { data: subUnitData, isLoading: subUnitIsLoading, isSuccess: subUnitIsSuccess }] = useLazyGetSubUnitQuery();
  const [getLocation, { data: locationData, isLoading: locationIsLoading, isSuccess: locationIsSuccess }] = useLazyGetLocationWithPaginationQuery();

  const [getChannel, { data: channelData, isLoading: channelIsLoading, isSuccess: channelIsSuccess }] = useLazyGetChannelsQuery();
  const [getCategory, { data: categoryData, isLoading: categoryIsLoading, isSuccess: categoryIsSuccess }] = useLazyGetCategoryQuery();
  const [getSubCategory, { data: subCategoryData, isLoading: subCategoryIsLoading, isSuccess: subCategoryIsSuccess }] = useLazyGetSubCategoryQuery();

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
    defaultValues: {
      RequestTransactionId: "",
      Concern: "",
      RequestConcernId: "",
      RequestAttachmentsFiles: [],

      Request_Type: "New Request",
      Contact_Number: "",

      UserId: null,
      CompanyId: null,
      BusinessUnitId: null,
      DepartmentId: null,
      UnitId: null,
      SubUnitId: null,
      LocationId: null,

      DateNeeded: null,
      ChannelId: null,
      CategoryId: null,
      SubCategoryId: null,

      Notes: "",
    },
  });

  const onConcernFormSubmit = (formData) => {
    const payload = new FormData();

    payload.append("Request_Type", formData.Request_Type);
    payload.append("UserId", formData.UserId?.id);
    payload.append("Contact_Number", formData.Contact_Number);
    payload.append("CompanyId", formData.CompanyId?.id);
    payload.append("BusinessUnitId", formData.BusinessUnitId?.id);
    payload.append("DepartmentId", formData.DepartmentId?.id);
    payload.append("UnitId", formData.UnitId?.id);
    payload.append("SubUnitId", formData.SubUnitId?.id);
    payload.append("Location_Code", formData.LocationId?.location_Code);

    payload.append("DateNeeded", moment(formData.DateNeeded).format("YYYY-MM-DD"));
    payload.append("ChannelId", formData.ChannelId?.id);
    payload.append("CategoryId", formData.CategoryId?.id);
    payload.append("SubCategoryId", formData.SubCategoryId?.id);

    payload.append("Concern", formData.Concern);
    payload.append("Notes", formData.Notes);

    const files = formData.RequestAttachmentsFiles;
    for (let i = 0; i < files.length; i++) {
      payload.append(`RequestAttachmentsFiles[${i}].ticketAttachmentId`, "");
      payload.append(`RequestAttachmentsFiles[${i}].attachment`, files[i]);
    }

    if (files.length === 0) {
      payload.append(`RequestAttachmentsFiles[0].ticketAttachmentId`, "");
      payload.append(`RequestAttachmentsFiles[0].attachment`, "");
    }

    console.log("Payload Entries: ", [...payload.entries()]);

    createEditRequestorConcern(payload)
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
          UserId: {
            id: userInformation?.id || "",
            fullname: userInformation?.fullname || "",
          },
          Contact_Number: "",

          DateNeeded: null,
          ChannelId: null,
          CategoryId: null,
          SubCategoryId: null,

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

  const handleDeleteFile = (fileNameToDelete) => {
    console.log("File to Delete: ", fileNameToDelete);

    setAttachments((prevFiles) => prevFiles.filter((fileName) => fileName !== fileNameToDelete));

    setValue(
      "RequestAttachmentsFiles",
      watch("RequestAttachmentsFiles").filter((file) => file.name !== fileNameToDelete.name)
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

    const currentAttachments = watch("RequestAttachmentsFiles") || [];
    const uniqueNewFiles = filteredFiles.filter((newFile) => !currentAttachments.some((existingFile) => existingFile.name === newFile.name));
    const updatedAttachments = [...currentAttachments, ...uniqueNewFiles];

    setAttachments(updatedAttachments);
    setValue("RequestAttachmentsFiles", updatedAttachments);
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

  // Function to open image view dialog
  const handleViewImage = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target.result);
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

  useEffect(() => {
    if (userApiIsSuccess && userApiData?.value?.users) {
      const getUserInfo = userApiData?.value?.users?.find((item) => item?.id === userId);

      if (getUserInfo) {
        setUserInformation(getUserInfo);
      } else {
        setUserInformation(null); // Clear state if user not found
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

  console.log("Employee: ", watch("UserId"));

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
                    New Incident
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
                        <MenuItem value="Back Job" sx={{ fontSize: "13px" }}>
                          Back Job
                        </MenuItem>
                      </Select>
                    )}
                  />
                </Stack>

                {/* REQUESTOR DETAILS */}
                <Typography sx={{ fontSize: "15px", color: theme.palette.primary.main, mb: 1 }}>Requestor Details</Typography>
                <Stack direction="row" sx={{ width: "100%" }}>
                  <Stack direction="row" sx={{ width: "100%", gap: 1 }}>
                    <Stack sx={{ width: "50%" }}>
                      <Typography sx={{ fontSize: "13px", mb: 0.5 }}>Requestor Name:</Typography>
                      <Controller
                        control={control}
                        name="UserId"
                        render={({ field: { ref, value, onChange } }) => {
                          return (
                            <Autocomplete
                              ref={ref}
                              size="small"
                              value={value}
                              options={userData?.value?.users.filter((item) => item.departmentId === watch("DepartmentId")?.id) || []}
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

                    <Stack></Stack>

                    <Stack sx={{ width: "50%" }}>
                      <Typography sx={{ fontSize: "13px", mb: 0.5 }}>Contact Number (Optional):</Typography>
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
                          const handleChange = (e) => {
                            // Allow only numbers
                            const newValue = e.target.value.replace(/\D/g, "");
                            onChange(newValue);
                          };

                          return (
                            <TextField
                              inputRef={ref}
                              size="small"
                              value={value}
                              placeholder="09xxxxxxxxx"
                              onChange={handleChange}
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

                <Stack direction="row" sx={{ width: "100%", gap: 2, mt: 1 }}>
                  <Stack sx={{ width: "50%", gap: 1 }}>
                    <Stack>
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

                    <Stack>
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

                    <Stack>
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
                  </Stack>

                  <Stack sx={{ width: "50%", gap: 1 }}>
                    <Stack>
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

                    <Stack>
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

                    <Stack>
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
                <Stack direction="row" sx={{ width: "100%", gap: 2, mt: 1 }}>
                  <Stack sx={{ width: "50%", gap: 1 }}>
                    <Stack>
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

                    <Stack>
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

                                setValue("CategoryId", null);
                                setValue("SubCategoryId", null);
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
                  <Stack sx={{ width: "50%", gap: 1 }}>
                    <Stack>
                      <Typography sx={{ fontSize: "13px", mb: 0.5 }}>Category:</Typography>
                      <Controller
                        control={control}
                        name="CategoryId"
                        render={({ field: { ref, value, onChange } }) => {
                          return (
                            <Autocomplete
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

                                setValue("SubCategoryId", null);

                                getSubCategory({
                                  Status: true,
                                });
                              }}
                              getOptionLabel={(option) => option.category_Description || ""}
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

                    <Stack>
                      <Typography sx={{ fontSize: "13px", mb: 0.5 }}>Sub Category:</Typography>
                      <Controller
                        control={control}
                        name="SubCategoryId"
                        render={({ field: { ref, value, onChange } }) => {
                          return (
                            <Autocomplete
                              ref={ref}
                              size="small"
                              value={value}
                              options={subCategoryData?.value?.subCategory.filter((item) => item.categoryId === watch("CategoryId")?.id) || []}
                              loading={subCategoryIsLoading}
                              renderInput={(params) => <TextField {...params} placeholder="Sub Category" sx={{ "& .MuiInputBase-input": { fontSize: "13px" } }} />}
                              onChange={(_, value) => {
                                // console.log("Value ", value);

                                onChange(value || []);
                              }}
                              getOptionLabel={(option) => `${option.subCategory_Description}`}
                              isOptionEqualToValue={(option, value) => option.id === value.id}
                              noOptionsText={"No sub category available"}
                              sx={{
                                flex: 2,
                              }}
                              fullWidth
                              disablePortal
                              disableClearable
                              // disabled
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
                              {isImageFile(fileName.name) && (
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
                              </IconButton>
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </Stack>

                  <Controller
                    control={control}
                    name="RequestAttachmentsFiles"
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

                          console.log("Controller Files: ", files);

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
              loading={isCreateEditRequestorConcernLoading || isCreateEditRequestorConcernFetching || isLoading}
              disabled={
                !watch("Concern") ||
                !watch("Request_Type") ||
                !watch("CompanyId") ||
                !watch("BusinessUnitId") ||
                !watch("DepartmentId") ||
                !watch("UnitId") ||
                !watch("SubUnitId") ||
                !watch("LocationId") ||
                !watch("DateNeeded") ||
                !watch("ChannelId") ||
                !watch("CategoryId") ||
                !watch("SubCategoryId")
              }
            >
              Save
            </LoadingButton>

            <LoadingButton
              variant="text"
              disabled={isCreateEditRequestorConcernLoading || isCreateEditRequestorConcernFetching || isLoading}
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

export default ConcernDialog;
