import {
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
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import { AccessTimeOutlined, CalendarMonthOutlined } from "@mui/icons-material";

import moment from "moment";
import { theme } from "../../../../theme/theme";
import useDisclosure from "../../../../hooks/useDisclosure";

import useSignalRConnection from "../../../../hooks/useSignalRConnection";

import noRecordsFound from "../../../../assets/svg/noRecordsFound.svg";
import somethingWentWrong from "../../../../assets/svg/SomethingWentWrong.svg";

const ApproverHoldTicket = ({ data, isLoading, isFetching, isSuccess, isError, setPageNumber, setPageSize }) => {
  const { open, onToggle, onClose } = useDisclosure();
  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));
  // useSignalRConnection();

  const onPageNumberChange = (_, page) => {
    setPageNumber(page + 1);
  };

  const onPageSizeChange = (e) => {
    setPageSize(e.target.value);
    setPageNumber(1);
  };

  return (
    <Stack sx={{ width: "100%" }}>
      {isScreenSmall ? (
        // Card
        <>
          <Stack spacing={2}>
            {isSuccess &&
              !isLoading &&
              !isFetching &&
              data?.value?.onholdTicket?.map((item) => {
                return (
                  <Card key={item.ticketConcernId} sx={{ backgroundColor: theme.palette.bgForm.black3, borderRadius: "15px", borderColor: "#2D3748" }}>
                    <CardContent
                      sx={{
                        cursor: "pointer",
                        padding: "1px",
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
                          padding: 2,
                        }}
                      >
                        <Stack spacing={1}>
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
                            <Typography sx={{ fontWeight: 700, fontSize: "0.775rem", lineHeight: 1.57, color: "#D65DB1" }}>CATEGORY:</Typography>

                            {item.getOnHoldApproverCategories?.length > 0 ? (
                              <Typography sx={{ fontWeight: 400, fontSize: "0.775rem", lineHeight: 1.57, color: theme.palette.text.main }}>
                                {item.getOnHoldApproverCategories?.map((item) => item.category_Description).join(", ")}
                              </Typography>
                            ) : (
                              <Typography sx={{ fontWeight: 400, fontSize: "0.775rem", lineHeight: 1.57, color: theme.palette.text.main }}> -- </Typography>
                            )}
                          </Stack>

                          <Stack direction="row" gap={0.5} alignItems="center">
                            <Typography sx={{ fontWeight: 700, fontSize: "0.775rem", lineHeight: 1.57, color: "#D65DB1" }}>SUB CATEGORY:</Typography>

                            {item.getOnHoldApproverSubCategories?.length > 0 ? (
                              <Typography sx={{ fontWeight: 400, fontSize: "0.775rem", lineHeight: 1.57, color: theme.palette.text.main }}>
                                {item.getOnHoldApproverSubCategories?.map((item) => item.subCategory_Description).join(", ")}
                              </Typography>
                            ) : (
                              <Typography sx={{ fontWeight: 400, fontSize: "0.775rem", lineHeight: 1.57, color: theme.palette.text.main }}> -- </Typography>
                            )}
                          </Stack>

                          <Stack direction="row" gap={0.5} alignItems="center">
                            <Typography sx={{ fontWeight: 700, fontSize: "0.775rem", lineHeight: 1.57, color: "#D65DB1" }}>REASON:</Typography>
                            <Typography sx={{ fontWeight: 400, fontSize: "0.775rem", lineHeight: 1.57, color: theme.palette.warning.main }}>
                              {item.reason?.split("\r\n").map((line, index) => (
                                <span key={index}>
                                  {line}
                                  <br />
                                </span>
                              ))}
                            </Typography>
                          </Stack>

                          <Stack direction="row" gap={0.5} alignItems="center">
                            <Typography sx={{ fontWeight: 700, fontSize: "0.775rem", lineHeight: 1.57, color: "#D65DB1" }}>START DATE:</Typography>
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
                              label={moment(item.start_Date).format("LL hh:mma")}
                            />
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
                              label={moment(item.target_Date).format("LL hh:mma")}
                            />
                          </Stack>

                          <Stack direction="row" gap={0.5} alignItems="center">
                            <Typography sx={{ fontWeight: 700, fontSize: "0.775rem", lineHeight: 1.57, color: "#D65DB1" }}>HOLD DATE:</Typography>
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
                              label={moment(item.hold_Date).format("LL hh:mma")}
                            />
                          </Stack>

                          <Stack direction="row" gap={0.5} alignItems="center">
                            <Typography sx={{ fontWeight: 700, fontSize: "0.775rem", lineHeight: 1.57, color: "#D65DB1" }}>APPROVED DATE:</Typography>
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
                              label={moment(item.approved_Date).format("LL hh:mma")}
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

            {isSuccess && !data?.value?.onholdTicket?.length && !isLoading && !isFetching && (
              <Stack justifyContent="center" alignItems="center" padding={4}>
                <img src={noRecordsFound} alt="No Records Found" className="norecords-found-table" />
                <Typography variant="h6" align="center">
                  No records found.
                </Typography>
              </Stack>
            )}

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
          </Stack>
        </>
      ) : (
        <>
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
                    REASON
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
                </TableRow>
              </TableHead>

              <TableBody>
                {data?.value?.onholdTicket?.map((item, index) => {
                  return (
                    <TableRow
                      key={index}
                      sx={{
                        backgroundColor: theme.palette.bgForm.black3,
                      }}
                    >
                      <TableCell
                        sx={{
                          color: "#EDF2F7",
                          fontSize: "12px",
                          fontWeight: 500,
                        }}
                      >
                        {item.ticketConcernId}
                      </TableCell>

                      <TableCell>
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
                          className="ellipsis-styling"
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "12px",
                            fontWeight: 500,
                            width: "300px",
                          }}
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
                      >
                        <Stack gap={0.5}>
                          <Stack>
                            <Typography sx={{ fontSize: "12px", fontWeight: 600, fontWeight: 600, color: "#22B4BF" }}>Category:</Typography>
                            {item.getOnHoldApproverCategories?.length > 0 ? (
                              <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>
                                {item.getOnHoldApproverCategories?.map((item) => item.category_Description).join(", ")}
                              </Typography>
                            ) : (
                              <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>--</Typography>
                            )}
                          </Stack>

                          <Stack>
                            <Typography sx={{ fontSize: "12px", fontWeight: 600, fontWeight: 600, color: "#22B4BF" }}>Sub Category:</Typography>
                            {item.getOnHoldApproverSubCategories?.length > 0 ? (
                              <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>
                                {item.getOnHoldApproverSubCategories?.map((item) => item.subCategory_Description).join(", ")}
                              </Typography>
                            ) : (
                              <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>--</Typography>
                            )}
                          </Stack>
                        </Stack>
                      </TableCell>

                      <Tooltip title={item?.reason} placement="bottom-start">
                        <TableCell
                          className="ellipsis-styling"
                          sx={{
                            color: theme.palette.warning.main,
                            fontSize: "12px",
                            fontWeight: 500,
                            width: "250px",
                          }}
                        >
                          {item.reason?.split("\r\n").map((line, index) => (
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
                        <Stack gap={0.5}>
                          <Stack>
                            <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "#22B4BF" }}>Start Date:</Typography>
                            <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>{moment(item.start_Date).format("LL hh:mma")}</Typography>
                          </Stack>

                          <Stack>
                            <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "#22B4BF" }}>Target Date:</Typography>
                            <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>{moment(item.target_Date).format("LL")}</Typography>
                          </Stack>

                          <Stack>
                            <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "#22B4BF" }}>Hold Date:</Typography>
                            <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>{moment(item.hold_Date).format("LL hh:mma")}</Typography>
                          </Stack>

                          <Stack>
                            <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "#22B4BF" }}>Approved Date:</Typography>
                            <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>{moment(item.approved_Date).format("LL hh:mma")}</Typography>
                          </Stack>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {isError && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <img src={somethingWentWrong} alt="Something Went Wrong" className="something-went-wrong-table" />
                      <Typography variant="h5" color="#EDF2F7" marginLeft={2}>
                        Something went wrong.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}

                {(isLoading || isFetching) && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <CircularProgress />
                      <Typography variant="h5" color="#EDF2F7">
                        Please wait...
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}

                {isSuccess && !data?.value?.onholdTicket?.length && !isLoading && !isFetching && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
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
  );
};

export default ApproverHoldTicket;
