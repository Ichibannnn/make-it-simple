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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { AddOutlined, Search } from "@mui/icons-material";

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { theme } from "../../../theme/theme";
import { Toaster, toast } from "sonner";

import noRecordsFound from "../../../assets/svg/noRecordsFound.svg";
import somethingWentWrong from "../../../assets/svg/SomethingWentWrong.svg";

import useDebounce from "../../../hooks/useDebounce";
import useDisclosure from "../../../hooks/useDisclosure";

import { CategoryDialog } from "./CategoryDialog";
import { CategoryActions } from "./CategoryActions";
import { CategorySubCat } from "./CategorySubCat";

import { useArchiveCategoryMutation, useGetCategoryQuery } from "../../../features/api masterlist/category_api/categoryApi";

const Category = () => {
  const theming = useTheme();
  const isMobile = useMediaQuery(theming.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [status, setStatus] = useState("true");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue, 500);

  const [editData, setEditData] = useState(null);

  const { open, onToggle, onClose } = useDisclosure();

  const { data, isLoading, isFetching, isSuccess, isError, refetch } = useGetCategoryQuery({
    Status: status,
    Search: search,
    PageNumber: pageNumber,
    PageSize: pageSize,
  });

  const [archiveCategory] = useArchiveCategoryMutation();

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
    refetch();
  };

  const onDialogClose = () => {
    setEditData(null);
    onClose();
  };

  const onArchiveAction = (data) => {
    if (data.isActive === true) {
      Swal.fire({
        title: "Are you sure?",
        text: "This will move the category to the archived tab.",
        icon: "warning",
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
          console.log("Data: ", data);

          archiveCategory(data.id)
            .unwrap()
            .then(() => {
              console.log("Data: ", data);
              toast.success("Success!", {
                description: "Category archived successfully!",
              });
            })
            .catch((error) => {
              toast.error("Error!", {
                description: error.data.error.message,
              });
            });
        }
      });
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "This will move the category to the active tab.",
        icon: "warning",
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
          archiveCategory(data.id)
            .unwrap()
            .then(() => {
              toast.success("Success!", {
                description: "Category restored successfully!",
              });
            })
            .catch((error) => {
              toast.error("Error!", {
                description: error.data.error.message,
              });
            });
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

  console.log("Data: ", data);

  return (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: theme.palette.bgForm.black1,
        color: "#fff",
        padding: isMobile ? "20px" : isTablet ? "30px 40px" : "44px 94px",
      }}
    >
      <Toaster richColors position="top-right" />
      <Stack>
        <Stack direction="row" justifyContent="space-between">
          <Stack>
            <Stack justifyItems="left">
              <Typography
                variant="h4"
                sx={{
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                }}
              >
                Category
              </Typography>
            </Stack>
            <Stack justifyItems="space-between" direction="row" marginTop={1}></Stack>
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
        <Stack direction="row" justifyContent="space-between">
          <Tabs
            value={status}
            onChange={onStatusChange}
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              ".MuiTab-root": {
                minWidth: isMobile ? "80px" : "120px",
                fontSize: { xs: "10px", sm: "12px", md: "14px" },
              },
              ".MuiTabs-scrollButtons": {
                color: "#fff",
                "&.Mui-disabled": {
                  opacity: 0.3,
                },
              },
            }}
          >
            <Tab
              value=""
              label="All"
              sx={{
                fontSize: "12px",
                fontWeight: 600,
              }}
            />
            <Tab
              value="true"
              label="Active"
              sx={{
                fontSize: "12px",
                fontWeight: 600,
              }}
            />
            <Tab
              value="false"
              label="Archived"
              sx={{
                fontSize: "12px",
                fontWeight: 600,
              }}
            />
          </Tabs>
        </Stack>

        <Divider variant="fullWidth" sx={{ background: "#2D3748", marginTop: "1px" }} />

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ marginTop: "10px", padding: "20px" }} gap={4}>
          <OutlinedInput
            flex="1"
            placeholder="Search category"
            startAdornment={<Search sx={{ marginRight: 0.5, color: "#A0AEC0" }} />}
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
          <Button variant="contained" size="large" color="primary" startIcon={<AddOutlined />} onClick={onToggle}>
            Add
          </Button>
        </Stack>

        <TableContainer
          component={Box}
          sx={{
            overflowX: { xs: "auto", md: "initial" },
            width: "100%",
          }}
        >
          <Table sx={{ borderBottom: "none", fontSize: { xs: "10px", sm: "12px", md: "14px" }, overflowX: { xs: "auto", md: "initial" }, width: "100%" }}>
            <TableHead>
              <TableRow sx={{ display: { xs: "block", md: "table-row" } }}>
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
                  CHANNEL NAME
                </TableCell>

                <TableCell
                  sx={{
                    background: "#1C2536",
                    color: "#D65DB1",
                    fontWeight: 700,
                    fontSize: "12px",
                  }}
                >
                  CATEGORY NAME
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
                  SUB CATEGORY
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
                  STATUS
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
                  ACTIONS
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isSuccess &&
                !isLoading &&
                !isFetching &&
                data?.value?.category?.map((item) => (
                  <TableRow key={item.id} sx={{ display: { xs: "block", md: "table-row" } }}>
                    <TableCell
                      sx={{
                        color: "#EDF2F7",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                      align="center"
                    >
                      {item.id}
                    </TableCell>

                    <TableCell
                      sx={{
                        color: "#EDF2F7",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      {item.channel_Name ? item.channel_Name : "-"}
                    </TableCell>

                    <TableCell
                      sx={{
                        color: "#EDF2F7",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      {item.category_Description}
                    </TableCell>

                    <TableCell
                      sx={{
                        color: "#EDF2F7",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                      align="center"
                    >
                      <CategorySubCat subCategories={item.subcategories} />
                    </TableCell>

                    <TableCell
                      sx={{
                        color: "#EDF2F7",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                      align="center"
                    >
                      <Chip
                        variant="filled"
                        size="30px"
                        sx={{
                          fontSize: "13px",
                          backgroundColor: item.is_Active ? "#112C32" : "#2D2823",
                          color: item.is_Active ? "#10B981" : "#D27D0E",
                          fontWeight: 800,
                        }}
                        label={item.is_Active ? "ACTIVE" : "INACTIVE"}
                      />
                    </TableCell>

                    <TableCell
                      sx={{
                        color: "#EDF2F7",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                      align="center"
                    >
                      <CategoryActions data={item} status={status} onArchive={onArchiveAction} onUpdate={onEditAction} />
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

              {isSuccess && !data?.value?.category.length && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <img src={noRecordsFound} alt="No Records Found" className="norecords-found-table" style={{ width: "100%", maxWidth: "300px" }} />
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

        <CategoryDialog data={editData} open={open} onClose={onDialogClose} />
      </Stack>
    </Stack>
  );
};

export default Category;
