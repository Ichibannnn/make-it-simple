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
  AccessTimeOutlined,
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
  const [addData, setAddData] = useState(null);

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

  const onAddAction = (data) => {
    console.log("Add data: ", data);
    setAddData(data);
  };

  const onDialogClose = () => {
    setViewData(null);
    onClose();
  };

  const onCloseAddAction = () => {
    setAddData(null);
  };

  return (
    <Stack
      width="100%"
      // height="100%"
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.bgForm.black1,
        color: "#fff",
        padding: "0px 24px 24px 24px",
      }}
    >
      <Stack>
        <Stack direction="row" justifyContent="space-between">
          <Stack>
            <Stack justifyItems="left">
              <Typography variant="h4">Concerns</Typography>
            </Stack>
            <Stack
              justifyItems="space-between"
              direction="row"
              marginTop={1}
            ></Stack>
          </Stack>
        </Stack>
      </Stack>

      <Stack sx={{ flexDirection: "row", gap: 2 }}>
        <Paper
          sx={{
            width: addData ? "70%" : "100%",
            minHeight: "90vh", // -----------
            display: "flex",
            flexDirection: "column",
            backgroundColor: theme.palette.bgForm.black3,
          }}
        >
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

          <Stack padding={4} width="100%" gap={2}>
            <Stack
              sx={{
                minHeight: "500px",
                maxHeight: "115vh", // set a max height to prevent it from occupying too much space
                overflowY: "auto", // make it scrollable vertically if content exceeds the height
                gap: 2,
              }}
            >
              {isSuccess &&
                !isLoading &&
                !isFetching &&
                data?.value?.requestConcern?.map((item, index) => (
                  <Stack
                    key={index}
                    onClick={() => onAddAction(item)}
                    sx={{
                      border: "1px solid #2D3748",
                      borderRadius: "20px",
                      minHeight: "200px",
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: theme.palette.secondary.main,
                      },
                    }}
                  >
                    <Stack
                      sx={{
                        flexDirection: "row",
                        // border: "1px solid #2D3748",
                        minHeight: "40px",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingLeft: 2,
                        paddingRight: 2,
                      }}
                    >
                      <Stack direction="row" gap={1} alignItems="center">
                        <FiberManualRecord color="success" fontSize="65px" />
                        <Typography sx={{ fontSize: "15px" }}>
                          {item.fullName}
                        </Typography>
                      </Stack>

                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Chip
                          variant="filled"
                          color="primary"
                          size="small"
                          icon={
                            <AccessTimeOutlined
                              sx={{
                                fontSize: "16px",
                                color: theme.palette.text.secondary,
                              }}
                            />
                          }
                          label={`Posted at ${moment(item?.created_At).format(
                            "LL"
                          )}`}
                        />
                      </Stack>
                    </Stack>

                    <Stack
                      sx={{
                        border: "1px solid #2D3748",
                        minHeight: "120px",
                        padding: 2,
                      }}
                    >
                      <Typography sx={{ fontSize: "15px" }}>
                        {item.concern}
                      </Typography>
                    </Stack>

                    <Stack
                      sx={{
                        width: "100%",
                        minHeight: "40px",
                        alignItems: "end",
                        paddingRight: 2,
                        paddingLeft: 2,
                      }}
                    >
                      <ReceiverConcernsActions
                        data={item}
                        onView={onViewAction}
                      />
                      {/* <Button variant="text">View Details</Button> */}
                    </Stack>
                  </Stack>
                ))}

              {(isLoading || isFetching) && (
                <Stack
                  width="100%"
                  height="100%"
                  justifyContent="center"
                  alignItems="center"
                >
                  <CircularProgress />
                  <Typography variant="h4" color="#EDF2F7">
                    Please wait...
                  </Typography>
                </Stack>
              )}

              {isSuccess && !data?.value?.requestConcern.length && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="h4" color="#EDF2F7">
                      No records found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </Stack>

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

        <Paper
          sx={{
            width: "30%",
            minHeight: "90vh",
            display: addData ? "flex" : "none",
            flexDirection: "column",
            backgroundColor: theme.palette.bgForm.black3,
            padding: 4,
          }}
        >
          <Stack height="100%">
            <Stack sx={{ minHeight: "70px", border: "1px solid #2D3748" }}>
              <Typography variant="h5">Create Ticket</Typography>
              <Typography
                sx={{ fontSize: "14px", color: theme.palette.text.secondary }}
              >
                Add issue handler details to create ticket from this concern{" "}
              </Typography>
            </Stack>

            <Stack
              sx={{ minHeight: "1000px", border: "1px solid #2D3748" }}
            ></Stack>

            <Stack
              sx={{
                flexDirection: "row",
                gap: 2,
                justifyContent: "right",
                alignItems: "center",
                minHeight: "70px",
                border: "1px solid #2D3748",
              }}
            >
              <Button variant="contained"> Submit </Button>
              <Button variant="outlined" onClick={onCloseAddAction}>
                {" "}
                Close{" "}
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Stack>

      <ReceiverConcernDialog
        open={open}
        onClose={onDialogClose}
        data={viewData}
      />
    </Stack>
  );
};

export default ReceiverConcerns;
