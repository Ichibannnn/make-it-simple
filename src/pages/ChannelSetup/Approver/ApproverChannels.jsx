import React, { useRef } from "react";
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

import useDisclosure from "../../../hooks/useDisclosure";

const ApproverChannels = ({ approvers }) => {
  const ref = useRef();
  const { open, onToggle } = useDisclosure();

  console.log("Approvers: ", approvers);

  return (
    <div>
      <IconButton ref={ref} onClick={onToggle}>
        <Tooltip title="View Approvers">
          <Badge badgeContent={approvers?.length} color="primary">
            <GroupsOutlined />
          </Badge>
        </Tooltip>
      </IconButton>

      {/* <Menu
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
          {approvers?.map((item, index) => (
            <ListItem key={index}>
              <ListItemText primary={item.fullname} />
            </ListItem>
          ))}
        </List>
      </Menu> */}
    </div>
  );
};

export default ApproverChannels;
