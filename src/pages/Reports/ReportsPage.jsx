import { Autocomplete, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { theme } from "../../theme/theme";
import { useEffect } from "react";
import { Toaster, toast } from "sonner";

const ReportsPage = () => {
  const [reportNavigation, setReportNavigation] = useState(null);

  const categoryOptions = [
    { name: "Open Tickets", value: 1 },
    { name: "Closed Tickets", value: 2 },
    { name: "Transferred Tickets", value: 3 },
    { name: "On-Hold Tickets", value: 4 },
  ];

  const handleChange = (event, newValue) => {
    setReportNavigation(newValue?.value);
  };

  console.log("reportNavigation", reportNavigation);

  return (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: theme.palette.bgForm.black1,
        color: "#fff",
        padding: "17px",
      }}
    >
      <Toaster richColors position="top-right" />
      <Stack>
        <Stack sx={{ width: "100%", height: "170px", backgroundColor: theme.palette.bgForm.black3, borderRadius: "20px", padding: "20px" }}>
          <Stack>
            <Stack>
              <Typography variant="h4">Reports</Typography>
            </Stack>
            <Stack direction="row" mt={2} sx={{ border: "1px solid #2D3748", borderRadius: "20px ", backgroundColor: theme.palette.bgForm.black3, padding: 2 }}>
              <Stack sx={{ width: "100%" }}>
                <Typography sx={{ fontSize: "13px" }}>Report Details:</Typography>
                <Autocomplete
                  options={categoryOptions}
                  getOptionLabel={(option) => option.name}
                  value={reportNavigation}
                  onChange={handleChange}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  renderInput={(params) => <TextField {...params} variant="outlined" />}
                />
              </Stack>

              <Stack sx={{ width: "100%" }}>
                <Typography sx={{ fontSize: "13px" }}>Report Details:</Typography>
                <Autocomplete
                  options={categoryOptions}
                  getOptionLabel={(option) => option.name}
                  value={reportNavigation}
                  onChange={handleChange}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  renderInput={(params) => <TextField {...params} variant="outlined" />}
                />
              </Stack>
            </Stack>
          </Stack>
        </Stack>

        <Stack sx={{ borderRadius: "20px", backgroundColor: theme.palette.bgForm.black3, marginTop: "10px", height: "630px" }}>
          <Stack direction="row" justifyContent="space-between" paddingLeft={1} paddingRight={1}></Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ReportsPage;
