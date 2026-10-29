import {
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  OutlinedInput,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { AddOutlined, Search } from "@mui/icons-material";
import { useEffect, useState } from "react";

import { theme } from "../../../theme/theme";
import { masterlistStyles as sx } from "../../Masterlist/styles/masterlistStyles";
import useDebounce from "../../../hooks/useDebounce";
import useDisclosure from "../../../hooks/useDisclosure";

import noRecordsFound from "../../../assets/svg/noRecordsFound.svg";
import somethingWentWrong from "../../../assets/svg/SomethingWentWrong.svg";

import ApproverSetupDialog from "./ApproverSetupDialog";
import { NewApproverHandlers } from "./NewApproverHandlers";
import { useGetApproverSetupQuery } from "../../../features/api masterlist/new_approver_api/approverSetupApi";
import { ApproverSetupActions } from "./ApproverSetupActions";

const TABLE_COLUMNS = ["APPROVERS", "ISSUE HANDLERS", "ACTIONS"];

const NewApprover = () => {
  //   const [status, setStatus] = useState("true")
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue, 500);

  const [editData, setEditData] = useState(null);

  const { open, onToggle, onClose } = useDisclosure();

  const { data, isLoading, isFetching, isSuccess, isError, refetch } = useGetApproverSetupQuery({
    // Status: status,
    Search: search,
    PageNumber: pageNumber,
    PageSize: pageSize,
  });

  //   const [archiveApprover] = useArchiveApproverMutation();

  const rows = data?.value?.approver ?? [];
  const isBusy = isLoading || isFetching;
  const hasRows = isSuccess && !isBusy && rows.length > 0;
  const isEmpty = isSuccess && !isBusy && rows.length === 0;

  const onPageNumberChange = (_, page) => {
    setPageNumber(page + 1);
  };

  const onPageSizeChange = (e) => {
    setPageSize(e.target.value);
    setPageNumber(1);
  };

  //   const onStatusChange = (_, newValue) => {
  //     setStatus(newValue);
  //     setPageNumber(1);
  //     setPageSize(5);
  //     refetch();
  //   };

  const onDialogClose = () => {
    setEditData(null);
    onClose();
  };

  //   const onArchiveAction = (data) => {
  //     if (data.isActive === true) {
  //       Swal.fire({
  //         title: "Archive this information?",
  //         text: "This will move to the archived tab.",
  //         icon: "warning",
  //         color: "white",
  //         showCancelButton: true,
  //         background: "#111927",
  //         confirmButtonColor: "#9e77ed",
  //         cancelButtonColor: "#1C2536",
  //         confirmButtonText: "Yes",
  //         heightAuto: false,
  //         width: "30em",
  //         customClass: {
  //           container: "custom-container",
  //           title: "custom-title",
  //           htmlContainer: "custom-text",
  //           icon: "custom-icon",
  //           confirmButton: "custom-confirm-btn",
  //           cancelButton: "custom-cancel-btn",
  //         },
  //       }).then((result) => {
  //         if (result.isConfirmed) {
  //           const archivePayload = {
  //             updateApproverStatusIds: [
  //               {
  //                 subUnitId: data.subUnitId,
  //               },
  //             ],
  //           };

  //           archiveApprover(archivePayload)
  //             .unwrap()
  //             .then(() => {
  //               console.log("Data: ", data);
  //               toast.success("Success!", {
  //                 description: "Data archived successfully!",
  //               });
  //             })
  //             .catch((error) => {
  //               toast.error("Error!", {
  //                 description: error.data.error.message,
  //               });
  //             });
  //         }
  //       });
  //     } else {
  //       Swal.fire({
  //         title: "Restore this information?",
  //         text: "This will move to the active tab.",
  //         icon: "warning",
  //         color: "white",
  //         showCancelButton: true,
  //         background: "#111927",
  //         confirmButtonColor: "#9e77ed",
  //         cancelButtonColor: "#1C2536",
  //         confirmButtonText: "Yes",
  //         heightAuto: false,
  //         width: "30em",
  //         customClass: {
  //           container: "custom-container",
  //           title: "custom-title",
  //           htmlContainer: "custom-text",
  //           icon: "custom-icon",
  //           confirmButton: "custom-confirm-btn",
  //           cancelButton: "custom-cancel-btn",
  //         },
  //       }).then((result) => {
  //         if (result.isConfirmed) {
  //           const restorePayload = {
  //             updateApproverStatusIds: [
  //               {
  //                 subUnitId: data.subUnitId,
  //               },
  //             ],
  //           };

  //           archiveApprover(restorePayload)
  //             .unwrap()
  //             .then(() => {
  //               toast.success("Success!", {
  //                 description: "Data restored successfully!",
  //               });
  //             })
  //             .catch((error) => {
  //               toast.error("Error!", {
  //                 description: error.data.error.message,
  //               });
  //             });
  //         }
  //       });
  //     }
  //   };

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
    <Stack sx={sx.pageContainer}>
      {/* Header */}
      <Stack sx={sx.pageHeader}>
        <Stack>
          <Stack sx={sx.titleGroup}>
            <Typography variant={isSmallScreen ? "h5" : "h4"} sx={sx.pageTitle}>
              Approver
            </Typography>
            <Chip label={`${data?.value?.totalCount ?? 0} total`} size="small" sx={sx.countChip} />
          </Stack>
          <Typography sx={sx.pageSubtitle}>Manage approvers and assign their designated issue handlers</Typography>
        </Stack>

        <Button variant="contained" size="large" startIcon={<AddOutlined />} onClick={onToggle} sx={sx.addButton}>
          Add
        </Button>
      </Stack>

      {/* Content Container */}
      <Stack sx={sx.contentContainer}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={sx.searchContainer} gap={4}>
          <OutlinedInput placeholder="Search approver" startAdornment={<Search sx={sx.searchIcon} />} value={searchValue} onChange={(e) => setSearchValue(e.target.value)} sx={sx.searchInput} />
        </Stack>

        {isSmallScreen ? (
          // Card-Based Layout for Small Screens
          <Stack spacing={2}>
            {hasRows &&
              rows?.map((item) => (
                <Card key={item.id} sx={sx.card}>
                  <CardContent>
                    <Stack spacing={1}>
                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography sx={sx.cardLabel}>APPROVER:</Typography>
                        <Typography sx={sx.cardValue}>{item.approverName}</Typography>
                      </Stack>

                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography sx={sx.cardLabel}>ISSUE HANDLERS:</Typography>
                        <NewApproverHandlers issueHandlers={item.userForApprovers} />
                      </Stack>

                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography sx={sx.cardLabel}>ACTION:</Typography>
                        <ApproverSetupActions data={item} onUpdate={onEditAction} />
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              ))}

            {isError && (
              <Stack sx={sx.feedbackContainer}>
                <img src={somethingWentWrong} alt="Something Went Wrong" className="something-went-wrong-table" />
                <Typography variant="h6" color="error" align="center">
                  Something went wrong.
                </Typography>
              </Stack>
            )}

            {isBusy && (
              <Stack sx={sx.feedbackContainer}>
                <CircularProgress />
                <Typography variant="h5" sx={sx.feedbackText}>
                  Please wait...
                </Typography>
              </Stack>
            )}

            {isEmpty && (
              <Stack sx={sx.feedbackContainer}>
                <img src={noRecordsFound} alt="No Records Found" className="norecords-found-table" />
                <Typography variant="h6" align="center">
                  No records found.
                </Typography>
              </Stack>
            )}

            <TablePagination
              sx={sx.paginationMobile}
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
            <TableContainer>
              <Table sx={sx.table}>
                <TableHead sx={{ whiteSpace: "nowrap" }}>
                  <TableRow>
                    {TABLE_COLUMNS.map((column) => (
                      <TableCell key={column} sx={sx.headCell} align={column === "APPROVERS" ? "left" : "center"}>
                        {column}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {hasRows &&
                    rows?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell sx={sx.bodyCell}>{item.approverName}</TableCell>
                        <TableCell sx={sx.bodyCell} align="center">
                          <NewApproverHandlers issueHandlers={item.userForApprovers} />
                        </TableCell>
                        <TableCell sx={sx.bodyCell} align="center">
                          <ApproverSetupActions data={item} onUpdate={onEditAction} />
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

                  {isBusy && (
                    <TableRow>
                      <TableCell colSpan={TABLE_COLUMNS.length} align="center">
                        <CircularProgress />
                        <Typography variant="h5" sx={sx.feedbackText}>
                          Please wait...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}

                  {isSuccess && !data?.value?.approver.length && !isLoading && !isFetching && (
                    <TableRow>
                      <TableCell colSpan={TABLE_COLUMNS.length} align="center">
                        <img src={noRecordsFound} alt="No Records Found" className="norecords-found-table" style={{ width: "100%", maxWidth: "300px" }} />
                        <Typography variant="h5" sx={sx.feedbackText} marginLeft={2}>
                          No records found.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              sx={sx.pagination}
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

        <ApproverSetupDialog data={editData} open={open} onClose={onDialogClose} />
      </Stack>
    </Stack>
  );
};

export default NewApprover;
