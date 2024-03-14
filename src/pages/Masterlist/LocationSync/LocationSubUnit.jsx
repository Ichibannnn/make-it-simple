import React, { useRef } from "react";
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
import useDisclosure from "../../../hooks/useDisclosure";

const LocationSubUnit = ({ subUnits }) => {
  const ref = useRef();
  const { open, onToggle } = useDisclosure();

  console.log("Sub units: ", subUnits);

  return (
    <div>
      <IconButton ref={ref} onClick={onToggle}>
        <Tooltip title="View Sub Units">
          <Badge badgeContent={subUnits.length} color="primary">
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
          {subUnits?.map((item, index) => (
            <ListItem key={index}>
              <ListItemText primary={item.subUnit_Name} />
            </ListItem>
          ))}
        </List>
      </Menu>
    </div>
  );
};

export default LocationSubUnit;
