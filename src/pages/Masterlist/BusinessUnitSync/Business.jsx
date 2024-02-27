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
import useDebounce from "../../../hooks/useDebounce";
import useDisclosure from "../../../hooks/useDisclosure";
import { theme } from "../../../theme/theme";

import {
  useGetBusinessUnitQuery,
  useSyncBusinessUnitMutation,
} from "../../../features/business-unit/businessUnitSlice";
import {
  getBusinessUnits,
  useLazyGetBusinessUnitsQuery,
} from "../../../features/ymir/ymirApi";
import { LoadingButton } from "@mui/lab";

const Business = () => {
  const [status, setStatus] = useState("true");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue, 500);

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

  // const onSyncCompany = () => {
  //   Swal.fire({
  //     title: "Confirmation?",
  //     text: "Are you sure you want to sync the company list?",
  //     icon: "info",
  //     color: "white",
  //     showCancelButton: true,
  //     background: "#111927",
  //     confirmButtonColor: "#9e77ed",
  //     cancelButtonColor: "#1C2536",
  //     heightAuto: false,
  //     width: "30em",
  //     customClass: {
  //       container: "custom-container",
  //       title: "custom-title",
  //       htmlContainer: "custom-text",
  //       icon: "custom-icon",
  //       confirmButton: "custom-confirm-btn",
  //       cancelButton: "custom-cancel-btn",
  //     },
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       getCompanies()
  //         .unwrap()
  //         .then((response) => {
  //           console.log("Response: ", response);

  //           const payload = response.map((item) => ({
  //             company_No: item.id,
  //             company_Code: item.code,
  //             company_Name: item.name,
  //           }));

  //           syncCompanies({
  //             companies: payload,
  //           })
  //             .unwrap()
  //             .then(() => {
  //               Swal.fire({
  //                 position: "top-end",
  //                 icon: "success",
  //                 title: "Sync company successfully!.",
  //                 showConfirmButton: false,
  //                 timer: 1500,
  //               });
  //             })
  //             .catch(() => {
  //               Swal.fire({
  //                 position: "top-end",
  //                 icon: "error",
  //                 title: "Company sync failed.",
  //                 showConfirmButton: false,
  //                 timer: 1500,
  //               });
  //             });
  //         })
  //         .catch(() => {
  //           Swal.fire({
  //             position: "top-end",
  //             icon: "error",
  //             title: "Company sync failed.",
  //             showConfirmButton: false,
  //             timer: 1500,
  //           });
  //         });
  //     }
  //   });
  // };

  return <div>Business</div>;
};

export default Business;
