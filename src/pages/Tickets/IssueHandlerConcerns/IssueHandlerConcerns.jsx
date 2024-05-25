import {
  Badge,
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
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
  Typography,
} from "@mui/material";
import {
  AccessTimeOutlined,
  AddOutlined,
  ConfirmationNumberOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Search,
} from "@mui/icons-material";

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { theme } from "../../../theme/theme";
import { Toaster, toast } from "sonner";

import useDebounce from "../../../hooks/useDebounce";
import useDisclosure from "../../../hooks/useDisclosure";
import { useGetIssueHandlerConcernsQuery } from "../../../features/api_ticketing/issue_handler/concernIssueHandlerApi";
import moment from "moment";
import IssueViewDialog from "./IssueViewDialog";

const IssueHandlerConcerns = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue, 500);

  const [viewData, setViewData] = useState(null);

  const {
    open: viewOpen,
    onToggle: viewOnToggle,
    onClose: viewOnClose,
  } = useDisclosure();

  const { data, isLoading, isFetching, isSuccess, isError } =
    useGetIssueHandlerConcernsQuery({
      Search: search,
      PageNumber: pageNumber,
      PageSize: pageSize,
    });

  console.log("Data: ", data);

  const dummyData = {
    concerns: [
      {
        concernId: 1001,
        description:
          "This is my concern This is my concern This is my concern This is my concern This is my concern This is my concern  This is my concern This is my concern This is my concern This is my concern This is my concern",
        requestorName: "GUMAPOS, RODRIGO JR. SINDAY",
        department: "Engineering and Technical",
        tickets: [
          {
            ticketNo: 1,
            ticketDescription: "Elixir ETD - MRP Adjustments",
            startDate: "2024-11-11",
            targetDate: "2024-11-11",
            dateClose: "2024-11-11",
            remarks: "Delayed",
            status: "Closed",
          },
          {
            ticketNo: 2,
            ticketDescription: "Elixir ETD - Move Order Adjustments",
            startDate: "2024-11-11",
            targetDate: "2024-11-11",
            dateClose: "2024-11-11",
            remarks: "On-Time",
            status: "Closed",
          },
          {
            ticketNo: 3,
            ticketDescription: "Elixir ETD - Warehouse Receiving Adjustments",
            startDate: "2024-11-11",
            targetDate: "2024-11-11",
            dateClose: "2024-11-11",
            remarks: "Delayed",
            status: "Closed",
          },
        ],
      },
      {
        concernId: 1002,
        description: "Concern 2",
        requestorName: "GUMAPOS, RODRIGO JR. SINDAY",
        department: "Engineering and Technical",
        tickets: [
          {
            ticketNo: 3,
            ticketDescription: "Elixir ETD - Reports Adjustments",
            startDate: "2024-11-11",
            targetDate: "2024-11-11",
            dateClose: "2024-11-11",
            remarks: "Delayed",
            status: "Closed",
          },
          {
            ticketNo: 4,
            ticketDescription: "Elixir ETD - Borrowed Transaction Adjustments",
            startDate: "2024-11-11",
            targetDate: "2024-11-11",
            dateClose: "2024-11-11",
            remarks: "",
            status: "Open",
          },
          {
            ticketNo: 5,
            ticketDescription: "Elixir ETD - Ordering Adjustments",
            startDate: "2024-11-11",
            targetDate: "2024-11-11",
            dateClose: "2024-11-11",
            remarks: "On-Time",
            status: "Closed",
          },
        ],
      },
    ],
  };

  const [openCollapse, setOpenCollapse] = useState({});

  const handleCollapseToggle = (requestTransactionId) => {
    setOpenCollapse((prev) => ({
      ...prev,
      [requestTransactionId]: !prev[requestTransactionId],
    }));
  };

  const onViewDialogHandler = (data) => {
    console.log("data: ", data);

    setViewData(data);
  };

  return (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: theme.palette.bgForm.black1,
        color: "#fff",
        padding: "44px",
      }}
    >
      <Stack>
        <Stack direction="row" justifyContent="space-between">
          <Stack justifyItems="left">
            <Typography variant="h4">Concerns</Typography>
          </Stack>
          <Stack justifyItems="space-between" direction="row"></Stack>
        </Stack>

        <Stack
          sx={{
            backgroundColor: theme.palette.bgForm.black3,
            borderRadius: "20px",
            marginTop: "20px",
            height: "75vh",
          }}
        >
          <Stack direction="row" justifyContent="space-between" padding={3}>
            <Typography sx={{ fontWeight: "500", fontSize: "18px" }}>
              {" "}
              List of Concerns
            </Typography>
          </Stack>

          <Divider
            variant="fullWidth"
            sx={{
              background: "#2D3748",
              marginTop: "1px",
              marginBottom: 3,
              lineHeight: 1,
            }}
          />

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
                  ></TableCell>
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
                    REQUESTOR
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {isSuccess &&
                  !isLoading &&
                  !isFetching &&
                  data?.value?.closingTicket?.map((item) => (
                    <React.Fragment key={item.requestTransactionId}>
                      <TableRow
                        key={item.requestTransactionId}
                        onClick={() => onViewDialogHandler(item)}
                      >
                        <TableCell
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "14px",
                            fontWeight: 500,
                          }}
                          align="center"
                        >
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleCollapseToggle(item.requestTransactionId)
                            }
                          >
                            {openCollapse[item.requestTransactionId] ? (
                              <KeyboardArrowUp />
                            ) : (
                              <KeyboardArrowDown />
                            )}
                          </IconButton>
                        </TableCell>

                        <TableCell
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "14px",
                            fontWeight: 500,
                          }}
                          align="center"
                        >
                          {item.requestTransactionId}
                        </TableCell>

                        <TableCell
                          className="ellipsis-styling"
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "14px",
                            fontWeight: 500,
                            maxWidth: "700px",
                          }}
                        >
                          {item.description}
                        </TableCell>

                        <TableCell
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "14px",
                            fontWeight: 500,
                          }}
                        >
                          <Typography
                            sx={{
                              color: theme.palette.text.secondary,
                              fontSize: "12px",
                              fontWeight: 500,
                            }}
                          >
                            {item.empId}
                          </Typography>

                          <Typography
                            sx={{
                              color: "#EDF2F7",
                              fontSize: "14px",
                              fontWeight: 500,
                            }}
                          >
                            {item.requestor_Name}
                          </Typography>

                          <Typography
                            sx={{
                              color: theme.palette.text.secondary,
                              fontSize: "12px",
                              fontWeight: 500,
                            }}
                          >
                            {item.departmentId} - {item.department_Name}
                          </Typography>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                          colSpan={6}
                        >
                          <Collapse
                            in={openCollapse[item.requestTransactionId]}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box sx={{ margin: 1 }}>
                              <Typography
                                component="div"
                                sx={{
                                  color: theme.palette.text.main,
                                  fontSize: "17px",
                                  fontWeight: 600,
                                }}
                              >
                                <Stack
                                  direction="row"
                                  gap={1}
                                  alignItems="center"
                                >
                                  {/* <Badge
                                    badgeContent={item.openTicketCount}
                                    color="primary"
                                  >
                                    <ConfirmationNumberOutlined />
                                  </Badge> */}
                                  TICKETS
                                </Stack>
                              </Typography>
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell
                                      sx={{
                                        background: "#1C2536",
                                        color: "#EDF2F7",
                                        fontSize: "12px",
                                        fontWeight: 500,
                                      }}
                                      align="center"
                                    >
                                      TICKET NO.
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        background: "#1C2536",
                                        color: "#EDF2F7",
                                        fontSize: "12px",
                                        fontWeight: 500,
                                      }}
                                    >
                                      TICKET DESCRIPTION
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        background: "#1C2536",
                                        color: "#EDF2F7",
                                        fontSize: "12px",
                                        fontWeight: 500,
                                      }}
                                    >
                                      <Stack
                                        direction="row"
                                        alignItems="center"
                                        gap={0.5}
                                      >
                                        <AccessTimeOutlined
                                          sx={{ fontSize: "16px" }}
                                        />
                                        START DATE
                                      </Stack>
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        background: "#1C2536",
                                        color: "#EDF2F7",
                                        fontSize: "12px",
                                        fontWeight: 500,
                                      }}
                                    >
                                      <Stack
                                        direction="row"
                                        alignItems="center"
                                        gap={0.5}
                                      >
                                        <AccessTimeOutlined
                                          sx={{ fontSize: "16px" }}
                                        />
                                        TARGET DATE
                                      </Stack>
                                    </TableCell>

                                    {/* <TableCell
                                      sx={{
                                        background: "#1C2536",
                                        color: "#EDF2F7",
                                        fontSize: "12px",
                                        fontWeight: 500,
                                      }}
                                    >
                                      <Stack
                                        direction="row"
                                        alignItems="center"
                                        gap={0.5}
                                      >
                                        <AccessTimeOutlined
                                          sx={{ fontSize: "16px" }}
                                        />
                                        CLOSE DATE
                                      </Stack>
                                    </TableCell> */}

                                    <TableCell
                                      sx={{
                                        background: "#1C2536",
                                        color: "#EDF2F7",
                                        fontSize: "12px",
                                        fontWeight: 500,
                                      }}
                                    >
                                      REMARKS
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        background: "#1C2536",
                                        color: "#EDF2F7",
                                        fontSize: "12px",
                                        fontWeight: 500,
                                      }}
                                    >
                                      STATUS
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {item?.openTickets?.map((subItem) => (
                                    <TableRow key={subItem.ticketConcernId}>
                                      <TableCell
                                        sx={{
                                          color: theme.palette.text.secondary,
                                          fontSize: "14px",
                                          fontWeight: 500,
                                          maxWidth: "700px",
                                        }}
                                        align="center"
                                      >
                                        {subItem.ticketConcernId}
                                      </TableCell>

                                      <TableCell
                                        sx={{
                                          color: theme.palette.text.secondary,
                                          fontSize: "14px",
                                          fontWeight: 500,
                                          maxWidth: "700px",
                                        }}
                                      >
                                        {subItem.concern_Description}
                                      </TableCell>

                                      <TableCell
                                        sx={{
                                          color: theme.palette.text.secondary,
                                          fontSize: "14px",
                                          fontWeight: 500,
                                          maxWidth: "700px",
                                        }}
                                      >
                                        {moment(subItem.start_Date).format(
                                          "YYYY-MM-DD"
                                        )}
                                      </TableCell>

                                      <TableCell
                                        sx={{
                                          color: theme.palette.text.secondary,
                                          fontSize: "14px",
                                          fontWeight: 500,
                                          maxWidth: "700px",
                                        }}
                                      >
                                        {moment(subItem.target_Date).format(
                                          "YYYY-MM-DD"
                                        )}
                                      </TableCell>

                                      {/* <TableCell
                                        sx={{
                                          color: theme.palette.text.secondary,
                                          fontSize: "14px",
                                          fontWeight: 500,
                                          maxWidth: "700px",
                                        }}
                                      >
                                        {subItem.dateClose}
                                      </TableCell> */}

                                      <TableCell
                                        sx={{
                                          color: theme.palette.text.secondary,
                                          fontSize: "14px",
                                          fontWeight: 500,
                                          maxWidth: "700px",
                                        }}
                                      >
                                        <Chip
                                          variant="filled"
                                          size="small"
                                          label={
                                            subItem.remarks === "On-Time"
                                              ? "On-Time"
                                              : subItem.remarks === "Delayed"
                                              ? "Delayed"
                                              : ""
                                          }
                                          sx={{
                                            backgroundColor:
                                              subItem.remarks === "On-Time"
                                                ? "#00913c"
                                                : subItem.remarks === "Delayed"
                                                ? "#a32421"
                                                : "transparent",
                                            color: "#ffffffde",
                                            borderRadius: "none",
                                          }}
                                        />
                                      </TableCell>

                                      <TableCell
                                        sx={{
                                          color: theme.palette.text.secondary,
                                          fontSize: "14px",
                                          fontWeight: 500,
                                          maxWidth: "700px",
                                        }}
                                      >
                                        <Chip
                                          variant="filled"
                                          size="small"
                                          label={
                                            subItem.status === "Closed"
                                              ? "Closed"
                                              : subItem.status === "Open"
                                              ? "Open"
                                              : ""
                                          }
                                          sx={{
                                            backgroundColor:
                                              subItem.status === "Closed"
                                                ? "#00913c"
                                                : "#ec9d29",
                                            color: "#ffffffde",
                                            borderRadius: "none",
                                          }}
                                        />
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>

        <IssueViewDialog
          data={viewData}
          viewOpen={viewOpen}
          viewOnClose={viewOnClose}
        />
      </Stack>
    </Stack>
  );
};

export default IssueHandlerConcerns;
