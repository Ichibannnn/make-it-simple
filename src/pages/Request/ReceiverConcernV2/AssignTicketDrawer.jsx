import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { Add, AttachFileOutlined, CheckOutlined, FileDownloadOutlined, GetAppOutlined, RemoveCircleOutline, VisibilityOutlined } from "@mui/icons-material";
import React, { useEffect, useRef, useState } from "react";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";

import moment from "moment";
import useSignalRConnection from "../../../hooks/useSignalRConnection";
import { theme } from "../../../theme/theme";
import { LoadingButton } from "@mui/lab";
import { toast } from "sonner";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { notificationMessageApi } from "../../../features/api_notification_message/notificationMessageApi";
import { notificationApi } from "../../../features/api_notification/notificationApi";

import { useDispatch } from "react-redux";
import { useLazyGetChannelsQuery } from "../../../features/api_channel_setup/channel/channelApi";
import {
  useApproveReceiverConcernMutation,
  useCreateEditReceiverConcernMutation,
  useLazyGetReceiverAttachmentQuery,
} from "../../../features/api_request/concerns_receiver/concernReceiverApi";
import { useDeleteRequestorAttachmentMutation } from "../../../features/api_request/concerns/concernApi";
import { useLazyGetDownloadAttachmentQuery, useLazyGetViewAttachmentQuery } from "../../../features/api_attachments/attachmentsApi";
import { useLazyGetCategoryQuery } from "../../../features/api masterlist/category_api/categoryApi";
import { useLazyGetSubCategoryArrayQuery } from "../../../features/api masterlist/sub_category_api/subCategoryApi";
import AssignDialogMenuAction from "./AssignDialogMenuAction";
import { useSendSmsNotificationMutation } from "../../../features/sms_notification/smsNotificationApi";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const schema = yup.object().shape({
  Requestor_By: yup.string().nullable(),
  Concern: yup.string().min(2, "Concern must be more than 1 character long").required("This field is required").label("Concern Details"),
  ticketConcernId: yup.string().nullable(),
  ChannelId: yup.object().required().label("Channel"),
  CategoryId: yup.array().required().label("Category"),
  SubCategoryId: yup.array().required().label("Sub category"),
  userId: yup.object().required().label("Issue handler"),
  targetDate: yup.date().required("Target date is required"),
  RequestConcernId: yup.string().nullable(),
  RequestAttachmentsFiles: yup.array().nullable(),
});

const AssignTicketDrawer = ({ selectedTickets, data, setData, open, onClose, viewConcernDetailsOnClose }) => {
  const [attachments, setAttachments] = useState([]);
  const [ticketAttachmentId, setTicketAttachmentId] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [formClosed, setFormClosed] = useState(false);

  const [loading, setLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);

  const dispatch = useDispatch();
  const fileInputRef = useRef();
  const today = moment();
  useSignalRConnection();

  console.log("Selected Tix: ", selectedTickets);

  console.log("Data: ", data);

  const [getChannel, { data: channelData, isLoading: channelIsLoading, isSuccess: channelIsSuccess }] = useLazyGetChannelsQuery();
  const [getCategory, { data: categoryData, isLoading: categoryIsLoading, isSuccess: categoryIsSuccess }] = useLazyGetCategoryQuery();
  const [getSubCategory, { data: subCategoryData, isLoading: subCategoryIsLoading, isSuccess: subCategoryIsSuccess }] = useLazyGetSubCategoryArrayQuery();
  const [getIssueHandler, { isLoading: issueHandlerIsLoading, isSuccess: issueHandlerIsSuccess }] = useLazyGetChannelsQuery();
  const [createEditReceiverConcern, { isLoading: isCreateEditReceiverConcernLoading, isFetching: isCreateEditReceiverConcernFetching }] = useCreateEditReceiverConcernMutation();
  const [approveReceiverConcern, { isLoading: approveReceiverConcernIsLoading, isFetching: approveReceiverConcernIsFetching }] = useApproveReceiverConcernMutation();
  const [smsNotification] = useSendSmsNotificationMutation();

  const [deleteRequestorAttachment] = useDeleteRequestorAttachmentMutation();
  const [getAddReceiverAttachment] = useLazyGetReceiverAttachmentQuery();
  const [getViewAttachment] = useLazyGetViewAttachmentQuery();
  const [getDownloadAttachment] = useLazyGetDownloadAttachmentQuery();

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
      Requestor_By: "",
      ticketConcernId: "",
      Concern: "",

      ChannelId: null,
      CategoryId: [],
      SubCategoryId: [],

      userId: null,
      targetDate: null,

      RequestConcernId: "",
      RequestAttachmentsFiles: [],
    },
  });

  const handleAttachments = (event) => {
    const newFiles = Array.from(event.target.files);

    const fileNames = newFiles.map((file) => ({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2),
      file,
    }));

    const uniqueNewFiles = fileNames?.filter((newFile) => !attachments?.some((existingFile) => existingFile?.name === newFile?.name));
    setAttachments((prevFiles) => (Array.isArray(prevFiles) ? [...prevFiles, ...uniqueNewFiles] : [...uniqueNewFiles]));
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleDeleteFile = async (fileNameToDelete) => {
    console.log("File name: ", fileNameToDelete);

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

  const handleDragOver = (event) => {
    event.preventDefault();
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
        }))
      );
    } catch (error) {}
  };

  const handleViewImage = async (file) => {
    console.log("File: ", file);
    setViewLoading(true);
    try {
      const response = await getViewAttachment(file?.ticketAttachmentId);

      console.log("Res: ", response);

      if (response?.data) {
        const imageUrl = URL.createObjectURL(response.data); // Create a URL for the fetched image
        setSelectedImage(imageUrl); // Set the image URL to state
        setIsViewDialogOpen(true);
        setViewLoading(false);
      }
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  const handleViewImageWithoutId = (file) => {
    console.log("File: ", file);
    setViewLoading(true);
    const reader = new FileReader();
    try {
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setIsViewDialogOpen(true);
      };
      reader.readAsDataURL(file);
      setViewLoading(false);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  const isImageFile = (fileName) => {
    return /\.(jpg|jpeg|png)$/i.test(fileName);
  };

  const handleDownloadAttachment = async (file) => {
    setLoading(true);
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
        setLoading(false);
      } else {
        console.log("No data in the response");
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const onCloseAction = () => {
    reset();
    setFormClosed((prev) => !prev);
    onClose();
  };

  const handleViewImageClose = () => {
    setIsViewDialogOpen(false);
    setSelectedImage(null);
  };

  const onSubmitAction = (formData) => {
    console.log("FormData: ", formData);

    const payload = new FormData();

    payload.append("TicketConcernId", formData.ticketConcernId);
    payload.append("ChannelId", formData.ChannelId.id);
    payload.append("Requestor_By", formData.Requestor_By);
    payload.append("UserId", formData.userId?.userId);
    payload.append("Concern", formData.Concern);
    payload.append("Target_Date", moment(formData.targetDate).format("YYYY-MM-DD"));

    const category = formData.CategoryId;
    for (let i = 0; i < category.length; i++) {
      payload.append(`RequestorTicketCategories[${i}].ticketCategoryId`, category[i].ticketCategoryId || "");
      payload.append(`RequestorTicketCategories[${i}].categoryId`, category[i]?.id);
    }

    if (category.length === 0) {
      payload.append(`RequestorTicketCategories[0].ticketCategoryId`, "");
      payload.append(`RequestorTicketCategories[0].categoryId`, "");
    }

    const subCategory = formData.SubCategoryId;
    for (let i = 0; i < subCategory.length; i++) {
      payload.append(`RequestorTicketSubCategories[${i}].ticketSubCategoryId`, subCategory[i].ticketSubCategoryId || "");
      payload.append(`RequestorTicketSubCategories[${i}].subCategoryId`, subCategory[i]?.subCategoryId);
    }

    if (subCategory.length === 0) {
      payload.append(`RequestorTicketSubCategories[0].ticketSubCategoryId`, "");
      payload.append(`RequestorTicketSubCategories[0].subCategoryId`, "");
    }

    // Attachments
    const files = formData.RequestAttachmentsFiles;
    for (let i = 0; i < files.length; i++) {
      payload.append(`ConcernAttachments[${i}].ticketAttachmentId`, files[i].ticketAttachmentId || "");
      payload.append(`ConcernAttachments[${i}].attachment`, files[i]);
    }

    if (files.length === 0) {
      payload.append(`ConcernAttachments[0].ticketAttachmentId`, "");
      payload.append(`ConcernAttachments[0].attachment`, "");
    }

    console.log("Payload Entries: ", [...payload.entries()]);

    const approvePayload = {
      ticketConcernId: formData.ticketConcernId,
    };

    const smsPayload = {
      system_name: "Make It Simple",
      message: `Fresh Morning! Concern #${data?.requestConcernId} has been assigned to your account. Kindly check your ticket list.`,
      mobile_number: data?.contact_Number,
    };

    // Swal.fire({
    //   title: "Confirmation",
    //   text: "Approve this concern?",
    //   icon: "info",
    //   color: "white",
    //   showCancelButton: true,
    //   background: "#111927",
    //   confirmButtonColor: "#9e77ed",
    //   confirmButtonText: "Yes",
    //   cancelButtonText: "No",
    //   cancelButtonColor: "#1C2536",
    //   heightAuto: false,
    //   width: "30em",
    //   customClass: {
    //     container: "custom-container",
    //     title: "custom-title",
    //     htmlContainer: "custom-text",
    //     icon: "custom-icon",
    //     confirmButton: "custom-confirm-btn",
    //     cancelButton: "custom-cancel-btn",
    //   },
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     createEditReceiverConcern(payload)
    //       .unwrap()
    //       .then(() => {
    //         // Approve API
    //         approveReceiverConcern(approvePayload)
    //           .unwrap()
    //           .then(() => {
    //             setData(null);
    //             onClose();
    //           })
    //           .catch((err) => {
    //             console.log("Error", err);
    //             toast.error("Error!", {
    //               description: err.data.error.message,
    //               duration: 1500,
    //             });
    //           });

    //         toast.success("Success!", {
    //           description: "Approve concern successfully!",
    //           duration: 1500,
    //         });

    //         dispatch(notificationApi.util.resetApiState());
    //         dispatch(notificationMessageApi.util.resetApiState());

    //         setAttachments([]);
    //         reset();
    //         setData(null);
    //         viewConcernDetailsOnClose();
    //         onClose();
    //       })
    //       .catch((err) => {
    //         console.log("Error", err);
    //         toast.error("Error!", {
    //           description: err.data.error.message,
    //           duration: 1500,
    //         });
    //       });

    //     // SEND SMS STATUS
    //     try {
    //       smsNotification(smsPayload).unwrap();
    //     } catch (error) {
    //       console.log(error);
    //       toast.error("Error!", {
    //         description: "Sms notification error!",
    //         duration: 1500,
    //       });
    //     }
    //   }
    // });
  };

  useEffect(() => {
    if (data) {
      if (!channelIsSuccess) getChannel();

      setValue("Requestor_By", data?.requestorId);
      // setValue("concern_Details", [data?.concern]);
      setValue("Concern", data?.concern);
      setValue("ticketConcernId", data?.ticketRequestConcerns?.[0]?.ticketConcernId);

      setValue("ChannelId", {
        id: data?.channelId,
        channel_Name: data?.channel_Name,
      });

      const category = data?.getRequestTicketCategories?.map((item) => ({
        ticketCategoryId: item.ticketCategoryId,
        id: item.categoryId,
        category_Description: item.category_Description,
      }));

      const subCategory = data?.getRequestSubTicketCategories.map((item) => ({
        ticketSubCategoryId: item.ticketSubCategoryId,
        subCategoryId: item.subCategoryId,
        sub_Category_Description: item.subCategory_Description,
      }));

      const categoryIdParams = data?.getRequestTicketCategories?.map((item) => item?.categoryId);

      setValue("CategoryId", category);
      setValue("SubCategoryId", subCategory);

      // setValue("CategoryId", {
      //   id: data?.categoryId,
      //   category_Description: data?.category_Description,
      // });

      // setValue("SubCategoryId", {
      //   id: data?.subCategoryId,
      //   subCategory_Description: data?.subCategory_Description,
      // });

      getAddAttachmentData(data.requestConcernId);
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
        selectedCategories.some((category) => subCategoryData?.value?.some((item) => item.subCategoryId === subCategory.subCategoryId && item.categoryId === category.id))
      );
      setValue("SubCategoryId", filteredSubCategories);
    } else {
      setValue("SubCategoryId", []);
    }
  }, [subCategoryData]);

  return (
    <>
      <Dialog fullWidth maxWidth="sm" open={open}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "center",
            paddingTop: 0,
            paddingBottom: 0,
            marginBlockEnd: "5.28px",
            fontSize: "18px",
            fontWeight: 700,
            color: "#fff",
          }}
        >
          Assign Ticket
        </DialogTitle>

        <Swiper
          pagination={{
            type: "fraction",
          }}
          navigation={true}
          modules={[Pagination, Navigation]}
          className="mySwiper"
        >
          {selectedTickets?.map((item) => (
            <SwiperSlide key={item.requestConcernId}>
              <Stack sx={{ width: "85%", height: "auto", mb: 4, background: theme.palette.bgForm.black2, borderRadius: "20px", padding: 2 }}>
                <form onSubmit={handleSubmit(onSubmitAction)}>
                  <DialogContent>
                    <Stack sx={{ width: "100%", height: "700px", gap: 1 }}>
                      <Stack sx={{ width: "100%", gap: 0.5, mb: 1 }}>
                        <Stack direction="row" gap={2}>
                          <Box sx={{ width: "100px" }}>
                            <Typography
                              sx={{
                                fontSize: "13px",

                                fontWeight: "500",
                              }}
                            >
                              Concern No:
                            </Typography>
                          </Box>

                          <Box>
                            <Typography
                              sx={{
                                fontSize: "13px",
                              }}
                            >
                              {data?.requestConcernId}
                            </Typography>
                          </Box>
                        </Stack>

                        <Stack direction="row" gap={2}>
                          <Box sx={{ width: "100px" }}>
                            <Typography
                              sx={{
                                fontSize: "13px",

                                fontWeight: "500",
                              }}
                            >
                              Date Needed:
                            </Typography>
                          </Box>

                          <Box>
                            <Typography
                              sx={{
                                fontSize: "13px",
                              }}
                            >
                              {moment(data?.date_Needed).format("LL")}
                            </Typography>
                          </Box>
                        </Stack>
                      </Stack>

                      <Stack gap={0.5}>
                        <Typography
                          sx={{
                            fontSize: "13px",
                          }}
                        >
                          Ticket Description:
                        </Typography>

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

                      <Stack gap={0.5}>
                        <Typography
                          sx={{
                            fontSize: "13px",
                          }}
                        >
                          Channel Name:
                        </Typography>
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
                                  setValue("CategoryId", []);
                                  setValue("SubCategoryId", []);
                                  setValue("userId", null);
                                }}
                                getOptionLabel={(option) => option.channel_Name}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                sx={{
                                  flex: 2,
                                }}
                                componentsProps={{
                                  popper: {
                                    sx: {
                                      "& .MuiAutocomplete-listbox": {
                                        fontSize: "13px",
                                      },
                                    },
                                  },
                                }}
                                fullWidth
                                // disablePortal
                                disableClearable
                              />
                            );
                          }}
                        />
                      </Stack>

                      <Stack gap={0.5}>
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
                                options={categoryData?.value?.category?.filter((item) => item.channelId === watch("ChannelId")?.id) || []}
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
                                // disablePortal
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

                      <Stack gap={0.5}>
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
                                options={subCategoryData?.value || []}
                                loading={subCategoryIsLoading}
                                renderInput={(params) => <TextField {...params} placeholder="Sub Category" sx={{ "& .MuiInputBase-input": { fontSize: "13px" } }} />}
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
                                sx={{
                                  flex: 2,
                                }}
                                fullWidth
                                // disablePortal
                                disableClearable
                                disabled={!watch("ChannelId")}
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

                      <Stack gap={0.5}>
                        <Typography
                          sx={{
                            fontSize: "13px",
                          }}
                        >
                          Assign To:
                        </Typography>
                        <Controller
                          control={control}
                          name="userId"
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
                                sx={{
                                  flex: 2,
                                }}
                                componentsProps={{
                                  popper: {
                                    sx: {
                                      "& .MuiAutocomplete-listbox": {
                                        fontSize: "13px",
                                      },
                                    },
                                  },
                                }}
                                fullWidth
                                // disablePortal
                              />
                            );
                          }}
                        />
                      </Stack>

                      <Stack gap={0.5}>
                        <Typography
                          sx={{
                            fontSize: "13px",
                          }}
                        >
                          Target Date:
                        </Typography>

                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <Controller
                            control={control}
                            name="targetDate"
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
                                        padding: "10.5px 14px",
                                      },
                                      "& .MuiOutlinedInput-root": {
                                        fontSize: "13px",
                                      },
                                    },
                                  },
                                }}
                                minDate={new moment()}
                                error={!!errors.targetDate}
                                helperText={errors.targetDate ? errors.targetDate.message : null}
                              />
                            )}
                          />
                          {errors.targetDate && <Typography>{errors.targetDate.message}</Typography>}
                        </LocalizationProvider>
                      </Stack>

                      {/* Attachments */}
                      <Stack padding={2} marginTop={3} gap={1.5} sx={{ border: "1px solid #2D3748", borderRadius: "20px" }}>
                        <Stack direction="row" gap={1} alignItems="center" onDragOver={handleDragOver}>
                          <GetAppOutlined sx={{ color: theme.palette.text.secondary }} />

                          <Typography
                            sx={{
                              fontSize: "14px",
                            }}
                          >
                            Attachments:
                          </Typography>

                          <Button size="small" variant="contained" color="warning" startIcon={<Add />} onClick={handleUploadButtonClick}>
                            <Typography sx={{ fontSize: "12px" }}>Add</Typography>
                          </Button>
                        </Stack>

                        {attachments === undefined ? (
                          <Stack sx={{ flexDirection: "column", maxHeight: "auto" }}>
                            <Stack direction="row" gap={0.5} justifyContent="center">
                              <AttachFileOutlined sx={{ color: theme.palette.text.secondary }} />
                              <Typography sx={{ color: theme.palette.text.secondary }}>No attached file</Typography>
                            </Stack>
                          </Stack>
                        ) : (
                          <Stack sx={{ flexDirection: "column", maxHeight: "auto" }}>
                            {attachments?.map((fileName, index) => (
                              <Box
                                key={index}
                                sx={{
                                  display: "flex",
                                  width: "100%",
                                  flexDirection: "column",
                                  justifyContent: "space-between",
                                  padding: 1,
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
                                    <Typography sx={{ fontSize: "14px" }}>{fileName.name}</Typography>

                                    <Typography
                                      sx={{
                                        fontSize: "14px",
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
                                          fontSize: 13,
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
                                    <AssignDialogMenuAction
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

                                const uniqueNewFiles = files.filter((item) => !value.some((file) => file.name === item.name));

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
                  </DialogContent>

                  <DialogActions>
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      loading={isCreateEditReceiverConcernLoading || isCreateEditReceiverConcernFetching}
                      disabled={!watch("ChannelId") || watch("CategoryId").length === 0 || watch("SubCategoryId").length === 0 || !watch("userId") || !watch("targetDate")}
                      sx={{
                        ":disabled": {
                          backgroundColor: theme.palette.secondary.main,
                          color: "black",
                        },
                      }}
                    >
                      Assign
                    </LoadingButton>
                    <LoadingButton variant="outlined" onClick={onCloseAction}>
                      Close
                    </LoadingButton>
                  </DialogActions>
                </form>
              </Stack>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Dialog to view image */}
        {selectedImage && (
          <>
            <Dialog fullWidth maxWidth="md" open={isViewDialogOpen} onClose={handleViewImageClose}>
              <DialogContent sx={{ height: "auto" }}>{selectedImage && <img src={selectedImage} alt="Preview" style={{ width: "100%" }} />}</DialogContent>
              <DialogActions>
                <Button onClick={handleViewImageClose}>Close</Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </Dialog>
    </>
  );
};

export default AssignTicketDrawer;
