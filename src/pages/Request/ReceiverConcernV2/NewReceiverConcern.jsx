import {
  Autocomplete,
  Badge,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
  OutlinedInput,
  Paper,
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
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";

import {
  AccessTimeOutlined,
  Add,
  AttachFileOutlined,
  CalendarMonthOutlined,
  CheckOutlined,
  DoneAllOutlined,
  FiberManualRecord,
  FileDownloadOutlined,
  FileUploadOutlined,
  GetAppOutlined,
  PendingActions,
  PostAddOutlined,
  RemoveCircleOutline,
  RemoveRedEyeOutlined,
  Search,
  VisibilityOutlined,
  WarningRounded,
} from "@mui/icons-material";

import React, { useContext, useEffect, useRef, useState } from "react";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import moment from "moment";

import { theme } from "../../../theme/theme";
import Swal from "sweetalert2";
import useDebounce from "../../../hooks/useDebounce";
import useDisclosure from "../../../hooks/useDisclosure";

import noRecordsFound from "../../../assets/svg/noRecordsFound.svg";
import somethingWentWrong from "../../../assets/svg/SomethingWentWrong.svg";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LoadingButton } from "@mui/lab";
import { Toaster, toast } from "sonner";

import { useGetNotificationQuery } from "../../../features/api_notification/notificationApi";
import { useGetReceiverConcernsQuery } from "../../../features/api_request/concerns_receiver/concernReceiverApi";
import useSignalRConnection from "../../../hooks/useSignalRConnection";
import ViewConcernDetails from "./ViewConcernDetails";

const NewReceiverConcern = () => {
  const [approveStatus, setApproveStatus] = useState("false");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [concernDetails, setConcernDetails] = useState(null);

  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue, 500);
  useSignalRConnection();

  const { data: notificationBadge } = useGetNotificationQuery();
  const { data, isLoading, isFetching, isSuccess, isError, refetch } = useGetReceiverConcernsQuery({
    is_Approve: approveStatus,
    Search: search,
    PageNumber: pageNumber,
    PageSize: pageSize,
  });

  const { open: viewConcernDetailsOpen, onToggle: viewConcernDetailsOnToggle, onClose: viewConcernDetailsOnClose } = useDisclosure();

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

  // console.log("Notif: ", notificationBadge);

  return (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: theme.palette.bgForm.black1,
        color: "#fff",
        padding: "14px 44px 44px 44px",
      }}
    >
      <Toaster richColors position="top-right" closeButton />

      <Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h4">Concerns</Typography>

          <Stack justifyItems="space-between" direction="row"></Stack>
        </Stack>

        <Stack sx={{ backgroundColor: theme.palette.bgForm.black3, borderRadius: "20px", marginTop: "10px", height: "730px" }}>
          <Stack direction="row" justifyContent="space-between" paddingLeft={1} paddingRight={1}>
            <Tabs value={approveStatus} onChange={onStatusChange}>
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
                label="Approved"
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

            <Stack direction="row" sx={{ alignItems: "center", justifyContent: "center" }}>
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
          </Stack>

          <Divider
            variant="fullWidth"
            sx={{
              background: "#2D3748",
              marginBottom: 2,
              lineHeight: 1,
            }}
          />

          <TableContainer sx={{ minHeight: "589px", maxHeight: "589px" }}>
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
                    SYSTEM
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
                          maxWidth: "150px",
                        }}
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

          <ViewConcernDetails data={concernDetails} setData={setConcernDetails} open={viewConcernDetailsOpen} onClose={viewConcernDetailsOnClose} />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default NewReceiverConcern;
