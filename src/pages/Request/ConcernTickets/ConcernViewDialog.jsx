import React, { useEffect, useRef, useState } from "react";
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, Divider, MenuItem, Select, Stack, TextField, Typography, useMediaQuery } from "@mui/material";
import { AttachFileOutlined, CheckOutlined } from "@mui/icons-material";

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
  useCreateEditRequestorConcernMutation,
  useDeleteRequestorAttachmentMutation,
  useLazyGetBackjobTicketsQuery,
  useLazyGetRequestorAttachmentQuery,
} from "../../../features/api_request/concerns/concernApi";

import { useDispatch } from "react-redux";
import { notificationApi } from "../../../features/api_notification/notificationApi";
import { notificationMessageApi } from "../../../features/api_notification_message/notificationMessageApi";
import { useLazyGetDownloadAttachmentQuery, useLazyGetViewAttachmentQuery } from "../../../features/api_attachments/attachmentsApi";
import { useLazyGetUsersQuery } from "../../../features/user_management_api/user/userApi";
import { useLazyGetCompanyQuery } from "../../../features/api masterlist/company/companyApi";
import { useLazyGetBusinessUnitQuery } from "../../../features/api masterlist/business-unit/businessUnitApi";
import { useLazyGetDepartmentQuery } from "../../../features/api masterlist/department/departmentApi";
import { useLazyGetUnitQuery } from "../../../features/api masterlist/unit/unitApi";
import { useLazyGetSubUnitQuery } from "../../../features/api masterlist/sub-unit/subUnitApi";
import { useLazyGetLocationWithPaginationQuery } from "../../../features/api masterlist/location/locationApi";
import { useLazyGetChannelsQuery } from "../../../features/api_channel_setup/channel/channelApi";
import { useLazyGetCategoryQuery } from "../../../features/api masterlist/category_api/categoryApi";
import { useLazyGetSubCategoryArrayQuery } from "../../../features/api masterlist/sub_category_api/subCategoryApi";
import ConcernViewMenuActions from "./ConcernViewMenuAction";

const ConcernViewDialog = ({ editData, open, onClose }) => {
  const [attachments, setAttachments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ticketAttachmentId, setTicketAttachmentId] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const dateNeededValidation = new moment();
  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));

  const requestorSchema = yup.object().shape({
    RequestConcernId: yup.string().nullable(),
    Concern: yup.string().min(2, "Concern must be more than 1 character long").required("This field is required").label("Concern Details"),
    RequestAttachmentsFiles: yup.array().nullable(),

    Request_Type: yup.string().required("Request Type is required"),
    Severity: yup.string().required("Severity is required"),
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

    DateNeeded: yup.date().required("Date needed is required"),
    ChannelId: yup.object().required().label("Channel"),
    CategoryId: yup.array().required().label("Category"),
    SubCategoryId: yup.array().required().label("Sub category"),

    Notes: yup.string().notRequired(),
  });

  const fileInputRef = useRef();
  const dispatch = useDispatch();

  const [createEditRequestorConcern, { isLoading: isCreateEditRequestorConcernLoading, isFetching: isCreateEditRequestorConcernFetching }] =
    useCreateEditRequestorConcernMutation();

  const [getUser, { data: userData, isLoading: userIsLoading, isSuccess: userIsSuccess }] = useLazyGetUsersQuery();
  const [getBackjobTicket, { data: backjobTicketData, isLoading: backjobTicketIsLoading, isSuccess: backjobTicketIsSuccess }] = useLazyGetBackjobTicketsQuery();
  const [getCompany, { data: companyData, isLoading: companyIsLoading, isSuccess: companyIsSuccess }] = useLazyGetCompanyQuery();
  const [getBusinessUnit, { data: businessUnitData, isLoading: businessUnitIsLoading, isSuccess: businessUnitIsSuccess }] = useLazyGetBusinessUnitQuery();
  const [getDepartment, { data: departmentData, isLoading: departmentIsLoading, isSuccess: departmentIsSuccess }] = useLazyGetDepartmentQuery();
  const [getUnit, { data: unitData, isLoading: unitIsLoading, isSuccess: unitIsSuccess }] = useLazyGetUnitQuery();
  const [getSubUnit, { data: subUnitData, isLoading: subUnitIsLoading, isSuccess: subUnitIsSuccess }] = useLazyGetSubUnitQuery();
  const [getLocation, { data: locationData, isLoading: locationIsLoading, isSuccess: locationIsSuccess }] = useLazyGetLocationWithPaginationQuery();

  const [getChannel, { data: channelData, isLoading: channelIsLoading, isSuccess: channelIsSuccess }] = useLazyGetChannelsQuery();
  const [getCategory, { data: categoryData, isLoading: categoryIsLoading, isSuccess: categoryIsSuccess }] = useLazyGetCategoryQuery();
  const [getSubCategory, { data: subCategoryData, isLoading: subCategoryIsLoading, isSuccess: subCategoryIsSuccess }] = useLazyGetSubCategoryArrayQuery();

  const [getRequestorAttachment] = useLazyGetRequestorAttachmentQuery();
  const [getViewAttachment] = useLazyGetViewAttachmentQuery();
  const [getDownloadAttachment] = useLazyGetDownloadAttachmentQuery();
  const [deleteRequestorAttachment] = useDeleteRequestorAttachmentMutation();

  const {
    control,
    handleSubmit,
    register,
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
      Severity: "",
      BackJobId: null,
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
      CategoryId: [],
      SubCategoryId: [],

      Notes: "",
    },
  });

  const onConcernFormSubmit = (formData) => {
    console.log("FormData: ", formData);

    const payload = new FormData();

    payload.append("RequestConcernId", formData.RequestConcernId);

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

    payload.append("DateNeeded", moment(formData.DateNeeded).format("YYYY-MM-DD"));
    payload.append("ChannelId", formData.ChannelId?.id);
    // payload.append("CategoryId", formData.CategoryId?.id);
    // payload.append("SubCategoryId", formData.SubCategoryId?.id);

    const category = formData.CategoryId;
    for (let i = 0; i < category.length; i++) {
      payload.append(`AddRequestTicketCategories[${i}].ticketCategoryId`, category[i].ticketCategoryId || "");
      payload.append(`AddRequestTicketCategories[${i}].categoryId`, category[i]?.id);
    }

    if (category.length === 0) {
      payload.append(`AddRequestTicketCategories[0].ticketCategoryId`, "");
      payload.append(`AddRequestTicketCategories[0].categoryId`, "");
    }

    const subCategory = formData.SubCategoryId;
    for (let i = 0; i < subCategory.length; i++) {
      payload.append(`AddRequestTicketSubCategories[${i}].ticketSubCategoryId`, subCategory[i].ticketSubCategoryId || "");
      payload.append(`AddRequestTicketSubCategories[${i}].subCategoryId`, subCategory[i]?.subCategoryId);
    }

    if (subCategory.length === 0) {
      payload.append(`AddRequestTicketSubCategories[0].ticketSubCategoryId`, "");
      payload.append(`AddRequestTicketSubCategories[0].subCategoryId`, "");
    }

    payload.append("Concern", formData.Concern);
    payload.append("Notes", formData.Notes);

    const files = formData.RequestAttachmentsFiles;
    for (let i = 0; i < files.length; i++) {
      payload.append(`RequestAttachmentsFiles[${i}].ticketAttachmentId`, files[i].ticketAttachmentId || "");
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
          description: "Concern updated successfully!",
          duration: 1500,
        });
        dispatch(notificationApi.util.resetApiState());
        dispatch(notificationMessageApi.util.resetApiState());
        setAttachments([]);
        reset({
          Request_Type: "New Request",
          Request_Type: "Normal",
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

    const uniqueNewFiles = fileNames.filter((newFile) => !attachments?.some((existingFile) => existingFile.name === newFile.name));
    setAttachments((prevFiles) => (Array.isArray(prevFiles) ? [...prevFiles, ...uniqueNewFiles] : [...uniqueNewFiles]));
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleDeleteFile = async (fileNameToDelete) => {
    try {
      if (fileNameToDelete.ticketAttachmentId) {
        const deletePayload = {
          ticketAttachmentId: fileNameToDelete.ticketAttachmentId,
        };
        await deleteRequestorAttachment(deletePayload).unwrap();
      }

      setAttachments((prevFiles) => prevFiles.filter((fileName) => fileName !== fileNameToDelete));

      setValue(
        "RequestAttachmentsFiles",
        watch("RequestAttachmentsFiles").filter((file) => file.name !== fileNameToDelete.name)
      );
    } catch (error) {}
  };

  // Multiple files handler event
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const onCloseAction = () => {
    reset({
      Request_Type: "",
      Severity: "",
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
    onClose();
  };

  const getAttachmentData = async (id) => {
    try {
      const res = await getRequestorAttachment({ Id: id }).unwrap();

      // console.log("res", res);

      setAttachments(
        res?.value?.[0]?.attachments?.map((item) => ({
          ticketAttachmentId: item.ticketAttachmentId,
          name: item.fileName,
          size: (item.fileSize / (1024 * 1024)).toFixed(2),
          link: item.attachment,
        }))
      );
    } catch (error) {}
  };

  // Function to open image view dialog
  const handleViewImage = async (file) => {
    setViewLoading(true);
    setIsMenuOpen(true);
    try {
      const response = await getViewAttachment(file?.ticketAttachmentId);

      if (response?.data) {
        const imageUrl = URL.createObjectURL(response.data); // Create a URL for the fetched image
        setSelectedImage(imageUrl); // Set the image URL to state
        setIsViewDialogOpen(true);
        setViewLoading(false);
        setIsMenuOpen(false);
      }
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  const handleViewImageWithoutId = (file) => {
    setViewLoading(true);
    try {
      const reader = new FileReader();

      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setIsViewDialogOpen(true);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  const handleDownloadAttachment = async (file) => {
    setDownloadLoading(true);
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
        setDownloadLoading(false);
      } else {
        console.log("No data in the response");
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleViewClose = () => {
    setIsViewDialogOpen(false);
    setSelectedImage(null);
  };

  const isImageFile = (fileName) => {
    return /\.(jpg|jpeg|png)$/i.test(fileName);
  };

  useEffect(() => {
    if (editData) {
      if (!companyIsSuccess) getCompany();
      if (!businessUnitIsSuccess) getBusinessUnit();
      if (!departmentIsSuccess) getDepartment();
      if (!unitIsSuccess) getUnit();
      if (!subUnitIsSuccess) getSubUnit();
      if (!locationIsSuccess) getLocation();

      setValue("RequestConcernId", editData?.requestConcernId);
      // setValue("Severity", editData?.severity);
      setValue("Concern", editData?.concern);

      setValue("Request_Type", editData?.request_Type);
      // setValue("Severity", editData?.severity);

      if (editData?.request_Type === "New Request") {
        setValue("BackJobId", null);
      } else {
        setValue("BackJobId", {
          ticketConcernId: editData?.backJobId,
          concern: editData?.back_Job_Concern,
        });
      }

      // setValue("BackJobId", {
      //   ticketConcernId: editData?.backJobId,
      //   concern: editData?.back_Job_Concern,
      // });

      setValue("UserId", {
        id: editData?.requestorId,
        fullname: editData?.fullName,
      });

      if (editData.contact_Number === null) {
        setValue("Contact_Number", "");
      } else {
        setValue("Contact_Number", editData.contact_Number);
      }

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

      setValue("DateNeeded", moment(editData?.date_Needed));

      setValue("ChannelId", {
        id: editData?.channelId,
        channel_Name: editData?.channel_Name,
      });

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
        selectedCategories.some((category) => subCategoryData?.value?.some((item) => item.subCategoryId === subCategory.subCategoryId && item.categoryId === category.id))
      );
      setValue("SubCategoryId", filteredSubCategories);
    } else {
      setValue("SubCategoryId", []);
    }
  }, [subCategoryData]);

  return (
    <>
      <Dialog fullWidth maxWidth="lg" open={open} sx={{ borderRadius: "none", padding: 0 }} PaperProps={{ style: { overflow: "auto" } }}>
        <form onSubmit={handleSubmit(onConcernFormSubmit)}>
          <DialogContent sx={{ paddingBottom: 8 }}>
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
                    {!editData ? "New Incident" : "View Incident"}
                  </Typography>
                </Stack>
              </Stack>

              <Stack padding={3}>
                <Typography
                  sx={{
                    fontSize: "15px",
                    fontWeight: 500,
                  }}
                >
                  {`Request Number: ${editData?.requestConcernId}`}
                </Typography>

                {/* REQUEST TYPE */}
                <Stack
                  width="100%"
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 1,
                    mt: 2,
                  }}
                >
                  <Typography sx={{ fontSize: "13px", mb: 0.5 }}>Request Type:</Typography>
                  <Controller
                    name="Request_Type"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} label="Select Request type" size="small" sx={{ width: "100%", fontSize: "13px" }}>
                        <MenuItem value="New Request" sx={{ fontSize: "13px" }}>
                          New Request
                        </MenuItem>
                        <MenuItem value="Rework" sx={{ fontSize: "13px" }}>
                          Rework
                        </MenuItem>
                      </Select>
                    )}
                    disabled={editData?.concern_Status === "" || editData?.concern_Status === "For Approval" ? false : true}
                  />
                </Stack>

                {watch("Request_Type") === "Rework" && (
                  <Stack sx={{ width: "100%", mb: 1 }}>
                    <Typography sx={{ fontSize: "13px", mb: 0.5 }}>Ticket Number:</Typography>
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
                            renderInput={(params) => <TextField {...params} placeholder="Select Ticket Number" sx={{ "& .MuiInputBase-input": { fontSize: "13px" } }} />}
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
                  <Typography sx={{ fontSize: "13px", mb: 0.5 }}>Severity:</Typography>
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
                          fontSize: "13px",
                          "& .MuiSelect-select": {
                            color: "#fff",
                          },
                        }}
                      >
                        <MenuItem value="Normal" sx={{ fontSize: "13px" }}>
                          Normal
                        </MenuItem>

                        <MenuItem value="Urgent" sx={{ fontSize: "13px" }}>
                          Urgent
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
                        name="UserId"
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
                              disabled={editData?.concern_Status === "" || editData?.concern_Status === "For Approval" ? false : true}
                            />
                          )}
                        />
                        {errors.DateNeeded && <Typography sx={{ color: "theme.palette.error.main" }}>{errors.targetDate.DateNeeded}</Typography>}
                      </LocalizationProvider>
                    </Stack>

                    <Stack sx={{ width: isScreenSmall ? "100%" : "50%" }}>
                      <Typography sx={{ fontSize: "13px", mb: 0.5 }}>Service Provider:</Typography>
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
                              renderInput={(params) => <TextField {...params} placeholder="Select Service Provider" sx={{ "& .MuiInputBase-input": { fontSize: "13px" } }} />}
                              onOpen={() => {
                                if (!channelIsSuccess)
                                  getChannel({
                                    Status: true,
                                  });
                              }}
                              onChange={(_, value) => {
                                onChange(value);

                                setValue("CategoryId", []);
                                setValue("SubCategoryId", []);
                              }}
                              getOptionLabel={(option) => option.channel_Name}
                              isOptionEqualToValue={(option, value) => option.id === value.id}
                              sx={{
                                flex: 2,
                              }}
                              fullWidth
                              disabled={editData?.concern_Status === "" || editData?.concern_Status === "For Approval" ? false : true}
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
                              renderInput={(params) => <TextField {...params} placeholder="Select Category" sx={{ "& .MuiInputBase-input": { fontSize: "13px" } }} />}
                              onOpen={() => {
                                if (!categoryIsSuccess)
                                  getCategory({
                                    Status: true,
                                  });
                              }}
                              onChange={(_, value) => {
                                // console.log("Value:", value);
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
                              disablePortal
                              disableClearable
                              disabled={editData?.concern_Status === "" || editData?.concern_Status === "For Approval" ? false : true}
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
                              value={value}
                              // options={subCategoryData?.value?.filter((item) => watch("CategoryId").some((category) => item.categoryId === category.id)) || []}
                              options={subCategoryData?.value || []}
                              loading={subCategoryIsLoading}
                              renderInput={(params) => <TextField {...params} placeholder="Select Sub Category" sx={{ "& .MuiInputBase-input": { fontSize: "13px" } }} />}
                              onOpen={() => {
                                if (!subCategoryIsSuccess) getSubCategory();
                              }}
                              onChange={(_, value) => {
                                // console.log("Value ", value);

                                onChange(value);
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
                              disabled={(!watch("ChannelId") && editData?.concern_Status === "") || editData?.concern_Status === "For Approval" ? false : true}
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
                  <Typography sx={{ fontSize: "13px" }}>Concern Details:</Typography>

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
                          disabled={editData?.concern_Status === "Ongoing" || editData?.concern_Status === "For Confirmation" || editData?.concern_Status === "Done" ? true : false}
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
                          disabled={editData?.concern_Status === "" || editData?.concern_Status === "For Approval" ? false : true}
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
                    {(editData?.concern_Status === "For Approval" || editData?.concern_Status === "") && (
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
                    )}

                    <Divider
                      variant="fullWidth"
                      sx={{
                        display: !attachments?.length ? "none" : "flex",
                        background: "#2D3748",
                        marginTop: 1,
                      }}
                    />

                    {attachments === undefined ? (
                      <Stack sx={{ flexDirection: "column", maxHeight: "auto", padding: 4 }}>
                        <Stack direction="row" gap={0.5} justifyContent="center">
                          <AttachFileOutlined sx={{ color: theme.palette.text.secondary }} />
                          <Typography sx={{ color: theme.palette.text.secondary, fontSize: "13px" }}>No attached file</Typography>
                        </Stack>
                      </Stack>
                    ) : (
                      <Stack
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          maxHeight: "auto",
                        }}
                      >
                        {attachments?.map((fileName, index) => (
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

                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontSize: "13px",
                                      fontWeight: 500,
                                      color: !!fileName.ticketAttachmentId ? theme.palette.success.main : theme.palette.primary.main,
                                    }}
                                  >
                                    {!!fileName.ticketAttachmentId ? "Attached file" : "Uploaded the file successfully"}
                                  </Typography>

                                  {!!fileName.ticketAttachmentId && <CheckOutlined color="success" fontSize="small" />}
                                </Box>
                              </Box>

                              <Box>
                                <ConcernViewMenuActions
                                  editData={editData}
                                  fileName={fileName}
                                  onView={handleViewImage}
                                  onViewWithoutId={handleViewImageWithoutId}
                                  onDelete={handleDeleteFile}
                                  onDownload={handleDownloadAttachment}
                                  isImageFile={isImageFile}
                                />
                              </Box>
                            </Box>
                          </Box>
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
                        accept=".png,.jpg,.jpeg,.docx"
                        onChange={(event) => {
                          if (ticketAttachmentId) {
                            const files = Array.from(event.target.files);
                            files[0].ticketAttachmentId = ticketAttachmentId;
                            const uniqueNewFiles = files.filter((item) => !value?.some((file) => file.name === item.name));

                            onChange([...files, ...value.filter((item) => item.ticketAttachmentId !== ticketAttachmentId), ...!uniqueNewFiles]);

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
                            const uniqueNewFiles = files.filter((item) => !attachments?.some((file) => file.name === item.name));

                            onChange([...value, ...uniqueNewFiles]);
                            fileInputRef.current.value = "";
                          }
                        }}
                        hidden
                        multiple={!!ticketAttachmentId}
                      />
                    )}
                  />
                </Stack>
              </Stack>
            </Stack>
          </DialogContent>

          <DialogActions>
            {editData?.concern_Status === "" || editData?.concern_Status === "For Approval" ? (
              <LoadingButton
                size="large"
                variant="contained"
                color="primary"
                type="submit"
                loading={isCreateEditRequestorConcernLoading || isCreateEditRequestorConcernFetching || isLoading}
                disabled={
                  !watch("Concern") ||
                  moment(watch("DateNeeded")).format("MM-DD-YYYY") < moment(dateNeededValidation).format("MM-DD-YYYY") ||
                  watch("CategoryId").length === 0 ||
                  watch("SubCategoryId").length === 0 ||
                  (watch("Request_Type") === "Rework" && !watch("BackJobId"))
                }
              >
                Save
              </LoadingButton>
            ) : (
              ""
            )}

            <Button
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
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog to view image */}
      {selectedImage && (
        <>
          <Dialog fullWidth maxWidth="md" open={isViewDialogOpen} onClose={handleViewClose}>
            <DialogContent sx={{ height: "auto" }}>{selectedImage && <img src={selectedImage} alt="Preview" style={{ width: "100%" }} />}</DialogContent>
            <DialogActions>
              <Button onClick={handleViewClose}>Close</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  );
};

export default ConcernViewDialog;
