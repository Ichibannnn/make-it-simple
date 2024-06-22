import { Chip, CircularProgress, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tabs, Typography } from "@mui/material";
import { AccessTimeOutlined, CalendarMonthOutlined } from "@mui/icons-material";
import React, { useState } from "react";

import moment from "moment";
import { theme } from "../../../../theme/theme";
import useDisclosure from "../../../../hooks/useDisclosure";

import noRecordsFound from "../../../../assets/svg/noRecordsFound.svg";
import somethingWentWrong from "../../../../assets/svg/SomethingWentWrong.svg";
import TicketApprovalDialog from "./TicketApprovalDialog";

const TicketApproval = ({ data, isLoading, isFetching, isSuccess, isError, setPageNumber, setPageSize }) => {
  const [viewApprovalData, setViewApprovalData] = useState(null);

  const { open, onToggle, onClose } = useDisclosure();

  const onPageNumberChange = (_, page) => {
    setPageNumber(page + 1);
  };

  const onPageSizeChange = (e) => {
    setPageSize(e.target.value);
    setPageNumber(1);
  };

  const onDialogClose = () => {
    setViewApprovalData(null);
    onClose();
  };

  const onViewAction = (data) => {
    onToggle();
    setViewApprovalData(data);
  };

  return (
    <Stack sx={{ width: "100%" }}>
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
              data?.value?.closingTicket?.map((item) => (
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

                  <TableCell
                    // className="ellipsis-styling"
                    sx={{
                      color: "#EDF2F7",
                      fontSize: "12px",
                      fontWeight: 500,
                      maxWidth: "700px",
                    }}
                  >
                    {item.concern_Details}
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

            {isSuccess && !data?.value?.closingTicket?.length && (
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

      <TicketApprovalDialog data={viewApprovalData} open={open} onClose={onDialogClose} />
    </Stack>
  );
};

export default TicketApproval;
