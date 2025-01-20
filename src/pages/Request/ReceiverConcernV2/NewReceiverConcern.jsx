import {
  Badge,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  OutlinedInput,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  Typography,
  useMediaQuery,
} from "@mui/material";

import { AccessTimeOutlined, CalendarMonthOutlined, DoneAllOutlined, PendingActions, PostAddOutlined, Search } from "@mui/icons-material";

import React, { useState } from "react";
import moment from "moment";

import { theme } from "../../../theme/theme";
import useDebounce from "../../../hooks/useDebounce";
import useDisclosure from "../../../hooks/useDisclosure";

import noRecordsFound from "../../../assets/svg/noRecordsFound.svg";
import somethingWentWrong from "../../../assets/svg/SomethingWentWrong.svg";

import { Toaster } from "sonner";

import { useGetNotificationQuery } from "../../../features/api_notification/notificationApi";
import { useGetReceiverConcernsQuery } from "../../../features/api_request/concerns_receiver/concernReceiverApi";
import useSignalRConnection from "../../../hooks/useSignalRConnection";
import ViewConcernDetails from "./ViewConcernDetails";
import ReceiverAddTicketDialog from "../ConcernTickets_Receiver/ReceiverAddTicketDialog";

const NewReceiverConcern = () => {
  const [approveStatus, setApproveStatus] = useState("false");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [concernDetails, setConcernDetails] = useState(null);

  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue, 500);

  useSignalRConnection();
  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));

  const { data: notificationBadge } = useGetNotificationQuery();
  const { data, isLoading, isFetching, isSuccess, isError, refetch } = useGetReceiverConcernsQuery({
    is_Approve: approveStatus,
    Search: search,
    PageNumber: pageNumber,
    PageSize: pageSize,
  });

  const { open: viewConcernDetailsOpen, onToggle: viewConcernDetailsOnToggle, onClose: viewConcernDetailsOnClose } = useDisclosure();
  const { open: addTicketOpen, onToggle: addTicketOnToggle, onClose: addTicketOnClose } = useDisclosure();

  const onPageNumberChange = (_, page) => {
    setPageNumber(page + 1);
  };

  const onPageSizeChange = (e) => {
    setPageSize(e.target.value);
    setPageNumber(1);
  };

  const onStatusChange = (_, newValue) => {
    setApproveStatus(newValue);
    setPageNumber(1);
    setPageSize(5);
    refetch();
  };

  const onViewAction = (data) => {
    // console.log("Data: ", data);

    viewConcernDetailsOnToggle();
    setConcernDetails(data);
  };

  const onAddTicketAction = () => {
    addTicketOnToggle();
  };

  // console.log("Notif: ", notificationBadge);

  return (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: theme.palette.bgForm.black1,
        color: "#fff",
        padding: isScreenSmall ? "20px" : "24px 94px 34px 94px",
      }}
    >
      <Toaster richColors position="top-right" closeButton />

      <Stack>
        <Stack width="100%" justifyContent="space-between" sx={{ flexDirection: isScreenSmall ? "column" : "row" }}>
          <Typography variant={isScreenSmall ? "h5" : "h4"}>Concerns</Typography>
          <Stack justifyItems="space-between" direction="row" marginTop={1}>
            <Button variant="contained" size="large" color="primary" startIcon={<PostAddOutlined />} onClick={onAddTicketAction}>
              Create Ticket
            </Button>
          </Stack>
        </Stack>

        <Stack
          sx={{
            backgroundColor: theme.palette.bgForm.black3,
            borderRadius: "20px",
            marginTop: "10px",
            width: "100%",
          }}
        >
          <Stack direction="row" justifyContent="space-between">
            <Tabs
              value={approveStatus}
              onChange={onStatusChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                ".MuiTab-root": {
                  minWidth: isScreenSmall ? "80px" : "120px",
                  fontSize: { xs: "10px", sm: "12px", md: "13px" },
                },
                ".MuiTabs-scrollButtons": {
                  color: "#fff",
                  "&.Mui-disabled": {
                    opacity: 0.3,
                  },
                },
              }}
            >
              <Tab
                className="tabs-styling"
                value="false"
                label="Pending"
                icon={
                  <Badge
                    badgeContent={notificationBadge?.value?.receiverForApprovalNotif}
                    max={100000}
                    color="primary"
                    anchorOrigin={{ vertical: "top", horizontal: "left" }}
                    sx={{
                      ".MuiBadge-badge": {
                        fontSize: "0.55rem",
                        fontWeight: 400,
                      },
                    }}
                  >
                    <PendingActions />
                  </Badge>
                }
                iconPosition="start"
                sx={{ fontWeight: 600, fontSize: "12px" }}
              />

              <Tab
                className="tabs-styling"
                value="true"
                label="Verified"
                icon={
                  <Badge
                    badgeContent={notificationBadge?.value?.receiverApproveNotif}
                    max={100000}
                    color="primary"
                    anchorOrigin={{ vertical: "top", horizontal: "left" }}
                    sx={{
                      ".MuiBadge-badge": {
                        fontSize: "0.55rem",
                        fontWeight: 400,
                      },
                    }}
                  >
                    <DoneAllOutlined />
                  </Badge>
                }
                iconPosition="start"
                sx={{
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              />
            </Tabs>
          </Stack>

          <Divider
            variant="fullWidth"
            sx={{
              background: "#2D3748",
              marginBottom: 1,
              lineHeight: 1,
            }}
          />

          <Stack sx={{ width: "100%", padding: 1 }}>
            <OutlinedInput
              placeholder="eg. Requestor or Concern #"
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
            // Card
            <Stack spacing={2}>
              {isSuccess &&
                !isLoading &&
                !isFetching &&
                data?.value?.requestConcern?.map((item, index) => (
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
                            <Typography sx={{ fontWeight: 500, fontSize: "17px", color: "#EDF2F7" }}>{item.fullName}</Typography>
                            <Typography sx={{ fontWeight: 500, fontSize: "12px", color: theme.palette.text.secondary }}>{item.department_Name}</Typography>
                          </Stack>

                          <Stack direction="row" gap={0.5} alignItems="center">
                            <Typography sx={{ fontWeight: 700, fontSize: "0.775rem", lineHeight: 1.57, color: "#D65DB1" }}>CONCERN NUMBER:</Typography>
                            <Typography sx={{ fontWeight: 400, fontSize: "0.775rem", lineHeight: 1.57, color: theme.palette.text.main }}>{item.requestConcernId}</Typography>
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
                            <Typography sx={{ fontWeight: 700, fontSize: "0.775rem", lineHeight: 1.57, color: "#D65DB1" }}>CHANNEL:</Typography>
                            <Typography sx={{ fontWeight: 400, fontSize: "0.775rem", lineHeight: 1.57, color: theme.palette.text.main }}>{item.channel_Name}</Typography>
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
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}

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

              {isSuccess && !data?.value?.requestConcern.length && (
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
          ) : (
            <>
              <TableContainer sx={{ minHeight: "480px", maxHeight: "545px" }}>
                <Table stickyHeader sx={{ borderBottom: "none" }}>
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
                        CONCERN NO.
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
                        CONCERN
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
                        <Stack direction="row" alignItems="center" gap={0.5}>
                          <AccessTimeOutlined sx={{ fontSize: "16px" }} />
                          DATE CREATED
                        </Stack>
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {isSuccess &&
                      !isLoading &&
                      !isFetching &&
                      data?.value?.requestConcern?.map((item) => (
                        <TableRow
                          key={item.requestConcernId}
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
                            onClick={() => onViewAction(item)}
                          >
                            {item.requestConcernId}
                          </TableCell>

                          <TableCell
                            sx={{
                              maxWidth: "150px",
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
                              {item.department_Name}
                            </Typography>
                          </TableCell>

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

                    {isSuccess && !data?.value?.requestConcern.length && (
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
            </>
          )}

          <ViewConcernDetails data={concernDetails} setData={setConcernDetails} open={viewConcernDetailsOpen} onClose={viewConcernDetailsOnClose} />
          <ReceiverAddTicketDialog open={addTicketOpen} onClose={addTicketOnClose} />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default NewReceiverConcern;
