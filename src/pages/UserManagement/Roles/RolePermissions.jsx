import { LanOutlined } from "@mui/icons-material";
import {
  Badge,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu,
  Tooltip,
} from "@mui/material";

import React, { useRef } from "react";
import useDisclosure from "../../../hooks/useDisclosure";

const RolePermissions = ({ permissions }) => {
  const ref = useRef();
  const { open, onToggle } = useDisclosure();

  console.log("Permissions: ", permissions);

  return (
    <div>
      <IconButton ref={ref} onClick={onToggle}>
        <Tooltip title="View Permissions">
          <Badge badgeContent={permissions.length} color="primary">
            <LanOutlined />
          </Badge>
        </Tooltip>
      </IconButton>

      <Menu
        anchorEl={ref.current}
        open={open}
        onClose={onToggle}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <List dense>
          {permissions?.map((item, index) => (
            <ListItem key={index}>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
      </Menu>
    </div>
  );
};

export default RolePermissions;
