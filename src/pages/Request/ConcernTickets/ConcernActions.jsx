import { ArrowBackOutlined, DoneOutlined, MoreHoriz, ReplyAllOutlined, VisibilityOutlined } from "@mui/icons-material";
import { IconButton, ListItemIcon, Menu, MenuItem, Typography } from "@mui/material";

import React, { useRef } from "react";

import useDisclosure from "../../../hooks/useDisclosure";
import { theme } from "../../../theme/theme";

const ConcernActions = ({ data, onView, onConfirm, onReturn }) => {
  const ref = useRef(null);

  const { open, onToggle } = useDisclosure();

  const onViewAction = (data) => {
    onToggle();
    onView(data);
  };

  const onConfirmAction = (data) => {
    onToggle();
    onConfirm(data);
  };

  const onReturnAction = (data) => {
    onToggle();
    onReturn(data);
  };

  return (
    <>
      <IconButton ref={ref} onClick={onToggle}>
        <MoreHoriz />
      </IconButton>

      <Menu anchorEl={ref.current} open={open} onClose={onToggle}>
        <MenuItem onClick={() => onViewAction(data)}>
          <ListItemIcon>
            <VisibilityOutlined fontSize="small" />
          </ListItemIcon>
          View Concerns
        </MenuItem>

        {data?.concern_Status === "For Confirmation" && (
          <MenuItem onClick={() => onConfirmAction(data)}>
            <ListItemIcon>
              <DoneOutlined fontSize="small" color="success" />
            </ListItemIcon>
            <Typography sx={{ fontSize: "17px", fontWeight: 500, color: theme.palette.success.main }}>Confirm</Typography>
          </MenuItem>
        )}

        {data?.concern_Status === "For Confirmation" && (
          <MenuItem onClick={() => onReturnAction(data)}>
            <ListItemIcon>
              <ArrowBackOutlined fontSize="small" color="error" />
            </ListItemIcon>
            <Typography sx={{ fontSize: "17px", fontWeight: 500, color: theme.palette.error.main }}>Return</Typography>
          </MenuItem>
        )}

        <MenuItem>
          <ListItemIcon>
            <ReplyAllOutlined fontSize="small" />
          </ListItemIcon>
          Reply
        </MenuItem>
      </Menu>
    </>
  );
};

export default ConcernActions;
