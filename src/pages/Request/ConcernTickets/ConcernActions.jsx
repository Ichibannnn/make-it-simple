import {
  MoreHoriz,
  ReplyAllOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import { IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material";

import React, { useRef } from "react";

import useDisclosure from "../../../hooks/useDisclosure";

const ConcernActions = ({ data, onView }) => {
  const ref = useRef(null);

  const { open, onToggle } = useDisclosure();

  const onViewAction = (data) => {
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
