import { useEffect } from "react";
import { useGetMisClosedTicketsQuery } from "../../features/api_reports/reportsApi";
import { Search } from "@mui/icons-material";
import {
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
  Typography,
  useMediaQuery,
} from "@mui/material";

import moment from "moment";
import { theme } from "../../theme/theme";

import noRecordsFound from "../../assets/svg/noRecordsFound.svg";
import somethingWentWrong from "../../assets/svg/SomethingWentWrong.svg";

const MisClosedTickets = ({
  search,
  searchValue,
  setSearchValue,
  serviceProvider,
  channel,
  user,
  remarks,
  dateFrom,
  dateTo,
  pageNumber,
  setPageNumber,
  pageSize,
  setPageSize,
  setSheetData,
}) => {
  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));
  const { data, isLoading, isFetching, isSuccess, isError } = useGetMisClosedTicketsQuery({
    Search: search,
    ServiceProvider: serviceProvider,
    Channel: channel,
    UserId: user,
    Remarks: remarks,
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
            <Typography sx={{ fontSize: isScreenSmall ? "18px" : "1.5rem", fontWeight: isScreenSmall ? 600 : 700 }}>MIS Closed Tickets Report</Typography>
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
                align="center"
              >
                TICKET NUMBER
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
                CONCERN DETAILS
              </TableCell>

              <TableCell
                sx={{
                  background: "#1C2536",
                  color: "#D65DB1",
                  fontWeight: 700,
                  fontSize: "12px",
                }}
              >
                OPEN DATE
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
                CLOSED DATE
              </TableCell>

              <TableCell
                sx={{
                  background: "#1C2536",
                  color: "#D65DB1",
                  fontWeight: 700,
                  fontSize: "12px",
                }}
              >
                APPROVER DATE
              </TableCell>

              <TableCell
                sx={{
                  background: "#1C2536",
                  color: "#D65DB1",
                  fontWeight: 700,
                  fontSize: "12px",
                }}
              >
                RATING
              </TableCell>

              <TableCell
                sx={{
                  background: "#1C2536",
                  color: "#D65DB1",
                  fontWeight: 700,
                  fontSize: "12px",
                }}
              >
                COMPANY
              </TableCell>

              <TableCell
                sx={{
                  background: "#1C2536",
                  color: "#D65DB1",
                  fontWeight: 700,
                  fontSize: "12px",
                }}
              >
                BUSINESS UNIT
              </TableCell>

              <TableCell
                sx={{
                  background: "#1C2536",
                  color: "#D65DB1",
                  fontWeight: 700,
                  fontSize: "12px",
                }}
              >
                DEPARTMENT
              </TableCell>

              <TableCell
                sx={{
                  background: "#1C2536",
                  color: "#D65DB1",
                  fontWeight: 700,
                  fontSize: "12px",
                }}
              >
                UNIT
              </TableCell>

              <TableCell
                sx={{
                  background: "#1C2536",
                  color: "#D65DB1",
                  fontWeight: 700,
                  fontSize: "12px",
                }}
              >
                SUB UNIT
              </TableCell>

              <TableCell
                sx={{
                  background: "#1C2536",
                  color: "#D65DB1",
                  fontWeight: 700,
                  fontSize: "12px",
                }}
              >
                LOCATION
              </TableCell>

              <TableCell
                sx={{
                  background: "#1C2536",
                  color: "#D65DB1",
                  fontWeight: 700,
                  fontSize: "12px",
                }}
              >
                MONTH
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
                      color: theme.palette.primary.main,
                      fontSize: "12px",
                      fontWeight: 800,
                      "&:hover": {
                        background: "",
                        color: "#EDF2F7",
                      },
                    }}
                    align="center"
                  >
                    {item.ticketNumber}
                  </TableCell>

                  <TableCell
                    sx={{
                      color: "#22B4BF",
                      fontSize: "12px",
                      fontWeight: 800,
                      "&:hover": {
                        background: "",
                        color: "#EDF2F7",
                      },
                    }}
                  >
                    {item.assignTo}
                  </TableCell>

                  <TableCell
                    sx={{
                      color: "#22B4BF",
                      fontSize: "12px",
                      fontWeight: 800,
                      "&:hover": {
                        background: "",
                        color: "#EDF2F7",
                      },
                    }}
                  >
                    {item.requestor}
                  </TableCell>

                  <TableCell
                    sx={{
                      color: "#EDF2F7",
                      fontSize: "12px",
                      fontWeight: 500,
                      width: "500px",
                      "&:hover": {
                        background: "",
                        color: "#EDF2F7",
                      },
                    }}
                  >
                    {item.description?.split("\r\n").map((line, index) => (
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
                    {moment(item.open_Date).format("LL")}
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
                    {item.target_Date ? moment(item.target_Date).format("LL") : "--"}
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
                    {item.forClosingDate ? moment(item.forClosingDate).format("LL") : "--"}
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
                    {item.closingDate ? moment(item.closingDate).format("LL") : "--"}
                  </TableCell>

                  <TableCell
                    sx={{
                      color: item.remarks === "On-Time" ? theme.palette.success.main : theme.palette.error.main,
                      fontSize: "12px",
                      fontWeight: 500,
                      "&:hover": {
                        background: "",
                        color: "#EDF2F7",
                      },
                    }}
                  >
                    {item.remarks}
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
                    {item.companyCode} - {item.companyName}
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
                    {item.businessUnitCode} - {item.businessUnitName}
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
                    {item.departmentCode} - {item.departmentName}
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
                    {item.unitCode} - {item.unitName}
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
                    {item.subUnitCode} - {item.subUnitName}
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
                    align="center"
                  >
                    {item.locationCode} - {item.locationName}
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
                    {item.month}
                  </TableCell>
                </TableRow>
              ))}

            {isError && (
              <TableRow>
                <TableCell colSpan={16} align="center">
                  <img src={somethingWentWrong} alt="Something Went Wrong" className="something-went-wrong-table" />
                  <Typography variant="h5" color="#EDF2F7" marginLeft={2}>
                    Something went wrong.
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {(isLoading || isFetching) && (
              <TableRow>
                <TableCell colSpan={16} align="center">
                  <CircularProgress />
                  <Typography variant="h5" color="#EDF2F7">
                    Please wait...
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {isSuccess && !data?.value?.reports.length && !isLoading && !isFetching && (
              <TableRow>
                <TableCell colSpan={16} align="center">
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

export default MisClosedTickets;
