import { LoadingButton } from "@mui/lab";
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, Divider, FormHelperText, IconButton, Stack, TextField, Typography, useMediaQuery } from "@mui/material";
import { Add, AttachFileOutlined, CheckOutlined, Close, FiberManualRecord } from "@mui/icons-material";

import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { theme } from "../../../theme/theme";

import { useDeleteRequestorAttachmentMutation, useLazyGetTechniciansQuery } from "../../../features/api_request/concerns/concernApi";
import { useCloseIssueHandlerTicketsMutation } from "../../../features/api_ticketing/issue_handler/concernIssueHandlerApi";
import { useLazyGetDownloadAttachmentQuery, useLazyGetViewAttachmentQuery } from "../../../features/api_attachments/attachmentsApi";
import { useLazyGetCategoryQuery } from "../../../features/api masterlist/category_api/categoryApi";
import { useLazyGetSubCategoryArrayQuery } from "../../../features/api masterlist/sub_category_api/subCategoryApi";
import { useLazyGetCategoryConcernQuery } from "../../../features/api masterlist/category_concern/categoryConcernApi";

import ManageForClosingMenuActions from "./MenuActions/ManageForClosingMenuActions";
import { getAttachmentIcon } from "../../../utils/getAttachmentIcon";
import moment from "moment";

const schema = yup.object().shape({
  ticketConcernId: yup.number(),
  closingTicketId: yup.number(),
  resolution: yup.string().min(20, "Resolution must be more than 20 character long").required("This field is required").label("Resolution"),
  AddClosingAttachments: yup.array().nullable(),

  ChannelId: yup.object().required().label("Channel"),
  CategoryId: yup.array().required().label("Category"),
  SubCategoryId: yup.array().required().label("Sub Category"),
  CategoryConcern: yup.object().required().label("Concern Category"),
  Technicians: yup.array().notRequired(),

  Notes: yup.string().notRequired(),
});

const ManageTicketDialog = ({ data, open, onClose }) => {
  const [attachments, setAttachments] = useState([]);
  const [ticketAttachmentId, setTicketAttachmentId] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null); // To handle the selected image
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false); // To control the view dialog

  const [viewIsLoading, setViewIsLoading] = useState(false);
  const [downloadIsLoading, setDownloadIsLoading] = useState(false);

  const fileInputRef = useRef();
  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));
  // useSignalRConnection();

  const [getCategory, { data: categoryData, isLoading: categoryIsLoading, isSuccess: categoryIsSuccess }] = useLazyGetCategoryQuery();
  const [getSubCategory, { data: subCategoryData, isLoading: subCategoryIsLoading }] = useLazyGetSubCategoryArrayQuery();
  const [getConcernCategory, { data: concernCategoryData, isLoading: concernCategoryIsLoading, isSuccess: concernCategoryIsSuccess }] = useLazyGetCategoryConcernQuery();
  const [getTechnicians, { data: technicianData, isLoading: technicianIsLoading, isSuccess: technicianIsSuccess }] = useLazyGetTechniciansQuery();

  const [getViewAttachment] = useLazyGetViewAttachmentQuery();
  const [getDownloadAttachment] = useLazyGetDownloadAttachmentQuery();
  const [closeIssueHandlerTickets, { isLoading: closeIssueHandlerTicketsIsLoading, isFetching: closeIssueHandlerTicketsIsFetching }] = useCloseIssueHandlerTicketsMutation();
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
      ticketConcernId: "",
      closingTicketId: "",
      resolution: "",
      AddClosingAttachments: [],

      ChannelId: null,
      CategoryId: [],
      SubCategoryId: [],
      CategoryConcern: null,
      Technicians: [],

      Notes: "",
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
    try {
      if (fileNameToDelete.ticketAttachmentId) {
        const deletePayload = {
          ticketAttachmentId: fileNameToDelete.ticketAttachmentId,
        };
        await deleteRequestorAttachment(deletePayload)
          .unwrap()
          .then()
          .catch((err) => {
            console.log("error: ", err);
            toast.error("Error!", {
              description: err.data.error.message,
              duration: 1500,
            });
          });
      }

      setAttachments((prevFiles) => prevFiles.filter((fileName) => fileName !== fileNameToDelete));

      setValue(
        "AddClosingAttachments",
        watch("AddClosingAttachments").filter((file) => file.name !== fileNameToDelete.name)
      );
    } catch (error) {}
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
      text: `Edit this ticket number ${data?.ticketConcernId}?`,
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
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = new FormData();

        payload.append("TicketConcernId", formData.ticketConcernId);
        payload.append("ClosingTicketId", formData.closingTicketId);
        payload.append("CategoryConcernId", formData.CategoryConcern.id);
        payload.append("CategoryConcern", formData.CategoryConcern.categoryConcern);
        payload.append("Resolution", formData.resolution);
        payload.append("Notes", formData.Notes);

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
          payload.append(`AddClosingTicketTechnicians[${i}].ticketTechnicianId`, technicians[i].ticketTechnicianId || "");
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

        // console.log("Payload Entries: ", [...payload.entries()]);

        closeIssueHandlerTickets(payload)
          .unwrap()
          .then(() => {
            toast.success("Success!", {
              description: "Ticket updated successfully!",
              duration: 1500,
            });

            // dispatch(notificationApi.util.resetApiState());
            // dispatch(notificationMessageApi.util.resetApiState());

            setAttachments([]);
            reset();
            onClose();
          })
          .catch((err) => {
            toast.error("Error!", {
              description: err.data.error.message,
              duration: 1500,
            });
          });
      }
    });
  };

  const onCloseHandler = () => {
    onClose();
    reset();
    setAttachments([]);
  };

  useEffect(() => {
    if (data) {
      setValue("ticketConcernId", data?.ticketConcernId);
      setValue("closingTicketId", data?.getForClosingTickets?.[0]?.closingTicketId);
      setValue("resolution", data?.getForClosingTickets?.[0]?.resolution);

      setValue("ChannelId", {
        id: data?.channelId,
        channel_Name: data?.channel_Name,
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

      const technicians = data?.getForClosingTickets?.[0]?.forClosingTicketTechnicians?.flatMap((item) => ({
        ticketTechnicianId: item.ticketTechnicianId,
        technician_Name: item.fullname,
        technicianId: item.technician_By,
      }));

      const categoryIdParams = data?.getOpenTicketCategories?.map((item) => item?.categoryId);

      setValue("CategoryId", category);
      setValue("SubCategoryId", subCategory);
      setValue("Technicians", technicians);

      getSubCategory({
        CategoryId: categoryIdParams,
      });

      setValue("CategoryConcern", {
        id: data?.getForClosingTickets?.[0]?.categoryConcernId,
        categoryConcern: data?.getForClosingTickets?.[0]?.categoryConcernName,
      });

      setValue("Notes", data?.getForClosingTickets?.[0]?.notes);

      const manageTicketArray = data?.getForClosingTickets?.map((item) =>
        item?.getAttachmentForClosingTickets?.map((subItem) => {
          return {
            ticketAttachmentId: subItem.ticketAttachmentId,
            name: subItem.fileName,
            size: (subItem.fileSize / (1024 * 1024)).toFixed(2),
            link: subItem.attachment,
          };
        })
      );

      setAttachments(
        manageTicketArray?.[0]?.map((item) => ({
          ticketAttachmentId: item.ticketAttachmentId,
          name: item.name,
          size: item.size,
          link: item.link,
        }))
      );
    }
  }, [data]);

  // Function to open image view dialog
  const handleViewImage = async (file) => {
    setViewIsLoading(true);
    try {
      const response = await getViewAttachment(file?.ticketAttachmentId);

      if (response?.data) {
        const imageUrl = URL.createObjectURL(response.data); // Create a URL for the fetched image
        setSelectedImage(imageUrl); // Set the image URL to state
        setIsViewDialogOpen(true);
      }
      setViewIsLoading(false);
    } catch (error) {
      toast.error("Error!", {
        description: "View file error!",
        duration: 1500,
      });
      setViewIsLoading(false);
    }
  };

  const handleViewImageWithoutId = (file) => {
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
  };

  const isImageFile = (fileName) => {
    return /\.(jpg|jpeg|png)$/i.test(fileName);
  };

  return (
    <>
      <Dialog fullWidth maxWidth="md" open={open}>
        <DialogContent>
          <Stack sx={{ minHeight: "600px" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" gap={0.5}>
                <Typography
                  sx={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: theme.palette.success.main,
                  }}
                >
                  Ticket Details
                </Typography>
              </Stack>

              <Stack direction="row" gap={0.5} alignItems="center">
                <IconButton onClick={onCloseHandler}>
                  <Close />
                </IconButton>
              </Stack>
            </Stack>

            <Divider variant="fullWidth" sx={{ background: "#2D3748" }} />

            <Stack id="closeticket" component="form" direction="row" gap={1} sx={{ width: "100%", height: "100%" }} onSubmit={handleSubmit(onSubmitAction)}>
              {/* TICKET DETAILS */}
              <Stack sx={{ padding: 2, width: "100%", mt: 1 }}>
                <Stack direction="row" gap={0.5} alignItems="center">
                  <FiberManualRecord color="warning" fontSize="20px" />
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "16px",
                      color: theme.palette.text.main,
                    }}
                  >
                    {` Ticket # : ${moment(data?.created_At).format("YYYY")}-${data?.ticketConcernId}`}
                  </Typography>

                  {data?.getForClosingTickets?.[0]?.isApprove === true ? (
                    <Typography
                      sx={{
                        fontSize: "16px",
                        fontWeight: 700,
                        fontStyle: "italic",
                        color: "#22B4BF",
                      }}
                    >
                      (Approved)
                    </Typography>
                  ) : (
                    ""
                  )}
                </Stack>

                {isScreenSmall ? (
                  <Stack sx={{ width: "100%", border: "1px solid #2D3748", padding: 1, mt: 1 }}>
                    <Typography sx={{ textAlign: "left", color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Ticket Description:</Typography>

                    <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>
                      {data?.concern_Description?.split("\r\n").map((line, index) => (
                        <span key={index}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </Typography>
                  </Stack>
                ) : (
                  <Stack direction="row" sx={{ justifyContent: "center", alignItems: "center", border: "1px solid #2D3748", padding: 1, mt: 1 }}>
                    <Box sx={{ width: "20%", ml: 2 }}>
                      <Typography sx={{ textAlign: "left", color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Ticket Description:</Typography>
                    </Box>
                    <Box sx={{ width: "5%" }} />
                    <Box width={{ width: "75%", ml: 2 }}>
                      <Typography sx={{ color: theme.palette.text.main, fontWeight: "500", fontSize: "14px" }}>
                        {data?.concern_Description?.split("\r\n").map((line, index) => (
                          <span key={index}>
                            {line}
                            <br />
                          </span>
                        ))}
                      </Typography>
                    </Box>
                  </Stack>
                )}

                <Stack sx={{ marginTop: 4, minHeight: "500px" }}>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: "16px",
                      color: theme.palette.primary.main,
                    }}
                  >
                    {data?.getForClosingTickets?.[0]?.isApprove === false ? "Manage Ticket Form" : "View Ticket Form"}
                  </Typography>

                  <Stack gap={0.5} mt={2}>
                    <Stack direction={isScreenSmall ? "column" : "row"} gap={1}>
                      <Stack gap={0.5} sx={{ width: isScreenSmall ? "100%" : "50%" }}>
                        <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
                          <Typography
                            sx={{
                              fontSize: "14px",
                            }}
                          >
                            Category:
                          </Typography>
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
                                disabled={data?.getForClosingTickets?.[0]?.isApprove === true ? true : false}
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

                      <Stack gap={0.5} sx={{ width: isScreenSmall ? "100%" : "50%" }}>
                        <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
                          <Typography
                            sx={{
                              fontSize: "14px",
                            }}
                          >
                            Sub Category:
                          </Typography>
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
                                value={value}
                                options={subCategoryData?.value || []}
                                loading={subCategoryIsLoading}
                                renderInput={(params) => <TextField {...params} placeholder="Sub Category" sx={{ "& .MuiInputBase-input": { fontSize: "13px" } }} />}
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
                                disabled={data?.getForClosingTickets?.[0]?.isApprove === true ? true : false}
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

                    <Stack gap={1}>
                      <Stack gap={0.5} sx={{ width: "100%" }}>
                        <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
                          <Typography
                            sx={{
                              fontSize: "14px",
                            }}
                          >
                            Concern Category:
                          </Typography>
                          <FiberManualRecord color="error" sx={{ fontSize: "10px" }} />
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
                                renderInput={(params) => <TextField {...params} placeholder="Concern Category" sx={{ "& .MuiInputBase-input": { fontSize: "13px" } }} />}
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

                    <Stack mt={2} gap={0.5}>
                      <Stack direction="row" sx={{ alignItems: "center", gap: 0.5 }}>
                        <Typography
                          sx={{
                            fontSize: "14px",
                          }}
                        >
                          Resolution:
                        </Typography>
                        <FiberManualRecord color="error" sx={{ fontSize: "10px" }} />
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
                              disabled={data?.getForClosingTickets?.[0]?.isApprove === true ? true : false}
                              autoComplete="off"
                              rows={6}
                              multiline
                              InputProps={{
                                style: {
                                  fontSize: "14px",
                                },
                              }}
                              InputLabelProps={{
                                style: {
                                  fontSize: "14px",
                                },
                              }}
                            />
                          );
                        }}
                      />

                      {errors.resolution && (
                        <Typography color="error" sx={{ fontSize: "12px" }}>
                          {errors.resolution.message}
                        </Typography>
                      )}
                    </Stack>

                    {/* TECHNICIANS */}
                    <Stack direction="row" sx={{ width: "100%", gap: 2, mt: 1 }}>
                      <Stack sx={{ width: "100%", gap: 1 }}>
                        <Stack>
                          <Typography sx={{ fontSize: "14px", mb: 0.5 }}>Technicians (Optional):</Typography>
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
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      placeholder="Add Technicians"
                                      sx={{
                                        "& .MuiInputBase-input": {
                                          fontSize: "13px",
                                        },
                                      }}
                                    />
                                  )}
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

                                {value.length >= 3 && <FormHelperText sx={{ color: theme.palette.warning.main }}>You can only select up to 3 technicians.</FormHelperText>}
                              </Stack>
                            )}
                          />
                        </Stack>
                      </Stack>
                    </Stack>

                    <Stack mt={2} gap={0.5}>
                      <Typography
                        sx={{
                          fontSize: "14px",
                        }}
                      >
                        Notes (Optional):
                      </Typography>

                      <Controller
                        control={control}
                        name="Notes"
                        render={({ field: { ref, value, onChange } }) => {
                          return (
                            <TextField
                              inputRef={ref}
                              size="medium"
                              value={value}
                              // placeholder="Enter resolution"
                              onChange={onChange}
                              autoComplete="off"
                              rows={4}
                              multiline
                              disabled={data?.getForClosingTickets?.[0]?.isApprove === true ? true : false}
                              InputProps={{
                                style: {
                                  fontSize: "14px",
                                },
                              }}
                              InputLabelProps={{
                                style: {
                                  fontSize: "14px",
                                },
                              }}
                            />
                          );
                        }}
                      />
                    </Stack>

                    <Stack gap={0.5} mt={2} onDragOver={handleDragOver} onDrop={handleDrop}>
                      <Stack direction="row" gap={0.5}>
                        <Typography
                          sx={{
                            fontSize: "14px",
                          }}
                        >
                          Attachment:
                        </Typography>

                        {data?.getForClosingTickets?.[0]?.isApprove === false && (
                          <Button
                            size="small"
                            variant="contained"
                            color="warning"
                            startIcon={<Add />}
                            onClick={handleUploadButtonClick}
                            sx={{ padding: "2px", borderRadius: "2px" }}
                          >
                            <Typography sx={{ fontSize: "12px" }}>Add</Typography>
                          </Button>
                        )}
                      </Stack>

                      {attachments?.length === 0 ? (
                        <Stack sx={{ flexDirection: "column", border: "1px solid #2D3748", minHeight: "195px", justifyContent: "center", alignItems: "center" }}>
                          <Stack direction="row" gap={0.5} justifyContent="center">
                            <AttachFileOutlined sx={{ color: theme.palette.text.secondary }} />
                            <Typography sx={{ color: theme.palette.text.secondary }}>No attached file</Typography>
                          </Stack>
                        </Stack>
                      ) : (
                        <Box
                          sx={{
                            border: "1px solid #2D3748",
                            minHeight: "195px",
                            display: "flex",
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            padding: 1,
                          }}
                        >
                          {attachments?.map((fileName, index) => (
                            <Box
                              key={index}
                              sx={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                padding: 0.5,
                                borderBottom: "1px solid #2D3748",
                              }}
                            >
                              {getAttachmentIcon(fileName)}
                              <Stack sx={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <Typography sx={{ fontSize: "14px" }}>{fileName.name}</Typography>

                                  <Typography
                                    sx={{
                                      fontSize: "12px",
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
                                        fontSize: "14px",
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
                                  <ManageForClosingMenuActions
                                    data={data}
                                    fileName={fileName}
                                    onView={handleViewImage}
                                    onViewWithoutId={handleViewImageWithoutId}
                                    onDelete={handleDeleteFile}
                                    onDownload={handleDownloadAttachment}
                                    isImageFile={isImageFile}
                                    viewIsLoading={viewIsLoading}
                                    downloadIsLoading={downloadIsLoading}
                                  />
                                </Box>
                              </Stack>
                            </Box>
                          ))}
                        </Box>
                      )}
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
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Stack sx={{ width: "100%", paddingRight: 2, paddingLeft: 2 }}>
            {data?.getForClosingTickets?.[0]?.isApprove === false && (
              <LoadingButton
                type="submit"
                form="closeticket"
                variant="contained"
                loading={closeIssueHandlerTicketsIsLoading || closeIssueHandlerTicketsIsFetching}
                disabled={!watch("resolution") || watch("CategoryId").length === 0 || watch("SubCategoryId").length === 0}
              >
                Save
              </LoadingButton>
            )}
          </Stack>
        </DialogActions>
      </Dialog>

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

export default ManageTicketDialog;
