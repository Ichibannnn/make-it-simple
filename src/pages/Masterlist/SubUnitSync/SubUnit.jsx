import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
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
  useMediaQuery,
} from "@mui/material";
import { Search, SyncOutlined, AddOutlined, Sync, Add } from "@mui/icons-material";

import Swal from "sweetalert2";
import { LoadingButton } from "@mui/lab";
import { theme } from "../../../theme/theme";
import { Toaster, toast } from "sonner";

import noRecordsFound from "../../../assets/svg/noRecordsFound.svg";
import somethingWentWrong from "../../../assets/svg/SomethingWentWrong.svg";

import useDebounce from "../../../hooks/useDebounce";
import useDisclosure from "../../../hooks/useDisclosure";

import { SubUnitErrorDialog } from "./SubUnitErrorDialog";
import SubUnitAddDialog from "./SubUnitAddDialog";
import SubActions from "./SubActions";

import { useArchiveSubUnitMutation, useGetSubUnitQuery, useSyncSubUnitMutation } from "../../../features/api masterlist/sub-unit/subUnitApi";
import { useLazyGetSubUnitsQuery } from "../../../features/ymir/ymirApi";

const SubUnit = () => {
  const [status, setStatus] = useState("true");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue, 500);

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [editData, setEditData] = useState(null);

  const { open, onToggle, onClose } = useDisclosure();

  const { open: addSubUnitOpen, onToggle: addSubUnitOnToggle, onClose: addSubUnitOnClose } = useDisclosure();

  const { data, isLoading, isFetching, isSuccess, isError, refetch } = useGetSubUnitQuery({
    Status: status,
    Search: search,
    PageNumber: pageNumber,
    PageSize: pageSize,
  });

  const [getSubUnits, { isLoading: isSubUnitLoading, isFetching: isSubUnitFetching }] = useLazyGetSubUnitsQuery();

  const [syncSubUnits, { error: errorData, isLoading: isSubUnitSyncLoading, isFetching: isSubUnitSyncFetching }] = useSyncSubUnitMutation();

  const [archiveSubUnit] = useArchiveSubUnitMutation();

  const onPageNumberChange = (_, page) => {
    setPageNumber(page + 1);
  };

  const onPageSizeChange = (e) => {
    setPageSize(e.target.value);
  };

  const onStatusChange = (_, newValue) => {
    setStatus(newValue);
    setPageNumber(1);
    setPageSize(5);
    refetch();
  };

  const onArchiveAction = (data) => {
    if (data.isActive === true) {
      Swal.fire({
        title: "Are you sure?",
        text: "This will move the sub unit to the archived tab.",
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
          archiveSubUnit(data.id)
            .unwrap()
            .then(() => {
              toast.success("Success!", {
                description: "Archive successfully.",
                duration: 1500,
              });
            })
            .catch((error) => {
              toast.error("Error!", {
                description: "Unable to archive this sub unit.",
                duration: 1500,
              });
            });
        }
      });
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "This will move the sub unit to the active tab.",
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
          archiveSubUnit(data.id)
            .unwrap()
            .then(() => {
              toast.success("Success!", {
                description: "Restore successfully.",
                duration: 1500,
              });
            })
            .catch((error) => {
              toast.error("Error!", {
                description: "Unable to archive this sub unit.",
                duration: 1500,
              });
            });
        }
      });
    }
  };

  const onSyncSubUnits = () => {
    Swal.fire({
      title: "Confirmation?",
      text: "Are you sure you want to sync the sub unit list?",
      icon: "info",
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
        getSubUnits()
          .unwrap()
          .then((response) => {
            console.log("Response: ", response);

            const payload = response.map((item) => ({
              subUnit_No: item.id,
              subUnit_Code: item.code,
              subUnit_Name: item.name,
              unit_Name: item.department_unit.name,
            }));

            syncSubUnits({
              syncSubUnitsResults: payload,
            })
              .unwrap()
              .then(() => {
                toast.success("Success!", {
                  description: "Sync data successfully!",
                });
              })
              .catch((error) => {
                if (error.status === 400) {
                  onToggle();
                }
              });
          })
          .catch(() => {
            toast.error("Error!", {
              description: "Sub unit sync failed",
            });
          });
      }
    });
  };

  const onAddSubUnitAction = () => {
    addSubUnitOnToggle();
  };

  const onEditAction = (data) => {
    addSubUnitOnToggle();
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
              <Typography variant={isSmallScreen ? "h5" : "h4"}>Sub Unit</Typography>
            </Stack>

            <Stack justifyItems="space-between" direction="row" marginTop={1} gap={1}>
              <LoadingButton
                variant="contained"
                size="small"
                color="primary"
                startIcon={<SyncOutlined />}
                loadingPosition="start"
                onClick={() => onSyncSubUnits()}
                loading={isSubUnitLoading || isSubUnitFetching || isSubUnitSyncLoading || isSubUnitSyncFetching}
                sx={{
                  ":disabled": {
                    backgroundColor: theme.palette.primary.main,
                    color: "black",
                  },
                }}
              >
                Sync Sub Unit
              </LoadingButton>

              <LoadingButton
                variant="outlined"
                size="small"
                color="primary"
                startIcon={<AddOutlined />}
                loadingPosition="start"
                onClick={() => onAddSubUnitAction()}
                sx={{
                  ":disabled": {
                    backgroundColor: theme.palette.secondary.main,
                    color: "black",
                  },
                }}
              >
                Add Sub Unit
              </LoadingButton>
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
          <Tabs value={status} onChange={onStatusChange} variant="scrollable" scrollButtons="auto">
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

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ marginTop: "10px", padding: "20px" }} gap={2}>
          <OutlinedInput
            flex="1"
            placeholder="Search sub unit"
            startAdornment={<Search sx={{ marginRight: 0.5, color: "#A0AEC0" }} />}
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

        {isSmallScreen ? (
          // Card-Based Layout for Small Screens
          <Stack spacing={2}>
            {isSuccess &&
              !isLoading &&
              !isFetching &&
              data?.value?.subUnit?.map((item, index) => (
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

                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography sx={{ fontWeight: 700, fontSize: "0.875rem", lineHeight: 1.57, color: "#D65DB1" }}>UNIT:</Typography>
                        <Typography sx={{ fontWeight: 400, fontSize: "0.875rem", lineHeight: 1.57, color: theme.palette.text.main }}>
                          {item.unit_Code} - {item.unit_Name}
                        </Typography>
                      </Stack>

                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography sx={{ fontWeight: 700, fontSize: "0.875rem", lineHeight: 1.57, color: "#D65DB1" }}>SUB UNIT CODE:</Typography>
                        <Typography sx={{ fontWeight: 400, fontSize: "0.875rem", lineHeight: 1.57, color: theme.palette.text.main }}>{item.subUnit_Code}</Typography>
                      </Stack>

                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography sx={{ fontWeight: 700, fontSize: "0.875rem", lineHeight: 1.57, color: "#D65DB1" }}>SUB UNIT NAME:</Typography>
                        <Typography sx={{ fontWeight: 400, fontSize: "0.875rem", lineHeight: 1.57, color: theme.palette.text.main }}>{item.subUnit_Name}</Typography>
                      </Stack>

                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography sx={{ fontWeight: 700, fontSize: "0.875rem", lineHeight: 1.57, color: "#D65DB1" }}>ORIGIN:</Typography>
                        <Chip
                          variant="filled"
                          size="30px"
                          icon={item.subUnit_No === null ? <Add color="warning" /> : <Sync color="success" />}
                          sx={{
                            fontSize: "12px",
                            backgroundColor: theme.palette.bgForm.black1,
                            color: theme.palette.text.main,
                            fontWeight: 800,
                          }}
                          label={item.subUnit_No === null ? "Manual" : "Syncing"}
                        />
                      </Stack>

                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography sx={{ fontWeight: 700, fontSize: "0.875rem", lineHeight: 1.57, color: "#D65DB1" }}>ACTION:</Typography>
                        <SubActions data={item} status={status} onArchive={onArchiveAction} onUpdate={onEditAction} />
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

            {isSuccess && !data?.value?.subUnit?.length && (
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
          <>
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
                      UNIT
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
                      SUB UNIT CODE
                    </TableCell>

                    <TableCell
                      sx={{
                        background: "#1C2536",
                        color: "#D65DB1",
                        fontWeight: 700,
                        fontSize: "12px",
                      }}
                    >
                      SUB UNIT NAME
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
                      ORIGIN
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
                      ACTIONS
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {isSuccess &&
                    !isLoading &&
                    !isFetching &&
                    data?.value?.subUnit?.map((item, index) => (
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

                        <TableCell
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "14px",
                            fontWeight: 500,
                          }}
                        >
                          {item.unit_Code} - {item.unit_Name}
                        </TableCell>

                        <TableCell
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "14px",
                            fontWeight: 500,
                          }}
                          align="center"
                        >
                          {item.subUnit_Code}
                        </TableCell>

                        <TableCell
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "14px",
                            fontWeight: 500,
                          }}
                        >
                          {item.subUnit_Name}
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
                            // color={item.is_Active ? "success" : "warning"}
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
                          <Chip
                            variant="filled"
                            size="30px"
                            icon={item.subUnit_No === null ? <Add color="warning" /> : <Sync color="success" />}
                            sx={{
                              fontSize: "12px",
                              backgroundColor: theme.palette.bgForm.black1,
                              color: theme.palette.text.main,
                              fontWeight: 800,
                            }}
                            label={item.subUnit_No === null ? "Manual" : "Syncing"}
                          />
                        </TableCell>

                        {item.subUnit_No === null ? (
                          <TableCell
                            sx={{
                              color: "#EDF2F7",
                              fontSize: "14px",
                              fontWeight: 500,
                            }}
                            align="center"
                          >
                            <SubActions data={item} status={status} onArchive={onArchiveAction} onUpdate={onEditAction} />
                          </TableCell>
                        ) : (
                          <TableCell
                            sx={{
                              color: "#EDF2F7",
                              fontSize: "14px",
                              fontWeight: 500,
                            }}
                            align="center"
                          ></TableCell>
                        )}
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

                  {isSuccess && !data?.value?.subUnit.length && (
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
          </>
        )}

        <SubUnitErrorDialog errorData={errorData} open={open} onClose={onClose} />

        <SubUnitAddDialog data={editData} setData={setEditData} open={addSubUnitOpen} onClose={addSubUnitOnClose} />
      </Stack>
    </Stack>
  );
};

export default SubUnit;
