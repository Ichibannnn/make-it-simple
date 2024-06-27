import {
  Badge,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
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
  Tooltip,
  Typography,
} from "@mui/material";
import {
  AddOutlined,
  ArrowDownward,
  ArrowUpward,
  CalendarMonthOutlined,
  ChecklistRtlOutlined,
  ClearAllOutlined,
  FiberManualRecord,
  HowToRegOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  PendingActionsOutlined,
  RotateRightOutlined,
  Search,
} from "@mui/icons-material";

import React, { useEffect, useState } from "react";
import { theme } from "../../../theme/theme";
import moment from "moment";

import noRecordsFound from "../../../assets/svg/noRecordsFound.svg";
import somethingWentWrong from "../../../assets/svg/SomethingWentWrong.svg";

import useDebounce from "../../../hooks/useDebounce";
import useDisclosure from "../../../hooks/useDisclosure";

import ConcernDialog from "./ConcernDialog";
import ConcernViewDialog from "./ConcernViewDialog";
import ConcernActions from "./ConcernActions";

import { useGetRequestorConcernsQuery } from "../../../features/api_request/concerns/concernApi";

const ConcernTickets = () => {
  const [status, setStatus] = useState("");
  const [ascending, setAscending] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue, 500);

  const [editData, setEditData] = useState(null);
  const [viewHistoryData, setViewHistoryData] = useState(null);

  const { open: addConcernOpen, onToggle: addConcernOnToggle, onClose: addConcernOnClose } = useDisclosure();

  const { open: viewConcernOpen, onToggle: viewConcernOnToggle, onClose: viewConcernOnClose } = useDisclosure();

  const { data, isLoading, isFetching, isSuccess, isError } = useGetRequestorConcernsQuery({
    Concern_Status: status,
    Search: search,
    Ascending: ascending,
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

  const onStatusChange = (_, newValue) => {
    setStatus(newValue);
    setPageNumber(1);
    setPageSize(5);
  };

  const onDialogClose = () => {
    setEditData(null);
    addConcernOnClose();
  };

  const onViewConcernAction = (data) => {
    viewConcernOnToggle();
    setEditData(data);
  };

  // const onViewHistoryAction = (data) => {
  //   onToggle();
  //   setViewHistoryData(data);
  // };

  useEffect(() => {
    if (searchValue) {
      setPageNumber(1);
    }
  }, [searchValue]);

  return (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: theme.palette.bgForm.black1,
        color: "#fff",
        padding: "24px",
      }}
    >
      <Stack>
        <Stack direction="row" justifyContent="space-between" width="100%">
          <Stack justifyItems="left">
            <Typography variant="h4">Request Concerns</Typography>
          </Stack>

          <Stack justifyItems="space-between" direction="row">
            <Button variant="contained" size="large" color="primary" startIcon={<AddOutlined />} onClick={addConcernOnToggle}>
              Add Request
            </Button>
          </Stack>
        </Stack>

        <Stack direction="row" width="100%" justifyContent="space-between">
          {/* MAIN */}
          <Stack
            sx={{
              backgroundColor: theme.palette.bgForm.black3,
              borderRadius: "20px",
              marginTop: "20px",
              width: "100%",
            }}
          >
            <Stack direction="row" justifyContent="space-between">
              <Tabs value={status} onChange={onStatusChange}>
                <Tab
                  value=""
                  className="tabs-styling"
                  label="All Requests"
                  icon={
                    <Badge
                      badgeContent={901}
                      max={100000}
                      color="primary"
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                      sx={{
                        ".MuiBadge-badge": {
                          fontSize: "0.55rem",
                          fontWeight: 400,
                        },
                      }}
                    >
                      <ClearAllOutlined />
                    </Badge>
                  }
                  iconPosition="start"
                  sx={{
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                />

                <Tab
                  value="For Approval"
                  className="tabs-styling"
                  label="For Approval"
                  icon={
                    <Badge
                      badgeContent={100}
                      // color="primary"
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                      sx={{
                        ".MuiBadge-badge": {
                          fontSize: "0.55rem",
                          fontWeight: 400,
                          background: "#3A96FA",
                          color: "#ffff",
                        },
                      }}
                    >
                      <PendingActionsOutlined />
                    </Badge>
                  }
                  iconPosition="start"
                  sx={{
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                />

                <Tab
                  value="Ongoing"
                  className="tabs-styling"
                  label="Ongoing"
                  icon={
                    <Badge
                      badgeContent={901}
                      max={100000}
                      color="warning"
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                      sx={{
                        ".MuiBadge-badge": {
                          fontSize: "0.55rem",
                          fontWeight: 400,
                          color: "#ffff",
                        },
                      }}
                    >
                      <RotateRightOutlined />
                    </Badge>
                  }
                  iconPosition="start"
                  sx={{
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                />

                <Tab
                  value="For Confirmation"
                  className="tabs-styling"
                  label="For Confirmation"
                  icon={
                    <Badge
                      badgeContent={100}
                      // color="primary"
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                      sx={{
                        ".MuiBadge-badge": {
                          fontSize: "0.55rem",
                          fontWeight: 400,
                          background: "#009688",
                          color: "#ffff",
                        },
                      }}
                    >
                      <HowToRegOutlined />
                    </Badge>
                  }
                  iconPosition="start"
                  sx={{
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                />

                <Tab
                  value="Done"
                  className="tabs-styling"
                  label="Done"
                  icon={
                    <Badge
                      badgeContent={100}
                      color="success"
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                      sx={{
                        ".MuiBadge-badge": {
                          fontSize: "0.55rem",
                          fontWeight: 400,
                          color: "#ffff",
                        },
                      }}
                    >
                      <ChecklistRtlOutlined />
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

            <Divider variant="fullWidth" sx={{ background: "#2D3748", marginTop: "1px" }} />

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ marginTop: "10px", padding: "20px" }} gap={4}>
              <OutlinedInput
                flex="1"
                placeholder="Search Concern#: eg 00001"
                startAdornment={<Search sx={{ marginRight: 0.5, color: "#A0AEC0" }} />}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                sx={{
                  flex: 1,
                  borderRadius: "15px",
                  fontSize: "small",
                  fontWeight: 400,
                  lineHeight: "1.4375rem",
                }}
              />
            </Stack>

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
                      <Stack direction="row" gap={0.2} justifyContent="center" alignItems="center">
                        REQUEST NO.
                        <IconButton size="small" onClick={() => setAscending(!ascending)}>
                          {ascending === true ? <ArrowUpward sx={{ color: "#D65DB1", fontSize: "20px" }} /> : <ArrowDownward sx={{ color: "#D65DB1", fontSize: "20px" }} />}
                        </IconButton>
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
                      REQUEST DETAILS
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
                      DATE CREATED
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
                      align="center"
                    >
                      ACTION
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {isSuccess &&
                    !isLoading &&
                    !isFetching &&
                    data?.value?.requestConcern?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "12px",
                            fontWeight: 500,
                          }}
                          align="center"
                        >
                          {"#"}
                          {item.requestConcernId}
                        </TableCell>

                        <Tooltip title={item.concern} placement="bottom-start">
                          <TableCell
                            // className="ellipsis-styling"
                            sx={{
                              color: "#EDF2F7",
                              fontSize: "12px",
                              fontWeight: 500,
                              maxWidth: "500px",
                            }}
                          >
                            {item.concern.split("\r\n").map((line, index) => (
                              <div key={index}>{line}</div>
                            ))}
                          </TableCell>
                        </Tooltip>

                        <TableCell
                          sx={{
                            fontSize: "14px",
                            fontWeight: 500,
                          }}
                          align="center"
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

                        <TableCell
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "14px",
                            fontWeight: 500,
                          }}
                        >
                          <Chip
                            variant="filled"
                            size="30px"
                            icon={
                              item.concern_Status === "For Approval" ? (
                                <FiberManualRecord fontSize="small" color="info" />
                              ) : item.concern_Status === "Ongoing" ? (
                                <FiberManualRecord fontSize="small" color="warning" />
                              ) : item.concern_Status === "For Confirmation" ? (
                                <FiberManualRecord
                                  fontSize="small"
                                  sx={{
                                    "&.MuiSvgIcon-root": {
                                      color: "#009688",
                                    },
                                  }}
                                />
                              ) : (
                                <FiberManualRecord fontSize="small" color="success" />
                              )
                            }
                            sx={{
                              fontSize: "12px",
                              backgroundColor: theme.palette.bgForm.black1,
                              color: theme.palette.text.main,
                              fontWeight: 800,
                            }}
                            label={item.concern_Status ? item.concern_Status : ""}
                          />
                        </TableCell>

                        <TableCell
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "14px",
                            fontWeight: 500,
                          }}
                          align="center"
                        >
                          <ConcernActions data={item} onView={onViewConcernAction} />
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

                  {(isLoading || isFetching) && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <CircularProgress />
                        <Typography variant="h5" color="#EDF2F7">
                          Please wait...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}

                  {isSuccess && !data?.value?.requestConcern?.length && (
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

            <ConcernDialog open={addConcernOpen} onClose={onDialogClose} />

            <ConcernViewDialog
              editData={editData}
              open={viewConcernOpen}
              onClose={() => {
                viewConcernOnClose(setEditData(null));
              }}
            />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ConcernTickets;
