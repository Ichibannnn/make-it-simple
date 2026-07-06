import { useEffect, useState } from "react";
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
  useTheme,
} from "@mui/material";
import { Search, SyncOutlined, AddOutlined, Sync, Add } from "@mui/icons-material";

import Swal from "sweetalert2";
import { LoadingButton } from "@mui/lab";
import { toast } from "sonner";

import noRecordsFound from "../../../assets/svg/noRecordsFound.svg";
import somethingWentWrong from "../../../assets/svg/SomethingWentWrong.svg";

import useDebounce from "../../../hooks/useDebounce";
import useDisclosure from "../../../hooks/useDisclosure";

import { SubUnitErrorDialog } from "./SubUnitErrorDialog";
import SubUnitAddDialog from "./SubUnitAddDialog";
import SubActions from "./SubActions";

import { useArchiveSubUnitMutation, useGetSubUnitQuery, useSyncSubUnitMutation } from "../../../features/api masterlist/sub-unit/subUnitApi";
import { useLazyGetSubUnitsQuery } from "../../../features/ymir/ymirApi";
import { masterlistStyles as sx } from "../styles/masterlistStyles";

const STATUS_TABS = [
  { value: "", label: "All" },
  { value: "true", label: "Active" },
  { value: "false", label: "Archived" },
];

const TABLE_COLUMNS = ["LINE NO.", "UNIT", "SUB UNIT CODE", "SUB UNIT NAME", "STATUS", "ORIGIN", "ACTIONS"];

const SubUnit = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [status, setStatus] = useState("true");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [editData, setEditData] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue, 500);

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

  const rows = data?.value?.subUnit ?? [];
  const isBusy = isLoading || isFetching;
  const hasRows = isSuccess && !isBusy && rows.length > 0;
  const isEmpty = isSuccess && !isBusy && rows.length === 0;

  const onPageNumberChange = (_, page) => setPageNumber(page + 1);

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
          .then(async (response) => {
            await syncSubUnits(response)
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
    <Stack sx={sx.pageContainer}>
      <Stack sx={sx.pageHeader}>
        <Stack>
          <Stack sx={sx.titleGroup}>
            <Typography variant={isSmallScreen ? "h5" : "h4"} sx={sx.pageTitle}>
              Sub Unit
            </Typography>
            <Chip label={`${data?.value?.totalCount ?? 0} total`} size="small" sx={sx.countChip} />
          </Stack>
          <Typography sx={sx.pageSubtitle}>Sync or manually manage sub units</Typography>
        </Stack>

        <Stack sx={sx.headerActions}>
          <LoadingButton
            variant="contained"
            size="large"
            startIcon={<SyncOutlined />}
            loadingPosition="start"
            onClick={() => onSyncSubUnits()}
            loading={isSubUnitLoading || isSubUnitFetching || isSubUnitSyncLoading || isSubUnitSyncFetching}
            sx={sx.syncButton}
          >
            Sync Sub Unit
          </LoadingButton>

          <LoadingButton
            variant="outlined"
            size="large"
            startIcon={<AddOutlined />}
            loadingPosition="start"
            onClick={() => onAddSubUnitAction()}
            sx={sx.secondaryButton}
          >
            Add Sub Unit
          </LoadingButton>
        </Stack>
      </Stack>

      <Stack sx={sx.contentContainer}>
        <Tabs value={status} onChange={onStatusChange} variant="scrollable" scrollButtons="auto" sx={sx.tabs}>
          {STATUS_TABS.map((tab) => (
            <Tab key={tab.label} value={tab.value} label={tab.label} sx={sx.tab} />
          ))}
        </Tabs>

        <Divider variant="fullWidth" sx={sx.divider} />

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={sx.searchContainer} gap={2}>
          <OutlinedInput
            placeholder="Search sub unit"
            startAdornment={<Search sx={sx.searchIcon} />}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            sx={sx.searchInput}
          />
        </Stack>

        {isSmallScreen ? (
          <Stack spacing={2}>
            {hasRows &&
              rows.map((item, index) => (
                <Card key={item.id} sx={sx.card}>
                  <CardContent>
                    <Stack spacing={1}>
                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography variant="body2" color="text.secondary">
                          LINE NO. {index + 1}
                        </Typography>
                        <Chip
                          label={item.is_Active ? "ACTIVE" : "INACTIVE"}
                          size="small"
                          sx={{ ...sx.statusChip(item.is_Active), ...sx.cardChip }}
                        />
                      </Stack>

                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography sx={sx.cardLabel}>UNIT:</Typography>
                        <Typography sx={sx.cardValue}>
                          {item.unit_Code} - {item.unit_Name}
                        </Typography>
                      </Stack>

                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography sx={sx.cardLabel}>SUB UNIT CODE:</Typography>
                        <Typography sx={sx.cardValue}>{item.subUnit_Code}</Typography>
                      </Stack>

                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography sx={sx.cardLabel}>SUB UNIT NAME:</Typography>
                        <Typography sx={sx.cardValue}>{item.subUnit_Name}</Typography>
                      </Stack>

                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography sx={sx.cardLabel}>ORIGIN:</Typography>
                        <Chip
                          variant="filled"
                          size="small"
                          icon={item.subUnit_No === null ? <Add color="warning" /> : <Sync color="success" />}
                          sx={sx.originChip}
                          label={item.subUnit_No === null ? "Manual" : "Syncing"}
                        />
                      </Stack>

                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography sx={sx.cardLabel}>ACTION:</Typography>
                        <SubActions data={item} status={status} onArchive={onArchiveAction} onUpdate={onEditAction} />
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
              page={(data?.value?.currentPage || 1) - 1}
              onPageChange={onPageNumberChange}
              onRowsPerPageChange={onPageSizeChange}
            />
          </Stack>
        ) : (
          <>
            <TableContainer>
              <Table sx={sx.table}>
                <TableHead>
                  <TableRow>
                    {TABLE_COLUMNS.map((column) => (
                      <TableCell
                        key={column}
                        sx={sx.headCell}
                        align={column === "UNIT" || column === "SUB UNIT NAME" ? "left" : "center"}
                      >
                        {column}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {hasRows &&
                    rows.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell sx={sx.bodyCell} align="center">
                          {index + 1}
                        </TableCell>
                        <TableCell sx={sx.bodyCell}>
                          {item.unit_Code} - {item.unit_Name}
                        </TableCell>
                        <TableCell sx={sx.bodyCell} align="center">
                          {item.subUnit_Code}
                        </TableCell>
                        <TableCell sx={sx.bodyCell}>{item.subUnit_Name}</TableCell>
                        <TableCell sx={sx.bodyCell} align="center">
                          <Chip
                            variant="filled"
                            size="small"
                            sx={sx.statusChip(item.is_Active)}
                            label={item.is_Active ? "ACTIVE" : "INACTIVE"}
                          />
                        </TableCell>
                        <TableCell sx={sx.bodyCell} align="center">
                          <Chip
                            variant="filled"
                            size="small"
                            icon={item.subUnit_No === null ? <Add color="warning" /> : <Sync color="success" />}
                            sx={sx.originChip}
                            label={item.subUnit_No === null ? "Manual" : "Syncing"}
                          />
                        </TableCell>
                        {item.subUnit_No === null ? (
                          <TableCell sx={sx.bodyCell} align="center">
                            <SubActions data={item} status={status} onArchive={onArchiveAction} onUpdate={onEditAction} />
                          </TableCell>
                        ) : (
                          <TableCell sx={sx.bodyCell} align="center"></TableCell>
                        )}
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
                        <img src={noRecordsFound} alt="No Records Found" className="norecords-found-table" />
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
              page={(data?.value?.currentPage || 1) - 1}
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
