import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
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
  Typography,
  useMediaQuery,
} from "@mui/material";
import { theme } from "../../../../theme/theme";
import noRecordsFound from "../../../../assets/svg/noRecordsFound.svg";
import somethingWentWrong from "../../../../assets/svg/SomethingWentWrong.svg";
import useDisclosure from "../../../../hooks/useDisclosure";
import PendingAccountAction from "./PendingAccountAction";
import PendingAccountDialog from "./PendingAccountDialog";

const PendingAccountsTab = ({ data, isLoading, isFetching, isSuccess, isError, setPageNumber, setPageSize, isSmallScreen, onPageNumberChange, onPageSizeChange, somethingWentWrong }) => {
  const [editData, setEditData] = useState(null);
  const { open, onToggle, onClose } = useDisclosure();

  const onEditAction = (data) => {
    onToggle();
    setEditData(data);
  };

  const onDialogClose = () => {
    setEditData(null);
    onClose();
  };

  return (
    <>
      {isSmallScreen ? (
        // Card-Based Layout for Small Screens
        <Stack spacing={2}>
          {isSuccess &&
            !isLoading &&
            !isFetching &&
            data?.value?.onecharging?.map((item, index) => (
              <Card key={item.id} sx={{ backgroundColor: theme.palette.bgForm.black3, borderRadius: "15px", borderColor: "#2D3748" }}>
                <CardContent>
                  <Stack spacing={1}>
                    <Stack direction="row" gap={0.5} alignItems="center">
                      <Typography variant="body2" color="text.secondary">
                        LINE NO. {index + 1}
                      </Typography>
                    </Stack>

                    <Typography variant="h6" sx={{ color: "#EDF2F7" }}>
                      {`${item.last_Name}, ${item.first_Name} ${item.middle_Name} ${item?.suffix ? item.suffix : ""}`}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      EMPLOYEE ID: {`${item.id_Prefix}-${item.id_No}`}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      USERNAME: {item.username}
                    </Typography>

                    <Stack direction="row" gap={0.5} alignItems="center">
                      <Typography variant="body2" color="text.secondary">
                        ACTION:
                      </Typography>

                      <PendingAccountAction data={item} onUpdate={onEditAction} />
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

          {isSuccess && !data?.value?.onecharging.length && !isLoading && !isFetching && (
            <Stack justifyContent="center" alignItems="center" padding={4}>
              <img src={noRecordsFound} alt="No Records Found" className="norecords-found-table" />
              <Typography variant="h6" align="center">
                No records found.
              </Typography>
            </Stack>
          )}

          <TablePagination
            sx={{ color: "#A0AEC0", fontWeight: 400, background: "#1C2536", borderRadius: "0px 0px 20px 20px" }}
            rowsPerPageOptions={[100, 300, 500, { value: data?.value?.totalCount, label: "All" }]}
            component="div"
            count={data?.value?.totalCount || 0}
            rowsPerPage={data?.value?.pageSize || 100}
            page={data?.value?.currentPage - 1 || 0}
            onPageChange={onPageNumberChange}
            onRowsPerPageChange={onPageSizeChange}
          />
        </Stack>
      ) : (
        // Table Layout for Larger Screens
        <>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer>
              <Table stickyHeader sx={{ borderBottom: "none" }}>
                <TableHead>
                  <TableRow>
                    {["LINE NO.", "FULLNAME", "USERNAME", "ACTIONS"].map((header, idx) => (
                      <TableCell
                        key={idx}
                        sx={{
                          background: "#1C2536",
                          color: "#D65DB1",
                          fontWeight: 700,
                          fontSize: "12px",
                        }}
                        align={["LINE NO.", "ACCOUNT ACCESS", "STATUS", "ACTIONS"].includes(header) ? "center" : "left"}
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {isSuccess &&
                    !isLoading &&
                    !isFetching &&
                    data?.value?.onecharging?.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "14px",
                            fontWeight: 500,
                          }}
                          align="center"
                        >
                          {index + 1}
                        </TableCell>

                        <TableCell>
                          <Typography
                            sx={{
                              color: "#EDF2F7",
                              fontSize: "14px",
                              fontWeight: 500,
                            }}
                          >
                            {`${item.last_Name}, ${item.first_Name} ${item.middle_Name} ${item?.suffix ? item.suffix : ""}`}
                          </Typography>
                          <Typography
                            sx={{
                              color: theme.palette.text.secondary,
                              fontSize: "12px",
                              fontWeight: 500,
                            }}
                          >
                            {`${item.id_Prefix}-${item.id_No}`}
                          </Typography>
                        </TableCell>

                        <TableCell
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "14px",
                            fontWeight: 500,
                          }}
                        >
                          {item.username}
                        </TableCell>

                        <TableCell
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "14px",
                            fontWeight: 500,
                          }}
                          align="center"
                        >
                          <PendingAccountAction data={item} onUpdate={onEditAction} />
                        </TableCell>
                      </TableRow>
                    ))}

                  {isError && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <img src={somethingWentWrong} alt="Something Went Wrong" className="something-went-wrong-table" />
                        <Typography variant="h5" color="#EDF2F7" marginLeft={2}>
                          Something went wrong.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}

                  {(isLoading || isFetching) && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <CircularProgress />
                        <Typography variant="h5" color="#EDF2F7">
                          Please wait...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}

                  {isSuccess && !data?.value?.onecharging.length && !isLoading && !isFetching && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
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
          </Paper>

          <TablePagination
            sx={{ color: "#A0AEC0", fontWeight: 400, background: "#1C2536", borderRadius: "0px 0px 20px 20px" }}
            rowsPerPageOptions={[100, 300, 500, { value: data?.value?.totalCount, label: "All" }]}
            component="div"
            count={data?.value?.totalCount || 0}
            rowsPerPage={data?.value?.pageSize || 100}
            page={data?.value?.currentPage - 1 || 0}
            onPageChange={onPageNumberChange}
            onRowsPerPageChange={onPageSizeChange}
          />
        </>
      )}

      <PendingAccountDialog open={open} onClose={onDialogClose} data={editData} />
    </>
  );
};

export default PendingAccountsTab;
