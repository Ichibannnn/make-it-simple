import { Box, Button, MenuItem, OutlinedInput, Select, Stack, Tab, Tabs, Typography, useMediaQuery } from "@mui/material";
import { useState } from "react";
import { theme } from "../../theme/theme";
import { ContentPasteGoOutlined, Search } from "@mui/icons-material";

import PmsCalendar from "./PMSCalendar/PmsCalendar";
import PmsTable from "./PMSTable/PmsTable";
import PmsReport from "./PMSReport/PmsReport";

const TAB_CONFIG = [
  {
    value: 1,
    label: "Calendar",
  },
  {
    value: 2,
    label: "PMS Monitoring",
  },
  {
    value: 3,
    label: "Reports",
  },
];

const Pms = () => {
  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));

  const [activeTab, setActiveTab] = useState(1);

  const onTabChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 1:
        return <PmsCalendar data={data} />;
      case 2:
        return <PmsTable />;
      case 3:
        return <PmsReport />;
      default:
        return null;
    }
  };

  const data = [
    {
      id: 1,
      store: "F003- FIELDS MCARTHUR",
      date: "March 12, 2026",
      area: "Region A - Area 1",
      status: "Pending",
      completion: "6/9",
    },
    {
      id: 2,
      store: "F002- NEPO",
      date: "March 15, 2026",
      area: "Region A - Area 1",
      status: "Pending",
      completion: "6/9",
    },
    {
      id: 3,
      store: "F009- DAU",
      date: "March 1, 2026",
      area: "Region A - Area 1",
      status: "Pending",
      completion: "6/9",
    },
    {
      id: 4,
      store: "F009- DAU",
      date: "March 5, 2026",
      area: "Region A - Area 1",
      status: "Pending",
      completion: "6/9",
    },
    {
      id: 5,
      store: "F009- DAU",
      date: "March 12, 2026",
      area: "Region A - Area 1",
      status: "Done",
      completion: "6/9",
    },
    {
      id: 6,
      store: "F009- DAU",
      date: "March 12, 2026",
      area: "Region A - Area 1",
      status: "Pending",
      completion: "6/9",
    },
    {
      id: 7,
      store: "F009- DAU",
      date: "March 7, 2026",
      area: "Region A - Area 1",
      status: "Done",
      completion: "6/9",
    },
    {
      id: 8,
      store: "F009- DAU",
      date: "March 12, 2026",
      area: "Region A - Area 1",
      status: "Pending",
      completion: "6/9",
    },
    {
      id: 9,
      store: "F009- DAU",
      date: "March 26, 2026",
      area: "Region A - Area 1",
      status: "Done",
      completion: "6/9",
    },
    {
      id: 10,
      store: "F009- DAU",
      date: "March 26, 2026",
      area: "Region A - Area 1",
      status: "Pending",
      completion: "6/9",
    },
    {
      id: 11,
      store: "F009- DAU",
      date: "March 29, 2026",
      area: "Region A - Area 1",
      status: "Done",
      completion: "6/9",
    },
    {
      id: 12,
      store: "F009- DAU",
      date: "March 27, 2026",
      area: "Region A - Area 1",
      status: "Done",
      completion: "6/9",
    },
    {
      id: 13,
      store: "F009- DAU",
      date: "March 27, 2026",
      area: "Region A - Area 1",
      status: "Done",
      completion: "6/9",
    },
    {
      id: 14,
      store: "F009- DAU",
      date: "March 20, 2026",
      area: "Region A - Area 1",
      status: "Pending",
      completion: "6/9",
    },
    {
      id: 15,
      store: "F009- DAU",
      date: "March 21, 2026",
      area: "Region A - Area 1",
      status: "Done",
      completion: "6/9",
    },
    {
      id: 16,
      store: "F009- DAU",
      date: "March 28, 2026",
      area: "Region A - Area 1",
      status: "Pending",
      completion: "6/9",
    },
    {
      id: 17,
      store: "F009- DAU",
      date: "March 26, 2026",
      area: "Region A - Area 1",
      status: "Done",
      completion: "6/9",
    },
    {
      id: 18,
      store: "F009- DAU",
      date: "March 25, 2026",
      area: "Region A - Area 1",
      status: "Done",
      completion: "6/9",
    },
  ];

  return (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: theme.palette.bgForm.black1,
        color: "#fff",
        padding: isScreenSmall ? "20px" : "2px 64px 24px 64px",
      }}
    >
      <Stack mb={1}>
        <Stack direction="row" justifyContent="space-between">
          <Stack>
            <Typography variant={isScreenSmall ? "h5" : "h4"}>PMS SCHEDULE</Typography>
            <Typography color="gray" fontSize="small">
              Track and manage visits through the year
            </Typography>
          </Stack>

          <Stack>
            <Stack marginTop={0.5}>
              <Button
                size={isScreenSmall ? "small" : "medium"}
                variant="contained"
                color="primary"
                startIcon={<ContentPasteGoOutlined />}
                // onClick={addTicketOnToggle}
                sx={{ fontSize: "12px" }}
              >
                Start PMS
              </Button>
            </Stack>
          </Stack>
        </Stack>

        <Stack
          sx={{
            width: "100%",
            height: "100%",
            flexDirection: isScreenSmall ? "column" : "row",
            mt: 2,
            alignItems: "flex-end",
          }}
        >
          <Stack direction="row" gap={1} sx={{ width: "30%" }}>
            <Box width="40%">
              <Typography sx={{ fontSize: "12px" }}>Filter by Site:</Typography>
              <Select size="small" sx={{ width: "100%", fontSize: "11px", background: theme.palette.primary.main }}>
                <MenuItem value="Stores" sx={{ fontSize: "11px" }}>
                  Store
                </MenuItem>
                <MenuItem value="Head Office" sx={{ fontSize: "11px" }}>
                  Head Office
                </MenuItem>
                <MenuItem value="Farm" sx={{ fontSize: "11px" }}>
                  Farm
                </MenuItem>
              </Select>
            </Box>

            <Box width="40%">
              <Typography sx={{ fontSize: "12px" }}>Filter by PMS Type:</Typography>
              <Select size="small" sx={{ width: "100%", fontSize: "11px", background: theme.palette.primary.main }}>
                <MenuItem value="All" sx={{ fontSize: "11px" }}>
                  All PMS
                </MenuItem>
                <MenuItem value="Store" sx={{ fontSize: "11px" }}>
                  Store
                </MenuItem>
                <MenuItem value="Desktop" sx={{ fontSize: "11px" }}>
                  Desktop
                </MenuItem>
                <MenuItem value="Laptop" sx={{ fontSize: "11px" }}>
                  Laptop
                </MenuItem>
                <MenuItem value="Weighing Scale" sx={{ fontSize: "11px" }}>
                  Weighing Scale
                </MenuItem>
              </Select>
            </Box>
          </Stack>

          <Stack sx={{ width: "40%" }}>
            <Stack sx={{ width: "97.5%" }}>
              <OutlinedInput
                size="small"
                placeholder="Search store..."
                startAdornment={<Search sx={{ marginRight: 0.5, color: "#A0AEC0" }} />}
                // value={searchValue}
                // onChange={(e) => dispatch(setSearchValue(e.target.value))}
                sx={{
                  borderRadius: "15px",
                  fontSize: "small",
                  fontWeight: 400,
                  lineHeight: "1.4375rem",
                  borderRadius: "none",
                }}
              />
            </Stack>
          </Stack>

          <Stack sx={{ width: "30%" }}>
            <Stack sx={{ width: "100%", justifyItems: "right" }}>
              <Tabs
                value={activeTab}
                onChange={onTabChange}
                variant="fullWidth"
                scrollButtons="auto"
                full
                sx={{
                  ".MuiTab-root": {
                    minWidth: isScreenSmall ? "80px" : "120px",
                    fontSize: { xs: "10px", sm: "12px", md: "13px" },
                  },
                  ".MuiTabs-scrollButtons": {
                    color: "#fff",
                    "&.Mui-disabled": {
                      opacity: 0.3,
                    },
                  },
                }}
              >
                {TAB_CONFIG.map(({ value, label }) => (
                  <Tab
                    key={value}
                    value={value}
                    label={label}
                    className="tabs-styling"
                    sx={{
                      fontSize: "12px",
                      fontWeight: 600,
                      ".MuiBadge-badge": {
                        color: "#ffff",
                      },
                    }}
                  />
                ))}
              </Tabs>
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      {renderTabContent()}
    </Stack>
  );
};

export default Pms;
