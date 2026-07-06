import {
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
  useTheme,
} from "@mui/material";
import { Search, SyncOutlined } from "@mui/icons-material";

import Swal from "sweetalert2";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";

import useDebounce from "../../../hooks/useDebounce";

import noRecordsFound from "../../../assets/svg/noRecordsFound.svg";
import somethingWentWrong from "../../../assets/svg/SomethingWentWrong.svg";
import {
  useGetOneChargingQuery,
  useSyncOneChargingMutation,
} from "../../../features/api masterlist/one_charging/oneChargingApi";
import { masterlistStyles as sx } from "../styles/masterlistStyles";

const TABLE_COLUMNS = [
  "SYNC ID",
  "CODE",
  "NAME",
  "COMPANY",
  "BUSINESS UNIT",
  "DEPARTMENT",
  "UNIT",
  "SUB UNIT",
  "LOCATION",
];

const OneCharging = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue, 500);

  const { data, isLoading, isFetching, isSuccess, isError } =
    useGetOneChargingQuery({
      Status: true,
      Search: search,
      PageNumber: pageNumber,
      PageSize: pageSize,
    });

  const [
    syncOneCharging,
    {
      isLoading: syncOneChargingIsLoading,
      isFetching: syncOneChargingIsFetching,
    },
  ] = useSyncOneChargingMutation();

  const rows = data?.value?.onecharging ?? [];
  const isBusy = isLoading || isFetching;
  const hasRows = isSuccess && !isBusy && rows.length > 0;
  const isEmpty = isSuccess && !isBusy && rows.length === 0;

  const onPageNumberChange = (_, page) => setPageNumber(page + 1);

  const onPageSizeChange = (e) => {
    setPageSize(e.target.value);
  };

  useEffect(() => {
    if (searchValue) {
      setPageNumber(1);
    }
  }, [searchValue]);

  const onSyncOneCharging = () => {
    Swal.fire({
      title: "Confirmation?",
      text: "Are you sure you want to sync the one charging list?",
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
        syncOneCharging()
          .unwrap()
          .then(() => {
            toast.success("Success", {
              description: "Sync data successfully",
              classNames: {
                toast: "bg-blue-400",
              },
            });
          })
          .catch(() => {
            toast.error("Error!", {
              description: "Company sync failed!",
            });
          });
      }
    });
  };

  return (
    <Stack sx={sx.pageContainer}>
      <Stack sx={sx.pageHeader}>
        <Stack>
          <Stack sx={sx.titleGroup}>
            <Typography variant={isSmallScreen ? "h5" : "h4"} sx={sx.pageTitle}>
              One Charging
            </Typography>
            <Chip
              label={`${data?.value?.totalCount ?? 0} total`}
              size="small"
              sx={sx.countChip}
            />
          </Stack>
          <Typography sx={sx.pageSubtitle}>
            Sync and view the one charging list
          </Typography>
        </Stack>

        <LoadingButton
          variant="contained"
          size={isSmallScreen ? "medium" : "large"}
          startIcon={<SyncOutlined />}
          loadingPosition="start"
          onClick={() => onSyncOneCharging()}
          loading={
            isLoading ||
            isFetching ||
            syncOneChargingIsLoading ||
            syncOneChargingIsFetching
          }
          sx={sx.syncButton}
        >
          Sync One Charging
        </LoadingButton>
      </Stack>

      <Stack sx={sx.contentContainer}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={sx.searchContainer}
          gap={4}
        >
          <OutlinedInput
            placeholder="Search"
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
                <Card key={index} sx={sx.card}>
                  <CardContent>
                    <Stack spacing={1}>
                      <Typography variant="body2" color="text.secondary">
                        SYNC ID: {item.sync_id}
                      </Typography>

                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography sx={sx.cardLabel}>CODE:</Typography>
                        <Typography sx={sx.cardValue}>{item.code}</Typography>
                      </Stack>

                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography sx={sx.cardLabel}>NAME:</Typography>
                        <Typography sx={sx.cardValue}>{item.name}</Typography>
                      </Stack>

                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography sx={sx.cardLabel}>COMPANY:</Typography>
                        <Typography sx={sx.cardValue}>
                          {item.companyCode} - {item.companyName}
                        </Typography>
                      </Stack>

                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography sx={sx.cardLabel}>
                          BUSINESS UNIT:
                        </Typography>
                        <Typography sx={sx.cardValue}>
                          {item.businessUnitCode} - {item.businessUnitName}
                        </Typography>
                      </Stack>

                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography sx={sx.cardLabel}>DEPARTMENT:</Typography>
                        <Typography sx={sx.cardValue}>
                          {item.departmentCode} - {item.deparmentName}
                        </Typography>
                      </Stack>

                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography sx={sx.cardLabel}>UNIT:</Typography>
                        <Typography sx={sx.cardValue}>
                          {item.unitCode} - {item.unitName}
                        </Typography>
                      </Stack>

                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography sx={sx.cardLabel}>SUB UNIT:</Typography>
                        <Typography sx={sx.cardValue}>
                          {item.subUnitCode} - {item.subUnitName}
                        </Typography>
                      </Stack>

                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography sx={sx.cardLabel}>LOCATION:</Typography>
                        <Typography sx={sx.cardValue}>
                          {item.locationCode} - {item.locationName}
                        </Typography>
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
                <img
                  src={noRecordsFound}
                  alt="No Records Found"
                  className="norecords-found-table"
                />
                <Typography variant="h6" align="center">
                  No records found.
                </Typography>
              </Stack>
            )}

            <TablePagination
              sx={sx.paginationMobile}
              rowsPerPageOptions={[
                100,
                300,
                500,
                { value: data?.value?.totalCount, label: "All" },
              ]}
              component="div"
              count={data?.value?.totalCount || 0}
              rowsPerPage={data?.value?.pageSize || 100}
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
                      <TableCell key={column} sx={sx.headCell}>
                        {column}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {hasRows &&
                    rows.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell sx={sx.bodyCell} align="center">
                          {item.sync_id}
                        </TableCell>
                        <TableCell sx={sx.bodyCell}>{item.code}</TableCell>
                        <TableCell sx={sx.bodyCell}>{item.name}</TableCell>
                        <TableCell sx={sx.bodyCell}>
                          {item.companyCode} - {item.companyName}
                        </TableCell>
                        <TableCell sx={sx.bodyCell}>
                          {item.businessUnitCode} - {item.businessUnitName}
                        </TableCell>
                        <TableCell sx={sx.bodyCell}>
                          {item.departmentCode} - {item.deparmentName}
                        </TableCell>
                        <TableCell sx={sx.bodyCell}>
                          {item.unitCode} - {item.unitName}
                        </TableCell>
                        <TableCell sx={sx.bodyCell}>
                          {item.subUnitCode} - {item.subUnitName}
                        </TableCell>
                        <TableCell sx={sx.bodyCell}>
                          {item.locationCode} - {item.locationName}
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
                        <Typography
                          variant="h5"
                          sx={sx.feedbackText}
                          marginLeft={2}
                        >
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
                        />
                        <Typography
                          variant="h5"
                          sx={sx.feedbackText}
                          marginLeft={2}
                        >
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
              rowsPerPageOptions={[
                100,
                300,
                500,
                { value: data?.value?.totalCount, label: "All" },
              ]}
              component="div"
              count={data?.value?.totalCount || 0}
              rowsPerPage={data?.value?.pageSize || 100}
              page={(data?.value?.currentPage || 1) - 1}
              onPageChange={onPageNumberChange}
              onRowsPerPageChange={onPageSizeChange}
            />
          </>
        )}
      </Stack>
    </Stack>
  );
};

export default OneCharging;
