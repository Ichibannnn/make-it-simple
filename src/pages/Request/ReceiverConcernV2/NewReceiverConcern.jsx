import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  IconButton,
  OutlinedInput,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  CalendarMonthOutlined,
  Check,
  FlashOn,
  LocalOffer,
  Search,
  SwapVertOutlined,
} from "@mui/icons-material";

import { useState } from "react";
import moment from "moment";

import { theme } from "../../../theme/theme";
import useDebounce from "../../../hooks/useDebounce";
import useDisclosure from "../../../hooks/useDisclosure";

import noRecordsFound from "../../../assets/svg/noRecordsFound.svg";
import somethingWentWrong from "../../../assets/svg/SomethingWentWrong.svg";

import { useLazyGetCategoryQuery } from "../../../features/api masterlist/category_api/categoryApi";
import {
  useGetReceiverConcernsQuery,
  useLazyGetFilteredDepartmentQuery,
  useLazyGetFilteredLocationQuery,
} from "../../../features/api_request/concerns_receiver/concernReceiverApi";

import ViewConcernDetails from "./ViewConcernDetails";
import ReceiverAddTicketDialog from "../ConcernTickets_Receiver/ReceiverAddTicketDialog";
import AssignTicketDrawer from "./AssignTicketDrawer";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";

const NewReceiverConcern = () => {
  const schema = yup.object().shape({
    CategoryId: yup.object().notRequired(),
    DepartmentId: yup.object().notRequired(),
    LocationId: yup.object().notRequired(),
  });

  const { control, watch } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      CategoryId: null,
      DepartmentId: null,
      LocationId: null,
    },
  });

  const [concernDetails, setConcernDetails] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [ascending, setAscending] = useState(true);
  const userId = useSelector((state) => state?.user?.id);
  const userChannelId = useSelector((state) => state?.user?.channels?.[0]?.channelId);

  const [searchValue, setSearchValue] = useState("");
  const search = useDebounce(searchValue, 500);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  // useSignalRConnection();
  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));

  const { data, isLoading, isFetching, isSuccess, isError } = useGetReceiverConcernsQuery({
    is_Approve: false,
    Search: search,
    PageNumber: pageNumber,
    PageSize: pageSize,
    CategoryId: watch("CategoryId")?.id,
    DepartmentId: watch("DepartmentId")?.id,
    LocationId: watch("LocationId")?.id,
    Ascending: ascending,
  });

  const [getCategory, { data: categoryData, isLoading: categoryIsLoading, isSuccess: categoryIsSuccess }] =
    useLazyGetCategoryQuery();
  const [
    getDepartment,
    { data: departmentData, isLoading: departmentIsLoading, isSuccess: departmentIsSuccess },
  ] = useLazyGetFilteredDepartmentQuery();
  const [getLocation, { data: locationData, isLoading: locationIsLoading, isSuccess: locationIsSuccess }] =
    useLazyGetFilteredLocationQuery();

  const {
    open: viewConcernDetailsOpen,
    onToggle: viewConcernDetailsOnToggle,
    onClose: viewConcernDetailsOnClose,
  } = useDisclosure();
  const { open: addTicketOpen, onClose: addTicketOnClose } = useDisclosure();
  const { open: takeTicketOpen, onToggle: takeTicketOnToggle, onClose: takeTicketOnClose } = useDisclosure();

  const onPageNumberChange = (_, page) => {
    setPageNumber(page + 1);
  };

  const onPageSizeChange = (e) => {
    setPageSize(e.target.value);
    setPageNumber(1);
  };

  const onViewAction = (data) => {
    setConcernDetails(data);
    viewConcernDetailsOnToggle();
  };

  const handleSelectTicket = (item) => {
    const concernAndTicketNo = {
      ticketConcernId: item?.ticketRequestConcerns[0]?.ticketConcernId,
      requestConcernId: item?.requestConcernId,
    };

    setSelectedIds((prevSelected) => {
      const exists = prevSelected.some(
        (id) =>
          id.ticketConcernId === concernAndTicketNo.ticketConcernId &&
          id.requestConcernId === concernAndTicketNo.requestConcernId,
      );

      if (exists) {
        return prevSelected.filter(
          (id) =>
            !(
              id.ticketConcernId === concernAndTicketNo.ticketConcernId &&
              id.requestConcernId === concernAndTicketNo.requestConcernId
            ),
        );
      } else {
        return [...prevSelected, concernAndTicketNo];
      }
    });
  };

  const isSelected = (item) =>
    selectedIds.some(
      (id) =>
        id.ticketConcernId === item?.ticketRequestConcerns[0]?.ticketConcernId &&
        id.requestConcernId === item?.requestConcernId,
    );

  const takeTicketHandler = () => {
    takeTicketOnToggle();
  };

  return (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: theme.palette.bgForm.black1,
        color: "#fff",
        padding: isScreenSmall ? "20px" : "7px 94px 34px 94px",
      }}
    >
      <Stack>
        <Stack
          width="100%"
          justifyContent="space-between"
          sx={{ flexDirection: isScreenSmall ? "column" : "row" }}
        >
          <Typography variant={isScreenSmall ? "h5" : "h4"}>Concerns</Typography>
          <Stack justifyItems="space-between" direction="row" marginTop={1}></Stack>
        </Stack>

        <Stack
          sx={{
            backgroundColor: theme.palette.bgForm.black3,
            borderRadius: "20px",
            marginTop: "10px",
            width: "100%",
          }}
        >
          {selectedIds.length > 0 && (
            <Stack
              direction={isScreenSmall ? "column" : "row"}
              alignItems={isScreenSmall ? "left" : "center"}
              justifyContent="space-between"
              gap={0.5}
              sx={{
                padding: "10px 20px",
                backgroundColor: theme.palette.bgForm.black2,
                borderRadius: "20px",
                marginBottom: 0.5,
                marginTop: 0.5,
              }}
            >
              <Stack direction="row" gap={0.5}>
                <LocalOffer />
                <Typography>
                  {selectedIds.length} {""}
                  {selectedIds.length > 1 ? "Tickets selected" : "Ticket selected"}
                </Typography>
              </Stack>

              <Stack direction="row" gap={0.5}>
                <Button variant="contained" color="success" onClick={takeTicketHandler} startIcon={<Check />}>
                  Take Ticket
                </Button>
              </Stack>
            </Stack>
          )}

          <Stack sx={{ width: "100%", padding: 3, gap: 1 }}>
            <Stack gap={1} sx={{ flexDirection: "row", width: "100%" }}>
              <OutlinedInput
                placeholder="Search"
                startAdornment={<Search sx={{ marginRight: 0.5, color: "#A0AEC0" }} />}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                sx={{
                  "& .MuiInputBase-input": { fontSize: "15px" },
                }}
                fullWidth
              />
            </Stack>

            <Stack gap={1} sx={{ flexDirection: isScreenSmall ? "column" : "row", width: "100%" }}>
              <Controller
                control={control}
                name="CategoryId"
                render={({ field: { ref, value, onChange } }) => {
                  return (
                    <Autocomplete
                      ref={ref}
                      value={value}
                      options={
                        categoryData?.value?.category?.filter((item) => item.channelId === userChannelId) ||
                        []
                      }
                      loading={categoryIsLoading}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Category"
                          sx={{ "& .MuiInputBase-input": { fontSize: "13px" } }}
                        />
                      )}
                      onOpen={() => {
                        if (!categoryIsSuccess)
                          getCategory({
                            Status: true,
                          });
                      }}
                      onChange={(_, value) => onChange(value)}
                      getOptionLabel={(option) => `${option.category_Description}`}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      sx={{
                        flex: 1,
                      }}
                      fullWidth
                    />
                  );
                }}
              />

              <Controller
                control={control}
                name="DepartmentId"
                render={({ field: { ref, value, onChange } }) => {
                  return (
                    <Autocomplete
                      ref={ref}
                      value={value}
                      options={departmentData?.value?.onecharging || []}
                      loading={departmentIsLoading}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Department"
                          sx={{ "& .MuiInputBase-input": { fontSize: "13px" } }}
                        />
                      )}
                      onOpen={() => {
                        if (!departmentIsSuccess)
                          getDepartment({
                            UserId: userId,
                          });
                      }}
                      onChange={(_, value) => onChange(value)}
                      getOptionLabel={(option) => `${option.departmentCode} - ${option.departmentName}`}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      sx={{
                        flex: 1,
                      }}
                      fullWidth
                    />
                  );
                }}
              />

              <Controller
                control={control}
                name="LocationId"
                render={({ field: { ref, value, onChange } }) => {
                  return (
                    <Autocomplete
                      ref={ref}
                      value={value}
                      options={locationData?.value?.onecharging || []}
                      loading={locationIsLoading}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Location"
                          sx={{ "& .MuiInputBase-input": { fontSize: "13px" } }}
                        />
                      )}
                      onOpen={() => {
                        if (!locationIsSuccess)
                          getLocation({
                            UserId: userId,
                          });
                      }}
                      onChange={(_, value) => onChange(value)}
                      getOptionLabel={(option) => `${option.locationCode} - ${option.locationName}`}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      sx={{
                        flex: 1,
                      }}
                      fullWidth
                    />
                  );
                }}
              />
            </Stack>
          </Stack>

          {isScreenSmall ? (
            // Cards
            <>
              <Stack spacing={2}>
                {isSuccess &&
                  !isLoading &&
                  !isFetching &&
                  data?.value?.requestConcern?.map((item, index) => {
                    return (
                      <Card
                        key={index}
                        sx={{
                          backgroundColor: isSelected ? "#1E2034" : theme.palette.bgForm.black3,
                          borderRadius: "15px",
                          borderColor: "#2D3748",
                        }}
                      >
                        <CardContent
                          sx={{
                            cursor: "pointer",
                            padding: "1px",
                            "&:hover": {
                              backgroundColor: "#1A222F",
                              color: "#9e77ed", // Change the text color when hovering
                            },
                          }}
                        >
                          <Stack
                            spacing={1}
                            direction="row"
                            sx={{
                              alignItems: "center",
                              padding: 2,
                            }}
                          >
                            <Stack>
                              <Checkbox
                                checked={isSelected(item)}
                                onChange={() => handleSelectTicket(item)}
                                inputProps={{
                                  "aria-label": `select ticket ${item?.ticketRequestConcerns[0]?.ticketConcernId}`,
                                }}
                              />
                            </Stack>

                            <Stack spacing={1} onClick={() => onViewAction(item)}>
                              <Stack mb={2}>
                                <Stack direction="row" gap={0.5} alignItems="center">
                                  <Typography sx={{ fontWeight: 500, fontSize: "17px", color: "#EDF2F7" }}>
                                    {item.fullName}
                                  </Typography>

                                  {item.severity === "Urgent" && <FlashOn color="warning" />}
                                </Stack>

                                <Typography
                                  sx={{
                                    fontWeight: 500,
                                    fontSize: "12px",
                                    color: theme.palette.text.secondary,
                                  }}
                                >
                                  {item.department_Code} - {item.department_Name}{" "}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontWeight: 500,
                                    fontSize: "12px",
                                    color: theme.palette.text.secondary,
                                  }}
                                >
                                  {item.location_Code} - {item.location_Name}
                                </Typography>
                              </Stack>

                              <Stack direction="row" gap={0.5} alignItems="center">
                                <Typography
                                  sx={{
                                    fontWeight: 700,
                                    fontSize: "0.775rem",
                                    lineHeight: 1.57,
                                    color: "#D65DB1",
                                  }}
                                >
                                  TICKET NUMBER:
                                </Typography>
                                <Typography
                                  sx={{
                                    fontWeight: 400,
                                    fontSize: "0.775rem",
                                    lineHeight: 1.57,
                                    color: theme.palette.text.main,
                                  }}
                                >
                                  {`${moment(item.created_At).format("YYYY")}-${item.ticketRequestConcerns[0]?.ticketConcernId}`}
                                </Typography>
                              </Stack>

                              <Stack direction="row">
                                <Typography
                                  sx={{
                                    fontWeight: 700,
                                    fontSize: "0.775rem",
                                    lineHeight: 1.57,
                                    color: "#D65DB1",
                                  }}
                                >
                                  CONCERN:{" "}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontWeight: 400,
                                    fontSize: "0.775rem",
                                    lineHeight: 1.57,
                                    color: theme.palette.text.main,
                                  }}
                                >
                                  {item.concern.split("\r\n").map((line, index) => (
                                    <span key={index}>
                                      {line}
                                      <br />
                                    </span>
                                  ))}
                                </Typography>
                              </Stack>

                              <Stack direction="row" gap={0.5} alignItems="center">
                                <Typography
                                  sx={{
                                    fontWeight: 700,
                                    fontSize: "0.775rem",
                                    lineHeight: 1.57,
                                    color: "#D65DB1",
                                  }}
                                >
                                  SERVICE PROVIDER:
                                </Typography>
                                <Typography
                                  sx={{
                                    fontWeight: 400,
                                    fontSize: "0.775rem",
                                    lineHeight: 1.57,
                                    color: theme.palette.text.main,
                                  }}
                                >
                                  {item.serviceProviderName}
                                </Typography>
                              </Stack>

                              <Stack direction="row" gap={0.5} alignItems="center">
                                <Typography
                                  sx={{
                                    fontWeight: 700,
                                    fontSize: "0.775rem",
                                    lineHeight: 1.57,
                                    color: "#D65DB1",
                                  }}
                                >
                                  CHANNEL:
                                </Typography>
                                <Typography
                                  sx={{
                                    fontWeight: 400,
                                    fontSize: "0.775rem",
                                    lineHeight: 1.57,
                                    color: theme.palette.text.main,
                                  }}
                                >
                                  {item.channel_Name ? item.channel_Name : "--"}
                                </Typography>
                              </Stack>

                              <Stack direction="row" gap={0.5} alignItems="center">
                                <Typography
                                  sx={{
                                    fontWeight: 700,
                                    fontSize: "0.775rem",
                                    lineHeight: 1.57,
                                    color: "#D65DB1",
                                  }}
                                >
                                  CATEGORY:
                                </Typography>
                                <Typography
                                  sx={{
                                    fontWeight: 400,
                                    fontSize: "0.775rem",
                                    lineHeight: 1.57,
                                    color: theme.palette.text.main,
                                  }}
                                >
                                  {item?.getRequestTicketCategories?.length !== 0
                                    ? item.getRequestTicketCategories
                                        ?.map((item) => item.category_Description)
                                        .join(", ")
                                    : "--"}
                                </Typography>
                              </Stack>

                              <Stack direction="row" gap={0.5} alignItems="center">
                                <Typography
                                  sx={{
                                    fontWeight: 700,
                                    fontSize: "0.775rem",
                                    lineHeight: 1.57,
                                    color: "#D65DB1",
                                  }}
                                >
                                  DATE CREATED:
                                </Typography>
                                <Chip
                                  variant="filled"
                                  size="30px"
                                  icon={<CalendarMonthOutlined fontSize="small" color="primary" />}
                                  sx={{
                                    fontSize: "12px",
                                    backgroundColor: "#1D1F3B",
                                    color: theme.palette.primary.main,
                                    fontWeight: 800,
                                  }}
                                  label={moment(item.created_At).format("LL")}
                                />
                              </Stack>

                              <Stack direction="row" gap={0.5} alignItems="center">
                                <Typography
                                  sx={{
                                    fontWeight: 700,
                                    fontSize: "0.775rem",
                                    lineHeight: 1.57,
                                    color: "#D65DB1",
                                  }}
                                >
                                  DATE NEEDED:
                                </Typography>
                                <Chip
                                  variant="filled"
                                  size="30px"
                                  icon={<CalendarMonthOutlined fontSize="small" color="primary" />}
                                  sx={{
                                    fontSize: "12px",
                                    backgroundColor: "#1D1F3B",
                                    color: theme.palette.primary.main,
                                    fontWeight: 800,
                                  }}
                                  label={moment(item.date_Needed).format("LL")}
                                />
                              </Stack>

                              <Stack direction="row" gap={0.5} alignItems="center">
                                <Typography
                                  sx={{
                                    fontWeight: 700,
                                    fontSize: "0.775rem",
                                    lineHeight: 1.57,
                                    color: "#D65DB1",
                                  }}
                                >
                                  CREATED BY:
                                </Typography>
                                <Typography
                                  sx={{
                                    fontWeight: 400,
                                    fontSize: "0.775rem",
                                    lineHeight: 1.57,
                                    color: theme.palette.text.main,
                                  }}
                                >
                                  {item.added_By}
                                </Typography>
                              </Stack>
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
                    );
                  })}

                {isError && (
                  <Stack justifyContent="center" alignItems="center" padding={4}>
                    <img
                      src={somethingWentWrong}
                      alt="Something Went Wrong"
                      className="something-went-wrong-table"
                    />
                    <Typography variant="h6" align="center">
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

                {isSuccess && !data?.value?.requestConcern.length && !isLoading && !isFetching && (
                  <Stack justifyContent="center" alignItems="center" padding={4}>
                    <img src={noRecordsFound} alt="No Records Found" className="norecords-found-table" />
                    <Typography variant="h6" align="center">
                      No records found.
                    </Typography>
                  </Stack>
                )}

                <TablePagination
                  sx={{
                    color: "#A0AEC0",
                    fontWeight: 400,
                    background: "#1C2536",
                    borderRadius: "0px 0px 20px 20px",
                  }}
                  rowsPerPageOptions={[100, 300, 500, { value: data?.value?.totalCount, label: "All" }]}
                  component="div"
                  count={data?.value?.totalCount || 0}
                  rowsPerPage={data?.value?.pageSize || 100}
                  page={data?.value?.currentPage - 1 || 0}
                  onPageChange={onPageNumberChange}
                  onRowsPerPageChange={onPageSizeChange}
                />
              </Stack>
            </>
          ) : (
            <>
              <TableContainer
                sx={{
                  overflow: "auto",
                }}
              >
                <Table stickyHeader size="small" sx={{ borderBottom: "none" }}>
                  <TableHead sx={{ whiteSpace: "nowrap" }}>
                    <TableRow>
                      <TableCell
                        sx={{
                          background: "#1C2536",
                          color: "#D65DB1",
                          fontWeight: 700,
                          fontSize: "11px",
                        }}
                        align="center"
                      >
                        TICKET NO.
                        <IconButton
                          size="small"
                          onClick={() => {
                            setAscending(!ascending);
                          }}
                        >
                          <SwapVertOutlined sx={{ color: "#D65DB1", fontSize: "25px" }} />
                        </IconButton>
                      </TableCell>

                      <TableCell
                        sx={{
                          background: "#1C2536",
                          color: "#D65DB1",
                          fontWeight: 700,
                          fontSize: "11px",
                        }}
                      >
                        REQUESTOR
                      </TableCell>

                      <TableCell
                        sx={{
                          background: "#1C2536",
                          color: "#D65DB1",
                          fontWeight: 700,
                          fontSize: "11px",
                        }}
                      >
                        CONCERN
                      </TableCell>

                      <TableCell
                        sx={{
                          background: "#1C2536",
                          color: "#D65DB1",
                          fontWeight: 700,
                          fontSize: "11px",
                        }}
                      >
                        SERVICE PROVIDER
                      </TableCell>

                      <TableCell
                        sx={{
                          background: "#1C2536",
                          color: "#D65DB1",
                          fontWeight: 700,
                          fontSize: "11px",
                        }}
                      >
                        CHANNEL
                      </TableCell>

                      <TableCell
                        sx={{
                          background: "#1C2536",
                          color: "#D65DB1",
                          fontWeight: 700,
                          fontSize: "11px",
                        }}
                      >
                        CATEGORY
                      </TableCell>

                      <TableCell
                        sx={{
                          background: "#1C2536",
                          color: "#D65DB1",
                          fontWeight: 700,
                          fontSize: "11px",
                        }}
                      >
                        DATE CREATED
                      </TableCell>

                      <TableCell
                        sx={{
                          background: "#1C2536",
                          color: "#D65DB1",
                          fontWeight: 700,
                          fontSize: "11px",
                        }}
                      >
                        DATE NEEDED
                      </TableCell>

                      <TableCell
                        sx={{
                          background: "#1C2536",
                          color: "#D65DB1",
                          fontWeight: 700,
                          fontSize: "11px",
                        }}
                      >
                        CREATED BY
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {isSuccess &&
                      !isLoading &&
                      !isFetching &&
                      data?.value?.requestConcern?.map((item) => {
                        return (
                          <TableRow
                            key={item.requestConcernId}
                            sx={{
                              backgroundColor: "transparent",
                            }}
                          >
                            <TableCell
                              sx={{
                                color: "#EDF2F7",
                                fontSize: "12px",
                                fontWeight: 500,
                                "&:hover": {
                                  background: "",
                                  color: "#EDF2F7",
                                },
                              }}
                              align="center"
                            >
                              <Stack sx={{ flexDirection: "row", alignItems: "center" }}>
                                <Stack>
                                  <Checkbox
                                    checked={isSelected(item)}
                                    onChange={() => handleSelectTicket(item)}
                                    inputProps={{
                                      "aria-label": `select ticket ${item?.ticketRequestConcerns[0]?.ticketConcernId}`,
                                    }}
                                  />
                                </Stack>
                                {item.severity === "Urgent" && <FlashOn color="warning" />}
                                <Typography
                                  sx={{ fontSize: "12px" }}
                                >{`${moment(item.created_At).format("YYYY")}-${item.ticketRequestConcerns[0]?.ticketConcernId}`}</Typography>
                              </Stack>
                            </TableCell>

                            <TableCell
                              sx={{
                                width: "200px",
                              }}
                              onClick={() => onViewAction(item)}
                            >
                              <Typography
                                sx={{
                                  color: "#EDF2F7",
                                  fontSize: "14px",
                                  fontWeight: 500,
                                }}
                              >
                                {item.fullName}
                              </Typography>
                              <Typography
                                sx={{
                                  color: theme.palette.text.secondary,
                                  fontSize: "12px",
                                  fontWeight: 500,
                                }}
                              >
                                {item.department_Code} - {item.department_Name}
                              </Typography>

                              <Typography
                                sx={{
                                  color: theme.palette.text.secondary,
                                  fontSize: "12px",
                                  fontWeight: 500,
                                }}
                              >
                                {item.location_Code} - {item.location_Name}
                              </Typography>
                            </TableCell>

                            <TableCell onClick={() => onViewAction(item)}>
                              <Stack sx={{ width: "200px" }}>
                                <Typography
                                  sx={{
                                    color: "#EDF2F7",
                                    fontSize: "12px",
                                    fontWeight: 500,
                                    wordBreak: "break-word",
                                  }}
                                >
                                  {item.concern
                                    ? item.concern?.split("\r\n").map((line, index) => (
                                        <span key={index}>
                                          {line}
                                          <br />
                                        </span>
                                      ))
                                    : "--"}
                                </Typography>
                              </Stack>
                            </TableCell>

                            <TableCell
                              sx={{
                                color: "#EDF2F7",
                                fontSize: "12px",
                                fontWeight: 500,
                                "&:hover": {
                                  background: "",
                                  color: "#EDF2F7",
                                },
                              }}
                              onClick={() => onViewAction(item)}
                            >
                              {item.serviceProviderName}
                            </TableCell>

                            <TableCell
                              sx={{
                                color: "#EDF2F7",
                                fontSize: "12px",
                                fontWeight: 500,
                                "&:hover": {
                                  background: "",
                                  color: "#EDF2F7",
                                },
                              }}
                              onClick={() => onViewAction(item)}
                            >
                              {item.channel_Name}
                            </TableCell>

                            <TableCell
                              sx={{
                                color: "#EDF2F7",
                                fontSize: "12px",
                                fontWeight: 500,
                                "&:hover": {
                                  background: "",
                                  color: "#EDF2F7",
                                },
                              }}
                              onClick={() => onViewAction(item)}
                            >
                              {item?.getRequestTicketCategories?.length !== 0
                                ? item.getRequestTicketCategories
                                    ?.map((item) => item.category_Description)
                                    .join(", ")
                                : "--"}
                            </TableCell>

                            <TableCell
                              sx={{
                                color: "#EDF2F7",
                                fontSize: "12px",
                                fontWeight: 500,
                                "&:hover": {
                                  background: "",
                                  color: "#EDF2F7",
                                },
                              }}
                              onClick={() => onViewAction(item)}
                            >
                              {moment(item.created_At).format("LL hh:mma")}
                            </TableCell>

                            <TableCell
                              sx={{
                                color: "#EDF2F7",
                                fontSize: "12px",
                                fontWeight: 500,
                                "&:hover": {
                                  background: "",
                                  color: "#EDF2F7",
                                },
                              }}
                              onClick={() => onViewAction(item)}
                            >
                              {moment(item.date_Needed).format("LL")}
                            </TableCell>

                            <TableCell
                              sx={{
                                color: "#EDF2F7",
                                fontSize: "12px",
                                fontWeight: 500,
                                "&:hover": {
                                  background: "",
                                  color: "#EDF2F7",
                                },
                              }}
                              onClick={() => onViewAction(item)}
                            >
                              {item.added_By}
                            </TableCell>
                          </TableRow>
                        );
                      })}

                    {isError && (
                      <TableRow>
                        <TableCell colSpan={12} align="center">
                          <img
                            src={somethingWentWrong}
                            alt="Something Went Wrong"
                            className="something-went-wrong-table"
                          />
                          <Typography variant="h5" color="#EDF2F7" marginLeft={2}>
                            Something went wrong.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}

                    {(isLoading || isFetching) && (
                      <TableRow>
                        <TableCell colSpan={12} align="center">
                          <CircularProgress />
                          <Typography variant="h5" color="#EDF2F7">
                            Please wait...
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}

                    {isSuccess && !data?.value?.requestConcern.length && !isLoading && !isFetching && (
                      <TableRow>
                        <TableCell colSpan={12} align="center">
                          <img
                            src={noRecordsFound}
                            alt="No Records Found"
                            className="norecords-found-table"
                          />
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
                sx={{
                  color: "#A0AEC0",
                  fontWeight: 400,
                  background: "#1C2536",
                  borderRadius: "0px 0px 20px 20px",
                }}
                rowsPerPageOptions={[100, 300, 500]}
                component="div"
                count={data?.value?.totalCount || 0}
                rowsPerPage={data?.value?.pageSize || 100}
                page={data?.value?.currentPage - 1 || 0}
                onPageChange={onPageNumberChange}
                onRowsPerPageChange={onPageSizeChange}
              />
            </>
          )}

          {viewConcernDetailsOpen && (
            <ViewConcernDetails
              data={concernDetails}
              setData={setConcernDetails}
              open={viewConcernDetailsOpen}
              onClose={viewConcernDetailsOnClose}
            />
          )}
          {addTicketOpen && <ReceiverAddTicketDialog open={addTicketOpen} onClose={addTicketOnClose} />}
          {takeTicketOpen && (
            <AssignTicketDrawer
              open={takeTicketOpen}
              onClose={takeTicketOnClose}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
            />
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default NewReceiverConcern;
