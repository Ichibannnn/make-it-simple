import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Stack,
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
} from "@mui/material";
import { AccessTimeOutlined, CalendarMonthOutlined, Check, Close, Error, LocalOffer } from "@mui/icons-material";
import React, { useState } from "react";

import moment from "moment";
import { theme } from "../../../../theme/theme";
import useDisclosure from "../../../../hooks/useDisclosure";

import noRecordsFound from "../../../../assets/svg/noRecordsFound.svg";
import somethingWentWrong from "../../../../assets/svg/SomethingWentWrong.svg";
import TicketApprovalDialog from "./TicketApprovalDialog";
import useSignalRConnection from "../../../../hooks/useSignalRConnection";
import { LoadingButton } from "@mui/lab";
import { useApproveTicketMutation } from "../../../../features/api_ticketing/approver/ticketApprovalApi";
import { toast, Toaster } from "sonner";
import Swal from "sweetalert2";
import { DisapproveSelectedDialog } from "./DisapprovedDialog";

const TicketApproval = ({ data, isLoading, isFetching, isSuccess, isError, setPageNumber, setPageSize }) => {
  const [viewApprovalData, setViewApprovalData] = useState(null);
  const [selectedTickets, setSelectedTickets] = useState([]);

  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));
  useSignalRConnection();

  const { open, onToggle, onClose } = useDisclosure();
  const { open: disapproveSelectedOpen, onToggle: disapproveSelectedOnToggle, onClose: disapproveSelectedOnClose } = useDisclosure();
  const [approveTicket, { isLoading: approveTicketIsLoading, isFetching: approveTicketIsFetching }] = useApproveTicketMutation();

  const onPageNumberChange = (_, page) => {
    setPageNumber(page + 1);
  };

  const onPageSizeChange = (e) => {
    setPageSize(e.target.value);
    setPageNumber(1);
  };

  const onDialogClose = () => {
    setViewApprovalData(null);
    onClose();
  };

  const onViewAction = (data) => {
    onToggle();
    setViewApprovalData(data);
  };

  const dummyData = {
    value: {
      closingTicket: [
        {
          ticketConcernId: 1,
          fullname: "Issue Handler 1",
          department_Name: "Department 1",
          channel_Name: "Channel 1",
          concern_Details: "Wdawsdasdasdasdasd",
          target_Date: "2025-03-05T10:35:22.6169923",
        },
        {
          ticketConcernId: 2,
          fullname: "Issue Handler 2",
          department_Name: "Department 2",
          channel_Name: "Channel 2",
          concern_Details: "Wdawsdasdasdasdasd",
          target_Date: "2025-03-05T10:35:22.6169923",
        },
        {
          ticketConcernId: 3,
          fullname: "Issue Handler 3",
          department_Name: "Department 3",
          channel_Name: "Channel 3",
          concern_Details: "Wdawsdasdasdasdasd",
          target_Date: "2025-03-05T10:35:22.6169923",
        },
        {
          ticketConcernId: 4,
          fullname: "Issue Handler 4",
          department_Name: "Department 4",
          channel_Name: "Channel 4",
          concern_Details: "Wdawsdasdasdasdasd",
          target_Date: "2025-03-05T10:35:22.6169923",
        },
        {
          ticketConcernId: 5,
          fullname: "Issue Handler 5",
          department_Name: "Department 5",
          channel_Name: "Channel 5",
          concern_Details: "Wdawsdasdasdasdasd",
          target_Date: "2025-03-05T10:35:22.6169923",
        },
      ],
    },
  };

  console.log("Dummy Data: ", dummyData);
  console.log("Approval Data: ", data);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allTicketIds = data?.value?.closingTicket.map((item) => item.ticketConcernId) || [];
      setSelectedTickets(allTicketIds);
    } else {
      setSelectedTickets([]);
    }
  };

  const handleSelectTicket = (item) => {
    setSelectedTickets((prevSelected) => (prevSelected.includes(item) ? prevSelected.filter((id) => id !== item) : [...prevSelected, item]));
  };

  const handleApproveSelected = () => {
    const payload = {
      approveClosingRequests: selectedTickets.map((item) => ({
        closingTicketId: item,
      })),
    };

    console.log("payload:", payload);

    // Swal.fire({
    //   title: "Confirmation",
    //   text: "Close selected tickets?",
    //   icon: "info",
    //   color: "white",
    //   showCancelButton: true,
    //   background: "#111927",
    //   confirmButtonColor: "#9e77ed",
    //   confirmButtonText: "Yes",
    //   cancelButtonText: "No",
    //   cancelButtonColor: "#1C2536",
    //   heightAuto: false,
    //   width: "30em",
    //   customClass: {
    //     container: "custom-container",
    //     title: "custom-title",
    //     htmlContainer: "custom-text",
    //     icon: "custom-icon",
    //     confirmButton: "custom-confirm-btn",
    //     cancelButton: "custom-cancel-btn",
    //   },
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     approveTicket(payload)
    //       .unwrap()
    //       .then(() => {
    //         toast.success("Success!", {
    //           description: "Ticket approved successfully!",
    //           duration: 1500,
    //         });
    //         setSelectedTickets([]);
    //       })
    //       .catch((err) => {
    //         console.log("Error", err);
    //         toast.error("Error!", {
    //           description: err.data.error.message,
    //           duration: 1500,
    //         });
    //       });
    //   }
    // });
  };

  const handleDisapproveSelected = () => {
    disapproveSelectedOnToggle();
  };

  return (
    <Stack sx={{ width: "100%" }}>
      <Toaster richColors position="top-right" closeButton />

      {selectedTickets.length > 0 && (
        <Stack
          direction={isScreenSmall ? "column" : "row"}
          alignItems={isScreenSmall ? "left" : "center"}
          justifyContent="space-between"
          gap={0.5}
          sx={{ padding: "10px 20px", backgroundColor: theme.palette.bgForm.black2, borderRadius: "20px", marginBottom: 1 }}
        >
          <Stack direction="row" gap={0.5}>
            <LocalOffer />
            <Typography>
              {selectedTickets.length} {""}
              {selectedTickets.length > 1 ? "Tickets selected" : "Ticket selected"}
            </Typography>
          </Stack>

          <Stack direction="row" gap={0.5}>
            <LoadingButton variant="contained" color="success" onClick={handleApproveSelected} loading={approveTicketIsLoading || approveTicketIsFetching} startIcon={<Check />}>
              Approve
            </LoadingButton>

            <LoadingButton variant="contained" color="error" onClick={handleDisapproveSelected} loading={approveTicketIsLoading || approveTicketIsFetching} startIcon={<Close />}>
              Disapprove
            </LoadingButton>
          </Stack>
        </Stack>
      )}

      {isScreenSmall ? (
        // Card

        <>
          <Stack direction="row" sx={{ width: "100%", mb: 2, justifyContent: "left", alignItems: "center", backgroundColor: "#2A2C4D" }}>
            <Checkbox
              indeterminate={selectedTickets.length > 0 && selectedTickets.length < (data?.value?.closingTicket?.length || 0)}
              checked={(data?.value?.closingTicket?.length || 0) > 0 && selectedTickets.length === (data?.value?.closingTicket?.length || 0)}
              onChange={handleSelectAll}
              inputProps={{ "aria-label": "select all tickets" }}
            />
            <Typography>Select All</Typography>
          </Stack>

          <Stack spacing={2}>
            {isSuccess &&
              !isLoading &&
              !isFetching &&
              data?.value?.closingTicket?.map((item, index) => {
                const isSelected = selectedTickets.includes(item.ticketConcernId);

                return (
                  <Card key={index} sx={{ backgroundColor: isSelected ? "#1E2034" : theme.palette.bgForm.black3, borderRadius: "15px", borderColor: "#2D3748" }}>
                    <CardContent
                      sx={{
                        cursor: "pointer",
                        padding: "1px",
                        "&:hover": {
                          backgroundColor: "#1A222F",
                          color: "#9e77ed", // Change the text color when hovering
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
                        <Stack>
                          <Checkbox
                            checked={selectedTickets.includes(item.ticketConcernId)}
                            onChange={() => handleSelectTicket(item.ticketConcernId)}
                            inputProps={{ "aria-label": `select ticket ${item.ticketConcernId}` }}
                          />
                        </Stack>

                        <Stack spacing={1} onClick={() => onViewAction(item)}>
                          <Stack mb={2}>
                            <Typography sx={{ fontWeight: 500, fontSize: "17px", color: theme.palette.primary.main }}>{item.fullname}</Typography>
                            <Typography sx={{ fontWeight: 500, fontSize: "14px", color: "#EDF2F7" }}>{item.department_Name}</Typography>
                            <Typography sx={{ fontWeight: 500, fontSize: "12px", color: theme.palette.text.secondary }}>{item.channel_Name}</Typography>
                          </Stack>

                          <Stack direction="row" gap={0.5} alignItems="center">
                            <Typography sx={{ fontWeight: 700, fontSize: "0.775rem", lineHeight: 1.57, color: "#D65DB1" }}>TICKET NUMBER:</Typography>
                            <Typography sx={{ fontWeight: 400, fontSize: "0.775rem", lineHeight: 1.57, color: theme.palette.text.main }}>{item.ticketConcernId}</Typography>
                          </Stack>

                          <Stack direction="row" gap={0.5} alignItems="center">
                            <Typography sx={{ fontWeight: 700, fontSize: "0.775rem", lineHeight: 1.57, color: "#D65DB1" }}>TICKET DESCRIPTION:</Typography>
                            <Typography sx={{ fontWeight: 400, fontSize: "0.775rem", lineHeight: 1.57, color: theme.palette.text.main }}>
                              {item.concern_Details?.split("\r\n").map((line, index) => (
                                <span key={index}>
                                  {line}
                                  <br />
                                </span>
                              ))}
                            </Typography>
                          </Stack>

                          <Stack direction="row" gap={0.5} alignItems="center">
                            <Typography sx={{ fontWeight: 700, fontSize: "0.775rem", lineHeight: 1.57, color: "#D65DB1" }}>TARGET DATE:</Typography>
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
                          </Stack>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                );
              })}

            {/* {isError && (
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

              {isSuccess && !data?.value?.requestConcern.length && (
                <Stack justifyContent="center" alignItems="center" padding={4}>
                  <img src={noRecordsFound} alt="No Records Found" className="norecords-found-table" />
                  <Typography variant="h6" align="center">
                    No records found.
                  </Typography>
                </Stack>
              )} */}

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
        </>
      ) : (
        <>
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
                      TARGET DATE
                    </Stack>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {data?.value?.closingTicket?.map((item) => {
                  const isSelected = selectedTickets.includes(item.ticketConcernId);

                  return (
                    <TableRow
                      key={item.ticketConcernId}
                      sx={{
                        backgroundColor: isSelected ? "#1E2034" : "transparent",
                      }}
                    >
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
                          checked={selectedTickets.includes(item.ticketConcernId)}
                          onChange={() => handleSelectTicket(item.ticketConcernId)}
                          inputProps={{ "aria-label": `select ticket ${item.ticketConcernId}` }}
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

                      <Tooltip title={item?.concern_Details} placement="bottom-start">
                        <TableCell
                          // className="ellipsis-styling"
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "12px",
                            fontWeight: 500,
                            maxWidth: "300px",
                          }}
                          onClick={() => onViewAction(item)}
                        >
                          {item.concern_Details?.split("\r\n").map((line, index) => (
                            <span key={index}>
                              {line}
                              <br />
                            </span>
                          ))}
                        </TableCell>
                      </Tooltip>

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
                    </TableRow>
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

                {/* {/* {(isLoading || isFetching) && (
        <TableRow>
          <TableCell colSpan={7} align="center">
            <CircularProgress />
            <Typography variant="h5" color="#EDF2F7">
              Please wait...
            </Typography>
          </TableCell>
        </TableRow>
      )} */}

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
        </>
      )}

      <TicketApprovalDialog data={viewApprovalData} open={open} onClose={onDialogClose} />
      <DisapproveSelectedDialog open={disapproveSelectedOpen} onClose={disapproveSelectedOnClose} selectedTickets={selectedTickets} setSelectedTickets={setSelectedTickets} />
    </Stack>
  );
};

export default TicketApproval;
