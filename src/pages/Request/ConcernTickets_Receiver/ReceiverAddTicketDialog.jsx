import { LoadingButton } from "@mui/lab";
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, Divider, IconButton, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { Add, CheckOutlined, Close, RemoveCircleOutline } from "@mui/icons-material";

import React, { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import moment from "moment";

import { Toaster, toast } from "sonner";
import { theme } from "../../../theme/theme";
import Swal from "sweetalert2";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

import { useLazyGetDepartmentQuery } from "../../../features/api masterlist/department/departmentApi";
import { useLazyGetChannelsQuery } from "../../../features/api_channel_setup/channel/channelApi";
import { useDeleteRequestorAttachmentMutation } from "../../../features/api_request/concerns/concernApi";
import { useLazyGetCategoryQuery } from "../../../features/api masterlist/category_api/categoryApi";
import { useLazyGetSubCategoryQuery } from "../../../features/api masterlist/sub_category_api/subCategoryApi";
import { useCreateEditReceiverConcernMutation } from "../../../features/api_request/concerns_receiver/concernReceiverApi";

const schema = yup.object().shape({
  department: yup.object().required().label("Department is required"),
  Requestor_By: yup.object().required().label("Requestor name is required"),
  concern_Details: yup.string().required().label("Concern Details"),
  RequestAttachmentsFiles: yup.array().nullable(),

  categoryId: yup.object().required().label("Category"),
  subCategoryId: yup.object().required().label("Sub category"),
  ChannelId: yup.object().required().label("Channel"),
  userId: yup.object().required().label("Issue handler"),
  startDate: yup.date().required("Start date is required"),
  targetDate: yup.date().required("Target date is required"),
});

const ReceiverAddTicketDialog = ({ open, onClose }) => {
  const [addAttachments, setAddAttachments] = useState([]);
  const [ticketAttachmentId, setTicketAttachmentId] = useState(null);

  const [startDateValidation, setStartDateValidation] = useState(null);
  const fileInputRef = useRef();
  const today = moment();

  const [getDepartment, { data: departmentData, isLoading: departmentIsLoading, isSuccess: departmentIsSuccess }] = useLazyGetDepartmentQuery();
  const [getRequestor, { isLoading: requestorIsLoading, isSuccess: requestorIsSuccess }] = useLazyGetDepartmentQuery();

  const [getCategory, { data: categoryData, isLoading: categoryIsLoading, isSuccess: categoryIsSuccess }] = useLazyGetCategoryQuery();
  const [getSubCategory, { data: subCategoryData, isLoading: subCategoryIsLoading }] = useLazyGetSubCategoryQuery();
  const [getChannel, { data: channelData, isLoading: channelIsLoading, isSuccess: channelIsSuccess }] = useLazyGetChannelsQuery();
  const [getIssueHandler, { isLoading: issueHandlerIsLoading, isSuccess: issueHandlerIsSuccess }] = useLazyGetChannelsQuery();
  const [createTicketConcern, { isLoading: isCreateTicketConcernLoading, isFetching: isCreateTicketConcernFetching }] = useCreateEditReceiverConcernMutation();

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
      department: null,
      Requestor_By: null,
      concern_Details: "",
      ticketConcernId: "",

      categoryId: null,
      subCategoryId: null,

      ChannelId: null,
      userId: null,
      startDate: null,
      targetDate: null,

      RequestConcernId: "",
      RequestAttachmentsFiles: [],
    },
  });

  const onSubmitAction = (formData) => {
    // console.log("Form Data: ", formData);
    const payload = new FormData();

    payload.append("Requestor_By", formData.Requestor_By?.userId);
    payload.append("Concern_Details", formData.concern_Details);

    payload.append("CategoryId", formData.categoryId?.id);
    payload.append("SubCategoryId", formData.subCategoryId?.id);
    payload.append("ChannelId", formData.ChannelId.id);
    payload.append("UserId", formData.userId?.userId);
    payload.append("Start_Date", moment(formData.startDate).format("YYYY-MM-DD"));
    payload.append("Target_Date", moment(formData.targetDate).format("YYYY-MM-DD"));

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

    Swal.fire({
      title: "Confirmation",
      text: "Submit this request?",
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
        createTicketConcern(payload)
          .unwrap()
          .then(() => {
            toast.success("Success!", {
              description: "Approve request successfully!",
              duration: 1500,
            });
            setAddAttachments([]);
            reset();
            onClose();
          })
          .catch((err) => {
            console.log("Error", err);
            toast.error("Error!", {
              description: err.data.error.message,
              duration: 1500,
            });
          });
      }
    });
  };

  const handleAttachments = (event) => {
    // console.log("event: ", event);
    const newFiles = Array.from(event.target.files);

    const fileNames = newFiles.map((file) => ({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2),
    }));

    const uniqueNewFiles = fileNames.filter((newFile) => !addAttachments.some((existingFile) => existingFile.name === newFile.name));

    setAddAttachments((prevFiles) => [...prevFiles, ...uniqueNewFiles]);
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleDeleteFile = async (fileNameToDelete) => {
    // console.log("File name: ", fileNameToDelete);

    try {
      if (fileNameToDelete.ticketAttachmentId) {
        const deletePayload = {
          removeAttachments: [
            {
              ticketAttachmentId: fileNameToDelete.ticketAttachmentId,
            },
          ],
        };
        await deleteRequestorAttachment(deletePayload).unwrap();
      }

      setAddAttachments((prevFiles) => prevFiles.filter((fileName) => fileName !== fileNameToDelete));

      setValue(
        "RequestAttachmentsFiles",
        watch("RequestAttachmentsFiles").filter((file) => file.name !== fileNameToDelete.name)
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

    const uniqueNewFiles = fileNames.filter((fileName) => !addAttachments.includes(fileName));
    setAddAttachments([...addAttachments, ...uniqueNewFiles]);
  };

  const onCloseHandler = () => {
    onClose();
    reset();
    setAddAttachments([]);
  };

  return (
    <>
      <Dialog fullWidth maxWidth="md" open={open}>
        <Toaster richColors position="top-right" closeButton />

        <DialogContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" gap={1} alignItems="center">
              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: 700,
                }}
              >
                Create Ticket
              </Typography>
            </Stack>

            <Stack direction="row" gap={0.5} alignItems="center">
              <IconButton onClick={onCloseHandler}>
                <Close />
              </IconButton>
            </Stack>
          </Stack>

          <Divider variant="fullWidth" sx={{ background: "#2D3748", marginTop: 1 }} />

          <Stack id="ticket" component="form" direction="row" gap={1} sx={{ width: "100%", height: "100%" }} onSubmit={handleSubmit(onSubmitAction)}>
            {/* REQUESTOR DETAILS */}
            <Stack sx={{ minHeight: "700px", width: "50%", border: "1px solid #2D3748", padding: 1 }}>
              <Typography
                sx={{
                  fontSize: "15px",
                  color: theme.palette.success.main,
                }}
              >
                Requestor Details
              </Typography>

              <Stack padding={2} gap={1.5}>
                <Stack gap={0.5}>
                  <Typography
                    sx={{
                      fontSize: "14px",
                    }}
                  >
                    Department:
                  </Typography>
                  <Controller
                    control={control}
                    name="department"
                    render={({ field: { ref, value, onChange } }) => {
                      return (
                        <Autocomplete
                          ref={ref}
                          size="small"
                          value={value}
                          options={departmentData?.value?.department || []}
                          loading={departmentIsLoading}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Department name"
                              // InputProps={{
                              //   style: { fontSize: "1px" },
                              // }}
                            />
                          )}
                          onOpen={() => {
                            if (!departmentIsSuccess) getDepartment();
                          }}
                          onChange={(_, value) => {
                            onChange(value);

                            setValue("Requestor_By", null);
                          }}
                          getOptionLabel={(option) => `${option.department_Code} - ${option.department_Name}`}
                          isOptionEqualToValue={(option, value) => option.id === value.id}
                          sx={{
                            flex: 2,
                          }}
                          fullWidth
                          disablePortal
                          disableClearable
                        />
                      );
                    }}
                  />
                </Stack>

                <Stack gap={0.5}>
                  <Typography
                    sx={{
                      fontSize: "14px",
                    }}
                  >
                    Requestor:
                  </Typography>
                  <Controller
                    control={control}
                    name="Requestor_By"
                    render={({ field: { ref, value, onChange } }) => {
                      return (
                        <Autocomplete
                          ref={ref}
                          size="small"
                          value={value}
                          options={departmentData?.value?.department?.find((item) => item.id === watch("department")?.id)?.users || []}
                          loading={requestorIsLoading}
                          renderInput={(params) => <TextField {...params} placeholder="Requestor Name" />}
                          onOpen={() => {
                            if (!requestorIsSuccess) getRequestor();
                          }}
                          onChange={(_, value) => {
                            onChange(value);
                          }}
                          getOptionLabel={(option) => option.fullName}
                          isOptionEqualToValue={(option, value) => option?.userId === value?.userId}
                          sx={{
                            flex: 2,
                          }}
                          fullWidth
                          disablePortal
                        />
                      );
                    }}
                  />
                </Stack>

                <Stack gap={0.5}>
                  <Typography
                    sx={{
                      fontSize: "14px",
                    }}
                  >
                    Concern:
                  </Typography>
                  <Controller
                    control={control}
                    name="concern_Details"
                    render={({ field: { ref, value, onChange } }) => {
                      return (
                        <TextField
                          inputRef={ref}
                          size="medium"
                          value={value}
                          placeholder="Description"
                          onChange={onChange}
                          // sx={{
                          //   width: "80%",
                          // }}
                          autoComplete="off"
                          rows={8}
                          multiline
                        />
                      );
                    }}
                  />
                </Stack>

                <Stack gap={0.5} onDragOver={handleDragOver} onDrop={handleDrop}>
                  <Stack direction="row" gap={0.5}>
                    <Typography
                      sx={{
                        fontSize: "14px",
                      }}
                    >
                      Attachment:
                    </Typography>

                    <Button size="small" variant="contained" color="warning" startIcon={<Add />} onClick={handleUploadButtonClick} sx={{ padding: "2px", borderRadius: "2px" }}>
                      <Typography sx={{ fontSize: "12px" }}>Add</Typography>
                    </Button>
                  </Stack>

                  <Box
                    sx={{
                      border: "1px solid #2D3748",
                      minHeight: "195px",
                      display: "flex",
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: 1,
                    }}
                  >
                    {addAttachments?.map((fileName, index) => (
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
                          <Typography sx={{ fontSize: "12px" }}>{fileName.name}</Typography>

                          <Typography
                            sx={{
                              fontSize: "11px",
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
                                fontSize: 11,
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
                        </Box>
                      </Box>
                    ))}
                  </Box>
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

                          setAddAttachments((prevFiles) => [
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

            {/* TICKET DETAILS */}
            <Stack sx={{ minHeight: "700px", width: "50%", border: "1px solid #2D3748", padding: 1 }}>
              {" "}
              <Typography
                sx={{
                  fontSize: "15px",
                  color: theme.palette.success.main,
                }}
              >
                Set Ticket Details
              </Typography>
              <Stack padding={2} gap={1.5}>
                <Stack gap={0.5}>
                  <Typography
                    sx={{
                      fontSize: "14px",
                    }}
                  >
                    Category:
                  </Typography>
                  <Controller
                    control={control}
                    name="categoryId"
                    render={({ field: { ref, value, onChange } }) => {
                      return (
                        <Autocomplete
                          ref={ref}
                          size="small"
                          value={value}
                          options={categoryData?.value?.category || []}
                          loading={categoryIsLoading}
                          renderInput={(params) => <TextField {...params} placeholder="Category" />}
                          onOpen={() => {
                            if (!categoryIsSuccess)
                              getCategory({
                                Status: true,
                              });
                          }}
                          onChange={(_, value) => {
                            onChange(value);

                            setValue("subCategoryId", null);

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
                        />
                      );
                    }}
                  />
                </Stack>

                <Stack gap={0.5}>
                  <Typography
                    sx={{
                      fontSize: "14px",
                    }}
                  >
                    Sub Category:
                  </Typography>
                  <Controller
                    control={control}
                    name="subCategoryId"
                    render={({ field: { ref, value, onChange } }) => {
                      return (
                        <Autocomplete
                          ref={ref}
                          size="small"
                          value={value}
                          options={subCategoryData?.value?.subCategory.filter((item) => item.categoryId === watch("categoryId")?.id) || []}
                          loading={subCategoryIsLoading}
                          renderInput={(params) => <TextField {...params} placeholder="Sub Category" />}
                          onChange={(_, value) => {
                            console.log("Value ", value);

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
                        />
                      );
                    }}
                  />
                </Stack>

                <Stack gap={0.5}>
                  <Typography
                    sx={{
                      fontSize: "14px",
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
                          renderInput={(params) => <TextField {...params} placeholder="Channel Name" />}
                          onOpen={() => {
                            if (!channelIsSuccess)
                              getChannel({
                                Status: true,
                              });
                          }}
                          onChange={(_, value) => {
                            onChange(value);

                            setValue("userId", null);
                          }}
                          getOptionLabel={(option) => option.channel_Name}
                          isOptionEqualToValue={(option, value) => option.id === value.id}
                          sx={{
                            flex: 2,
                          }}
                          fullWidth
                          disablePortal
                          disableClearable
                        />
                      );
                    }}
                  />
                </Stack>

                <Stack gap={0.5}>
                  <Typography
                    sx={{
                      fontSize: "14px",
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
                          // multiple
                          ref={ref}
                          size="small"
                          value={value}
                          options={channelData?.value?.channel?.find((item) => item.id === watch("ChannelId")?.id)?.channelUsers || []}
                          loading={issueHandlerIsLoading}
                          renderInput={(params) => <TextField {...params} placeholder="Issue Handler" />}
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
                          // disableClearable
                        />
                      );
                    }}
                  />
                </Stack>

                <Stack gap={0.5}>
                  <Typography
                    sx={{
                      fontSize: "14px",
                    }}
                  >
                    Start Date:
                  </Typography>

                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <Controller
                      control={control}
                      name="startDate"
                      render={({ field: { ref, value, onChange } }) => (
                        <DatePicker
                          ref={ref}
                          value={value}
                          onChange={(newValue) => {
                            const formattedValue = newValue;

                            console.log("Formatted Value: ", formattedValue);

                            onChange(formattedValue);
                            setStartDateValidation(newValue);
                          }}
                          slotProps={{
                            textField: { variant: "outlined" },
                          }}
                          minDate={today}
                        />
                      )}
                    />
                    {errors.startDate && <p>{errors.startDate.message}</p>}
                  </LocalizationProvider>
                </Stack>

                <Stack gap={0.5}>
                  <Typography
                    sx={{
                      fontSize: "14px",
                    }}
                  >
                    Target Date:
                  </Typography>

                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <Controller
                      control={control}
                      name="targetDate"
                      render={({ field: { ref, value, onChange } }) => (
                        <DatePicker
                          ref={ref}
                          value={value}
                          onChange={(newValue) => {
                            const formattedValue = newValue;

                            onChange(formattedValue);
                          }}
                          slotProps={{
                            textField: { variant: "outlined" },
                          }}
                          minDate={startDateValidation}
                          disabled={!watch("startDate")}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Stack sx={{ width: "100%", paddingRight: 2, paddingLeft: 2 }}>
            <LoadingButton
              type="submit"
              form="ticket"
              variant="contained"
              loading={isCreateTicketConcernLoading || isCreateTicketConcernFetching}
              disabled={
                !watch("department") ||
                !watch("Requestor_By") ||
                !watch("concern_Details") ||
                !watch("categoryId") ||
                !watch("subCategoryId") ||
                !watch("ChannelId") ||
                !watch("userId") ||
                !watch("startDate") ||
                !watch("targetDate")
              }
            >
              Submit
            </LoadingButton>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReceiverAddTicketDialog;
