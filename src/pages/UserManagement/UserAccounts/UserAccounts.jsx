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
import React, { useEffect, useState } from "react";
import { theme } from "../../../theme/theme";

import noRecordsFound from "../../../assets/svg/noRecordsFound.svg";
import somethingWentWrong from "../../../assets/svg/SomethingWentWrong.svg";

import useDebounce from "../../../hooks/useDebounce";
import useDisclosure from "../../../hooks/useDisclosure";

import Swal from "sweetalert2";
import { Toaster, toast } from "sonner";
import { AddOutlined, Search } from "@mui/icons-material";

import UserAccountAction from "./UserAccountAction";
import UserAccountPermissions from "./UserAccountPermissions";
import UserAccountDialog from "./UserAccountDialog";

import { useGetUsersQuery, useResetUserPasswordMutation, useArchiveUserMutation } from "../../../features/user_management_api/user/userApi";

const UserAccounts = () => {
  const [status, setStatus] = useState("true");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue, 500);

  const [editData, setEditData] = useState(null);

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { open, onToggle, onClose } = useDisclosure();

  const { data, isLoading, isFetching, isSuccess, isError, refetch } = useGetUsersQuery({
    Status: status,
    Search: search,
    PageNumber: pageNumber,
    PageSize: pageSize,
  });

  const [resetUser] = useResetUserPasswordMutation();
  const [archiveUser] = useArchiveUserMutation();

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
    refetch();
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
        customClass: {
          container: "custom-container",
          title: "custom-title",
          htmlContainer: "custom-text",
          icon: "custom-icon",
          confirmButton: "custom-confirm-btn",
          cancelButton: "custom-cancel-btn",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          console.log("Data: ", data?.id);

          if (userId === data?.id) {
            toast.error("Archive Error!", {
              description: "The logged-in user cannot be archived.",
              duration: 1500,
            });
          } else {
            archiveUser(data)
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
        customClass: {
          container: "custom-container",
          title: "custom-title",
          htmlContainer: "custom-text",
          icon: "custom-icon",
          confirmButton: "custom-confirm-btn",
          cancelButton: "custom-cancel-btn",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          archiveUser(data)
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
      });
    }
  };

  const onResetPasswordAction = (data) => {
    console.log("data: ", data);

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
      customClass: {
        container: "custom-container",
        title: "custom-title",
        htmlContainer: "custom-text",
        icon: "custom-icon",
        confirmButton: "custom-confirm-btn",
        cancelButton: "custom-cancel-btn",
      },
    }).then((result) => {
      if (result.isConfirmed) {
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
    <Stack
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: theme.palette.bgForm.black1,
        color: "#fff",
        padding: isSmallScreen ? "20px" : "44px 94px 94px 94px",
      }}
    >
      <Toaster richColors position="top-right" closeButton />

      <Stack>
        <Stack>
          <Stack width="100%" justifyContent="space-between" sx={{ flexDirection: isSmallScreen ? "column" : "row" }}>
            <Stack justifyItems="left">
              <Typography variant={isSmallScreen ? "h5" : "h4"}>User Accounts</Typography>
            </Stack>

            <Stack justifyItems="space-between" direction="row" marginTop={1}>
              <Button variant="contained" size={isSmallScreen ? "medium" : "large"} color="primary" startIcon={<AddOutlined />} onClick={onToggle}>
                Add
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      <Stack
        sx={{
          backgroundColor: theme.palette.bgForm.black3,
          borderRadius: "20px",
          marginTop: "20px",
        }}
      >
        <Stack direction="row" justifyContent="space-between">
          <Tabs value={status} onChange={onStatusChange} variant={isSmallScreen ? "scrollable" : "fullWidth"} scrollButtons="auto">
            <Tab
              value=""
              label="All"
              sx={{
                fontSize: "12px",
                fontWeight: 600,
              }}
            />

            <Tab
              value="true"
              label="Active"
              sx={{
                fontSize: "12px",
                fontWeight: 600,
              }}
            />

            <Tab
              value="false"
              label="Archived"
              sx={{
                fontSize: "12px",
                fontWeight: 600,
              }}
            />
          </Tabs>
        </Stack>

        <Divider variant="fullWidth" sx={{ background: "#2D3748", marginTop: "1px" }} />

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ marginTop: "5px", padding: "10px" }}>
          <OutlinedInput
            placeholder="Search user"
            startAdornment={<Search sx={{ marginRight: 0.5, color: "#A0AEC0" }} />}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            sx={{
              flex: 1,
              borderRadius: "15px",
              fontSize: "small",
              fontWeight: 400,
              lineHeight: "1.4375rem",
              // backgroundColor: "#111927",
            }}
          />
        </Stack>

        {isSmallScreen ? (
          // Card-Based Layout for Small Screens
          <Stack spacing={2}>
            {isSuccess &&
              !isLoading &&
              !isFetching &&
              data?.value?.users?.map((item, index) => (
                <Card key={item.id} sx={{ backgroundColor: theme.palette.bgForm.black3, borderRadius: "15px", borderColor: "#2D3748" }}>
                  <CardContent>
                    <Stack spacing={1}>
                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography variant="body2" color="text.secondary">
                          LINE NO. {index + 1}
                        </Typography>

                        <Chip
                          label={item.is_Active ? "ACTIVE" : "INACTIVE"}
                          size="small"
                          sx={{
                            fontSize: "10px",
                            backgroundColor: item.is_Active ? "#112C32" : "#2D2823",
                            borderRadius: "none",
                            color: item.is_Active ? "#10B981" : "#D27D0E",
                          }}
                        />
                      </Stack>

                      <Typography variant="h6" sx={{ color: "#EDF2F7" }}>
                        {item.fullname}
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

            {isSuccess && !data?.value?.users.length && (
              <Stack justifyContent="center" alignItems="center" padding={4}>
                <img src={noRecordsFound} alt="No Records Found" className="norecords-found-table" />
                <Typography variant="h6" align="center">
                  No records found.
                </Typography>
              </Stack>
            )}

            <TablePagination
              sx={{ color: "#A0AEC0", fontWeight: 400, background: "#1C2536", borderRadius: "0px 0px 20px 20px" }}
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
          // Table Layout for Larger Screens
          <>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <TableContainer sx={{ minHeight: "423px", maxHeight: "423px" }}>
                <Table stickyHeader sx={{ borderBottom: "none" }}>
                  <TableHead>
                    <TableRow>
                      {["LINE NO.", "FULLNAME", "USERNAME", "ROLE", "ACCOUNT ACCESS", "STATUS", "ACTIONS"].map((header, idx) => (
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
                      data?.value?.users?.map((item, index) => (
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
                              color: "#22B4BF",
                              fontSize: "14px",
                              fontWeight: 500,
                            }}
                          >
                            {item.user_Role_Name}
                          </TableCell>

                          <TableCell
                            sx={{
                              color: "#EDF2F7",
                              fontSize: "14px",
                              fontWeight: 500,
                            }}
                            align="center"
                          >
                            <UserAccountPermissions permissions={item.permission} />
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
                              sx={{
                                fontSize: "13px",
                                backgroundColor: item.is_Active ? "#112C32" : "#2D2823",
                                color: item.is_Active ? "#10B981" : "#D27D0E",
                                fontWeight: 800,
                              }}
                              label={item.is_Active ? "ACTIVE" : "INACTIVE"}
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
                            <UserAccountAction data={item} onReset={onResetPasswordAction} onArchive={onArchiveAction} onUpdate={onEditAction} />
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

                    {isSuccess && !data?.value?.users.length && (
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
            </Paper>

            <TablePagination
              sx={{ color: "#A0AEC0", fontWeight: 400, background: "#1C2536", borderRadius: "0px 0px 20px 20px" }}
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

        <UserAccountDialog open={open} onClose={onDialogClose} data={editData} />
      </Stack>
    </Stack>
  );
};

export default UserAccounts;
