import { Autocomplete, Box, Button, MenuItem, OutlinedInput, Select, Stack, Tab, Tabs, Typography, useMediaQuery } from "@mui/material";
import { ContentPasteGoOutlined, Search } from "@mui/icons-material";

import { data } from "../../data";
import { useEffect, useState } from "react";
import { theme } from "../../theme/theme";
import { global } from "../../styles/global";
import { pmsStyles } from "./styles/pmsStyles";
import { Controller } from "react-hook-form";

import { useLazyGetActivePmsTypeQuery } from "../../features/api masterlist/pms-type/pmsTypeApi";
import { useLazyGetActiveSitesQuery } from "../../features/api masterlist/sites/sitesApi";
import { usePmsCalendarParams } from "../../hooks/api_params/pms/usePmsCalendarParams";

import PmsCalendar from "./PMSCalendar/PmsCalendar";
import PmsTable from "./PMSTable/PmsTable";
import PmsReport from "./PMSReport/PmsReport";

import { useGetPmsCalendarQuery } from "../../features/api_pms/pms_calendar/pmsCalendarApi";
import { usePmsReminderParams } from "../../hooks/api_params/pms/usePmsReminderParams";

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
  const [defaultSite, setDefaultSite] = useState(null);
  const [defaultPmsType, setDefaultPmsType] = useState(null);

  const { params, setSearch, setSiteId, setPmsTypeId } = usePmsCalendarParams();

  const { data: pmsCalendarData, isLoading: pmsCalendarIsLoading, isFetching: pmsCalendarIsFetching, isError: pmsCalendarIsError } = useGetPmsCalendarQuery(params);

  const [getSites, { data: siteData, isLoading: siteIsLoading, isSuccess: siteIsSuccess }] = useLazyGetActiveSitesQuery();
  const [getPmsTypes, { data: pmsTypeData, isLoading: pmsTypeIsLoading, isSuccess: pmsTypeIsSuccess }] = useLazyGetActivePmsTypeQuery();

  const onTabChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 1:
        return <PmsCalendar data={pmsCalendarData} isLoading={pmsCalendarIsLoading} isFetching={pmsCalendarIsFetching} isError={pmsCalendarIsError} />;
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

    if (siteData?.value?.sites?.length && pmsTypeData?.value?.type?.length) {
      setDefaultSite(siteData?.value?.sites?.[0]);
      setSiteId(siteData?.value?.sites?.[0]?.id);

      setDefaultPmsType(pmsTypeData?.value?.type?.[0]);
      setPmsTypeId(pmsTypeData?.value?.type?.[0]?.id);
    }
  }, [getPmsTypes, getSites, siteData, pmsTypeData]);

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

              <Select
                value={defaultSite || ""}
                size="small"
                sx={pmsStyles.customSelect}
                onChange={(e) => {
                  setDefaultSite(e.target.value);
                  setSiteId(e.target.value.id);
                }}
              >
                {siteData?.value?.sites?.map((item, i) => (
                  <MenuItem key={i} value={item} sx={pmsStyles.menuItemsFont}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Box sx={pmsStyles.selectPmsTypeContainer}>
              <Typography sx={{ fontSize: "12px" }}>Filter by PMS Type:</Typography>
              <Select
                value={defaultPmsType || ""}
                size="small"
                sx={pmsStyles.customSelect}
                onChange={(e) => {
                  setDefaultPmsType(e.target.value);
                  setPmsTypeId(e.target.value.id);
                }}
              >
                {pmsTypeData?.value?.type?.map((item, i) => (
                  <MenuItem key={i} value={item} sx={pmsStyles.menuItemsFont}>
                    {item.name}
                  </MenuItem>
                ))}
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
