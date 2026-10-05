import React, { useEffect, useState } from "react";
import {
  Badge,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
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
  useMediaQuery,
} from "@mui/material";
import {
  AddOutlined,
  CalendarMonthOutlined,
  Check,
  ChecklistRtlOutlined,
  ClearAllOutlined,
  FiberManualRecord,
  HowToRegOutlined,
  LocalOffer,
  PendingActionsOutlined,
  RotateRightOutlined,
  Search,
  Warning,
} from "@mui/icons-material";

import Swal from "sweetalert2";
import moment from "moment";
import noRecordsFound from "../../../assets/svg/noRecordsFound.svg";
import somethingWentWrong from "../../../assets/svg/SomethingWentWrong.svg";

import { theme } from "../../../theme/theme";
import { toast } from "sonner";
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";
import { reqConcernStyles as sx } from "./style/reqConcernStyles";
import useDebounce from "../../../hooks/useDebounce";
import useDisclosure from "../../../hooks/useDisclosure";

import ConcernActions from "./ConcernActions";
import ConcernDialog from "./ConcernDialog";
import ConcernViewDialog from "./ConcernViewDialog";
import ConcernReturn from "./ConcernReturn";
import ConcernHistory from "./ConcernHistory";
import ConcernTicketFiltering from "./ConcernTicketFiltering";

import { notificationMessageApi } from "../../../features/api_notification_message/notificationMessageApi";
import { notificationApi, useGetNotificationQuery } from "../../../features/api_notification/notificationApi";

import { setSearchValue, setStatus, setPageNumber, setPageSize } from "../../../features/global/rootSlice";
import { useCancelConcernMutation, useConfirmConcernMutation, useGetRequestorConcernsQuery } from "../../../features/api_request/concerns/concernApi";

const ConcernTickets = () => {
  const status = useSelector((state) => state.root.status);
  const ascending = useSelector((state) => state.root.ascending);
  const pageNumber = useSelector((state) => state.root.pageNumber);
  const pageSize = useSelector((state) => state.root.pageSize);

  const searchValue = useSelector((state) => state.root.searchValue);
  const search = useDebounce(searchValue, 500);

  const [editData, setEditData] = useState(null);
  const [viewHistoryData, setViewHistoryData] = useState(null);
  const [returnData, setReturnData] = useState(null);
  const [selectedTickets, setSelectedTickets] = useState([]);

  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);

  // useSignalRConnection();
  const dispatch = useDispatch();
  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));

  const { open: addConcernOpen, onToggle: addConcernOnToggle, onClose: addConcernOnClose } = useDisclosure();
  const { open: viewConcernOpen, onToggle: viewConcernOnToggle, onClose: viewConcernOnClose } = useDisclosure();
  const { open: viewHistoryOpen, onToggle: viewHistoryOnToggle, onClose: viewHistoryOnClose } = useDisclosure();
  const { open: returnOpen, onToggle: returnOnToggle, onClose: returnOnClose } = useDisclosure();

  const { data: notificationBadge } = useGetNotificationQuery();
  const { data, isLoading, isFetching, isSuccess, isError, refetch } = useGetRequestorConcernsQuery({
    Concern_Status: status,
    Search: search,
    Ascending: ascending,
    DateFrom: dateFrom || "",
    DateTo: dateTo || "",
    PageNumber: pageNumber,
    PageSize: pageSize,
  });

  const [confirmConcern, { isLoading: confirmConcernIsLoading, isFetching: confirmConcernIsFetching }] = useConfirmConcernMutation();
  const [cancelConcern] = useCancelConcernMutation();

  const onPageNumberChange = (_, page) => {
    dispatch(setPageNumber(page + 1));
  };

  const onPageSizeChange = (e) => {
    dispatch(setPageSize(e.target.value));
    dispatch(setPageNumber(1));
  };

  const onStatusChange = (_, newValue) => {
    dispatch(setStatus(newValue));
    dispatch(setPageNumber(1));
    dispatch(setPageSize(100));
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
      confirmTicketRequests: [
        {
          requestConcernId: data?.requestConcernId,
        },
      ],
    };

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
      allowOutsideClick: false,
      customClass: {
        container: "custom-container",
        title: "custom-title",
        htmlContainer: "custom-text",
        icon: "custom-icon",
        confirmButton: "mui-loading-btn",
        cancelButton: "custom-cancel-btn",
      },
      preConfirm: async () => {
        try {
          Swal.getConfirmButton().innerHTML = `
        <div class="mui-btn-content">
          <span class="mui-spinner"></span>
          <span class="mui-label">Confirming...</span>
        </div>
      `;
          Swal.getConfirmButton().disabled = true;
          await confirmConcern(payload)
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
          return true; // resolves success
        } catch (err) {
          console.log("Error", err);
          Swal.hideLoading();
          Swal.showValidationMessage(err?.data?.error?.message || "Something went wrong");
          return false; // keeps modal open
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.close();
      }
    });
  };

  const onSelectedConfirmAction = () => {
    const payload = {
      confirmTicketRequests: selectedTickets.map((item) => ({
        requestConcernId: item,
      })),
    };

    Swal.fire({
      title: "Confirmation",
      text: "Confirm this ticket?",
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
              description: "Confirm ticket successfully!",
              duration: 1500,
            });

            dispatch(notificationApi.util.resetApiState());
            dispatch(notificationMessageApi.util.resetApiState());
            setSelectedTickets([]);
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
      allowOutsideClick: false,
      customClass: {
        container: "custom-container",
        title: "custom-title",
        htmlContainer: "custom-text",
        icon: "custom-icon",
        confirmButton: "custom-confirm-btn",
        cancelButton: "custom-cancel-btn",
      },
      preConfirm: async () => {
        try {
          Swal.getConfirmButton().innerHTML = `
        <div class="mui-btn-content">
          <span class="mui-spinner"></span>
          <span class="mui-label">Processing...</span>
        </div>
      `;
          Swal.getConfirmButton().disabled = true;
          await cancelConcern(payload).unwrap();

          dispatch(notificationApi.util.resetApiState());
          toast.success("Success!", {
            description: "Cancelled request successfully!",
            duration: 1500,
          });

          return true; // resolves success
        } catch (err) {
          console.log("Error", err);
          Swal.hideLoading();
          Swal.showValidationMessage(err?.data?.error?.message || "Something went wrong");
          return false; // keeps modal open
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.close(); // close once API success
      }
    });
  };

  const onReturnAction = (data) => {
    returnOnToggle();
    setReturnData(data);
  };

  const onViewHistoryAction = (data) => {
    viewHistoryOnToggle();
    setViewHistoryData(data);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allTicketIds = data?.value?.requestConcern.map((item) => item.requestConcernId) || [];
      setSelectedTickets(allTicketIds);
    } else {
      setSelectedTickets([]);
    }
  };

  const handleSelectTicket = (item) => {
    setSelectedTickets((prevSelected) => (prevSelected.includes(item) ? prevSelected.filter((id) => id !== item) : [...prevSelected, item]));
  };

  useEffect(() => {
    if (status) {
      refetch();
    }
  }, [status]);

  useEffect(() => {
    if (searchValue) {
      dispatch(setPageNumber(1));
    }
  }, [searchValue]);

  // Clear selected tickets if not "For Closing Ticket"
  useEffect(() => {
    if (status !== "For Confirmation") {
      setSelectedTickets([]);
    }
  }, [status]);

  return (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: theme.palette.bgForm.black1,
        color: "#fff",
        padding: isScreenSmall ? "20px" : "24px 94px 34px 94px",
      }}
    >
      <Stack>
        <Stack width="100%" justifyContent="space-between" sx={{ flexDirection: isScreenSmall ? "column" : "row" }}>
          <Stack justifyItems="left">
            <Typography variant={isScreenSmall ? "h5" : "h4"}>Request Concerns</Typography>
          </Stack>

          <Stack justifyItems="space-between" direction="row" marginTop={1}>
            <LoadingButton
              size={isScreenSmall ? "medium" : "large"}
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

        {selectedTickets.length > 0 && (
          <Stack
            direction={isScreenSmall ? "column" : "row"}
            alignItems={isScreenSmall ? "left" : "center"}
            justifyContent="space-between"
            gap={0.5}
            sx={{
              padding: "10px 20px",
              backgroundColor: theme.palette.bgForm.black2,
              borderRadius: "20px",
              marginBottom: 0.5,
              marginTop: 0.5,
            }}
          >
            <Stack direction="row" gap={0.5}>
              <LocalOffer />
              <Typography>
                {selectedTickets.length} {""}
                {selectedTickets.length > 1 ? "Tickets selected" : "Ticket selected"}
              </Typography>
            </Stack>

            <Stack direction="row" gap={0.5}>
              <LoadingButton variant="contained" color="success" onClick={onSelectedConfirmAction} loading={confirmConcernIsLoading || confirmConcernIsFetching} startIcon={<Check />}>
                Confirm
              </LoadingButton>
            </Stack>
          </Stack>
        )}

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
              <Tabs
                value={status}
                variant="scrollable"
                scrollButtons="auto"
                onChange={onStatusChange}
                sx={{
                  ".MuiTab-root": {
                    minWidth: isScreenSmall ? "80px" : "120px",
                    fontSize: { xs: "10px", sm: "12px", md: "13px" },
                  },
                  ".MuiTabs-scrollButtons": {
                    color: "#fff",
                    "&.Mui-disabled": {
                      opacity: 0.3,
                    },
                  },
                }}
              >
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
                  label="Helpdesk Closed"
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

              <Stack direction="row" sx={{ alignItems: "center", justifyContent: "center", padding: 2 }}>
                <ConcernTicketFiltering setDateFrom={setDateFrom} setDateTo={setDateTo} />
              </Stack>
            </Stack>

            <Divider variant="fullWidth" sx={{ background: "#2D3748", marginTop: "1px" }} />

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ marginTop: "5px", padding: "15px" }} gap={4}>
              <OutlinedInput
                placeholder="Search Request no.: eg 00001"
                startAdornment={<Search sx={{ marginRight: 0.5, color: "#A0AEC0" }} />}
                value={searchValue}
                onChange={(e) => dispatch(setSearchValue(e.target.value))}
                sx={{
                  flex: 1,
                  borderRadius: "15px",
                  fontSize: "small",
                  fontWeight: 400,
                  lineHeight: "1.4375rem",
                }}
              />
            </Stack>

            {isScreenSmall ? (
              // Card
              <>
                {status === "For Confirmation" && (
                  <Stack direction="row" sx={{ width: "100%", mb: 2, justifyContent: "left", alignItems: "center", backgroundColor: "#2A2C4D" }}>
                    <Checkbox
                      indeterminate={selectedTickets.length > 0 && selectedTickets.length < (data?.value?.requestConcern?.length || 0)}
                      checked={(data?.value?.requestConcern?.length || 0) > 0 && selectedTickets.length === (data?.value?.requestConcern?.length || 0)}
                      onChange={handleSelectAll}
                      inputProps={{ "aria-label": "select all tickets" }}
                    />
                    <Typography>Select All</Typography>
                  </Stack>
                )}

                <Stack spacing={2}>
                  {isSuccess &&
                    !isLoading &&
                    !isFetching &&
                    data?.value?.requestConcern?.map((item, index) => (
                      <Card key={index} sx={sx.cards}>
                        <CardContent sx={sx.cardContent}>
                          <Stack spacing={1} direction="row" alignItems="center">
                            {status === "For Confirmation" && (
                              <Stack>
                                <Checkbox
                                  checked={selectedTickets.includes(item.requestConcernId)}
                                  onChange={() => handleSelectTicket(item.requestConcernId)}
                                  inputProps={{
                                    "aria-label": `select ticket ${item.requestConcernId}`,
                                  }}
                                />
                              </Stack>
                            )}

                            <Stack spacing={1}>
                              <Stack direction="row" gap={0.5} alignItems="center" onClick={() => onViewHistoryAction(item)}>
                                <Typography sx={sx.cardTitle}>TICKET NUMBER:</Typography>
                                <Typography sx={sx.cardDescription}>{`${moment(item.created_At).format("YYYY")}-${item.ticketRequestConcerns?.[0]?.ticketConcernId}`}</Typography>
                              </Stack>

                              <Stack direction="row" gap={0.5} alignItems="center" onClick={() => onViewHistoryAction(item)}>
                                <Typography sx={sx.cardTitle}>REQUEST DETAILS:</Typography>
                                <Typography sx={sx.cardDescription}>
                                  {item.concern.split("\r\n").map((line, index) => (
                                    <span key={index}>
                                      {line}
                                      <br />
                                    </span>
                                  ))}
                                </Typography>
                              </Stack>

                              <Stack direction="row" gap={0.5} alignItems="center" onClick={() => onViewHistoryAction(item)}>
                                <Typography sx={sx.cardTitle}>RESOLUTION:</Typography>
                                <Typography sx={sx.cardDescription}>
                                  {item.resolution
                                    ? item.resolution?.split("\r\n").map((line, index) => (
                                        <span key={index}>
                                          {line}
                                          <br />
                                        </span>
                                      ))
                                    : "--"}
                                </Typography>
                              </Stack>

                              <Stack direction="row" gap={0.5} alignItems="center" onClick={() => onViewHistoryAction(item)}>
                                <Typography sx={sx.cardTitle}>DATE CREATED:</Typography>
                                <Chip variant="filled" size="30px" icon={<CalendarMonthOutlined fontSize="small" color="primary" />} sx={sx.cardChip} label={moment(item.created_At).format("LL")} />
                              </Stack>

                              {item?.concern_Status === "" && (
                                <Stack direction="row" gap={0.5} alignItems="center" onClick={() => onViewHistoryAction(item)}>
                                  <Typography sx={sx.cardTitle}>STATUS:</Typography>
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
                                </Stack>
                              )}

                              <Stack direction="row" gap={0.5} alignItems="center">
                                <Typography sx={sx.cardTitle}>ACTION:</Typography>
                                <ConcernActions data={item} onView={onViewConcernAction} onConfirm={onConfirmAction} onReturn={onReturnAction} onCancel={onCancelAction} />
                              </Stack>
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
                    ))}

                  {isError && (
                    <Stack justifyContent="center" alignItems="center" padding={4}>
                      <img src={somethingWentWrong} alt="Something Went Wrong" className="something-went-wrong-table" />
                      <Typography variant="h6" color="error" align="center">
                        Something went wrong.
                      </Typography>
                    </Stack>
                  )}

                  {(isLoading || isFetching) && (
                    <Stack justifyContent="center" alignItems="center" padding={4}>
                      <CircularProgress />
                      <Typography variant="h5" color="#EDF2F7">
                        Please wait...
                      </Typography>
                    </Stack>
                  )}

                  {isSuccess && !data?.value?.requestConcern.length && !isLoading && !isFetching && (
                    <Stack justifyContent="center" alignItems="center" padding={4}>
                      <img src={noRecordsFound} alt="No Records Found" className="norecords-found-table" />
                      <Typography variant="h6" align="center">
                        No records found.
                      </Typography>
                    </Stack>
                  )}

                  <TablePagination
                    sx={{ color: "#A0AEC0", fontWeight: 400, background: "#1C2536", borderRadius: "0px 0px 20px 20px" }}
                    rowsPerPageOptions={[100, 300, 500]}
                    component="div"
                    count={data?.value?.totalCount || 0}
                    rowsPerPage={data?.value?.pageSize || 100}
                    page={data?.value?.currentPage - 1 || 0}
                    onPageChange={onPageNumberChange}
                    onRowsPerPageChange={onPageSizeChange}
                  />
                </Stack>
              </>
            ) : (
              <>
                {/* Table */}
                <TableContainer>
                  <Table size="small" stickyHeader sx={{ borderBottom: "none" }}>
                    <TableHead>
                      <TableRow>
                        {status === "For Confirmation" && (
                          <TableCell
                            padding="checkbox"
                            sx={{
                              background: "#1C2536",
                            }}
                            align="center"
                          >
                            <Checkbox
                              indeterminate={selectedTickets.length > 0 && selectedTickets.length < selectedTickets.length}
                              checked={selectedTickets.length > 0 && selectedTickets.length === selectedTickets.length}
                              onChange={handleSelectAll}
                              inputProps={{ "aria-label": "select all tickets" }}
                            />
                          </TableCell>
                        )}
                        <TableCell sx={sx.tableCellHeader}>TICKET NO.</TableCell>
                        <TableCell sx={sx.tableCellHeader}>REQUEST DETAILS</TableCell>
                        <TableCell sx={sx.tableCellHeader}>RESOLUTION</TableCell>
                        <TableCell sx={sx.tableCellHeader}>DATE CREATED</TableCell>
                        {status === "" && <TableCell sx={sx.tableCellHeader}>STATUS</TableCell>}
                        <TableCell sx={sx.tableCellHeader} align="center">
                          ACTION
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {isSuccess &&
                        !isLoading &&
                        !isFetching &&
                        data?.value?.requestConcern?.map((item, index) => {
                          const isSelected = selectedTickets.includes(item.requestConcernId);

                          return (
                            <React.Fragment key={index}>
                              <TableRow
                                key={index}
                                sx={{
                                  backgroundColor: isSelected ? "#1E2034" : theme.palette.bgForm.black3,
                                  "&:hover": {
                                    background: "",
                                    color: "#EDF2F7",
                                  },
                                }}
                              >
                                {status === "For Confirmation" && (
                                  <TableCell padding="checkbox" sx={sx.tableCellBody} align="center">
                                    <Checkbox
                                      checked={selectedTickets.includes(item.requestConcernId)}
                                      onChange={() => handleSelectTicket(item.requestConcernId)}
                                      inputProps={{
                                        "aria-label": `select ticket ${item.requestConcernId}`,
                                      }}
                                    />
                                  </TableCell>
                                )}

                                <TableCell sx={sx.tableCellBody} onClick={() => onViewHistoryAction(item)}>
                                  {`${moment(item.created_At).format("YYYY")}-${item.ticketRequestConcerns?.[0]?.ticketConcernId}`}
                                </TableCell>

                                <TableCell sx={sx.customTableCellBody} onClick={() => onViewHistoryAction(item)}>
                                  {item.concern?.split("\r\n").map((line, index) => (
                                    <span key={index}>
                                      {line}
                                      <br />
                                    </span>
                                  ))}
                                </TableCell>

                                <TableCell sx={sx.customTableCellBody} onClick={() => onViewHistoryAction(item)}>
                                  {item.resolution
                                    ? item.resolution?.split("\r\n").map((line, index) => (
                                        <span key={index}>
                                          {line}
                                          <br />
                                        </span>
                                      ))
                                    : "--"}
                                </TableCell>

                                <TableCell onClick={() => onViewHistoryAction(item)}>
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

                                {status === "" && (
                                  <TableCell onClick={() => onViewHistoryAction(item)}>
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
                                )}

                                <TableCell align="center">
                                  <ConcernActions data={item} onView={onViewConcernAction} onConfirm={onConfirmAction} onReturn={onReturnAction} onCancel={onCancelAction} />
                                </TableCell>
                              </TableRow>
                            </React.Fragment>
                          );
                        })}

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

                      {isSuccess && !data?.value?.requestConcern?.length && !isLoading && !isFetching && (
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
                  rowsPerPageOptions={[100, 300, 500]}
                  component="div"
                  count={data?.value?.totalCount || 0}
                  rowsPerPage={data?.value?.pageSize || 100}
                  page={data?.value?.currentPage - 1 || 0}
                  onPageChange={onPageNumberChange}
                  onRowsPerPageChange={onPageSizeChange}
                />

                {status === "For Confirmation" && (
                  <Stack alignItems="center" direction="row" gap={0.5} mt={1}>
                    <Warning color="warning" sx={{ fontSize: "16px" }} />
                    <Typography sx={{ fontSize: "14px", color: theme.palette.warning.main, fontStyle: "italic" }}>
                      Note: Concerns exceeding 24 hours without confirmation will be automatically closed
                    </Typography>
                  </Stack>
                )}
              </>
            )}

            {addConcernOpen && <ConcernDialog open={addConcernOpen} onClose={onDialogClose} />}
            {viewConcernOpen && (
              <ConcernViewDialog
                editData={editData}
                open={viewConcernOpen}
                onClose={() => {
                  viewConcernOnClose(setEditData(null));
                }}
              />
            )}
            {viewHistoryOpen && <ConcernHistory data={viewHistoryData} status={status} open={viewHistoryOpen} onClose={viewHistoryOnClose} />}
            {returnOpen && <ConcernReturn data={returnData} open={returnOpen} onClose={returnOnClose} />}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ConcernTickets;
