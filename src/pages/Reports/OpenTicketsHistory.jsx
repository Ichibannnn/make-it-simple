import React, { useEffect } from "react";
import { useGetOpenTicketsQuery } from "../../features/api_reports/reportsApi";
import { CalendarMonthOutlined, Search } from "@mui/icons-material";
import { Chip, OutlinedInput, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography, useMediaQuery } from "@mui/material";
import moment from "moment";
import { theme } from "../../theme/theme";

import noRecordsFound from "../../assets/svg/noRecordsFound.svg";
import somethingWentWrong from "../../assets/svg/SomethingWentWrong.svg";

const OpenTicketsHistory = ({ search, searchValue, setSearchValue, unit, user, dateFrom, dateTo, pageNumber, setPageNumber, pageSize, setPageSize, setSheetData }) => {
  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));
  const { data, isLoading, isFetching, isSuccess, isError } = useGetOpenTicketsQuery({
    Search: search,
    Unit: unit,
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
          <Stack>
            <Typography sx={{ fontSize: isScreenSmall ? "18px" : "1.5rem", fontWeight: isScreenSmall ? 600 : 700 }}>Open Tickets Report</Typography>
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
        <TableContainer sx={{ minHeight: "500px", maxHeight: "500px" }}>
          <Table stickyHeader size="small" sx={{ borderBottom: "none" }}>
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
                  SUB CATEGORY
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
                  TARGET DATE
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
                  ISSUE HANDLER
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isSuccess &&
                !isLoading &&
                !isFetching &&
                data?.value?.reports?.map((item) => (
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
                    >
                      {item.ticketConcernId}
                    </TableCell>

                    <TableCell
                      sx={{
                        color: "#EDF2F7",
                        fontSize: "12px",
                        fontWeight: 500,
                        maxWidth: "600px",
                        "&:hover": {
                          background: "",
                          color: "#EDF2F7",
                        },
                      }}
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
                    >
                      {item.category_Description}
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
                      {item.subCategory_Description}
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
                        "&:hover": {
                          background: "",
                          color: "#EDF2F7",
                        },
                      }}
                    >
                      {item.requestor_Name}
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
                      {item.issue_Handler}
                    </TableCell>
                  </TableRow>
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

              {isSuccess && !data?.value?.reports.length && (
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
      </Paper>

      <TablePagination
        sx={{ color: "#A0AEC0", fontWeight: 400, borderRadius: "0px 0px 20px 20px" }}
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data?.value?.totalCount || 0}
        rowsPerPage={data?.value?.pageSize || 5}
        page={data?.value?.currentPage - 1 || 0}
        onPageChange={onPageNumberChange}
        onRowsPerPageChange={onPageSizeChange}
      />
    </Stack>
  );
};

export default OpenTicketsHistory;
