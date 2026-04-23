import { Box, Button, MenuItem, Select, Skeleton, Stack, Typography, useMediaQuery } from "@mui/material";
import { AccessTimeOutlined, EventOutlined, FileUploadOutlined, NotificationsOutlined } from "@mui/icons-material";

import { useEffect, useState } from "react";
import { theme } from "../../../theme/theme";

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

  console.log("ReminderParams: ", pmsReminderParams);

  return (
    <Stack sx={{ width: "100%", flexDirection: isScreenSmall ? "column" : "row", justifyContent: "space-between" }}>
      {/* PMS Calendar */}
      <Stack sx={{ width: isScreenSmall ? "100%" : "69%", height: "auto", backgroundColor: theme.palette.bgForm.black3 }}>
        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          <Box />

          <Stack direction="row" gap={0.5} mb={1}>
            <Button
              size={isScreenSmall ? "small" : "medium"}
              variant="contained"
              color="primary"
              startIcon={<AccessTimeOutlined />}
              onClick={onOpenAddScheduleAction}
              sx={{ fontSize: "12px" }}
            >
              Add Schedule
            </Button>

            <Button size={isScreenSmall ? "small" : "medium"} variant="outlined" startIcon={<FileUploadOutlined />} onClick={onOpenUploadScheduleAction} sx={{ fontSize: "12px" }}>
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
          eventContent={(eventInfo) => (
            <Typography fontSize="11px" fontWeight={500} sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {eventInfo.event.title}
            </Typography>
          )}
          moreLinkContent={(args) => (
            <Typography fontSize="11px" fontWeight={600}>
              +{args.num} more
            </Typography>
          )}
        />
      </Stack>

      {/* PMS Reminder */}
      <Stack sx={{ width: isScreenSmall ? "100%" : "30%", backgroundColor: theme.palette.bgForm.black3, height: "100%", p: 2 }}>
        <Stack direction="row" gap={0.5}>
          <NotificationsOutlined />
          <Typography>PMS Reminder</Typography>
        </Stack>

        <Stack mt={4} gap={1}>
          <Box>
            <Typography sx={{ fontSize: "13px", color: theme.palette.text.secondary }}>Filter by Status:</Typography>
            <Select value={arrayStatus?.[0] || ""} size="small" sx={{ width: "100%", fontSize: "13px" }} onChange={(e) => setStatus(e.target.value)}>
              {arrayStatus?.map((item, i) => (
                <MenuItem key={i} value={item} sx={{ fontSize: "13px" }}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box mt={2}>
            <Typography sx={{ fontSize: "13px", color: theme.palette.text.secondary }}>Time Period:</Typography>
            <Select value={arrayTimePeriod?.[0] || ""} size="small" sx={{ width: "100%", fontSize: "13px" }} onChange={(e) => setTimePeriod(e.target.value)}>
              {arrayTimePeriod?.map((item, i) => (
                <MenuItem key={i} value={item} sx={{ fontSize: "13px" }}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Stack>

        <Stack mt={3}>
          {data?.pms?.length ? (
            <Stack>
              <Typography sx={{ fontSize: "13px", color: theme.palette.text.secondary }}>{`${data?.length} store(s) found:`}</Typography>
            </Stack>
          ) : (
            ""
          )}

          {pmsReminderIsSuccess && !pmsReminderData?.value?.pms.length && !pmsReminderIsLoading && !pmsReminderIsFetching ? (
            <Stack spacing={1} sx={{ maxHeight: "420px", overflow: "auto" }}>
              {pmsReminderData?.value?.pms?.map((item, i) => (
                <Stack key={i} spacing={1} p={1} sx={{ width: "100%", backgroundColor: theme.palette.bgForm.black2 }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: "13px", fontWeight: 800 }}>{item?.store}</Typography>

                    <Typography sx={{ fontSize: "13px", color: item?.status === "Done" ? theme.palette.success.main : theme.palette.warning.main, fontWeight: 700 }}>
                      {item?.status}
                    </Typography>
                  </Stack>

                  <Stack direction="column" justifyContent="space-between">
                    <Stack direction="row" gap={0.5}>
                      <EventOutlined sx={{ fontSize: "16px", color: theme.palette.text.secondary }} />
                      <Typography sx={{ fontSize: "12px", color: theme.palette.text.secondary }}>{item.date}</Typography>
                    </Stack>

                    <Typography sx={{ fontSize: "12px", color: theme.palette.text.secondary }}>{item.area}</Typography>
                    <Typography sx={{ fontSize: "12px", color: theme.palette.text.secondary }}>{`${item.completion} PMS Completed`}</Typography>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          ) : pmsReminderIsLoading || pmsReminderIsFetching ? (
            <Stack spacing={1} sx={{ height: "420px", backgroundColor: theme.palette.bgForm.black2, justifyContent: "center", alignItems: "center" }}>
              <Skeleton variant="rounded" animation="wave" />
            </Stack>
          ) : (
            <Stack spacing={1} sx={{ height: "420px", backgroundColor: theme.palette.bgForm.black2, justifyContent: "center", alignItems: "center" }}>
              <img src={noStore} alt="No Store Found" className="norecords-found-table" />
              <Typography color="gray" align="center">
                No store found.
              </Typography>
            </Stack>
          )}
        </Stack>
      </Stack>

      <PmsAddSchedule openAddSchedule={openAddSchedule} onCloseAddSchedule={onCloseAddSchedule} />
      <PmsUploadSchedule openUploadSchedule={openUploadSchedule} onCloseUploadSchedule={onCloseUploadSchedule} />
      <PmsDetailDialog data={data} getDate={getDate} setGetDate={setGetDate} open={viewOpen} onClose={viewOnClose} />
    </Stack>
  );
};

export default PmsCalendar;
