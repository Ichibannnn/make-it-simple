import { CalendarMonth, CalendarMonthOutlined, EditOutlined, FilterListOutlined, MoreHoriz, RefreshOutlined, RestoreOutlined } from "@mui/icons-material";
import { Autocomplete, Button, IconButton, ListItemIcon, Menu, MenuItem, Stack, TextField, Tooltip, Typography } from "@mui/material";
import React, { useRef, useState } from "react";

import { theme } from "../../../theme/theme";
import useDisclosure from "../../../hooks/useDisclosure";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";

const TicketFiltering = ({ filterStatus, setFilterStatus, dateFrom, setDateFrom, dateTo, setDateTo }) => {
  const [tempFilterStatus, setTempFilterStatus] = useState("");
  const [tempDateFrom, setTempDateFrom] = useState("");
  const [tempDateTo, setTempDateTo] = useState("");

  const options = ["Open Ticket", "For Closing Ticket", "For Confirmation", "Closed"];

  const ref = useRef(null);

  const { open, onToggle } = useDisclosure();

  const onApplyAction = () => {
    setFilterStatus(tempFilterStatus);
    setDateFrom(moment(tempDateFrom).format("YYYY-MM-DD"));
    setDateTo(moment(tempDateTo).format("YYYY-MM-DD"));
    onToggle();
  };

  const onClearAction = () => {
    setTempFilterStatus("");
    setTempDateFrom("");
    setTempDateTo("");
  };

  console.log("Status: ", filterStatus);
  console.log("Date From: ", dateFrom);
  console.log("Date To: ", dateTo);

  return (
    <>
      <Tooltip title={"Filter Tickets"} placement="bottom-start">
        <IconButton ref={ref} onClick={onToggle}>
          <FilterListOutlined sx={{ fontSize: "28px" }} />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={ref.current}
        open={open}
        onClose={onToggle}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Stack sx={{ padding: 2, maxHeight: "300px", minWidth: "300px" }}>
          <Stack gap={2}>
            <Typography color="primary" sx={{ fontSize: "14px" }}>
              Filter tickets:{" "}
            </Typography>

            <Autocomplete
              value={tempFilterStatus}
              onChange={(_, newValue) => {
                setTempFilterStatus(newValue);
              }}
              options={options}
              // sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Status" />}
              disableClearable
            />

            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker label="Date From" value={tempDateFrom} onChange={(newValue) => setTempDateFrom(newValue)} />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker label="Date To" value={tempDateTo} minDate={tempDateFrom} onChange={(newValue) => setTempDateTo(newValue)} />
            </LocalizationProvider>
          </Stack>

          <Stack marginTop={1} direction="row" sx={{ justifyContent: "space-between" }}>
            <Button onClick={onApplyAction}>Apply</Button>
            <Button onClick={onClearAction}>Clear</Button>
          </Stack>
        </Stack>
      </Menu>
    </>
  );
};

export default TicketFiltering;
