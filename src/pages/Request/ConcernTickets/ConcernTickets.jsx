import {
  Button,
  Chip,
  CircularProgress,
  Divider,
  Icon,
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
import React, { useEffect, useState } from "react";
import { theme } from "../../../theme/theme";
import {
  AddOutlined,
  CalendarMonthOutlined,
  ChecklistRtlOutlined,
  ClearAllOutlined,
  FiberManualRecord,
  PendingActionsOutlined,
  ReplyAllOutlined,
  Search,
} from "@mui/icons-material";
import moment from "moment";

import useDebounce from "../../../hooks/useDebounce";
import useDisclosure from "../../../hooks/useDisclosure";

import { useGetRequestorConcernsQuery } from "../../../features/api_request/concerns/concernApi";

import ConcernActions from "./ConcernActions";
import ConcernDialog from "./ConcernDialog";
import { deepPurple, green, pink, purple } from "@mui/material/colors";

const ConcernTickets = () => {
  const [status, setStatus] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue, 500);

  const [editData, setEditData] = useState(null);

  const { open, onToggle, onClose } = useDisclosure();

  const { data, isLoading, isFetching, isSuccess, isError } =
    useGetRequestorConcernsQuery({
      Status: status,
      Search: search,
      PageNumber: pageNumber,
      PageSize: pageSize,
    });

  const onPageNumberChange = (_, page) => {
    setPageNumber(page + 1);
  };

  const onPageSizeChange = (e) => {
    setPageSize(e.target.value);
  };

  const onDialogClose = () => {
    setEditData(null);
    onClose();
  };

  const onEditAction = (data) => {
    onToggle();
    setEditData(data);
  };

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
            <Typography variant="h4">Concerns</Typography>
          </Stack>

          <Stack justifyItems="space-between" direction="row">
            <Button
              variant="contained"
              size="large"
              color="primary"
              startIcon={<AddOutlined />}
              onClick={onToggle}
            >
              Add Concern
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
              <Tabs value={status} onChange={(_, value) => setStatus(value)}>
                <Tab
                  value=""
                  className="tabs-styling"
                  label="All Concerns"
                  icon={<ClearAllOutlined />}
                  iconPosition="start"
                  sx={{
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                />
                <Tab
                  value="true"
                  className="tabs-styling"
                  label="Approval"
                  icon={<PendingActionsOutlined />}
                  iconPosition="start"
                  sx={{
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                />
                <Tab
                  value="false"
                  className="tabs-styling"
                  label="Ongoing"
                  icon={<ReplyAllOutlined />}
                  iconPosition="start"
                  sx={{
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                />

                <Tab
                  //   value="false"
                  className="tabs-styling"
                  label="Done"
                  icon={<ChecklistRtlOutlined />}
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
              sx={{ background: "#2D3748", marginTop: "1px" }}
            />

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ marginTop: "10px", padding: "20px" }}
              gap={4}
            >
              <OutlinedInput
                flex="1"
                placeholder="Search Concern#: eg 00001"
                startAdornment={
                  <Search sx={{ marginRight: 0.5, color: "#A0AEC0" }} />
                }
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
                      LINE NO.
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
                      align="center"
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
                    data?.value?.requestConcern?.map((item) =>
                      item.requestConcerns?.map((subItem, index) => (
                        <TableRow key={index}>
                          <TableCell
                            sx={{
                              color: theme.palette.text.secondary,
                              fontSize: "14px",
                              fontWeight: 500,
                            }}
                            align="center"
                          >
                            {"#"}
                            {index + 1}
                          </TableCell>

                          <Tooltip
                            title={subItem.concern}
                            sx={{
                              top: 0,
                            }}
                          >
                            <TableCell
                              className="ellipsis-styling"
                              sx={{
                                color: "#EDF2F7",
                                fontSize: "15px",
                                fontWeight: 600,
                                maxWidth: "500px",
                              }}
                            >
                              {subItem.concern}
                            </TableCell>
                          </Tooltip>

                          <TableCell
                            sx={{
                              // color: "#EDF2F7",
                              fontSize: "14px",
                              fontWeight: 500,
                            }}
                            align="center"
                          >
                            <Chip
                              variant="filled"
                              size="30px"
                              icon={
                                <CalendarMonthOutlined
                                  fontSize="small"
                                  color="primary"
                                />
                              }
                              sx={{
                                fontSize: "12px",
                                backgroundColor: "#1D1F3B",
                                color: theme.palette.primary.main,
                                fontWeight: 800,
                              }}
                              label={moment(subItem.created_At).format("LL")}
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
                            <Chip
                              variant="filled"
                              size="30px"
                              icon={
                                subItem.concern_Status === "For Approval" ? (
                                  <FiberManualRecord
                                    fontSize="small"
                                    color="info"
                                  />
                                ) : subItem.concern_Status === "Ongoing" ? (
                                  <FiberManualRecord
                                    fontSize="small"
                                    color="warning"
                                  />
                                ) : (
                                  <FiberManualRecord
                                    fontSize="small"
                                    color="success"
                                  />
                                )
                              }
                              sx={{
                                fontSize: "12px",
                                backgroundColor: theme.palette.bgForm.black1,
                                color: theme.palette.text.main,
                                fontWeight: 800,
                              }}
                              label={
                                subItem.concern_Status
                                  ? subItem.concern_Status
                                  : ""
                              }
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
                            <ConcernActions data={item} status={status} />
                          </TableCell>
                        </TableRow>
                      ))
                    )}

                  {isError && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography variant="h5" color="#EDF2F7">
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

                  {isSuccess && !data?.value?.requestConcern.length && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography variant="h5" color="#EDF2F7">
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

            <ConcernDialog
              data={editData}
              isSuccess={isSuccess}
              open={open}
              onClose={onDialogClose}
            />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ConcernTickets;
