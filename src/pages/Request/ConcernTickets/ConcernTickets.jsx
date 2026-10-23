import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Card,
  CardContent,
  Checkbox,
  Chip,
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

import moment from "moment";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { theme } from "../../../theme/theme";
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";

import { global } from "../../../styles/global";
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
import { CardListSkeleton, NoRecordsFound, NoRecordsFoundTable, SomethingWentWrong, SomethingWentWrongTable, TableSkeleton } from "../../../components/TableState";

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

  const success = isSuccess && !isLoading && !isFetching;
  const no_records = isSuccess && !data?.value?.requestConcern.length && !isLoading && !isFetching;
  const loading = isLoading || isFetching;
  const error = isError;

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

  const tableColumns = [
    { type: "checkbox", hidden: status !== "For Confirmation" },
    { type: "text", width: 80 }, // Ticket no.
    { type: "multiline" }, // Request details
    { type: "text" }, // Resolution
    { type: "chip", width: 125 }, // Date created
    { type: "chip", hidden: status !== "" }, // Status
    { type: "circle" }, // Action
  ];

  return (
    <Stack sx={sx.mainContainer}>
      {/* Header */}
      <Stack sx={sx.header}>
        <Typography variant={isScreenSmall ? "h5" : "h4"}>Request Concerns</Typography>
        <LoadingButton size={isScreenSmall ? "medium" : "large"} variant="contained" color="primary" startIcon={<AddOutlined />} loading={isLoading || isFetching} onClick={addConcernOnToggle}>
          Add Request
        </LoadingButton>
      </Stack>

      {selectedTickets.length > 0 && (
        <Stack direction={isScreenSmall ? "column" : "row"} alignItems={isScreenSmall ? "left" : "center"} sx={sx.selectionBox}>
          <Stack direction="row" gap={0.5}>
            <LocalOffer />
            <Typography>
              {selectedTickets.length} {""}
              {selectedTickets.length > 1 ? "Tickets selected" : "Ticket selected"}
            </Typography>
          </Stack>

          <LoadingButton variant="contained" color="success" onClick={onSelectedConfirmAction} loading={confirmConcernIsLoading || confirmConcernIsFetching} startIcon={<Check />}>
            Confirm
          </LoadingButton>
        </Stack>
      )}

      <Stack sx={global.content}>
        {/* MAIN */}
        <Stack sx={global.tabSection}>
          <Stack sx={global.tabBox}>
            <Tabs value={status} variant="scrollable" scrollButtons="auto" onChange={onStatusChange} sx={global.tabs}>
              <Tab
                value=""
                className="tabs-styling"
                label="All Requests"
                icon={
                  <Badge badgeContent={notificationBadge?.value?.allRequestTicketNotif} max={100000} color="primary" anchorOrigin={global.anchorOrigin} sx={global.badge}>
                    <ClearAllOutlined />
                  </Badge>
                }
                iconPosition="start"
                sx={global.tab}
              />

              <Tab
                value="For Approval"
                className="tabs-styling"
                label="Verification"
                icon={
                  <Badge
                    badgeContent={notificationBadge?.value?.forTicketNotif}
                    max={100000}
                    anchorOrigin={global.anchorOrigin}
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
                sx={global.tab}
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
                    anchorOrigin={global.anchorOrigin}
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
                sx={global.tab}
              />

              <Tab
                value="For Confirmation"
                className="tabs-styling"
                label="For Confirmation"
                icon={
                  <Badge
                    badgeContent={notificationBadge?.value?.notConfirmNotif}
                    max={100000}
                    anchorOrigin={global.anchorOrigin}
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
                sx={global.tab}
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
                    anchorOrigin={global.anchorOrigin}
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
                sx={global.tab}
              />
            </Tabs>

            <Stack direction="row" sx={global.dateFilterBox}>
              <ConcernTicketFiltering setDateFrom={setDateFrom} setDateTo={setDateTo} />
            </Stack>
          </Stack>

          <Divider variant="fullWidth" sx={global.tabDivider} />

          <Stack sx={global.searchBox}>
            <OutlinedInput
              placeholder="Search"
              startAdornment={<Search sx={global.searchIcon} />}
              value={searchValue}
              onChange={(e) => dispatch(setSearchValue(e.target.value))}
              sx={global.outlinedSearch}
            />
          </Stack>

          {isScreenSmall ? (
            // Card
            <>
              {status === "For Confirmation" && (
                <Stack
                  direction="row"
                  sx={{
                    width: "100%",
                    mb: 2,
                    justifyContent: "left",
                    alignItems: "center",
                    backgroundColor: "#2A2C4D",
                  }}
                >
                  <Checkbox
                    indeterminate={selectedTickets.length > 0 && selectedTickets.length < (data?.value?.requestConcern?.length || 0)}
                    checked={(data?.value?.requestConcern?.length || 0) > 0 && selectedTickets.length === (data?.value?.requestConcern?.length || 0)}
                    onChange={handleSelectAll}
                    inputProps={{ "aria-label": "select all tickets" }}
                  />
                  <Typography>Select All</Typography>
                </Stack>
              )}

              <Stack spacing={2} sx={{ padding: 2 }}>
                {success &&
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

                          <Stack sx={{ width: "100%", spacing: 1 }}>
                            {/* Ticket Number */}
                            <Stack sx={global.cardRow} onClick={() => onViewHistoryAction(item)}>
                              <Box sx={global.cardDetailBox}>
                                <Typography sx={global.cardTitle}>TICKET NUMBER:</Typography>
                              </Box>
                              <Box sx={global.cardSpacer} />

                              <Box sx={global.cardDescDetailBox}>
                                <Typography sx={global.cardDescription}>{`${moment(item.created_At).format("YYYY")}-${item.ticketRequestConcerns?.[0]?.ticketConcernId}`}</Typography>
                              </Box>
                            </Stack>

                            {/* Request Details */}
                            <Stack sx={global.cardRow} onClick={() => onViewHistoryAction(item)}>
                              <Box sx={global.cardDetailBox}>
                                <Typography sx={global.cardTitle}>REQUEST DETAILS:</Typography>
                              </Box>
                              <Box sx={global.cardSpacer} />

                              <Box sx={global.cardDescDetailBox}>
                                <Typography sx={global.cardDescription}>
                                  {item.concern.split("\r\n").map((line, index) => (
                                    <span key={index}>
                                      {line}
                                      <br />
                                    </span>
                                  ))}
                                </Typography>
                              </Box>
                            </Stack>

                            {/* Resolution */}
                            <Stack sx={global.cardRow} onClick={() => onViewHistoryAction(item)}>
                              <Box sx={global.cardDetailBox}>
                                <Typography sx={global.cardTitle}>RESOLUTION:</Typography>
                              </Box>
                              <Box sx={global.cardSpacer} />

                              <Box sx={global.cardDescDetailBox}>
                                <Typography sx={global.cardDescription}>
                                  {item.resolution
                                    ? item.resolution?.split("\r\n").map((line, index) => (
                                        <span key={index}>
                                          {line}
                                          <br />
                                        </span>
                                      ))
                                    : "--"}
                                </Typography>
                              </Box>
                            </Stack>

                            {/* Date Created  */}
                            <Stack sx={global.cardRow} onClick={() => onViewHistoryAction(item)}>
                              <Box sx={global.cardDetailBox}>
                                <Typography sx={global.cardTitle}>DATE CREATED:</Typography>
                              </Box>
                              <Box sx={global.cardSpacer} />

                              <Box sx={global.cardDescDetailBox}>
                                <Chip
                                  variant="filled"
                                  size="30px"
                                  icon={<CalendarMonthOutlined fontSize="small" color="primary" />}
                                  sx={global.cardChip}
                                  label={moment(item.created_At).format("LL")}
                                />
                              </Box>
                            </Stack>

                            {/* Status */}
                            <Stack sx={global.cardRow} onClick={() => onViewHistoryAction(item)}>
                              <Box sx={global.cardDetailBox}>
                                <Typography sx={global.cardTitle}>STATUS:</Typography>
                              </Box>
                              <Box sx={global.cardSpacer} />

                              <Box sx={global.cardDescDetailBox}>
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
                                    ) : item.concern_Status === "Date Rejected" ? (
                                      <FiberManualRecord fontSize="small" color="error" />
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
                                              : item.concern_Status === "Date Rejected"
                                                ? "Date Rejected"
                                                : ""
                                  }
                                />
                              </Box>
                            </Stack>

                            {/* Actions */}
                            <Stack sx={global.cardRow} onClick={() => onViewHistoryAction(item)}>
                              <Box sx={global.cardDetailBox}>
                                <Typography sx={global.cardTitle}>ACTION:</Typography>
                              </Box>
                              <Box sx={global.cardSpacer} />

                              <Box sx={global.cardDescDetailBox}>
                                <ConcernActions data={item} onView={onViewConcernAction} onConfirm={onConfirmAction} onReturn={onReturnAction} onCancel={onCancelAction} />
                              </Box>
                            </Stack>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}

                {error && <SomethingWentWrong label="Something went wrong" />}
                {loading && <CardListSkeleton count={5} sx={sx.cards} />}
                {no_records && <NoRecordsFound label="No records found" />}

                <TablePagination
                  sx={global.tablePagination}
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
            // Table
            <>
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
                            inputProps={{
                              "aria-label": "select all tickets",
                            }}
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
                    {success &&
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
                                      ) : item.concern_Status === "Date Rejected" ? (
                                        <FiberManualRecord fontSize="small" color="error" />
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
                                                : item.concern_Status === "Date Rejected"
                                                  ? "Date Rejected"
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

                    {loading && <TableSkeleton columns={tableColumns} rows={10} cellSx={sx.tableCellBody} />}
                    {no_records && <NoRecordsFoundTable colSpan={7} label="No records found" />}
                    {isError && <SomethingWentWrongTable colSpan={7} label="Something went wrong." />}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                sx={{
                  color: "#A0AEC0",
                  fontWeight: 400,
                  background: "#1C2536",
                  borderRadius: "0px 0px 20px 20px",
                }}
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
                  <Typography
                    sx={{
                      fontSize: "14px",
                      color: theme.palette.warning.main,
                      fontStyle: "italic",
                    }}
                  >
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
              refetch={refetch}
            />
          )}
          {viewHistoryOpen && <ConcernHistory data={viewHistoryData} status={status} open={viewHistoryOpen} onClose={viewHistoryOnClose} />}
          {returnOpen && <ConcernReturn data={returnData} open={returnOpen} onClose={returnOnClose} />}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ConcernTickets;
