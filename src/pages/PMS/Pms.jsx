import { Autocomplete, Box, Button, IconButton, MenuItem, OutlinedInput, Select, Stack, Tab, Tabs, TextField, Typography, useMediaQuery } from "@mui/material";
import { Clear, ContentPasteGoOutlined, Search } from "@mui/icons-material";

import { data } from "../../data";
import { useEffect, useState } from "react";
import { theme } from "../../theme/theme";
import { global } from "../../styles/global";
import { pmsStyles } from "./styles/pmsStyles";
import { Controller } from "react-hook-form";

import { useLazyGetActivePmsTypeQuery } from "../../features/api masterlist/pms-type/pmsTypeApi";
import { useLazyGetActiveSitesQuery, useLazyGetActiveSitesWithPmsTypeQuery } from "../../features/api masterlist/sites/sitesApi";
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

  // const [getSites, { data: siteData, isLoading: siteIsLoading, isSuccess: siteIsSuccess }] = useLazyGetActiveSitesQuery();
  const [getSites, { data: siteData, isLoading: siteIsLoading, isSuccess: siteIsSuccess }] = useLazyGetActiveSitesWithPmsTypeQuery();
  // const [getPmsTypes, { data: pmsTypeData, isLoading: pmsTypeIsLoading, isSuccess: pmsTypeIsSuccess }] = useLazyGetActivePmsTypeQuery();

  const onTabChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 1:
        return <PmsCalendar data={pmsCalendarData} isLoading={pmsCalendarIsLoading} isFetching={pmsCalendarIsFetching} isError={pmsCalendarIsError} pmsTypeOptions={currentPmsTypeOptions} />;
      case 2:
        return <PmsTable data={data} />;
      case 3:
        return <PmsReport />;
      default:
        return null;
    }
  };

  useEffect(() => {
    getSites();

    if (siteData?.value?.site?.length) {
      setDefaultSite(siteData?.value?.site?.[0]);
      setSiteId(siteData?.value?.site?.[0]?.siteId);

      setDefaultPmsType(siteData?.value?.site?.[0]?.listOfTypes?.[0]);
      setPmsTypeId(siteData?.value?.site?.[0]?.listOfTypes?.[0]?.typeId);
    } else {
      setDefaultSite(null);
      setSiteId("");

      setDefaultPmsType(null);
      setPmsTypeId("");
    }
  }, [getSites, siteData]);

  const currentSiteOptions = siteData?.value?.site || [];
  const currentPmsTypeOptions = siteData?.value?.site?.find((s) => s.siteId === params.SiteId)?.listOfTypes || [];

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
              <Autocomplete
                size="small"
                options={currentSiteOptions}
                getOptionLabel={(option) => option?.siteName || ""}
                isOptionEqualToValue={(option, value) => option?.siteId === value?.siteId}
                value={defaultSite}
                onChange={(_, newValue) => {
                  setDefaultSite(newValue);
                  setSiteId(newValue?.siteId || "");
                  setDefaultPmsType(null);
                  setPmsTypeId("");
                }}
                sx={pmsStyles.filterAutocompleteStyles}
                slotProps={{ popper: { sx: pmsStyles.filterPopperStyles } }}
                renderInput={(params) => <TextField {...params} placeholder="Select site" sx={{ "& .MuiInputBase-input": { fontSize: "13px" } }} />}
                renderOption={(props, option) => (
                  <MenuItem {...props} key={option.siteId} sx={pmsStyles.menuItemsFont}>
                    {option.siteName}
                  </MenuItem>
                )}
                disableClearable
              />
            </Box>

            <Box sx={pmsStyles.selectPmsTypeContainer}>
              <Typography sx={{ fontSize: "12px" }}>Filter by PMS Type:</Typography>
              <Autocomplete
                size="small"
                options={currentPmsTypeOptions}
                getOptionLabel={(option) => option?.typeName || ""}
                isOptionEqualToValue={(option, value) => option?.typeId === value?.typeId}
                value={defaultPmsType}
                onChange={(_, newValue) => {
                  setDefaultPmsType(newValue);
                  setPmsTypeId(newValue?.typeId || "");
                }}
                sx={pmsStyles.filterAutocompleteStyles}
                slotProps={{ popper: { sx: pmsStyles.filterPopperStyles } }}
                renderInput={(params) => <TextField {...params} placeholder="Select PMS type" sx={{ "& .MuiInputBase-input": { fontSize: "13px" } }} />}
                renderOption={(props, option) => (
                  <MenuItem {...props} key={option.typeId} sx={pmsStyles.menuItemsFont}>
                    {option.typeName}
                  </MenuItem>
                )}
              />
            </Box>
          </Stack>

          <Stack sx={pmsStyles.searchAndTabContainer}>
            <Stack sx={{ width: { xs: 0, md: "56%" } }}></Stack>

            <Stack sx={{ flex: 1 }}>
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
