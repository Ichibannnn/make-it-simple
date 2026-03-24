import { Box, MenuItem, Select, Stack, Typography } from "@mui/material";
import { theme } from "../../theme/theme";
import { EventOutlined, NotificationsOutlined } from "@mui/icons-material";

const PmsCalendar = () => {
  const data = [
    {
      id: 1,
      store: "F003- FIELDS MCARTHUR",
      date: "Oct 12, 2026",
      area: "Region A - Area 1",
      status: "Done",
      completion: "6/9 PMS completed",
    },
    {
      id: 2,
      store: "F002- NEPO",
      date: "Oct 13, 2026",
      area: "Region A - Area 1",
      status: "Pending",
      completion: "6/9 PMS completed",
    },
    {
      id: 3,
      store: "F009- DAU",
      date: "Oct 12, 2026",
      area: "Region A - Area 1",
      status: "Pending",
      completion: "6/9 PMS completed",
    },
    {
      id: 4,
      store: "F009- DAU",
      date: "Oct 12, 2026",
      area: "Region A - Area 1",
      status: "Done",
      completion: "6/9 PMS completed",
    },
    {
      id: 5,
      store: "F009- DAU",
      date: "Oct 12, 2026",
      area: "Region A - Area 1",
      status: "Done",
      completion: "6/9 PMS completed",
    },
    {
      id: 6,
      store: "F009- DAU",
      date: "Oct 12, 2026",
      area: "Region A - Area 1",
      status: "Pending",
      completion: "6/9 PMS completed",
    },
    {
      id: 7,
      store: "F009- DAU",
      date: "Oct 12, 2026",
      area: "Region A - Area 1",
      status: "Done",
      completion: "6/9 PMS completed",
    },
    {
      id: 8,
      store: "F009- DAU",
      date: "Oct 12, 2026",
      area: "Region A - Area 1",
      status: "Done",
      completion: "6/9 PMS completed",
    },
  ];

  console.log("Data:", data);

  return (
    <Stack sx={{ width: "100%", height: "100vh", flexDirection: "row", justifyContent: "space-between" }}>
      <Stack sx={{ width: "69%", backgroundColor: theme.palette.bgForm.black2, height: "100%" }}></Stack>

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
