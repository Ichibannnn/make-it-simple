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

import React, { useRef } from "react";
import useDisclosure from "../../../hooks/useDisclosure";
import { LoadingButton } from "@mui/lab";

const ReceiverBusinessUnit = ({ businessUnits }) => {
  const ref = useRef();
  const { open, onToggle, onClose } = useDisclosure();

  const onCloseAction = () => {
    onClose();
  };

  console.log("Business Units: ", businessUnits);

  return (
    <div>
      <IconButton ref={ref} onClick={onToggle}>
        <Tooltip title="View Tagged">
          <Badge badgeContent={businessUnits.length} color="primary">
            <LanOutlined />
          </Badge>
        </Tooltip>
      </IconButton>

      <Dialog fullWidth maxWidth="xs" open={open}>
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
          View Business Units
        </DialogTitle>

        <DialogContent>
          <Stack sx={{ padding: "5px", gap: 1.5 }}>
            <Autocomplete
              multiple
              options={businessUnits || []}
              defaultValue={businessUnits}
              getOptionLabel={(option) =>
                `${option.businessUnit_Code} - ${option.businessUnit_Name}`
              }
              readOnly
              renderInput={(params) => (
                <TextField {...params} label="Business Units" />
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

export default ReceiverBusinessUnit;
