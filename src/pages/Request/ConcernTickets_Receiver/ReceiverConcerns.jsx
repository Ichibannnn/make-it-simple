import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  OutlinedInput,
  Paper,
  Stack,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";

import {
  AccessTimeOutlined,
  Add,
  FiberManualRecord,
  GetAppOutlined,
  Search,
} from "@mui/icons-material";

import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import moment from "moment";

import { theme } from "../../../theme/theme";
import useDebounce from "../../../hooks/useDebounce";
import useDisclosure from "../../../hooks/useDisclosure";

import {
  useGetReceiverConcernsQuery,
  useLazyGetReceiverAttachmentQuery,
} from "../../../features/api_request/concerns_receiver/concernReceiverApi";
import { useLazyGetCategoryQuery } from "../../../features/api masterlist/category_api/categoryApi";
import { useLazyGetSubCategoryQuery } from "../../../features/api masterlist/sub_category_api/subCategoryApi";
import { useLazyGetChannelsQuery } from "../../../features/api_channel_setup/channel/channelApi";

import { ReceiverConcernsActions } from "./ReceiverConcernsActions";
import ReceiverConcernDialog from "./ReceiverConcernDialog";

const schema = yup.object().shape({
  RequestGeneratorId: yup.string().nullable(),
  // Department: yup.string().required().label("Department"),
  // EmpId: yup.string().required(),
  // FullName: yup.string().required().label("Full Name"),
  // concern_Details: yup.string().required().label("Concern Details"),
  categoryId: yup.object().required().label("Category"),
  subCategoryId: yup.object().required().label("Sub category"),
  ChannelId: yup.object().required().label("Channel"),
  userId: yup.object().required().label("Issue handler"),
  RequestConcernId: yup.string().nullable(),
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

  const [addAttachments, setAddAttachments] = useState([]);

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

  const [getAddReceiverAttachment, { data: attachmentData }] =
    useLazyGetReceiverAttachmentQuery();

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
      // Department: "",
      // EmpId: "",
      // FullName: "",
      // Concern: "",
      ChannelId: null,
      userId: null,
      categoryId: null,
      subCategoryId: null,
      RequestConcernId: "",
      RequestAttachmentsFiles: [],
    },
  });

  const onPageNumberChange = (_, page) => {
    setPageNumber(page + 1);
  };

  const onPageSizeChange = (e) => {
    setPageSize(e.target.value);
  };

  const getAddAttachmentData = async (id) => {
    try {
      const res = await getAddReceiverAttachment({ Id: id }).unwrap();

      console.log("res", res);

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

  useEffect(() => {
    if (addData) {
      getAddAttachmentData(addData.requestGeneratorId);
    }
  }, [addData]);

  const onViewAction = (data) => {
    onToggle();
    setViewData(data);
  };

  const onAddAction = (data) => {
    // console.log("Add data: ", data);
    setAddData(data);
  };

  const onDialogClose = () => {
    setViewData(null);
    onClose();
  };

  const onCloseAddAction = () => {
    setAddData(null);
  };

  useEffect(() => {
    if (addData) {
      setValue("Department", addData?.department_Name);
      setValue("EmpId", addData?.empId);
      setValue("FullName", addData?.fullName);
      setValue("Concern", addData?.concern);
    }
  }, [addData]);

  // console.log("Category Data: ", categoryData);
  // console.log("Sub Category Data: ", subCategoryData);
  // console.log("watch cat id: ", watch("categoryId"));
  // console.log("Add Attachments", addAttachments);
  // console.log("Add Data: ", addData);

  // console.log("Channel Data: ", channelData);
  console.log("Channel Id: ", watch("ChannelId")?.id);
  console.log("Issue Handler Data: ", issueHandlerData?.value?.channel);

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
            width: addData ? "70%" : "100%",
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
              // value={searchValue}
              // onChange={(e) => setSearchValue(e.target.value)}
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
                data?.value?.requestConcern?.map((item, index) => (
                  <Stack
                    key={index}
                    sx={{
                      border: "1px solid #2D3748",
                      borderRadius: "20px",
                      minHeight: "200px",
                      cursor: "pointer",
                      backgroundColor:
                        addData?.requestGeneratorId === item?.requestGeneratorId
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
                        <FiberManualRecord color="success" fontSize="65px" />
                        <Typography sx={{ fontSize: "15px" }}>
                          Concern No. {item.requestGeneratorId} -{" "}
                          {item.fullName}
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
                      onClick={() => onAddAction(item)}
                      sx={{
                        border: "1px solid #2D3748",
                        minHeight: "120px",
                        padding: 2,
                      }}
                    >
                      <Typography sx={{ fontSize: "15px" }}>
                        {item.concern}
                      </Typography>
                    </Stack>

                    <Stack
                      sx={{
                        width: "100%",
                        minHeight: "40px",
                        alignItems: "end",
                        paddingRight: 2,
                        paddingLeft: 2,
                      }}
                    >
                      <ReceiverConcernsActions
                        data={item}
                        onView={onViewAction}
                      />
                    </Stack>
                  </Stack>
                ))}

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

              {isSuccess && !data?.value?.requestConcern.length && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="h4" color="#EDF2F7">
                      No records found.
                    </Typography>
                  </TableCell>
                </TableRow>
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
            display: addData ? "flex" : "none",
            flexDirection: "column",
            backgroundColor: theme.palette.bgForm.black3,
            padding: 2,
            borderRadius: "20px",
          }}
        >
          <Stack height="100%">
            <Stack sx={{ minHeight: "70px" }}>
              <Typography sx={{ fontWeight: 600, fontSize: "18px" }}>
                Create Ticket
              </Typography>
              <Typography
                sx={{ fontSize: "14px", color: theme.palette.text.secondary }}
              >
                Add issue handler details to create ticket from this concern.{" "}
              </Typography>
            </Stack>

            <Stack
              sx={{
                minHeight: "1100px",
              }}
            >
              {/* Requestor Details */}
              {/* <Stack
                sx={{
                  padding: 1,
                  marginTop: 2,
                  minHeight: "600px",
                  border: "1px solid #2D3748",
                  borderRadius: "20px",
                }}
              >
                <Typography
                  sx={{ fontSize: "17px", color: theme.palette.success.main }}
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
                      name="Department"
                      render={({ field: { ref, value, onChange } }) => {
                        return (
                          <TextField
                            inputRef={ref}
                            size="small"
                            value={value}
                            placeholder="Department"
                            onChange={onChange}
                            inputProps={{
                              readOnly: addData ? true : false,
                              style: {
                                fontSize: "14px",
                              },
                            }}
                            sx={{
                              flex: 2,
                            }}
                            fullWidth
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
                      Employee ID:
                    </Typography>
                    <Controller
                      control={control}
                      name="EmpId"
                      render={({ field: { ref, value, onChange } }) => {
                        return (
                          <TextField
                            inputRef={ref}
                            size="small"
                            value={value}
                            placeholder="Employee ID"
                            onChange={onChange}
                            inputProps={{
                              readOnly: addData ? true : false,
                              style: {
                                fontSize: "14px",
                              },
                            }}
                            sx={{
                              flex: 2,
                            }}
                            fullWidth
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
                      Fullname:
                    </Typography>
                    <Controller
                      control={control}
                      name="FullName"
                      render={({ field: { ref, value, onChange } }) => {
                        return (
                          <TextField
                            inputRef={ref}
                            size="small"
                            value={value}
                            placeholder="Fullname"
                            onChange={onChange}
                            inputProps={{
                              readOnly: addData ? true : false,
                              style: {
                                fontSize: "14px",
                              },
                            }}
                            sx={{
                              flex: 2,
                            }}
                            fullWidth
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
                      name="Concern"
                      render={({ field: { ref, value, onChange } }) => {
                        return (
                          <TextField
                            inputRef={ref}
                            size="small"
                            value={value}
                            placeholder="Concern"
                            onChange={onChange}
                            // disabled={addData ? true : false}
                            inputProps={{
                              readOnly: addData ? true : false,
                              style: {
                                fontSize: "14px",
                              },
                            }}
                            sx={{
                              flex: 2,
                            }}
                            rows={6}
                            multiline
                            // fullWidth
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
                                InputProps={{
                                  ...params.InputProps,
                                  style: {
                                    fontSize: "14px",
                                  },
                                }}
                              />
                            )}
                            onOpen={() => {
                              if (!categoryIsSuccess)
                                getCategory({
                                  Status: true,
                                });
                            }}
                            onChange={(_, value) => {
                              console.log("Value: ", value);
                              onChange(value);

                              setValue("subCategoryId", null);

                              getSubCategory({
                                Status: true,
                              });
                            }}
                            getOptionLabel={(option) =>
                              option.category_Description
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
                                  item.categoryId === watch("categoryId")?.id
                              ) || []
                            }
                            loading={subCategoryIsLoading}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Sub Category"
                                InputProps={{
                                  ...params.InputProps,
                                  style: {
                                    fontSize: "14px",
                                  },
                                }}
                              />
                            )}
                            onChange={(_, value) => {
                              onChange(value || []);
                            }}
                            getOptionLabel={(option) =>
                              `${option.subCategory_Description}`
                            }
                            isOptionEqualToValue={(option, value) =>
                              option.subCategoryId === value.subCategoryId
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
                </Stack>
              </Stack> */}

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
                  sx={{ fontSize: "17px", color: theme.palette.success.main }}
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
                              <TextField {...params} placeholder="Category" />
                            )}
                            onOpen={() => {
                              if (!categoryIsSuccess)
                                getCategory({
                                  Status: true,
                                });
                            }}
                            onChange={(_, value) => {
                              console.log("Value: ", value);
                              onChange(value);

                              setValue("subCategoryId", null);

                              getSubCategory({
                                Status: true,
                              });
                            }}
                            getOptionLabel={(option) =>
                              option.category_Description
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
                                  item.categoryId === watch("categoryId")?.id
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
                              onChange(value || []);
                            }}
                            getOptionLabel={(option) =>
                              `${option.subCategory_Description}`
                            }
                            isOptionEqualToValue={(option, value) =>
                              option.subCategoryId === value.subCategoryId
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
                              console.log("value: ", value);
                              onChange(value);

                              setValue("userId", null);

                              getIssueHandler({
                                Status: true,
                              });
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
                            ref={ref}
                            size="small"
                            value={value}
                            options={
                              channelData?.value?.channel?.find(
                                (item) => item.id === watch("ChannelId")?.id
                              ).channelUsers || []
                            }
                            loading={issueHandlerIsLoading}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Issue Handler"
                              />
                            )}
                            onChange={(_, value) => {
                              console.log("Value: ", value);

                              onChange(value || []);
                            }}
                            getOptionLabel={(option) => option.fullname}
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
                      Start Date:
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
                                  item.categoryId === watch("categoryId")?.id
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
                              onChange(value || []);
                            }}
                            getOptionLabel={(option) =>
                              `${option.subCategory_Description}`
                            }
                            isOptionEqualToValue={(option, value) =>
                              option.subCategoryId === value.subCategoryId
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
                      Target Date:
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
                                  item.categoryId === watch("categoryId")?.id
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
                              onChange(value || []);
                            }}
                            getOptionLabel={(option) =>
                              `${option.subCategory_Description}`
                            }
                            isOptionEqualToValue={(option, value) =>
                              option.subCategoryId === value.subCategoryId
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
                </Stack>
              </Stack>

              {/* Attachments */}
              <Stack
                padding={2}
                marginTop={3}
                gap={1.5}
                sx={{ border: "1px solid #2D3748", borderRadius: "20px" }}
              >
                <Stack direction="row" gap={1} alignItems="center">
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
                    color="warning"
                    variant="contained"
                    startIcon={<Add />}
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
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Stack>
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
              <Button variant="contained"> Submit </Button>
              <Button variant="outlined" onClick={onCloseAddAction}>
                {" "}
                Close{" "}
              </Button>
            </Stack>
          </Stack>
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
