import { FileDownloadOutlined, MoreHoriz, RemoveCircleOutline, VisibilityOutlined } from "@mui/icons-material";
import { Box, IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material";

import React, { useRef } from "react";
import useDisclosure from "../../../../../hooks/useDisclosure";

const TicketApprovalMenuActions = ({ fileName, onView, onDownload, isImageFile }) => {
  const ref = useRef(null);

  const { open, onToggle } = useDisclosure();

  const onViewAction = (fileName) => {
    onToggle();
    onView(fileName);
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

        {!!fileName.ticketAttachmentId && (
          <MenuItem onClick={() => onDownloadAction(fileName)}>
            <ListItemIcon>
              <FileDownloadOutlined fontSize="small" />
            </ListItemIcon>
            Download
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default TicketApprovalMenuActions;
