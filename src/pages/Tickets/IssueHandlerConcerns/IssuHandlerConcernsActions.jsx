import {
  ArchiveOutlined,
  ChecklistRtlOutlined,
  EditOutlined,
  EventRepeatOutlined,
  HistoryOutlined,
  ModeEditOutlineOutlined,
  MoreHoriz,
  MoveDownOutlined,
  RefreshOutlined,
  RestoreOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import { IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material";
import React, { useRef } from "react";
import Swal from "sweetalert2";

import useDisclosure from "../../../hooks/useDisclosure";

const IssueHandlerConcernsActions = ({ data, onCloseTicket, onManageTicket }) => {
  const ref = useRef(null);

  const { open, onToggle } = useDisclosure();

  const onCloseTicketAction = (data) => {
    onToggle();
    onCloseTicket(data);
  };

  const onManageTicketAction = (data) => {
    onToggle();
    onManageTicket(data);
  };

  return (
    <>
      <IconButton ref={ref} onClick={onToggle}>
        <MoreHoriz />
      </IconButton>

      <Menu anchorEl={ref.current} open={open} onClose={onToggle}>
        {data?.ticket_Status === "Open Ticket" ? (
          <MenuItem onClick={() => onCloseTicketAction(data)}>
            <ListItemIcon>
              <ChecklistRtlOutlined fontSize="small" />
            </ListItemIcon>
            Close
          </MenuItem>
        ) : (
          <MenuItem onClick={() => onManageTicketAction(data)}>
            <ListItemIcon>
              <ModeEditOutlineOutlined fontSize="small" />
            </ListItemIcon>
            Manage Ticket
          </MenuItem>
        )}

        {data?.ticket_Status === "Open Ticket" && (
          <MenuItem>
            <ListItemIcon>
              <MoveDownOutlined fontSize="small" />
            </ListItemIcon>
            Transfer
          </MenuItem>
        )}

        {data?.ticket_Status === "Open Ticket" && (
          <MenuItem>
            <ListItemIcon>
              <HistoryOutlined fontSize="small" />
            </ListItemIcon>
            Reticket
          </MenuItem>
        )}

        {data?.ticket_Status === "Open Ticket" && (
          <MenuItem>
            <ListItemIcon>
              <EventRepeatOutlined fontSize="small" />{" "}
            </ListItemIcon>
            Redate
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default IssueHandlerConcernsActions;
