import {
  ArchiveOutlined,
  EditOutlined,
  MoreHoriz,
  RefreshOutlined,
  ReplyAllOutlined,
  RestoreOutlined,
  ViewAgendaOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import { IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material";
import React, { useRef } from "react";

import useDisclosure from "../../../hooks/useDisclosure";

const ConcernActions = ({ data, onView }) => {
  const ref = useRef(null);

  const { open, onToggle } = useDisclosure();

  // const onArchiveAction = (data) => {
  //   onToggle();
  //   onArchive({
  //     id: data.id,
  //     isActive: data.is_Active,
  //   });
  // };

  const onViewAction = (data) => {
    console.log("Data: ", data);

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
            <VisibilityOutlined fontSize="small" />
          </ListItemIcon>
          View Concerns
        </MenuItem>

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
