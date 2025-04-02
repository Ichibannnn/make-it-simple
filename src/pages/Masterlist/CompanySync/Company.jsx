import React, { useEffect, useState } from "react";
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
import { LoadingButton } from "@mui/lab";
import { theme } from "../../../theme/theme";
import { Toaster, toast } from "sonner";

import useDebounce from "../../../hooks/useDebounce";

import noRecordsFound from "../../../assets/svg/noRecordsFound.svg";
import somethingWentWrong from "../../../assets/svg/SomethingWentWrong.svg";

import { useGetCompanyQuery, useSyncCompanyMutation } from "../../../features/api masterlist/company/companyApi";
import { useLazyGetCompaniesQuery } from "../../../features/ymir/ymirApi";

const Company = () => {
  const [status, setStatus] = useState("true");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue, 500);

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  // const { toast } = useSweetAlert();

  const { data, isLoading, isFetching, isSuccess, isError } = useGetCompanyQuery({
    Status: status,
    Search: search,
    PageNumber: pageNumber,
    PageSize: pageSize,
  });

  const [getCompanies, { data: companyData, isLoading: isCompanyLoading, isFetching: isCompanyFetching, isSuccess: companyIsSuccess }] = useLazyGetCompaniesQuery();
  const [syncCompanies, { isLoading: isCompanySyncLoading, isFetching: isCompanySyncFetching }] = useSyncCompanyMutation();

  useEffect(() => {
    getCompanies();
  }, []);

  console.log("Company: ", companyData);

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

  const onSyncCompany = () => {
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
        getCompanies()
          .unwrap()
          .then(async (response) => {
            await syncCompanies(response)
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
      <Toaster richColors position="top-right" closeButton />
      <Stack>
        <Stack>
          <Stack width="100%" justifyContent="space-between" sx={{ flexDirection: isSmallScreen ? "column" : "row" }}>
            <Stack justifyItems="left">
              <Typography variant={isSmallScreen ? "h5" : "h4"}>Company</Typography>
            </Stack>

            <Stack justifyItems="space-between" direction="row" marginTop={1}>
              <LoadingButton
                variant="contained"
                size={isSmallScreen ? "medium" : "large"}
                color="primary"
                startIcon={<SyncOutlined />}
                loadingPosition="start"
                onClick={() => onSyncCompany()}
                loading={isCompanyLoading || isCompanyFetching || isCompanySyncLoading || isCompanySyncFetching}
                sx={{
                  ":disabled": {
                    backgroundColor: theme.palette.primary.main,
                    color: "black",
                  },
                }}
              >
                Sync Company
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
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ marginTop: "10px", padding: "20px" }} gap={4}>
          <OutlinedInput
            placeholder="Search company"
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
              data?.value?.company?.map((item, index) => (
                <Card key={item.id} sx={{ backgroundColor: theme.palette.bgForm.black3, borderRadius: "15px", borderColor: "#2D3748" }}>
                  <CardContent>
                    <Stack spacing={1}>
                      <Stack direction="row" gap={0.5} alignItems="center">
                        <Typography variant="body2" color="text.secondary">
                          LINE NO. {index + 1}
                        </Typography>
                      </Stack>

                      <Stack gap={0} sx={{ marginTop: 2 }}>
                        <Typography variant="body2" color="#D65DB1">
                          {item.company_Code} -
                        </Typography>
                        <Typography variant="h5" sx={{ color: "#EDF2F7" }}>
                          {item.company_Name}
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

            {isSuccess && !data?.value?.company.length && (
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
                      COMPANY CODE
                    </TableCell>
                    <TableCell
                      sx={{
                        background: "#1C2536",
                        color: "#D65DB1",
                        fontWeight: 700,
                        fontSize: "12px",
                      }}
                    >
                      COMPANY NAME
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {isSuccess &&
                    !isLoading &&
                    !isFetching &&
                    data?.value?.company?.map((item, index) => (
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
                          {item.company_Code}
                        </TableCell>

                        <TableCell
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "14px",
                            fontWeight: 500,
                          }}
                        >
                          {item.company_Name}
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

                  {isSuccess && !data?.value?.company.length && (
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
      </Stack>
    </Stack>
  );
};

export default Company;
