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
import { AddOutlined, Search } from "@mui/icons-material";

import { useEffect, useState } from "react";
import { theme } from "../../../theme/theme";

import Swal from "sweetalert2";
import { toast } from "sonner";
import useDebounce from "../../../hooks/useDebounce";
import useDisclosure from "../../../hooks/useDisclosure";
import { masterlistStyles as sx } from "../../Masterlist/styles/masterlistStyles";

import noRecordsFound from "../../../assets/svg/noRecordsFound.svg";
import somethingWentWrong from "../../../assets/svg/SomethingWentWrong.svg";

import UserAccountAction from "./UserAccountAction";
import UserAccountPermissions from "./UserAccountPermissions";
import UserAccountDialog from "./UserAccountDialog";
import { useGetUsersQuery, useResetUserPasswordMutation, useArchiveUserMutation, useGetPendingUsersQuery } from "../../../features/user_management_api/user/userApi";
import PendingAccountsTab from "./PendingAccounts/PendingAccountsTab";

const STATUS_TABS = [
  { value: "", label: "ALL" },
  { value: "true", label: "ACTIVE" },
  { value: "false", label: "ARCHIVED" },
  { value: "pending", label: "PENDING" },
];

const TABLE_COLUMNS = ["LINE NO.", "FULLNAME", "USERNAME", "ROLE", "ACCOUNT ACCESS", "STATUS", "ACTIONS"];

const UserAccounts = () => {
  const [status, setStatus] = useState("true");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  const [getTabName, setGetTabName] = useState(null);

  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue, 500);

  const [editData, setEditData] = useState(null);
  const [onPendingTab, setOnPendingTab] = useState(null);

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { open, onToggle, onClose } = useDisclosure();

  const { data, isLoading, isFetching, isSuccess, isError } = useGetUsersQuery({
    Status: status,
    Search: search,
    PageNumber: pageNumber,
    PageSize: pageSize,
  });

  const {
    data: pendingUsersData,
    isLoading: pendingUsersiIsLoading,
    isFetching: pendingUsersIsFetching,
    isSuccess: pendingUsersIsSuccess,
    isError: pendingUsersIsError,
  } = useGetPendingUsersQuery({
    Search: search,
    PageNumber: pageNumber,
    PageSize: pageSize,
  });

  const [resetUser] = useResetUserPasswordMutation();
  const [archiveUser] = useArchiveUserMutation();

  const rows = data?.value?.users ?? [];
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

  const onStatusChange = (_, newValue) => {
    if (newValue === "pending") {
      setGetTabName(newValue);
      setOnPendingTab(newValue);
      setStatus(newValue);
      setPageNumber(1);
      setPageSize(100);
    } else {
      setGetTabName(null);
      setOnPendingTab(null);
      setStatus(newValue);
      setPageNumber(1);
      setPageSize(100);
    }
  };

  const onDialogClose = () => {
    setEditData(null);
    onClose();
  };

  const onArchiveAction = (data) => {
    const userJson = sessionStorage.getItem("user");
    const user = JSON.parse(userJson);
    const userId = user.id;

    if (data.isActive === true) {
      Swal.fire({
        title: "Are you sure?",
        text: "This will move this user to the archived tab.",
        icon: "warning",
        color: "white",
        showCancelButton: true,
        background: "#111927",
        confirmButtonColor: "#9e77ed",
        cancelButtonColor: "#1C2536",
        heightAuto: false,
        width: "30em",
        allowOutsideClick: false,
        customClass: {
          container: "custom-container",
          title: "custom-title",
          htmlContainer: "custom-text",
          icon: "custom-icon",
          confirmButton: "custom-confirm-btn",
          cancelButton: "custom-cancel-btn",
        },
        preConfirm: async () => {
          try {
            Swal.getConfirmButton().innerHTML = `
                    <div class="mui-btn-content">
                      <span class="mui-spinner"></span>
                      <span class="mui-label">Archiving...</span>
                    </div>
                  `;
            Swal.getConfirmButton().disabled = true;

            if (userId === data?.id) {
              toast.error("Archive Error!", {
                description: "The logged-in user cannot be archived.",
                duration: 1500,
              });
            } else {
              await archiveUser(data)
                .unwrap()
                .then(() => {
                  toast.success("Success!", {
                    description: "Archive successfully.",
                    duration: 1500,
                  });
                })
                .catch((error) => {
                  toast.error("Error!", {
                    description: error.data.error.message,
                    duration: 1500,
                  });
                });
            }

            return true; // resolves success
          } catch (err) {
            console.log("Error", err);
            Swal.hideLoading();
            Swal.showValidationMessage(err?.data?.error?.message || "Something went wrong");
            return false; // keeps modal open
          }
        },
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.close();
        }
      });
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "This will move this user to the active tab.",
        icon: "warning",
        color: "white",
        showCancelButton: true,
        background: "#111927",
        confirmButtonColor: "#9e77ed",
        cancelButtonColor: "#1C2536",
        heightAuto: false,
        width: "30em",
        allowOutsideClick: false,
        customClass: {
          container: "custom-container",
          title: "custom-title",
          htmlContainer: "custom-text",
          icon: "custom-icon",
          confirmButton: "custom-confirm-btn",
          cancelButton: "custom-cancel-btn",
        },
        preConfirm: async () => {
          try {
            Swal.getConfirmButton().innerHTML = `
                    <div class="mui-btn-content">
                      <span class="mui-spinner"></span>
                      <span class="mui-label">Restoring...</span>
                    </div>
                  `;
            Swal.getConfirmButton().disabled = true;

            if (userId === data?.id) {
              toast.error("Archive Error!", {
                description: "The logged-in user cannot be archived.",
                duration: 1500,
              });
            } else {
              await archiveUser(data)
                .unwrap()
                .then(() => {
                  toast.success("Success!", {
                    description: "Restore successfully.",
                    duration: 1500,
                  });
                })
                .catch((error) => {
                  toast.error("Error!", {
                    description: error.data.error.message,
                    duration: 1500,
                  });
                });
            }

            return true; // resolves success
          } catch (err) {
            console.log("Error", err);
            Swal.hideLoading();
            Swal.showValidationMessage(err?.data?.error?.message || "Something went wrong");
            return false; // keeps modal open
          }
        },
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.close();
        }
      });
    }
  };

  const onResetPasswordAction = (data) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will reset the password of this user.",
      icon: "warning",
      color: "white",
      showCancelButton: true,
      background: "#111927",
      confirmButtonColor: "#9e77ed",
      cancelButtonColor: "#1C2536",
      heightAuto: false,
      width: "30em",
      allowOutsideClick: false,
      customClass: {
        container: "custom-container",
        title: "custom-title",
        htmlContainer: "custom-text",
        icon: "custom-icon",
        confirmButton: "custom-confirm-btn",
        cancelButton: "custom-cancel-btn",
      },
      preConfirm: async () => {
        try {
          Swal.getConfirmButton().innerHTML = `
              <div class="mui-btn-content">
                <span class="mui-spinner"></span>
                <span class="mui-label">Resetting...</span>
              </div>
            `;
          Swal.getConfirmButton().disabled = true;
          resetUser(data)
            .unwrap()
            .then(() => {
              toast.success("Success!", {
                description: "Reset password successfully.",
                duration: 1500,
              });
            })
            .catch((error) => {
              toast.error("Error!", {
                description: error.data.error.message,
                duration: 1500,
              });
            });

          return true; // resolves success
        } catch (err) {
          console.log("Error", err);
          Swal.hideLoading();
          Swal.showValidationMessage(err?.data?.error?.message || "Something went wrong");
          return false; // keeps modal open
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.close(); // close once API success
      }
    });
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
    <Stack sx={sx.pageContainer}>
      {/* Header */}
      <Stack sx={sx.pageHeader}>
        <Stack>
          <Stack sx={sx.titleGroup}>
            <Typography variant={isSmallScreen ? "h5" : "h4"} sx={sx.pageTitle}>
              User Accounts
            </Typography>
            <Chip label={getTabName !== "pending" ? `${data?.value?.totalCount ?? 0} total` : `${pendingUsersData?.value?.totalCount ?? 0} total`} size="small" sx={sx.countChip} />
          </Stack>
          <Typography sx={sx.pageSubtitle}>Manage user profiles and their assigned charging details</Typography>
        </Stack>

        <Button variant="contained" size="large" startIcon={<AddOutlined />} onClick={onToggle} sx={sx.addButton}>
          Add
        </Button>
      </Stack>

      {/* Content Container */}
      <Stack sx={sx.contentContainer}>
        <Tabs value={status} onChange={onStatusChange} variant="scrollable" scrollButtons="auto" sx={sx.tabs}>
          {STATUS_TABS.map((tab) => (
            <Tab key={tab.label} value={tab.value} label={tab.label} sx={sx.tab} />
          ))}
        </Tabs>

        <Divider variant="fullWidth" sx={sx.divider} />

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={sx.searchContainer} gap={4}>
          <OutlinedInput placeholder="Search user" startAdornment={<Search sx={sx.searchIcon} />} value={searchValue} onChange={(e) => setSearchValue(e.target.value)} sx={sx.searchInput} />
        </Stack>

        {onPendingTab ? (
          <PendingAccountsTab
            data={pendingUsersData}
            isLoading={pendingUsersiIsLoading}
            isFetching={pendingUsersIsFetching}
            isSuccess={pendingUsersIsSuccess}
            isError={pendingUsersIsError}
            onPageNumberChange={onPageNumberChange}
            onPageSizeChange={onPageSizeChange}
            isSmallScreen={isSmallScreen}
            search={search}
          />
        ) : (
          <>
            {isSmallScreen ? (
              // Card-Based Layout for Small Screens
              <Stack spacing={2}>
                {hasRows &&
                  rows?.map((item, index) => (
                    <Card key={item.id} sx={sx.card}>
                      <CardContent>
                        <Stack spacing={1}>
                          <Stack direction="row" gap={0.5} alignItems="center">
                            <Typography variant="body2" color="text.secondary">
                              LINE NO. {index + 1}
                            </Typography>

                            <Chip label={item.is_Active ? "ACTIVE" : "INACTIVE"} size="small" sx={{ ...sx.statusChip(item.is_Active), ...sx.cardChip }} />
                          </Stack>

                          <Typography variant="h6" sx={{ color: "#EDF2F7" }}>
                            {item.fullname}
                          </Typography>

                          <Typography variant="body2" color="text.secondary">
                            EMPLOYEE ID: {item.empId}
                          </Typography>

                          <Typography variant="body2" color="text.secondary">
                            USERNAME: {item.username}
                          </Typography>

                          <Typography variant="body2" sx={{ color: "#22B4BF" }}>
                            ROLE: {item.user_Role_Name}
                          </Typography>

                          <Stack direction="row" gap={0.5} alignItems="center">
                            <Typography variant="body2" color="text.secondary">
                              ACCESS:
                            </Typography>

                            <UserAccountPermissions permissions={item.permission} />
                          </Stack>

                          <Stack direction="row" gap={0.5} alignItems="center">
                            <Typography variant="body2" color="text.secondary">
                              ACTION:
                            </Typography>

                            <UserAccountAction data={item} onReset={onResetPasswordAction} onArchive={onArchiveAction} onUpdate={onEditAction} />
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
                  sx={{
                    color: "#A0AEC0",
                    fontWeight: 400,
                    background: "#1C2536",
                    borderRadius: "0px 0px 20px 20px",
                  }}
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
                          {TABLE_COLUMNS.map((column) => (
                            <TableCell key={column} sx={sx.headCell} align={column === "FULLNAME" || column === "USERNAME" || column === "ROLE" ? "left" : "center"}>
                              {column}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {hasRows &&
                          rows?.map((item, index) => (
                            <TableRow key={item.id}>
                              <TableCell sx={sx.bodyCell} align="center">
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
                                  {item.fullname}
                                </Typography>
                                <Typography
                                  sx={{
                                    color: theme.palette.text.secondary,
                                    fontSize: "12px",
                                    fontWeight: 500,
                                  }}
                                >
                                  {item.empId}
                                </Typography>
                              </TableCell>
                              <TableCell sx={sx.bodyCell}>{item.username}</TableCell>
                              <TableCell sx={sx.bodyCell}>{item.user_Role_Name}</TableCell>
                              <TableCell sx={sx.bodyCell} align="center">
                                <UserAccountPermissions permissions={item.permission} />
                              </TableCell>
                              <TableCell sx={sx.bodyCell} align="center">
                                <Chip variant="filled" size="small" sx={sx.statusChip(item.is_Active)} label={item.is_Active ? "ACTIVE" : "INACTIVE"} />
                              </TableCell>
                              <TableCell sx={sx.bodyCell} align="center">
                                <UserAccountAction data={item} onReset={onResetPasswordAction} onArchive={onArchiveAction} onUpdate={onEditAction} />
                              </TableCell>
                            </TableRow>
                          ))}

                        {isError && (
                          <TableRow>
                            <TableCell colSpan={TABLE_COLUMNS.length} align="center">
                              <img src={somethingWentWrong} alt="Something Went Wrong" className="something-went-wrong-table" />
                              <Typography variant="h5" sx={sx.feedbackText} marginLeft={2}>
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

                        {isEmpty && (
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
                </Paper>

                <TablePagination
                  sx={{
                    color: "#A0AEC0",
                    fontWeight: 400,
                    background: "#1C2536",
                    borderRadius: "0px 0px 20px 20px",
                  }}
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
          </>
        )}

        <UserAccountDialog open={open} onClose={onDialogClose} data={editData} />
      </Stack>
    </Stack>
  );
};

export default UserAccounts;
