import {
  ArchiveOutlined,
  EditOutlined,
  GroupsOutlined,
  MoreHoriz,
  RestoreOutlined,
} from "@mui/icons-material";
import { IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material";
import React, { useRef } from "react";

import useDisclosure from "../../../hooks/useDisclosure";

const ChannelActions = ({ data, onArchive, onUpdate }) => {
  const ref = useRef(null);

  const { open, onToggle } = useDisclosure();

  const onArchiveAction = (data) => {
    onToggle();
    onArchive({
      id: data.id,
      isActive: data.is_Active,
    });
  };

  const onUpdateAction = (data) => {
    onToggle();
    onUpdate(data);
  };

  return (
    <>
      <IconButton ref={ref} onClick={onToggle}>
        <MoreHoriz />
      </IconButton>

      <Menu anchorEl={ref.current} open={open} onClose={onToggle}>
        {data?.is_Active && (
          <MenuItem onClick={() => onUpdateAction(data)}>
            <ListItemIcon>
              <GroupsOutlined fontSize="small" />
            </ListItemIcon>
            Manage Channel
          </MenuItem>
        )}

        <MenuItem onClick={() => onArchiveAction(data)}>
          <ListItemIcon>
            {data?.is_Active ? (
              <ArchiveOutlined fontSize="small" />
            ) : (
              <RestoreOutlined fontSize="small" />
            )}
          </ListItemIcon>

          {data?.is_Active ? "Archive" : "Restore"}
        </MenuItem>
      </Menu>
    </>
  );
};

export default ChannelActions;
