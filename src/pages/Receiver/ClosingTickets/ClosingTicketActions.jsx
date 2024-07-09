import { ArchiveOutlined, ArrowBackOutlined, EditOutlined, MoreHoriz, RefreshOutlined, RestoreOutlined } from "@mui/icons-material";
import { IconButton, ListItemIcon, Menu, MenuItem, Typography } from "@mui/material";
import React, { useRef } from "react";

import { theme } from "../../../theme/theme";
import useDisclosure from "../../../hooks/useDisclosure";

const ClosingTicketActions = ({ onDisapprove }) => {
  const ref = useRef(null);

  const { open, onToggle } = useDisclosure();

  const onDisapproveAction = () => {
    onToggle();
    onDisapprove();
  };

  return (
    <>
      <IconButton ref={ref} onClick={onToggle}>
        <MoreHoriz />
      </IconButton>

      <Menu anchorEl={ref.current} open={open} onClose={onToggle}>
        <MenuItem onClick={() => onDisapproveAction()}>
          <ListItemIcon>
            <ArrowBackOutlined fontSize="small" color="error" />
          </ListItemIcon>
          <Typography sx={{ fontSize: "17px", fontWeight: 500, color: theme.palette.error.main }}>Disapprove</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ClosingTicketActions;
