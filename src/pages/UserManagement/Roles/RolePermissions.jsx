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

const RolePermissions = ({ permissions }) => {
  const ref = useRef();
  const { open, onToggle, onClose } = useDisclosure();

  const onCloseAction = () => {
    onClose();
  };

  return (
    <div>
      <IconButton ref={ref} onClick={onToggle}>
        <Tooltip title="View Permissions">
          <Badge badgeContent={permissions.length} color="primary">
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
          View Permissions
        </DialogTitle>

        <DialogContent>
          <Stack sx={{ padding: "5px", gap: 1.5 }}>
            <Autocomplete
              multiple
              options={permissions?.map((option) => option)}
              defaultValue={permissions?.map((option) => option)}
              readOnly
              renderInput={(params) => (
                <TextField {...params} label="Permissions" />
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

export default RolePermissions;
