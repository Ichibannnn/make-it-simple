import React, { useState } from "react";
import {
  Box,
  Button,
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
  capitalize,
} from "@mui/material";
import {
  AddOutlined,
  FileUploadOutlined,
  FileDownloadOutlined,
  Search,
  SyncOutlined,
} from "@mui/icons-material";

import Swal from "sweetalert2";
import { LoadingButton } from "@mui/lab";
import useDebounce from "../../../hooks/useDebounce";
import useSweetAlert from "../../../hooks/useSweetAlert";
import { theme } from "../../../theme/theme";

import {
  useGetSubUnitQuery,
  useSyncSubUnitMutation,
} from "../../../features/sub-unit/subUnitApi";
import { useLazyGetSubUnitsQuery } from "../../../features/ymir/ymirApi";

const SubUnit = () => {
  const [status, setStatus] = useState("true");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue, 500);

  const { toast } = useSweetAlert();

  const { data, isLoading, isFetching, isSuccess, isError } =
    useGetSubUnitQuery({
      Status: status,
      Search: search,
      PageNumber: pageNumber,
      PageSize: pageSize,
    });

  const [
    getSubUnits,
    { isLoading: isSubUnitLoading, isFetching: isSubUnitFetching },
  ] = useLazyGetSubUnitsQuery();
  const [
    syncSubUnits,
    { isLoading: isSubUnitSyncLoading, isFetching: isSubUnitSyncFetching },
  ] = useSyncSubUnitMutation();

  const onPageNumberChange = (_, page) => {
    setPageNumber(page + 1);
  };

  const onPageSizeChange = (e) => {
    setPageSize(e.target.value);
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
              unit_Name: item.subUnit.name,
            }));

            syncSubUnits({
              syncSubUnitsResults: payload,
            })
              .unwrap()
              .then(() => {
                toast({
                  icon: "success",
                  title: "Success!",
                  text: "Sync data successfully!",
                  background: "#1d4b30",
                });
              })
              .catch(() => {
                toast({
                  icon: "error",
                  title: "Error!",
                  text: "Sub Unit sync failed!",
                });
              });
          })
          .catch(() => {
            toast({
              icon: "error",
              title: "Error!",
              text: "Sub Unit sync failed!",
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
        padding: "44px 94px 94px 94px",
      }}
    >
      <Stack>
        <Stack direction="row" justifyContent="space-between">
          <Stack>
            <Stack justifyItems="left">
              <Typography variant="h4">Sub Unit</Typography>
            </Stack>
            <Stack justifyItems="space-between" direction="row">
              <Button
                size="small"
                variant="text"
                startIcon={<FileUploadOutlined />}
              >
                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: "700",
                    color: theme.palette.text.secondary,
                  }}
                >
                  Import
                </Typography>
              </Button>

              <Button
                size="small"
                variant="text"
                startIcon={<FileDownloadOutlined />}
              >
                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: "700",
                    color: theme.palette.text.secondary,
                  }}
                >
                  Export
                </Typography>
              </Button>
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
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ marginTop: "10px", padding: "20px" }}
          gap={4}
        >
          <OutlinedInput
            flex="1"
            placeholder="Search sub unit"
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
            onClick={() => onSyncSubUnits()}
            loading={
              isSubUnitLoading ||
              isSubUnitFetching ||
              isSubUnitSyncLoading ||
              isSubUnitSyncFetching
            }
            sx={{
              ":disabled": {
                backgroundColor: theme.palette.primary.main,
                color: "black",
              },
            }}
          >
            Sync Sub Unit
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
                >
                  UNIT NAME
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
                    >
                      {item.unit_Name}
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

              {isSuccess && !data?.value?.subUnit.length && (
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
      </Stack>
    </Stack>
  );
};

export default SubUnit;
