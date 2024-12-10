import {
  Badge,
  Box,
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
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  AccessTimeOutlined,
  CalendarMonthOutlined,
  DiscountOutlined,
  DoneAllOutlined,
  FiberManualRecord,
  HistoryToggleOffOutlined,
  MoveDownOutlined,
  PendingActionsOutlined,
  PendingOutlined,
  Search,
} from "@mui/icons-material";

import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import { theme } from "../../../theme/theme";

import useDebounce from "../../../hooks/useDebounce";
import useDisclosure from "../../../hooks/useDisclosure";

import noRecordsFound from "../../../assets/svg/noRecordsFound.svg";
import somethingWentWrong from "../../../assets/svg/SomethingWentWrong.svg";

import {
  useCancelClosingIssueHandlerTicketsMutation,
  useCancelTransferTicketMutation,
  useGetIssueHandlerConcernsQuery,
  useResumeIssueHandlerTicketsMutation,
} from "../../../features/api_ticketing/issue_handler/concernIssueHandlerApi";

import IssueViewDialog from "./IssueViewDialog";
import IssueHandlerConcernsActions from "./IssuHandlerConcernsActions";
import IssueHandlerClosingDialog from "./IssueHandlerClosingDialog";
import ManageTicketDialog from "./ManageTicketDialog";
import TicketFiltering from "./TicketFiltering";
import TicketForTransferDialog from "./TicketForTransferDialog";
import ManageTransferDialog from "./ManageTransferDialog";
import Swal from "sweetalert2";
import { toast, Toaster } from "sonner";

import { useSignalR } from "../../../context/SignalRContext";
import { useNotification } from "../../../context/NotificationContext";
import useSignalRConnection from "../../../hooks/useSignalRConnection";
import { useDispatch } from "react-redux";
import { notificationApi, useGetNotificationQuery } from "../../../features/api_notification/notificationApi";
import { ParameterContext } from "../../../context/ParameterContext";
import PrintServiceReport from "./PrintServiceReport";
import IssueHandlerHoldDialog from "./IssueHandlerHoldDialog";
import ManageOnHoldTicketDialog from "./ManageOnHoldTicketDialog";
import { notificationMessageApi } from "../../../features/api_notification_message/notificationMessageApi";
import ApproveTransferTicket from "./ApproveTransferTicket";
import RejectTransfer from "./RejectTransfer";

const IssueHandlerConcerns = () => {
  const theming = useTheme();
  const isMobile = useMediaQuery(theming.breakpoints.down("sm")); // For screens <= 600px
  const isTablet = useMediaQuery(theming.breakpoints.between("sm", "md"));

  const [ticketStatus, setTicketStatus] = useState("Open Ticket");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue, 500);

  const [filterStatus, setFilterStatus] = useState(null);
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);

  const [viewData, setViewData] = useState(null);
  const [holdTicketData, setHoldTicketData] = useState(null);
  const [closeTicketData, setCloseTicketData] = useState(null);
  const [transferTicketData, setTransferTicketData] = useState(null);
  const [printData, setPrintData] = useState(null);

  const { parameter } = useContext(ParameterContext);

  const [cancelTransferTicket] = useCancelTransferTicketMutation();
  const [resumeIssueHandlerTickets] = useResumeIssueHandlerTicketsMutation();
  const [cancelClosingTickets] = useCancelClosingIssueHandlerTicketsMutation();

  const { open: viewOpen, onToggle: viewOnToggle, onClose: viewOnClose } = useDisclosure();
  const { open: holdTicketOpen, onToggle: holdTicketOnToggle, onClose: holdTicketOnClose } = useDisclosure();
  const { open: manageHoldTicketOpen, onToggle: manageHoldTicketOnToggle, onClose: manageHoldTicketOnClose } = useDisclosure();
  const { open: closeTicketOpen, onToggle: closeTicketOnToggle, onClose: closeTicketOnClose } = useDisclosure();
  const { open: manageTicketOpen, onToggle: manageTicketOnToggle, onClose: manageTicketOnClose } = useDisclosure();
  const { open: transferTicketOpen, onToggle: transferTicketOnToggle, onClose: transferTicketOnClose } = useDisclosure();
  const { open: rejectTransferOpen, onToggle: rejectTransferOnToggle, onClose: rejectTransferOnClose } = useDisclosure();
  const { open: manageTransferOpen, onToggle: manageTransferOnToggle, onClose: manageTransferOnClose } = useDisclosure();
  const { open: approveTransferOpen, onToggle: approveTransferOnToggle, onClose: approveTransferOnClose } = useDisclosure();
  const { open: printTicketOpen, onToggle: printTicketOnToggle, onClose: printTicketOnClose } = useDisclosure();

  const dispatch = useDispatch();
  useSignalRConnection();

  const { data: notificationBadge } = useGetNotificationQuery();

  const { data, isLoading, isFetching, isSuccess, isError, refetch } = useGetIssueHandlerConcernsQuery({
    Concern_Status: ticketStatus,
    Search: search,
    History_Status: filterStatus || "",
    Date_From: dateFrom || "",
    Date_To: dateTo || "",
    PageNumber: pageNumber,
    PageSize: pageSize,
  });

  const onPageNumberChange = (_, page) => {
    setPageNumber(page + 1);
  };

  const onPageSizeChange = (e) => {
    setPageSize(e.target.value);
    setPageNumber(1);
  };

  const onStatusChange = (_, newValue) => {
    setTicketStatus(newValue);
    setPageNumber(1);
    setPageSize(5);
    refetch();
  };

  const onViewAction = (data) => {
    // console.log("data: ", data);

    viewOnToggle();
    setViewData(data);
  };

  const onHoldTicketAction = (data) => {
    holdTicketOnToggle();
    setHoldTicketData(data);
  };

  const onHoldManageTicketAction = (data) => {
    manageHoldTicketOnToggle();
    setHoldTicketData(data);
  };

  const onCloseTicketAction = (data) => {
    closeTicketOnToggle();
    setCloseTicketData(data);
  };

  const onManageTicketAction = (data) => {
    manageTicketOnToggle();
    setCloseTicketData(data);
  };

  const onTransferTicketAction = (data) => {
    transferTicketOnToggle();
    setTransferTicketData(data);
  };

  const onRejectTransferTicketAction = (data) => {
    rejectTransferOnToggle();
    setTransferTicketData(data);
  };

  const onManageTransferAction = (data) => {
    manageTransferOnToggle();
    setTransferTicketData(data);
  };

  const onApproveTransferAction = (data) => {
    approveTransferOnToggle();
    setTransferTicketData(data);
  };

  const onPrintTicketAction = (data) => {
    // console.log("Print Data: ", data);

    printTicketOnToggle();
    setPrintData(data);
  };

  const onResumeTicketAction = (data) => {
    const payload = {
      ticketOnHoldId: data?.getOnHolds?.[0]?.id,
    };

    Swal.fire({
      title: "Confirmation",
      text: `Requesting to resume this ticket number ${data?.ticketConcernId}?`,
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
        resumeIssueHandlerTickets(payload)
          .unwrap()
          .then(() => {
            toast.success("Success!", {
              description: "Ticket resumed successfully!",
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

  const onCancelTransferAction = (data) => {
    const payload = {
      transferTicketId: data?.getForTransferTickets?.[0]?.transferTicketConcernId,
    };

    Swal.fire({
      title: "Confirmation",
      text: `Cancel transfer ticket number ${data?.ticketConcernId}?`,
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
        cancelTransferTicket(payload)
          .unwrap()
          .then(() => {
            toast.success("Success!", {
              description: "Cancel request transfer successfully!",
              duration: 1500,
            });
            dispatch(notificationApi.util.resetApiState());
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

  const onCancelCloseAction = (data) => {
    const payload = {
      closingTicketId: data?.getForClosingTickets?.[0]?.closingTicketId,
    };

    console.log("payload: ", payload);
    Swal.fire({
      title: "Confirmation",
      text: `Cancel ticket number ${data?.ticketConcernId}?`,
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
        cancelClosingTickets(payload)
          .unwrap()
          .then(() => {
            toast.success("Success!", {
              description: "Cancel ticket successfully!",
              duration: 1500,
            });
            dispatch(notificationApi.util.resetApiState());
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

  const onDialogClose = () => {
    setCloseTicketData(null);
    setTransferTicketData(null);
    setPrintData(null);
    closeTicketOnClose();
    // manageTicketOnClose();
  };

  useEffect(() => {
    if (ticketStatus !== "") {
      setFilterStatus(null);
      setDateFrom(null);
      setDateTo(null);
    }
  }, [ticketStatus]);

  useEffect(() => {
    if (parameter) {
      setTicketStatus("");

      setTimeout(() => {
        setTicketStatus(parameter);
      }, 200);
    }
  }, [parameter]);

  return (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: theme.palette.bgForm.black1,
        color: "#fff",
        padding: isMobile ? "20px" : isTablet ? "30px 40px" : "44px 94px",
      }}
    >
      <Toaster richColors position="top-right" closeButton />
      <Stack>
        <Stack direction="row" justifyContent="space-between">
          <Stack justifyItems="left">
            <Typography variant="h4">Tickets</Typography>
          </Stack>
          <Stack justifyItems="space-between" direction="row"></Stack>
        </Stack>

        <Stack sx={{ borderRadius: "20px", marginTop: "10px", height: "730px" }}>
          <Stack direction="row" justifyContent="space-between" paddingLeft={1} paddingRight={1}>
            <Tabs
              value={ticketStatus}
              onChange={onStatusChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                ".MuiTab-root": {
                  minWidth: isMobile ? "80px" : "120px",
                  fontSize: { xs: "10px", sm: "12px", md: "14px" },
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
                value="Open Ticket"
                className="tabs-styling"
                label="Open"
                icon={
                  <Badge
                    badgeContent={notificationBadge?.value?.openTicketNotif}
                    max={100000}
                    color="warning"
                    anchorOrigin={{ vertical: "top", horizontal: "left" }}
                    sx={{
                      ".MuiBadge-badge": {
                        fontSize: "0.55rem",
                        fontWeight: 400,
                      },
                    }}
                  >
                    <DiscountOutlined />
                  </Badge>
                }
                iconPosition="start"
                sx={{
                  fontSize: "12px",
                  fontWeight: 600,
                  ".MuiBadge-badge": {
                    color: "#ffff",
                  },
                }}
              />

              <Tab
                value="For Transfer"
                className="tabs-styling"
                label="For Transfer"
                icon={
                  <Badge
                    badgeContent={notificationBadge?.value?.forTransferNotif}
                    max={100000}
                    anchorOrigin={{ vertical: "top", horizontal: "left" }}
                    sx={{
                      ".MuiBadge-badge": {
                        fontSize: "0.55rem",
                        fontWeight: 400,
                        background: "#ff7043",
                        color: "#ffff",
                      },
                    }}
                  >
                    <MoveDownOutlined />
                  </Badge>
                }
                iconPosition="start"
                sx={{
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              />

              <Tab
                value="For On-Hold"
                className="tabs-styling"
                label="Hold Approval"
                icon={
                  <Badge
                    badgeContent={notificationBadge?.value?.forOnHoldNotif}
                    max={100000}
                    anchorOrigin={{ vertical: "top", horizontal: "left" }}
                    sx={{
                      ".MuiBadge-badge": {
                        fontSize: "0.55rem",
                        fontWeight: 400,
                        background: "#ffb74d",
                        color: "#ffff",
                      },
                    }}
                  >
                    <MoveDownOutlined />
                  </Badge>
                }
                iconPosition="start"
                sx={{
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              />

              <Tab
                value="On-Hold"
                className="tabs-styling"
                label="On Hold"
                icon={
                  <Badge
                    badgeContent={notificationBadge?.value?.onHold}
                    max={100000}
                    anchorOrigin={{ vertical: "top", horizontal: "left" }}
                    sx={{
                      ".MuiBadge-badge": {
                        fontSize: "0.55rem",
                        fontWeight: 400,
                        background: "#ff6d00",
                        color: "#ffff",
                      },
                    }}
                  >
                    <PendingOutlined />
                  </Badge>
                }
                iconPosition="start"
                sx={{
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              />

              <Tab
                value="For Closing Ticket"
                className="tabs-styling"
                label="For Closing"
                icon={
                  <Badge
                    badgeContent={notificationBadge?.value?.forCloseNotif}
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
                value="For Confirmation"
                className="tabs-styling"
                label="For Confirmation"
                icon={
                  <Badge
                    badgeContent={notificationBadge?.value?.notConfirmCloseNotif}
                    max={100000}
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
                value="Closed"
                className="tabs-styling"
                label="Closed"
                icon={
                  <Badge
                    badgeContent={notificationBadge?.value?.closedNotif}
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
                    <DoneAllOutlined />
                  </Badge>
                }
                iconPosition="start"
                sx={{
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              />

              <Tab
                value=""
                className="tabs-styling"
                label="History"
                icon={
                  <Badge
                    badgeContent={notificationBadge?.value?.allTicketNotif}
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
                    <HistoryToggleOffOutlined />
                  </Badge>
                }
                iconPosition="start"
                sx={{
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              />
            </Tabs>

            <Stack direction="row" sx={{ alignItems: "center", justifyContent: "center" }}>
              {ticketStatus === "" && (
                <TicketFiltering
                  filterStatus={filterStatus}
                  setFilterStatus={setFilterStatus}
                  dateFrom={dateFrom}
                  setDateFrom={setDateFrom}
                  dateTo={dateTo}
                  setDateTo={setDateTo}
                />
              )}

              <OutlinedInput
                placeholder="Search"
                startAdornment={<Search sx={{ marginRight: 0.5, color: "#A0AEC0" }} />}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                sx={{
                  borderRadius: "15px",
                  fontSize: "small",
                  fontWeight: 400,
                  lineHeight: "1.4375rem",
                }}
              />
            </Stack>
          </Stack>

          <Divider
            variant="fullWidth"
            sx={{
              background: "#2D3748",
              marginBottom: 2,
              lineHeight: 1,
            }}
          />

          <TableContainer sx={{ minHeight: "589px", maxHeight: "589px" }}>
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
                    TICKET NO.
                  </TableCell>

                  <TableCell
                    sx={{
                      background: "#1C2536",
                      color: "#D65DB1",
                      fontWeight: 700,
                      fontSize: "12px",
                    }}
                  >
                    TICKET DESCRIPTION
                  </TableCell>

                  <TableCell
                    sx={{
                      background: "#1C2536",
                      color: "#D65DB1",
                      fontWeight: 700,
                      fontSize: "12px",
                    }}
                  >
                    <Stack direction="row" alignItems="center" gap={0.5}>
                      <AccessTimeOutlined sx={{ fontSize: "16px" }} />
                      TARGET DATE
                    </Stack>
                  </TableCell>

                  {(ticketStatus === "Closed" || ticketStatus === "") && (
                    <TableCell
                      sx={{
                        background: "#1C2536",
                        color: "#D65DB1",
                        fontWeight: 700,
                        fontSize: "12px",
                      }}
                    >
                      <Stack direction="row" alignItems="center" gap={0.5}>
                        <AccessTimeOutlined sx={{ fontSize: "16px" }} />
                        CLOSED DATE
                      </Stack>
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
                    REMARKS
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

                  {(ticketStatus === "Closed" || ticketStatus === "") && (
                    <TableCell
                      sx={{
                        background: "#1C2536",
                        color: "#D65DB1",
                        fontWeight: 700,
                        fontSize: "12px",
                      }}
                    >
                      CLOSING STATUS
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
                    ACTION
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {isSuccess &&
                  !isLoading &&
                  !isFetching &&
                  data?.value?.openTicket?.map((item) => (
                    <React.Fragment key={item.ticketConcernId}>
                      <TableRow
                        key={item.ticketConcernId}
                        sx={{
                          "&:hover": {
                            background: "",
                            color: "#EDF2F7",
                          },
                        }}
                      >
                        <TableCell
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "12px",
                            fontWeight: 500,
                            "&:hover": {
                              background: "",
                              color: "#EDF2F7",
                            },
                          }}
                          align="center"
                          onClick={() => onViewAction(item)}
                        >
                          {item.ticketConcernId}
                        </TableCell>

                        <TableCell
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "12px",
                            fontWeight: 500,
                            maxWidth: "400px",
                            "&:hover": {
                              background: "",
                              color: "#EDF2F7",
                            },
                          }}
                          onClick={() => onViewAction(item)}
                        >
                          {item.concern_Description?.split("\r\n").map((line, index) => (
                            <span key={index}>
                              {line}
                              <br />
                            </span>
                          ))}
                        </TableCell>

                        <TableCell
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "12px",
                            fontWeight: 500,
                            "&:hover": {
                              background: "",
                              color: "#EDF2F7",
                            },
                          }}
                          onClick={() => onViewAction(item)}
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
                            label={moment(item.target_Date).format("LL")}
                          />
                        </TableCell>

                        {(ticketStatus === "Closed" || ticketStatus === "") && (
                          <TableCell
                            sx={{
                              color: "#EDF2F7",
                              fontSize: "12px",
                              fontWeight: 500,
                            }}
                            onClick={() => onViewAction(item)}
                          >
                            <Chip
                              variant="filled"
                              size="30px"
                              icon={item?.closed_At !== null ? <CalendarMonthOutlined fontSize="small" color="primary" /> : ""}
                              label={item?.closed_At !== null ? moment(item?.closed_At).format("LL") : ""}
                              sx={{
                                fontSize: "12px",
                                backgroundColor: item?.closed_At !== null ? "#1D1F3B" : "transparent",
                                color: theme.palette.primary.main,
                                fontWeight: 800,
                              }}
                            />
                          </TableCell>
                        )}

                        <TableCell
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "12px",
                            fontWeight: 500,
                            maxWidth: "700px",
                          }}
                          onClick={() => onViewAction(item)}
                        >
                          <Box>
                            <Tooltip title={item.remarks} placement="bottom-start">
                              <Chip
                                variant="filled"
                                size="small"
                                label={item.remarks ? item.remarks : ""}
                                sx={{
                                  backgroundColor: item.remarks === null ? "transparent" : item.remarks === "Ticket Closed" ? "#00913c" : theme.palette.error.main,
                                  color: "#ffffff",
                                  borderRadius: "none",
                                  maxWidth: "300px",
                                  cursor: "pointer",
                                }}
                              />
                            </Tooltip>
                          </Box>
                        </TableCell>

                        <TableCell
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "12px",
                            fontWeight: 500,
                            "&:hover": {
                              background: ticketStatus === "Closed" && item?.closed_Status === "On-Time" ? "" : "",
                              color: "#EDF2F7",
                            },
                          }}
                          onClick={() => onViewAction(item)}
                        >
                          <Chip
                            variant="filled"
                            size="small"
                            label={
                              item.ticket_Status === "Open Ticket"
                                ? "Open"
                                : item.ticket_Status === "For Transfer"
                                ? "For Transfer"
                                : item.ticket_Status === "For On-Hold"
                                ? "Hold Approval"
                                : item.ticket_Status === "On-Hold"
                                ? "On-Hold"
                                : item.ticket_Status === "For Closing Ticket"
                                ? "For Closing"
                                : item.ticket_Status === "For Confirmation"
                                ? "For Confirmation"
                                : item.ticket_Status === "Closed"
                                ? "Closed"
                                : ""
                            }
                            sx={{
                              backgroundColor:
                                item.ticket_Status === "Open Ticket"
                                  ? "#ec9d29"
                                  : item.ticket_Status === "For Transfer"
                                  ? "#ff7043"
                                  : item.ticket_Status === "For On-Hold"
                                  ? "#ffb74d"
                                  : item.ticket_Status === "On-Hold"
                                  ? "#ff6d00"
                                  : item.ticket_Status === "For Closing Ticket"
                                  ? "#3A96FA"
                                  : item.ticket_Status === "For Confirmation"
                                  ? "#009688"
                                  : item.ticket_Status === "Closed"
                                  ? "#00913c"
                                  : "transparent",
                              color: "#ffffffde",
                              borderRadius: "20px",
                            }}
                          />
                        </TableCell>

                        {(ticketStatus === "Closed" || ticketStatus === "") && (
                          <TableCell
                            sx={{
                              color: "#EDF2F7",
                              fontSize: "14px",
                              fontWeight: 500,
                            }}
                          >
                            <Chip
                              variant="filled"
                              size="30px"
                              icon={
                                item?.closed_Status === "On-Time" ? (
                                  <FiberManualRecord fontSize="small" color="success" />
                                ) : item?.closed_Status === "Delay" ? (
                                  <FiberManualRecord fontSize="small" color="error" />
                                ) : (
                                  ""
                                )
                              }
                              sx={{
                                fontSize: "12px",
                                backgroundColor: item?.closed_Status === "On-Time" || item?.closed_Status === "Delay" ? theme.palette.bgForm.black1 : "transparent",
                                color: theme.palette.text.main,
                                fontWeight: 800,
                              }}
                              label={
                                item?.closed_Status === "On-Time" ? (
                                  <Typography sx={{ color: theme.palette.success.main, fontSize: "13px", fontWeight: 800 }}>On-Time</Typography>
                                ) : item?.closed_Status === "Delay" ? (
                                  <Typography sx={{ color: theme.palette.error.main, fontSize: "13px", fontWeight: 800 }}>Delayed</Typography>
                                ) : (
                                  <Typography sx={{ color: theme.palette.error.main, fontSize: "13px", fontWeight: 800 }}></Typography>
                                )
                              }
                            />
                          </TableCell>
                        )}

                        <TableCell
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "12px",
                            fontWeight: 500,
                            maxWidth: "700px",
                          }}
                        >
                          <IssueHandlerConcernsActions
                            data={item}
                            onHoldTicket={onHoldTicketAction}
                            onResumeTicket={onResumeTicketAction}
                            onHoldManageTicket={onHoldManageTicketAction}
                            onCloseTicket={onCloseTicketAction}
                            onCancelCloseTicket={onCancelCloseAction}
                            onManageTicket={onManageTicketAction}
                            onTransferTicket={onTransferTicketAction}
                            onRejectTransferTicket={onRejectTransferTicketAction}
                            onManageTransfer={onManageTransferAction}
                            onApproveTransfer={onApproveTransferAction}
                            onCancelTransfer={onCancelTransferAction}
                            onPrintTicket={onPrintTicketAction}
                          />
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}

                {isError && (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <img src={somethingWentWrong} alt="Something Went Wrong" className="something-went-wrong-table" />
                      <Typography variant="h5" color="#EDF2F7" marginLeft={2}>
                        Something went wrong.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}

                {isSuccess && !data?.value?.openTicket.length && (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
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
        </Stack>

        <IssueViewDialog data={viewData} ticketStatus={ticketStatus} viewOpen={viewOpen} viewOnClose={viewOnClose} />

        <IssueHandlerClosingDialog data={closeTicketData} open={closeTicketOpen} onClose={onDialogClose} />

        <ManageTicketDialog
          data={closeTicketData}
          open={manageTicketOpen}
          onClose={() => {
            manageTicketOnClose(setCloseTicketData(null));
          }}
        />

        <TicketForTransferDialog
          data={transferTicketData}
          open={transferTicketOpen}
          onClose={() => {
            transferTicketOnClose(setTransferTicketData(null));
          }}
        />

        <ManageTransferDialog
          data={transferTicketData}
          open={manageTransferOpen}
          onClose={() => {
            manageTransferOnClose(setTransferTicketData(null));
          }}
        />

        <ApproveTransferTicket
          data={transferTicketData}
          open={approveTransferOpen}
          onClose={() => {
            approveTransferOnClose(setTransferTicketData(null));
          }}
        />

        <RejectTransfer data={transferTicketData} open={rejectTransferOpen} onClose={rejectTransferOnClose} />

        <IssueHandlerHoldDialog
          data={holdTicketData}
          open={holdTicketOpen}
          onClose={() => {
            holdTicketOnClose(setHoldTicketData(null));
          }}
        />

        <ManageOnHoldTicketDialog
          data={holdTicketData}
          open={manageHoldTicketOpen}
          onClose={() => {
            manageHoldTicketOnClose(setHoldTicketData(null));
          }}
        />

        <PrintServiceReport
          data={printData}
          open={printTicketOpen}
          onClose={() => {
            printTicketOnClose(setPrintData(null));
          }}
        />
      </Stack>
    </Stack>
  );
};

export default IssueHandlerConcerns;

// OLD CODES
// import {
//   Badge,
//   Box,
//   Button,
//   Chip,
//   CircularProgress,
//   Collapse,
//   Divider,
//   IconButton,
//   OutlinedInput,
//   Stack,
//   Tab,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TablePagination,
//   TableRow,
//   Tabs,
//   TextField,
//   Typography,
// } from "@mui/material";
// import { AccessTimeOutlined, AddOutlined, ConfirmationNumberOutlined, KeyboardArrowDown, KeyboardArrowUp, Search } from "@mui/icons-material";

// import React, { useEffect, useState } from "react";
// import moment from "moment";
// import Swal from "sweetalert2";
// import { theme } from "../../../theme/theme";
// import { Toaster, toast } from "sonner";

// import { Controller, useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";

// import useDebounce from "../../../hooks/useDebounce";
// import useDisclosure from "../../../hooks/useDisclosure";

// import { useGetIssueHandlerConcernsQuery } from "../../../features/api_ticketing/issue_handler/concernIssueHandlerApi";

// import IssueViewDialog from "./IssueViewDialog";

// const schema = yup.object().shape({
//   ticketDescription: yup.string().required("Description is required"),
//   startDate: yup.date().required("Start date is required"),
//   targetDate: yup.date().required().label("Target date is required"),
// });

// const IssueHandlerConcerns = () => {
//   const [status, setStatus] = useState("true");
//   const [pageNumber, setPageNumber] = useState(1);
//   const [pageSize, setPageSize] = useState(5);

//   const [searchValue, setSearchValue] = useState("");
//   const search = useDebounce(searchValue, 500);

//   const [viewData, setViewData] = useState(null);

//   const { open: viewOpen, onToggle: viewOnToggle, onClose: viewOnClose } = useDisclosure();

//   const { data, isLoading, isFetching, isSuccess, isError } = useGetIssueHandlerConcernsQuery({
//     Search: search,
//     PageNumber: pageNumber,
//     PageSize: pageSize,
//   });

//   const dummyData = {
//     concerns: [
//       {
//         concernId: 1001,
//         description:
//           "This is my concern This is my concern This is my concern This is my concern This is my concern This is my concern  This is my concern This is my concern This is my concern This is my concern This is my concern",
//         requestorName: "GUMAPOS, RODRIGO JR. SINDAY",
//         department: "Engineering and Technical",
//         tickets: [
//           {
//             ticketNo: 1,
//             ticketDescription: "Elixir ETD - MRP Adjustments",
//             startDate: "2024-11-11",
//             targetDate: "2024-11-11",
//             dateClose: "2024-11-11",
//             remarks: "Delayed",
//             status: "Closed",
//           },
//           {
//             ticketNo: 2,
//             ticketDescription: "Elixir ETD - Move Order Adjustments",
//             startDate: "2024-11-11",
//             targetDate: "2024-11-11",
//             dateClose: "2024-11-11",
//             remarks: "On-Time",
//             status: "Closed",
//           },
//           {
//             ticketNo: 3,
//             ticketDescription: "Elixir ETD - Warehouse Receiving Adjustments",
//             startDate: "2024-11-11",
//             targetDate: "2024-11-11",
//             dateClose: "2024-11-11",
//             remarks: "Delayed",
//             status: "Closed",
//           },
//         ],
//       },
//       {
//         concernId: 1002,
//         description: "Concern 2",
//         requestorName: "GUMAPOS, RODRIGO JR. SINDAY",
//         department: "Engineering and Technical",
//         tickets: [
//           {
//             ticketNo: 3,
//             ticketDescription: "Elixir ETD - Reports Adjustments",
//             startDate: "2024-11-11",
//             targetDate: "2024-11-11",
//             dateClose: "2024-11-11",
//             remarks: "Delayed",
//             status: "Closed",
//           },
//           {
//             ticketNo: 4,
//             ticketDescription: "Elixir ETD - Borrowed Transaction Adjustments",
//             startDate: "2024-11-11",
//             targetDate: "2024-11-11",
//             dateClose: "2024-11-11",
//             remarks: "",
//             status: "Open",
//           },
//           {
//             ticketNo: 5,
//             ticketDescription: "Elixir ETD - Ordering Adjustments",
//             startDate: "2024-11-11",
//             targetDate: "2024-11-11",
//             dateClose: "2024-11-11",
//             remarks: "On-Time",
//             status: "Closed",
//           },
//         ],
//       },
//     ],
//   };

//   const [openCollapse, setOpenCollapse] = useState({});
//   const [addTicketForm, setAddTicketForm] = useState({});

//   const {
//     control,
//     handleSubmit,
//     reset,
//     watch,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(schema),
//     defaultValues: {
//       ticketDescription: "",
//       startDate: "",
//       targetDate: "",
//     },
//   });

//   const onPageNumberChange = (_, page) => {
//     setPageNumber(page + 1);
//   };

//   const onPageSizeChange = (e) => {
//     setPageSize(e.target.value);
//     setPageNumber(1);
//   };

//   const onStatusChange = (_, newValue) => {
//     setStatus(newValue);
//     setPageNumber(1);
//     setPageSize(5);
//   };

//   const handleCollapseToggle = (requestTransactionId) => {
//     setOpenCollapse((prev) => ({
//       ...prev,
//       [requestTransactionId]: !prev[requestTransactionId],
//     }));
//   };

//   const handleAddTicketToggle = (requestTransactionId) => {
//     setAddTicketForm((prev) => ({
//       ...prev,
//       [requestTransactionId]: !prev[requestTransactionId],
//     }));
//     reset();
//   };

//   const onViewAction = (data) => {
//     console.log("data: ", data);

//     viewOnToggle();
//     setViewData(data);
//     // setOpenCollapse(!openCollapse);
//   };

//   const onSubmit = (formData) => {
//     console.log("Form Data: ", formData);
//     // Handle save logic
//     reset();
//   };

//   return (
//     <Stack
//       sx={{
//         width: "100%",
//         height: "100%",
//         display: "flex",
//         backgroundColor: theme.palette.bgForm.black1,
//         color: "#fff",
//         padding: "44px",
//       }}
//     >
//       <Stack>
//         <Stack direction="row" justifyContent="space-between">
//           <Stack justifyItems="left">
//             <Typography variant="h4">Concerns</Typography>
//           </Stack>
//           <Stack justifyItems="space-between" direction="row"></Stack>
//         </Stack>

//         <Stack
//           sx={{
//             backgroundColor: theme.palette.bgForm.black3,
//             borderRadius: "20px",
//             marginTop: "20px",
//             height: "75vh",
//           }}
//         >
//           <Stack direction="row" justifyContent="space-between" padding={3}>
//             <Typography sx={{ fontWeight: "500", fontSize: "18px" }}> List of Concerns</Typography>
//           </Stack>

//           <Divider
//             variant="fullWidth"
//             sx={{
//               background: "#2D3748",
//               marginTop: "1px",
//               marginBottom: 3,
//               lineHeight: 1,
//             }}
//           />

//           <TableContainer>
//             <Table sx={{ borderBottom: "none" }}>
//               <TableHead>
//                 <TableRow>
//                   <TableCell
//                     sx={{
//                       background: "#1C2536",
//                       color: "#D65DB1",
//                       fontWeight: 700,
//                       fontSize: "12px",
//                     }}
//                     align="center"
//                   ></TableCell>
//                   <TableCell
//                     sx={{
//                       background: "#1C2536",
//                       color: "#D65DB1",
//                       fontWeight: 700,
//                       fontSize: "12px",
//                     }}
//                     align="center"
//                   >
//                     CONCERN NO.
//                   </TableCell>

//                   <TableCell
//                     sx={{
//                       background: "#1C2536",
//                       color: "#D65DB1",
//                       fontWeight: 700,
//                       fontSize: "12px",
//                     }}
//                   >
//                     DESCRIPTION
//                   </TableCell>

//                   <TableCell
//                     sx={{
//                       background: "#1C2536",
//                       color: "#D65DB1",
//                       fontWeight: 700,
//                       fontSize: "12px",
//                     }}
//                   >
//                     REQUESTOR
//                   </TableCell>
//                 </TableRow>
//               </TableHead>

//               <TableBody>
//                 {isSuccess &&
//                   !isLoading &&
//                   !isFetching &&
//                   data?.value?.closingTicket?.map((item) => (
//                     <React.Fragment key={item.requestTransactionId}>
//                       <TableRow key={item.requestTransactionId}>
//                         <TableCell
//                           sx={{
//                             color: "#EDF2F7",
//                             fontSize: "14px",
//                             fontWeight: 500,
//                           }}
//                           align="center"
//                         >
//                           <IconButton size="small" onClick={() => handleCollapseToggle(item.requestTransactionId)}>
//                             {openCollapse[item.requestTransactionId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
//                           </IconButton>
//                         </TableCell>

//                         <TableCell
//                           sx={{
//                             color: "#EDF2F7",
//                             fontSize: "14px",
//                             fontWeight: 500,
//                           }}
//                           align="center"
//                           onClick={() => onViewAction(item)}
//                         >
//                           {item.requestTransactionId}
//                         </TableCell>

//                         <TableCell
//                           // className="ellipsis-styling"
//                           sx={{
//                             color: "#EDF2F7",
//                             fontSize: "14px",
//                             fontWeight: 500,
//                             maxWidth: "700px",
//                           }}
//                           onClick={() => onViewAction(item)}
//                         >
//                           {item.description}
//                         </TableCell>

//                         <TableCell
//                           sx={{
//                             color: "#EDF2F7",
//                             fontSize: "14px",
//                             fontWeight: 500,
//                           }}
//                           onClick={() => onViewAction(item)}
//                         >
//                           <Typography
//                             sx={{
//                               color: theme.palette.text.secondary,
//                               fontSize: "12px",
//                               fontWeight: 500,
//                             }}
//                           >
//                             {item.empId}
//                           </Typography>

//                           <Typography
//                             sx={{
//                               color: "#EDF2F7",
//                               fontSize: "14px",
//                               fontWeight: 500,
//                             }}
//                           >
//                             {item.requestor_Name}
//                           </Typography>

//                           <Typography
//                             sx={{
//                               color: theme.palette.text.secondary,
//                               fontSize: "12px",
//                               fontWeight: 500,
//                             }}
//                           >
//                             {item.departmentId} - {item.department_Name}
//                           </Typography>
//                         </TableCell>
//                       </TableRow>

//                       <TableRow>
//                         <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
//                           <Collapse in={openCollapse[item.requestTransactionId]} timeout="auto" unmountOnExit>
//                             <Box sx={{ margin: 1 }}>
//                               <Typography
//                                 component="div"
//                                 sx={{
//                                   color: theme.palette.text.main,
//                                   fontSize: "17px",
//                                   fontWeight: 600,
//                                 }}
//                               >
//                                 <Stack direction="row" gap={1} alignItems="center">
//                                   {/* <Badge
//                                     badgeContent={item.openTicketCount}
//                                     color="primary"
//                                   >
//                                     <ConfirmationNumberOutlined />
//                                   </Badge> */}
//                                   TICKETS
//                                 </Stack>
//                               </Typography>
//                               <Table size="small">
//                                 <TableHead>
//                                   <TableRow>
//                                     <TableCell
//                                       sx={{
//                                         background: "#1C2536",
//                                         color: "#EDF2F7",
//                                         fontSize: "12px",
//                                         fontWeight: 500,
//                                       }}
//                                       align="center"
//                                     >
//                                       TICKET NO.
//                                     </TableCell>

//                                     <TableCell
//                                       sx={{
//                                         background: "#1C2536",
//                                         color: "#EDF2F7",
//                                         fontSize: "12px",
//                                         fontWeight: 500,
//                                       }}
//                                     >
//                                       TICKET DESCRIPTION
//                                     </TableCell>

//                                     <TableCell
//                                       sx={{
//                                         background: "#1C2536",
//                                         color: "#EDF2F7",
//                                         fontSize: "12px",
//                                         fontWeight: 500,
//                                       }}
//                                     >
//                                       <Stack direction="row" alignItems="center" gap={0.5}>
//                                         <AccessTimeOutlined sx={{ fontSize: "16px" }} />
//                                         START DATE
//                                       </Stack>
//                                     </TableCell>

//                                     <TableCell
//                                       sx={{
//                                         background: "#1C2536",
//                                         color: "#EDF2F7",
//                                         fontSize: "12px",
//                                         fontWeight: 500,
//                                       }}
//                                     >
//                                       <Stack direction="row" alignItems="center" gap={0.5}>
//                                         <AccessTimeOutlined sx={{ fontSize: "16px" }} />
//                                         TARGET DATE
//                                       </Stack>
//                                     </TableCell>

//                                     {/* <TableCell
//                                       sx={{
//                                         background: "#1C2536",
//                                         color: "#EDF2F7",
//                                         fontSize: "12px",
//                                         fontWeight: 500,
//                                       }}
//                                     >
//                                       <Stack
//                                         direction="row"
//                                         alignItems="center"
//                                         gap={0.5}
//                                       >
//                                         <AccessTimeOutlined
//                                           sx={{ fontSize: "16px" }}
//                                         />
//                                         CLOSE DATE
//                                       </Stack>
//                                     </TableCell> */}

//                                     <TableCell
//                                       sx={{
//                                         background: "#1C2536",
//                                         color: "#EDF2F7",
//                                         fontSize: "12px",
//                                         fontWeight: 500,
//                                       }}
//                                     >
//                                       REMARKS
//                                     </TableCell>

//                                     <TableCell
//                                       sx={{
//                                         background: "#1C2536",
//                                         color: "#EDF2F7",
//                                         fontSize: "12px",
//                                         fontWeight: 500,
//                                       }}
//                                     >
//                                       STATUS
//                                     </TableCell>
//                                   </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                   {item?.openTickets?.map((subItem) => (
//                                     <TableRow key={subItem.ticketConcernId}>
//                                       <TableCell
//                                         sx={{
//                                           color: theme.palette.text.secondary,
//                                           fontSize: "14px",
//                                           fontWeight: 500,
//                                           maxWidth: "700px",
//                                         }}
//                                         align="center"
//                                       >
//                                         {subItem.ticketConcernId}
//                                       </TableCell>

//                                       <TableCell
//                                         sx={{
//                                           color: theme.palette.text.secondary,
//                                           fontSize: "14px",
//                                           fontWeight: 500,
//                                           maxWidth: "700px",
//                                         }}
//                                       >
//                                         {subItem.concern_Description}
//                                       </TableCell>

//                                       <TableCell
//                                         sx={{
//                                           color: theme.palette.text.secondary,
//                                           fontSize: "14px",
//                                           fontWeight: 500,
//                                           maxWidth: "700px",
//                                         }}
//                                       >
//                                         {moment(subItem.start_Date).format("YYYY-MM-DD")}
//                                       </TableCell>

//                                       <TableCell
//                                         sx={{
//                                           color: theme.palette.text.secondary,
//                                           fontSize: "14px",
//                                           fontWeight: 500,
//                                           maxWidth: "700px",
//                                         }}
//                                       >
//                                         {moment(subItem.target_Date).format("YYYY-MM-DD")}
//                                       </TableCell>

//                                       {/* <TableCell
//                                         sx={{
//                                           color: theme.palette.text.secondary,
//                                           fontSize: "14px",
//                                           fontWeight: 500,
//                                           maxWidth: "700px",
//                                         }}
//                                       >
//                                         {subItem.dateClose}
//                                       </TableCell> */}

//                                       <TableCell
//                                         sx={{
//                                           color: theme.palette.text.secondary,
//                                           fontSize: "14px",
//                                           fontWeight: 500,
//                                           maxWidth: "700px",
//                                         }}
//                                       >
//                                         <Chip
//                                           variant="filled"
//                                           size="small"
//                                           label={subItem.remarks === "On-Time" ? "On-Time" : subItem.remarks === "Delayed" ? "Delayed" : ""}
//                                           sx={{
//                                             backgroundColor: subItem.remarks === "On-Time" ? "#00913c" : subItem.remarks === "Delayed" ? "#a32421" : "transparent",
//                                             color: "#ffffffde",
//                                             borderRadius: "none",
//                                           }}
//                                         />
//                                       </TableCell>

//                                       <TableCell
//                                         sx={{
//                                           color: theme.palette.text.secondary,
//                                           fontSize: "14px",
//                                           fontWeight: 500,
//                                           maxWidth: "700px",
//                                         }}
//                                       >
//                                         <Chip
//                                           variant="filled"
//                                           size="small"
//                                           label={subItem.ticket_Status === "Open Ticket" ? "Open" : "Pending"}
//                                           sx={{
//                                             backgroundColor: subItem.ticket_Status === "Open Ticket" ? "#00913c" : "#ec9d29",
//                                             color: "#ffffffde",
//                                             borderRadius: "none",
//                                           }}
//                                         />
//                                       </TableCell>
//                                     </TableRow>
//                                   ))}
//                                 </TableBody>
//                               </Table>

//                               <Stack sx={{ alignItems: "end", marginTop: 2 }}>
//                                 {/* <Stack /> */}
//                                 <Button variant="contained" color="primary" onClick={() => handleAddTicketToggle(item.requestTransactionId)}>
//                                   {addTicketForm[item.requestTransactionId] ? "Cancel" : "Add Ticket"}
//                                 </Button>
//                               </Stack>

//                               {addTicketForm[item.requestTransactionId] && (
//                                 <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
//                                   <Controller
//                                     name="ticketDescription"
//                                     control={control}
//                                     render={({ field: { ref, value, onChange } }) => {
//                                       return (
//                                         <TextField
//                                           inputRef={ref}
//                                           size="small"
//                                           value={value}
//                                           label="Ticket Description"
//                                           onChange={onChange}
//                                           autoComplete="off"
//                                           fullWidth
//                                           sx={{ mb: 2 }}
//                                         />
//                                       );
//                                     }}
//                                   />
//                                   {/*
//                                   <Controller
//                                     control={control}
//                                     name=""
//                                     render={({ field: { ref, value, onChange } }) => {
//                                       return (
//                                         <TextField
//                                           inputRef={ref}
//                                           size="medium"
//                                           value={value}
//                                           placeholder="Ex. System Name - Concern"
//                                           onChange={onChange}
//                                           sx={{
//                                             width: "80%",
//                                           }}
//                                           autoComplete="off"
//                                           rows={6}
//                                           multiline
//                                         />
//                                       );
//                                     }}
//                                   /> */}

//                                   <Stack direction="row" gap={1}>
//                                     <Controller
//                                       name="startDate"
//                                       control={control}
//                                       render={({ field }) => (
//                                         <TextField
//                                           {...field}
//                                           type="date"
//                                           size="small"
//                                           label="Start Date"
//                                           fullWidth
//                                           InputLabelProps={{ shrink: true }}
//                                           error={!!errors.startDate}
//                                           helperText={errors.startDate?.message}
//                                           sx={{ mb: 2 }}
//                                         />
//                                       )}
//                                     />

//                                     <Controller
//                                       name="targetDate"
//                                       control={control}
//                                       render={({ field }) => (
//                                         <TextField
//                                           {...field}
//                                           type="date"
//                                           size="small"
//                                           label="Target Date"
//                                           fullWidth
//                                           InputLabelProps={{ shrink: true }}
//                                           error={!!errors.targetDate}
//                                           helperText={errors.targetDate?.message}
//                                           sx={{ mb: 2 }}
//                                         />
//                                       )}
//                                     />
//                                   </Stack>

//                                   <Stack sx={{ alignItems: "end" }}>
//                                     <Button type="submit" variant="contained" color="primary" disabled={!watch("ticketDescription")}>
//                                       Save
//                                     </Button>
//                                   </Stack>
//                                 </Box>
//                               )}
//                             </Box>
//                           </Collapse>
//                         </TableCell>
//                       </TableRow>
//                     </React.Fragment>
//                   ))}
//               </TableBody>
//             </Table>
//           </TableContainer>

//           <TablePagination
//             sx={{ color: "#A0AEC0", fontWeight: 400 }}
//             rowsPerPageOptions={[5, 10, 25]}
//             component="div"
//             count={data?.value?.totalCount || 0}
//             rowsPerPage={data?.value?.pageSize || 5}
//             page={data?.value?.currentPage - 1 || 0}
//             onPageChange={onPageNumberChange}
//             onRowsPerPageChange={onPageSizeChange}
//           />
//         </Stack>

//         <IssueViewDialog data={viewData} viewOpen={viewOpen} viewOnClose={viewOnClose} />
//       </Stack>
//     </Stack>
//   );
// };

// export default IssueHandlerConcerns;
