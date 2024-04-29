import { LanOutlined, PeopleOutlined } from "@mui/icons-material";
import {
  Autocomplete,
  Badge,
  Chip,
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
} from "@mui/material";

import React, { useRef } from "react";
import useDisclosure from "../../../hooks/useDisclosure";
import { LoadingButton } from "@mui/lab";
import { theme } from "../../../theme/theme";

const ReceiverAssignUsers = ({ permissions }) => {
  const ref = useRef();
  const { open, onToggle, onClose } = useDisclosure();

  const onCloseAction = () => {
    onClose();
  };

  return (
    <div>
      <IconButton ref={ref} onClick={onToggle}>
        <Badge badgeContent={permissions} color="primary">
          <PeopleOutlined />
        </Badge>
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
          Assigned Issue Handlers
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

export default ReceiverAssignUsers;
