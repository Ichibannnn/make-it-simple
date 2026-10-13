import {
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
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
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  ArrowDownwardRounded,
  ArrowUpwardRounded,
  CalendarMonthOutlined,
  Check,
  DiscountOutlined,
  DoneAllOutlined,
  FiberManualRecord,
  HistoryToggleOffOutlined,
  LocalOffer,
  MoveDownOutlined,
  PendingActionsOutlined,
  PendingOutlined,
  Search,
  ThumbDownOffAlt,
} from "@mui/icons-material";
import React, { useEffect, useMemo, useState } from "react";

import useDebounce from "../../../hooks/useDebounce";
import useDisclosure from "../../../hooks/useDisclosure";
import noRecordsFound from "../../../assets/svg/noRecordsFound.svg";
import somethingWentWrong from "../../../assets/svg/SomethingWentWrong.svg";

import moment from "moment";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { theme } from "../../../theme/theme";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";
import { ticketStyle as sx } from "./style/ticketStyle";

import {
  useCancelClosingIssueHandlerTicketsMutation,
  useCancelTransferTicketMutation,
  useGetIssueHandlerConcernsQuery,
  useResumeIssueHandlerTicketsMutation,
} from "../../../features/api_ticketing/issue_handler/concernIssueHandlerApi";
import { notificationApi, useGetNotificationQuery } from "../../../features/api_notification/notificationApi";
import { notificationMessageApi } from "../../../features/api_notification_message/notificationMessageApi";
import { setAscending, setPageNumber, setPageSize, setSearchValue } from "../../../features/global/rootSlice";
import { useConfirmConcernMutation } from "../../../features/api_request/concerns/concernApi";

import IssueViewDialog from "./IssueViewDialog";
import IssueHandlerConcernsActions from "./IssuHandlerConcernsActions";
import IssueHandlerClosingDialog from "./IssueHandlerClosingDialog";
import ManageTicketDialog from "./ManageTicketDialog";
import TicketFiltering from "./TicketFiltering";
import TicketForTransferDialog from "./TicketForTransferDialog";
import ManageTransferDialog from "./ManageTransferDialog";
import PrintServiceReport from "./PrintServiceReport";
import IssueHandlerHoldDialog from "./IssueHandlerHoldDialog";
import ManageOnHoldTicketDialog from "./ManageOnHoldTicketDialog";
import ApproveTransferTicket from "./ApproveTransferTicket";
import AddTicketDialog from "./AddTicketDialog";
import RejectTransfer from "./RejectTransfer";
import RejectDateDialog from "./RejectDateDialog";

import srReport from "../../../pdf/MIS_SRFinal_v2.pdf";
import { PDFDocument } from "pdf-lib";

const IssueHandlerConcerns = () => {
  const theming = useTheme();
  const isMobile = useMediaQuery(theming.breakpoints.down("sm"));
  const ascending = useSelector((state) => state.root.ascending);
  const pageNumber = useSelector((state) => state.root.pageNumber);
  const pageSize = useSelector((state) => state.root.pageSize);
  const searchValue = useSelector((state) => state.root.searchValue);
  const search = useDebounce(searchValue, 500);

  const [ticketStatus, setTicketStatus] = useState("For Approval");
  const [filterStatus, setFilterStatus] = useState(null);
  const [ascendingDate, setAscendingDate] = useState(true);
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);

  const [rejectDateData, setRejectDateData] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [holdTicketData, setHoldTicketData] = useState(null);
  const [closeTicketData, setCloseTicketData] = useState(null);
  const [transferTicketData, setTransferTicketData] = useState(null);
  const [printData, setPrintData] = useState(null);

  const [selectedTickets, setSelectedTickets] = useState([]);
  const userDetails = useSelector((state) => state?.user);

  const [cancelTransferTicket] = useCancelTransferTicketMutation();
  const [resumeIssueHandlerTickets] = useResumeIssueHandlerTicketsMutation();
  const [cancelClosingTickets] = useCancelClosingIssueHandlerTicketsMutation();
  const [confirmConcern, { isLoading: confirmConcernIsLoading, isFetching: confirmConcernIsFetching }] = useConfirmConcernMutation();

  const { open: viewOpen, onToggle: viewOnToggle, onClose: viewOnClose } = useDisclosure();
  const { open: addTicketOpen, onToggle: addTicketOnToggle, onClose: addTicketOnClose } = useDisclosure();
  const { open: holdTicketOpen, onToggle: holdTicketOnToggle, onClose: holdTicketOnClose } = useDisclosure();
  const { open: manageHoldTicketOpen, onToggle: manageHoldTicketOnToggle, onClose: manageHoldTicketOnClose } = useDisclosure();
  const { open: closeTicketOpen, onToggle: closeTicketOnToggle, onClose: closeTicketOnClose } = useDisclosure();
  const { open: manageTicketOpen, onToggle: manageTicketOnToggle, onClose: manageTicketOnClose } = useDisclosure();
  const { open: transferTicketOpen, onToggle: transferTicketOnToggle, onClose: transferTicketOnClose } = useDisclosure();
  const { open: rejectTransferOpen, onToggle: rejectTransferOnToggle, onClose: rejectTransferOnClose } = useDisclosure();
  const { open: manageTransferOpen, onToggle: manageTransferOnToggle, onClose: manageTransferOnClose } = useDisclosure();
  const { open: approveTransferOpen, onToggle: approveTransferOnToggle, onClose: approveTransferOnClose } = useDisclosure();
  const { open: printTicketOpen, onClose: printTicketOnClose } = useDisclosure();
  const { open: rejectDateOpen, onToggle: rejectDateOnToggle, onClose: rejectDateOnClose } = useDisclosure();

  const dispatch = useDispatch();
  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));
  // useSignalRConnection();

  const { data: notificationBadge } = useGetNotificationQuery();
  const { data, isLoading, isFetching, isSuccess, isError, refetch } = useGetIssueHandlerConcernsQuery({
    Concern_Status: ticketStatus,
    Search: search,
    History_Status: filterStatus || "",
    Date_From: dateFrom || "",
    Date_To: dateTo || "",
    Ascending: ascending,
    AscendingDate: ascendingDate,
    PageNumber: pageNumber,
    PageSize: pageSize,
  });

  const onPageNumberChange = (_, page) => {
    dispatch(setPageNumber(page + 1));
  };

  const onPageSizeChange = (e) => {
    dispatch(setPageSize(e.target.value));
    dispatch(setPageNumber(1));
  };

  const onStatusChange = (_, newValue) => {
    setTicketStatus(newValue);
    dispatch(setPageNumber(1));
    dispatch(setPageSize(100));
  };

  const onViewAction = (data) => {
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

  const onPrintTicketAction = async (data) => {
    console.log("Data: ", data);

    Swal.fire({
      title: "Printing Service Report...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      color: "white",
      showCancelButton: false,
      background: "#111927",
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
      didOpen: async () => {
        Swal.showLoading();
        const formPdfBytes = await fetch(srReport).then((res) => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(formPdfBytes);
        const form = pdfDoc.getForm();

        try {
          const site_office = form.getCheckBox("site_office");
          const site_store = form.getCheckBox("site_store");
          const site_farm = form.getCheckBox("site_farm");
          const site_depot = form.getCheckBox("site_depot");

          const location = form.getTextField("location");
          const requestor_name = form.getTextField("requestor_name");
          const contact_no = form.getTextField("contact_no");

          const type_new = form.getCheckBox("type_new");
          const type_backjob = form.getCheckBox("type_backjob");
          const date_started = form.getTextField("date_started");
          const date_finished = form.getTextField("date_finished");

          const urgency_normal = form.getCheckBox("urgency_normal");
          const urgency_low = form.getCheckBox("urgency_low");
          const urgency_high = form.getCheckBox("urgency_high");
          const urgency_urgent = form.getCheckBox("urgency_urgent");

          const category = form.getTextField("category");
          const sub_category = form.getTextField("sub_category");

          const status_open = form.getCheckBox("status_open");
          const status_close = form.getCheckBox("status_close");
          const status_onHold = form.getCheckBox("status_onHold");

          const sys_cat_process = form.getCheckBox("sys_cat_process");
          const sys_cat_user = form.getCheckBox("sys_cat_user");
          const sys_cat_system = form.getCheckBox("sys_cat_system");
          const sys_cat_network = form.getCheckBox("sys_cat_network");
          const sys_cat_na = form.getCheckBox("sys_cat_na");

          const description = form.getTextField("description");
          const resolution = form.getTextField("resolution");

          const supportTechFields = [form.getTextField("support_tech_one"), form.getTextField("support_tech_two"), form.getTextField("support_tech_three")];

          const issue_handler = form.getTextField("issue_handler");
          const ticket_number = form.getTextField("ticket_number");

          location.setText(`${data?.department_Code} - ${data?.department_Name}`);
          requestor_name.setText(data?.requestor_Name);
          contact_no.setText(data?.contact_Number ? data?.contact_Number : "N/A");
          date_started.setText(moment(data?.created_At).format("MM/DD/YYYY hh:mma"));
          date_finished.setText(moment(data?.close_At).format("MM/DD/YYYY hh:mma"));
          description.setText(data?.concern_Description.replace(/\r\n/g, " - "));
          resolution.setText(data?.getForClosingTickets?.[0]?.resolution);
          issue_handler.setText(data?.issue_Handler);
          ticket_number.setText(data?.ticketConcernId.toString());
          status_close.check();

          // Site
          if (data?.isStore === true) {
            site_store.check();
          } else {
            site_office.check();
          }

          // Type of Request
          if (data?.request_Type === "New Request") {
            type_new.check();
          } else {
            type_backjob.check();
          }

          // Urgency
          if (data?.severity === "Normal") {
            urgency_normal.check();
          } else if (data?.severity === "Low") {
            urgency_low.check();
          } else if (data?.severity === "High") {
            urgency_high.check();
          } else {
            urgency_urgent.check();
          }

          // Handle categories (join into comma-separated string)
          const categoryArray = data?.getOpenTicketCategories || [];

          if (categoryArray.length > 0) {
            const categoryText = categoryArray
              .map((cat) => (cat.category_Description || "").trim()) // remove extra spaces
              .filter((desc) => desc !== "") // avoid empty values
              .join(", "); // join with commas

            category.setText(categoryText);
          } else {
            category.setText("N/A");
          }

          // Handle categories (join into comma-separated string)
          const subCategoryArray = data?.getOpenTicketSubCategories || [];

          if (subCategoryArray.length > 0) {
            const subCategoryText = subCategoryArray
              .map((subCat) => (subCat.subCategory_Description || "").trim()) // remove extra spaces
              .filter((desc) => desc !== "") // avoid empty values
              .join(", "); // join with commas

            sub_category.setText(subCategoryText);
          } else {
            sub_category.setText("N/A");
          }

          // Concern Category
          if (data?.getForClosingTickets?.[0]?.categoryConcernName === "Process") {
            sys_cat_process.check();
          } else if (data?.getForClosingTickets?.[0]?.categoryConcernName === "User Error") {
            sys_cat_user.check();
          } else if (data?.getForClosingTickets?.[0]?.categoryConcernName === "System Error") {
            sys_cat_system.check();
          } else if (data?.getForClosingTickets?.[0]?.categoryConcernName === "Network Error") {
            sys_cat_network.check();
          } else {
            sys_cat_na.check();
          }

          // Get technician array (safe default to empty)
          const technicianArray = data?.getForClosingTickets?.[0]?.forClosingTicketTechnicians || [];

          // Clear all fields first
          supportTechFields.forEach((field) => field.setText(""));

          // Fill fields based on array length (max 3)
          technicianArray.forEach((tech, index) => {
            if (index < supportTechFields.length) {
              supportTechFields[index].setText(tech.fullname || "");
            }
          });
        } catch (e) {
          console.log("Error", e);

          console.warn("No field named 'Name' found in PDF");
        }

        const updatedPdfBytes = await pdfDoc.save();

        const blob = new Blob([updatedPdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);

        const iframe = document.createElement("iframe");
        iframe.style.position = "absolute";
        iframe.style.width = "0px";
        iframe.style.height = "0px";
        iframe.style.border = "none";
        iframe.src = url;

        document.body.appendChild(iframe);

        iframe.onload = () => {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          Swal.close();
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.close();
      }
    });
  };

  const onRejectDateAction = (data) => {
    rejectDateOnToggle();
    setRejectDateData(data);
  };

  const onResumeTicketAction = (data) => {
    const payload = {
      ticketOnHoldId: data?.getOnHolds?.[0]?.id,
    };

    Swal.fire({
      title: "Confirmation",
      text: `Requesting to resume this ticket number ${moment(data?.created_At).format("YYYY")}-${data?.ticketConcernId}?`,
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
      text: `Cancel transfer ticket number ${moment(data?.created_At).format("YYYY")}-${data?.ticketConcernId}?`,
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

    Swal.fire({
      title: "Confirmation",
      text: `Cancel ticket number ${moment(data?.created_At).format("YYYY")}-${data?.ticketConcernId}?`,
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

  const onConfirmAction = (data) => {
    console.log("Data: ", data);

    const payload = {
      confirmTicketRequests: [
        {
          requestConcernId: data?.requestConcernId,
        },
      ],
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

  const selectableTickets = useMemo(() => {
    return data?.value?.openTicket?.filter((item) => item.requestor_Name === userDetails?.fullname) || [];
  }, [data?.value?.openTicket, userDetails?.fullname]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedTickets(selectableTickets.map((item) => item.requestConcernId));
    } else {
      setSelectedTickets([]);
    }
  };

  const handleSelectTicket = (item) => {
    setSelectedTickets((prevSelected) => (prevSelected.includes(item) ? prevSelected.filter((id) => id !== item) : [...prevSelected, item]));
  };

  const onDialogClose = () => {
    setCloseTicketData(null);
    setTransferTicketData(null);
    setPrintData(null);
    closeTicketOnClose();
  };

  useEffect(() => {
    if (ticketStatus) {
      refetch();
    }
  }, [ticketStatus]);

  useEffect(() => {
    if (ticketStatus !== "") {
      setFilterStatus(null);
      setDateFrom(null);
      setDateTo(null);
    }
  }, [ticketStatus]);

  // Clear selected tickets if not "For Closing Ticket"
  useEffect(() => {
    if (ticketStatus !== "For Confirmation") {
      setSelectedTickets([]);
    }
  }, [ticketStatus]);

  return (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: theme.palette.bgForm.black1,
        color: "#fff",
        padding: isScreenSmall ? "20px" : "2px 64px 24px 64px",
      }}
    >
      <Stack>
        <Stack direction="row" justifyContent="space-between">
          <Stack justifyItems="left">
            <Typography variant={isScreenSmall ? "h5" : "h4"}>Tickets</Typography>
          </Stack>
          <Stack justifyItems="space-between" direction="row">
            <Stack justifyItems="space-between" direction="row" marginTop={1}>
              <Button size={isScreenSmall ? "small" : "medium"} variant="contained" color="primary" startIcon={<DiscountOutlined />} onClick={addTicketOnToggle} sx={{ fontSize: "11px" }}>
                Add Ticket
              </Button>
            </Stack>
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

        <Stack
          sx={{
            backgroundColor: theme.palette.bgForm.black3,
            borderRadius: "20px",
            marginTop: "5px",
            width: "100%",
          }}
        >
          <Stack direction="row" justifyContent="space-between" paddingLeft={1} paddingRight={1}>
            <Tabs
              value={ticketStatus}
              onChange={onStatusChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                ".MuiTab-root": {
                  minWidth: isMobile ? "80px" : "120px",
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
                value="For Approval"
                className="tabs-styling"
                label="Ticket Requests"
                icon={
                  <Badge
                    badgeContent={notificationBadge?.value?.approvalDateNotif}
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
                value="Date Rejected"
                className="tabs-styling"
                label="Declined"
                icon={
                  <Badge
                    badgeContent={notificationBadge?.value?.dateRejectedNotif}
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
                    <ThumbDownOffAlt />
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
                <TicketFiltering filterStatus={filterStatus} setFilterStatus={setFilterStatus} dateFrom={dateFrom} setDateFrom={setDateFrom} dateTo={dateTo} setDateTo={setDateTo} />
              )}
            </Stack>
          </Stack>

          <Divider
            variant="fullWidth"
            sx={{
              background: "#2D3748",
              marginBottom: 1,
              lineHeight: 1,
            }}
          />

          <Stack sx={{ width: "100%", padding: 1 }}>
            <OutlinedInput
              placeholder="Search"
              startAdornment={<Search sx={{ marginRight: 0.5, color: "#A0AEC0" }} />}
              value={searchValue}
              onChange={(e) => dispatch(setSearchValue(e.target.value))}
              sx={{
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
              {ticketStatus === "For Confirmation" && (
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
                    indeterminate={selectedTickets.length > 0 && selectedTickets.length < selectableTickets.length}
                    checked={selectableTickets.length > 0 && selectedTickets.length === selectableTickets.length}
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
                  data?.value?.openTicket?.map((item) => (
                    <Card
                      key={item.ticketConcernId}
                      sx={{
                        backgroundColor: theme.palette.bgForm.black3,
                        borderRadius: "15px",
                        borderColor: "#2D3748",
                      }}
                    >
                      <CardContent
                        sx={{
                          cursor: "pointer",
                          "&:hover": {
                            backgroundColor: "#1A222F",
                            color: "#9e77ed",
                          },
                        }}
                      >
                        <Stack
                          spacing={1}
                          direction="row"
                          sx={{
                            alignItems: "center",
                          }}
                        >
                          {ticketStatus === "For Confirmation" && (
                            <Stack>
                              <Checkbox
                                checked={selectedTickets.includes(item.requestConcernId)}
                                onChange={() => handleSelectTicket(item.requestConcernId)}
                                inputProps={{
                                  "aria-label": `select ticket ${item.ticketConcernId}`,
                                }}
                                disabled={item?.requestor_Name !== userDetails?.fullname}
                              />
                            </Stack>
                          )}

                          <Stack spacing={1} onClick={() => onViewAction(item)}>
                            <Stack direction="row" gap={0.5} alignItems="center">
                              <Typography
                                sx={{
                                  fontWeight: 700,
                                  fontSize: "0.775rem",
                                  lineHeight: 1.57,
                                  color: "#D65DB1",
                                }}
                              >
                                TICKET NUMBER:
                              </Typography>
                              <Typography
                                sx={{
                                  fontWeight: 400,
                                  fontSize: "0.775rem",
                                  lineHeight: 1.57,
                                  color: theme.palette.text.main,
                                }}
                              >
                                {`${moment(item.created_At).format("YYYY")}-${item.ticketConcernId}`}
                              </Typography>
                            </Stack>

                            <Stack direction="row" gap={0.5} alignItems="center" sx={{ maxWidth: "700px" }}>
                              <Typography
                                sx={{
                                  fontWeight: 700,
                                  fontSize: "0.775rem",
                                  lineHeight: 1.57,
                                  color: "#D65DB1",
                                }}
                              >
                                TICKET DESCRIPTION:
                              </Typography>
                              <Typography
                                sx={{
                                  fontWeight: 400,
                                  fontSize: "0.775rem",
                                  lineHeight: 1.57,
                                  color: theme.palette.text.main,
                                }}
                              >
                                {item?.concern_Description?.split("\r\n")?.map((line, index) => (
                                  <span key={index}>
                                    {line}
                                    <br />
                                  </span>
                                ))}
                              </Typography>
                            </Stack>

                            {ticketStatus !== "For Approval" && (
                              <Stack direction="row" gap={0.5} alignItems="center">
                                <Typography
                                  sx={{
                                    fontWeight: 700,
                                    fontSize: "0.775rem",
                                    lineHeight: 1.57,
                                    color: "#D65DB1",
                                  }}
                                >
                                  TICKETED DATE:{" "}
                                </Typography>
                                <Chip
                                  variant="filled"
                                  size="small"
                                  icon={<CalendarMonthOutlined fontSize="small" color="primary" />}
                                  label={moment(item?.created_At).format("LL")}
                                  sx={{
                                    fontSize: "12px",
                                    backgroundColor: "#1D1F3B",
                                    color: theme.palette.primary.main,
                                    fontWeight: 800,
                                  }}
                                />
                              </Stack>
                            )}

                            <Stack direction="row" gap={0.5} alignItems="center">
                              <Typography
                                sx={{
                                  fontWeight: 700,
                                  fontSize: "0.775rem",
                                  lineHeight: 1.57,
                                  color: "#D65DB1",
                                }}
                              >
                                TARGET DATE:{" "}
                              </Typography>
                              <Chip
                                variant="filled"
                                size="small"
                                icon={<CalendarMonthOutlined fontSize="small" color="primary" />}
                                sx={{
                                  fontSize: "12px",
                                  backgroundColor: "#1D1F3B",
                                  color: theme.palette.primary.main,
                                  fontWeight: 800,
                                }}
                                label={moment(item.target_Date).format("LL")}
                              />
                            </Stack>

                            {(ticketStatus === "Closed" || ticketStatus === "") && (
                              <Stack direction="row" gap={0.5} alignItems="center">
                                <Typography
                                  sx={{
                                    fontWeight: 700,
                                    fontSize: "0.775rem",
                                    lineHeight: 1.57,
                                    color: "#D65DB1",
                                  }}
                                >
                                  CLOSED DATE:
                                </Typography>
                                <Chip
                                  variant="filled"
                                  size="small"
                                  icon={item?.closed_At !== null ? <CalendarMonthOutlined fontSize="small" color="primary" /> : ""}
                                  label={item?.closed_At !== null ? moment(item?.closed_At).format("LL") : ""}
                                  sx={{
                                    fontSize: "12px",
                                    backgroundColor: item?.closed_At !== null ? "#1D1F3B" : "transparent",
                                    color: theme.palette.primary.main,
                                    fontWeight: 800,
                                  }}
                                />
                              </Stack>
                            )}

                            {ticketStatus === "Closed" && (
                              <Stack direction="row" gap={0.5} alignItems="center">
                                <Typography
                                  sx={{
                                    fontWeight: 700,
                                    fontSize: "0.775rem",
                                    lineHeight: 1.57,
                                    color: "#D65DB1",
                                  }}
                                >
                                  AGING DAYS:
                                </Typography>
                                <Typography
                                  sx={{
                                    fontWeight: 400,
                                    fontSize: "0.775rem",
                                    lineHeight: 1.57,
                                    color: theme.palette.text.main,
                                  }}
                                >
                                  {item.aging_Days} Day(s)
                                </Typography>
                              </Stack>
                            )}

                            <Stack direction="row" gap={0.5} alignItems="center">
                              <Typography
                                sx={{
                                  fontWeight: 700,
                                  fontSize: "0.775rem",
                                  lineHeight: 1.57,
                                  color: "#D65DB1",
                                }}
                              >
                                REMARKS:
                              </Typography>
                              <Box sx={{ maxWidth: "20px" }}>
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
                            </Stack>

                            {ticketStatus === "" && (
                              <Stack direction="row" gap={0.5} alignItems="center">
                                <Typography
                                  sx={{
                                    fontWeight: 700,
                                    fontSize: "0.775rem",
                                    lineHeight: 1.57,
                                    color: "#D65DB1",
                                  }}
                                >
                                  STATUS:
                                </Typography>
                                <Chip
                                  variant="filled"
                                  size="small"
                                  label={
                                    item.ticket_Status === "Pending Request"
                                      ? "Pending Request"
                                      : item.ticket_Status === "Open Ticket"
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
                                      item.ticket_Status === "Pending Request"
                                        ? "#F58900"
                                        : item.ticket_Status === "Open Ticket"
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
                              </Stack>
                            )}

                            {(ticketStatus === "Closed" || ticketStatus === "") && (
                              <Stack direction="row" gap={0.5} alignItems="center">
                                <Typography
                                  sx={{
                                    fontWeight: 700,
                                    fontSize: "0.775rem",
                                    lineHeight: 1.57,
                                    color: "#D65DB1",
                                  }}
                                >
                                  CLOSING STATUS:
                                </Typography>
                                <Chip
                                  variant="filled"
                                  size="small"
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
                                      <Typography
                                        sx={{
                                          color: theme.palette.success.main,
                                          fontSize: "13px",
                                          fontWeight: 800,
                                        }}
                                      >
                                        On-Time
                                      </Typography>
                                    ) : item?.closed_Status === "Delay" ? (
                                      <Typography
                                        sx={{
                                          color: theme.palette.error.main,
                                          fontSize: "13px",
                                          fontWeight: 800,
                                        }}
                                      >
                                        Delayed
                                      </Typography>
                                    ) : (
                                      <Typography
                                        sx={{
                                          color: theme.palette.error.main,
                                          fontSize: "13px",
                                          fontWeight: 800,
                                        }}
                                      ></Typography>
                                    )
                                  }
                                />
                              </Stack>
                            )}

                            {ticketStatus !== "For Approval" && (
                              <Stack direction="row" gap={0.5} alignItems="center">
                                <Typography
                                  sx={{
                                    fontWeight: 700,
                                    fontSize: "0.775rem",
                                    lineHeight: 1.57,
                                    color: "#D65DB1",
                                  }}
                                >
                                  ACTION:
                                </Typography>

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
                                  onConfirm={onConfirmAction}
                                  onRejectDate={onRejectDateAction}
                                />
                              </Stack>
                            )}
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}

                {isError && (
                  <Stack justifyContent="center" alignItems="center" padding={4}>
                    <img src={somethingWentWrong} alt="Something Went Wrong" className="something-went-wrong-table" />
                    <Typography variant="h6" color="#EDF2F7" align="center">
                      Something went wrong.
                    </Typography>
                  </Stack>
                )}

                {(isLoading || isFetching) && (
                  <Stack justifyContent="center" alignItems="center" padding={4} sx={{ maxHeight: 300 }}>
                    <CircularProgress />
                    <Typography variant="h5" color="#EDF2F7">
                      Please wait...
                    </Typography>
                  </Stack>
                )}

                {isSuccess && !data?.value?.openTicket.length && !isLoading && !isFetching && (
                  <Stack justifyContent="center" alignItems="center" padding={4}>
                    <img src={noRecordsFound} alt="No Records Found" className="norecords-found-table" />
                    <Typography variant="h6" align="center">
                      No records found.
                    </Typography>
                  </Stack>
                )}

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
              </Stack>
            </>
          ) : (
            <>
              <TableContainer
                sx={{
                  overflow: "auto",
                }}
              >
                <Table size="small" stickyHeader sx={{ borderBottom: "none" }}>
                  <TableHead sx={{ whiteSpace: "nowrap" }}>
                    <TableRow>
                      {ticketStatus === "For Confirmation" && (
                        <TableCell
                          padding="checkbox"
                          sx={{
                            background: "#1C2536",
                            color: "#D65DB1",
                            fontWeight: 700,
                            fontSize: "12px",
                          }}
                          align="center"
                        >
                          <Checkbox
                            indeterminate={selectedTickets.length > 0 && selectedTickets.length < selectableTickets.length}
                            checked={selectableTickets.length > 0 && selectedTickets.length === selectableTickets.length}
                            onChange={handleSelectAll}
                            inputProps={{ "aria-label": "select all tickets" }}
                          />
                        </TableCell>
                      )}

                      <TableCell
                        sx={{
                          background: "#1C2536",
                        }}
                      >
                        <Stack sx={{ flexDirection: "row", gap: 0.5, alignItems: "center" }}>
                          <Typography sx={{ color: "#D65DB1", fontWeight: 700, fontSize: "12px" }}>TICKET NO.</Typography>
                          <IconButton
                            size="small"
                            onClick={() => {
                              dispatch(setAscending(!ascending));

                              // if
                              // setAscendingDate(!ascendingDate);
                            }}
                          >
                            {ascending ? <ArrowUpwardRounded sx={{ color: "#D65DB1", fontSize: "20px" }} /> : <ArrowDownwardRounded sx={{ color: "#D65DB1", fontSize: "20px" }} />}
                          </IconButton>
                        </Stack>
                      </TableCell>

                      <TableCell
                        sx={{
                          background: "#1C2536",
                          color: "#D65DB1",
                          fontWeight: 700,
                          fontSize: "12px",
                        }}
                      >
                        REQUESTOR
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
                        CATEGORY
                      </TableCell>

                      {ticketStatus !== "For Approval" && (
                        <TableCell
                          sx={{
                            background: "#1C2536",
                            color: "#D65DB1",
                            fontWeight: 700,
                            fontSize: "12px",
                          }}
                        >
                          TICKETED DATE
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
                        <Stack sx={{ flexDirection: "row", gap: 0.5, alignItems: "center" }}>
                          <Typography sx={{ color: "#D65DB1", fontWeight: 700, fontSize: "12px" }}>TARGET DATE</Typography>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setAscendingDate(!ascendingDate);
                              // dispatch(setAscending(!ascending));
                              // refetch();
                            }}
                          >
                            {ascendingDate ? <ArrowUpwardRounded sx={{ color: "#D65DB1", fontSize: "20px" }} /> : <ArrowDownwardRounded sx={{ color: "#D65DB1", fontSize: "20px" }} />}
                          </IconButton>
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
                          CLOSED DATE
                        </TableCell>
                      )}

                      {ticketStatus === "Closed" ||
                        (ticketStatus === "" && (
                          <TableCell
                            sx={{
                              background: "#1C2536",
                              color: "#D65DB1",
                              fontWeight: 700,
                              fontSize: "12px",
                            }}
                          >
                            AGING DAYS
                          </TableCell>
                        ))}

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

                      {ticketStatus === "" && (
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
                      )}

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

                      {ticketStatus !== "For Approval" && (
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
                      )}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {isSuccess &&
                      !isLoading &&
                      !isFetching &&
                      data?.value?.openTicket?.map((item) => {
                        const isSelected = selectedTickets.includes(item.ticketConcernId);

                        return (
                          <React.Fragment key={item.ticketConcernId}>
                            <TableRow
                              key={item.ticketConcernId}
                              sx={{
                                backgroundColor: isSelected ? "#1E2034" : theme.palette.bgForm.black3,
                                "&:hover": {
                                  background: "",
                                  color: "#EDF2F7",
                                },
                              }}
                            >
                              {ticketStatus === "For Confirmation" && (
                                <TableCell
                                  padding="checkbox"
                                  sx={{
                                    color: "#EDF2F7",
                                    fontSize: "12px",
                                    fontWeight: 500,
                                  }}
                                  align="center"
                                >
                                  <Checkbox
                                    checked={selectedTickets.includes(item.requestConcernId)}
                                    onChange={() => handleSelectTicket(item.requestConcernId)}
                                    inputProps={{
                                      "aria-label": `select ticket ${item.ticketConcernId}`,
                                    }}
                                    disabled={item?.requestor_Name !== userDetails?.fullname}
                                  />
                                </TableCell>
                              )}

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
                                {`${moment(item.created_At).format("YYYY")}-${item.ticketConcernId}`}
                              </TableCell>

                              <TableCell onClick={() => onViewAction(item)}>
                                <Stack sx={{ width: "180px" }}>
                                  <Typography
                                    sx={{
                                      color: "#EDF2F7",
                                      fontSize: "12px",
                                      fontWeight: 500,
                                      wordBreak: "break-word",
                                    }}
                                  >
                                    {item.requestor_Name}
                                  </Typography>

                                  <Typography
                                    sx={{
                                      color: theme.palette.text.secondary,
                                      fontSize: "12px",
                                      fontWeight: 500,
                                      wordBreak: "break-word",
                                    }}
                                  >
                                    {item.department_Name}
                                  </Typography>

                                  <Typography
                                    sx={{
                                      color: theme.palette.text.secondary,
                                      fontSize: "12px",
                                      fontWeight: 500,
                                      wordBreak: "break-word",
                                    }}
                                  >
                                    {item.location_Name}
                                  </Typography>
                                </Stack>
                              </TableCell>

                              <TableCell onClick={() => onViewAction(item)}>
                                <Stack sx={{ width: "200px" }}>
                                  <Typography
                                    sx={{
                                      color: "#EDF2F7",
                                      fontSize: "12px",
                                      fontWeight: 500,
                                      wordBreak: "break-word",
                                    }}
                                  >
                                    {item.concern_Description
                                      ? item.concern_Description?.split("\r\n").map((line, index) => (
                                          <span key={index}>
                                            {line}
                                            <br />
                                          </span>
                                        ))
                                      : "--"}
                                  </Typography>
                                </Stack>
                              </TableCell>

                              <TableCell
                                className="ellipsis-styling"
                                sx={{
                                  color: "#EDF2F7",
                                  width: "500px",
                                }}
                                onClick={() => onViewAction(item)}
                              >
                                <Stack gap={0.5}>
                                  <Stack>
                                    <Typography sx={{ fontSize: "12px", fontWeight: 600, fontWeight: 600, color: "#22B4BF" }}>Category:</Typography>

                                    {item?.getOpenTicketCategories?.length > 0 ? (
                                      <>
                                        {item?.getOpenTicketCategories?.map((item, i) => (
                                          <>
                                            <Typography key={i} sx={{ fontSize: "12px", fontWeight: 500 }}>
                                              {i + 1}. {item.category_Description}
                                            </Typography>
                                          </>
                                        ))}
                                      </>
                                    ) : (
                                      <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>--</Typography>
                                    )}
                                  </Stack>

                                  <Stack>
                                    <Typography sx={{ fontSize: "12px", fontWeight: 600, fontWeight: 600, color: "#22B4BF" }}>Sub Category:</Typography>

                                    {item?.getOpenTicketSubCategories?.length > 0 ? (
                                      <>
                                        {item?.getOpenTicketSubCategories?.map((item, i) => (
                                          <>
                                            <Typography key={i} sx={{ fontSize: "12px", fontWeight: 500 }}>
                                              {i + 1}. {item.subCategory_Description}
                                            </Typography>
                                          </>
                                        ))}
                                      </>
                                    ) : (
                                      <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>--</Typography>
                                    )}
                                  </Stack>
                                </Stack>
                              </TableCell>

                              {ticketStatus !== "For Approval" && (
                                <TableCell
                                  sx={{
                                    color: "#EDF2F7",
                                    fontSize: "12px",
                                    fontWeight: 500,
                                  }}
                                  onClick={() => onViewAction(item)}
                                >
                                  <>
                                    <Chip
                                      variant="filled"
                                      size="small"
                                      icon={<CalendarMonthOutlined fontSize="small" color="primary" />}
                                      label={moment(item?.created_At).format("LL")}
                                      sx={{
                                        fontSize: "12px",
                                        backgroundColor: "#1D1F3B",
                                        color: theme.palette.primary.main,
                                        fontWeight: 800,
                                      }}
                                    />
                                  </>
                                </TableCell>
                              )}

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
                                {item.target_Date ? (
                                  <>
                                    <Chip
                                      variant="filled"
                                      size="small"
                                      icon={<CalendarMonthOutlined fontSize="small" color="primary" />}
                                      sx={{
                                        fontSize: "12px",
                                        backgroundColor: "#1D1F3B",
                                        color: theme.palette.primary.main,
                                        fontWeight: 800,
                                      }}
                                      label={moment(item.target_Date).format("LL")}
                                    />
                                  </>
                                ) : (
                                  "--"
                                )}
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
                                  {item?.closed_At !== null ? (
                                    <>
                                      <Chip
                                        variant="filled"
                                        size="small"
                                        icon={<CalendarMonthOutlined fontSize="small" color="primary" />}
                                        label={moment(item?.closed_At).format("LL")}
                                        sx={{
                                          fontSize: "12px",
                                          backgroundColor: "#1D1F3B",
                                          color: theme.palette.primary.main,
                                          fontWeight: 800,
                                        }}
                                      />
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </TableCell>
                              )}

                              {ticketStatus === "Closed" ||
                                (ticketStatus === "" && (
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
                                    {item.aging_Days !== null ? `${item.aging_Days} day(s)` : ""}
                                  </TableCell>
                                ))}

                              <TableCell onClick={() => onViewAction(item)}>
                                <Box>
                                  <Tooltip title={item.remarks} placement="bottom-start">
                                    <Chip
                                      variant="filled"
                                      size="small"
                                      label={item.remarks ? item.remarks : ""}
                                      sx={{
                                        ...sx.remarksChip,
                                        backgroundColor: item.remarks === null ? "transparent" : item.remarks === "Ticket Closed" ? "#00913c" : theme.palette.error.main,
                                      }}
                                    />
                                  </Tooltip>
                                </Box>
                              </TableCell>

                              {ticketStatus === "" && (
                                <TableCell
                                  sx={{
                                    color: "#EDF2F7",
                                    fontSize: "12px",
                                    fontWeight: 500,
                                    "&:hover": {
                                      background: ticketStatus === "Closed" && item?.getForClosingTickets?.[0]?.closed_Status === "On-Time" ? "" : "",
                                      color: "#EDF2F7",
                                    },
                                  }}
                                  onClick={() => onViewAction(item)}
                                >
                                  <Chip
                                    variant="filled"
                                    size="small"
                                    label={
                                      item.ticket_Status === "Pending Request"
                                        ? "Pending Request"
                                        : item.ticket_Status === "Open Ticket"
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
                                        item.ticket_Status === "Pending Request"
                                          ? "#F58900"
                                          : item.ticket_Status === "Open Ticket"
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
                              )}

                              {(ticketStatus === "Closed" || ticketStatus === "") && (
                                <TableCell
                                  sx={{
                                    color: "#EDF2F7",
                                    fontWeight: 500,
                                  }}
                                >
                                  <Chip
                                    variant="filled"
                                    size="small"
                                    icon={
                                      item?.getForClosingTickets?.[0]?.closed_Status === "On-Time" ? (
                                        <FiberManualRecord fontSize="small" color="success" />
                                      ) : item?.getForClosingTickets?.[0]?.closed_Status === "Delay" ? (
                                        <FiberManualRecord fontSize="small" color="error" />
                                      ) : (
                                        ""
                                      )
                                    }
                                    sx={{
                                      fontSize: "12px",
                                      backgroundColor:
                                        item?.getForClosingTickets?.[0]?.closed_Status === "On-Time" || item?.getForClosingTickets?.[0]?.closed_Status === "Delay"
                                          ? theme.palette.bgForm.black1
                                          : "transparent",
                                      color: theme.palette.text.main,
                                      fontWeight: 800,
                                    }}
                                    label={
                                      item?.getForClosingTickets?.[0]?.closed_Status === "On-Time" ? (
                                        <Typography
                                          sx={{
                                            color: theme.palette.success.main,
                                            fontSize: "13px",
                                            fontWeight: 800,
                                          }}
                                        >
                                          On-Time
                                        </Typography>
                                      ) : item?.getForClosingTickets?.[0]?.closed_Status === "Delay" ? (
                                        <Typography
                                          sx={{
                                            color: theme.palette.error.main,
                                            fontSize: "13px",
                                            fontWeight: 800,
                                          }}
                                        >
                                          Delayed
                                        </Typography>
                                      ) : (
                                        <Typography
                                          sx={{
                                            color: theme.palette.error.main,
                                            fontSize: "13px",
                                            fontWeight: 800,
                                          }}
                                        ></Typography>
                                      )
                                    }
                                  />
                                </TableCell>
                              )}

                              {ticketStatus !== "For Approval" && (
                                <TableCell
                                  sx={{
                                    color: "#EDF2F7",
                                    fontSize: "12px",
                                    fontWeight: 500,
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
                                    onConfirm={onConfirmAction}
                                    onRejectDate={onRejectDateAction}
                                  />
                                </TableCell>
                              )}
                            </TableRow>
                          </React.Fragment>
                        );
                      })}

                    {isError && (
                      <TableRow>
                        <TableCell colSpan={12} align="center">
                          <img src={somethingWentWrong} alt="Something Went Wrong" className="something-went-wrong-table" />
                          <Typography variant="h5" color="#EDF2F7" marginLeft={2}>
                            Something went wrong.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}

                    {(isLoading || isFetching) && (
                      <TableRow>
                        <TableCell colSpan={12} align="center">
                          <CircularProgress />
                          <Typography variant="h5" color="#EDF2F7">
                            Please wait...
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}

                    {isSuccess && !data?.value?.openTicket.length && !isLoading && !isFetching && (
                      <TableRow>
                        <TableCell colSpan={12} align="center">
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
            </>
          )}
        </Stack>

        {viewOpen && (
          <IssueViewDialog
            data={viewData}
            setData={setViewData}
            ticketStatus={ticketStatus}
            viewOpen={viewOpen}
            viewOnClose={viewOnClose}
            // Buttons in View Dialog ~~~~
            onClosing={onCloseTicketAction}
            onTransfer={onTransferTicketAction}
            onHold={onHoldTicketAction}
          />
        )}

        {addTicketOpen && <AddTicketDialog open={addTicketOpen} onClose={addTicketOnClose} />}
        <IssueHandlerClosingDialog data={closeTicketData} open={closeTicketOpen} onClose={onDialogClose} viewOnClose={viewOnClose} />

        <RejectDateDialog
          data={rejectDateData}
          open={rejectDateOpen}
          onClose={() => {
            rejectDateOnClose(setRejectDateData(null));
          }}
        />

        <ManageTicketDialog
          data={closeTicketData}
          open={manageTicketOpen}
          onClose={() => {
            manageTicketOnClose(setCloseTicketData(null));
          }}
          refetch={refetch}
        />

        {transferTicketOpen && (
          <TicketForTransferDialog
            data={transferTicketData}
            open={transferTicketOpen}
            onClose={() => {
              transferTicketOnClose(setTransferTicketData(null));
            }}
            viewOnClose={viewOnClose}
          />
        )}

        <ManageTransferDialog
          data={transferTicketData}
          open={manageTransferOpen}
          onClose={() => {
            manageTransferOnClose(setTransferTicketData(null));
          }}
          refetch={refetch}
        />

        {approveTransferOpen && (
          <ApproveTransferTicket
            data={transferTicketData}
            open={approveTransferOpen}
            onClose={() => {
              approveTransferOnClose(setTransferTicketData(null));
            }}
          />
        )}

        {rejectTransferOpen && <RejectTransfer data={transferTicketData} open={rejectTransferOpen} onClose={rejectTransferOnClose} />}

        {holdTicketOpen && (
          <IssueHandlerHoldDialog
            data={holdTicketData}
            open={holdTicketOpen}
            onClose={() => {
              holdTicketOnClose(setHoldTicketData(null));
            }}
            viewOnClose={viewOnClose}
          />
        )}

        {manageHoldTicketOpen && (
          <ManageOnHoldTicketDialog
            data={holdTicketData}
            open={manageHoldTicketOpen}
            onClose={() => {
              manageHoldTicketOnClose(setHoldTicketData(null));
            }}
            refetch={refetch}
          />
        )}

        {printTicketOpen && (
          <PrintServiceReport
            data={printData}
            open={printTicketOpen}
            onClose={() => {
              printTicketOnClose(setPrintData(null));
            }}
          />
        )}
      </Stack>
    </Stack>
  );
};

export default IssueHandlerConcerns;
