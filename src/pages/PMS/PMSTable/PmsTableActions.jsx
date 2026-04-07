import { MoreHoriz, VisibilityOutlined } from "@mui/icons-material";
import { IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material";
import { useRef } from "react";

import useDisclosure from "../../../hooks/useDisclosure";

const PmsTableActions = ({ data, onView }) => {
  const ref = useRef(null);

  const { open, onToggle } = useDisclosure();

  const onViewAction = (data) => {
    onToggle();
    onView();
    console.log("View Data: ", data);
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
          View Data
        </MenuItem>
      </Menu>
    </>
  );
};

export default PmsTableActions;
