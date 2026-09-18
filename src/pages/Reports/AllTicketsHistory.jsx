import { Search } from "@mui/icons-material";
import {
  Chip,
  CircularProgress,
  OutlinedInput,
  Paper,
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
import moment from "moment";
import { theme } from "../../theme/theme";

import noRecordsFound from "../../assets/svg/noRecordsFound.svg";
import somethingWentWrong from "../../assets/svg/SomethingWentWrong.svg";
import { useGetAllTicketsQuery } from "../../features/api_reports/reportsApi";
import { useEffect } from "react";

const AllTicketsHistory = ({ search, searchValue, setSearchValue, serviceProvider, channel, user, dateFrom, dateTo, pageNumber, setPageNumber, pageSize, setPageSize, setSheetData }) => {
  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));
  // ALL TICKETS API ~~~~
  const { data, isLoading, isFetching, isSuccess, isError } = useGetAllTicketsQuery({
    Search: search,
    ServiceProvider: serviceProvider,
    Channel: channel,
    UserId: user,
    Date_From: moment(dateFrom).format("YYYY-MM-DD"),
    Date_To: moment(dateTo).format("YYYY-MM-DD"),
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

  useEffect(() => {
    if (data?.value?.reports.length) {
      setSheetData(data?.value?.reports);
    }
  }, [data?.value?.reports.length]);

  return (
    <>
      <Stack sx={{ width: "100%" }}>
        <Stack sx={{ width: "100%" }}>
          <Stack direction={isScreenSmall ? "column" : "row"} justifyContent="space-between" alignItems={isScreenSmall ? "left" : "center"} gap={isScreenSmall ? 0.5 : 0} mt={1} mb={1} ml={2} mr={2}>
            <Stack>
              <Typography sx={{ fontSize: isScreenSmall ? "18px" : "1.5rem", fontWeight: isScreenSmall ? 600 : 700 }}>All Tickets Report</Typography>
            </Stack>

            <Stack>
              <OutlinedInput
                placeholder="Search"
                startAdornment={<Search sx={{ marginRight: 0.5, color: "#A0AEC0" }} />}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                sx={{
                  // width: 400,
                  borderRadius: "15px",
                  fontSize: "small",
                  fontWeight: 400,
                  lineHeight: "1.4375rem",
                }}
              />
            </Stack>
          </Stack>
        </Stack>

        <Paper sx={{ width: "100%", overflow: "auto" }}>
          <TableContainer>
            <Table stickyHeader size="small" sx={{ borderBottom: "none" }}>
              <TableHead sx={{ whiteSpace: "nowrap" }}>
                <TableRow>
                  <TableCell
                    sx={{
                      background: "#1C2536",
                      color: "#D65DB1",
                      fontWeight: 700,
                      fontSize: "12px",
                    }}
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
                    SERVICE PROVIDER
                  </TableCell>

                  <TableCell
                    sx={{
                      background: "#1C2536",
                      color: "#D65DB1",
                      fontWeight: 700,
                      fontSize: "12px",
                    }}
                  >
                    CHANNEL
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

                  <TableCell
                    sx={{
                      background: "#1C2536",
                      color: "#D65DB1",
                      fontWeight: 700,
                      fontSize: "12px",
                    }}
                  >
                    DATE
                  </TableCell>

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

                  <TableCell
                    sx={{
                      background: "#1C2536",
                      color: "#D65DB1",
                      fontWeight: 700,
                      fontSize: "12px",
                    }}
                  >
                    PERSONNEL
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
                  >
                    RESOLUTION
                  </TableCell>

                  <TableCell
                    sx={{
                      background: "#1C2536",
                      color: "#D65DB1",
                      fontWeight: 700,
                      fontSize: "12px",
                    }}
                  >
                    NOTES
                  </TableCell>

                  <TableCell
                    sx={{
                      background: "#1C2536",
                      color: "#D65DB1",
                      fontWeight: 700,
                      fontSize: "12px",
                    }}
                  >
                    OTHER INFORMATION
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {isSuccess &&
                  !isLoading &&
                  !isFetching &&
                  data?.value?.reports?.map((item, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:hover": {
                          background: "",
                          color: "#EDF2F7",
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          color: "#22B4BF",
                          fontSize: "12px",
                          fontWeight: 800,
                        }}
                        align="center"
                      >
                        {`${moment(item.requestedAt).format("YYYY")}-${item.ticketConcernId}`}
                      </TableCell>

                      <Tooltip title={item?.concerns} placement="bottom-start">
                        <TableCell
                          className="ellipsis-styling"
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "12px",
                            fontWeight: 500,
                            width: "100px",
                          }}
                        >
                          {item.concerns?.split("\r\n").map((line, index) => (
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
                      >
                        {item.serviceProviderName}
                      </TableCell>

                      <TableCell
                        sx={{
                          color: "#EDF2F7",
                          fontSize: "12px",
                          fontWeight: 500,
                        }}
                      >
                        {item.channel_Name}
                      </TableCell>

                      <TableCell
                        className="ellipsis-styling"
                        sx={{
                          color: "#EDF2F7",
                          width: "500px",
                        }}
                      >
                        <Stack gap={0.5}>
                          <Stack>
                            <Typography sx={{ fontSize: "12px", fontWeight: 600, fontWeight: 600, color: "#22B4BF" }}>Category:</Typography>
                            <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>{item.ticketCategoryDescriptions ? item.ticketCategoryDescriptions : "--"}</Typography>
                          </Stack>

                          <Stack>
                            <Typography sx={{ fontSize: "12px", fontWeight: 600, fontWeight: 600, color: "#22B4BF" }}>Sub Category:</Typography>
                            <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>{item.ticketSubCategoryDescriptions ? item.ticketSubCategoryDescriptions : "--"}</Typography>
                          </Stack>

                          <Stack>
                            <Typography sx={{ fontSize: "12px", fontWeight: 600, fontWeight: 600, color: "#22B4BF" }}>Concern Category:</Typography>
                            <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>{item.categoryConcern ? item.categoryConcern : "--"}</Typography>
                          </Stack>
                        </Stack>
                      </TableCell>

                      <TableCell
                        className="ellipsis-styling"
                        sx={{
                          color: "#EDF2F7",
                          width: "500px",
                        }}
                      >
                        <Stack gap={0.5}>
                          <Stack>
                            <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "#22B4BF" }}>Start Date:</Typography>
                            <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>{moment(item.startDate).format("MMMM D, YYYY HH:mm")}</Typography>
                          </Stack>

                          <Stack>
                            <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "#22B4BF" }}>Target Date:</Typography>
                            <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>{moment(item.target_Date).format("LL")}</Typography>
                          </Stack>

                          <Stack>
                            <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "#22B4BF" }}>For Closing Date:</Typography>
                            <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>{item?.forClosedDate ? moment(item.forClosedDate).format("MMMM D, YYYY HH:mm") : "--"}</Typography>
                          </Stack>

                          <Stack>
                            <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "#22B4BF" }}>Closed Date:</Typography>
                            <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>{item?.closedDate ? moment(item.closedDate).format("MMMM D, YYYY HH:mm") : "--"}</Typography>
                          </Stack>
                        </Stack>
                      </TableCell>

                      <TableCell
                        sx={{
                          color: "#EDF2F7",
                          fontSize: "12px",
                          fontWeight: 500,
                        }}
                        align="center"
                      >
                        {item.aging_Days ? item?.aging_Days : "--"}
                      </TableCell>

                      <TableCell
                        className="ellipsis-styling"
                        sx={{
                          color: "#EDF2F7",
                          width: "500px",
                        }}
                      >
                        <Stack gap={0.5}>
                          <Stack>
                            <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "#22B4BF" }}>Requestor:</Typography>
                            <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>{item.requestor_Name}</Typography>
                          </Stack>

                          <Stack>
                            <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "#22B4BF" }}>Issue Handler:</Typography>
                            <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>{item.personnel}</Typography>
                          </Stack>

                          <Stack>
                            <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "#22B4BF" }}>Technicians:</Typography>
                            <Typography sx={{ fontSize: "12px", fontWeight: 500 }}> {item.technicians ? item.technicians : "--"}</Typography>
                          </Stack>
                        </Stack>
                      </TableCell>

                      <TableCell
                        className="ellipsis-styling"
                        sx={{
                          color: "#EDF2F7",
                          width: "500px",
                        }}
                      >
                        <Stack gap={0.5}>
                          <Stack>
                            <Chip
                              size="small"
                              label={
                                item.ticket_Status === "Open"
                                  ? "Open"
                                  : item.ticket_Status === "Transfer"
                                    ? "Transfer"
                                    : item.ticket_Status === "For On-Hold"
                                      ? "Hold Approval"
                                      : item.ticket_Status === "On-Hold"
                                        ? "On-Hold"
                                        : item.ticket_Status === "For Closing Ticket"
                                          ? "For Closing"
                                          : item.ticket_Status === "Confirmation"
                                            ? "For Confirmation"
                                            : item.ticket_Status === "Closed"
                                              ? "Closed"
                                              : "--"
                              }
                              sx={{
                                backgroundColor:
                                  item.ticket_Status === "Open"
                                    ? "#ec9d29"
                                    : item.ticket_Status === "Transfer"
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
                                fontSize: "12px",
                              }}
                            />
                          </Stack>

                          <Stack>
                            <Chip
                              variant="filled"
                              size="small"
                              label={item.closingStatus === "On-Time" ? "On-Time" : item.closingStatus === "Delayed" ? "Delayed" : "--"}
                              sx={{
                                backgroundColor: item.closingStatus === "Delayed" ? "#ff7043" : item.closingStatus === "On-Time" ? "#00913c" : "transparent",
                                color: "#ffffffde",
                                borderRadius: "20px",
                                fontSize: "12px",
                              }}
                            />
                          </Stack>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Stack sx={{ width: "300px" }}>
                          <Typography
                            sx={{
                              color: "#EDF2F7",
                              fontSize: "12px",
                              fontWeight: 500,
                              wordBreak: "break-word",
                            }}
                          >
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
                      </TableCell>

                      <TableCell>
                        <Stack sx={{ width: "300px" }}>
                          <Typography
                            sx={{
                              color: "#EDF2F7",
                              fontSize: "12px",
                              fontWeight: 500,
                              wordBreak: "break-word",
                            }}
                          >
                            {item.notes
                              ? item.notes?.split("\r\n").map((line, index) => (
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
                      >
                        <Stack gap={0.5}>
                          <Stack>
                            <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "#22B4BF" }}>Backdate:</Typography>
                            <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>{item.backDate ? moment(item.backDate).format("LL") : "--"}</Typography>
                          </Stack>

                          <Stack>
                            <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "#22B4BF" }}>Backdate Remarks:</Typography>
                            <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>
                              {item.backDateRemarks
                                ? item.backDateRemarks?.split("\r\n").map((line, index) => (
                                    <span key={index}>
                                      {line}
                                      <br />
                                    </span>
                                  ))
                                : "--"}
                            </Typography>
                          </Stack>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}

                {isError && (
                  <TableRow>
                    <TableCell colSpan={12} align="center" sx={{ height: "400px" }}>
                      <img src={somethingWentWrong} alt="Something Went Wrong" className="something-went-wrong-table" />
                      <Typography variant="h5" color="#EDF2F7" marginLeft={2}>
                        Something went wrong.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}

                {(isLoading || isFetching) && (
                  <TableRow>
                    <TableCell colSpan={12} align="center" sx={{ height: "400px" }}>
                      <CircularProgress />
                      <Typography variant="h5" color="#EDF2F7">
                        Please wait...
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}

                {isSuccess && !data?.value?.reports?.length && !isLoading && !isFetching && (
                  <TableRow>
                    <TableCell colSpan={12} align="center" sx={{ height: "400px" }}>
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
        </Paper>

        <TablePagination
          sx={{ color: "#A0AEC0", fontWeight: 400, borderRadius: "0px 0px 20px 20px" }}
          rowsPerPageOptions={[100, 300, 500, { value: data?.value?.totalCount, label: "All" }]}
          component="div"
          count={data?.value?.totalCount || 0}
          rowsPerPage={data?.value?.pageSize || 100}
          page={data?.value?.currentPage - 1 || 0}
          onPageChange={onPageNumberChange}
          onRowsPerPageChange={onPageSizeChange}
        />
      </Stack>
    </>
  );
};

export default AllTicketsHistory;
