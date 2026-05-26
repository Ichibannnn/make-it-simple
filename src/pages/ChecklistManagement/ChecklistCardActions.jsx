import { ArchiveOutlined, EditOutlined, MoreHoriz, MoreVertOutlined, RestoreOutlined } from "@mui/icons-material";
import { IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material";
import { useRef } from "react";

import useDisclosure from "../../hooks/useDisclosure";

const ChecklistCardActions = ({ data, onArchive, onEdit }) => {
  const ref = useRef(null);

  const { open, onToggle } = useDisclosure();

  const onArchiveAction = (data) => {
    onToggle();
    onArchive({
      id: data.id,
      isActive: data.isActive,
    });
  };

  const onEditAction = (data) => {
    onToggle();
    onEdit(data);
  };

  return (
    <>
      <IconButton ref={ref} onClick={onToggle}>
        <MoreVertOutlined />
      </IconButton>

      <Menu anchorEl={ref.current} open={open} onClose={onToggle}>
        {data?.isActive && (
          <MenuItem onClick={() => onEditAction(data)}>
            <ListItemIcon>
              <EditOutlined fontSize="small" />
            </ListItemIcon>
            Edit
          </MenuItem>
        )}

        <MenuItem onClick={() => onArchiveAction(data)}>
          <ListItemIcon>{data?.isActive ? <ArchiveOutlined fontSize="small" /> : <RestoreOutlined fontSize="small" />}</ListItemIcon>

          {data?.isActive ? "Archive" : "Restore"}
        </MenuItem>
      </Menu>
    </>
  );
};

export default ChecklistCardActions;
