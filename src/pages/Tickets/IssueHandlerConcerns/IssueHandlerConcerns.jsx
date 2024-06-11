import {
  Badge,
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
} from "@mui/material";
import { AccessTimeOutlined, CalendarMonthOutlined, DiscountOutlined, DoneAllOutlined, HistoryToggleOffOutlined, PendingActionsOutlined, Search } from "@mui/icons-material";

import React, { useEffect, useState } from "react";
import moment from "moment";
import { theme } from "../../../theme/theme";

import useDebounce from "../../../hooks/useDebounce";
import useDisclosure from "../../../hooks/useDisclosure";

import noRecordsFound from "../../../assets/svg/noRecordsFound.svg";
import somethingWentWrong from "../../../assets/svg/SomethingWentWrong.svg";

import { useGetIssueHandlerConcernsQuery } from "../../../features/api_ticketing/issue_handler/concernIssueHandlerApi";

import IssueViewDialog from "./IssueViewDialog";
import IssueHandlerConcernsActions from "./IssuHandlerConcernsActions";
import IssueHandlerClosingDialog from "./IssueHandlerClosingDialog";

const IssueHandlerConcerns = () => {
  const [ticketStatus, setTicketStatus] = useState("Open Ticket");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue, 500);

  const [viewData, setViewData] = useState(null);
  const [closeTicketData, setCloseTicketData] = useState(null);

  const { open: viewOpen, onToggle: viewOnToggle, onClose: viewOnClose } = useDisclosure();
  const { open: closeTicketOpen, onToggle: closeTicketOnToggle, onClose: closeTicketOnClose } = useDisclosure();

  const { data, isLoading, isFetching, isSuccess, isError } = useGetIssueHandlerConcernsQuery({
    Concern_Status: ticketStatus,
    Search: search,
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
    setTicketStatus(newValue);
    setPageNumber(1);
    setPageSize(5);
  };

  const onViewAction = (data) => {
    // console.log("data: ", data);

    viewOnToggle();
    setViewData(data);
  };

  const onCloseTicketAction = (data) => {
    closeTicketOnToggle();
    setCloseTicketData(data);
  };

  const onDialogClose = () => {
    closeTicketOnClose();
  };

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
      <Stack>
        <Stack direction="row" justifyContent="space-between">
          <Stack justifyItems="left">
            <Typography variant="h4">Tickets</Typography>
          </Stack>
          <Stack justifyItems="space-between" direction="row"></Stack>
        </Stack>

        <Stack
          sx={{
            backgroundColor: theme.palette.bgForm.black3,
            borderRadius: "20px",
            marginTop: "10px",
            height: "75vh",
          }}
        >
          <Stack direction="row" justifyContent="space-between" paddingLeft={1} paddingRight={1}>
            <Tabs value={ticketStatus} onChange={onStatusChange}>
              <Tab
                value="Open Ticket"
                className="tabs-styling"
                label="Open"
                icon={
                  <Badge
                    badgeContent={100}
                    color="warning"
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
                    <DiscountOutlined />
                  </Badge>
                }
                iconPosition="start"
                sx={{
                  fontSize: "12px",
                  fontWeight: 600,
                  ".MuiBadge-badge": {
                    color: "#ffff",
                  },
                }}
              />

              <Tab
                value="For Closing Ticket"
                className="tabs-styling"
                label="For Closing"
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
                value="Closed"
                className="tabs-styling"
                label="Closed"
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
                    <DoneAllOutlined />
                  </Badge>
                }
                iconPosition="start"
                sx={{
                  fontSize: "12px",
                  fontWeight: 600,
                  // backgroundColor: theme.palette.error.main,
                  // color: theme.palette.text.main,
                }}
              />

              <Tab
                value=""
                className="tabs-styling"
                label="History"
                icon={
                  <Badge
                    badgeContent={100}
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
                    <HistoryToggleOffOutlined />
                  </Badge>
                }
                iconPosition="start"
                sx={{
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              />
            </Tabs>

            <Stack sx={{ alignItems: "center", justifyContent: "center" }}>
              <OutlinedInput
                placeholder="Search"
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
                    STATUS
                  </TableCell>

                  <TableCell
                    sx={{
                      background: "#1C2536",
                      color: "#D65DB1",
                      fontWeight: 700,
                      fontSize: "12px",
                    }}
                  >
                    ACTION
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {isSuccess &&
                  !isLoading &&
                  !isFetching &&
                  data?.value?.openTicket?.map((item) => (
                    <React.Fragment key={item.ticketConcernId}>
                      <TableRow key={item.ticketConcernId}>
                        <TableCell
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "12px",
                            fontWeight: 500,
                          }}
                          align="center"
                          onClick={() => onViewAction(item)}
                        >
                          {item.ticketConcernId}
                        </TableCell>

                        <TableCell
                          // className="ellipsis-styling"
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "12px",
                            fontWeight: 500,
                            maxWidth: "700px",
                          }}
                          onClick={() => onViewAction(item)}
                        >
                          {item.concern_Description}
                        </TableCell>

                        <TableCell
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "12px",
                            fontWeight: 500,
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
                            label={moment(item.start_Date).format("LL")}
                          />
                        </TableCell>

                        <TableCell
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "12px",
                            fontWeight: 500,
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
                            label={moment(item.target_Date).format("LL")}
                          />
                        </TableCell>

                        <TableCell
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "12px",
                            fontWeight: 500,
                          }}
                          onClick={() => onViewAction(item)}
                        >
                          <Chip
                            variant="filled"
                            size="small"
                            label={item.remarks === "On-Time" ? "On-Time" : item.remarks === "Delayed" ? "Delayed" : ""}
                            sx={{
                              backgroundColor: item.remarks === "On-Time" ? "#00913c" : item.remarks === "Delayed" ? "#a32421" : "transparent",
                              color: "#ffffffde",
                              borderRadius: "none",
                            }}
                          />
                        </TableCell>

                        <TableCell
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "12px",
                            fontWeight: 500,
                          }}
                          onClick={() => onViewAction(item)}
                        >
                          <Chip
                            variant="filled"
                            size="small"
                            label={item.ticket_Status === "Open Ticket" ? "Open" : "For Closing Ticket" ? "For Closing" : ""}
                            sx={{
                              backgroundColor: item.ticket_Status === "Open Ticket" ? "#ec9d29" : "For Closing Ticket" ? "#3A96FA" : "#00913c",
                              color: "#ffffffde",
                              borderRadius: "20px",
                            }}
                          />
                        </TableCell>

                        <TableCell
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "12px",
                            fontWeight: 500,
                            maxWidth: "700px",
                          }}
                        >
                          <IssueHandlerConcernsActions data={item} onCloseTicket={onCloseTicketAction} />
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
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

                {isSuccess && !data?.value?.openTicket.length && (
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
        </Stack>

        <IssueViewDialog data={viewData} viewOpen={viewOpen} viewOnClose={viewOnClose} />
        <IssueHandlerClosingDialog data={closeTicketData} open={closeTicketOpen} onClose={onDialogClose} />
      </Stack>
    </Stack>
  );
};

export default IssueHandlerConcerns;

// OLD CODES
// import {
//   Badge,
//   Box,
//   Button,
//   Chip,
//   CircularProgress,
//   Collapse,
//   Divider,
//   IconButton,
//   OutlinedInput,
//   Stack,
//   Tab,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TablePagination,
//   TableRow,
//   Tabs,
//   TextField,
//   Typography,
// } from "@mui/material";
// import { AccessTimeOutlined, AddOutlined, ConfirmationNumberOutlined, KeyboardArrowDown, KeyboardArrowUp, Search } from "@mui/icons-material";

// import React, { useEffect, useState } from "react";
// import moment from "moment";
// import Swal from "sweetalert2";
// import { theme } from "../../../theme/theme";
// import { Toaster, toast } from "sonner";

// import { Controller, useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";

// import useDebounce from "../../../hooks/useDebounce";
// import useDisclosure from "../../../hooks/useDisclosure";

// import { useGetIssueHandlerConcernsQuery } from "../../../features/api_ticketing/issue_handler/concernIssueHandlerApi";

// import IssueViewDialog from "./IssueViewDialog";

// const schema = yup.object().shape({
//   ticketDescription: yup.string().required("Description is required"),
//   startDate: yup.date().required("Start date is required"),
//   targetDate: yup.date().required().label("Target date is required"),
// });

// const IssueHandlerConcerns = () => {
//   const [status, setStatus] = useState("true");
//   const [pageNumber, setPageNumber] = useState(1);
//   const [pageSize, setPageSize] = useState(5);

//   const [searchValue, setSearchValue] = useState("");
//   const search = useDebounce(searchValue, 500);

//   const [viewData, setViewData] = useState(null);

//   const { open: viewOpen, onToggle: viewOnToggle, onClose: viewOnClose } = useDisclosure();

//   const { data, isLoading, isFetching, isSuccess, isError } = useGetIssueHandlerConcernsQuery({
//     Search: search,
//     PageNumber: pageNumber,
//     PageSize: pageSize,
//   });

//   const dummyData = {
//     concerns: [
//       {
//         concernId: 1001,
//         description:
//           "This is my concern This is my concern This is my concern This is my concern This is my concern This is my concern  This is my concern This is my concern This is my concern This is my concern This is my concern",
//         requestorName: "GUMAPOS, RODRIGO JR. SINDAY",
//         department: "Engineering and Technical",
//         tickets: [
//           {
//             ticketNo: 1,
//             ticketDescription: "Elixir ETD - MRP Adjustments",
//             startDate: "2024-11-11",
//             targetDate: "2024-11-11",
//             dateClose: "2024-11-11",
//             remarks: "Delayed",
//             status: "Closed",
//           },
//           {
//             ticketNo: 2,
//             ticketDescription: "Elixir ETD - Move Order Adjustments",
//             startDate: "2024-11-11",
//             targetDate: "2024-11-11",
//             dateClose: "2024-11-11",
//             remarks: "On-Time",
//             status: "Closed",
//           },
//           {
//             ticketNo: 3,
//             ticketDescription: "Elixir ETD - Warehouse Receiving Adjustments",
//             startDate: "2024-11-11",
//             targetDate: "2024-11-11",
//             dateClose: "2024-11-11",
//             remarks: "Delayed",
//             status: "Closed",
//           },
//         ],
//       },
//       {
//         concernId: 1002,
//         description: "Concern 2",
//         requestorName: "GUMAPOS, RODRIGO JR. SINDAY",
//         department: "Engineering and Technical",
//         tickets: [
//           {
//             ticketNo: 3,
//             ticketDescription: "Elixir ETD - Reports Adjustments",
//             startDate: "2024-11-11",
//             targetDate: "2024-11-11",
//             dateClose: "2024-11-11",
//             remarks: "Delayed",
//             status: "Closed",
//           },
//           {
//             ticketNo: 4,
//             ticketDescription: "Elixir ETD - Borrowed Transaction Adjustments",
//             startDate: "2024-11-11",
//             targetDate: "2024-11-11",
//             dateClose: "2024-11-11",
//             remarks: "",
//             status: "Open",
//           },
//           {
//             ticketNo: 5,
//             ticketDescription: "Elixir ETD - Ordering Adjustments",
//             startDate: "2024-11-11",
//             targetDate: "2024-11-11",
//             dateClose: "2024-11-11",
//             remarks: "On-Time",
//             status: "Closed",
//           },
//         ],
//       },
//     ],
//   };

//   const [openCollapse, setOpenCollapse] = useState({});
//   const [addTicketForm, setAddTicketForm] = useState({});

//   const {
//     control,
//     handleSubmit,
//     reset,
//     watch,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(schema),
//     defaultValues: {
//       ticketDescription: "",
//       startDate: "",
//       targetDate: "",
//     },
//   });

//   const onPageNumberChange = (_, page) => {
//     setPageNumber(page + 1);
//   };

//   const onPageSizeChange = (e) => {
//     setPageSize(e.target.value);
//     setPageNumber(1);
//   };

//   const onStatusChange = (_, newValue) => {
//     setStatus(newValue);
//     setPageNumber(1);
//     setPageSize(5);
//   };

//   const handleCollapseToggle = (requestTransactionId) => {
//     setOpenCollapse((prev) => ({
//       ...prev,
//       [requestTransactionId]: !prev[requestTransactionId],
//     }));
//   };

//   const handleAddTicketToggle = (requestTransactionId) => {
//     setAddTicketForm((prev) => ({
//       ...prev,
//       [requestTransactionId]: !prev[requestTransactionId],
//     }));
//     reset();
//   };

//   const onViewAction = (data) => {
//     console.log("data: ", data);

//     viewOnToggle();
//     setViewData(data);
//     // setOpenCollapse(!openCollapse);
//   };

//   const onSubmit = (formData) => {
//     console.log("Form Data: ", formData);
//     // Handle save logic
//     reset();
//   };

//   return (
//     <Stack
//       sx={{
//         width: "100%",
//         height: "100%",
//         display: "flex",
//         backgroundColor: theme.palette.bgForm.black1,
//         color: "#fff",
//         padding: "44px",
//       }}
//     >
//       <Stack>
//         <Stack direction="row" justifyContent="space-between">
//           <Stack justifyItems="left">
//             <Typography variant="h4">Concerns</Typography>
//           </Stack>
//           <Stack justifyItems="space-between" direction="row"></Stack>
//         </Stack>

//         <Stack
//           sx={{
//             backgroundColor: theme.palette.bgForm.black3,
//             borderRadius: "20px",
//             marginTop: "20px",
//             height: "75vh",
//           }}
//         >
//           <Stack direction="row" justifyContent="space-between" padding={3}>
//             <Typography sx={{ fontWeight: "500", fontSize: "18px" }}> List of Concerns</Typography>
//           </Stack>

//           <Divider
//             variant="fullWidth"
//             sx={{
//               background: "#2D3748",
//               marginTop: "1px",
//               marginBottom: 3,
//               lineHeight: 1,
//             }}
//           />

//           <TableContainer>
//             <Table sx={{ borderBottom: "none" }}>
//               <TableHead>
//                 <TableRow>
//                   <TableCell
//                     sx={{
//                       background: "#1C2536",
//                       color: "#D65DB1",
//                       fontWeight: 700,
//                       fontSize: "12px",
//                     }}
//                     align="center"
//                   ></TableCell>
//                   <TableCell
//                     sx={{
//                       background: "#1C2536",
//                       color: "#D65DB1",
//                       fontWeight: 700,
//                       fontSize: "12px",
//                     }}
//                     align="center"
//                   >
//                     CONCERN NO.
//                   </TableCell>

//                   <TableCell
//                     sx={{
//                       background: "#1C2536",
//                       color: "#D65DB1",
//                       fontWeight: 700,
//                       fontSize: "12px",
//                     }}
//                   >
//                     DESCRIPTION
//                   </TableCell>

//                   <TableCell
//                     sx={{
//                       background: "#1C2536",
//                       color: "#D65DB1",
//                       fontWeight: 700,
//                       fontSize: "12px",
//                     }}
//                   >
//                     REQUESTOR
//                   </TableCell>
//                 </TableRow>
//               </TableHead>

//               <TableBody>
//                 {isSuccess &&
//                   !isLoading &&
//                   !isFetching &&
//                   data?.value?.closingTicket?.map((item) => (
//                     <React.Fragment key={item.requestTransactionId}>
//                       <TableRow key={item.requestTransactionId}>
//                         <TableCell
//                           sx={{
//                             color: "#EDF2F7",
//                             fontSize: "14px",
//                             fontWeight: 500,
//                           }}
//                           align="center"
//                         >
//                           <IconButton size="small" onClick={() => handleCollapseToggle(item.requestTransactionId)}>
//                             {openCollapse[item.requestTransactionId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
//                           </IconButton>
//                         </TableCell>

//                         <TableCell
//                           sx={{
//                             color: "#EDF2F7",
//                             fontSize: "14px",
//                             fontWeight: 500,
//                           }}
//                           align="center"
//                           onClick={() => onViewAction(item)}
//                         >
//                           {item.requestTransactionId}
//                         </TableCell>

//                         <TableCell
//                           // className="ellipsis-styling"
//                           sx={{
//                             color: "#EDF2F7",
//                             fontSize: "14px",
//                             fontWeight: 500,
//                             maxWidth: "700px",
//                           }}
//                           onClick={() => onViewAction(item)}
//                         >
//                           {item.description}
//                         </TableCell>

//                         <TableCell
//                           sx={{
//                             color: "#EDF2F7",
//                             fontSize: "14px",
//                             fontWeight: 500,
//                           }}
//                           onClick={() => onViewAction(item)}
//                         >
//                           <Typography
//                             sx={{
//                               color: theme.palette.text.secondary,
//                               fontSize: "12px",
//                               fontWeight: 500,
//                             }}
//                           >
//                             {item.empId}
//                           </Typography>

//                           <Typography
//                             sx={{
//                               color: "#EDF2F7",
//                               fontSize: "14px",
//                               fontWeight: 500,
//                             }}
//                           >
//                             {item.requestor_Name}
//                           </Typography>

//                           <Typography
//                             sx={{
//                               color: theme.palette.text.secondary,
//                               fontSize: "12px",
//                               fontWeight: 500,
//                             }}
//                           >
//                             {item.departmentId} - {item.department_Name}
//                           </Typography>
//                         </TableCell>
//                       </TableRow>

//                       <TableRow>
//                         <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
//                           <Collapse in={openCollapse[item.requestTransactionId]} timeout="auto" unmountOnExit>
//                             <Box sx={{ margin: 1 }}>
//                               <Typography
//                                 component="div"
//                                 sx={{
//                                   color: theme.palette.text.main,
//                                   fontSize: "17px",
//                                   fontWeight: 600,
//                                 }}
//                               >
//                                 <Stack direction="row" gap={1} alignItems="center">
//                                   {/* <Badge
//                                     badgeContent={item.openTicketCount}
//                                     color="primary"
//                                   >
//                                     <ConfirmationNumberOutlined />
//                                   </Badge> */}
//                                   TICKETS
//                                 </Stack>
//                               </Typography>
//                               <Table size="small">
//                                 <TableHead>
//                                   <TableRow>
//                                     <TableCell
//                                       sx={{
//                                         background: "#1C2536",
//                                         color: "#EDF2F7",
//                                         fontSize: "12px",
//                                         fontWeight: 500,
//                                       }}
//                                       align="center"
//                                     >
//                                       TICKET NO.
//                                     </TableCell>

//                                     <TableCell
//                                       sx={{
//                                         background: "#1C2536",
//                                         color: "#EDF2F7",
//                                         fontSize: "12px",
//                                         fontWeight: 500,
//                                       }}
//                                     >
//                                       TICKET DESCRIPTION
//                                     </TableCell>

//                                     <TableCell
//                                       sx={{
//                                         background: "#1C2536",
//                                         color: "#EDF2F7",
//                                         fontSize: "12px",
//                                         fontWeight: 500,
//                                       }}
//                                     >
//                                       <Stack direction="row" alignItems="center" gap={0.5}>
//                                         <AccessTimeOutlined sx={{ fontSize: "16px" }} />
//                                         START DATE
//                                       </Stack>
//                                     </TableCell>

//                                     <TableCell
//                                       sx={{
//                                         background: "#1C2536",
//                                         color: "#EDF2F7",
//                                         fontSize: "12px",
//                                         fontWeight: 500,
//                                       }}
//                                     >
//                                       <Stack direction="row" alignItems="center" gap={0.5}>
//                                         <AccessTimeOutlined sx={{ fontSize: "16px" }} />
//                                         TARGET DATE
//                                       </Stack>
//                                     </TableCell>

//                                     {/* <TableCell
//                                       sx={{
//                                         background: "#1C2536",
//                                         color: "#EDF2F7",
//                                         fontSize: "12px",
//                                         fontWeight: 500,
//                                       }}
//                                     >
//                                       <Stack
//                                         direction="row"
//                                         alignItems="center"
//                                         gap={0.5}
//                                       >
//                                         <AccessTimeOutlined
//                                           sx={{ fontSize: "16px" }}
//                                         />
//                                         CLOSE DATE
//                                       </Stack>
//                                     </TableCell> */}

//                                     <TableCell
//                                       sx={{
//                                         background: "#1C2536",
//                                         color: "#EDF2F7",
//                                         fontSize: "12px",
//                                         fontWeight: 500,
//                                       }}
//                                     >
//                                       REMARKS
//                                     </TableCell>

//                                     <TableCell
//                                       sx={{
//                                         background: "#1C2536",
//                                         color: "#EDF2F7",
//                                         fontSize: "12px",
//                                         fontWeight: 500,
//                                       }}
//                                     >
//                                       STATUS
//                                     </TableCell>
//                                   </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                   {item?.openTickets?.map((subItem) => (
//                                     <TableRow key={subItem.ticketConcernId}>
//                                       <TableCell
//                                         sx={{
//                                           color: theme.palette.text.secondary,
//                                           fontSize: "14px",
//                                           fontWeight: 500,
//                                           maxWidth: "700px",
//                                         }}
//                                         align="center"
//                                       >
//                                         {subItem.ticketConcernId}
//                                       </TableCell>

//                                       <TableCell
//                                         sx={{
//                                           color: theme.palette.text.secondary,
//                                           fontSize: "14px",
//                                           fontWeight: 500,
//                                           maxWidth: "700px",
//                                         }}
//                                       >
//                                         {subItem.concern_Description}
//                                       </TableCell>

//                                       <TableCell
//                                         sx={{
//                                           color: theme.palette.text.secondary,
//                                           fontSize: "14px",
//                                           fontWeight: 500,
//                                           maxWidth: "700px",
//                                         }}
//                                       >
//                                         {moment(subItem.start_Date).format("YYYY-MM-DD")}
//                                       </TableCell>

//                                       <TableCell
//                                         sx={{
//                                           color: theme.palette.text.secondary,
//                                           fontSize: "14px",
//                                           fontWeight: 500,
//                                           maxWidth: "700px",
//                                         }}
//                                       >
//                                         {moment(subItem.target_Date).format("YYYY-MM-DD")}
//                                       </TableCell>

//                                       {/* <TableCell
//                                         sx={{
//                                           color: theme.palette.text.secondary,
//                                           fontSize: "14px",
//                                           fontWeight: 500,
//                                           maxWidth: "700px",
//                                         }}
//                                       >
//                                         {subItem.dateClose}
//                                       </TableCell> */}

//                                       <TableCell
//                                         sx={{
//                                           color: theme.palette.text.secondary,
//                                           fontSize: "14px",
//                                           fontWeight: 500,
//                                           maxWidth: "700px",
//                                         }}
//                                       >
//                                         <Chip
//                                           variant="filled"
//                                           size="small"
//                                           label={subItem.remarks === "On-Time" ? "On-Time" : subItem.remarks === "Delayed" ? "Delayed" : ""}
//                                           sx={{
//                                             backgroundColor: subItem.remarks === "On-Time" ? "#00913c" : subItem.remarks === "Delayed" ? "#a32421" : "transparent",
//                                             color: "#ffffffde",
//                                             borderRadius: "none",
//                                           }}
//                                         />
//                                       </TableCell>

//                                       <TableCell
//                                         sx={{
//                                           color: theme.palette.text.secondary,
//                                           fontSize: "14px",
//                                           fontWeight: 500,
//                                           maxWidth: "700px",
//                                         }}
//                                       >
//                                         <Chip
//                                           variant="filled"
//                                           size="small"
//                                           label={subItem.ticket_Status === "Open Ticket" ? "Open" : "Pending"}
//                                           sx={{
//                                             backgroundColor: subItem.ticket_Status === "Open Ticket" ? "#00913c" : "#ec9d29",
//                                             color: "#ffffffde",
//                                             borderRadius: "none",
//                                           }}
//                                         />
//                                       </TableCell>
//                                     </TableRow>
//                                   ))}
//                                 </TableBody>
//                               </Table>

//                               <Stack sx={{ alignItems: "end", marginTop: 2 }}>
//                                 {/* <Stack /> */}
//                                 <Button variant="contained" color="primary" onClick={() => handleAddTicketToggle(item.requestTransactionId)}>
//                                   {addTicketForm[item.requestTransactionId] ? "Cancel" : "Add Ticket"}
//                                 </Button>
//                               </Stack>

//                               {addTicketForm[item.requestTransactionId] && (
//                                 <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
//                                   <Controller
//                                     name="ticketDescription"
//                                     control={control}
//                                     render={({ field: { ref, value, onChange } }) => {
//                                       return (
//                                         <TextField
//                                           inputRef={ref}
//                                           size="small"
//                                           value={value}
//                                           label="Ticket Description"
//                                           onChange={onChange}
//                                           autoComplete="off"
//                                           fullWidth
//                                           sx={{ mb: 2 }}
//                                         />
//                                       );
//                                     }}
//                                   />
//                                   {/*
//                                   <Controller
//                                     control={control}
//                                     name=""
//                                     render={({ field: { ref, value, onChange } }) => {
//                                       return (
//                                         <TextField
//                                           inputRef={ref}
//                                           size="medium"
//                                           value={value}
//                                           placeholder="Ex. System Name - Concern"
//                                           onChange={onChange}
//                                           sx={{
//                                             width: "80%",
//                                           }}
//                                           autoComplete="off"
//                                           rows={6}
//                                           multiline
//                                         />
//                                       );
//                                     }}
//                                   /> */}

//                                   <Stack direction="row" gap={1}>
//                                     <Controller
//                                       name="startDate"
//                                       control={control}
//                                       render={({ field }) => (
//                                         <TextField
//                                           {...field}
//                                           type="date"
//                                           size="small"
//                                           label="Start Date"
//                                           fullWidth
//                                           InputLabelProps={{ shrink: true }}
//                                           error={!!errors.startDate}
//                                           helperText={errors.startDate?.message}
//                                           sx={{ mb: 2 }}
//                                         />
//                                       )}
//                                     />

//                                     <Controller
//                                       name="targetDate"
//                                       control={control}
//                                       render={({ field }) => (
//                                         <TextField
//                                           {...field}
//                                           type="date"
//                                           size="small"
//                                           label="Target Date"
//                                           fullWidth
//                                           InputLabelProps={{ shrink: true }}
//                                           error={!!errors.targetDate}
//                                           helperText={errors.targetDate?.message}
//                                           sx={{ mb: 2 }}
//                                         />
//                                       )}
//                                     />
//                                   </Stack>

//                                   <Stack sx={{ alignItems: "end" }}>
//                                     <Button type="submit" variant="contained" color="primary" disabled={!watch("ticketDescription")}>
//                                       Save
//                                     </Button>
//                                   </Stack>
//                                 </Box>
//                               )}
//                             </Box>
//                           </Collapse>
//                         </TableCell>
//                       </TableRow>
//                     </React.Fragment>
//                   ))}
//               </TableBody>
//             </Table>
//           </TableContainer>

//           <TablePagination
//             sx={{ color: "#A0AEC0", fontWeight: 400 }}
//             rowsPerPageOptions={[5, 10, 25]}
//             component="div"
//             count={data?.value?.totalCount || 0}
//             rowsPerPage={data?.value?.pageSize || 5}
//             page={data?.value?.currentPage - 1 || 0}
//             onPageChange={onPageNumberChange}
//             onRowsPerPageChange={onPageSizeChange}
//           />
//         </Stack>

//         <IssueViewDialog data={viewData} viewOpen={viewOpen} viewOnClose={viewOnClose} />
//       </Stack>
//     </Stack>
//   );
// };

// export default IssueHandlerConcerns;
