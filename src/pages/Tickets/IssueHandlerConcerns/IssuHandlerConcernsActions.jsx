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

const IssueHandlerConcernsActions = ({ data, onCloseTicket }) => {
  const ref = useRef(null);

  const { open, onToggle } = useDisclosure();

  const onCloseTickeAction = (data) => {
    onToggle();
    onCloseTicket(data);
  };

  return (
    <>
      <IconButton ref={ref} onClick={onToggle}>
        <MoreHoriz />
      </IconButton>

      <Menu anchorEl={ref.current} open={open} onClose={onToggle}>
        <MenuItem onClick={() => onCloseTickeAction(data)}>
          <ListItemIcon>
            <ChecklistRtlOutlined fontSize="small" />
          </ListItemIcon>
          Close
        </MenuItem>

        <MenuItem>
          <ListItemIcon>
            <MoveDownOutlined fontSize="small" />
          </ListItemIcon>
          Transfer
        </MenuItem>

        <MenuItem>
          <ListItemIcon>
            <HistoryOutlined fontSize="small" />
          </ListItemIcon>
          Reticket
        </MenuItem>

        <MenuItem>
          <ListItemIcon>
            <EventRepeatOutlined fontSize="small" />{" "}
          </ListItemIcon>
          Redate
        </MenuItem>
      </Menu>
    </>
  );
};

export default IssueHandlerConcernsActions;
