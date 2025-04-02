import { FileDownloadOutlined, MoreHoriz, RemoveCircleOutline, VisibilityOutlined } from "@mui/icons-material";
import { Box, IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material";

import React, { useRef, useState } from "react";
import useDisclosure from "../../../hooks/useDisclosure";

const MenuActions = ({ fileName, isImageFile, onView, onDownload }) => {
  const ref = useRef(null);

  const { open, onToggle } = useDisclosure();

  const onViewAction = (fileName) => {
    onToggle();
    onView(fileName.file);
  };

  const onDownloadAction = (fileName) => {
    onToggle();
    onDownload(fileName);
  };

  return (
    <>
      <IconButton ref={ref} onClick={onToggle}>
        <MoreHoriz />
      </IconButton>

      <Menu anchorEl={ref.current} open={open} onClose={onToggle} disableAutoFocusItem={true}>
        {!!fileName.ticketAttachmentId ? (
          <Box>
            {isImageFile(fileName.name) && (
              <MenuItem onClick={() => onViewAction(fileName)}>
                <ListItemIcon>
                  <VisibilityOutlined fontSize="small" />
                </ListItemIcon>
                View
              </MenuItem>
            )}
          </Box>
        ) : (
          <Box>
            {isImageFile(fileName.name) && (
              <MenuItem onClick={() => onViewAction(fileName.file)}>
                <ListItemIcon>
                  <VisibilityOutlined fontSize="small" />
                </ListItemIcon>
                View
              </MenuItem>
            )}
          </Box>
        )}

        <MenuItem onClick={() => onDownloadAction(fileName)}>
          <ListItemIcon>
            <FileDownloadOutlined fontSize="small" />
          </ListItemIcon>
          Download
        </MenuItem>
      </Menu>
    </>
  );
};

export default MenuActions;
