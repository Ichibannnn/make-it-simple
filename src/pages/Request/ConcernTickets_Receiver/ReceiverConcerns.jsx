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
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";

import {
  AccessTimeOutlined,
  Add,
  CheckOutlined,
  FiberManualRecord,
  FileDownloadOutlined,
  FileUploadOutlined,
  GetAppOutlined,
  RemoveCircleOutline,
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

import {
  useCreateEditReceiverConcernMutation,
  useGetReceiverConcernsQuery,
  useLazyGetReceiverAttachmentQuery,
} from "../../../features/api_request/concerns_receiver/concernReceiverApi";
import { useLazyGetCategoryQuery } from "../../../features/api masterlist/category_api/categoryApi";
import { useLazyGetSubCategoryQuery } from "../../../features/api masterlist/sub_category_api/subCategoryApi";
import { useLazyGetChannelsQuery } from "../../../features/api_channel_setup/channel/channelApi";

import { ReceiverConcernsActions } from "./ReceiverConcernsActions";
import ReceiverConcernDialog from "./ReceiverConcernDialog";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LoadingButton } from "@mui/lab";
import { Toaster, toast } from "sonner";
import { useDeleteRequestorAttachmentMutation } from "../../../features/api_request/concerns/concernApi";

const schema = yup.object().shape({
  RequestGeneratorId: yup.string().nullable(),
  Requestor_By: yup.string().nullable(),
  concern_Details: yup.array().nullable(),
  ticketConcernId: yup.array().nullable(),
  categoryId: yup.object().required().label("Category"),
  subCategoryId: yup.object().required().label("Sub category"),
  ChannelId: yup.object().required().label("Channel"),
  userId: yup.array().required().label("Issue handler"),
  startDate: yup.date().required("Start date is required"),
  targetDate: yup.date().required("Target date is required"),
  RequestConcernId: yup.string().nullable(),
  RequestAttachmentsFiles: yup.array().nullable(),
});

const ReceiverConcerns = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue, 500);

  const [viewData, setViewData] = useState(null);
  const [addData, setAddData] = useState(null);
  const [editData, setEditData] = useState(null);

  const [addAttachments, setAddAttachments] = useState([]);
  const [ticketAttachmentId, setTicketAttachmentId] = useState(null);
  const [startDateValidation, setStartDateValidation] = useState(null);

  const fileInputRef = useRef();
  const today = moment();

  const isSmallScreen = useMediaQuery(
    "(max-width: 1489px) and (max-height: 945px)"
  );

  const { open, onToggle, onClose } = useDisclosure();

  const { data, isLoading, isFetching, isSuccess, isError } =
    useGetReceiverConcernsQuery({
      Search: search,
      PageNumber: pageNumber,
      PageSize: pageSize,
    });

  const [
    getCategory,
    {
      data: categoryData,
      isLoading: categoryIsLoading,
      isSuccess: categoryIsSuccess,
    },
  ] = useLazyGetCategoryQuery();

  const [
    getSubCategory,
    {
      data: subCategoryData,
      isLoading: subCategoryIsLoading,
      isSuccess: subCategoryIsSuccess,
    },
  ] = useLazyGetSubCategoryQuery();

  const [
    getChannel,
    {
      data: channelData,
      isLoading: channelIsLoading,
      isSuccess: channelIsSuccess,
    },
  ] = useLazyGetChannelsQuery();

  const [
    getIssueHandler,
    {
      data: issueHandlerData,
      isLoading: issueHandlerIsLoading,
      isSuccess: issueHandlerIsSuccess,
    },
  ] = useLazyGetChannelsQuery();

  const [
    createEditReceiverConcern,
    {
      isLoading: isCreateEditReceiverConcernLoading,
      isFetching: isCreateEditReceiverConcernFetching,
    },
  ] = useCreateEditReceiverConcernMutation();

  const [
    deleteRequestorAttachment,
    {
      isLoading: isDeleteRequestorAttachmentLoading,
      isFetching: isDeleteRequestorAttachmentFetching,
    },
  ] = useDeleteRequestorAttachmentMutation();

  const [getAddReceiverAttachment, { data: attachmentData }] =
    useLazyGetReceiverAttachmentQuery();

  const onPageNumberChange = (_, page) => {
    setPageNumber(page + 1);
  };

  const onPageSizeChange = (e) => {
    setPageSize(e.target.value);
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
      RequestGeneratorId: "",
      Requestor_By: "",
      concern_Details: [],
      ticketConcernId: [],

      categoryId: null,
      subCategoryId: null,

      ChannelId: null,
      userId: [],
      startDate: null,
      targetDate: null,

      RequestConcernId: "",
      RequestAttachmentsFiles: [],
    },
  });

  const onSubmitAction = (formData) => {
    console.log("FormData: ", formData);

    const payload = new FormData();

    // USER LENGTH
    const userIdsLength =
      formData.userId?.map((item) => item.userId).length || 0;

    // console.log("User length: ", userIdsLength);
    // console.log("User length: ", formData.concern_Details);

    payload.append("RequestGeneratorId", formData.RequestGeneratorId);
    payload.append("Requestor_By", formData.Requestor_By);
    payload.append("ChannelId", formData.ChannelId.id);

    // ConcernDetails
    const concernDetails = formData.concern_Details;
    for (let i = 0; i < userIdsLength; i++) {
      payload.append(
        `AddRequestConcernbyConcerns[${i}].concern_Details`,
        concernDetails[i % concernDetails.length]
      );
    }
    // Category
    const category = [formData.categoryId?.id];
    for (let i = 0; i < userIdsLength; i++) {
      payload.append(
        `AddRequestConcernbyConcerns[${i}].categoryId`,
        category[i % category.length]
      );
    }
    // SubCategory
    const subcategory = [formData.subCategoryId?.id];
    for (let i = 0; i < userIdsLength; i++) {
      payload.append(
        `AddRequestConcernbyConcerns[${i}].subCategoryId`,
        subcategory[i % subcategory.length]
      );
    }
    // IssueHandler
    const assignto = formData.userId?.map((item) => item.userId);
    for (let i = 0; i < assignto.length; i++) {
      payload.append(`AddRequestConcernbyConcerns[${i}].userId`, assignto[i]);
    }
    // StartDate
    const startdate = [moment(formData.startDate).format("YYYY-MM-DD")];
    for (let i = 0; i < userIdsLength; i++) {
      payload.append(
        `AddRequestConcernbyConcerns[${i}].start_Date`,
        startdate[i % startdate.length]
      );
    }
    // TargetDate
    const targetdate = [moment(formData.targetDate).format("YYYY-MM-DD")];
    for (let i = 0; i < userIdsLength; i++) {
      payload.append(
        `AddRequestConcernbyConcerns[${i}].target_Date`,
        targetdate[i % targetdate.length]
      );
    }

    // TicketConcernId
    const ticketconcernid = formData.ticketConcernId;
    for (let i = 0; i < ticketconcernid.length; i++) {
      payload.append(
        `AddRequestConcernbyConcerns[${i}].ticketConcernId`,
        ticketconcernid[i] || ""
      );
    }

    // Attachments
    const files = formData.RequestAttachmentsFiles;
    for (let i = 0; i < files.length; i++) {
      payload.append(
        `ConcernAttachments[${i}].ticketAttachmentId`,
        files[i].ticketAttachmentId || ""
      );
      payload.append(`ConcernAttachments[${i}].attachment`, files[i]);
    }

    if (files.length === 0) {
      payload.append(`ConcernAttachments[0].ticketAttachmentId`, "");
      payload.append(`ConcernAttachments[0].attachment`, "");
    }

    console.log("Payload Entries: ", [...payload.entries()]);

    createEditReceiverConcern(payload)
      .unwrap()
      .then(() => {
        toast.success("Success!", {
          description: "Concern transferred successfully!",
          duration: 1500,
        });
        setAddAttachments([]);
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
  };

  const handleAttachments = (event) => {
    // console.log("event: ", event);
    const newFiles = Array.from(event.target.files);

    const fileNames = newFiles.map((file) => ({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2),
    }));

    const uniqueNewFiles = fileNames.filter(
      (newFile) =>
        !addAttachments.some(
          (existingFile) => existingFile.name === newFile.name
        )
    );

    setAddAttachments((prevFiles) => [...prevFiles, ...uniqueNewFiles]);
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
          removeAttachments: [
            {
              ticketAttachmentId: fileNameToDelete.ticketAttachmentId,
            },
          ],
        };
        await deleteRequestorAttachment(deletePayload).unwrap();
      }

      setAddAttachments((prevFiles) =>
        prevFiles.filter((fileName) => fileName !== fileNameToDelete)
      );

      setValue(
        "RequestAttachmentsFiles",
        watch("RequestAttachmentsFiles").filter(
          (file) => file.name !== fileNameToDelete.name
        )
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

    const uniqueNewFiles = fileNames.filter(
      (fileName) => !addAttachments.includes(fileName)
    );
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

  const onViewAction = (data) => {
    onToggle();
    setViewData(data);
  };

  const onAddEditAction = (data) => {
    const bindFunction = data?.ticketRequestConcerns?.map((item) => ({
      categoryId: item?.categoryId,
    }));

    // console.log("bindFunction: ", bindFunction?.[0]?.categoryId);

    if (bindFunction?.[0]?.categoryId === null) {
      setAddData(data);
      setEditData(null);
      reset();
    } else {
      setEditData(data);
      setAddData(null);
    }
  };

  const onDialogClose = () => {
    setViewData(null);
    onClose();
  };

  const onCloseAddAction = () => {
    setAddData(null);
    setEditData(null);
    reset();
  };

  useEffect(() => {
    if (addData) {
      const ticketConcernIdArray = addData?.ticketRequestConcerns?.map((item) =>
        item?.ticketConcerns?.map((item2) => {
          return {
            ticketConcernId: item2?.ticketConcernId,
          };
        })
      );

      const bindIssueHandler = addData?.ticketRequestConcerns?.map((item) =>
        item?.ticketConcerns?.map((item2) => ({
          fullname: item2?.issue_Handler,
          userId: item2?.userId,
        }))
      );

      setValue("RequestGeneratorId", addData?.requestGeneratorId);
      setValue("Requestor_By", addData?.userId);
      setValue("concern_Details", [addData?.concern]);

      setValue(
        "ticketConcernId",
        ticketConcernIdArray.flat().map((item) => item.ticketConcernId)
      );

      getAddAttachmentData(addData.requestGeneratorId);
    }
  }, [addData]);

  useEffect(() => {
    if (editData) {
      if (!categoryIsSuccess) getCategory();
      if (!subCategoryIsSuccess) getSubCategory();
      if (!channelIsSuccess) getChannel();
      if (!issueHandlerIsSuccess) getIssueHandler();

      const ticketConcernIdArray = editData?.ticketRequestConcerns?.map(
        (item) =>
          item?.ticketConcerns?.map((item2) => {
            return {
              ticketConcernId: item2?.ticketConcernId,
            };
          })
      );

      const bindData = editData?.ticketRequestConcerns?.map((item) => ({
        categoryId: item?.categoryId,
        category_Description: item?.category_Description,
        subCategoryId: item?.subCategoryId,
        subCategory_Description: item?.subCategory_Description,
        channelId: item?.channelId,
        channel_Name: item?.channel_Name,
        start_Date: moment(item?.start_Date).format("YYYY-MM-DD"),
        target_Date: moment(item?.target_Date).format("YYYY-MM-DD"),
      }));

      const bindIssueHandler = editData?.ticketRequestConcerns?.map((item) =>
        item?.ticketConcerns?.map((item2) => ({
          fullname: item2?.issue_Handler,
          userId: item2?.userId,
        }))
      );

      console.log("Bind Data: ", bindData);

      setValue("RequestGeneratorId", editData?.requestGeneratorId);
      setValue("Requestor_By", editData?.userId);
      setValue("concern_Details", [editData?.concern]);

      setValue("categoryId", {
        id: bindData?.[0]?.categoryId ? bindData?.[0]?.categoryId : "",
        category_Description: bindData?.[0]?.category_Description
          ? bindData?.[0]?.category_Description
          : "",
      });

      setValue("subCategoryId", {
        id: bindData?.[0]?.subCategoryId ? bindData?.[0]?.subCategoryId : "",
        subCategory_Description: bindData?.[0]?.subCategory_Description
          ? bindData?.[0]?.subCategory_Description
          : "",
      });

      setValue("ChannelId", {
        id: bindData?.[0]?.channelId ? bindData?.[0]?.channelId : "",
        channel_Name: bindData?.[0]?.channel_Name
          ? bindData?.[0]?.channel_Name
          : "",
      });

      setValue(
        "userId",
        bindIssueHandler.flat().map((item) => ({
          fullname: item?.fullname,
          userId: item?.userId,
        }))
      );

      setValue("startDate", bindData?.[0]?.start_Date);
      setValue("targetDate", bindData?.[0]?.target_Date);

      setValue(
        "ticketConcernId",
        ticketConcernIdArray.flat().map((item) => item.ticketConcernId)
      );

      getAddAttachmentData(editData.requestGeneratorId);
    }
  }, [editData]);

  useEffect(() => {
    if (watch("targetDate") < startDateValidation && watch("targetDate")) {
      toast.error("Error!", {
        description: "Target date cannot be earlier than start date.",
        duration: 1500,
      });
    }
  }, [startDateValidation, watch("targetDate")]);

  console.log(
    "length: ",
    data?.value?.ticketRequestConcerns?.ticketConcerns?.length
  );

  // console.log("Add data: ", addData);
  // console.log("Edit data: ", editData);
  console.log(" data: ", data);
  // console.log("Errors: ", errors);

  // console.log("Start Date: ", watch("startDate"));
  // console.log("Target Date: ", watch("targetDate"));

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
        <Stack direction="row" justifyContent="space-between">
          <Stack>
            <Stack justifyItems="left">
              <Typography variant="h4">Concerns</Typography>
            </Stack>
            <Stack
              justifyItems="space-between"
              direction="row"
              marginTop={1}
            ></Stack>
          </Stack>
        </Stack>
      </Stack>

      <Stack sx={{ flexDirection: "row", gap: 2 }}>
        {/* CONCERN TABLE */}
        <Paper
          sx={{
            width: addData || editData ? "70%" : "100%",
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
            }}
            gap={1}
          >
            <Stack />
            <OutlinedInput
              placeholder="Search"
              startAdornment={
                <Search sx={{ marginRight: 0.5, color: "#A0AEC0" }} />
              }
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              sx={{
                borderRadius: "15px",
                fontSize: "small",
                fontWeight: 400,
                lineHeight: "1.4375rem",
                // backgroundColor: "#111927",
              }}
            />
          </Stack>

          <Stack padding={4} width="100%" gap={2}>
            <Stack
              sx={{
                minHeight: "500px",
                maxHeight: "115vh",
                overflowY: "auto",
                gap: 2,
              }}
            >
              {isSuccess &&
                !isLoading &&
                !isFetching &&
                data?.value?.requestConcern?.map((item) => (
                  <Stack
                    key={item.requestGeneratorId}
                    sx={{
                      border: "1px solid #2D3748",
                      borderRadius: "20px",
                      minHeight: "200px",
                      cursor: "pointer",
                      backgroundColor:
                        addData?.requestGeneratorId === item?.requestGeneratorId
                          ? "#5f478e"
                          : editData?.requestGeneratorId ===
                            item?.requestGeneratorId
                          ? "#5f478e"
                          : "",
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
                      <Stack direction="row" gap={1} alignItems="center">
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          {item.fullName} - {item.department_Name}
                        </Typography>
                      </Stack>

                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Chip
                          variant="filled"
                          color="primary"
                          size="small"
                          icon={
                            <AccessTimeOutlined
                              sx={{
                                fontSize: "16px",
                                color: theme.palette.text.secondary,
                              }}
                            />
                          }
                          label={`Posted at ${moment(item?.created_At).format(
                            "LL"
                          )}`}
                        />
                      </Stack>
                    </Stack>

                    <Stack
                      onClick={() => onAddEditAction(item)}
                      sx={{
                        border: "1px solid #2D3748",
                        minHeight: "120px",
                        padding: 2,
                      }}
                    >
                      <Stack direction="row" gap={1} alignItems="center">
                        <Typography
                          sx={{
                            fontSize: "15px",
                            fontWeight: 500,
                            textDecoration: "",
                          }}
                        >
                          CONCERN NO. {item.requestGeneratorId} -{" "}
                        </Typography>
                      </Stack>

                      <Stack direction="row" gap={1} alignItems="center">
                        <FiberManualRecord color="success" fontSize="65px" />

                        <Typography
                          className="ellipsis-styling"
                          sx={{
                            fontSize: "15px",
                            color: theme.palette.text.secondary,
                          }}
                        >
                          {item.concern}
                        </Typography>
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
                      <Stack>
                        <Typography
                          sx={{
                            fontSize: "13px",
                            // color: theme.palette.primary.main,
                          }}
                        >
                          {/* Issue Handler(s) assigned to this concern: */}
                        </Typography>
                      </Stack>

                      <ReceiverConcernsActions
                        data={item}
                        onView={onViewAction}
                      />
                    </Stack>
                  </Stack>
                ))}

              {isError && (
                <Stack
                  width="100%"
                  height="100%"
                  justifyContent="center"
                  alignItems="center"
                >
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="h4" color="#EDF2F7">
                        Something went wrong.
                      </Typography>
                    </TableCell>
                  </TableRow>
                </Stack>
              )}

              {isSuccess && !data?.value?.requestConcern?.length && (
                <Stack
                  marginTop={4}
                  width="100%"
                  height="100%"
                  justifyContent="center"
                  alignItems="center"
                  // sx={{
                  //   backgroundColor: theme.palette.bgForm.black1,
                  // }}
                >
                  <img
                    src={noRecordsFound}
                    alt="No Records Found"
                    className="norecords-found"
                  />
                  <Stack marginLeft={6} marginTop={1}>
                    <Typography color="#EDF2F7" variant="h5">
                      No records found.
                    </Typography>
                  </Stack>
                </Stack>
              )}

              {(isLoading || isFetching) && (
                <Stack
                  width="100%"
                  height="100%"
                  justifyContent="center"
                  alignItems="center"
                >
                  <CircularProgress />
                  <Typography variant="h4" color="#EDF2F7">
                    Please wait...
                  </Typography>
                </Stack>
              )}
            </Stack>

            {isSuccess && data?.value?.requestConcern?.length && (
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
            )}
          </Stack>
        </Paper>

        {/* CREATE TICKET FORM */}
        <Paper
          sx={{
            width: "30%",
            minHeight: "90vh",
            display: addData || editData ? "flex" : "none",
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
                  <Typography sx={{ fontWeight: 600, fontSize: "18px" }}>
                    Create Ticket
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Add issue handler details to create ticket from this
                    concern.{" "}
                  </Typography>
                </Stack>

                <Stack
                  sx={{
                    minHeight: "1100px",
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
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    placeholder="Category"
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

                                  setValue("subCategoryId", null);

                                  getSubCategory({
                                    Status: true,
                                  });
                                }}
                                getOptionLabel={(option) =>
                                  option.category_Description || ""
                                }
                                isOptionEqualToValue={(option, value) =>
                                  option.id === value.id
                                }
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
                                options={
                                  subCategoryData?.value?.subCategory.filter(
                                    (item) =>
                                      item.categoryId ===
                                      watch("categoryId")?.id
                                  ) || []
                                }
                                loading={subCategoryIsLoading}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    placeholder="Sub Category"
                                  />
                                )}
                                onChange={(_, value) => {
                                  console.log("Value ", value);

                                  onChange(value || []);
                                }}
                                getOptionLabel={(option) =>
                                  `${option.subCategory_Description}`
                                }
                                isOptionEqualToValue={(option, value) =>
                                  option.id === value.id
                                }
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
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    placeholder="Channel Name"
                                  />
                                )}
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
                                isOptionEqualToValue={(option, value) =>
                                  option.id === value.id
                                }
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
                                multiple
                                ref={ref}
                                size="small"
                                value={value}
                                options={
                                  channelData?.value?.channel?.find(
                                    (item) => item.id === watch("ChannelId")?.id
                                  )?.channelUsers || []
                                }
                                loading={issueHandlerIsLoading}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    placeholder="Issue Handler"
                                  />
                                )}
                                onOpen={() => {
                                  if (!issueHandlerIsSuccess) getIssueHandler();
                                }}
                                onChange={(_, value) => {
                                  onChange(value);
                                }}
                                getOptionLabel={(option) => option.fullname}
                                isOptionEqualToValue={(option, value) =>
                                  option.userId === value.userId
                                }
                                getOptionDisabled={(option) =>
                                  watch("userId")?.some(
                                    (item) => item.userId === option.userId
                                  )
                                }
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
                                  const formattedValue = newValue
                                    ? moment(newValue).format("YYYY-MM-DD")
                                    : null;
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
                          {errors.startDate && (
                            <p>{errors.startDate.message}</p>
                          )}
                        </LocalizationProvider>

                        {/* <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        // minDate={today}
                        onChange={(newValue) =>
                          setStartDate(moment(newValue).format("yyyy-MM-DD"))
                        }
                        sx={{ color: "#ffff" }}
                      />
                    </LocalizationProvider> */}
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
                                  const formattedValue = newValue
                                    ? moment(newValue).format("YYYY-MM-DD")
                                    : null;
                                  field.onChange(formattedValue);
                                }}
                                slotProps={{
                                  textField: { variant: "outlined" },
                                }}
                                minDate={startDateValidation}
                                error={!!errors.targetDate}
                                helperText={
                                  errors.targetDate
                                    ? errors.targetDate.message
                                    : null
                                }
                                disabled={!watch("startDate")}
                              />
                            )}
                          />
                          {errors.targetDate && (
                            <Typography>{errors.targetDate.message}</Typography>
                          )}
                        </LocalizationProvider>

                        {/* <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        onChange={(newValue) =>
                          setTargetDate(moment(newValue).format("yyyy-MM-DD"))
                        }
                        sx={{ color: "#fff" }}
                      />
                    </LocalizationProvider> */}
                      </Stack>
                    </Stack>
                  </Stack>

                  {/* Attachments */}
                  <Stack
                    padding={2}
                    marginTop={3}
                    gap={1.5}
                    sx={{ border: "1px solid #2D3748", borderRadius: "20px" }}
                  >
                    <Stack
                      direction="row"
                      gap={1}
                      alignItems="center"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      <GetAppOutlined
                        sx={{ color: theme.palette.text.secondary }}
                      />

                      <Typography
                        sx={{
                          fontSize: "14px",
                        }}
                      >
                        Atachments:
                      </Typography>

                      <Button
                        size="small"
                        variant="contained"
                        color="warning"
                        startIcon={<Add />}
                        onClick={handleUploadButtonClick}
                      >
                        <Typography sx={{ fontSize: "12px" }}>Add</Typography>
                      </Button>
                    </Stack>

                    <Stack sx={{ flexDirection: "column", maxHeight: 500 }}>
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
                              <Typography sx={{ fontSize: "14px" }}>
                                {fileName.name}
                              </Typography>

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
                                    color: !!fileName.ticketAttachmentId
                                      ? theme.palette.success.main
                                      : theme.palette.primary.main,
                                  }}
                                >
                                  {!!fileName.ticketAttachmentId
                                    ? "Attached file"
                                    : "Uploaded the file successfully"}
                                </Typography>

                                {!!fileName.ticketAttachmentId && (
                                  <CheckOutlined
                                    color="success"
                                    fontSize="small"
                                  />
                                )}
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

                              {!!fileName.ticketAttachmentId && (
                                <Tooltip title="Upload">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() =>
                                      handleUpdateFile(
                                        fileName.ticketAttachmentId
                                      )
                                    }
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

                            onChange([
                              ...files,
                              ...value.filter(
                                (item) =>
                                  item.ticketAttachmentId !== ticketAttachmentId
                              ),
                            ]);

                            setAddAttachments((prevFiles) => [
                              ...prevFiles.filter(
                                (item) =>
                                  item.ticketAttachmentId !== ticketAttachmentId
                              ),
                              {
                                ticketAttachmentId: ticketAttachmentId,
                                name: files[0].name,
                                size: (files[0].size / (1024 * 1024)).toFixed(
                                  2
                                ),
                              },
                            ]);

                            fileInputRef.current.value = "";
                            setTicketAttachmentId(null);
                          } else {
                            handleAttachments(event);
                            const files = Array.from(event.target.files);

                            const uniqueNewFiles = files.filter(
                              (item) =>
                                !value.some((file) => file.name === item.name)
                            );

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
                    minHeight: "70px",
                  }}
                >
                  <LoadingButton
                    variant="contained"
                    type="submit"
                    loading={
                      isCreateEditReceiverConcernLoading ||
                      isCreateEditReceiverConcernFetching
                    }
                    disabled={
                      !watch("categoryId") ||
                      !watch("subCategoryId") ||
                      !watch("ChannelId") ||
                      !watch("userId") ||
                      !watch("startDate") ||
                      !watch("targetDate") ||
                      !addAttachments.length ||
                      watch("targetDate") < startDateValidation
                    }
                  >
                    {" "}
                    Submit{" "}
                  </LoadingButton>
                  <Button variant="outlined" onClick={onCloseAddAction}>
                    {" "}
                    Close{" "}
                  </Button>
                </Stack>
              </form>
            </Stack>
          ) : (
            // Editing Tickets
            <Stack height="100%">
              <form onSubmit={handleSubmit(onSubmitAction)}>
                <Stack sx={{ minHeight: "70px" }}>
                  <Typography sx={{ fontWeight: 600, fontSize: "18px" }}>
                    Manage Ticket Details
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    User can view or edit this ticket concern
                  </Typography>
                </Stack>

                <Stack
                  sx={{
                    minHeight: "1100px",
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
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    placeholder="Category"
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

                                  setValue("subCategoryId", null);

                                  getSubCategory({
                                    Status: true,
                                  });
                                }}
                                getOptionLabel={(option) =>
                                  option.category_Description || ""
                                }
                                isOptionEqualToValue={(option, value) =>
                                  option.id === value.id
                                }
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
                                options={
                                  subCategoryData?.value?.subCategory.filter(
                                    (item) =>
                                      item.categoryId ===
                                      watch("categoryId")?.id
                                  ) || []
                                }
                                loading={subCategoryIsLoading}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    placeholder="Sub Category"
                                  />
                                )}
                                onChange={(_, value) => {
                                  console.log("Value ", value);

                                  onChange(value || []);
                                }}
                                getOptionLabel={(option) =>
                                  `${option.subCategory_Description}`
                                }
                                isOptionEqualToValue={(option, value) =>
                                  option.id === value.id
                                }
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
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    placeholder="Channel Name"
                                  />
                                )}
                                onOpen={() => {
                                  if (!channelIsSuccess)
                                    getChannel({
                                      Status: true,
                                    });
                                }}
                                onChange={(_, value) => {
                                  onChange(value);

                                  setValue("userId", []);

                                  // if (
                                  //   watch("ChannelId")?.id !==
                                  //   watch("ChannelId")?.id
                                  // ) {
                                  //   setValue("userId", null);
                                  //   getIssueHandler({
                                  //     Status: true,
                                  //   });
                                  // }
                                }}
                                getOptionLabel={(option) => option.channel_Name}
                                isOptionEqualToValue={(option, value) =>
                                  option.id === value.id
                                }
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
                                multiple
                                ref={ref}
                                size="small"
                                value={value}
                                options={
                                  channelData?.value?.channel?.find(
                                    (item) => item.id === watch("ChannelId")?.id
                                  )?.channelUsers || []
                                }
                                loading={issueHandlerIsLoading}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    placeholder="Issue Handler"
                                  />
                                )}
                                onOpen={() => {
                                  if (!issueHandlerIsSuccess) getIssueHandler();
                                }}
                                onChange={(_, value) => {
                                  onChange(value);
                                }}
                                getOptionLabel={(option) => option.fullname}
                                isOptionEqualToValue={(option, value) =>
                                  option.userId === value.userId
                                }
                                getOptionDisabled={(option) =>
                                  watch("userId")?.some(
                                    (item) => item.userId === option.userId
                                  )
                                }
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
                                  const formattedValue = newValue
                                    ? moment(newValue).format("YYYY-MM-DD")
                                    : null;

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
                          {errors.startDate && (
                            <p>{errors.startDate.message}</p>
                          )}
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
                                  const formattedValue = newValue
                                    ? moment(newValue).format("YYYY-MM-DD")
                                    : null;
                                  field.onChange(formattedValue);
                                }}
                                slotProps={{
                                  textField: { variant: "outlined" },
                                }}
                                minDate={startDateValidation}
                                error={!!errors.targetDate}
                                helperText={
                                  errors.targetDate
                                    ? errors.targetDate.message
                                    : null
                                }
                                disabled={!watch("startDate")}
                              />
                            )}
                          />
                          {errors.targetDate && (
                            <Typography>{errors.targetDate.message}</Typography>
                          )}
                        </LocalizationProvider>

                        {/* <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          onChange={(newValue) =>
                            setTargetDate(moment(newValue).format("yyyy-MM-DD"))
                          }
                          sx={{ color: "#fff" }}
                        />
                      </LocalizationProvider> */}
                      </Stack>
                    </Stack>
                  </Stack>

                  {/* Attachments */}
                  <Stack
                    padding={2}
                    marginTop={3}
                    gap={1.5}
                    sx={{ border: "1px solid #2D3748", borderRadius: "20px" }}
                  >
                    <Stack
                      direction="row"
                      gap={1}
                      alignItems="center"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      <GetAppOutlined
                        sx={{ color: theme.palette.text.secondary }}
                      />

                      <Typography
                        sx={{
                          fontSize: "14px",
                        }}
                      >
                        Atachments:
                      </Typography>

                      <Button
                        size="small"
                        variant="contained"
                        color="warning"
                        startIcon={<Add />}
                        onClick={handleUploadButtonClick}
                      >
                        <Typography sx={{ fontSize: "12px" }}>Add</Typography>
                      </Button>
                    </Stack>

                    <Stack sx={{ flexDirection: "column", maxHeight: 500 }}>
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
                              <Typography sx={{ fontSize: "14px" }}>
                                {fileName.name}
                              </Typography>

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
                                    color: !!fileName.ticketAttachmentId
                                      ? theme.palette.success.main
                                      : theme.palette.primary.main,
                                  }}
                                >
                                  {!!fileName.ticketAttachmentId
                                    ? "Attached file"
                                    : "Uploaded the file successfully"}
                                </Typography>

                                {!!fileName.ticketAttachmentId && (
                                  <CheckOutlined
                                    color="success"
                                    fontSize="small"
                                  />
                                )}
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

                              {!!fileName.ticketAttachmentId && (
                                <Tooltip title="Upload">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() =>
                                      handleUpdateFile(
                                        fileName.ticketAttachmentId
                                      )
                                    }
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

                            onChange([
                              ...files,
                              ...value.filter(
                                (item) =>
                                  item.ticketAttachmentId !== ticketAttachmentId
                              ),
                            ]);

                            setAddAttachments((prevFiles) => [
                              ...prevFiles.filter(
                                (item) =>
                                  item.ticketAttachmentId !== ticketAttachmentId
                              ),
                              {
                                ticketAttachmentId: ticketAttachmentId,
                                name: files[0].name,
                                size: (files[0].size / (1024 * 1024)).toFixed(
                                  2
                                ),
                              },
                            ]);

                            fileInputRef.current.value = "";
                            setTicketAttachmentId(null);
                          } else {
                            handleAttachments(event);
                            const files = Array.from(event.target.files);

                            const uniqueNewFiles = files.filter(
                              (item) =>
                                !value.some((file) => file.name === item.name)
                            );

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
                    minHeight: "70px",
                  }}
                >
                  <LoadingButton
                    variant="contained"
                    type="submit"
                    loading={
                      isCreateEditReceiverConcernLoading ||
                      isCreateEditReceiverConcernFetching
                    }
                    disabled={
                      !watch("categoryId") ||
                      !watch("subCategoryId") ||
                      !watch("ChannelId") ||
                      !watch("userId") ||
                      !watch("startDate") ||
                      !watch("targetDate") ||
                      !addAttachments.length ||
                      watch("targetDate") < startDateValidation
                    }
                  >
                    {" "}
                    Submit{" "}
                  </LoadingButton>
                  <Button variant="outlined" onClick={onCloseAddAction}>
                    {" "}
                    Close{" "}
                  </Button>
                </Stack>
              </form>
            </Stack>
          )}
        </Paper>
      </Stack>

      <ReceiverConcernDialog
        open={open}
        onClose={onDialogClose}
        data={viewData}
      />
    </Stack>
  );
};

export default ReceiverConcerns;
