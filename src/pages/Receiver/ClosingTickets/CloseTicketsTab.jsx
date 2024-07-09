import { Checkbox, Chip, CircularProgress, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tabs, Typography } from "@mui/material";
import { AccessTimeOutlined, CalendarMonthOutlined, LocalOffer } from "@mui/icons-material";
import React, { useEffect, useState } from "react";

import moment from "moment";
import { theme } from "../../../theme/theme";
import useDisclosure from "../../../hooks/useDisclosure";

import noRecordsFound from "../../../assets/svg/noRecordsFound.svg";
import somethingWentWrong from "../../../assets/svg/SomethingWentWrong.svg";

import ViewClosingDialog from "../../Approver/Approval/TicketApproval/ViewClosingDialog";
import { LoadingButton } from "@mui/lab";
import { toast, Toaster } from "sonner";
import Swal from "sweetalert2";
import { useCloseTicketMutation } from "../../../features/api_ticketing/receiver/closingTicketApi";
import CloseDisappprove from "./CloseDisapprove";
import ClosingTicketActions from "./ClosingTicketActions";

const CloseTicketsTab = ({ data, isLoading, isFetching, isSuccess, isError, setPageNumber, setPageSize }) => {
  const [viewClosingData, setViewClosingData] = useState(null);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [disapproveData, setDisapproveData] = useState(null);

  const { open, onToggle, onClose } = useDisclosure();
  const { open: disapproveOpen, onToggle: disapproveOnToggle, onClose: disapproveOnClose } = useDisclosure();

  const [approveTicket, { isLoading: approveTicketIsLoading, isFetching: approveTicketIsFetching }] = useCloseTicketMutation();

  const onPageNumberChange = (_, page) => {
    setPageNumber(page + 1);
  };

  const onPageSizeChange = (e) => {
    setPageSize(e.target.value);
    setPageNumber(1);
  };

  const onDialogClose = () => {
    setViewClosingData(null);
    onClose();
  };

  const onViewAction = (data) => {
    onToggle();
    setViewClosingData(data);
  };

  const onDisapproveHandler = (item) => {
    disapproveOnToggle();
    setDisapproveData(item);
    console.log("item:", item);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allTicketIds = data?.value?.closingTicket.map((item) => item.closingTicketId) || [];
      setSelectedTickets(allTicketIds);
    } else {
      setSelectedTickets([]);
    }
  };

  const handleSelectTicket = (item) => {
    setSelectedTickets((prevSelected) => (prevSelected.includes(item) ? prevSelected.filter((id) => id !== item) : [...prevSelected, item]));
  };

  const handleApprove = () => {
    // console.log("Approved Tickets:", selectedTickets);

    const payload = {
      approveClosingRequests: selectedTickets.map((item) => ({
        closingTicketId: item,
      })),
    };

    console.log("payload:", payload);

    Swal.fire({
      title: "Confirmation",
      text: "Close selected tickets?",
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
        approveTicket(payload)
          .unwrap()
          .then(() => {
            toast.success("Success!", {
              description: "Ticket closed successfully!",
              duration: 1500,
            });
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

  useEffect(() => {
    if (data?.value?.closingTicket) {
      const allTicketIds = data.value.closingTicket.map((item) => item.closingTicketId);
      if (selectedTickets.length > allTicketIds.length) {
        setSelectedTickets(allTicketIds);
      }
    }
  }, [data, selectedTickets]);

  return (
    <Stack sx={{ width: "100%" }}>
      <Toaster richColors position="top-right" closeButton />
      {selectedTickets.length > 0 && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ padding: "10px 20px", backgroundColor: theme.palette.bgForm.black2, borderRadius: "20px", marginBottom: 1 }}
        >
          <Stack direction="row" gap={0.5}>
            <LocalOffer />
            <Typography>
              {selectedTickets.length} {""}
              {selectedTickets.length > 1 ? "Tickets selected" : "Ticket selected"}
            </Typography>
          </Stack>
          <LoadingButton variant="contained" color="primary" onClick={handleApprove} loading={approveTicketIsLoading || approveTicketIsFetching} startIcon={<LocalOffer />}>
            Close ticket
          </LoadingButton>
        </Stack>
      )}
      <TableContainer>
        <Table sx={{ borderBottom: "none" }}>
          <TableHead>
            <TableRow>
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
                  indeterminate={selectedTickets.length > 0 && selectedTickets.length < (data?.value?.closingTicket?.length || 0)}
                  checked={(data?.value?.closingTicket?.length || 0) > 0 && selectedTickets.length === (data?.value?.closingTicket?.length || 0)}
                  onChange={handleSelectAll}
                  inputProps={{ "aria-label": "select all tickets" }}
                />{" "}
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
                ISSUE HANDLER
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
                  START DATE
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
                <Stack direction="row" alignItems="center" gap={0.5}>
                  <AccessTimeOutlined sx={{ fontSize: "16px" }} />
                  TARGET DATE
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
                ACTION
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {isSuccess &&
              !isLoading &&
              !isFetching &&
              data?.value?.closingTicket?.map((item) => (
                <TableRow key={item.ticketConcernId}>
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
                      checked={selectedTickets.includes(item.closingTicketId)}
                      onChange={() => handleSelectTicket(item.closingTicketId)}
                      inputProps={{ "aria-label": `select ticket ${item.closingTicketId}` }}
                    />
                  </TableCell>

                  <TableCell
                    sx={{
                      color: "#EDF2F7",
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                    align="center"
                    onClick={() => onViewAction(item)}
                  >
                    {item.ticketConcernId}
                  </TableCell>

                  <TableCell onClick={() => onViewAction(item)}>
                    <Typography
                      sx={{
                        color: "#EDF2F7",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      {item.fullname}
                    </Typography>
                    <Typography
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: "12px",
                        fontWeight: 500,
                      }}
                    >
                      {item.department_Name}
                    </Typography>
                    <Typography
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: "12px",
                        fontWeight: 500,
                      }}
                    >
                      {item.channel_Name}
                    </Typography>
                  </TableCell>

                  <TableCell
                    // className="ellipsis-styling"
                    sx={{
                      color: "#EDF2F7",
                      fontSize: "12px",
                      fontWeight: 500,
                      maxWidth: "700px",
                    }}
                    onClick={() => onViewAction(item)}
                  >
                    {item.concern_Details}
                  </TableCell>

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
                      icon={<CalendarMonthOutlined fontSize="small" color="primary" />}
                      sx={{
                        fontSize: "12px",
                        backgroundColor: "#1D1F3B",
                        color: theme.palette.primary.main,
                        fontWeight: 800,
                      }}
                      label={moment(item.start_Date).format("LL")}
                    />
                  </TableCell>

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

                  <TableCell
                    sx={{
                      color: "#EDF2F7",
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                  >
                    {/* <LoadingButton size="small" variant="contained" color="error" onClick={() => onDisapproveHandler(item)} sx={{ padding: "4px", borderRadius: "0" }}>
                      <Typography sx={{ fontSize: "12px" }}>Disapprove</Typography>
                    </LoadingButton> */}

                    <ClosingTicketActions onDisapprove={() => onDisapproveHandler(item)} />
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

            {isSuccess && !data?.value?.closingTicket?.length && (
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
        sx={{ color: "#A0AEC0", fontWeight: 400 }}
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data?.value?.totalCount || 0}
        rowsPerPage={data?.value?.pageSize || 5}
        page={data?.value?.currentPage - 1 || 0}
        onPageChange={onPageNumberChange}
        onRowsPerPageChange={onPageSizeChange}
      />

      <ViewClosingDialog data={viewClosingData} open={open} onClose={onDialogClose} />

      <CloseDisappprove data={disapproveData} open={disapproveOpen} onClose={disapproveOnClose} />
    </Stack>
  );
};

export default CloseTicketsTab;
