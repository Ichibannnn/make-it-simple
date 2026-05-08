import { Box, Button, MenuItem, Select, Skeleton, Stack, Typography, useMediaQuery } from "@mui/material";
import { AccessTimeOutlined, EventOutlined, FileUploadOutlined, NotificationsOutlined } from "@mui/icons-material";

import { useEffect, useState } from "react";
import { theme } from "../../../theme/theme";
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
  const { open: openAddSchedule, onToggle: onToggleAddSchedule, onClose: onCloseAddSchedule } = useDisclosure();
  const { open: openUploadSchedule, onToggle: onToggleUploadSchedule, onClose: onCloseUploadSchedule } = useDisclosure();

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

  // console.log("ReminderData: ", pmsReminderData);
  // console.log("ReminderParams: ", pmsReminderParams);

  return (
    <Stack sx={pmsStyles.parentContainer}>
      {/* PMS Calendar */}
      <Stack sx={pmsStyles.calendarContainer}>
        <Stack sx={pmsStyles.calendarHeader}>
          <Box />

          <Stack sx={pmsStyles.calendarButtonContainer}>
            <Button
              variant="contained"
              color="primary"
              size={isScreenSmall ? "small" : "medium"}
              startIcon={<AccessTimeOutlined />}
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

        <FullCalendar
          height={isScreenSmall ? "64vh" : "100%"}
          plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
          initialView="dayGridMonth"
          dateClick={(data) => onShowScheduleDetails(data.dateStr)}
          dayMaxEvents={2}
          headerToolbar={{
            right: "prev,next",
            center: "title",
            left: "today,dayGridMonth,dayGridWeek,dayGridDay,listWeek",
          }}
          events={data?.value?.pms?.map((item) => {
            return {
              title: `(${item.name})`,
              start: `${moment(item.date).format("YYYY-MM-DD")}`,

              backgroundColor: item?.status === "Done" ? "#09DF72" : "#FF8914",
              borderColor: "transparent",
            };
          })}
          eventContent={(eventInfo) => <Typography sx={pmsStyles.calendarTitle}>{eventInfo.event.title}</Typography>}
          moreLinkContent={(args) => <Typography sx={pmsStyles.calendarLinkContent}>+{args.num} more</Typography>}
        />
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
            <Select value={Status || ""} size="small" sx={pmsStyles.reminderDropdowns} onChange={(e) => setStatus(e.target.value)}>
              {arrayStatus?.map((item, i) => (
                <MenuItem key={i} value={item} sx={pmsStyles.reminderMenuItems}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box mt={2}>
            <Typography sx={pmsStyles.reminderDropdownTitles}>Time Period:</Typography>
            <Select value={TimePeriod || ""} size="small" sx={pmsStyles.reminderDropdowns} onChange={(e) => setTimePeriod(e.target.value)}>
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
              <Typography sx={pmsStyles.reminderDropdownTitles}>{`${pmsReminderData?.value?.pms.length} store(s) found:`}</Typography>
            </Stack>
          ) : (
            ""
          )}

          {/* {pmsReminderIsSuccess && !pmsReminderIsLoading && !pmsReminderIsFetching ? ( */}
          <Stack sx={pmsStyles.reminderStoresContainer}>
            {pmsReminderIsSuccess &&
              !pmsReminderIsLoading &&
              !pmsReminderIsFetching &&
              pmsReminderData?.value?.pms?.map((item, i) => (
                <Stack key={i} sx={pmsStyles.reminderStackContent}>
                  <Stack sx={pmsStyles.reminderStoreHeaderContainer}>
                    <Typography sx={pmsStyles.reminderStoreHeader}>{item?.name}</Typography>

                    <Typography sx={{ ...pmsStyles.reminderDropdownTitles, color: item?.status === "Done" ? "#09DF72" : "#FF8914" }}>{item?.status}</Typography>
                  </Stack>

                  <Stack sx={pmsStyles.reminderDetailsContainer}>
                    <Stack sx={pmsStyles.reminderDetailsContent}>
                      <EventOutlined sx={pmsStyles.reminderCalendarIcon} />
                      <Typography sx={pmsStyles.reminderContentTexts}>{moment(item.date).format("LL")}</Typography>
                    </Stack>

                    <Typography sx={pmsStyles.reminderContentTexts}>{item.area}</Typography>
                    <Typography sx={pmsStyles.reminderContentTexts}>{`${item.completion} PMS Completed`}</Typography>
                  </Stack>
                </Stack>
              ))}
          </Stack>

          {pmsReminderIsLoading ||
            (pmsReminderIsFetching && (
              <Stack spacing={1} sx={pmsStyles.reminderSkeletonContainer}>
                <Skeleton variant="rounded" width={300} height={420} sx={pmsStyles.skeletonStyle} />
              </Stack>
            ))}

          {pmsReminderIsSuccess && !pmsReminderData?.value?.pms?.length && !pmsReminderIsLoading && !pmsReminderIsFetching && (
            <Stack spacing={1} sx={pmsStyles.reminderNoStoreContainer}>
              <img src={noStore} alt="No Store Found" className="norecords-found-table" />
              <Typography color="gray" align="center">
                No store found.
              </Typography>
            </Stack>
          )}

          {/* ) : pmsReminderIsLoading || pmsReminderIsFetching ? (
            <Stack spacing={1} sx={pmsStyles.reminderSkeletonContainer}>
              <Skeleton variant="rounded" width={300} height={420} sx={pmsStyles.skeletonStyle} />
            </Stack>
          ) : (
            <Stack spacing={1} sx={pmsStyles.reminderNoStoreContainer}>
              <img src={noStore} alt="No Store Found" className="norecords-found-table" />
              <Typography color="gray" align="center">
                No store found.
              </Typography>
            </Stack>
          )} */}
        </Stack>
      </Stack>

      <PmsAddSchedule openAddSchedule={openAddSchedule} onCloseAddSchedule={onCloseAddSchedule} />
      <PmsUploadSchedule openUploadSchedule={openUploadSchedule} onCloseUploadSchedule={onCloseUploadSchedule} />
      <PmsDetailDialog data={data} getDate={getDate} setGetDate={setGetDate} open={viewOpen} onClose={viewOnClose} />
    </Stack>
  );
};

export default PmsCalendar;
