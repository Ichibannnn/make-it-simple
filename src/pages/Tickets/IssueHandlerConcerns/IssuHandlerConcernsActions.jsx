import {
  ArchiveOutlined,
  ChecklistRtlOutlined,
  EditOutlined,
  EventRepeatOutlined,
  HistoryOutlined,
  MoreHoriz,
  MoveDownOutlined,
  RefreshOutlined,
  RestoreOutlined,
} from "@mui/icons-material";
import { IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material";
import React, { useRef } from "react";
import Swal from "sweetalert2";

import useDisclosure from "../../../hooks/useDisclosure";

const IssueHandlerConcernsActions = ({ data, onReset, onArchive, onUpdate }) => {
  const ref = useRef(null);

  const { open, onToggle } = useDisclosure();

  const onResetAction = (data) => {
    onToggle();
  };

  return (
    <>
      <IconButton ref={ref} onClick={onToggle}>
        <MoreHoriz />
      </IconButton>

      <Menu anchorEl={ref.current} open={open} onClose={onToggle}>
        <MenuItem>
          <ListItemIcon>
            <ChecklistRtlOutlined fontSize="small" />
          </ListItemIcon>
          Close Ticket
        </MenuItem>

        <MenuItem onClick={() => onResetAction(data)}>
          <ListItemIcon>
            <MoveDownOutlined fontSize="small" />
          </ListItemIcon>
          Transfer Ticket
        </MenuItem>

        <MenuItem onClick={() => onResetAction(data)}>
          <ListItemIcon>
            <HistoryOutlined fontSize="small" />
          </ListItemIcon>
          Reticket Ticket
        </MenuItem>

        <MenuItem>
          <ListItemIcon>
            <EventRepeatOutlined fontSize="small" />{" "}
          </ListItemIcon>
          Redate Ticket
        </MenuItem>
      </Menu>
    </>
  );
};

export default IssueHandlerConcernsActions;
