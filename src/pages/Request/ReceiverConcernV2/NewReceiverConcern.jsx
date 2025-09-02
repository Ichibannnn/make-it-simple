import {
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  OutlinedInput,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { AccessTimeOutlined, CalendarMonthOutlined, FlashOn, Search } from "@mui/icons-material";

import { useState } from "react";
import moment from "moment";

import { theme } from "../../../theme/theme";
import useDebounce from "../../../hooks/useDebounce";
import useDisclosure from "../../../hooks/useDisclosure";

import noRecordsFound from "../../../assets/svg/noRecordsFound.svg";
import somethingWentWrong from "../../../assets/svg/SomethingWentWrong.svg";

import { useGetNotificationQuery } from "../../../features/api_notification/notificationApi";
import { useGetReceiverConcernsQuery } from "../../../features/api_request/concerns_receiver/concernReceiverApi";

import ViewConcernDetails from "./ViewConcernDetails";
import ReceiverAddTicketDialog from "../ConcernTickets_Receiver/ReceiverAddTicketDialog";
import AssignTicketDrawer from "./AssignTicketDrawer";

const NewReceiverConcern = () => {
  const [approveStatus, setApproveStatus] = useState("false");
  const [concernDetails, setConcernDetails] = useState(null);

  const [selectedConcernNo, setSelectedConcernNo] = useState([]);
  const [selectedTicketNo, setSelectedTicketNo] = useState([]);

  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue, 500);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  // useSignalRConnection();
  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));

  const { data: notificationBadge } = useGetNotificationQuery();
  const { data, isLoading, isFetching, isSuccess, isError } = useGetReceiverConcernsQuery({
    is_Approve: approveStatus,
    Search: search,
    PageNumber: pageNumber,
    PageSize: pageSize,
  });

  const { open: viewConcernDetailsOpen, onToggle: viewConcernDetailsOnToggle, onClose: viewConcernDetailsOnClose } = useDisclosure();
  const { open: addTicketOpen, onToggle: addTicketOnToggle, onClose: addTicketOnClose } = useDisclosure();
  const { open: assignMultipleOpen, onToggle: assignMultipleOnToggle, onClose: assignMultipleOnClose } = useDisclosure();

  const onPageNumberChange = (_, page) => {
    setPageNumber(page + 1);
  };

  const onPageSizeChange = (e) => {
    setPageSize(e.target.value);
    setPageNumber(1);
  };

  const onViewAction = (data) => {
    setConcernDetails(data);
    viewConcernDetailsOnToggle();
  };

  const handleSelectAll = (event) => {
    // if (event.target.checked) {
    //   const allTicketIds = data?.value?.closingTicket.map((item) => item.closingTicketId) || [];
    //   setSelectedConcernNo(allTicketIds);
    // } else {
    //   setSelectedConcernNo([]);
    // }
  };

  const handleSelectTicket = (item) => {
    // setSelectedTickets((prevSelected) => (prevSelected.includes(item) ? prevSelected.filter((id) => id !== item) : [...prevSelected, item]));
  };

  const handleApproveSelected = () => {
    // console.log("payload:", payload);
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
    //         dispatch(notificationApi.util.resetApiState());
    //         dispatch(notificationMessageApi.util.resetApiState());
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

  return (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: theme.palette.bgForm.black1,
        color: "#fff",
        padding: isScreenSmall ? "20px" : "7px 94px 34px 94px",
      }}
    >
      <Stack>
        <Stack width="100%" justifyContent="space-between" sx={{ flexDirection: isScreenSmall ? "column" : "row" }}>
          <Typography variant={isScreenSmall ? "h5" : "h4"}>Concerns</Typography>
          <Stack justifyItems="space-between" direction="row" marginTop={1}></Stack>
        </Stack>

        <Stack
          sx={{
            backgroundColor: theme.palette.bgForm.black3,
            borderRadius: "20px",
            marginTop: "10px",
            width: "100%",
          }}
        >
          <Stack sx={{ width: "100%", padding: 3, gap: 1 }}>
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

          {isScreenSmall ? (
            // Cards
            <>
              <Stack spacing={2}>
                {isSuccess &&
                  !isLoading &&
                  !isFetching &&
                  data?.value?.requestConcern?.map((item, index) => {
                    const isSelected = selectedConcernNo.includes(item.ticketConcernId);

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
                              padding: 2,
                            }}
                          >
                            <Stack>
                              <Checkbox
                                checked={selectedConcernNo.includes(item.requestConcernId)}
                                onChange={() => handleSelectTicket(item.requestConcernId)}
                                inputProps={{ "aria-label": `select ticket ${item?.ticketRequestConcerns[0]?.ticketConcernId}` }}
                              />
                            </Stack>

                            <Stack spacing={1} onClick={() => onViewAction(item)}>
                              <Stack mb={2}>
                                <Stack direction="row" gap={0.5} alignItems="center">
                                  <Typography sx={{ fontWeight: 500, fontSize: "17px", color: "#EDF2F7" }}>{item.fullName}</Typography>

                                  {item.severity === "Urgent" && <FlashOn color="warning" />}
                                </Stack>

                                <Typography sx={{ fontWeight: 500, fontSize: "12px", color: theme.palette.text.secondary }}>
                                  {item.department_Code} - {item.department_Name}{" "}
                                </Typography>
                                <Typography sx={{ fontWeight: 500, fontSize: "12px", color: theme.palette.text.secondary }}>
                                  {item.location_Code} - {item.location_Name}
                                </Typography>
                              </Stack>

                              <Stack direction="row" gap={0.5} alignItems="center">
                                <Typography sx={{ fontWeight: 700, fontSize: "0.775rem", lineHeight: 1.57, color: "#D65DB1" }}>TICKET NUMBER:</Typography>
                                <Typography sx={{ fontWeight: 400, fontSize: "0.775rem", lineHeight: 1.57, color: theme.palette.text.main }}>
                                  {item.ticketRequestConcerns[0]?.ticketConcernId}
                                </Typography>
                              </Stack>

                              <Stack direction="row">
                                <Typography sx={{ fontWeight: 700, fontSize: "0.775rem", lineHeight: 1.57, color: "#D65DB1" }}>CONCERN: </Typography>
                                <Typography sx={{ fontWeight: 400, fontSize: "0.775rem", lineHeight: 1.57, color: theme.palette.text.main }}>
                                  {item.concern.split("\r\n").map((line, index) => (
                                    <span key={index}>
                                      {line}
                                      <br />
                                    </span>
                                  ))}
                                </Typography>
                              </Stack>

                              <Stack direction="row" gap={0.5} alignItems="center">
                                <Typography sx={{ fontWeight: 700, fontSize: "0.775rem", lineHeight: 1.57, color: "#D65DB1" }}>SERVICE PROVIDER:</Typography>
                                <Typography sx={{ fontWeight: 400, fontSize: "0.775rem", lineHeight: 1.57, color: theme.palette.text.main }}>{item.serviceProviderName}</Typography>
                              </Stack>

                              <Stack direction="row" gap={0.5} alignItems="center">
                                <Typography sx={{ fontWeight: 700, fontSize: "0.775rem", lineHeight: 1.57, color: "#D65DB1" }}>CHANNEL:</Typography>
                                <Typography sx={{ fontWeight: 400, fontSize: "0.775rem", lineHeight: 1.57, color: theme.palette.text.main }}>
                                  {item.channel_Name ? item.channel_Name : "--"}
                                </Typography>
                              </Stack>

                              <Stack direction="row" gap={0.5} alignItems="center">
                                <Typography sx={{ fontWeight: 700, fontSize: "0.775rem", lineHeight: 1.57, color: "#D65DB1" }}>DATE CREATED:</Typography>
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
                              </Stack>

                              <Stack direction="row" gap={0.5} alignItems="center">
                                <Typography sx={{ fontWeight: 700, fontSize: "0.775rem", lineHeight: 1.57, color: "#D65DB1" }}>DATE NEEDED:</Typography>
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
                                  label={moment(item.date_Needed).format("LL")}
                                />
                              </Stack>
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
                    );
                  })}

                {isError && (
                  <Stack justifyContent="center" alignItems="center" padding={4}>
                    <img src={somethingWentWrong} alt="Something Went Wrong" className="something-went-wrong-table" />
                    <Typography variant="h6" align="center">
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
                <Table stickyHeader size="small" sx={{ borderBottom: "none" }}>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          background: "#1C2536",
                          color: "#D65DB1",
                          fontWeight: 700,
                          fontSize: "11px",
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
                          fontSize: "11px",
                        }}
                      >
                        REQUESTOR
                      </TableCell>

                      <TableCell
                        sx={{
                          background: "#1C2536",
                          color: "#D65DB1",
                          fontWeight: 700,
                          fontSize: "11px",
                        }}
                      >
                        CONCERN
                      </TableCell>

                      <TableCell
                        sx={{
                          background: "#1C2536",
                          color: "#D65DB1",
                          fontWeight: 700,
                          fontSize: "11px",
                        }}
                      >
                        SERVICE PROVIDER
                      </TableCell>

                      <TableCell
                        sx={{
                          background: "#1C2536",
                          color: "#D65DB1",
                          fontWeight: 700,
                          fontSize: "11px",
                        }}
                      >
                        CHANNEL
                      </TableCell>

                      <TableCell
                        sx={{
                          background: "#1C2536",
                          color: "#D65DB1",
                          fontWeight: 700,
                          fontSize: "11px",
                        }}
                      >
                        DATE CREATED
                      </TableCell>

                      <TableCell
                        sx={{
                          background: "#1C2536",
                          color: "#D65DB1",
                          fontWeight: 700,
                          fontSize: "11px",
                        }}
                      >
                        DATE NEEDED
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {isSuccess &&
                      !isLoading &&
                      !isFetching &&
                      data?.value?.requestConcern?.map((item) => {
                        return (
                          <TableRow
                            key={item.requestConcernId}
                            sx={{
                              backgroundColor: "transparent",
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
                              <Stack sx={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
                                {item.severity === "Urgent" && <FlashOn color="warning" />}
                                <Typography sx={{ fontSize: "12px" }}>{item.ticketRequestConcerns[0]?.ticketConcernId}</Typography>
                              </Stack>
                            </TableCell>

                            <TableCell
                              sx={{
                                width: "200px",
                              }}
                              onClick={() => onViewAction(item)}
                            >
                              <Typography
                                sx={{
                                  color: "#EDF2F7",
                                  fontSize: "14px",
                                  fontWeight: 500,
                                }}
                              >
                                {item.fullName}
                              </Typography>
                              <Typography
                                sx={{
                                  color: theme.palette.text.secondary,
                                  fontSize: "12px",
                                  fontWeight: 500,
                                }}
                              >
                                {item.department_Code} - {item.department_Name}
                              </Typography>

                              <Typography
                                sx={{
                                  color: theme.palette.text.secondary,
                                  fontSize: "12px",
                                  fontWeight: 500,
                                }}
                              >
                                {item.location_Code} - {item.location_Name}
                              </Typography>
                            </TableCell>

                            <Tooltip
                              title={item.concern.split("\r\n").map((line, index) => (
                                <span key={index}>
                                  {line}
                                  <br />
                                </span>
                              ))}
                              placement="bottom-start"
                            >
                              <TableCell
                                className="ellipsis-styling"
                                sx={{
                                  color: "#EDF2F7",
                                  fontSize: "12px",
                                  fontWeight: 500,
                                  minWidth: "300px",
                                  maxWidth: "300px",
                                  "&:hover": {
                                    background: "",
                                    color: "#EDF2F7",
                                  },
                                }}
                                onClick={() => onViewAction(item)}
                              >
                                {item.concern?.split("\r\n").map((line, index) => (
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
                                "&:hover": {
                                  background: "",
                                  color: "#EDF2F7",
                                },
                              }}
                              onClick={() => onViewAction(item)}
                            >
                              {item.serviceProviderName}
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
                              {item.channel_Name}
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
                              {moment(item.created_At).format("LL")}
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
                              {moment(item.date_Needed).format("LL")}
                            </TableCell>
                          </TableRow>
                        );
                      })}

                    {isError && (
                      <TableRow>
                        <TableCell colSpan={10} align="center">
                          <img src={somethingWentWrong} alt="Something Went Wrong" className="something-went-wrong-table" />
                          <Typography variant="h5" color="#EDF2F7" marginLeft={2}>
                            Something went wrong.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}

                    {(isLoading || isFetching) && (
                      <TableRow>
                        <TableCell colSpan={10} align="center">
                          <CircularProgress />
                          <Typography variant="h5" color="#EDF2F7">
                            Please wait...
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}

                    {isSuccess && !data?.value?.requestConcern.length && !isLoading && !isFetching && (
                      <TableRow>
                        <TableCell colSpan={10} align="center">
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
            </>
          )}

          {viewConcernDetailsOpen && <ViewConcernDetails data={concernDetails} setData={setConcernDetails} open={viewConcernDetailsOpen} onClose={viewConcernDetailsOnClose} />}
          {addTicketOpen && <ReceiverAddTicketDialog open={addTicketOpen} onClose={addTicketOnClose} />}
          {assignMultipleOpen && <AssignTicketDrawer open={assignMultipleOpen} onClose={assignMultipleOnClose} />}

          {/* <MultipleAssignDialog selectedTickets={selectedTickets} open={assignMultipleOpen} onClose={assignMultipleOnClose} /> */}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default NewReceiverConcern;
