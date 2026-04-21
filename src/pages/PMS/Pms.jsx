import { Autocomplete, Box, Button, MenuItem, OutlinedInput, Select, Stack, Tab, Tabs, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { theme } from "../../theme/theme";
import { ContentPasteGoOutlined, Search } from "@mui/icons-material";

import PmsCalendar from "./PMSCalendar/PmsCalendar";
import PmsTable from "./PMSTable/PmsTable";
import PmsReport from "./PMSReport/PmsReport";
import { pmsStyles } from "./styles/pmsStyles";
import { data } from "../../data";
import { global } from "../../styles/global";
import { useLazyGetActivePmsTypeQuery } from "../../features/api masterlist/pms-type/pmsTypeApi";
import { useLazyGetActiveSitesQuery } from "../../features/api masterlist/sites/sitesApi";
import { Controller } from "react-hook-form";

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

  const [getSites, { data: siteData, isLoading: siteIsLoading, isSuccess: siteIsSuccess }] = useLazyGetActiveSitesQuery();
  const [getPmsTypes, { data: pmsTypeData, isLoading: pmsTypeIsLoading, isSuccess: pmsTypeIsSuccess }] = useLazyGetActivePmsTypeQuery();

  const onTabChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 1:
        return <PmsCalendar data={data} />;
      case 2:
        return <PmsTable data={data} />;
      case 3:
        return <PmsReport />;
      default:
        return null;
    }
  };

  useEffect(() => {
    getPmsTypes();
    getSites();
  }, []);

  console.log("Sites: ", siteData);
  console.log("PmsType: ", pmsTypeData);

  const handleChange = (event) => {
    console.log("event", event);
  };

  return (
    <Stack sx={global.layoutContainer}>
      <Stack mb={1}>
        <Stack justifyContent="space-between" sx={global.headerContainer}>
          <Stack>
            <Typography variant={isScreenSmall ? "h5" : "h4"}>PMS SCHEDULE</Typography>
            <Typography color="text.secondary" fontSize="small">
              Track and manage visits through the year
            </Typography>
          </Stack>

          <Stack>
            <Button variant="contained" color="primary" startIcon={<ContentPasteGoOutlined />} sx={pmsStyles.buttons}>
              Start PMS
            </Button>
          </Stack>
        </Stack>

        <Stack sx={global.contentContainer}>
          <Stack sx={pmsStyles.selectFilterContainer}>
            <Box sx={pmsStyles.selectSiteContainer}>
              <Typography fontSize="12px">Filter by Site:</Typography>

              <Select size="small" sx={pmsStyles.customSelect}>
                {siteData?.value?.sites?.map((item, i) => (
                  <MenuItem key={i} value={item} sx={pmsStyles.menuItemsFont} onChange={(e) => handleChange(e)}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Box sx={pmsStyles.selectPmsTypeContainer}>
              <Typography sx={{ fontSize: "12px" }}>Filter by PMS Type:</Typography>
              <Select size="small" sx={pmsStyles.customSelect}>
                {pmsTypeData?.value?.type?.map((item, i) => (
                  <MenuItem key={i} value={item.name} sx={pmsStyles.menuItemsFont}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
              {/* <Select size="small" sx={pmsStyles.customSelect}>
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
              </Select> */}
            </Box>
          </Stack>

          <Stack sx={{ width: "40%" }}>
            <Stack sx={{ width: "97.5%" }}>
              <OutlinedInput
                // value={searchValue}
                // onChange={(e) => dispatch(setSearchValue(e.target.value))}
                size="small"
                placeholder="Search store..."
                startAdornment={<Search sx={global.searchIcon} />}
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
