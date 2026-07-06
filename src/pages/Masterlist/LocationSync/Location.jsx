import { useEffect, useState } from "react";
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
import { LoadingButton } from "@mui/lab";
import { toast } from "sonner";

import noRecordsFound from "../../../assets/svg/noRecordsFound.svg";
import somethingWentWrong from "../../../assets/svg/SomethingWentWrong.svg";

import useDebounce from "../../../hooks/useDebounce";
import useDisclosure from "../../../hooks/useDisclosure";

import { useLazyGetLocationsQuery } from "../../../features/ymir/ymirApi";
import { useGetLocationQuery, useSyncLocationMutation } from "../../../features/api masterlist/location/locationApi";

import LocationSubUnit from "./LocationSubUnit";
import { LocationErrorDialog } from "./LocationErrorDialog";
import { masterlistStyles as sx } from "../styles/masterlistStyles";

const TABLE_COLUMNS = ["LINE NO.", "LOCATION CODE", "LOCATION NAME", "SUB UNITS"];

const Location = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue, 500);

  const { open, onToggle, onClose } = useDisclosure();

  const { data, isLoading, isFetching, isSuccess, isError } = useGetLocationQuery({
    Status: true,
    Search: search,
    PageNumber: pageNumber,
    PageSize: pageSize,
  });

  const [getLocations, { isLoading: isLocationLoading, isFetching: isLocationFetching }] = useLazyGetLocationsQuery();
  const [syncLocations, { error: errorData, isLoading: isLocationSyncLoading, isFetching: isLocationSyncFetching }] = useSyncLocationMutation();

  const rows = data?.value?.location ?? [];
  const isBusy = isLoading || isFetching;
  const hasRows = isSuccess && !isBusy && rows.length > 0;
  const isEmpty = isSuccess && !isBusy && rows.length === 0;

  const onPageNumberChange = (_, page) => setPageNumber(page + 1);

  const onPageSizeChange = (e) => {
    setPageSize(e.target.value);
  };

  const onSyncLocations = () => {
    Swal.fire({
      title: "Confirmation?",
      text: "Are you sure you want to sync the location list?",
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
        getLocations()
          .unwrap()
          .then(async (response) => {
            await syncLocations(response)
              .unwrap()
              .then(() => {
                toast.success("Success!", {
                  description: "Sync data successfully!",
                });
              })
              .catch((error) => {
                console.log("Error Location: ", error);
                if (error.status === 400) {
                  onToggle();
                }
              });
          })
          .catch(() => {
            toast.error("Error!", {
              description: "Location sync failed",
            });
          });
      }
    });
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
              Location
            </Typography>
            <Chip label={`${data?.value?.totalCount ?? 0} total`} size="small" sx={sx.countChip} />
          </Stack>
          <Typography sx={sx.pageSubtitle}>Sync and view locations</Typography>
        </Stack>

        <LoadingButton
          variant="contained"
          size="large"
          startIcon={<SyncOutlined />}
          loadingPosition="start"
          onClick={() => onSyncLocations()}
          loading={isLocationLoading || isLocationFetching || isLocationSyncLoading || isLocationSyncFetching}
          sx={sx.syncButton}
        >
          Sync Location
        </LoadingButton>
      </Stack>

      <Stack sx={sx.contentContainer}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={sx.searchContainer} gap={4}>
          <OutlinedInput
            placeholder="Search location"
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
                      <Typography variant="body2" color="text.secondary">
                        LINE NO. {index + 1}
                      </Typography>

                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography sx={sx.cardLabel}>LOCATION CODE:</Typography>
                        <Typography sx={sx.cardValue}>{item.location_Code}</Typography>
                      </Stack>

                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography sx={sx.cardLabel}>LOCATION NAME:</Typography>
                        <Typography sx={sx.cardValue}>{item.location_Name}</Typography>
                      </Stack>

                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography sx={sx.cardLabel}>SUB UNITS:</Typography>
                        <LocationSubUnit subUnits={item.subUnits} />
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
                      <TableCell key={column} sx={sx.headCell} align={column === "LINE NO." ? "center" : "left"}>
                        {column}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {hasRows &&
                    rows.map((item, index) => (
                      <TableRow key={item.location_No}>
                        <TableCell sx={sx.bodyCell} align="center">
                          {index + 1}
                        </TableCell>
                        <TableCell sx={sx.bodyCell}>{item.location_Code}</TableCell>
                        <TableCell sx={sx.bodyCell}>{item.location_Name}</TableCell>
                        <TableCell sx={sx.bodyCell}>
                          <LocationSubUnit subUnits={item.subUnits} />
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

        <LocationErrorDialog errorData={errorData} open={open} onClose={onClose} />
      </Stack>
    </Stack>
  );
};

export default Location;
