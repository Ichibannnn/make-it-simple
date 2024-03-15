import { GroupsOutlined, LanOutlined } from "@mui/icons-material";
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

const ChannelMembers = ({ members }) => {
  const ref = useRef();
  const { open, onToggle } = useDisclosure();

  return (
    <div>
      <IconButton ref={ref} onClick={onToggle}>
        <Tooltip title="View Members">
          <Badge badgeContent={members.length} color="primary">
            <GroupsOutlined />
          </Badge>
        </Tooltip>
      </IconButton>

      {members.length !== 0 ? (
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
            {members?.map((item, index) => (
              <ListItem key={index}>
                <ListItemText primary={item.fullname ? item.fullname : ""} />
              </ListItem>
            ))}
          </List>
        </Menu>
      ) : (
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
            <ListItem>
              <ListItemText primary="No member." sx={{ color: "#D27D0E" }} />
            </ListItem>
          </List>
        </Menu>
      )}
    </div>
  );
};

export default ChannelMembers;
