import React, { useEffect, useState } from "react";
import {
  Button,
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
} from "@mui/material";
import {
  FileUploadOutlined,
  FileDownloadOutlined,
  Search,
  SyncOutlined,
} from "@mui/icons-material";

import Swal from "sweetalert2";
import { LoadingButton } from "@mui/lab";
import { theme } from "../../../theme/theme";
import { Toaster, toast } from "sonner";

import useDebounce from "../../../hooks/useDebounce";
import useDisclosure from "../../../hooks/useDisclosure";

import {
  useGetBusinessUnitQuery,
  useSyncBusinessUnitMutation,
} from "../../../features/api masterlist/business-unit/businessUnitApi";
import { useLazyGetBusinessUnitsQuery } from "../../../features/ymir/ymirApi";

import { BusinessErrorDialog } from "./BusinessErrorDialog";

const Business = () => {
  const [status, setStatus] = useState("true");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue, 500);
  const { open, onToggle, onClose } = useDisclosure();

  const { data, isLoading, isFetching, isSuccess, isError } =
    useGetBusinessUnitQuery({
      Status: status,
      Search: search,
      PageNumber: pageNumber,
      PageSize: pageSize,
    });

  const [
    getBusinessUnits,
    { isLoading: isBusinessUnitLoading, isFetching: isBusinessUnitFetching },
  ] = useLazyGetBusinessUnitsQuery();

  const [
    syncCompanies,
    {
      error: errorData,
      isLoading: isBusinessUnitSyncLoading,
      isFetching: isBusinessUnitSyncFetching,
    },
  ] = useSyncBusinessUnitMutation();

  const onPageNumberChange = (_, page) => {
    setPageNumber(page + 1);
  };

  const onPageSizeChange = (e) => {
    setPageSize(e.target.value);
  };

  const onSyncBusinessUnit = () => {
    Swal.fire({
      title: "Confirmation?",
      text: "Are you sure you want to sync the business list?",
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
        getBusinessUnits()
          .unwrap()
          .then((response) => {
            const payload = response.map((item) => ({
              business_No: item.id,
              business_Code: item.code,
              business_Name: item.name,
              company_Name: item.company.name,
            }));

            syncCompanies({
              businessUnit: payload,
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
              description: "Business unit sync failed",
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
    <Stack
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: theme.palette.bgForm.black1,
        color: "#fff",
        padding: "44px 94px 94px 94px",
      }}
    >
      <Toaster richColors position="top-right" closeButton />
      <Stack>
        <Stack direction="row" justifyContent="space-between">
          <Stack>
            <Stack justifyItems="left">
              <Typography variant="h4">Business Unit</Typography>
            </Stack>
            <Stack
              justifyItems="space-between"
              direction="row"
              marginTop={1}
            ></Stack>
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
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ marginTop: "10px", padding: "20px" }}
          gap={4}
        >
          <OutlinedInput
            flex="1"
            placeholder="Search business unit"
            startAdornment={
              <Search sx={{ marginRight: 0.5, color: "#A0AEC0" }} />
            }
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
          <LoadingButton
            variant="contained"
            size="large"
            color="primary"
            startIcon={<SyncOutlined />}
            loadingPosition="start"
            onClick={() => onSyncBusinessUnit()}
            loading={
              isBusinessUnitLoading ||
              isBusinessUnitFetching ||
              isBusinessUnitSyncLoading ||
              isBusinessUnitSyncFetching
            }
            sx={{
              ":disabled": {
                backgroundColor: theme.palette.primary.main,
                color: "black",
              },
            }}
          >
            Sync Business Unit
          </LoadingButton>
        </Stack>

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
                  COMPANY
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
                  BUSINESS UNIT CODE
                </TableCell>

                <TableCell
                  sx={{
                    background: "#1C2536",
                    color: "#D65DB1",
                    fontWeight: 700,
                    fontSize: "12px",
                  }}
                >
                  BUSINESS UNIT NAME
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isSuccess &&
                !isLoading &&
                !isFetching &&
                data?.value?.businessUnit?.map((item, index) => (
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
                      {item.companyId} - {item.company_Name}
                    </TableCell>

                    <TableCell
                      sx={{
                        color: "#EDF2F7",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                      align="center"
                    >
                      {item.business_Code}
                    </TableCell>

                    <TableCell
                      sx={{
                        color: "#EDF2F7",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      {item.business_Name}
                    </TableCell>
                  </TableRow>
                ))}

              {isError && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="h5" color="#EDF2F7">
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

              {isSuccess && !data?.value?.businessUnit.length && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="h5" color="#EDF2F7">
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

        <BusinessErrorDialog
          errorData={errorData}
          open={open}
          onClose={onClose}
        />
      </Stack>
    </Stack>
  );
};

export default Business;
