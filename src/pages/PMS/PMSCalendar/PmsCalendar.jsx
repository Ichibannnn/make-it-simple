import { Box, Button, MenuItem, Select, Stack, Typography, useMediaQuery } from "@mui/material";
import { AccessTimeOutlined, EventOutlined, FileUploadOutlined, NotificationsOutlined } from "@mui/icons-material";

import { useState } from "react";
import { theme } from "../../../theme/theme";

import moment from "moment";
import noStore from "../../../assets/svg/noLocation.svg";

import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "react-big-calendar/lib/css/react-big-calendar.css";
import useDisclosure from "../../../hooks/useDisclosure";
import PmsDetailDialog from "./PmsDetailDialog";

const PmsCalendar = ({ data }) => {
  const [getDate, setGetDate] = useState("");

  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));
  const { open: viewOpen, onToggle: viewOnToggle, onClose: viewOnClose } = useDisclosure();

  const onShowScheduleDetails = (data) => {
    console.log("Data: ", data);

    if (data) {
      setGetDate(data);
      viewOnToggle();
    }
  };

  return (
    <Stack sx={{ width: "100%", flexDirection: isScreenSmall ? "column" : "row", justifyContent: "space-between" }}>
      <Stack sx={{ width: isScreenSmall ? "100%" : "69%", height: "auto", backgroundColor: theme.palette.bgForm.black3 }}>
        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          <Box />

          <Stack direction="row" gap={0.5} mb={1}>
            <Button
              size={isScreenSmall ? "small" : "medium"}
              variant="contained"
              color="primary"
              startIcon={<AccessTimeOutlined />}
              // onClick={addTicketOnToggle}
              sx={{ fontSize: "12px" }}
            >
              Add Schedule
            </Button>

            <Button
              size={isScreenSmall ? "small" : "medium"}
              variant="outlined"
              startIcon={<FileUploadOutlined />}
              // onClick={addTicketOnToggle}
              sx={{ fontSize: "12px" }}
            >
              Upload Schedule
            </Button>
          </Stack>
        </Stack>

        <FullCalendar
          height={isScreenSmall ? "64vh" : "100%"}
          // contentHeight="auto"
          plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
          initialView="dayGridMonth"
          dateClick={(data) => onShowScheduleDetails(data.dateStr)}
          dayMaxEvents={2}
          headerToolbar={{
            right: "prev,next",
            center: "title",
            left: "today,dayGridMonth,dayGridWeek,dayGridDay,listWeek",
          }}
          events={data?.map((item) => {
            return {
              title: `(${item.store})`,
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

      <Stack sx={{ width: isScreenSmall ? "100%" : "30%", backgroundColor: theme.palette.bgForm.black3, height: "100%", p: 2 }}>
        <Stack direction="row" gap={0.5}>
          <NotificationsOutlined />
          <Typography>PMS Reminder</Typography>
        </Stack>

        <Stack mt={4} gap={1}>
          <Box>
            <Typography sx={{ fontSize: "13px", color: theme.palette.text.secondary }}>Filter by Site:</Typography>
            <Select size="small" sx={{ width: "100%", fontSize: "13px" }}>
              <MenuItem value="All Status" sx={{ fontSize: "13px" }}>
                All Status
              </MenuItem>
              <MenuItem value="Pending" sx={{ fontSize: "13px" }}>
                Pending
              </MenuItem>
              <MenuItem value="Done" sx={{ fontSize: "13px" }}>
                Done
              </MenuItem>
              <MenuItem value="Delayed" sx={{ fontSize: "13px" }}>
                Delayed
              </MenuItem>
            </Select>
          </Box>

          <Box mt={2}>
            <Typography sx={{ fontSize: "13px", color: theme.palette.text.secondary }}>Time Period:</Typography>
            <Select size="small" sx={{ width: "100%", fontSize: "13px" }}>
              <MenuItem value="All Status" sx={{ fontSize: "13px" }}>
                All Status
              </MenuItem>
              <MenuItem value="Pending" sx={{ fontSize: "13px" }}>
                Pending
              </MenuItem>
              <MenuItem value="Done" sx={{ fontSize: "13px" }}>
                Done
              </MenuItem>
              <MenuItem value="Delayed" sx={{ fontSize: "13px" }}>
                Delayed
              </MenuItem>
            </Select>
          </Box>
        </Stack>

        <Stack mt={3}>
          {data?.length ? (
            <Stack>
              <Typography sx={{ fontSize: "13px", color: theme.palette.text.secondary }}>{`${data?.length} store(s) found:`}</Typography>
            </Stack>
          ) : (
            ""
          )}

          {data?.length > 0 ? (
            <Stack spacing={1} sx={{ maxHeight: "420px", overflow: "auto" }}>
              {data?.map((item, i) => (
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

      <PmsDetailDialog data={data} getDate={getDate} setGetDate={setGetDate} open={viewOpen} onClose={viewOnClose} />
    </Stack>
  );
};

export default PmsCalendar;
