import { Autocomplete, Divider, Stack, TextField, Typography } from "@mui/material";
import React, { useState } from "react";

import useDebounce from "../../hooks/useDebounce";
import { theme } from "../../theme/theme";
import { Toaster, toast } from "sonner";
import { IosShare } from "@mui/icons-material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import OpenTicketsHistory from "./OpenTicketsHistory";
import CloseTicketsHistory from "./CloseTicketsHistory";
import OnHoldTicketsHistory from "./OnHoldTicketsHistory";
import TransferredTicketsHistory from "./TransferredTicketsHistory";

import * as yup from "yup";
import moment from "moment";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";

import { useLazyGetUnitQuery } from "../../features/api masterlist/unit/unitApi";
import { useLazyGetUsersQuery } from "../../features/user_management_api/user/userApi";
import {
  useLazyGetDownloadClosedTicketsQuery,
  useLazyGetDownloadOnHoldTicketsQuery,
  useLazyGetDownloadOpenTicketsQuery,
  useLazyGetDownloadTransferredTicketsQuery,
} from "../../features/api_reports/reportsApi";

const schema = yup.object().shape({
  UnitId: yup.object().nullable(),
  UserId: yup.object().nullable(),
});

const ReportsPage = () => {
  const [reportNavigation, setReportNavigation] = useState(null);
  const [remarks, setRemarks] = useState(null);
  const [unit, setUnit] = useState(null);
  const [user, setUser] = useState(null);
  const [dateFrom, setDateFrom] = useState(new moment());
  const [dateTo, setDateTo] = useState(new moment());

  const [searchValue, setSearchValue] = useState(null);
  const search = useDebounce(searchValue, 500);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [isLoading, setIsLoading] = useState(false);

  const categoryOptions = ["Open Tickets", "Closed Tickets", "Transferred Tickets", "On-Hold Tickets"];
  const remarksOptions = ["On-Time Tickets", "Delayed Tickets"];

  const [getUnit, { data: unitData, isLoading: unitIsLoading, isSuccess: unitIsSuccess }] = useLazyGetUnitQuery();
  const [getUser, { data: userData, isLoading: userIsLoading, isSuccess: userIsSuccess }] = useLazyGetUsersQuery();

  const [getDownloadOpenTickets] = useLazyGetDownloadOpenTicketsQuery();
  const [getDownloadClosedTickets] = useLazyGetDownloadClosedTicketsQuery();
  const [getDownloadTransferredTickets] = useLazyGetDownloadTransferredTicketsQuery();
  const [getDownloadOnHoldTickets] = useLazyGetDownloadOnHoldTicketsQuery();

  const { control, setValue, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      UnitId: null,
      UserId: null,
    },
  });

  const handleExport = async () => {
    if (reportNavigation === "Open Tickets") {
      setIsLoading(true);
      try {
        const response = await getDownloadOpenTickets({
          Search: search,
          Unit: unit,
          UserId: user,
          Date_From: moment(dateFrom).format("YYYY-MM-DD"),
          Date_To: moment(dateTo).format("YYYY-MM-DD"),
        }).unwrap();

        console.log("Response: ", response);

        const url = window.URL.createObjectURL(new Blob([response]), { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Open_Tickets_Report.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
        setIsLoading(false);
      } catch (error) {
        console.log("Error", error);
      }
    } else if (reportNavigation === "Closed Tickets") {
      setIsLoading(true);
      try {
        const response = await getDownloadClosedTickets({
          Search: search,
          Unit: unit,
          UserId: user,
          Remarks: remarks,
          Date_From: moment(dateFrom).format("YYYY-MM-DD"),
          Date_To: moment(dateTo).format("YYYY-MM-DD"),
        }).unwrap();

        console.log("Response: ", response);

        const url = window.URL.createObjectURL(new Blob([response]), { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Closed_Tickets_Report.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
        setIsLoading(false);
      } catch (error) {
        console.log("Error", error);
      }
    } else if (reportNavigation === "Transferred Tickets") {
      setIsLoading(true);
      try {
        const response = await getDownloadTransferredTickets({
          Search: search,
          Unit: unit,
          UserId: user,
          Date_From: moment(dateFrom).format("YYYY-MM-DD"),
          Date_To: moment(dateTo).format("YYYY-MM-DD"),
        }).unwrap();

        console.log("Response: ", response);

        const url = window.URL.createObjectURL(new Blob([response]), { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Transferred_Tickets_Report.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
        setIsLoading(false);
      } catch (error) {
        console.log("Error", error);
      }
    } else if (reportNavigation === "On-Hold Tickets") {
      setIsLoading(true);
      try {
        const response = await getDownloadOnHoldTickets({
          Search: search,
          Unit: unit,
          UserId: user,
          Date_From: moment(dateFrom).format("YYYY-MM-DD"),
          Date_To: moment(dateTo).format("YYYY-MM-DD"),
        }).unwrap();

        console.log("Response: ", response);

        const url = window.URL.createObjectURL(new Blob([response]), { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "OnHold_Tickets_Report.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
        setIsLoading(false);
      } catch (error) {
        console.log("Error", error);
      }
    }
  };

  console.log("Unit: ", unitData);

  return (
    <Stack
      sx={{
        width: "100%",
        backgroundColor: theme.palette.bgForm.black1,
        color: "#fff",
        padding: "14px 44px 44px 44px",
      }}
    >
      <Toaster richColors position="top-right" />

      <Stack>
        <Stack direction="row" sx={{ width: "100%", justifyContent: "space-between" }}>
          <Stack direction="row" gap={0.5}>
            <Stack>
              <Typography variant="h4">Reports</Typography>
            </Stack>
          </Stack>

          <LoadingButton
            size="small"
            variant="contained"
            startIcon={<IosShare />}
            loading={isLoading}
            onClick={handleExport}
            sx={{
              ":disabled": {
                backgroundColor: theme.palette.secondary.main,
                color: "black",
              },
            }}
          >
            <Typography sx={{ fontSize: "12px" }}>Export</Typography>
          </LoadingButton>
        </Stack>

        <Stack sx={{ borderRadius: "20px", backgroundColor: theme.palette.bgForm.black3, marginTop: "10px", height: "730px" }}>
          <Stack direction="row" gap={1} padding={1}>
            <Stack>
              <Typography sx={{ fontSize: "13px" }}>Report Details:</Typography>
              <Autocomplete
                size="small"
                value={reportNavigation ?? ""}
                onChange={(_, newValue) => {
                  setReportNavigation(newValue);
                }}
                options={categoryOptions}
                renderInput={(params) => <TextField {...params} placeholder="Report Name" sx={{ "& .MuiInputBase-input": { fontSize: "13px" } }} />}
                disableClearable
                sx={{ width: 300 }}
                componentsProps={{
                  popper: {
                    sx: {
                      "& .MuiAutocomplete-listbox": {
                        fontSize: "13px",
                      },
                    },
                  },
                }}
              />
            </Stack>

            <Stack>
              <Typography sx={{ fontSize: "13px" }}>Unit:</Typography>
              <Controller
                control={control}
                name="UnitId"
                render={({ field: { ref, value, onChange } }) => {
                  return (
                    <Autocomplete
                      ref={ref}
                      size="small"
                      value={value || null}
                      options={unitData?.value?.unit || []}
                      loading={unitIsLoading}
                      renderInput={(params) => <TextField {...params} placeholder="Unit" sx={{ "& .MuiInputBase-input": { fontSize: "13px" } }} />}
                      onOpen={() => {
                        if (!unitIsSuccess) getUnit();
                      }}
                      onChange={(_, value) => {
                        console.log(value);
                        onChange(value);

                        setUnit(value?.id);
                        setValue("UserId", null);
                      }}
                      getOptionLabel={(option) => `${option.unit_Code} - ${option.unit_Name}`}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      sx={{ width: 300 }}
                      fullWidth
                      disablePortal
                      disableClearable
                      componentsProps={{
                        popper: {
                          sx: {
                            "& .MuiAutocomplete-listbox": {
                              fontSize: "13px",
                            },
                          },
                        },
                      }}
                    />
                  );
                }}
              />
            </Stack>

            <Stack>
              <Typography sx={{ fontSize: "13px" }}>Employee:</Typography>
              <Controller
                control={control}
                name="UserId"
                render={({ field: { ref, value, onChange } }) => {
                  return (
                    <Autocomplete
                      ref={ref}
                      size="small"
                      value={value || null}
                      options={userData?.value?.users.filter((item) => item.unitId === watch("UnitId")?.id) || []}
                      loading={userIsLoading}
                      renderInput={(params) => <TextField {...params} placeholder="Employee" sx={{ "& .MuiInputBase-input": { fontSize: "13px" } }} />}
                      onOpen={() => {
                        if (!userIsSuccess) getUser();
                      }}
                      onChange={(_, value) => {
                        // console.log(value);
                        onChange(value);

                        setUser(value?.id);
                      }}
                      getOptionLabel={(option) => console.log(option)}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      sx={{ width: 300 }}
                      fullWidth
                      disablePortal
                      disableClearable
                      componentsProps={{
                        popper: {
                          sx: {
                            "& .MuiAutocomplete-listbox": {
                              fontSize: "13px",
                            },
                          },
                        },
                      }}
                    />
                  );
                }}
              />
            </Stack>

            {reportNavigation === "Closed Tickets" ? (
              <Stack>
                <Typography sx={{ fontSize: "13px" }}>Remarks:</Typography>
                <Autocomplete
                  size="small"
                  value={remarks}
                  onChange={(_, newValue) => {
                    setRemarks(newValue);
                  }}
                  options={remarksOptions}
                  renderInput={(params) => <TextField {...params} placeholder="Select Remarks" sx={{ "& .MuiInputBase-input": { fontSize: "13px" } }} />}
                  disableClearable
                  sx={{ width: 200 }}
                  componentsProps={{
                    popper: {
                      sx: {
                        "& .MuiAutocomplete-listbox": {
                          fontSize: "13px",
                        },
                      },
                    },
                  }}
                />
              </Stack>
            ) : (
              ""
            )}

            <Stack>
              <Typography sx={{ fontSize: "13px" }}>Date From:</Typography>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  // label="Date From"
                  value={dateFrom}
                  maxDate={dateTo}
                  onChange={(newValue) => setDateFrom(newValue)}
                  sx={{ width: 200 }}
                  slotProps={{
                    textField: {
                      variant: "outlined",
                      sx: {
                        "& .MuiInputBase-input": {
                          padding: "8.5px 14px",
                        },
                        "& .MuiOutlinedInput-root": {
                          fontSize: "13px",
                        },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </Stack>

            <Stack>
              <Typography sx={{ fontSize: "13px" }}>Date To:</Typography>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  value={dateTo}
                  minDate={dateFrom}
                  onChange={(newValue) => setDateTo(newValue)}
                  sx={{ width: 200 }}
                  slotProps={{
                    textField: {
                      variant: "outlined",
                      sx: {
                        "& .MuiInputBase-input": {
                          padding: "8.5px 14px",
                        },
                        "& .MuiOutlinedInput-root": {
                          fontSize: "13px",
                        },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </Stack>
          </Stack>

          <Divider variant="fullWidth" sx={{ background: "#2D3748", marginTop: "1px" }} />

          <Stack>
            {reportNavigation === "Open Tickets" ? (
              <OpenTicketsHistory
                search={search}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                unit={unit}
                user={user}
                remarks={remarks}
                dateFrom={dateFrom}
                dateTo={dateTo}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                pageSize={pageSize}
                setPageSize={setPageSize}
              />
            ) : reportNavigation === "Closed Tickets" ? (
              <CloseTicketsHistory
                search={search}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                unit={unit}
                user={user}
                remarks={remarks}
                dateFrom={dateFrom}
                dateTo={dateTo}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                pageSize={pageSize}
                setPageSize={setPageSize}
              />
            ) : reportNavigation === "Transferred Tickets" ? (
              <TransferredTicketsHistory
                search={search}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                unit={unit}
                user={user}
                remarks={remarks}
                dateFrom={dateFrom}
                dateTo={dateTo}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                pageSize={pageSize}
                setPageSize={setPageSize}
              />
            ) : reportNavigation === "On-Hold Tickets" ? (
              <OnHoldTicketsHistory
                search={search}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                unit={unit}
                user={user}
                remarks={remarks}
                dateFrom={dateFrom}
                dateTo={dateTo}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                pageSize={pageSize}
                setPageSize={setPageSize}
              />
            ) : (
              ""
            )}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ReportsPage;
