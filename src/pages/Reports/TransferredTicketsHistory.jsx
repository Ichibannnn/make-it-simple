import React, { useEffect } from "react";
import { useGetTransferredTicketsQuery } from "../../features/api_reports/reportsApi";
import { AccessTimeOutlined, CalendarMonthOutlined, Search } from "@mui/icons-material";
import {
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
import moment from "moment";
import { theme } from "../../theme/theme";

import noRecordsFound from "../../assets/svg/noRecordsFound.svg";
import somethingWentWrong from "../../assets/svg/SomethingWentWrong.svg";

const TransferredTicketsHistory = ({
  search,
  searchValue,
  setSearchValue,
  serviceProvider,
  channel,
  user,
  dateFrom,
  dateTo,
  pageNumber,
  setPageNumber,
  pageSize,
  setPageSize,
  setSheetData,
}) => {
  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));

  const { data, isLoading, isFetching, isSuccess, isError } = useGetTransferredTicketsQuery({
    Search: search,
    serviceProvider: serviceProvider,
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
    <Stack sx={{ width: "100%" }}>
      <Stack>
        <Stack
          direction={isScreenSmall ? "column" : "row"}
          justifyContent="space-between"
          alignItems={isScreenSmall ? "left" : "center"}
          gap={isScreenSmall ? 0.5 : 0}
          mt={1}
          mb={1}
          ml={2}
          mr={2}
        >
          <Stack sx={{ fontSize: isScreenSmall ? "18px" : "1.5rem", fontWeight: isScreenSmall ? 600 : 700 }}>
            <Typography variant="h5">Transferred Tickets Report</Typography>
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

      <TableContainer>
        <Table size="small" stickyHeader sx={{ borderBottom: "none" }}>
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
                TRANSFERRED NO.
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
                REMARKS
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
                  >
                    {`${moment(item.requestedAt).format("YYYY")}-${item.ticketConcernId}`}
                  </TableCell>

                  <TableCell>
                    <Stack sx={{ width: "300px" }}>
                      <Typography sx={{ color: "#EDF2F7", fontSize: "12px", fontWeight: 500, wordBreak: "break-word" }}>
                        {item.concern_Details
                          ? item.concern_Details?.split("\r\n").map((line, index) => (
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
                    sx={{
                      color: "#EDF2F7",
                      fontSize: "12px",
                      fontWeight: 500,
                      "&:hover": {
                        background: "",
                        color: "#EDF2F7",
                      },
                    }}
                  >
                    <Stack gap={0.5}>
                      <Stack>
                        <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "#22B4BF" }}>Transferred by:</Typography>
                        <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>{item.transfered_By}</Typography>
                      </Stack>

                      <Stack>
                        <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "#22B4BF" }}>Approved by:</Typography>
                        <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>{item.approvedBy !== null ? item.approvedBy : "---"}</Typography>
                      </Stack>

                      <Stack>
                        <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "#22B4BF" }}>Transferred to:</Typography>
                        <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>{item.transfered_To}</Typography>
                      </Stack>
                    </Stack>
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
                  >
                    {item.transferTicketId}
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
                  >
                    <Stack gap={0.5}>
                      <Stack>
                        <Typography sx={{ fontSize: "12px", fontWeight: 600, fontWeight: 600, color: "#22B4BF" }}>Requested Date:</Typography>
                        <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>{moment(item.requested_Date).format("MMMM D, YYYY HH:mm")}</Typography>
                      </Stack>

                      <Stack>
                        <Typography sx={{ fontSize: "12px", fontWeight: 600, fontWeight: 600, color: "#22B4BF" }}>Previous Target Date:</Typography>
                        <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>{moment(item.previous_Target_Date).format("LL")}</Typography>
                      </Stack>

                      <Stack>
                        <Typography sx={{ fontSize: "12px", fontWeight: 600, fontWeight: 600, color: "#22B4BF" }}>Transferred Date:</Typography>
                        <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>{moment(item.transferredDate).format("MMMM D, YYYY HH:mm")}</Typography>
                      </Stack>

                      <Stack>
                        <Typography sx={{ fontSize: "12px", fontWeight: 600, fontWeight: 600, color: "#22B4BF" }}>Approved Date:</Typography>
                        <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>{moment(item.approved_At).format("MMMM D, YYYY HH:mm")}</Typography>
                      </Stack>

                      <Stack>
                        <Typography sx={{ fontSize: "12px", fontWeight: 600, fontWeight: 600, color: "#22B4BF" }}>New Target Date:</Typography>
                        <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>{moment(item.new_Target_Date).format("LL")}</Typography>
                      </Stack>
                    </Stack>
                  </TableCell>

                  <TableCell>
                    <Stack sx={{ width: "300px" }}>
                      <Typography sx={{ color: "#EDF2F7", fontSize: "12px", fontWeight: 500, wordBreak: "break-word" }}>
                        {item.remarks
                          ? item.remarks?.split("\r\n").map((line, index) => (
                              <span key={index}>
                                {line}
                                <br />
                              </span>
                            ))
                          : "--"}
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}

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
                <TableCell colSpan={14} align="center">
                  <CircularProgress />
                  <Typography variant="h5" color="#EDF2F7">
                    Please wait...
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {isSuccess && !data?.value?.reports.length && !isLoading && !isFetching && (
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
  );
};

export default TransferredTicketsHistory;
