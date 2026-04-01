import { Box, Button, MenuItem, OutlinedInput, Select, Stack, Tab, Tabs, Typography, useMediaQuery } from "@mui/material";
import { useState } from "react";
import { theme } from "../../theme/theme";
import { ContentPasteGoOutlined, Search } from "@mui/icons-material";

import PmsCalendar from "./PMSCalendar/PmsCalendar";
import PmsTable from "./PMSTable/PmsTable";
import PmsReport from "./PMSReport/PmsReport";
import { pmsStyles } from "./styles/pmsStyles";

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
      date: "April 12, 2026",
      area: "Region A - Area 1",
      status: "Pending",
      completion: "6/9",
    },
    {
      id: 2,
      store: "F002- NEPO",
      date: "April 15, 2026",
      area: "Region A - Area 1",
      status: "Pending",
      completion: "6/9",
    },
    {
      id: 3,
      store: "F009- DAU",
      date: "April 1, 2026",
      area: "Region A - Area 1",
      status: "Pending",
      completion: "6/9",
    },
    {
      id: 4,
      store: "F009- DAU",
      date: "April 5, 2026",
      area: "Region A - Area 1",
      status: "Pending",
      completion: "6/9",
    },
    {
      id: 5,
      store: "F009- DAU",
      date: "April 23, 2026",
      area: "Region A - Area 1",
      status: "Done",
      completion: "6/9",
    },
    {
      id: 6,
      store: "F009- DAU",
      date: "April 23, 2026",
      area: "Region A - Area 1",
      status: "Pending",
      completion: "6/9",
    },
    {
      id: 7,
      store: "F009- DAU",
      date: "April 7, 2026",
      area: "Region A - Area 1",
      status: "Done",
      completion: "6/9",
    },
    {
      id: 8,
      store: "F009- DAU",
      date: "April 23, 2026",
      area: "Region A - Area 1",
      status: "Pending",
      completion: "6/9",
    },
    {
      id: 9,
      store: "F009- DAU",
      date: "April 17, 2026",
      area: "Region A - Area 1",
      status: "Done",
      completion: "6/9",
    },
    {
      id: 10,
      store: "F009- DAU",
      date: "April 17, 2026",
      area: "Region A - Area 1",
      status: "Pending",
      completion: "6/9",
    },
    {
      id: 11,
      store: "F009- DAU",
      date: "April 29, 2026",
      area: "Region A - Area 1",
      status: "Done",
      completion: "6/9",
    },
    {
      id: 12,
      store: "F009- DAU",
      date: "April 27, 2026",
      area: "Region A - Area 1",
      status: "Done",
      completion: "6/9",
    },
    {
      id: 13,
      store: "F009- DAU",
      date: "April 27, 2026",
      area: "Region A - Area 1",
      status: "Done",
      completion: "6/9",
    },
    {
      id: 14,
      store: "F009- DAU",
      date: "April 20, 2026",
      area: "Region A - Area 1",
      status: "Pending",
      completion: "6/9",
    },
    {
      id: 15,
      store: "F009- DAU",
      date: "April 21, 2026",
      area: "Region A - Area 1",
      status: "Done",
      completion: "6/9",
    },
    {
      id: 16,
      store: "F009- DAU",
      date: "April 28, 2026",
      area: "Region A - Area 1",
      status: "Pending",
      completion: "6/9",
    },
    {
      id: 17,
      store: "F009- DAU",
      date: "April 17, 2026",
      area: "Region A - Area 1",
      status: "Done",
      completion: "6/9",
    },
    {
      id: 18,
      store: "F009- DAU",
      date: "April 25, 2026",
      area: "Region A - Area 1",
      status: "Done",
      completion: "6/9",
    },
  ];

  return (
    <Stack sx={pmsStyles.layoutContainer}>
      <Stack mb={1}>
        <Stack justifyContent="space-between" sx={pmsStyles.pmsHeaderContainer}>
          <Stack>
            <Typography variant={isScreenSmall ? "h5" : "h4"}>PMS SCHEDULE</Typography>
            <Typography color="gray" fontSize="small">
              Track and manage visits through the year
            </Typography>
          </Stack>

          <Stack>
            <Button variant="contained" color="primary" startIcon={<ContentPasteGoOutlined />} sx={pmsStyles.buttons}>
              Start PMS
            </Button>
          </Stack>
        </Stack>

        <Stack sx={pmsStyles.pmsContentContainer}>
          <Stack direction="row" gap={1} sx={{ width: "30%" }}>
            <Box width="48%">
              <Typography fontSize="12px">Filter by Site:</Typography>
              <Select size="small" sx={pmsStyles.customSelect}>
                <MenuItem value="Stores" sx={pmsStyles.menuItemsFont}>
                  Store
                </MenuItem>
                <MenuItem value="Head Office" sx={pmsStyles.menuItemsFont}>
                  Head Office
                </MenuItem>
                <MenuItem value="Farm" sx={pmsStyles.menuItemsFont}>
                  Farm
                </MenuItem>
              </Select>
            </Box>

            <Box width="48%">
              <Typography sx={{ fontSize: "12px" }}>Filter by PMS Type:</Typography>
              <Select size="small" sx={pmsStyles.customSelect}>
                <MenuItem value="All" sx={pmsStyles.menuItemsFont}>
                  All PMS
                </MenuItem>
                <MenuItem value="Store" sx={pmsStyles.menuItemsFont}>
                  Store
                </MenuItem>
                <MenuItem value="Desktop" sx={pmsStyles.menuItemsFont}>
                  Desktop
                </MenuItem>
                <MenuItem value="Laptop" sx={pmsStyles.menuItemsFont}>
                  Laptop
                </MenuItem>
                <MenuItem value="Weighing Scale" sx={pmsStyles.menuItemsFont}>
                  Weighing Scale
                </MenuItem>
              </Select>
            </Box>
          </Stack>

          <Stack sx={{ width: "40%" }}>
            <Stack sx={{ width: "97.5%" }}>
              <OutlinedInput
                // value={searchValue}
                // onChange={(e) => dispatch(setSearchValue(e.target.value))}
                size="small"
                placeholder="Search store..."
                startAdornment={<Search sx={pmsStyles.customSearchIcon} />}
                sx={pmsStyles.customSearch}
              />
            </Stack>
          </Stack>

          <Stack sx={{ width: "30%" }}>
            <Stack>
              <Tabs value={activeTab} onChange={onTabChange} variant="fullWidth" scrollButtons="auto">
                {TAB_CONFIG.map(({ value, label }) => (
                  <Tab key={value} value={value} label={label} className="tabs-styling" sx={pmsStyles.customTab} />
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
