import { LoadingButton } from "@mui/lab";
import { Autocomplete, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, Divider, IconButton, Stack, TextField, Tooltip, Typography } from "@mui/material";
import {
  Add,
  AttachFileOutlined,
  CheckOutlined,
  Close,
  FiberManualRecord,
  FileDownloadOutlined,
  FileUploadOutlined,
  RemoveCircleOutline,
  VisibilityOutlined,
} from "@mui/icons-material";

import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Toaster, toast } from "sonner";
import { theme } from "../../../theme/theme";
import Swal from "sweetalert2";
import { useDeleteRequestorAttachmentMutation, useLazyGetTechniciansQuery } from "../../../features/api_request/concerns/concernApi";
import { useCloseIssueHandlerTicketsMutation } from "../../../features/api_ticketing/issue_handler/concernIssueHandlerApi";
import { useLazyGetDownloadAttachmentQuery, useLazyGetViewAttachmentQuery } from "../../../features/api_attachments/attachmentsApi";
import { useLazyGetCategoryQuery } from "../../../features/api masterlist/category_api/categoryApi";
import { useLazyGetSubCategoryArrayQuery, useLazyGetSubCategoryQuery } from "../../../features/api masterlist/sub_category_api/subCategoryApi";
import { useDispatch } from "react-redux";
import useSignalRConnection from "../../../hooks/useSignalRConnection";
import { notificationApi } from "../../../features/api_notification/notificationApi";
import { notificationMessageApi } from "../../../features/api_notification_message/notificationMessageApi";
import ManageForClosingMenuActions from "./MenuActions/ManageForClosingMenuActions";

const schema = yup.object().shape({
  ticketConcernId: yup.number(),
  closingTicketId: yup.number(),
  resolution: yup.string().required().label("Resolution is required"),
  AddClosingAttachments: yup.array().nullable(),

  ChannelId: yup.object().required().label("Channel"),
  CategoryId: yup.array().required().label("Category"),
  SubCategoryId: yup.array().required().label("Sub Category"),
  Technicians: yup.array().notRequired(),

  Notes: yup.string().notRequired(),
});

const ManageTicketDialog = ({ data, open, onClose }) => {
  const [attachments, setAttachments] = useState([]);
  const [ticketAttachmentId, setTicketAttachmentId] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null); // To handle the selected image
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false); // To control the view dialog
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);

  const dispatch = useDispatch();
  const fileInputRef = useRef();
  useSignalRConnection();

  const [getCategory, { data: categoryData, isLoading: categoryIsLoading, isSuccess: categoryIsSuccess }] = useLazyGetCategoryQuery();
  const [getSubCategory, { data: subCategoryData, isLoading: subCategoryIsLoading, isSuccess: subCategoryIsSuccess }] = useLazyGetSubCategoryArrayQuery();
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
      Technicians: [],

      Notes: "",
    },
  });

  const handleAttachments = (event) => {
    // console.log("event: ", event);
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

  const handleUpdateFile = (id) => {
    setTicketAttachmentId(id);
    fileInputRef.current.click();
  };

  const handleDeleteFile = async (fileNameToDelete) => {
    console.log("File name: ", fileNameToDelete);

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

    // console.log("Attachments: ", attachments)
  };

  const onSubmitAction = (formData) => {
    console.log("Form Data: ", formData);

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
        payload.append("Resolution", formData.resolution);

        // payload.append("CategoryId", formData.CategoryId.id);
        // payload.append("SubCategoryId", formData.SubCategoryId.id);
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
          payload.append(`ClosingSubTicketCategories[${i}].ticketSubCategoryId`, subCategory[i].ticketCategoryId || "");
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

        console.log("Payload Entries: ", [...payload.entries()]);

        closeIssueHandlerTickets(payload)
          .unwrap()
          .then(() => {
            toast.success("Success!", {
              description: "Ticket updated successfully!",
              duration: 1500,
            });

            dispatch(notificationApi.util.resetApiState());
            dispatch(notificationMessageApi.util.resetApiState());

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

      setValue("Notes", data?.notes);

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

  // Function to open image view dialog
  const handleViewImage = async (file) => {
    setViewLoading(true);
    try {
      const response = await getViewAttachment(file?.ticketAttachmentId);

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

  // console.log("Data: ", data);
  // console.log("Error: ", errors);

  return (
    <>
      {/* <Toaster richColors position="top-right" closeButton /> */}
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
                    {` Ticket # : ${data?.ticketConcernId}`}
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

                <Stack direction="row" sx={{ justifyContent: "center", alignItems: "center", border: "1px solid #2D3748", padding: 1, mt: 1 }}>
                  <Box sx={{ width: "15%", ml: 2 }}>
                    <Typography sx={{ textAlign: "left", color: theme.palette.text.secondary, fontWeight: "500", fontSize: "14px" }}>Description:</Typography>
                  </Box>
                  <Box sx={{ width: "10%" }} />
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
                    <Stack direction="row" gap={1}>
                      <Stack gap={0.5} sx={{ width: "50%" }}>
                        <Typography
                          sx={{
                            fontSize: "14px",
                          }}
                        >
                          Category:
                        </Typography>
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

                      <Stack gap={0.5} sx={{ width: "50%" }}>
                        <Typography
                          sx={{
                            fontSize: "14px",
                          }}
                        >
                          Sub Category:
                        </Typography>
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
                                renderInput={(params) => <TextField {...params} placeholder="Sub Category" sx={{ "& .MuiInputBase-input": { fontSize: "13px" } }} />}
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

                    <Stack mt={2} gap={0.5}>
                      <Typography
                        sx={{
                          fontSize: "14px",
                        }}
                      >
                        Resolution:
                      </Typography>

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
                    </Stack>

                    {/* TECHNICIANS */}
                    <Stack direction="row" sx={{ width: "100%", gap: 2, mt: 1 }}>
                      <Stack sx={{ width: "100%", gap: 1 }}>
                        <Stack>
                          <Typography sx={{ fontSize: "14px", mb: 0.5 }}>Technicians (Optional):</Typography>
                          <Controller
                            control={control}
                            name="Technicians"
                            render={({ field: { ref, value, onChange } }) => {
                              return (
                                <Autocomplete
                                  multiple
                                  ref={ref}
                                  size="small"
                                  value={value}
                                  options={technicianData?.value || []}
                                  loading={technicianIsLoading}
                                  renderInput={(params) => <TextField {...params} placeholder="Add Technicians" sx={{ "& .MuiInputBase-input": { fontSize: "13px" } }} />}
                                  onOpen={() => {
                                    if (!technicianIsSuccess) getTechnicians();
                                  }}
                                  onChange={(_, value) => {
                                    onChange(value);
                                  }}
                                  getOptionLabel={(option) => option.technician_Name || ""}
                                  isOptionEqualToValue={(option, value) => option.technicianId === value.technicianId}
                                  getOptionDisabled={(option) => watch("Technicians")?.some((item) => item.technicianId === option.technicianId)}
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
                            // justifyContent: "space-between",
                            padding: 1,
                          }}
                        >
                          {attachments?.map((fileName, index) => (
                            <Box
                              key={index}
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
                                />

                                {/* {!!fileName.ticketAttachmentId ? (
                                  <>
                                    {isImageFile(fileName.name) && (
                                      <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={() => handleViewImage(fileName)} // View image in dialog
                                        style={{ background: "none" }}
                                      >
                                        {viewLoading ? <CircularProgress size={14} /> : <VisibilityOutlined />}
                                      </IconButton>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    {isImageFile(fileName.name) && (
                                      <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={() => handleViewImageWithoutId(fileName.file)} // View image in dialog
                                        style={{ background: "none" }}
                                      >
                                        <VisibilityOutlined />
                                      </IconButton>
                                    )}
                                  </>
                                )}

                                {data?.getForClosingTickets?.[0]?.isApprove === false && (
                                  <Tooltip title="Remove">
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
                                  </Tooltip>
                                )}

                                {!!fileName.ticketAttachmentId && (
                                  <Tooltip title="Download">
                                    {downloadLoading ? (
                                      <CircularProgress size={14} />
                                    ) : (
                                      <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleDownloadAttachment(fileName)}
                                        style={{
                                          background: "none",
                                        }}
                                      >
                                        <FileDownloadOutlined />
                                      </IconButton>
                                    )}
                                  </Tooltip>
                                )} */}
                              </Box>
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
