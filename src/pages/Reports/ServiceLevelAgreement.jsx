import { useEffect } from "react";
import { useGetClosedTicketsQuery, useGetSlaTicketsQuery } from "../../features/api_reports/reportsApi";
import { CalendarMonthOutlined, FiberManualRecord, Search } from "@mui/icons-material";
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
  Typography,
  useMediaQuery,
} from "@mui/material";

import moment from "moment";
import { theme } from "../../theme/theme";

import noRecordsFound from "../../assets/svg/noRecordsFound.svg";
import somethingWentWrong from "../../assets/svg/SomethingWentWrong.svg";

const ServiceLevelAgreement = ({
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
  const { data, isLoading, isFetching, isSuccess, isError } = useGetSlaTicketsQuery({
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
            <Typography sx={{ fontSize: isScreenSmall ? "18px" : "1.5rem", fontWeight: isScreenSmall ? 600 : 700 }}>SLA Report</Typography>
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
                YEAR
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
                ASSIGN
              </TableCell>

              <TableCell
                sx={{
                  background: "#1C2536",
                  color: "#D65DB1",
                  fontWeight: 700,
                  fontSize: "12px",
                }}
              >
                STORE
              </TableCell>

              <TableCell
                sx={{
                  background: "#1C2536",
                  color: "#D65DB1",
                  fontWeight: 700,
                  fontSize: "12px",
                }}
              >
                DESCRIPTION
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
                FOR CLOSING DATE
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
                SOLUTION
              </TableCell>

              <TableCell
                sx={{
                  background: "#1C2536",
                  color: "#D65DB1",
                  fontWeight: 700,
                  fontSize: "12px",
                }}
              >
                REQUEST TYPE
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
                POSITION
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
                    {item.year}
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
                    {item.month}
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
                    {item.ticketNo}
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
                    {item.assign}
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
                    {item.store}
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
                    {moment(item.openDate).format("LL hh:mma")}
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
                    {item.targetDate ? moment(item.targetDate).format("LL") : "--"}
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
                    {item.forClosingDate ? moment(item.forClosingDate).format("LL hh:mma") : "--"}
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
                    {item.closedDate ? moment(item.closedDate).format("LL hh:mma") : "--"}
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
                    {item.solution ? item.solution : "--"}
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
                    {item.requestType}
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
                    {item.status}
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
                    {item.rating}
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
                    {item.category}
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
                    {item.subCategory}
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
                    --
                  </TableCell>
                </TableRow>
              ))}

            {isError && (
              <TableRow>
                <TableCell colSpan={17} align="center">
                  <img src={somethingWentWrong} alt="Something Went Wrong" className="something-went-wrong-table" />
                  <Typography variant="h5" color="#EDF2F7" marginLeft={2}>
                    Something went wrong.
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {(isLoading || isFetching) && (
              <TableRow>
                <TableCell colSpan={17} align="center">
                  <CircularProgress />
                  <Typography variant="h5" color="#EDF2F7">
                    Please wait...
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {isSuccess && !data?.value?.reports.length && !isLoading && !isFetching && (
              <TableRow>
                <TableCell colSpan={17} align="center">
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

export default ServiceLevelAgreement;
