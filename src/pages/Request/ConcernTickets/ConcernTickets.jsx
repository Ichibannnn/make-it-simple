import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  OutlinedInput,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import {
  AddOutlined,
  ArrowDownward,
  ArrowUpward,
  CalendarMonthOutlined,
  ChecklistRtlOutlined,
  ClearAllOutlined,
  FiberManualRecord,
  HowToRegOutlined,
  PendingActionsOutlined,
  RotateRightOutlined,
  Search,
} from "@mui/icons-material";

import { theme } from "../../../theme/theme";
import { toast, Toaster } from "sonner";
import Swal from "sweetalert2";
import moment from "moment";

import noRecordsFound from "../../../assets/svg/noRecordsFound.svg";
import somethingWentWrong from "../../../assets/svg/SomethingWentWrong.svg";

import useDebounce from "../../../hooks/useDebounce";
import useDisclosure from "../../../hooks/useDisclosure";

import ConcernDialog from "./ConcernDialog";
import ConcernViewDialog from "./ConcernViewDialog";
import ConcernActions from "./ConcernActions";
import ConcernReturn from "./ConcernReturn";
import ConcernHistory from "./ConcernHistory";

import useSignalRConnection from "../../../hooks/useSignalRConnection";
import { useNotification } from "../../../context/NotificationContext";
import { useDispatch } from "react-redux";
import { notificationApi, useGetNotificationQuery } from "../../../features/api_notification/notificationApi";

import { useCancelConcernMutation, useConfirmConcernMutation, useGetRequestorConcernsQuery } from "../../../features/api_request/concerns/concernApi";
import { useNavigate } from "react-router-dom";
import { notificationMessageApi } from "../../../features/api_notification_message/notificationMessageApi";
import { LoadingButton } from "@mui/lab";

const ConcernTickets = () => {
  const [status, setStatus] = useState("");
  const [ascending, setAscending] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue, 500);

  const [editData, setEditData] = useState(null);
  const [viewHistoryData, setViewHistoryData] = useState(null);
  const [returnData, setReturnData] = useState(null);

  const dispatch = useDispatch();
  // const navigate = useNavigate();
  useSignalRConnection();

  const { open: addConcernOpen, onToggle: addConcernOnToggle, onClose: addConcernOnClose } = useDisclosure();
  const { open: viewConcernOpen, onToggle: viewConcernOnToggle, onClose: viewConcernOnClose } = useDisclosure();
  const { open: viewHistoryOpen, onToggle: viewHistoryOnToggle, onClose: viewHistoryOnClose } = useDisclosure();
  const { open: returnOpen, onToggle: returnOnToggle, onClose: returnOnClose } = useDisclosure();

  const { data: notificationBadge } = useGetNotificationQuery();
  const { data, isLoading, isFetching, isSuccess, isError, refetch } = useGetRequestorConcernsQuery({
    Concern_Status: status,
    Search: search,
    Ascending: ascending,
    PageNumber: pageNumber,
    PageSize: pageSize,
  });

  const [confirmConcern] = useConfirmConcernMutation();
  const [cancelConcern] = useCancelConcernMutation();

  const onPageNumberChange = (_, page) => {
    setPageNumber(page + 1);
  };

  const onPageSizeChange = (e) => {
    setPageSize(e.target.value);
    setPageNumber(1);
  };

  const onStatusChange = (_, newValue) => {
    setStatus(newValue);
    setPageNumber(1);
    setPageSize(5);
    refetch();
  };

  const onDialogClose = () => {
    setEditData(null);
    addConcernOnClose();
  };

  const onViewConcernAction = (data) => {
    viewConcernOnToggle();
    setEditData(data);
  };

  const onConfirmAction = (data) => {
    const payload = {
      requestConcernId: data?.requestConcernId,
    };

    // console.log("Payload: ", payload);

    Swal.fire({
      title: "Confirmation",
      text: "Confirm this concern?",
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
        confirmConcern(payload)
          .unwrap()
          .then(() => {
            toast.success("Success!", {
              description: "Confirm concern successfully!",
              duration: 1500,
            });

            dispatch(notificationApi.util.resetApiState());
            dispatch(notificationMessageApi.util.resetApiState());
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

  const onCancelAction = (data) => {
    const payload = {
      requestConcernId: data?.requestConcernId,
    };

    // console.log("Payload: ", payload);

    Swal.fire({
      title: "Confirmation",
      text: "Cancel this request?",
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
        cancelConcern(payload)
          .unwrap()
          .then(() => {
            dispatch(notificationApi.util.resetApiState());
            toast.success("Success!", {
              description: "Cancelled request successfully!",
              duration: 1500,
            });
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

  const onReturnAction = (data) => {
    // console.log("Return: ", data);
    returnOnToggle();
    setReturnData(data);
  };

  const onViewHistoryAction = (data) => {
    viewHistoryOnToggle();
    setViewHistoryData(data);
  };

  useEffect(() => {
    if (searchValue) {
      setPageNumber(1);
    }
  }, [searchValue]);

  return (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: theme.palette.bgForm.black1,
        color: "#fff",
        padding: "17px",
      }}
    >
      <Toaster richColors position="top-right" closeButton />
      <Stack>
        <Stack direction="row" justifyContent="space-between" width="100%">
          <Stack justifyItems="left">
            <Typography variant="h4">Request Concerns</Typography>
          </Stack>

          <Stack justifyItems="space-between" direction="row">
            <LoadingButton
              size="large"
              variant="contained"
              color="primary"
              startIcon={<AddOutlined />}
              loading={isLoading || isFetching}
              loadingPosition="start"
              onClick={addConcernOnToggle}
            >
              Add Request
            </LoadingButton>
          </Stack>
        </Stack>

        <Stack direction="row" width="100%" justifyContent="space-between">
          {/* MAIN */}
          <Stack
            sx={{
              backgroundColor: theme.palette.bgForm.black3,
              borderRadius: "20px",
              marginTop: "10px",
              width: "100%",
            }}
          >
            <Stack direction="row" justifyContent="space-between">
              <Tabs value={status} onChange={onStatusChange}>
                <Tab
                  value=""
                  className="tabs-styling"
                  label="All Requests"
                  icon={
                    <Badge
                      badgeContent={notificationBadge?.value?.allRequestTicketNotif}
                      max={100000}
                      color="primary"
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                      sx={{
                        ".MuiBadge-badge": {
                          fontSize: "0.55rem",
                          fontWeight: 400,
                        },
                      }}
                    >
                      <ClearAllOutlined />
                    </Badge>
                  }
                  iconPosition="start"
                  sx={{
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                />

                <Tab
                  value="For Approval"
                  className="tabs-styling"
                  label="Verification"
                  icon={
                    <Badge
                      badgeContent={notificationBadge?.value?.forTicketNotif}
                      max={100000}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                      sx={{
                        ".MuiBadge-badge": {
                          fontSize: "0.55rem",
                          fontWeight: 400,
                          background: "#3A96FA",
                          color: "#ffff",
                        },
                      }}
                    >
                      <PendingActionsOutlined />
                    </Badge>
                  }
                  iconPosition="start"
                  sx={{
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                />

                <Tab
                  value="Ongoing"
                  className="tabs-styling"
                  label="Ongoing"
                  icon={
                    <Badge
                      badgeContent={notificationBadge?.value?.currentlyFixingNotif}
                      max={100000}
                      color="warning"
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                      sx={{
                        ".MuiBadge-badge": {
                          fontSize: "0.55rem",
                          fontWeight: 400,
                          color: "#ffff",
                        },
                      }}
                    >
                      <RotateRightOutlined />
                    </Badge>
                  }
                  iconPosition="start"
                  sx={{
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                />

                <Tab
                  value="For Confirmation"
                  className="tabs-styling"
                  label="For Confirmation"
                  icon={
                    <Badge
                      badgeContent={notificationBadge?.value?.notConfirmNotif}
                      max={100000}
                      // color="primary"
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                      sx={{
                        ".MuiBadge-badge": {
                          fontSize: "0.55rem",
                          fontWeight: 400,
                          background: "#009688",
                          color: "#ffff",
                        },
                      }}
                    >
                      <HowToRegOutlined />
                    </Badge>
                  }
                  iconPosition="start"
                  sx={{
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                />

                <Tab
                  value="Done"
                  className="tabs-styling"
                  label="Done"
                  icon={
                    <Badge
                      badgeContent={notificationBadge?.value?.doneNotif}
                      max={100000}
                      color="success"
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                      sx={{
                        ".MuiBadge-badge": {
                          fontSize: "0.55rem",
                          fontWeight: 400,
                          color: "#ffff",
                        },
                      }}
                    >
                      <ChecklistRtlOutlined />
                    </Badge>
                  }
                  iconPosition="start"
                  sx={{
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                />
              </Tabs>
            </Stack>

            <Divider variant="fullWidth" sx={{ background: "#2D3748", marginTop: "1px" }} />

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ marginTop: "5px", padding: "15px" }} gap={4}>
              <OutlinedInput
                placeholder="Search Request no.: eg 00001"
                startAdornment={<Search sx={{ marginRight: 0.5, color: "#A0AEC0" }} />}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                sx={{
                  flex: 1,
                  borderRadius: "15px",
                  fontSize: "small",
                  fontWeight: 400,
                  lineHeight: "1.4375rem",
                }}
              />
            </Stack>

            <TableContainer sx={{ minHeight: "542px", maxHeight: "542px" }}>
              <Table stickyHeader sx={{ borderBottom: "none" }}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        background: "#1C2536",
                        color: "#D65DB1",
                        fontWeight: 700,
                        fontSize: "12px",
                      }}
                      align="center"
                    >
                      <Stack direction="row" gap={0.2} justifyContent="center" alignItems="center">
                        CONCERN NO.
                        <IconButton size="small" onClick={() => setAscending(!ascending)}>
                          {ascending === true ? <ArrowUpward sx={{ color: "#D65DB1", fontSize: "20px" }} /> : <ArrowDownward sx={{ color: "#D65DB1", fontSize: "20px" }} />}
                        </IconButton>
                      </Stack>
                    </TableCell>

                    {(status === "Ongoing" || status === "For Confirmation" || status === "Done") && (
                      <TableCell
                        sx={{
                          background: "#1C2536",
                          color: "#D65DB1",
                          fontWeight: 700,
                          fontSize: "12px",
                        }}
                        align="center"
                      >
                        TICKET NO.
                      </TableCell>
                    )}

                    <TableCell
                      sx={{
                        background: "#1C2536",
                        color: "#D65DB1",
                        fontWeight: 700,
                        fontSize: "12px",
                      }}
                    >
                      REQUEST DETAILS
                    </TableCell>

                    <TableCell
                      sx={{
                        background: "#1C2536",
                        color: "#D65DB1",
                        fontWeight: 700,
                        fontSize: "12px",
                      }}
                      align="center"
                    >
                      DATE CREATED
                    </TableCell>

                    <TableCell
                      sx={{
                        background: "#1C2536",
                        color: "#D65DB1",
                        fontWeight: 700,
                        fontSize: "12px",
                      }}
                    >
                      STATUS
                    </TableCell>

                    <TableCell
                      sx={{
                        background: "#1C2536",
                        color: "#D65DB1",
                        fontWeight: 700,
                        fontSize: "12px",
                      }}
                      align="center"
                    >
                      ACTION
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {isSuccess &&
                    !isLoading &&
                    !isFetching &&
                    data?.value?.requestConcern?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "12px",
                            fontWeight: 500,
                          }}
                          align="center"
                          onClick={() => onViewHistoryAction(item)}
                        >
                          {item.requestConcernId}
                        </TableCell>

                        {(status === "Ongoing" || status === "For Confirmation" || status === "Done") && (
                          <TableCell
                            sx={{
                              color: "#EDF2F7",
                              fontSize: "12px",
                              fontWeight: 500,
                            }}
                            align="center"
                            onClick={() => onViewHistoryAction(item)}
                          >
                            {item.ticketRequestConcerns?.[0]?.ticketConcernId}
                          </TableCell>
                        )}

                        {/* <Tooltip title={item.concern} placement="bottom-start"> */}
                        <TableCell
                          // className="ellipsis-styling"
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "12px",
                            fontWeight: 500,
                            maxWidth: "500px",
                          }}
                          onClick={() => onViewHistoryAction(item)}
                        >
                          {item.concern.split("\r\n").map((line, index) => (
                            <span key={index}>
                              {line}
                              <br />
                            </span>
                          ))}
                        </TableCell>
                        {/* </Tooltip> */}

                        <TableCell
                          sx={{
                            fontSize: "14px",
                            fontWeight: 500,
                          }}
                          align="center"
                          onClick={() => onViewHistoryAction(item)}
                        >
                          <Chip
                            variant="filled"
                            size="30px"
                            icon={<CalendarMonthOutlined fontSize="small" color="primary" />}
                            sx={{
                              fontSize: "12px",
                              backgroundColor: "#1D1F3B",
                              color: theme.palette.primary.main,
                              fontWeight: 800,
                            }}
                            label={moment(item.created_At).format("LL")}
                          />
                        </TableCell>

                        <TableCell
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "14px",
                            fontWeight: 500,
                          }}
                          onClick={() => onViewHistoryAction(item)}
                        >
                          <Chip
                            variant="filled"
                            size="30px"
                            icon={
                              item.concern_Status === "For Approval" ? (
                                <FiberManualRecord fontSize="small" color="info" />
                              ) : item.concern_Status === "Ongoing" ? (
                                <FiberManualRecord fontSize="small" color="warning" />
                              ) : item.concern_Status === "For Confirmation" ? (
                                <FiberManualRecord
                                  fontSize="small"
                                  sx={{
                                    "&.MuiSvgIcon-root": {
                                      color: "#009688",
                                    },
                                  }}
                                />
                              ) : item?.ticketRequestConcerns?.[0]?.onHold ? (
                                <FiberManualRecord fontSize="small" color="warning" />
                              ) : (
                                <FiberManualRecord fontSize="small" color="success" />
                              )
                            }
                            sx={{
                              fontSize: "12px",
                              backgroundColor: theme.palette.bgForm.black1,
                              color: theme.palette.text.main,
                              fontWeight: 800,
                            }}
                            label={
                              item.concern_Status === "For Approval"
                                ? "Verification"
                                : item.concern_Status === "Ongoing" && item?.ticketRequestConcerns?.[0]?.onHold
                                ? "Ongoing/On Hold"
                                : item.concern_Status === "Ongoing"
                                ? "Ongoing"
                                : item.concern_Status === "For Confirmation"
                                ? "For Confirmation"
                                : item.concern_Status === "Done"
                                ? "Done"
                                : ""
                            }
                          />
                        </TableCell>

                        <TableCell
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "14px",
                            fontWeight: 500,
                          }}
                          align="center"
                        >
                          <ConcernActions data={item} onView={onViewConcernAction} onConfirm={onConfirmAction} onReturn={onReturnAction} onCancel={onCancelAction} />
                        </TableCell>
                      </TableRow>
                    ))}

                  {isError && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <img src={somethingWentWrong} alt="Something Went Wrong" className="something-went-wrong-table" />
                        <Typography variant="h5" color="#EDF2F7" marginLeft={2}>
                          Something went wrong.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}

                  {(isLoading || isFetching) && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <CircularProgress />
                        <Typography variant="h5" color="#EDF2F7">
                          Please wait...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}

                  {isSuccess && !data?.value?.requestConcern?.length && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <img src={noRecordsFound} alt="No Records Found" className="norecords-found-table" />
                        <Typography variant="h5" color="#EDF2F7" marginLeft={2}>
                          No records found.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              sx={{ color: "#A0AEC0", fontWeight: 400, background: "#1C2536", borderRadius: "0px 0px 20px 20px" }}
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={data?.value?.totalCount || 0}
              rowsPerPage={data?.value?.pageSize || 5}
              page={data?.value?.currentPage - 1 || 0}
              onPageChange={onPageNumberChange}
              onRowsPerPageChange={onPageSizeChange}
            />

            <ConcernDialog open={addConcernOpen} onClose={onDialogClose} />

            <ConcernViewDialog
              editData={editData}
              open={viewConcernOpen}
              onClose={() => {
                viewConcernOnClose(setEditData(null));
              }}
            />

            <ConcernHistory data={viewHistoryData} status={status} open={viewHistoryOpen} onClose={viewHistoryOnClose} />

            <ConcernReturn data={returnData} open={returnOpen} onClose={returnOnClose} />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ConcernTickets;
