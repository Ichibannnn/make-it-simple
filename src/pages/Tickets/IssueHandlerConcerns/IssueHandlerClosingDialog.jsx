import { LoadingButton } from "@mui/lab";
import { Autocomplete, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, Divider, FormHelperText, IconButton, LinearProgress, Stack, TextField, Typography } from "@mui/material";
import { Close, CloseOutlined, FiberManualRecord, RestartAlt, ZoomIn, ZoomOut } from "@mui/icons-material";

import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { toast } from "sonner";
import { theme } from "../../../theme/theme";
import { formStyle as sx } from "./style/formStyle";

import { useDeleteRequestorAttachmentMutation, useLazyGetTechniciansQuery } from "../../../features/api_request/concerns/concernApi";
import { useCloseIssueHandlerTicketsMutation } from "../../../features/api_ticketing/issue_handler/concernIssueHandlerApi";
import { useDispatch, useSelector } from "react-redux";
import { notificationApi } from "../../../features/api_notification/notificationApi";
import { useLazyGetCategoryQuery } from "../../../features/api masterlist/category_api/categoryApi";
import { useLazyGetSubCategoryArrayQuery } from "../../../features/api masterlist/sub_category_api/subCategoryApi";
import { notificationMessageApi } from "../../../features/api_notification_message/notificationMessageApi";
import { useLazyGetCategoryConcernQuery } from "../../../features/api masterlist/category_concern/categoryConcernApi";
import { getAttachmentIcon } from "../../../utils/getAttachmentIcon";
import moment from "moment";
import { sweetAlertDialog } from "../../../hooks/useSweetAlertDialog";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

const schema = yup.object().shape({
  ticketConcernId: yup.number(),
  resolution: yup.string().min(20, "Resolution must be more than 20 character long").required("This field is required").label("Resolution"),
  AddClosingAttachments: yup.array().nullable(),
  ChannelId: yup.object().required().label("Channel"),
  CategoryId: yup.array().required().label("Category"),
  SubCategoryId: yup.array().required().label("Sub Category"),
  CategoryConcern: yup.object().required().label("Concern Category"),
  Technicians: yup.array().notRequired(),
  Notes: yup.string().notRequired(),

  ClosingDate: yup.date().notRequired(),
  BackdateRemarks: yup.string().notRequired(),
});

const IssueHandlerClosingDialog = ({ data, open, onClose, viewOnClose }) => {
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

  const channelNameValidation = useSelector((state) => state?.user?.channels?.[0]?.channelName);
  // useSignalRConnection();

  const [getCategory, { data: categoryData, isLoading: categoryIsLoading, isSuccess: categoryIsSuccess }] = useLazyGetCategoryQuery();
  const [getSubCategory, { data: subCategoryData, isLoading: subCategoryIsLoading }] = useLazyGetSubCategoryArrayQuery();
  const [getConcernCategory, { data: concernCategoryData, isLoading: concernCategoryIsLoading, isSuccess: concernCategoryIsSuccess }] = useLazyGetCategoryConcernQuery();
  const [getTechnicians, { data: technicianData, isLoading: technicianIsLoading, isSuccess: technicianIsSuccess }] = useLazyGetTechniciansQuery();
  const [closeIssueHandlerTickets, { isLoading: closeIssueHandlerTicketsIsLoading, isFetching: closeIssueHandlerTicketsIsFetching }] = useCloseIssueHandlerTicketsMutation();

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
      ticketConcernId: "",
      resolution: "",
      AddClosingAttachments: [],

      ChannelId: null,
      CategoryId: [],
      SubCategoryId: [],
      CategoryConcern: null,
      Technicians: [],

      Notes: "",
      ClosingDate: null,
      BackdateRemarks: "",
    },
  });

  const onSubmitAction = async (formData) => {
    const payload = new FormData();

    payload.append("TicketConcernId", formData.ticketConcernId);
    payload.append("CategoryConcernId", formData.CategoryConcern.id);
    payload.append("CategoryConcern", formData.CategoryConcern.categoryConcern);
    payload.append("Resolution", formData.resolution);
    payload.append("Notes", formData.Notes);

    payload.append("BackDate", formData.ClosingDate ? moment(formData.ClosingDate).format("YYYY-MM-DD") : "");
    payload.append("BackDateRemarks", formData.BackdateRemarks !== "" ? formData.BackdateRemarks : "");

    const category = formData.CategoryId;
    for (let i = 0; i < category.length; i++) {
      payload.append(`ClosingTicketCategories[${i}].ticketCategoryId`, category[i].ticketCategoryId || "");
      payload.append(`ClosingTicketCategories[${i}].categoryId`, category[i]?.id);
    }

    if (category.length === 0) {
      payload.append(`ClosingTicketCategories[0].ticketAttachmentId`, "");
      payload.append(`ClosingTicketCategories[0].categoryId`, "");
    }

    const subCategory = formData.SubCategoryId;

    for (let i = 0; i < subCategory.length; i++) {
      payload.append(`ClosingSubTicketCategories[${i}].ticketSubCategoryId`, subCategory[i]?.ticketSubCategoryId || "");
      payload.append(`ClosingSubTicketCategories[${i}].subCategoryId`, subCategory[i]?.subCategoryId);
    }

    if (subCategory.length === 0) {
      payload.append(`ClosingSubTicketCategories[0].ticketSubCategoryId`, "");
      payload.append(`ClosingSubTicketCategories[0].subCategoryId`, "");
    }

    const technicians = formData.Technicians;
    for (let i = 0; i < technicians.length; i++) {
      payload.append(`AddClosingTicketTechnicians[${i}].ticketTechnicianId`, "");
      payload.append(`AddClosingTicketTechnicians[${i}].technician_By`, technicians[i]?.technicianId);
    }

    if (technicians.length === 0) {
      payload.append(`AddClosingTicketTechnicians[0].ticketTechnicianId`, "");
      payload.append(`AddClosingTicketTechnicians[0].technician_By`, "");
    }

    // Attachments
    const files = formData.AddClosingAttachments;
    for (let i = 0; i < files.length; i++) {
      payload.append(`AddClosingAttachments[${i}].ticketAttachmentId`, files[i].ticketAttachmentId || "");
      payload.append(`AddClosingAttachments[${i}].attachment`, files[i]);
    }

    if (files.length === 0) {
      payload.append(`AddClosingAttachments[0].ticketAttachmentId`, "");
      payload.append(`AddClosingAttachments[0].attachment`, "");
    }

    console.log("Payload Entries: ", [...payload.entries()]);
    // 4pm Cut-off Warning
    // const isAfter4PM = moment().isAfter(moment().set({ hour: 16, minute: 0 }));

    const result = await sweetAlertDialog({
      title: "Confirmation",
      text: `Requesting to close this ticket number ${moment(data?.created_At).format("YYYY")}-${data?.ticketConcernId}?`,
      icon: "info",
      confirmButtonText: "Yes",
    });

    if (result.isConfirmed) {
      try {
        closeIssueHandlerTickets(payload)
          .unwrap()
          .then(() => {
            toast.success("Success!", {
              description: "Ticket submitted successfully!",
              duration: 1500,
            });
            dispatch(notificationApi.util.resetApiState());
            dispatch(notificationMessageApi.util.resetApiState());
            setAttachments([]);
            reset();
            viewOnClose();
            onClose();
          });
      } catch (error) {
        toast.error("Error!", {
          description: error.data.error.message,
          duration: 1500,
        });
      }
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

  const handleDeleteFile = async (fileNameToDelete) => {
    setAttachments((prevFiles) => prevFiles.filter((fileName) => fileName !== fileNameToDelete));

    setValue(
      "AddClosingAttachments",
      watch("AddClosingAttachments").filter((file) => file.name !== fileNameToDelete.name),
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
    if (!concernCategoryData) getConcernCategory({ Status: true });

    if (data) {
      setValue("ticketConcernId", data?.ticketConcernId);

      setValue("ChannelId", {
        id: data?.channelId,
        channel_Name: data?.channel_Name,
      });

      setValue("CategoryConcern", {
        id: concernCategoryData?.value?.category?.[0]?.id,
        categoryConcern: concernCategoryData?.value?.category?.[0]?.categoryConcern,
      });

      const category = data?.getOpenTicketCategories?.map((item) => ({
        ticketCategoryId: item.ticketCategoryId,
        id: item.categoryId,
        category_Description: item.category_Description,
      }));

      const subCategory = data?.getOpenTicketSubCategories.map((item) => ({
        ticketSubCategoryId: item.ticketSubCategoryId,
        subCategoryId: item.subCategoryId,
        sub_Category_Description: item.subCategory_Description,
      }));

      setValue("CategoryId", null);
      setValue("SubCategoryId", null);

      const categoryIdParams = data?.getOpenTicketCategories?.map((item) => item?.categoryId);

      setValue("CategoryId", category);
      setValue("SubCategoryId", subCategory);
      getSubCategory({
        CategoryId: categoryIdParams,
      });
    }
  }, [data]);

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

  const minDate = new moment().subtract(1, "days");
  const today = new moment();
  const isTodayAfterTarget = today.isAfter(data?.target_Date);
  const isTodayAndTargetSame = today.isSame(data?.target_Date, "day");

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
        sx={{ borderRadius: "none", padding: 0, backdropFilter: "blur(5px)" }}
        PaperProps={{ style: { overflow: "auto" } }}
      >
        <DialogContent>
          <Stack>
            <Stack id="closeTicket" component="form" direction="row" gap={1} onSubmit={handleSubmit(onSubmitAction)}>
              {/* Ticket Details */}
              <Stack sx={{ padding: 1, width: "100%" }}>
                {/* Ticket Number */}
                <Stack>
                  <Typography sx={sx.titleText}>Close Ticket</Typography>
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

                  <Divider variant="fullWidth" sx={sx.divider} />

                  <Stack sx={sx.closeDetailContent}>
                    <Box sx={sx.titleDetailBox}>
                      <Typography sx={sx.detailTitleText}>Target Date:</Typography>
                    </Box>

                    <Box sx={sx.spacer} />

                    <Box sx={sx.descDetailBox}>
                      <Typography sx={sx.detailDescText}>{moment(data?.target_Date).format("LL")}</Typography>
                    </Box>
                  </Stack>
                </Stack>

                {/* Fields */}
                <Stack sx={sx.fieldSection}>
                  {/* Category and Sub-Category */}
                  <Stack sx={sx.categoryBox}>
                    {/* Category */}
                    <Stack sx={sx.fieldTwoColsStack}>
                      <Stack sx={sx.fieldTitleWithIconBox}>
                        <Typography sx={sx.fieldText}>Category:</Typography>
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
                              options={categoryData?.value?.category.filter((item) => item.channelId === watch("ChannelId")?.id) || []}
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
                              // disablePortal
                              disableClearable
                              componentsProps={sx.automCompleteProp}
                            />
                          );
                        }}
                      />
                    </Stack>

                    {/* Sub Category */}
                    <Stack sx={sx.fieldTwoColsStack}>
                      <Stack sx={sx.fieldTitleWithIconBox}>
                        <Typography sx={sx.fieldText}>Sub Category:</Typography>
                        <FiberManualRecord sx={sx.requiredDot} />
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
                              onChange={(_, value) => {
                                onChange(value);
                              }}
                              getOptionLabel={(option) => option?.sub_Category_Description || ""}
                              isOptionEqualToValue={(option, value) => option?.subCategoryId === value?.subCategoryId}
                              getOptionDisabled={(option) => watch("SubCategoryId").some((item) => item.subCategoryId === option.subCategoryId)}
                              noOptionsText={"No sub category available"}
                              disableClearable
                              componentsProps={sx.automCompleteProp}
                            />
                          );
                        }}
                      />
                    </Stack>
                  </Stack>

                  {/* Concern Category */}
                  <Stack sx={sx.fieldOneColStack}>
                    <Stack sx={sx.fieldTitleWithIconBox}>
                      <Typography sx={sx.fieldText}>Concern Category:</Typography>
                      <FiberManualRecord sx={sx.requiredDot} />
                    </Stack>

                    <Controller
                      control={control}
                      name="CategoryConcern"
                      render={({ field: { ref, value, onChange } }) => {
                        return (
                          <Autocomplete
                            ref={ref}
                            size="small"
                            value={value}
                            options={concernCategoryData?.value?.category || []}
                            loading={concernCategoryIsLoading}
                            renderInput={(params) => <TextField {...params} placeholder="Concern Category" sx={sx.autoComplete} />}
                            onOpen={() => {
                              if (!concernCategoryIsSuccess)
                                getConcernCategory({
                                  Status: true,
                                });
                            }}
                            onChange={(_, value) => {
                              onChange(value);
                            }}
                            getOptionLabel={(option) => option.categoryConcern || ""}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            sx={{
                              flex: 2,
                            }}
                            fullWidth
                            // disablePortal
                            disableClearable
                            componentsProps={sx.automCompleteProp}
                          />
                        );
                      }}
                    />
                  </Stack>

                  {channelNameValidation === "HMU - IT Hardware Support (Hardware Concern)" && isTodayAfterTarget && !isTodayAndTargetSame && (
                    <>
                      {/* Backdate */}

                      <Stack sx={sx.fieldOneColStack}>
                        <Stack sx={sx.fieldTitleWithIconBox}>
                          <Typography sx={sx.fieldText}>Backdate (Optional):</Typography>
                        </Stack>

                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <Controller
                            control={control}
                            name="ClosingDate"
                            render={({ field }) => (
                              <DatePicker
                                value={field.value ? moment(field.value) : null}
                                onChange={(newValue) => {
                                  const formattedValue = newValue ? moment(newValue).format("YYYY-MM-DD") : null;
                                  field.onChange(formattedValue);
                                  console.log("FormattedValue: ", newValue);
                                }}
                                slotProps={sx.datePickerSlotProp}
                                maxDate={new moment()}
                                minDate={minDate}
                                error={!!errors.ClosingDate}
                                helperText={errors.ClosingDate ? errors.ClosingDate.message : null}
                              />
                            )}
                          />

                          {errors.ClosingDate && <Typography sx={sx.textErrors}>{errors.ClosingDate.message}</Typography>}
                        </LocalizationProvider>
                      </Stack>

                      {/* Backdate Remarks*/}
                      {watch("ClosingDate") && (
                        <Stack sx={sx.fieldOneColStack}>
                          <Stack sx={sx.fieldTitleWithIconBox}>
                            <Typography sx={sx.fieldText}>Backdate Remarks:</Typography>
                            <FiberManualRecord sx={sx.requiredDot} />
                          </Stack>

                          <Controller
                            control={control}
                            name="BackdateRemarks"
                            render={({ field: { ref, value, onChange } }) => {
                              return (
                                <TextField
                                  inputRef={ref}
                                  size="medium"
                                  value={value}
                                  onChange={onChange}
                                  autoComplete="off"
                                  rows={2}
                                  multiline
                                  InputProps={sx.textFieldInputProps}
                                  InputLabelProps={sx.textFieldLabelProps}
                                  disabled={!watch("ClosingDate")}
                                  sx={{
                                    "& .disabled": {
                                      backgroundColor: !watch("ClosingDate") ? "lightgray" : "inherit",
                                      cursor: !watch("ClosingDate") ? "not-allowed" : "inherit",
                                    },
                                  }}
                                />
                              );
                            }}
                          />

                          {errors.BackdateRemarks && <Typography sx={sx.textErrors}>{errors.BackdateRemarks.message}</Typography>}
                        </Stack>
                      )}
                    </>
                  )}

                  {/* Resolution */}
                  <Stack sx={sx.fieldOneColStack}>
                    <Stack sx={sx.fieldTitleWithIconBox}>
                      <Typography sx={sx.fieldText}>Resolution:</Typography>
                      <FiberManualRecord sx={sx.requiredDot} />
                    </Stack>

                    <Controller
                      control={control}
                      name="resolution"
                      render={({ field: { ref, value, onChange } }) => {
                        return (
                          <TextField
                            inputRef={ref}
                            size="medium"
                            value={value}
                            onChange={onChange}
                            autoComplete="off"
                            rows={6}
                            multiline
                            InputProps={sx.textFieldInputProps}
                            InputLabelProps={sx.textFieldLabelProps}
                          />
                        );
                      }}
                    />

                    {errors.resolution && <Typography sx={sx.textErrors}>{errors.resolution.message}</Typography>}
                  </Stack>

                  {/* Technicians */}
                  <Stack sx={sx.fieldOneColStack}>
                    <Typography sx={sx.fieldText}>Technicians (Optional):</Typography>

                    <Controller
                      control={control}
                      name="Technicians"
                      render={({ field: { ref, value, onChange } }) => (
                        <Stack spacing={0.5} sx={{ flex: 2 }}>
                          <Autocomplete
                            multiple
                            ref={ref}
                            size="small"
                            value={value}
                            options={technicianData?.value || []}
                            loading={technicianIsLoading}
                            renderInput={(params) => <TextField {...params} placeholder="Add Technicians" sx={sx.autoComplete} />}
                            onOpen={() => {
                              if (!technicianIsSuccess) getTechnicians();
                            }}
                            onChange={(_, newValue) => {
                              if (newValue.length <= 3) {
                                onChange(newValue);
                              }
                            }}
                            getOptionLabel={(option) => option.technician_Name || ""}
                            isOptionEqualToValue={(option, val) => option.technicianId === val.technicianId}
                            getOptionDisabled={(option) => watch("Technicians").some((item) => item.technicianId === option.technicianId)}
                            fullWidth
                            // disablePortal
                            disableClearable
                            componentsProps={sx.automCompleteProp}
                          />

                          {value.length >= 3 && <FormHelperText sx={{ color: theme.palette.warning.main }}>You can only select up to 3 technicians.</FormHelperText>}
                        </Stack>
                      )}
                    />
                  </Stack>

                  {/* Notes */}
                  <Stack sx={sx.fieldOneColStack}>
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
                            onChange={onChange}
                            autoComplete="off"
                            rows={4}
                            multiline
                            InputProps={sx.textFieldInputProps}
                            InputLabelProps={sx.textFieldLabelProps}
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
                    name="AddClosingAttachments"
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
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <LoadingButton form="closeTicket" variant="contained" loading={closeIssueHandlerTicketsIsLoading || closeIssueHandlerTicketsIsFetching} onClick={onCloseHandler} sx={sx.cancelButton}>
            Cancel
          </LoadingButton>

          <LoadingButton
            type="submit"
            form="closeTicket"
            variant="contained"
            loading={closeIssueHandlerTicketsIsLoading || closeIssueHandlerTicketsIsFetching}
            disabled={
              !watch("resolution") || watch("CategoryId").length === 0 || watch("SubCategoryId").length === 0 || !watch("CategoryConcern") || (watch("ClosingDate") && !watch("BackdateRemarks"))
            }
          >
            Close Ticket
          </LoadingButton>
        </DialogActions>
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

export default IssueHandlerClosingDialog;

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
