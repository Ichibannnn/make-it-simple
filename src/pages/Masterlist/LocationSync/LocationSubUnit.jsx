import React, { useRef } from "react";
import { LanOutlined } from "@mui/icons-material";

import {
  Autocomplete,
  Badge,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import useDisclosure from "../../../hooks/useDisclosure";
import { LoadingButton } from "@mui/lab";

const LocationSubUnit = ({ subUnits }) => {
  const ref = useRef();
  const { open, onToggle, onClose } = useDisclosure();

  const onCloseAction = () => {
    onClose();
  };

  // console.log("Sub Units: ", subUnits);

  return (
    <div>
      <IconButton ref={ref} onClick={onToggle}>
        <Tooltip title="View Sub Units">
          <Badge badgeContent={subUnits.length} color="primary">
            <LanOutlined />
          </Badge>
        </Tooltip>
      </IconButton>

      <Dialog fullWidth maxWidth="sm" open={open}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "center",
            paddingTop: 0,
            paddingBottom: 0,
            marginBlockEnd: "5.28px",
            fontSize: "18px",
            fontWeight: 700,
            color: "#48BB78",
          }}
        >
          View Sub Units
        </DialogTitle>

        <DialogContent>
          <Stack sx={{ padding: "5px", gap: 1.5 }}>
            <Autocomplete
              multiple
              options={subUnits || []}
              defaultValue={subUnits}
              getOptionLabel={(option) =>
                `${option.subUnit_Code} - ${option.subUnit_Name}`
              }
              readOnly
              renderInput={(params) => (
                <TextField {...params} label="Sub Units" />
              )}
              renderOption={(option) => (
                <Tooltip title={option.subUnit_Code - option.subUnit_Name}>
                  {option.subUnit_Code} - {option.subUnit_Name}
                </Tooltip>
              )}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <LoadingButton variant="text" onClick={onCloseAction} size="small">
            Close
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LocationSubUnit;
