import {
  Card,
  CardContent,
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
import { Search, SyncOutlined } from "@mui/icons-material";

import Swal from "sweetalert2";
import { theme } from "../../../theme/theme";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";

import useDebounce from "../../../hooks/useDebounce";

import noRecordsFound from "../../../assets/svg/noRecordsFound.svg";
import somethingWentWrong from "../../../assets/svg/SomethingWentWrong.svg";
import { useGetOneChargingQuery, useSyncOneChargingMutation } from "../../../features/api masterlist/one_charging/oneChargingApi";

const OneCharging = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue, 500);

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const { data, isLoading, isFetching, isSuccess, isError } = useGetOneChargingQuery({
    Status: true,
    Search: search,
    PageNumber: pageNumber,
    PageSize: pageSize,
  });

  const [syncOneCharging, { isLoading: syncOneChargingIsLoading, isFetching: syncOneChargingIsFetching }] = useSyncOneChargingMutation();

  const onPageNumberChange = (_, page) => {
    setPageNumber(page + 1);
  };

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
      text: "Are you sure you want to sync the company list?",
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
      <Stack>
        <Stack>
          <Stack width="100%" justifyContent="space-between" sx={{ flexDirection: isSmallScreen ? "column" : "row" }}>
            <Stack justifyItems="left">
              <Typography variant={isSmallScreen ? "h5" : "h4"}>One Charging</Typography>
            </Stack>

            <Stack justifyItems="space-between" direction="row" marginTop={1}>
              <LoadingButton
                variant="contained"
                size={isSmallScreen ? "medium" : "large"}
                color="primary"
                startIcon={<SyncOutlined />}
                loadingPosition="start"
                onClick={() => onSyncOneCharging()}
                loading={isLoading || isFetching || syncOneChargingIsLoading || syncOneChargingIsFetching}
                sx={{
                  ":disabled": {
                    backgroundColor: "none",
                    color: "black",
                  },
                }}
              >
                Sync One Charging
              </LoadingButton>
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      <Stack
        sx={{
          backgroundColor: theme.palette.bgForm.black3,
          borderRadius: "20px",
          marginTop: "10px",
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ marginTop: "10px", padding: "20px" }} gap={4}>
          <OutlinedInput
            placeholder="Search"
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
              data?.value?.onecharging?.map((item, index) => (
                <Card key={index} sx={{ backgroundColor: theme.palette.bgForm.black3, borderRadius: "15px", borderColor: "#2D3748" }}>
                  <CardContent>
                    <Stack spacing={1}>
                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography variant="body2" color="text.secondary">
                          SYNC ID: {item.sync_id}
                        </Typography>
                      </Stack>

                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography sx={{ fontWeight: 700, fontSize: "0.875rem", lineHeight: 1.57, color: "#D65DB1" }}>CODE:</Typography>
                        <Typography sx={{ fontWeight: 400, fontSize: "0.875rem", lineHeight: 1.57, color: theme.palette.text.main }}>{item.code}</Typography>
                      </Stack>

                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography sx={{ fontWeight: 700, fontSize: "0.875rem", lineHeight: 1.57, color: "#D65DB1" }}>NAME:</Typography>
                        <Typography sx={{ fontWeight: 400, fontSize: "0.875rem", lineHeight: 1.57, color: theme.palette.text.main }}>{item.name}</Typography>
                      </Stack>

                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography sx={{ fontWeight: 700, fontSize: "0.875rem", lineHeight: 1.57, color: "#D65DB1" }}>COMPANY:</Typography>
                        <Typography sx={{ fontWeight: 400, fontSize: "0.875rem", lineHeight: 1.57, color: theme.palette.text.main }}>
                          {item.companyCode} - {item.companyName}
                        </Typography>
                      </Stack>

                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography sx={{ fontWeight: 700, fontSize: "0.875rem", lineHeight: 1.57, color: "#D65DB1" }}>BUSINESS UNIT:</Typography>
                        <Typography sx={{ fontWeight: 400, fontSize: "0.875rem", lineHeight: 1.57, color: theme.palette.text.main }}>
                          {item.businessUnitCode} - {item.businessUnitName}
                        </Typography>
                      </Stack>

                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography sx={{ fontWeight: 700, fontSize: "0.875rem", lineHeight: 1.57, color: "#D65DB1" }}>DEPARTMENT:</Typography>
                        <Typography sx={{ fontWeight: 400, fontSize: "0.875rem", lineHeight: 1.57, color: theme.palette.text.main }}>
                          {item.departmentCode} - {item.deparmentName}
                        </Typography>
                      </Stack>

                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography sx={{ fontWeight: 700, fontSize: "0.875rem", lineHeight: 1.57, color: "#D65DB1" }}> UNIT:</Typography>
                        <Typography sx={{ fontWeight: 400, fontSize: "0.875rem", lineHeight: 1.57, color: theme.palette.text.main }}>
                          {item.unitCode} - {item.unitName}
                        </Typography>
                      </Stack>

                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography sx={{ fontWeight: 700, fontSize: "0.875rem", lineHeight: 1.57, color: "#D65DB1" }}>SUB UNIT:</Typography>
                        <Typography sx={{ fontWeight: 400, fontSize: "0.875rem", lineHeight: 1.57, color: theme.palette.text.main }}>
                          {item.subUnitCode} - {item.subUnitName}
                        </Typography>
                      </Stack>

                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography sx={{ fontWeight: 700, fontSize: "0.875rem", lineHeight: 1.57, color: "#D65DB1" }}>LOCATION:</Typography>
                        <Typography sx={{ fontWeight: 400, fontSize: "0.875rem", lineHeight: 1.57, color: theme.palette.text.main }}>
                          {item.locationCode} - {item.locationName}
                        </Typography>
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

            {isSuccess && !data?.value?.onecharging?.length && !isLoading && !isFetching && (
              <Stack justifyContent="center" alignItems="center" padding={4}>
                <img src={noRecordsFound} alt="No Records Found" className="norecords-found-table" />
                <Typography variant="h6" align="center">
                  No records found.
                </Typography>
              </Stack>
            )}

            <TablePagination
              sx={{ color: "#A0AEC0", fontWeight: 400, background: "#1C2536", borderRadius: "0px 0px 20px 20px" }}
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
                    >
                      SYNC ID
                    </TableCell>

                    <TableCell
                      sx={{
                        background: "#1C2536",
                        color: "#D65DB1",
                        fontWeight: 700,
                        fontSize: "12px",
                      }}
                    >
                      CODE
                    </TableCell>

                    <TableCell
                      sx={{
                        background: "#1C2536",
                        color: "#D65DB1",
                        fontWeight: 700,
                        fontSize: "12px",
                      }}
                    >
                      NAME
                    </TableCell>

                    <TableCell
                      sx={{
                        background: "#1C2536",
                        color: "#D65DB1",
                        fontWeight: 700,
                        fontSize: "12px",
                      }}
                    >
                      COMPANY
                    </TableCell>

                    <TableCell
                      sx={{
                        background: "#1C2536",
                        color: "#D65DB1",
                        fontWeight: 700,
                        fontSize: "12px",
                      }}
                    >
                      BUSINESS UNIT
                    </TableCell>

                    <TableCell
                      sx={{
                        background: "#1C2536",
                        color: "#D65DB1",
                        fontWeight: 700,
                        fontSize: "12px",
                      }}
                    >
                      DEPARTMENT
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
                    >
                      SUB UNIT
                    </TableCell>

                    <TableCell
                      sx={{
                        background: "#1C2536",
                        color: "#D65DB1",
                        fontWeight: 700,
                        fontSize: "12px",
                      }}
                    >
                      LOCATION
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {isSuccess &&
                    !isLoading &&
                    !isFetching &&
                    data?.value?.onecharging?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "14px",
                            fontWeight: 500,
                          }}
                          align="center"
                        >
                          {item.sync_id}
                        </TableCell>

                        <TableCell
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "14px",
                            fontWeight: 500,
                          }}
                        >
                          {item.code}
                        </TableCell>

                        <TableCell
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "14px",
                            fontWeight: 500,
                          }}
                        >
                          {item.name}
                        </TableCell>

                        <TableCell
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "14px",
                            fontWeight: 500,
                          }}
                        >
                          {item.companyCode} - {item.companyName}
                        </TableCell>

                        <TableCell
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "14px",
                            fontWeight: 500,
                          }}
                        >
                          {item.businessUnitCode} - {item.businessUnitName}
                        </TableCell>

                        <TableCell
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "14px",
                            fontWeight: 500,
                          }}
                        >
                          {item.departmentCode} - {item.deparmentName}
                        </TableCell>

                        <TableCell
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "14px",
                            fontWeight: 500,
                          }}
                        >
                          {item.unitCode} - {item.unitName}
                        </TableCell>

                        <TableCell
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "14px",
                            fontWeight: 500,
                          }}
                        >
                          {item.subUnitCode} - {item.subUnitName}
                        </TableCell>

                        <TableCell
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "14px",
                            fontWeight: 500,
                          }}
                        >
                          {item.locationCode} - {item.locationName}
                        </TableCell>
                      </TableRow>
                    ))}

                  {isError && (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        <img src={somethingWentWrong} alt="Something Went Wrong" className="something-went-wrong-table" />
                        <Typography variant="h5" color="#EDF2F7" marginLeft={2}>
                          Something went wrong.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}

                  {(isLoading || isFetching) && (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        <CircularProgress />
                        <Typography variant="h5" color="#EDF2F7">
                          Please wait...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}

                  {isSuccess && !data?.value?.onecharging?.length && !isLoading && !isFetching && (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
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
      </Stack>
    </Stack>
  );
};

export default OneCharging;
