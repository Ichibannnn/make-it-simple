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

const ReceiverBusinessUnit = ({ businessUnits }) => {
  const ref = useRef();
  const { open, onToggle } = useDisclosure();

  return (
    <div>
      <IconButton ref={ref} onClick={onToggle}>
        <Tooltip title="View Tagged">
          <Badge badgeContent={businessUnits.length} color="primary">
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
          {businessUnits?.map((item, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`${item.businessUnit_Code} - ${item.businessUnit_Name}`}
              />
            </ListItem>
          ))}
        </List>
      </Menu>
    </div>
  );
};

export default ReceiverBusinessUnit;
