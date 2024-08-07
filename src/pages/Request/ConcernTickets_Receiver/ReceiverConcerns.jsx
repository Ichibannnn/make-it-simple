import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  OutlinedInput,
  Paper,
  Stack,
  Tab,
  TablePagination,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  AccessTimeOutlined,
  Add,
  AttachFileOutlined,
  CheckOutlined,
  FiberManualRecord,
  FileDownloadOutlined,
  FileUploadOutlined,
  GetAppOutlined,
  PostAddOutlined,
  RemoveCircleOutline,
  RemoveRedEyeOutlined,
  Search,
} from "@mui/icons-material";

import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import moment from "moment";

import { theme } from "../../../theme/theme";
import useDebounce from "../../../hooks/useDebounce";
import useDisclosure from "../../../hooks/useDisclosure";

import noRecordsFound from "../../../assets/svg/noRecordsFound.svg";
import SomethingWentWrong from "../../../assets/svg/SomethingWentWrong.svg";

import {
  useApproveReceiverConcernMutation,
  useCreateEditReceiverConcernMutation,
  useGetReceiverConcernsQuery,
  useLazyGetReceiverAttachmentQuery,
} from "../../../features/api_request/concerns_receiver/concernReceiverApi";
import { useLazyGetCategoryQuery } from "../../../features/api masterlist/category_api/categoryApi";
import { useLazyGetSubCategoryQuery } from "../../../features/api masterlist/sub_category_api/subCategoryApi";
import { useLazyGetChannelsQuery } from "../../../features/api_channel_setup/channel/channelApi";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LoadingButton } from "@mui/lab";
import { Toaster, toast } from "sonner";
import { useDeleteRequestorAttachmentMutation } from "../../../features/api_request/concerns/concernApi";
import Swal from "sweetalert2";
import ReceiverAddTicketDialog from "./ReceiverAddTicketDialog";
import ViewTransferRemarksDialog from "../../Tickets/IssueHandlerConcerns/ViewTransferRemarksDialog";

const schema = yup.object().shape({
  Requestor_By: yup.string().nullable(),
  concern_Details: yup.array().nullable(),
  ticketConcernId: yup.string().nullable(),
  categoryId: yup.object().required().label("Category"),
  subCategoryId: yup.object().required().label("Sub category"),
  ChannelId: yup.object().required().label("Channel"),
  userId: yup.object().required().label("Issue handler"),
  startDate: yup.date().required("Start date is required"),
  targetDate: yup.date().required("Target date is required"),
  RequestConcernId: yup.string().nullable(),
  RequestAttachmentsFiles: yup.array().nullable(),
});

const displaySchema = yup.object().shape({
  displayConcern: yup.string().nullable(),
});

const ReceiverConcerns = () => {
  const [approveStatus, setApproveStatus] = useState("false");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue, 500);

  const [addData, setAddData] = useState(null);
  const [viewApprovedData, setViewApprovedData] = useState(null);
  const [viewRemarksData, setViewRemarksData] = useState(null);

  const [addAttachments, setAddAttachments] = useState([]);
  const [ticketAttachmentId, setTicketAttachmentId] = useState(null);

  const [startDateValidation, setStartDateValidation] = useState(null);

  const fileInputRef = useRef();
  const today = moment();

  // const isSmallScreen = useMediaQuery("(max-width: 1489px) and (max-height: 945px)");

  const { open, onToggle, onClose } = useDisclosure();
  const { open: viewRemarksOpen, onToggle: viewRemarksOnToggle, onClose: viewRemarksOnClose } = useDisclosure();

  const { data, isLoading, isFetching, isSuccess, isError, refetch } = useGetReceiverConcernsQuery({
    is_Approve: approveStatus,
    Search: search,
    PageNumber: pageNumber,
    PageSize: pageSize,
  });

  const [getCategory, { data: categoryData, isLoading: categoryIsLoading, isSuccess: categoryIsSuccess }] = useLazyGetCategoryQuery();
  const [getSubCategory, { data: subCategoryData, isLoading: subCategoryIsLoading, isSuccess: subCategoryIsSuccess }] = useLazyGetSubCategoryQuery();
  const [getChannel, { data: channelData, isLoading: channelIsLoading, isSuccess: channelIsSuccess }] = useLazyGetChannelsQuery();
  const [getIssueHandler, { isLoading: issueHandlerIsLoading, isSuccess: issueHandlerIsSuccess }] = useLazyGetChannelsQuery();
  const [createEditReceiverConcern, { isLoading: isCreateEditReceiverConcernLoading, isFetching: isCreateEditReceiverConcernFetching }] = useCreateEditReceiverConcernMutation();
  const [deleteRequestorAttachment] = useDeleteRequestorAttachmentMutation();
  const [getAddReceiverAttachment] = useLazyGetReceiverAttachmentQuery();

  const [approveReceiverConcern, { isLoading: approveReceiverConcernIsLoading, isFetching: approveReceiverConcernIsFetching }] = useApproveReceiverConcernMutation();

  const onPageNumberChange = (_, page) => {
    setPageNumber(page + 1);
  };

  const onPageSizeChange = (e) => {
    setPageSize(e.target.value);
  };

  const onStatusChange = (_, newValue) => {
    setApproveStatus(newValue);
    setPageNumber(1);
    setPageSize(5);
    setAddData(null);
    setViewApprovedData(null);
    refetch();
  };

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
      Requestor_By: "",
      concern_Details: [],
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

  const {
    control: displayControl,
    setValue: displaySetValue,
    watch: displayWatch,
    reset: displayReset,
    formState: { errors: displayError },
  } = useForm({
    resolver: yupResolver(displaySchema),
    defaultValues: {
      displayConcern: "",
    },
  });

  const onSubmitAction = (formData) => {
    console.log("FormData: ", formData);
    const payload = new FormData();

    payload.append("TicketConcernId", formData.ticketConcernId);
    payload.append("ChannelId", formData.ChannelId.id);
    payload.append("Requestor_By", formData.Requestor_By);
    payload.append("UserId", formData.userId?.userId);
    payload.append("Concern_Details", formData.concern_Details);
    payload.append("CategoryId", formData.categoryId?.id);
    payload.append("SubCategoryId", formData.subCategoryId?.id);
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

    const approvePayload = {
      ticketConcernId: formData.ticketConcernId,
    };

    // console.log("APPROVE PAYLOAD: ", approvePayload);

    Swal.fire({
      title: "Confirmation",
      text: "Approve this concern?",
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
        createEditReceiverConcern(payload)
          .unwrap()
          .then(() => {
            // Approve API
            approveReceiverConcern(approvePayload)
              .unwrap()
              .then(() => {
                setAddData(null);
                onClose();
              })
              .catch((err) => {
                console.log("Error", err);
                toast.error("Error!", {
                  description: err.data.error.message,
                  duration: 1500,
                });
              });

            toast.success("Success!", {
              description: "Approve concern successfully!",
              duration: 1500,
            });
            setAddAttachments([]);
            setApproveStatus("false");
            reset();
            setAddData(null);
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

    const uniqueNewFiles = fileNames?.filter((newFile) => !addAttachments?.some((existingFile) => existingFile?.name === newFile?.name));

    console.log("uniqueFiles: ", uniqueNewFiles);

    setAddAttachments((prevFiles) => (Array.isArray(prevFiles) ? [...prevFiles, ...uniqueNewFiles] : [...uniqueNewFiles]));
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleUpdateFile = (id) => {
    setTicketAttachmentId(id);
    fileInputRef.current.click();
  };

  const handleDeleteFile = async (fileNameToDelete) => {
    // console.log("File name: ", fileNameToDelete);

    try {
      if (fileNameToDelete.ticketAttachmentId) {
        const deletePayload = {
          ticketAttachmentId: fileNameToDelete.ticketAttachmentId,
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

  const getAddAttachmentData = async (id) => {
    try {
      const res = await getAddReceiverAttachment({ Id: id }).unwrap();

      // console.log("res", res);

      setAddAttachments(
        res?.value?.[0]?.attachments?.map((item) => ({
          ticketAttachmentId: item.ticketAttachmentId,
          name: item.fileName,
          size: (item.fileSize / (1024 * 1024)).toFixed(2),
          link: item.attachment,
        }))
      );
    } catch (error) {}
  };

  const onAddEditAction = (data) => {
    const bindFunction = data?.ticketRequestConcerns?.map((item) => ({
      categoryId: item?.categoryId,
    }));

    if (bindFunction?.[0]?.categoryId === null) {
      reset();
      setStartDateValidation(null);
      setAddData(data);
      setViewApprovedData(null);
    } else {
      setViewApprovedData(data);
      setAddData(null);
    }
  };

  const onDialogClose = () => {
    onClose();
  };

  const onCloseAddAction = () => {
    setAddData(null);
    setViewApprovedData(null);
    reset();
  };

  const onAddNewTicketOnToggleAction = () => {
    onToggle();
    setAddData(null);
    setViewApprovedData(null);
    setApproveStatus(false);
  };

  const onViewRemarksAction = (data) => {
    viewRemarksOnToggle();
    setViewRemarksData(data);
  };

  useEffect(() => {
    if (addData) {
      const ticketConcernIdArray = addData?.ticketRequestConcerns?.map((item) => {
        return {
          ticketConcernId: item?.ticketConcernId,
        };
      });

      setValue("Requestor_By", addData?.requestorId);
      setValue("concern_Details", [addData?.concern]);

      // console.log("ticketConcernIdArray: ", ticketConcernIdArray?.[0]?.ticketConcernId);

      setValue("ticketConcernId", ticketConcernIdArray?.[0]?.ticketConcernId);

      getAddAttachmentData(addData.requestConcernId);
    }
  }, [addData]);

  useEffect(() => {
    if (viewApprovedData) {
      if (!categoryIsSuccess) getCategory();
      if (!subCategoryIsSuccess) getSubCategory();
      if (!channelIsSuccess) getChannel();
      if (!issueHandlerIsSuccess) getIssueHandler();

      const bindData = viewApprovedData?.ticketRequestConcerns?.map((item) => ({
        categoryId: item?.categoryId,
        category_Description: item?.category_Description,
        subCategoryId: item?.subCategoryId,
        subCategory_Description: item?.subCategory_Description,
        channelId: item?.channelId,
        fullname: item?.issue_Handler,
        userId: item?.userId,
        channel_Name: item?.channel_Name,
        start_Date: moment(item?.start_Date),
        target_Date: moment(item?.target_Date),
      }));

      setValue("categoryId", {
        id: bindData?.[0]?.categoryId,
        category_Description: bindData?.[0]?.category_Description,
      });

      setValue("subCategoryId", {
        id: bindData?.[0]?.subCategoryId,
        subCategory_Description: bindData?.[0]?.subCategory_Description,
      });

      setValue("ChannelId", {
        id: bindData?.[0]?.channelId,
        channel_Name: bindData?.[0]?.channel_Name,
      });

      setValue("userId", {
        fullname: bindData?.[0]?.fullname,
        userId: bindData?.[0]?.userId,
      });

      setValue("startDate", bindData?.[0]?.start_Date);
      // setMinStartDate(bindData?.[0]?.start_Date);

      setValue("targetDate", bindData?.[0]?.target_Date);

      getAddAttachmentData(viewApprovedData.requestConcernId);
    }
  }, [viewApprovedData]);

  useEffect(() => {
    if (searchValue) {
      setPageNumber(1);
    }
  }, [searchValue]);

  useEffect(() => {
    if (data) {
      displaySetValue(
        "displayConcern",
        data?.value?.requestConcern?.map((item) => item.concern)
      );
    }
  }, [data]);

  // console.log("Watch: ", displayWatch("displayConcern"));
  // console.log("Data: ", data);

  return (
    <Stack
      width="100%"
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.bgForm.black1,
        color: "#fff",
        padding: "0px 24px 24px 24px",
      }}
    >
      <Toaster richColors position="top-right" closeButton />
      <Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack>
            <Typography variant="h4">Concerns</Typography>
          </Stack>

          <Stack justifyItems="space-between" direction="row">
            <Button variant="contained" size="large" color="primary" startIcon={<PostAddOutlined />} onClick={onAddNewTicketOnToggleAction}>
              Create Ticket
            </Button>
          </Stack>
        </Stack>
      </Stack>

      <Stack sx={{ flexDirection: "row", gap: 2, marginTop: 1 }}>
        {/* CONCERN TABLE */}
        <Paper
          sx={{
            width: addData || viewApprovedData ? "70%" : "100%",
            minHeight: "90vh", // -----------
            display: "flex",
            flexDirection: "column",
            backgroundColor: theme.palette.bgForm.black3,
            borderRadius: "20px",
          }}
        >
          <Stack
            width="100%"
            sx={{
              padding: "10px",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "end",
            }}
            gap={1}
          >
            <Stack>
              <Tabs value={approveStatus} onChange={onStatusChange}>
                <Tab className="tabs-styling-header" value="false" label="Pending" sx={{ fontWeight: 600, fontSize: "17px" }} />

                <Tab className="tabs-styling-header" value="true" label="Approved" sx={{ fontWeight: 600, fontSize: "17px" }} />
              </Tabs>
            </Stack>

            <OutlinedInput
              size="medium"
              placeholder="eg. Requestor or Concern #"
              startAdornment={<Search sx={{ marginRight: 0.5, color: "#A0AEC0" }} />}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              sx={{
                borderRadius: "15px",
                fontSize: "small",
                fontWeight: 400,
                lineHeight: "1.4375rem",
                width: addData || viewApprovedData ? "25%" : "20%",
                // backgroundColor: "#111927",
              }}
            />
          </Stack>

          <Stack padding={2} width="100%" gap={1}>
            <Stack
              sx={{
                minHeight: "500px",
                maxHeight: "100vh",
                overflowY: "auto",
                gap: 2,
              }}
            >
              {isSuccess &&
                !isLoading &&
                !isFetching &&
                data?.value?.requestConcern?.map((item) =>
                  item?.ticketRequestConcerns?.map((subItem) => (
                    <Stack
                      key={item.requestConcernId}
                      sx={{
                        border: "1px solid #2D3748",
                        borderRadius: "20px",
                        minHeight: "auto",
                        cursor: "pointer",
                      }}
                    >
                      <Stack
                        sx={{
                          borderTopLeftRadius: "20px",
                          borderTopRightRadius: "20px",
                          backgroundColor:
                            addData?.requestConcernId === item?.requestConcernId ? "#5f478e" : viewApprovedData?.requestConcernId === item?.requestConcernId ? "#5f478e" : "",
                          "&:hover": {
                            backgroundColor: theme.palette.secondary.main,
                          },
                        }}
                      >
                        <Stack
                          sx={{
                            flexDirection: "row",
                            // border: "1px solid #2D3748",
                            minHeight: "40px",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingLeft: 2,
                            paddingRight: 2,
                          }}
                        >
                          <Stack direction="row" gap={0} alignItems="center">
                            <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                              {item.fullName} - {item.department_Name}
                            </Typography>
                          </Stack>

                          <Stack direction="row" gap={0.5} alignItems="center">
                            <Chip
                              variant="filled"
                              color="secondary"
                              size="small"
                              icon={
                                <AccessTimeOutlined
                                  sx={{
                                    fontSize: "16px",
                                    color: theme.palette.text.secondary,
                                  }}
                                />
                              }
                              label={`Posted at ${moment(item?.created_At).format("LL")}`}
                            />

                            {subItem?.is_Assigned === true ? (
                              <Chip
                                variant="filled"
                                size="small"
                                label={`Assigned`}
                                sx={{
                                  backgroundColor: "#00913c",
                                  color: "#ffffffde",
                                }}
                              />
                            ) : (
                              ""
                            )}
                          </Stack>
                        </Stack>

                        <Stack
                          onClick={() => onAddEditAction(item)}
                          sx={{
                            border: "1px solid #2D3748",
                            minHeight: "110px",
                            padding: 2,
                          }}
                        >
                          <Stack direction="row" gap={1} alignItems="center">
                            <Typography
                              sx={{
                                fontSize: "14px",
                                fontWeight: 500,
                              }}
                            >
                              CONCERN NO. {item.requestConcernId}
                            </Typography>
                          </Stack>

                          <Stack direction="row" gap={1} alignItems="center">
                            <FiberManualRecord color="success" fontSize="65px" />

                            <Typography
                              sx={{
                                fontSize: "14px",
                              }}
                            >
                              {item.concern.split("\r\n").map((line, index) => (
                                <div key={index}>{line}</div>
                              ))}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Stack>

                      <Stack
                        sx={{
                          width: "100%",
                          minHeight: "40px",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingRight: 2,
                          paddingLeft: 2,
                        }}
                      >
                        {/* Transfered Remarks */}
                        {subItem?.transfer_By !== null && (
                          <Stack direction="row" gap={0.5} sx={{ width: "100%", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography
                              sx={{
                                fontSize: "13px",
                                color: theme.palette.warning.main,
                              }}
                            >
                              {` Transferred by: ${subItem?.transfer_By}`}
                            </Typography>

                            <Button
                              size="small"
                              variant="text"
                              startIcon={<RemoveRedEyeOutlined />}
                              sx={{ padding: "8px", borderRadius: "2px" }}
                              onClick={() => onViewRemarksAction(item)}
                            >
                              <Typography sx={{ fontSize: "12px" }}>View Remarks</Typography>
                            </Button>
                          </Stack>
                        )}
                      </Stack>
                    </Stack>
                  ))
                )}

              {isError && (
                <Stack width="100%" height="100%" justifyContent="center" alignItems="center">
                  <img src={SomethingWentWrong} alt="Something Went Wrong" className="something-went-wrong" />
                  <Stack marginLeft={1}>
                    <Typography color="#EDF2F7" variant="h5">
                      Something went wrong.
                    </Typography>
                  </Stack>
                </Stack>
              )}

              {isSuccess && !data?.value?.requestConcern?.length && (
                <Stack marginTop={4} width="100%" height="100%" justifyContent="center" alignItems="center">
                  <img src={noRecordsFound} alt="No Records Found" className="norecords-found" />
                  <Stack marginLeft={6} marginTop={1}>
                    <Typography color="#EDF2F7" variant="h5">
                      No records found.
                    </Typography>
                  </Stack>
                </Stack>
              )}

              {(isLoading || isFetching) && (
                <Stack width="100%" height="100%" justifyContent="center" alignItems="center">
                  <CircularProgress />
                  <Typography variant="h4" color="#EDF2F7">
                    Please wait...
                  </Typography>
                </Stack>
              )}
            </Stack>

            <TablePagination
              sx={{ color: "#A0AEC0", fontWeight: 400 }}
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={data?.value?.totalCount || 0}
              rowsPerPage={data?.value?.pageSize || 5}
              page={data?.value?.currentPage - 1 || 0}
              onPageChange={onPageNumberChange}
              onRowsPerPageChange={onPageSizeChange}
            />
          </Stack>
        </Paper>

        {/* CREATE TICKET FORM */}
        <Paper
          sx={{
            width: "30%",
            minHeight: "90vh",
            display: addData || viewApprovedData ? "flex" : "none",
            flexDirection: "column",
            backgroundColor: theme.palette.bgForm.black3,
            padding: 2,
            borderRadius: "20px",
          }}
        >
          {addData ? (
            // Adding Tickets
            <Stack height="100%">
              <form onSubmit={handleSubmit(onSubmitAction)}>
                <Stack sx={{ minHeight: "70px" }}>
                  <Typography sx={{ fontWeight: 600, fontSize: "18px" }}>Create Ticket</Typography>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Add issue handler details to create ticket from this concern.{" "}
                  </Typography>
                </Stack>

                <Stack
                  sx={{
                    minHeight: "auto",
                  }}
                >
                  {/* Tickets Details */}
                  <Stack
                    sx={{
                      padding: 1,
                      marginTop: 2,
                      minHeight: "200px",
                      border: "1px solid #2D3748",
                      borderRadius: "20px",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "17px",
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
                            render={({ field }) => (
                              <DatePicker
                                value={field.value ? moment(field.value) : null}
                                onChange={(newValue) => {
                                  const formattedValue = newValue ? moment(newValue).format("YYYY-MM-DD") : null;
                                  field.onChange(formattedValue);
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
                            render={({ field }) => (
                              <DatePicker
                                value={field.value ? moment(field.value) : null}
                                onChange={(newValue) => {
                                  const formattedValue = newValue ? moment(newValue).format("YYYY-MM-DD") : null;
                                  field.onChange(formattedValue);
                                }}
                                slotProps={{
                                  textField: { variant: "outlined" },
                                }}
                                minDate={startDateValidation}
                                error={!!errors.targetDate}
                                helperText={errors.targetDate ? errors.targetDate.message : null}
                                disabled={!watch("startDate")}
                              />
                            )}
                          />
                          {errors.targetDate && <Typography>{errors.targetDate.message}</Typography>}
                        </LocalizationProvider>
                      </Stack>
                    </Stack>
                  </Stack>

                  {/* Attachments */}
                  <Stack padding={2} marginTop={3} gap={1.5} sx={{ border: "1px solid #2D3748", borderRadius: "20px" }}>
                    <Stack direction="row" gap={1} alignItems="center" onDragOver={handleDragOver} onDrop={handleDrop}>
                      <GetAppOutlined sx={{ color: theme.palette.text.secondary }} />

                      <Typography
                        sx={{
                          fontSize: "14px",
                        }}
                      >
                        Atachments:
                      </Typography>

                      <Button size="small" variant="contained" color="warning" startIcon={<Add />} onClick={handleUploadButtonClick}>
                        <Typography sx={{ fontSize: "12px" }}>Add</Typography>
                      </Button>
                    </Stack>

                    {addAttachments === undefined ? (
                      <Stack sx={{ flexDirection: "column", maxHeight: "auto", padding: 4 }}>
                        <Stack direction="row" gap={0.5} justifyContent="center">
                          <AttachFileOutlined sx={{ color: theme.palette.text.secondary }} />
                          <Typography sx={{ color: theme.palette.text.secondary }}>No attached file</Typography>
                        </Stack>
                      </Stack>
                    ) : (
                      <Stack sx={{ flexDirection: "column", maxHeight: "auto" }}>
                        {addAttachments?.map((fileName, index) => (
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
                                {!fileName.ticketAttachmentId && (
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

                                {fileName.ticketAttachmentId === null && (
                                  <Tooltip title="Upload">
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => handleUpdateFile(fileName.ticketAttachmentId)}
                                      style={{
                                        background: "none",
                                      }}
                                    >
                                      <FileUploadOutlined />
                                    </IconButton>
                                  </Tooltip>
                                )}

                                {!!fileName.ticketAttachmentId && (
                                  <Tooltip title="Download">
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => {
                                        window.location = fileName.link;
                                      }}
                                      style={{
                                        background: "none",
                                      }}
                                    >
                                      <FileDownloadOutlined />
                                    </IconButton>
                                  </Tooltip>
                                )}
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

                <Stack
                  sx={{
                    flexDirection: "row",
                    gap: 1,
                    justifyContent: "right",
                    alignItems: "center",
                    // minHeight: "70px",
                    marginTop: 1,
                  }}
                >
                  <LoadingButton
                    variant="contained"
                    type="submit"
                    loading={isCreateEditReceiverConcernLoading || isCreateEditReceiverConcernFetching || approveReceiverConcernIsFetching || approveReceiverConcernIsLoading}
                    disabled={
                      !watch("categoryId") ||
                      !watch("subCategoryId") ||
                      !watch("ChannelId") ||
                      !watch("userId") ||
                      !watch("startDate") ||
                      !watch("targetDate") ||
                      // !addAttachments.length ||
                      watch("targetDate") < startDateValidation
                    }
                  >
                    {" "}
                    Submit{" "}
                  </LoadingButton>
                  <LoadingButton
                    variant="outlined"
                    onClick={onCloseAddAction}
                    disabled={isCreateEditReceiverConcernLoading || isCreateEditReceiverConcernFetching || approveReceiverConcernIsFetching || approveReceiverConcernIsLoading}
                    sx={{
                      ":disabled": {
                        backgroundColor: "none",
                        color: "black",
                      },
                    }}
                  >
                    {" "}
                    Close{" "}
                  </LoadingButton>
                </Stack>
              </form>
            </Stack>
          ) : (
            // Editing Tickets
            <Stack height="100%">
              <Stack sx={{ minHeight: "70px" }}>
                <Typography sx={{ fontWeight: 600, fontSize: "18px" }}>View Ticket Details</Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: theme.palette.text.secondary,
                  }}
                >
                  Viewing of approved ticket concern
                </Typography>
              </Stack>

              <Stack
                sx={{
                  minHeight: "auto",
                }}
              >
                {/* Tickets Details */}
                <Stack
                  sx={{
                    padding: 1,
                    marginTop: 2,
                    minHeight: "200px",
                    border: "1px solid #2D3748",
                    borderRadius: "20px",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "17px",
                      color: theme.palette.success.main,
                    }}
                  >
                    Ticket Concern
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
                              disabled
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
                              disabled
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

                                setValue("userId", []);
                              }}
                              getOptionLabel={(option) => option.channel_Name}
                              isOptionEqualToValue={(option, value) => option.id === value.id}
                              sx={{
                                flex: 2,
                              }}
                              fullWidth
                              disablePortal
                              disableClearable
                              disabled
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
                              isOptionEqualToValue={(option, value) => option.userId === value.userId}
                              sx={{
                                flex: 2,
                              }}
                              fullWidth
                              disablePortal
                              disabled
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
                          render={({ field }) => (
                            <DatePicker
                              value={field.value ? moment(field.value) : null}
                              onChange={(newValue) => {
                                console.log("New Value: ", newValue);

                                const formattedValue = newValue ? moment(newValue).format("YYYY-MM-DD") : null;
                                field.onChange(formattedValue);
                                setStartDateValidation(newValue);
                              }}
                              slotProps={{
                                textField: { variant: "outlined" },
                              }}
                              disabled
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
                          render={({ field }) => (
                            <DatePicker
                              value={field.value ? moment(field.value) : null}
                              onChange={(newValue) => {
                                const formattedValue = newValue ? moment(newValue).format("YYYY-MM-DD") : null;
                                field.onChange(formattedValue);
                              }}
                              slotProps={{
                                textField: { variant: "outlined" },
                              }}
                              minDate={startDateValidation}
                              error={!!errors.targetDate}
                              helperText={errors.targetDate ? errors.targetDate.message : null}
                              disabled
                            />
                          )}
                        />
                        {errors.targetDate && <Typography>{errors.targetDate.message}</Typography>}
                      </LocalizationProvider>
                    </Stack>
                  </Stack>
                </Stack>

                {/* Attachments */}
                <Stack padding={2} marginTop={3} gap={1.5} sx={{ border: "1px solid #2D3748", borderRadius: "20px" }}>
                  <Stack direction="row" gap={1} alignItems="center" onDragOver={handleDragOver} onDrop={handleDrop}>
                    <GetAppOutlined sx={{ color: theme.palette.text.secondary }} />

                    <Typography
                      sx={{
                        fontSize: "14px",
                      }}
                    >
                      Attachments:
                    </Typography>
                  </Stack>

                  {addAttachments === undefined ? (
                    <Stack sx={{ flexDirection: "column", maxHeight: "auto", padding: 4 }}>
                      <Stack direction="row" gap={0.5} justifyContent="center">
                        <AttachFileOutlined sx={{ color: theme.palette.text.secondary }} />
                        <Typography sx={{ color: theme.palette.text.secondary }}>No attached file</Typography>
                      </Stack>
                    </Stack>
                  ) : (
                    <Stack sx={{ flexDirection: "column", maxHeight: "auto" }}>
                      {addAttachments?.map((fileName, index) => (
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
                              {!fileName.ticketAttachmentId && (
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

                              <Tooltip title="Download">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => {
                                    window.location = fileName.link;
                                  }}
                                  style={{
                                    background: "none",
                                  }}
                                >
                                  <FileDownloadOutlined />
                                </IconButton>
                              </Tooltip>
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

              <Stack
                sx={{
                  flexDirection: "row",
                  gap: 1,
                  marginTop: 1,
                  justifyContent: "right",
                  alignItems: "center",
                  // minHeight: "70px",
                }}
              >
                <LoadingButton
                  variant="outlined"
                  onClick={onCloseAddAction}
                  disabled={isCreateEditReceiverConcernLoading || isCreateEditReceiverConcernFetching || approveReceiverConcernIsFetching || approveReceiverConcernIsLoading}
                  sx={{
                    ":disabled": {
                      backgroundColor: "none",
                      color: "black",
                    },
                  }}
                >
                  {" "}
                  Close{" "}
                </LoadingButton>
              </Stack>
            </Stack>
          )}
        </Paper>
      </Stack>

      <ReceiverAddTicketDialog open={open} onClose={onDialogClose} />
      <ViewTransferRemarksDialog data={viewRemarksData} open={viewRemarksOpen} onClose={viewRemarksOnClose} />
    </Stack>
  );
};

export default ReceiverConcerns;
