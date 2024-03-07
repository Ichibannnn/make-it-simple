import { LanOutlined } from "@mui/icons-material";
import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu,
  Tooltip,
} from "@mui/material";

import React, { useRef } from "react";
import useDisclosure from "../../../hooks/useDisclosure";

export const CategorySubCat = ({ subCategories }) => {
  const ref = useRef();
  const { open, onToggle } = useDisclosure();

  return (
    <div>
      <IconButton ref={ref} onClick={onToggle}>
        <Tooltip title="View Permissions">
          <LanOutlined />
        </Tooltip>
      </IconButton>

      {subCategories.length !== 0 ? (
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
            {subCategories?.map((item, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={
                    item.subCategory_Description
                      ? item.subCategory_Description
                      : "sad"
                  }
                />
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
              <ListItemText primary="No sub unit." sx={{ color: "#D27D0E" }} />
            </ListItem>
          </List>
        </Menu>
      )}
    </div>
  );
};
