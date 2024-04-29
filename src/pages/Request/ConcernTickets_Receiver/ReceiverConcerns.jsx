import {
  Breadcrumbs,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
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
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  AddOutlined,
  CalendarMonthOutlined,
  ChecklistRtlOutlined,
  ClearAllOutlined,
  CorporateFareOutlined,
  DeleteForeverOutlined,
  FiberManualRecord,
  PendingActionsOutlined,
  RotateRightOutlined,
  Search,
} from "@mui/icons-material";

import React, { useState } from "react";
import { theme } from "../../../theme/theme";
import moment from "moment";

import useDebounce from "../../../hooks/useDebounce";
import useDisclosure from "../../../hooks/useDisclosure";
import { Link } from "react-router-dom";

import { useGetReceiverConcernsQuery } from "../../../features/api_request/concerns_receiver/concernReceiverApi";
import ReceiverAssignUsers from "./ReceiverAssignUsers";
import { ReceiverConcernsActions } from "./ReceiverConcernsActions";
import ReceiverConcernDialog from "./ReceiverConcernDialog";

const ReceiverConcerns = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue, 500);

  const [viewData, setViewData] = useState(null);
  const isSmallScreen = useMediaQuery(
    "(max-width: 1489px) and (max-height: 945px)"
  );

  const { open, onToggle, onClose } = useDisclosure();

  const { data, isLoading, isFetching, isSuccess, isError } =
    useGetReceiverConcernsQuery({
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

  const onViewAction = (data) => {
    onToggle();
    setViewData(data);
  };

  const onDialogClose = () => {
    setViewData(null);
    onClose();
  };

  return (
    <Stack
      width="100%"
      height="100%"
      sx={{
        display: "flex",
        flexDirection: "row",
        backgroundColor: theme.palette.bgForm.black1,
        color: "#fff",
        padding: "0px 24px 24px 24px",
        gap: 2,
      }}
    >
      <Paper
        sx={{
          width: "100%",
          minHeight: "90vh", // -----------
          display: "flex",
          flexDirection: "column",
          backgroundColor: theme.palette.bgForm.black3,
          marginTop: 2,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          paddingTop={2}
          paddingRight={4}
          paddingLeft={4}
          paddingBottom={1}
        >
          <Stack justifyItems="left">
            <Typography variant="h5">Concerns</Typography>
          </Stack>

          <Stack justifyItems="space-between" direction="row">
            <Button variant="contained" size="large" color="primary">
              Compose
            </Button>
          </Stack>
        </Stack>

        <Divider
          variant="fullWidth"
          sx={{ background: "#2D3748", marginTop: "1px" }}
        />

        <Stack
          width="100%"
          sx={{
            padding: "10px",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
          gap={1}
        >
          <Stack />
          <OutlinedInput
            placeholder="Search"
            startAdornment={
              <Search sx={{ marginRight: 0.5, color: "#A0AEC0" }} />
            }
            // value={searchValue}
            // onChange={(e) => setSearchValue(e.target.value)}
            sx={{
              borderRadius: "15px",
              fontSize: "small",
              fontWeight: 400,
              lineHeight: "1.4375rem",
              // backgroundColor: "#111927",
            }}
          />
        </Stack>

        <Stack width="100%">
          <TableContainer component={Paper}>
            <Table
              sx={{
                borderBottom: "none",
              }}
            >
              <TableHead
                sx={{
                  borderRadius: "20px",
                }}
              >
                <TableRow>
                  <TableCell
                    sx={{
                      color: "#D65DB1",
                      fontWeight: 700,
                      fontSize: "12px",
                      width: "20%",
                    }}
                  >
                    REQUESTOR
                  </TableCell>

                  <TableCell
                    sx={{
                      color: "#D65DB1",
                      fontWeight: 700,
                      fontSize: "12px",
                      width: "20%",
                    }}
                  >
                    CONCERN DETAILS
                  </TableCell>

                  <TableCell
                    sx={{
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
                      color: "#D65DB1",
                      fontWeight: 700,
                      fontSize: "12px",
                    }}
                    align="center"
                  ></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {isSuccess &&
                  !isLoading &&
                  !isFetching &&
                  data?.value?.requestConcern?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Typography
                          sx={{
                            color: theme.palette.text.secondary,
                            fontSize: "14px",
                            fontWeight: 500,
                          }}
                        >
                          {item.empId}
                        </Typography>

                        <Typography
                          sx={{
                            color: "#fff",
                            fontSize: "14px",
                            fontWeight: 500,
                          }}
                        >
                          {item.fullName}
                        </Typography>

                        <Typography
                          sx={{
                            color: theme.palette.primary.main,
                            fontSize: "13px",
                            fontWeight: 500,
                          }}
                        >
                          {item.department_Name}
                        </Typography>
                      </TableCell>

                      <Tooltip title={item.concern} placement="bottom-start">
                        <TableCell className="ellipsis-styling">
                          <Typography
                            sx={{
                              color: "#fff",
                              fontSize: "14px",
                              fontWeight: 500,
                              maxWidth: 500,
                            }}
                          >
                            {item.concern}
                          </Typography>
                        </TableCell>
                      </Tooltip>

                      <TableCell
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: "12px",
                          fontWeight: 500,
                        }}
                        align="center"
                      >
                        {`Posted at ${moment(item.created_At).format("LLL")}`}
                      </TableCell>

                      <TableCell
                        sx={{
                          color: "#EDF2F7",
                          fontSize: "14px",
                          fontWeight: 500,
                        }}
                        align="center"
                      >
                        <ReceiverConcernsActions
                          data={item}
                          onView={onViewAction}
                        />
                      </TableCell>
                    </TableRow>
                  ))}

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
        </Stack>
      </Paper>

      {/* <Paper
        sx={{
          width: isSmallScreen ? "100%" : "30%",
          minHeight: "90vh", // -----------
          display: "flex",
          flexDirection: "column",
          backgroundColor: theme.palette.bgForm.black3,
          marginTop: 2,
        }}
      ></Paper> */}

      <ReceiverConcernDialog
        open={open}
        onClose={onDialogClose}
        data={viewData}
      />
    </Stack>
  );
};

export default ReceiverConcerns;
