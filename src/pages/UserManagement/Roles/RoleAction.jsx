import {
  ArchiveOutlined,
  EditOutlined,
  MoreHoriz,
  RefreshOutlined,
  RestoreOutlined,
} from "@mui/icons-material";
import { IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material";
import React, { useRef } from "react";
import Swal from "sweetalert2";

import useDisclosure from "../../../hooks/useDisclosure";

const RoleAction = ({ data, onArchive, onUpdate }) => {
  const ref = useRef(null);

  const { open, onToggle } = useDisclosure();

  const onArchiveAction = (data) => {
    onToggle();
    onArchive({
      id: data.id,
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
              <EditOutlined fontSize="small" />
            </ListItemIcon>
            Edit
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

export default RoleAction;
