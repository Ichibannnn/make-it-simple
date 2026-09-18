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
import { useArchivePmsTypeMutation, useGetPmsTypeQuery } from "../../../features/api masterlist/pms-type/pmsTypeApi";

import PmsTypeActions from "./PmsTypeActions";
import PmsTypeDialog from "./PmsTypeDialog";
import { pmsTypeStyles as sx } from "./styles/pmsTypeStyles";

// --- Static config kept out of render so it isn't rebuilt every pass ---------
const STATUS_TABS = [
  { value: "", label: "ALL" },
  { value: "true", label: "ACTIVE" },
  { value: "false", label: "ARCHIVED" },
];

const TABLE_COLUMNS = ["LINE NO.", "SITE", "NAME", "TOTAL EVALUATION", "LOOKUP SOURCE", "STATUS", "ACTIONS"];

// Shared SweetAlert theme so every confirm dialog looks identical.
const CONFIRM_DIALOG_THEME = {
  icon: "warning",
  color: "white",
  background: "#111927",
  showCancelButton: true,
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
};

const loadingButtonHtml = (label) => `
  <div class="mui-btn-content">
    <span class="mui-spinner"></span>
    <span class="mui-label">${label}</span>
  </div>`;

const PmsType = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [status, setStatus] = useState("true");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue, 500);

  const [editData, setEditData] = useState(null);
  const { open, onToggle, onClose } = useDisclosure();

  const { data, isLoading, isFetching, isSuccess, isError } = useGetPmsTypeQuery({
    Status: status,
    Search: search,
    PageNumber: pageNumber,
    PageSize: pageSize,
  });

  const [archivePmsType] = useArchivePmsTypeMutation();

  // Derived view state — computed once, read many times below.
  const rows = data?.value?.type ?? [];
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

  // One handler for both archive and restore — the only differences are the copy.
  const onArchiveAction = ({ id, isActive }) => {
    const copy = isActive ? { text: "archived", progress: "Archiving...", done: "archived" } : { text: "active", progress: "Restoring...", done: "restored" };

    Swal.fire({
      ...CONFIRM_DIALOG_THEME,
      title: "Are you sure?",
      text: `This will move the PMS Type to the ${copy.text} tab.`,
      preConfirm: async () => {
        const confirmButton = Swal.getConfirmButton();
        confirmButton.disabled = true;
        confirmButton.innerHTML = loadingButtonHtml(copy.progress);

        try {
          await archivePmsType(id).unwrap();
          toast.success("Success!", { description: `PMS Type ${copy.done} successfully!` });
          return true; // closes the dialog
        } catch (error) {
          Swal.hideLoading();
          Swal.showValidationMessage(error?.data?.error?.message || "Something went wrong");
          return false; // keeps the dialog open so the user sees the error
        }
      },
    }).then((result) => {
      if (result.isConfirmed) Swal.close();
    });
  };

  const onEditAction = (row) => {
    setEditData(row);
    onToggle();
  };

  useEffect(() => {
    if (searchValue) setPageNumber(1);
  }, [searchValue]);

  return (
    <Stack sx={sx.pageContainer}>
      <Stack sx={sx.pageHeader}>
        <Stack>
          <Stack sx={sx.titleGroup}>
            <Typography variant={isSmallScreen ? "h5" : "h4"} sx={sx.pageTitle}>
              PMS Type
            </Typography>
            <Chip label={`${data?.value?.totalCount ?? 0} total`} size="small" sx={sx.countChip} />
          </Stack>
          <Typography sx={sx.pageSubtitle}>Manage preventive maintenance schedule types</Typography>
        </Stack>

        <Button variant="contained" size="large" startIcon={<AddOutlined />} onClick={onToggle} sx={sx.addButton}>
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

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={sx.searchContainer} gap={4}>
          <OutlinedInput placeholder="Search PMS Type" startAdornment={<Search sx={sx.searchIcon} />} value={searchValue} onChange={(e) => setSearchValue(e.target.value)} sx={sx.searchInput} />
        </Stack>

        {isSmallScreen ? (
          // Card-based layout for small screens
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
                        <Chip label={item.isActive ? "ACTIVE" : "INACTIVE"} size="small" sx={{ ...sx.statusChip(item.isActive), ...sx.cardChip }} />
                      </Stack>

                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography sx={sx.cardLabel}>SITE:</Typography>
                        <Typography sx={sx.cardValue}>{item.siteName || "--"}</Typography>
                      </Stack>

                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography sx={sx.cardLabel}>NAME:</Typography>
                        <Typography sx={sx.cardValue}>{item.name || "--"}</Typography>
                      </Stack>

                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography sx={sx.cardLabel}>TOTAL EVALUATION:</Typography>
                        <Typography sx={sx.cardValue}>{item.totalAnnualPMS || "--"}</Typography>
                      </Stack>

                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography sx={sx.cardLabel}>ACTION:</Typography>
                        <PmsTypeActions data={item} onArchive={onArchiveAction} onUpdate={onEditAction} />
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
                <TableHead sx={sx.tableHead}>
                  <TableRow>
                    {TABLE_COLUMNS.map((column) => (
                      <TableCell key={column} sx={sx.headCell} align={column === "NAME" || column === "SITE" ? "left" : "center"}>
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
                        <TableCell sx={sx.bodyCell}>{item.siteName || "--"}</TableCell>
                        <TableCell sx={sx.bodyCell}>{item.name || "--"}</TableCell>
                        <TableCell sx={sx.bodyCell} align="center">
                          {item.totalAnnualPMS || "--"}
                        </TableCell>
                        <TableCell sx={sx.bodyCell} align="center">
                          {item.lookup || "--"}
                        </TableCell>
                        <TableCell sx={sx.bodyCell} align="center">
                          <Chip variant="filled" size="small" sx={sx.statusChip(item.isActive)} label={item.isActive ? "ACTIVE" : "INACTIVE"} />
                        </TableCell>
                        <TableCell sx={sx.bodyCell} align="center">
                          <PmsTypeActions data={item} onArchive={onArchiveAction} onUpdate={onEditAction} />
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

        <PmsTypeDialog data={editData} open={open} onClose={onDialogClose} />
      </Stack>
    </Stack>
  );
};

export default PmsType;
