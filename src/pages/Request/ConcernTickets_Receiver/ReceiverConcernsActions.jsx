import {
  ArchiveOutlined,
  BackspaceOutlined,
  DoneAllOutlined,
  EditOutlined,
  MoreHoriz,
  RefreshOutlined,
  RemoveRedEyeOutlined,
  RestoreOutlined,
} from "@mui/icons-material";
import {
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

import useDisclosure from "../../../hooks/useDisclosure";
import { theme } from "../../../theme/theme";

export const ReceiverConcernsActions = ({ data, onView }) => {
  const ref = useRef(null);
  const { open, onToggle } = useDisclosure();

  const onViewAction = (data) => {
    onToggle();
    onView(data);
  };

  return (
    <>
      <IconButton ref={ref} onClick={onToggle}>
        <MoreHoriz />
      </IconButton>

      <Menu anchorEl={ref.current} open={open} onClose={onToggle}>
        <MenuItem onClick={() => onViewAction(data)}>
          <ListItemIcon>
            <RemoveRedEyeOutlined fontSize="small" />
          </ListItemIcon>
          <Typography sx={{ color: theme.palette.text.secondary }}>
            View Concern
          </Typography>
        </MenuItem>

        <MenuItem>
          <ListItemIcon>
            <DoneAllOutlined fontSize="small" color="success" />
          </ListItemIcon>
          <Typography sx={{ color: theme.palette.success.main }}>
            Approve
          </Typography>
        </MenuItem>

        <MenuItem>
          <ListItemIcon>
            <BackspaceOutlined fontSize="small" color="error" />
          </ListItemIcon>
          <Typography sx={{ color: theme.palette.error.main }}>
            Reject
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
};
