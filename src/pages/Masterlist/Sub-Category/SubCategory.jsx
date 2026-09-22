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

import Swal from "sweetalert2";
import { toast } from "sonner";
import { useEffect, useState } from "react";

import noRecordsFound from "../../../assets/svg/noRecordsFound.svg";
import somethingWentWrong from "../../../assets/svg/SomethingWentWrong.svg";

import useDebounce from "../../../hooks/useDebounce";
import useDisclosure from "../../../hooks/useDisclosure";

import { SubCategoryDialog } from "./SubCategoryDialog";
import { SubCategoryActions } from "./SubCategoryActions";

import { useArchiveSubCategoryMutation, useGetSubCategoryQuery } from "../../../features/api masterlist/sub_category_api/subCategoryApi";
import { sweetAlertDialog } from "../../../hooks/useSweetAlertDialog";
import { masterlistStyles as sx } from "../styles/masterlistStyles";
import { showConfirmAction } from "../../../utils/sweetAlert";

const STATUS_TABS = [
  { value: "", label: "ALL" },
  { value: "true", label: "ACTIVE" },
  { value: "false", label: "ARCHIVED" },
];

const TABLE_COLUMNS = ["LINE NO.", "CATEGORY", "SUB CATEGORY NAME", "STATUS", "ACTIONS"];

const SubCategory = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [status, setStatus] = useState("true");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue, 500);

  const [editData, setEditData] = useState(null);

  const { open, onToggle, onClose } = useDisclosure();

  const { data, isLoading, isFetching, isSuccess, isError, refetch } = useGetSubCategoryQuery({
    Status: status,
    Search: search,
    PageNumber: pageNumber,
    PageSize: pageSize,
  });

  const [archiveSubCategory] = useArchiveSubCategoryMutation();

  const rows = data?.value?.subCategory ?? [];
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

  const onArchiveAction = async (data) => {
    const copy = data?.isActive
      ? { text: "archived", progress: "Archiving...", done: "archived", buttonText: "Archive" }
      : {
          text: "active",
          progress: "Restoring...",
          done: "restored",
          buttonText: "Restore",
        };

    const confirmed = await showConfirmAction({
      title: "Are you sure?",
      text: `This will move the sub category to the ${copy.text} tab.`,
      confirmButtonText: `${copy.buttonText}`,
      loadingText: copy.progress,

      onConfirm: async () => {
        await archiveSubCategory(data.id).unwrap();
      },
    });

    if (confirmed) {
      toast.success("Success!", {
        description: `Sub category ${copy.done} successfully!`,
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
              Sub Category
            </Typography>
            <Chip label={`${data?.value?.totalCount ?? 0} total`} size="small" sx={sx.countChip} />
          </Stack>
          <Typography sx={sx.pageSubtitle}>Manage sub categories</Typography>
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
          <OutlinedInput placeholder="Search sub category" startAdornment={<Search sx={sx.searchIcon} />} value={searchValue} onChange={(e) => setSearchValue(e.target.value)} sx={sx.searchInput} />
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
                        <Chip label={item.is_Active ? "ACTIVE" : "INACTIVE"} size="small" sx={{ ...sx.statusChip(item.is_Active), ...sx.cardChip }} />
                      </Stack>

                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography sx={sx.cardLabel}>CATEGORY:</Typography>
                        <Typography sx={sx.cardValue}>{item.category_Description}</Typography>
                      </Stack>

                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography sx={sx.cardLabel}>SUB CATEGORY:</Typography>
                        <Typography sx={sx.cardValue}>{item.subCategory_Description}</Typography>
                      </Stack>

                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography sx={sx.cardLabel}>ACTION:</Typography>
                        <SubCategoryActions data={item} status={status} onArchive={onArchiveAction} onUpdate={onEditAction} />
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
                <TableHead sx={{ whiteSpace: "nowrap" }}>
                  <TableRow>
                    {TABLE_COLUMNS.map((column) => (
                      <TableCell key={column} sx={sx.headCell} align={column === "CATEGORY" || column === "SUB CATEGORY NAME" ? "left" : "center"}>
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
                        <TableCell sx={sx.bodyCell}>{item.category_Description}</TableCell>
                        <TableCell sx={sx.bodyCell}>{item.subCategory_Description}</TableCell>
                        <TableCell sx={sx.bodyCell} align="center">
                          <Chip variant="filled" size="small" sx={sx.statusChip(item.is_Active)} label={item.is_Active ? "ACTIVE" : "INACTIVE"} />
                        </TableCell>
                        <TableCell sx={sx.bodyCell} align="center">
                          <SubCategoryActions data={item} status={status} onArchive={onArchiveAction} onUpdate={onEditAction} />
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

        <SubCategoryDialog data={editData} open={open} onClose={onDialogClose} />
      </Stack>
    </Stack>
  );
};

export default SubCategory;
