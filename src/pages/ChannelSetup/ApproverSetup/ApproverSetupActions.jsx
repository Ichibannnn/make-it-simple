import { EditOutlined, MoreHoriz } from "@mui/icons-material";
import { IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material";
import { useRef } from "react";
import useDisclosure from "../../../hooks/useDisclosure";

export const ApproverSetupActions = ({ data, onUpdate }) => {
  const ref = useRef(null);

  const { open, onToggle } = useDisclosure();

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
        <MenuItem onClick={() => onUpdateAction(data)}>
          <ListItemIcon>
            <EditOutlined fontSize="small" />
          </ListItemIcon>
          Manage Issue Handlers
        </MenuItem>
      </Menu>
    </>
  );
};
