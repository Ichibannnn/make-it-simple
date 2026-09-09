import { ArchiveOutlined, EditOutlined, MoreHoriz, RestoreOutlined } from "@mui/icons-material";
import { IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material";
import { useRef } from "react";

import useDisclosure from "../../../hooks/useDisclosure";

const BuildingActions = ({ data, onArchive, onUpdate }) => {
  const ref = useRef(null);

  const { open, onToggle } = useDisclosure();

  const onArchiveAction = (data) => {
    onToggle();
    onArchive({
      id: data.id,
      isActive: data.isActive,
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
        {data?.isActive && (
          <MenuItem onClick={() => onUpdateAction(data)}>
            <ListItemIcon>
              <EditOutlined fontSize="small" />
            </ListItemIcon>
            Edit
          </MenuItem>
        )}

        <MenuItem onClick={() => onArchiveAction(data)}>
          <ListItemIcon>
            {data?.isActive ? <ArchiveOutlined fontSize="small" /> : <RestoreOutlined fontSize="small" />}
          </ListItemIcon>

          {data?.isActive ? "Archive" : "Restore"}
        </MenuItem>
      </Menu>
    </>
  );
};

export default BuildingActions;
