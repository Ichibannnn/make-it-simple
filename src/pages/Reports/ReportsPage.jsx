import { Autocomplete, Divider, Grid, Stack, TextField, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";

import useDebounce from "../../hooks/useDebounce";
import { theme } from "../../theme/theme";
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

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import {
  useGetAllTicketsQuery,
  useLazyGetDownloadClosedTicketsQuery,
  useLazyGetDownloadOnHoldTicketsQuery,
  useLazyGetDownloadOpenTicketsQuery,
  useLazyGetDownloadTransferredTicketsQuery,
} from "../../features/api_reports/reportsApi";
import AllTicketsHistory from "./AllTicketsHistory";
import { useLazyGetServiceProviderQuery } from "../../features/api masterlist/service_provider/serviceProviderApi";
import { useSelector } from "react-redux";
import { useLazyGetChannelsQuery } from "../../features/api_channel_setup/channel/channelApi";

const schema = yup.object().shape({
  ServiceProvider: yup.object().nullable(),
  Channel: yup.object().nullable(),
  UnitId: yup.object().nullable(),
  UserId: yup.object().nullable(),
});

const ReportsPage = () => {
  const [reportNavigation, setReportNavigation] = useState(null);
  const [remarks, setRemarks] = useState(null);

  const [serviceProvider, setServiceProvider] = useState(null);
  const [channel, setChannel] = useState(null);

  const [user, setUser] = useState(null);
  const [dateFrom, setDateFrom] = useState(new moment());
  const [dateTo, setDateTo] = useState(new moment());

  const [searchValue, setSearchValue] = useState(null);
  const search = useDebounce(searchValue, 500);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  const [isLoading, setIsLoading] = useState(false);
  const [sheetData, setSheetData] = useState([]);

  const categoryOptions = ["All Tickets", "Open Tickets", "Closed Tickets", "Transferred Tickets", "On-Hold Tickets"];
  const remarksOptions = ["On-Time Tickets", "Delayed Tickets"];

  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));
  const userId = useSelector((state) => state?.user?.id);
  const userDetails = useSelector((state) => state?.user);

  // ALL TICKETS API ~~~~
  const {
    data: allTicketData,
    isLoading: allTicketIsLoading,
    isFetching: allTicketIsFetching,
    isSuccess: allTicketIsSuccess,
    isError: allTicketIsError,
  } = useGetAllTicketsQuery({
    Search: search,
    ServiceProvider: serviceProvider,
    Channel: channel,
    UserId: user,
    Date_From: moment(dateFrom).format("YYYY-MM-DD"),
    Date_To: moment(dateTo).format("YYYY-MM-DD"),
    PageNumber: pageNumber,
    PageSize: pageSize,
  });

  const [getServiceProvider, { data: serviceProviderData, isLoading: serviceProviderIsLoading, isSuccess: serviceProviderIsSuccess }] = useLazyGetServiceProviderQuery();
  const [getUser, { data: userData, isLoading: userIsLoading, isSuccess: userIsSuccess }] = useLazyGetChannelsQuery();

  const [getDownloadOpenTickets] = useLazyGetDownloadOpenTicketsQuery();
  const [getDownloadClosedTickets] = useLazyGetDownloadClosedTicketsQuery();
  const [getDownloadTransferredTickets] = useLazyGetDownloadTransferredTicketsQuery();
  const [getDownloadOnHoldTickets] = useLazyGetDownloadOnHoldTicketsQuery();

  const { control, setValue, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ServiceProvider: null,
      Channel: null,
      UserId: null,
    },
  });

  const handleExport = async () => {
    if (reportNavigation === "Open Tickets") {
      setIsLoading(true);
      try {
        const response = await getDownloadOpenTickets({
          Search: search,
          ServiceProvider: serviceProvider,
          Channel: channel,
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
          ServiceProvider: serviceProvider,
          Channel: channel,
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
          ServiceProvider: serviceProvider,
          Channel: channel,
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
          ServiceProvider: serviceProvider,
          Channel: channel,
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
    } else if (reportNavigation === "All Tickets") {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sheet1");

      worksheet.columns = [
        { header: "Ticket Number", key: "Ticket Number", width: 10 },
        { header: "Ticket Description", key: "Ticket Description", width: 20 },
        { header: "Category", key: "Category", width: 20 },
        { header: "Sub Category", key: "Sub Category", width: 20 },
        { header: "Service Provider", key: "Service Provider", width: 20 },
        { header: "Channel", key: "Channel", width: 20 },
        { header: "Start Date", key: "Start Date", width: 20 },
        { header: "Target Date", key: "Target Date", width: 20 },
        { header: "Requestor", key: "Requestor", width: 20 },
        { header: "Company", key: "Company", width: 20 },
        { header: "Business Unit", key: "Business Unit", width: 20 },
        { header: "Department", key: "Department", width: 20 },
        { header: "Unit", key: "Unit", width: 20 },
        { header: "Sub Unit", key: "Sub Unit", width: 20 },
        { header: "Location", key: "Location", width: 20 },
        { header: "Issue Handler", key: "Issue Handler", width: 20 },
        { header: "Status", key: "Status", width: 20 },
      ];

      worksheet.getRow(1).eachCell((cell, colNumber) => {
        console.log("Column Number: ", colNumber);

        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "967BB6" },
        };
        cell.font = { bold: true };
        cell.alignment = { vertical: "middle", horizontal: "center" };
      });

      sheetData.forEach((item) => {
        worksheet.addRow({
          "Ticket Number": item["Ticket Number"],
          "Ticket Description": item["Ticket Description"],
          Category: item.Category,
          "Sub Category": item["Sub Category"],
          "Service Provider": item["Service Provider"],
          Channel: item.Channel,
          "Start Date": item["Start Date"],
          "Target Date": item["Target Date"],
          Requestor: item.Requestor,
          Company: item.Company,
          "Business Unit": item["Business Unit"],
          Department: item.Department,
          Unit: item.Unit,
          "Sub Unit": item["Sub Unit"],
          Location: item.Location,
          "Issue Handler": item["Issue Handler"],
          Status: item.Status,
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(blob, "All_Tickets_History.xlsx");
    }
  };

  useEffect(() => {
    if (allTicketData) {
      setSheetData(
        allTicketData?.value?.reports?.map((item) => {
          return {
            "Ticket Number": item.ticketConcernId,
            "Ticket Description": item.concerns,
            Category: item.ticketCategoryDescriptions,
            "Sub Category": item.ticketSubCategoryDescriptions,
            "Service Provider": item.serviceProviderName,
            Channel: item.channel_Name,
            "Start Date": moment(item.startDate).format("MM/DD/YYYY"),
            "Target Date": moment(item.target_Date).format("MM/DD/YYYY"),
            Requestor: item.requestor_Name,
            Company: `${item.company_Code} - ${item.company_Name}`,
            "Business Unit": `${item.businessUnit_Code} - ${item.businessUnit_Name}`,
            Department: `${item.department_Code} - ${item.department_Name}`,
            Unit: `${item.unit_Code} - ${item.unit_Name}`,
            "Sub Unit": `${item.subUnit_Code} - ${item.subUnit_Name}`,
            Location: `${item.location_Code} - ${item.location_Name}`,
            "Issue Handler": item.personnel,
            Status: item.ticket_Status,
          };
        })
      );
    }
  }, [allTicketData]);

  useEffect(() => {
    if (userDetails) {
      setValue("ServiceProvider", {
        id: userDetails?.serviceProviders?.[0]?.id,
        serviceProviderName: userDetails?.serviceProviders?.[0]?.serviceProviderName,
      });

      setValue("Channel", {
        channelId: userDetails?.channels?.[0]?.channelId,
        channelName: userDetails?.channels?.[0]?.channelName,
      });

      setServiceProvider(userDetails?.serviceProviders?.[0]?.id);
      setChannel(userDetails?.channels?.[0]?.channelId);
    } else {
      setValue("ServiceProvider", null);
      setValue("ChannelId", null);
      setServiceProvider(null);
      setChannel(null);
    }
  }, [userDetails]);

  console.log("channel_state: ", channel);

  return (
    <Stack
      sx={{
        width: "100%",
        backgroundColor: theme.palette.bgForm.black1,
        color: "#fff",
        padding: "1px 24px 24px 24px",
      }}
    >
      <Stack>
        <Stack direction="row" sx={{ width: "100%", justifyContent: "space-between" }}>
          <Stack direction="row" gap={0.5}>
            <Stack>
              <Typography variant={isScreenSmall ? "h5" : "h4"}>Reports</Typography>
            </Stack>
          </Stack>

          <LoadingButton
            size="small"
            variant="contained"
            startIcon={<IosShare />}
            loading={isLoading}
            onClick={handleExport}
            disabled={sheetData?.length === 0 || reportNavigation === null}
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

        <Stack sx={{ borderRadius: "20px", backgroundColor: theme.palette.bgForm.black3, marginTop: "5px", minHeight: "730px" }}>
          <Grid container spacing={2} padding={2}>
            {/* Report Details */}
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Typography sx={{ fontSize: "13px" }}>Report Details:</Typography>
              <Autocomplete
                size="small"
                value={reportNavigation}
                options={categoryOptions || []}
                renderInput={(params) => <TextField {...params} placeholder="Report Name" sx={{ "& .MuiInputBase-input": { fontSize: "13px" } }} />}
                onChange={(_, newValue) => setReportNavigation(newValue)}
                disableClearable
                sx={{ width: "100%" }}
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
            </Grid>

            {/* Service Provider */}
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Typography sx={{ fontSize: "13px" }}>Service Provider:</Typography>
              <Controller
                control={control}
                name="ServiceProvider"
                render={({ field: { ref, value, onChange } }) => (
                  <Autocomplete
                    ref={ref}
                    size="small"
                    value={value || null}
                    options={userDetails ? userDetails?.serviceProviders : serviceProviderData?.value?.serviceProvider || []}
                    loading={serviceProviderIsLoading}
                    renderInput={(params) => <TextField {...params} placeholder="Service Provider" sx={{ "& .MuiInputBase-input": { fontSize: "13px" } }} />}
                    onOpen={() => {
                      if (!serviceProviderIsSuccess)
                        getServiceProvider({
                          Status: true,
                        });
                    }}
                    onChange={(_, value) => {
                      onChange(value);

                      setServiceProvider(value?.id);
                      setValue("UserId", null);
                    }}
                    getOptionLabel={(option) => option.serviceProviderName}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    sx={{ width: "100%" }}
                    fullWidth
                    disablePortal
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
                )}
              />
            </Grid>

            {/* Channel */}
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Typography sx={{ fontSize: "13px" }}>Channel:</Typography>
              <Controller
                control={control}
                name="Channel"
                render={({ field: { ref, value, onChange } }) => (
                  <Autocomplete
                    ref={ref}
                    size="small"
                    value={value || null}
                    options={userDetails ? userDetails?.channels : watch("ServiceProvider")?.serviceChannel || []}
                    renderInput={(params) => <TextField {...params} placeholder="Select Channel" sx={{ "& .MuiInputBase-input": { fontSize: "13px" } }} />}
                    onChange={(_, value) => {
                      onChange(value);

                      setChannel(value?.channelId);
                      setValue("UserId", null);
                    }}
                    getOptionLabel={(option) => option.channelName}
                    isOptionEqualToValue={(option, value) => option.channelId === value.channelId}
                    sx={{ width: "100%" }}
                    fullWidth
                    disablePortal
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
                )}
              />
            </Grid>

            {/* Employee */}
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Typography sx={{ fontSize: "13px" }}>Issue Handler:</Typography>
              <Controller
                control={control}
                name="UserId"
                render={({ field: { ref, value, onChange } }) => (
                  <Autocomplete
                    ref={ref}
                    size="small"
                    value={value || null}
                    options={userData?.value?.channel.find((item) => item.id === watch("Channel")?.channelId)?.channelUsers || []}
                    loading={userIsLoading}
                    renderInput={(params) => <TextField {...params} placeholder="Employee (Please select Channel)" sx={{ "& .MuiInputBase-input": { fontSize: "13px" } }} />}
                    onOpen={() => {
                      if (!userIsSuccess) getUser();
                    }}
                    onChange={(_, value) => {
                      onChange(value);
                      setUser(value?.userId);
                    }}
                    getOptionLabel={(option) => `${option.fullname}`}
                    isOptionEqualToValue={(option, value) => option.userId === value.userId}
                    sx={{ width: "100%" }}
                    fullWidth
                    disabled={!watch("Channel")}
                    disablePortal
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
                )}
              />
            </Grid>

            {/* Remarks (conditionally rendered) */}
            {reportNavigation === "Closed Tickets" && (
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Typography sx={{ fontSize: "13px" }}>Remarks:</Typography>
                <Autocomplete
                  size="small"
                  value={remarks}
                  onChange={(_, newValue) => setRemarks(newValue)}
                  options={remarksOptions}
                  renderInput={(params) => <TextField {...params} placeholder="Select Remarks" sx={{ "& .MuiInputBase-input": { fontSize: "13px" } }} />}
                  disableClearable
                  sx={{ width: "100%" }}
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
              </Grid>
            )}

            {/* Date From */}
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Typography sx={{ fontSize: "13px" }}>Date From:</Typography>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  value={dateFrom}
                  maxDate={dateTo}
                  onChange={(newValue) => setDateFrom(newValue)}
                  sx={{ width: "100%" }}
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
                        width: "100%",
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            {/* Date To */}
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Typography sx={{ fontSize: "13px" }}>Date To:</Typography>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  value={dateTo}
                  minDate={dateFrom}
                  onChange={(newValue) => setDateTo(newValue)}
                  sx={{ width: "100%" }}
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
                        width: "100%",
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>

          <Divider variant="fullWidth" sx={{ background: "#2D3748", marginTop: "1px" }} />

          <Stack>
            {reportNavigation === "All Tickets" ? (
              <AllTicketsHistory
                data={allTicketData}
                isLoading={allTicketIsLoading}
                isFetching={allTicketIsFetching}
                isSuccess={allTicketIsSuccess}
                isError={allTicketIsError}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
              />
            ) : reportNavigation === "Open Tickets" ? (
              <OpenTicketsHistory
                search={search}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                serviceProvider={serviceProvider}
                channel={channel}
                user={user}
                dateFrom={dateFrom}
                dateTo={dateTo}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                pageSize={pageSize}
                setPageSize={setPageSize}
                setSheetData={setSheetData}
              />
            ) : reportNavigation === "Closed Tickets" ? (
              <CloseTicketsHistory
                search={search}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                serviceProvider={serviceProvider}
                channel={channel}
                user={user}
                remarks={remarks}
                dateFrom={dateFrom}
                dateTo={dateTo}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                pageSize={pageSize}
                setPageSize={setPageSize}
                setSheetData={setSheetData}
              />
            ) : reportNavigation === "Transferred Tickets" ? (
              <TransferredTicketsHistory
                search={search}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                serviceProvider={serviceProvider}
                channel={channel}
                user={user}
                remarks={remarks}
                dateFrom={dateFrom}
                dateTo={dateTo}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                pageSize={pageSize}
                setPageSize={setPageSize}
                setSheetData={setSheetData}
              />
            ) : reportNavigation === "On-Hold Tickets" ? (
              <OnHoldTicketsHistory
                search={search}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                serviceProvider={serviceProvider}
                channel={channel}
                user={user}
                remarks={remarks}
                dateFrom={dateFrom}
                dateTo={dateTo}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                pageSize={pageSize}
                setPageSize={setPageSize}
                setSheetData={setSheetData}
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
