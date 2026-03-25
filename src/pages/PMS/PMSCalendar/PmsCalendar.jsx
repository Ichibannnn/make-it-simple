import { Box, MenuItem, Select, Stack, Typography } from "@mui/material";
import { theme } from "../../../theme/theme";
import { EventOutlined, NotificationsOutlined } from "@mui/icons-material";

import moment from "moment";
import { useState } from "react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import "react-big-calendar/lib/css/react-big-calendar.css";

const PmsCalendar = () => {
  const [filterByDate, setFilterByDate] = useState("");

  const data = [
    {
      id: 1,
      store: "F003- FIELDS MCARTHUR",
      date: "March 12, 2026",
      area: "Region A - Area 1",
      status: "Done",
      completion: "6/9 PMS completed",
    },
    {
      id: 2,
      store: "F002- NEPO",
      date: "March 15, 2026",
      area: "Region A - Area 1",
      status: "Pending",
      completion: "6/9 PMS completed",
    },
    {
      id: 3,
      store: "F009- DAU",
      date: "March 1, 2026",
      area: "Region A - Area 1",
      status: "Pending",
      completion: "6/9 PMS completed",
    },
    {
      id: 4,
      store: "F009- DAU",
      date: "March 5, 2026",
      area: "Region A - Area 1",
      status: "Done",
      completion: "6/9 PMS completed",
    },
    {
      id: 5,
      store: "F009- DAU",
      date: "March 12, 2026",
      area: "Region A - Area 1",
      status: "Done",
      completion: "6/9 PMS completed",
    },
    {
      id: 6,
      store: "F009- DAU",
      date: "March 12, 2026",
      area: "Region A - Area 1",
      status: "Pending",
      completion: "6/9 PMS completed",
    },
    {
      id: 7,
      store: "F009- DAU",
      date: "March 7, 2026",
      area: "Region A - Area 1",
      status: "Done",
      completion: "6/9 PMS completed",
    },
    {
      id: 8,
      store: "F009- DAU",
      date: "March 12, 2026",
      area: "Region A - Area 1",
      status: "Done",
      completion: "6/9 PMS completed",
    },
  ];

  const onShowScheduleDetails = (data) => {
    console.log("Data: ", data);

    if (data) {
    }
  };

  return (
    <Stack sx={{ width: "100%", height: "100vh", flexDirection: "row", justifyContent: "space-between" }}>
      <Stack sx={{ width: "69%", backgroundColor: theme.palette.bgForm.black2, height: "100%" }}>
        <FullCalendar
          height="100%"
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

      <Stack sx={{ width: "30%", backgroundColor: theme.palette.bgForm.black2, height: "100%", p: 2 }}>
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
          <Stack>
            <Typography sx={{ fontSize: "13px", color: theme.palette.text.secondary }}>24 stores founds:</Typography>
          </Stack>

          <Stack spacing={1} sx={{ maxHeight: "420px", overflow: "auto" }}>
            {data?.map((item, i) => (
              <Stack key={i} spacing={1} p={1} sx={{ width: "100%", backgroundColor: theme.palette.bgForm.black3 }}>
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
                  <Typography sx={{ fontSize: "12px", color: theme.palette.text.secondary }}>{item.completion}</Typography>
                </Stack>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default PmsCalendar;
