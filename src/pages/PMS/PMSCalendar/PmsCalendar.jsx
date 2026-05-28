import {
  Box,
  Button,
  Chip,
  MenuItem,
  OutlinedInput,
  Select,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  AccessTime,
  AccessTimeOutlined,
  Add,
  CheckCircle,
  EventOutlined,
  FileUploadOutlined,
  NotificationsOutlined,
  Search,
} from "@mui/icons-material";

import { useEffect, useState } from "react";
import { theme } from "../../../theme/theme";
import { global } from "../../../styles/global";
import { pmsStyles } from "../styles/pmsStyles";

import moment from "moment";
import useDisclosure from "../../../hooks/useDisclosure";
import noStore from "../../../assets/svg/noLocation.svg";

import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "react-big-calendar/lib/css/react-big-calendar.css";

import PmsDetailDialog from "./PmsDetailDialog";
import PmsAddSchedule from "./PmsAddSchedule";
import PmsUploadSchedule from "./PmsUploadSchedule";

import { usePmsReminderParams } from "../../../hooks/api_params/pms/usePmsReminderParams";
import { useGetPmsReminderQuery } from "../../../features/api_pms/pms_reminder/pmsReminderApi";

const arrayStatus = ["All Status", "Pending", "Done", "Delayed"];
const arrayTimePeriod = ["All", "Today", "This Week", "Delayed"];

const PmsCalendar = ({ data, isLoading, isFetching, isSuccess }) => {
  const [getDate, setGetDate] = useState("");

  const { params: pmsReminderParams, setStatus, setTimePeriod } = usePmsReminderParams();
  const { Status, TimePeriod } = pmsReminderParams;

  const {
    data: pmsReminderData,
    isLoading: pmsReminderIsLoading,
    isFetching: pmsReminderIsFetching,
    isSuccess: pmsReminderIsSuccess,
    isError: pmsReminderIsError,
  } = useGetPmsReminderQuery(pmsReminderParams);

  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));
  const { open: viewOpen, onToggle: viewOnToggle, onClose: viewOnClose } = useDisclosure();
  const {
    open: openAddSchedule,
    onToggle: onToggleAddSchedule,
    onClose: onCloseAddSchedule,
  } = useDisclosure();
  const {
    open: openUploadSchedule,
    onToggle: onToggleUploadSchedule,
    onClose: onCloseUploadSchedule,
  } = useDisclosure();

  const onShowScheduleDetails = (data) => {
    if (data) {
      setGetDate(data);
      viewOnToggle();
    }
  };

  const onOpenAddScheduleAction = () => {
    onToggleAddSchedule();
  };

  const onOpenUploadScheduleAction = () => {
    onToggleUploadSchedule();
  };

  useEffect(() => {
    setStatus(arrayStatus?.[0]);
    setTimePeriod(arrayTimePeriod?.[0]);
  }, []);

  return (
    <Stack sx={pmsStyles.parentContainer}>
      <Stack sx={pmsStyles.calendarContainer}>
        {/* PMS Calendar */}
        <Stack sx={pmsStyles.calendarHeader}>
          <Stack>
            {/* <OutlinedInput
              // value={searchValue}
              // onChange={(e) => dispatch(setSearchValue(e.target.value))}
              size="small"
              placeholder="Search store..."
              startAdornment={<Search sx={global.searchIcon} />}
              sx={pmsStyles.customSearch}
            /> */}
          </Stack>

          <Stack sx={pmsStyles.calendarButtonContainer}>
            <Button
              variant="contained"
              color="primary"
              size={isScreenSmall ? "small" : "medium"}
              startIcon={<Add />}
              onClick={onOpenAddScheduleAction}
              sx={pmsStyles.calendarHeaderButton}
            >
              Add Schedule
            </Button>

            <Button
              variant="outlined"
              size={isScreenSmall ? "small" : "medium"}
              startIcon={<FileUploadOutlined />}
              onClick={onOpenUploadScheduleAction}
              sx={pmsStyles.calendarHeaderButton}
            >
              Upload Schedule
            </Button>
          </Stack>
        </Stack>

        <Stack sx={{ width: "100%", height: "100%" }}>
          {isLoading || isFetching ? (
            <CalendarSkeleton />
          ) : (
            <FullCalendar
              height={isScreenSmall ? "64vh" : "100%"}
              plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
              initialView="dayGridMonth"
              dateClick={(data) => onShowScheduleDetails(data.dateStr)}
              dayMaxEvents={2}
              headerToolbar={{
                right: "prev,today,next",
                left: "title",
                // center: "title",
                // left: "today,dayGridMonth,dayGridWeek,dayGridDay,listWeek",
              }}
              events={data?.value?.pms?.map((item) => {
                return {
                  title: `(${item.name})`,
                  start: `${moment(item.date).format("YYYY-MM-DD")}`,

                  backgroundColor: item?.status === "Done" ? "#09DF72" : "#FF8914",
                  borderColor: "transparent",
                };
              })}
              eventContent={(eventInfo) => (
                <Typography sx={pmsStyles.calendarTitle}>{eventInfo.event.title}</Typography>
              )}
              moreLinkContent={(args) => (
                <Typography sx={pmsStyles.calendarLinkContent}>+{args.num} more</Typography>
              )}
            />
          )}

          {/* <CalendarSkeleton /> */}
        </Stack>
      </Stack>

      {/* PMS Reminder */}
      <Stack sx={pmsStyles.reminderContainer}>
        <Stack sx={pmsStyles.reminderTitle}>
          <NotificationsOutlined />
          <Typography>PMS Reminder</Typography>
        </Stack>

        <Stack sx={pmsStyles.reminderDropdownContainer}>
          <Box>
            <Typography sx={pmsStyles.reminderDropdownTitles}>Filter by Status:</Typography>
            <Select
              value={Status || ""}
              size="small"
              sx={pmsStyles.reminderDropdowns}
              onChange={(e) => setStatus(e.target.value)}
            >
              {arrayStatus?.map((item, i) => (
                <MenuItem key={i} value={item} sx={pmsStyles.reminderMenuItems}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box mt={2}>
            <Typography sx={pmsStyles.reminderDropdownTitles}>Time Period:</Typography>
            <Select
              value={TimePeriod || ""}
              size="small"
              sx={pmsStyles.reminderDropdowns}
              onChange={(e) => setTimePeriod(e.target.value)}
            >
              {arrayTimePeriod?.map((item, i) => (
                <MenuItem key={i} value={item} sx={pmsStyles.reminderMenuItems}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Stack>

        <Stack mt={3}>
          {pmsReminderData?.value?.pms?.length ? (
            <Stack>
              <Typography
                sx={pmsStyles.reminderDropdownTitles}
              >{`${pmsReminderData?.value?.pms.length} store(s) found:`}</Typography>
            </Stack>
          ) : (
            ""
          )}

          <Stack gap={1} sx={pmsStyles.reminderStoresContainer}>
            {pmsReminderIsSuccess &&
              !pmsReminderIsLoading &&
              !pmsReminderIsFetching &&
              pmsReminderData?.value?.pms?.map((item, i) => (
                <Stack direction="row">
                  <Stack
                    sx={{
                      ...pmsStyles.stackIndicator,
                      backgroundColor:
                        item.status == "Done" ? theme.palette.success.main : theme.palette.warning.main,
                    }}
                  />
                  <Stack key={i} sx={pmsStyles.reminderStackContent}>
                    <Stack>
                      <Chip
                        icon={
                          item.status === "Done" ? (
                            <CheckCircle sx={pmsStyles.chipIconStyle} />
                          ) : (
                            <AccessTime sx={pmsStyles.chipIconStyle} />
                          )
                        }
                        variant="filled"
                        label={item.status === "Done" ? "Done" : "Pending"}
                        sx={{
                          ...pmsStyles.chipStyle,
                          backgroundColor:
                            item.status === "Done" ? theme.palette.success.main : theme.palette.warning.main,
                        }}
                      />

                      <Typography sx={pmsStyles.reminderStoreHeader}>{item?.name}</Typography>
                    </Stack>

                    <Stack sx={pmsStyles.reminderDetailsContainer}>
                      <Stack sx={pmsStyles.reminderDetailsContent}>
                        <EventOutlined sx={pmsStyles.reminderCalendarIcon} />
                        <Typography sx={pmsStyles.reminderContentTexts}>
                          {moment(item.date).format("LL")}
                        </Typography>
                      </Stack>

                      <Typography sx={pmsStyles.reminderContentTexts}>{item.area}</Typography>
                      <Typography
                        sx={pmsStyles.reminderContentTexts}
                      >{`${item.completion} PMS Completed`}</Typography>
                    </Stack>
                  </Stack>
                </Stack>
              ))}

            {(pmsReminderIsLoading || pmsReminderIsFetching) && (
              <Stack sx={{ ...pmsStyles.reminderSkeletonContainer }}>
                <Skeleton animation="wave" variant="rectangular" width="100%" height="100%" />
              </Stack>
            )}

            {pmsReminderIsSuccess &&
              !pmsReminderData?.value?.pms?.length &&
              !pmsReminderIsLoading &&
              !pmsReminderIsFetching && (
                <Stack spacing={1} sx={pmsStyles.reminderNoStoreContainer}>
                  <img src={noStore} alt="No Store Found" className="norecords-found-table" />
                  <Typography color="gray" align="center">
                    No store found.
                  </Typography>
                </Stack>
              )}
          </Stack>
        </Stack>
      </Stack>

      <PmsAddSchedule openAddSchedule={openAddSchedule} onCloseAddSchedule={onCloseAddSchedule} />
      <PmsUploadSchedule
        openUploadSchedule={openUploadSchedule}
        onCloseUploadSchedule={onCloseUploadSchedule}
      />
      <PmsDetailDialog
        data={data}
        getDate={getDate}
        setGetDate={setGetDate}
        open={viewOpen}
        onClose={viewOnClose}
      />
    </Stack>
  );
};

export default PmsCalendar;

const CalendarSkeleton = () => {
  return (
    <Stack sx={pmsStyles.skeletonContainer}>
      <Stack sx={pmsStyles.skeletonHeader}>
        <Skeleton animation="wave" variant="text" width={150} height={70} />
        <Skeleton animation="wave" variant="text" width={150} height={70} />
      </Stack>

      <Stack sx={pmsStyles.skeletonBody}>
        <Skeleton animation="wave" variant="rectangular" width="100%" height={550} />
      </Stack>
    </Stack>
  );
};
