import { MoreHoriz, RemoveCircleOutline, VisibilityOutlined } from "@mui/icons-material";
import { IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material";

import React, { useRef } from "react";
import useDisclosure from "../../../../hooks/useDisclosure";

const OnHoldMenuActions = ({ fileName, onView, onDelete, isImageFile }) => {
  const ref = useRef(null);

  const { open, onToggle } = useDisclosure();

  const onViewAction = (fileName) => {
    onToggle();
    onView(fileName.file);
  };

  const onDeleteAction = (fileName) => {
    onToggle();
    onDelete(fileName);
  };

  return (
    <>
      <IconButton ref={ref} onClick={onToggle}>
        <MoreHoriz />
      </IconButton>

      <Menu anchorEl={ref.current} open={open} onClose={onToggle}>
        {isImageFile(fileName.name) && (
          <MenuItem onClick={() => onViewAction(fileName)}>
            <ListItemIcon>
              <VisibilityOutlined fontSize="small" />
            </ListItemIcon>
            View
          </MenuItem>
        )}

        <MenuItem onClick={() => onDeleteAction(fileName)}>
          <ListItemIcon>
            <RemoveCircleOutline fontSize="small" />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </>
  );
};

export default OnHoldMenuActions;
