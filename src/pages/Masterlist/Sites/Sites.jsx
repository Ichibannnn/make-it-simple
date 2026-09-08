import {
  Button,
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
import { AddOutlined, Search } from "@mui/icons-material";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { toast } from "sonner";

import noRecordsFound from "../../../assets/svg/noRecordsFound.svg";
import somethingWentWrong from "../../../assets/svg/SomethingWentWrong.svg";

import useDebounce from "../../../hooks/useDebounce";
import useDisclosure from "../../../hooks/useDisclosure";

import SiteDialog from "./SiteDialog";
import SiteActions from "./SiteActions";

import { useArchiveSitesMutation, useGetSitesQuery } from "../../../features/api masterlist/sites/sitesApi";
import { masterlistStyles as sx } from "../styles/masterlistStyles";

const STATUS_TABS = [
  { value: "", label: "ALL" },
  { value: "true", label: "ACTIVE" },
  { value: "false", label: "ARCHIVED" },
];

const TABLE_COLUMNS = ["LINE NO.", "SITE NAME", "STATUS", "ACTIONS"];

const Sites = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [status, setStatus] = useState("true");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue, 500);

  const [editData, setEditData] = useState(null);
  const { open, onToggle, onClose } = useDisclosure();

  const { data, isLoading, isFetching, isSuccess, isError, refetch } = useGetSitesQuery({
    Status: status,
    Search: search,
    PageNumber: pageNumber,
    PageSize: pageSize,
  });

  const [archiveSite] = useArchiveSitesMutation();

  const rows = data?.value?.sites ?? [];
  const isBusy = isLoading || isFetching;
  const hasRows = isSuccess && !isBusy && rows.length > 0;
  const isEmpty = isSuccess && !isBusy && rows.length === 0;

  const onPageNumberChange = (_, page) => setPageNumber(page + 1);

  const onPageSizeChange = (e) => {
    setPageSize(e.target.value);
    setPageNumber(1);
  };

  const onStatusChange = (_, newValue) => {
    setStatus(newValue);
    setPageNumber(1);
    setPageSize(5);
  };

  const onDialogClose = () => {
    setEditData(null);
    onClose();
  };

  const onArchiveAction = (data) => {
    if (data.isActive === true) {
      Swal.fire({
        title: "Are you sure?",
        text: "This will move the Site to the archived tab.",
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

            await archiveSite(data.id)
              .unwrap()
              .then(() => {
                toast.success("Success!", {
                  description: "Site archived successfully!",
                });
              })
              .catch((error) => {
                toast.error("Error!", {
                  description: error.data.error.message,
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
          Swal.close();
        }
      });
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "This will move the Site to the active tab.",
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

            await archiveSite(data.id)
              .unwrap()
              .then(() => {
                toast.success("Success!", {
                  description: "Site restored successfully!",
                });
              })
              .catch((error) => {
                toast.error("Error!", {
                  description: error.data.error.message,
                });
              });

            return true;
          } catch (err) {
            console.log("Error", err);
            Swal.hideLoading();
            Swal.showValidationMessage(err?.data?.error?.message || "Something went wrong");
            return false;
          }
        },
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.close();
        }
      });
    }
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

  useEffect(() => {
    if (status) {
      refetch();
    }
  }, [status]);

  return (
    <Stack sx={sx.pageContainer}>
      <Stack sx={sx.pageHeader}>
        <Stack>
          <Stack sx={sx.titleGroup}>
            <Typography variant={isSmallScreen ? "h5" : "h4"} sx={sx.pageTitle}>
              Sites
            </Typography>
            <Chip label={`${data?.value?.totalCount ?? 0} total`} size="small" sx={sx.countChip} />
          </Stack>
          <Typography sx={sx.pageSubtitle}>Manage site locations</Typography>
        </Stack>

        <Button
          variant="contained"
          size="large"
          startIcon={<AddOutlined />}
          onClick={onToggle}
          sx={sx.addButton}
        >
          Add
        </Button>
      </Stack>

      <Stack sx={sx.contentContainer}>
        <Tabs value={status} onChange={onStatusChange} variant="scrollable" scrollButtons="auto" sx={sx.tabs}>
          {STATUS_TABS.map((tab) => (
            <Tab key={tab.label} value={tab.value} label={tab.label} sx={sx.tab} />
          ))}
        </Tabs>

        <Divider variant="fullWidth" sx={sx.divider} />

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={sx.searchContainer}
          gap={4}
        >
          <OutlinedInput
            placeholder="Search Site"
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
                          label={item.isActive ? "ACTIVE" : "INACTIVE"}
                          size="small"
                          sx={{ ...sx.statusChip(item.isActive), ...sx.cardChip }}
                        />
                      </Stack>

                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography sx={sx.cardLabel}>SITE NAME:</Typography>
                        <Typography sx={sx.cardValue}>{item.name || "-"}</Typography>
                      </Stack>

                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography sx={sx.cardLabel}>ACTION:</Typography>
                        <SiteActions
                          data={item}
                          status={status}
                          onArchive={onArchiveAction}
                          onUpdate={onEditAction}
                        />
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              ))}

            {isError && (
              <Stack sx={sx.feedbackContainer}>
                <img
                  src={somethingWentWrong}
                  alt="Something Went Wrong"
                  className="something-went-wrong-table"
                />
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
                        align={column === "SITE NAME" ? "left" : "center"}
                      >
                        {column}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {hasRows &&
                    rows.map((item, i) => (
                      <TableRow key={item.id}>
                        <TableCell sx={sx.bodyCell} align="center">
                          {i + 1}
                        </TableCell>
                        <TableCell sx={sx.bodyCell}>{item.name || "-"}</TableCell>
                        <TableCell sx={sx.bodyCell} align="center">
                          <Chip
                            variant="filled"
                            size="small"
                            sx={sx.statusChip(item.isActive)}
                            label={item.isActive ? "ACTIVE" : "INACTIVE"}
                          />
                        </TableCell>
                        <TableCell sx={sx.bodyCell} align="center">
                          <SiteActions
                            data={item}
                            status={status}
                            onArchive={onArchiveAction}
                            onUpdate={onEditAction}
                          />
                        </TableCell>
                      </TableRow>
                    ))}

                  {isError && (
                    <TableRow>
                      <TableCell colSpan={TABLE_COLUMNS.length} align="center">
                        <img
                          src={somethingWentWrong}
                          alt="Something Went Wrong"
                          className="something-went-wrong-table"
                        />
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
                        <img
                          src={noRecordsFound}
                          alt="No Records Found"
                          className="norecords-found-table"
                          style={{ width: "100%", maxWidth: "300px" }}
                        />
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

        <SiteDialog data={editData} open={open} onClose={onDialogClose} />
      </Stack>
    </Stack>
  );
};

export default Sites;
