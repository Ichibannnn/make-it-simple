import {
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
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
} from "@mui/material";
import { AddOutlined, Search } from "@mui/icons-material";

import Swal from "sweetalert2";
import { toast } from "sonner";
import { theme } from "../../../theme/theme";
import { useEffect, useState } from "react";

import { pmsStyles } from "../styles/pmsStyles";
import useDebounce from "../../../hooks/useDebounce";
import useDisclosure from "../../../hooks/useDisclosure";

import PmsTableActions from "./PmsTableActions";
import PmsTableViewDialog from "./PmsTableViewDialog";
import { global } from "../../../styles/global";

const PmsTable = ({ data }) => {
  const [status, setStatus] = useState("true");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [editData, setEditData] = useState(null);

  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue, 500);

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { open: openView, onToggle: onViewToggle, onClose: onViewClose } = useDisclosure();

  const TABLE_HEAD = ["REGION", "AREA", "STORE", "NUMBER OF PMS", "STATUS", "ACTIONS"];

  // const { data, isLoading, isFetching, isSuccess, isError, refetch } = useGetSubCategoryQuery({
  //   Status: status,
  //   Search: search,
  //   PageNumber: pageNumber,
  //   PageSize: pageSize,
  // });

  const onPageNumberChange = (_, page) => {
    setPageNumber(page + 1);
  };

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
    onViewClose();
  };

  const onArchiveAction = (data) => {
    // if (data.isActive === true) {
    //   Swal.fire({
    //     title: "Are you sure?",
    //     text: "This will move the sub category to the archived tab.",
    //     icon: "warning",
    //     color: "white",
    //     showCancelButton: true,
    //     background: "#111927",
    //     confirmButtonColor: "#9e77ed",
    //     cancelButtonColor: "#1C2536",
    //     heightAuto: false,
    //     allowOutsideClick: false,
    //     width: "30em",
    //     customClass: {
    //       container: "custom-container",
    //       title: "custom-title",
    //       htmlContainer: "custom-text",
    //       icon: "custom-icon",
    //       confirmButton: "custom-confirm-btn",
    //       cancelButton: "custom-cancel-btn",
    //     },
    //     preConfirm: async () => {
    //       try {
    //         Swal.getConfirmButton().innerHTML = `
    //         <div class="mui-btn-content">
    //          <span class="mui-spinner"></span>
    //          <span class="mui-label">Archiving...</span>
    //         </div>
    //         `;
    //         Swal.getConfirmButton().disabled = true;
    //         await archiveSubCategory(data.id)
    //           .unwrap()
    //           .then(() => {
    //             toast.success("Success!", {
    //               description: "Sub Category archived successfully!",
    //             });
    //           })
    //           .catch((error) => {
    //             toast.error("Error!", {
    //               description: error.data.error.message,
    //             });
    //           });
    //         return true; // resolves success
    //       } catch (err) {
    //         console.log("Error", err);
    //         Swal.hideLoading();
    //         Swal.showValidationMessage(err?.data?.error?.message || "Something went wrong");
    //         return false; // keeps modal open
    //       }
    //     },
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       Swal.close();
    //     }
    //   });
    // } else {
    //   Swal.fire({
    //     title: "Are you sure?",
    //     text: "This will move the sub category to the active tab.",
    //     icon: "warning",
    //     color: "white",
    //     showCancelButton: true,
    //     background: "#111927",
    //     confirmButtonColor: "#9e77ed",
    //     cancelButtonColor: "#1C2536",
    //     heightAuto: false,
    //     allowOutsideClick: false,
    //     width: "30em",
    //     customClass: {
    //       container: "custom-container",
    //       title: "custom-title",
    //       htmlContainer: "custom-text",
    //       icon: "custom-icon",
    //       confirmButton: "custom-confirm-btn",
    //       cancelButton: "custom-cancel-btn",
    //     },
    //     preConfirm: async () => {
    //       try {
    //         Swal.getConfirmButton().innerHTML = `
    //         <div class="mui-btn-content">
    //           <span class="mui-spinner"></span>
    //           <span class="mui-label">Restoring...</span>
    //         </div>
    //         `;
    //         Swal.getConfirmButton().disabled = true;
    //         await archiveSubCategory(data.id)
    //           .unwrap()
    //           .then(() => {
    //             toast.success("Success!", {
    //               description: "Sub Category restored successfully!",
    //             });
    //           })
    //           .catch((error) => {
    //             toast.error("Error!", {
    //               description: error.data.error.message,
    //             });
    //           });
    //         return true;
    //       } catch (err) {
    //         console.log("Error", err);
    //         Swal.hideLoading();
    //         Swal.showValidationMessage(err?.data?.error?.message || "Something went wrong");
    //         return false;
    //       }
    //     },
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       Swal.close();
    //     }
    //   });
    // }
  };

  const onViewAction = () => {
    onViewToggle();
  };

  useEffect(() => {
    if (searchValue) {
      setPageNumber(1);
    }
  }, [searchValue]);

  // useEffect(() => {
  //   if (status) {
  //     refetch();
  //   }
  // }, [status]);

  return (
    <Stack>
      <Stack
        sx={{
          backgroundColor: theme.palette.bgForm.black3,
          borderRadius: "20px",
          marginTop: "20px",
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ marginTop: "10px", padding: "20px" }} gap={4}>
          <OutlinedInput
            value={searchValue}
            placeholder="Search forms by name and description..."
            startAdornment={<Search sx={global.searchIcon} />}
            onChange={(e) => setSearchValue(e.target.value)}
            sx={pmsStyles.tableSearch}
          />

          <Stack direction="row" gap={1} sx={{ width: isSmallScreen ? "100%" : "35%" }}>
            <FormControl fullWidth>
              <InputLabel sx={pmsStyles.inputLabel}>Select Region</InputLabel>
              <Select sx={pmsStyles.tableSelect} label="Select Region">
                <MenuItem value="Stores" sx={pmsStyles.menuItemsFont}>
                  Store
                </MenuItem>
                <MenuItem value="Head Office" sx={pmsStyles.menuItemsFont}>
                  Head Office
                </MenuItem>
                <MenuItem value="Farm" sx={pmsStyles.menuItemsFont}>
                  Farm
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel sx={pmsStyles.inputLabel}>Select Area</InputLabel>
              <Select sx={pmsStyles.tableSelect} label="Select Area">
                <MenuItem value="Stores" sx={pmsStyles.menuItemsFont}>
                  Store
                </MenuItem>
                <MenuItem value="Head Office" sx={pmsStyles.menuItemsFont}>
                  Head Office
                </MenuItem>
                <MenuItem value="Farm" sx={pmsStyles.menuItemsFont}>
                  Farm
                </MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>

        {isSmallScreen ? (
          // Card-Based Layout for Small Screens
          <Stack spacing={2}>
            {data?.map((item, index) => (
              <Card key={item.id} sx={{ backgroundColor: theme.palette.bgForm.black3, borderRadius: "15px", borderColor: "#2D3748" }}>
                <CardContent>
                  <Stack spacing={1}>
                    <Stack direction="row" gap={0.5} alignItems="center">
                      <Chip
                        label={item.status === "Done" ? "DONE" : "PENDING"}
                        size="small"
                        sx={{
                          fontSize: "10px",
                          backgroundColor: item.status === "Done" ? "#112C32" : "#2D2823",
                          borderRadius: "none",
                          color: item.status === "Done" ? "#10B981" : "#D27D0E",
                        }}
                      />
                    </Stack>

                    <Stack direction="row" gap={0.5} alignItems="center">
                      <Typography sx={{ fontWeight: 700, fontSize: "0.875rem", lineHeight: 1.57, color: "#D65DB1" }}>REGION:</Typography>
                      <Typography sx={{ fontWeight: 400, fontSize: "0.875rem", lineHeight: 1.57, color: theme.palette.text.main }}>Region A</Typography>
                    </Stack>

                    <Stack direction="row" gap={0.5} alignItems="center">
                      <Typography sx={{ fontWeight: 700, fontSize: "0.875rem", lineHeight: 1.57, color: "#D65DB1" }}>AREA:</Typography>
                      <Typography sx={{ fontWeight: 400, fontSize: "0.875rem", lineHeight: 1.57, color: theme.palette.text.main }}>Area 1</Typography>
                    </Stack>

                    <Stack direction="row" gap={0.5} alignItems="center">
                      <Typography sx={{ fontWeight: 700, fontSize: "0.875rem", lineHeight: 1.57, color: "#D65DB1" }}>STORE:</Typography>
                      <Typography sx={{ fontWeight: 400, fontSize: "0.875rem", lineHeight: 1.57, color: theme.palette.text.main }}>{item.store}</Typography>
                    </Stack>

                    <Stack direction="row" gap={0.5} alignItems="center">
                      <Typography sx={{ fontWeight: 700, fontSize: "0.875rem", lineHeight: 1.57, color: "#D65DB1" }}>NUMBER OF PMS:</Typography>
                      <Typography sx={{ fontWeight: 400, fontSize: "0.875rem", lineHeight: 1.57, color: theme.palette.primary.main }}>{item.completion}</Typography>
                    </Stack>

                    <Stack direction="row" gap={0.5} alignItems="center">
                      <Typography sx={{ fontWeight: 700, fontSize: "0.875rem", lineHeight: 1.57, color: "#D65DB1" }}>STATUS:</Typography>
                      <Typography sx={{ fontWeight: 400, fontSize: "0.875rem", lineHeight: 1.57, color: theme.palette.text.main }}>{item.status}</Typography>
                    </Stack>

                    <Stack direction="row" gap={0.5} alignItems="center">
                      <Typography sx={{ fontWeight: 700, fontSize: "0.875rem", lineHeight: 1.57, color: "#D65DB1" }}>ACTION:</Typography>
                      <PmsTableActions data={item} onView={onViewAction} />
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))}

            {/* {isError && (
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

            {isSuccess && !data?.value?.subCategory?.length && (
              <Stack justifyContent="center" alignItems="center" padding={4}>
                <img src={noRecordsFound} alt="No Records Found" className="norecords-found-table" />
                <Typography variant="h6" align="center">
                  No records found.
                </Typography>
              </Stack>
            )} */}

            {/* <TablePagination
              sx={{ color: "#A0AEC0", fontWeight: 400, background: "#1C2536", borderRadius: "0px 0px 20px 20px" }}
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={data?.value?.totalCount || 0}
              rowsPerPage={data?.value?.pageSize || 5}
              page={data?.value?.currentPage - 1 || 0}
              onPageChange={onPageNumberChange}
              onRowsPerPageChange={onPageSizeChange}
            /> */}
          </Stack>
        ) : (
          <>
            <TableContainer>
              <Table size="small" stickyHeader sx={{ borderBottom: "none" }}>
                <TableHead sx={{ whiteSpace: "nowrap" }}>
                  <TableRow>
                    {TABLE_HEAD?.map((header, index) => (
                      <TableCell key={index} sx={global.tableCelHeader}>
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {data?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell sx={global.tableCellBody}>Regiona A</TableCell>
                      <TableCell sx={global.tableCellBody}>Area 1</TableCell>
                      <TableCell sx={global.tableCellBody}>{item.store}</TableCell>
                      <TableCell
                        sx={{
                          color: theme.palette.primary.main,
                          fontSize: "14px",
                          fontWeight: 500,
                        }}
                      >
                        {item.completion}
                      </TableCell>
                      <TableCell sx={global.tableCellBody}>
                        <Chip
                          variant="filled"
                          size="30px"
                          sx={{
                            fontSize: "13px",
                            backgroundColor: item.status === "Done" ? "#112C32" : "#2D2823",
                            color: item.status === "Done" ? "#10B981" : "#D27D0E",
                            fontWeight: 800,
                          }}
                          label={item.status === "Done" ? "DONE" : "PENDING"}
                        />
                      </TableCell>
                      <TableCell sx={global.tableCellBody}>
                        <PmsTableActions data={item} onView={onViewAction} />
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* {isError && (
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

                  {isSuccess && !data?.length && !isLoading && !isFetching && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <img src={noRecordsFound} alt="No Records Found" className="norecords-found-table" />
                        <Typography variant="h5" color="#EDF2F7" marginLeft={2}>
                          No records found.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )} */}
                </TableBody>
              </Table>
            </TableContainer>

            {/* <TablePagination
              sx={{ color: "#A0AEC0", fontWeight: 400 }}
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={data?.length || 0}
              rowsPerPage={data?.value?.pageSize || 5}
              page={data?.value?.currentPage - 1 || 0}
              onPageChange={onPageNumberChange}
              onRowsPerPageChange={onPageSizeChange}
            /> */}
          </>
        )}

        <PmsTableViewDialog open={openView} onClose={onViewClose} />
      </Stack>
    </Stack>
  );
};

export default PmsTable;
