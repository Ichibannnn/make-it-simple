import { useEffect } from "react";
import { useGetClosedTicketsTargetQuery } from "../../features/api_reports/reportsApi";
import { FiberManualRecord, Search } from "@mui/icons-material";
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

const CloseTicketTarget = ({
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
  const { data, isLoading, isFetching, isSuccess, isError } = useGetClosedTicketsTargetQuery({
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
            <Typography sx={{ fontSize: isScreenSmall ? "18px" : "1.5rem", fontWeight: isScreenSmall ? 600 : 700 }}>Target Tickets Summary</Typography>
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

              {/* <TableCell
                sx={{
                  background: "#1C2536",
                  color: "#D65DB1",
                  fontWeight: 700,
                  fontSize: "12px",
                }}
              >
                <Stack direction="row" alignItems="center" gap={0.5}>
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
                  END DATE
                </Stack>
              </TableCell> */}

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
                DATE
              </TableCell>

              {/* <TableCell
                sx={{
                  background: "#1C2536",
                  color: "#D65DB1",
                  fontWeight: 700,
                  fontSize: "12px",
                }}
              >
                <Stack direction="row" alignItems="center" gap={0.5}>
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
                ACTUAL
              </TableCell> */}

              <TableCell
                sx={{
                  background: "#1C2536",
                  color: "#D65DB1",
                  fontWeight: 700,
                  fontSize: "12px",
                }}
              >
                VARIANCE
              </TableCell>

              <TableCell
                sx={{
                  background: "#1C2536",
                  color: "#D65DB1",
                  fontWeight: 700,
                  fontSize: "12px",
                }}
              >
                EFFICIENCY
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

              {/* <TableCell
                sx={{
                  background: "#1C2536",
                  color: "#D65DB1",
                  fontWeight: 700,
                  fontSize: "12px",
                }}
              >
                CATEGORY CONCERN
              </TableCell> */}

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
                    }}
                    align="center"
                  >
                    {item.month}
                  </TableCell>

                  {/* <TableCell
                    sx={{
                      color: "#EDF2F7",
                      fontSize: "12px",
                      fontWeight: 500,

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
                      label={moment(item.start_Date).format("LL")}
                    />
                  </TableCell>

                  <TableCell
                    sx={{
                      color: "#EDF2F7",
                      fontSize: "12px",
                      fontWeight: 500,

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
                      label={moment(item.end_Date).format("LL")}
                    />
                  </TableCell> */}

                  <TableCell
                    sx={{
                      color: "#EDF2F7",
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                  >
                    {item.personnel}
                  </TableCell>

                  <TableCell
                    sx={{
                      color: "#EDF2F7",
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                    align="center"
                  >
                    {item.ticket_Number}
                  </TableCell>

                  <Tooltip title={item?.description} placement="bottom-start">
                    <TableCell
                      className="ellipsis-styling"
                      sx={{
                        color: "#EDF2F7",
                        fontSize: "12px",
                        fontWeight: 500,
                        width: "100px",
                      }}
                    >
                      {item.description?.split("\r\n").map((line, index) => (
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
                      width: "300px",
                    }}
                  >
                    <Stack>
                      <Stack>
                        <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "#22B4BF" }}>Start Date:</Typography>
                        <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>{moment(item.start_Date).format("LL")}</Typography>
                      </Stack>

                      <Stack>
                        <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "#22B4BF" }}>End Date:</Typography>
                        <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>{moment(item.end_Date).format("LL")}</Typography>
                      </Stack>

                      <Stack>
                        <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "#22B4BF" }}>Target Date:</Typography>
                        <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>{moment(item.target_Date).format("LL")}</Typography>
                      </Stack>

                      <Stack>
                        <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "#22B4BF" }}>Actual:</Typography>
                        <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>{moment(item.actual).format("LL")}</Typography>
                      </Stack>
                    </Stack>
                  </TableCell>

                  {/* <TableCell
                    sx={{
                      color: "#EDF2F7",
                      fontSize: "12px",
                      fontWeight: 500,

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
                      label={moment(item.actual).format("LL")}
                    />
                  </TableCell> */}

                  <TableCell
                    sx={{
                      color: "#EDF2F7",
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                    align="center"
                  >
                    {item.varience}
                  </TableCell>

                  <TableCell
                    sx={{
                      color: "#EDF2F7",
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                    align="center"
                  >
                    {item.efficeincy}
                  </TableCell>

                  <TableCell
                    sx={{
                      color: "#EDF2F7",
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                    align="center"
                  >
                    <Chip
                      variant="filled"
                      size="30px"
                      icon={
                        item?.remarks === "On-Time" ? (
                          <FiberManualRecord fontSize="small" color="success" />
                        ) : item?.remarks === "Delay" ? (
                          <FiberManualRecord fontSize="small" color="error" />
                        ) : (
                          ""
                        )
                      }
                      sx={{
                        fontSize: "12px",
                        backgroundColor: item?.remarks === "On-Time" || item?.remarks === "Delay" ? theme.palette.bgForm.black1 : "transparent",
                        color: theme.palette.text.main,
                        fontWeight: 800,
                      }}
                      label={
                        item?.remarks === "On-Time" ? (
                          <Typography sx={{ color: theme.palette.success.main, fontSize: "13px", fontWeight: 800 }}>On-Time</Typography>
                        ) : item?.remarks === "Delay" ? (
                          <Typography sx={{ color: theme.palette.error.main, fontSize: "13px", fontWeight: 800 }}>Delayed</Typography>
                        ) : (
                          <Typography sx={{ color: theme.palette.error.main, fontSize: "13px", fontWeight: 800 }}></Typography>
                        )
                      }
                    />
                  </TableCell>

                  <TableCell
                    sx={{
                      color: "#EDF2F7",
                      fontSize: "12px",
                      fontWeight: 500,
                      width: "300px",
                    }}
                  >
                    <Stack>
                      <Stack>
                        <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "#22B4BF" }}>Category:</Typography>
                        <Typography sx={{ fontSize: "12px", fontWeight: 500 }}> {item.category}</Typography>
                      </Stack>

                      <Stack>
                        <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "#22B4BF" }}>Concern Category:</Typography>
                        <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>{item.categoryConcern ? item.categoryConcern : "--"}</Typography>
                      </Stack>
                    </Stack>
                  </TableCell>

                  {/* <TableCell
                    sx={{
                      color: "#EDF2F7",
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                    align="center"
                  >
                    {item.category}
                  </TableCell>

                  <TableCell
                    sx={{
                      color: "#EDF2F7",
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                    align="center"
                  >
                    {item.categoryConcern ? item.categoryConcern : "--"}
                  </TableCell> */}

                  <TableCell
                    sx={{
                      color: "#EDF2F7",
                      fontSize: "12px",
                      fontWeight: 500,
                      maxWidth: "400px",
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
                  </TableCell>
                </TableRow>
              ))}

            {isError && (
              <TableRow>
                <TableCell colSpan={11} align="center">
                  <img src={somethingWentWrong} alt="Something Went Wrong" className="something-went-wrong-table" />
                  <Typography variant="h5" color="#EDF2F7" marginLeft={2}>
                    Something went wrong.
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {(isLoading || isFetching) && (
              <TableRow>
                <TableCell colSpan={11} align="center">
                  <CircularProgress />
                  <Typography variant="h5" color="#EDF2F7">
                    Please wait...
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {isSuccess && !data?.value?.reports.length && !isLoading && !isFetching && (
              <TableRow>
                <TableCell colSpan={11} align="center">
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

export default CloseTicketTarget;
