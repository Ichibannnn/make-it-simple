import {
  Card,
  CardContent,
  Chip,
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
import { AccessTimeOutlined, CalendarMonthOutlined } from "@mui/icons-material";
import React, { useState } from "react";

import moment from "moment";
import { theme } from "../../../../theme/theme";
import useDisclosure from "../../../../hooks/useDisclosure";

import noRecordsFound from "../../../../assets/svg/noRecordsFound.svg";
import somethingWentWrong from "../../../../assets/svg/SomethingWentWrong.svg";
import useSignalRConnection from "../../../../hooks/useSignalRConnection";
import OnHoldApprovalDialog from "./OnHoldApprovalDialog";

const OnHoldApproval = ({ data, isLoading, isFetching, isSuccess, isError, setPageNumber, setPageSize }) => {
  const [viewOnHoldData, setViewOnHoldData] = useState(null);

  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));
  useSignalRConnection();

  // console.log("Notification: ", notificationApi);

  const { open, onToggle, onClose } = useDisclosure();

  const onPageNumberChange = (_, page) => {
    setPageNumber(page + 1);
  };

  const onPageSizeChange = (e) => {
    setPageSize(e.target.value);
    setPageNumber(1);
  };

  const onDialogClose = () => {
    setViewOnHoldData(null);
    onClose();
  };

  const onViewAction = (data) => {
    onToggle();
    setViewOnHoldData(data);
  };

  return (
    <Stack sx={{ width: "100%" }}>
      {isScreenSmall ? (
        // Card
        <Stack spacing={2}>
          {isSuccess &&
            !isLoading &&
            !isFetching &&
            data?.value?.onHoldTicket?.map((item, index) => (
              <Card key={index} sx={{ backgroundColor: theme.palette.bgForm.black3, borderRadius: "15px", borderColor: "#2D3748" }}>
                <CardContent
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#1A222F",
                      color: "#9e77ed", // Change the text color when hovering
                    },
                  }}
                >
                  <Stack spacing={1}>
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
            ))}

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
      ) : (
        <>
          <TableContainer>
            <Table sx={{ borderBottom: "none" }}>
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
                </TableRow>
              </TableHead>

              <TableBody>
                {isSuccess &&
                  !isLoading &&
                  !isFetching &&
                  data?.value?.onHoldTicket?.map((item) => (
                    <TableRow key={item.ticketConcernId} onClick={() => onViewAction(item)}>
                      <TableCell
                        sx={{
                          color: "#EDF2F7",
                          fontSize: "12px",
                          fontWeight: 500,
                        }}
                        align="center"
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
                          // className="ellipsis-styling"
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "12px",
                            fontWeight: 500,
                            maxWidth: "300px",
                          }}
                        >
                          {item?.concern_Details.split("\r\n").map((line, index) => (
                            <div key={index}>{line}</div>
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
                          label={moment(item.target_Date).format("LL")}
                        />
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

                {isSuccess && !data?.value?.onHoldTicket?.length && (
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

      <OnHoldApprovalDialog data={viewOnHoldData} open={open} onClose={onDialogClose} />
    </Stack>
  );
};

export default OnHoldApproval;
