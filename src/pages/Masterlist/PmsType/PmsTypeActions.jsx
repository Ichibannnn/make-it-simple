import { ArchiveOutlined, EditOutlined, MoreHoriz, RestoreOutlined } from "@mui/icons-material";
import { IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material";
import { useRef } from "react";

import useDisclosure from "../../../hooks/useDisclosure";

const PmsTypeActions = ({ data, onArchive, onUpdate }) => {
  const ref = useRef(null);
  const { open, onToggle } = useDisclosure();

  const handleArchive = () => {
    onToggle();
    onArchive({ id: data.id, isActive: data.isActive });
  };

  const handleUpdate = () => {
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
          <MenuItem onClick={handleUpdate}>
            <ListItemIcon>
              <EditOutlined fontSize="small" />
            </ListItemIcon>
            Edit
          </MenuItem>
        )}

        <MenuItem onClick={handleArchive}>
          <ListItemIcon>{data?.isActive ? <ArchiveOutlined fontSize="small" /> : <RestoreOutlined fontSize="small" />}</ListItemIcon>
          {data?.isActive ? "Archive" : "Restore"}
        </MenuItem>
      </Menu>
    </>
  );
};

export default PmsTypeActions;
