import { FileDownloadOutlined, MoreHoriz, VisibilityOutlined } from "@mui/icons-material";
import { Box, IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material";

import React, { useEffect, useRef } from "react";
import useDisclosure from "../../../../../hooks/useDisclosure";

const TargetApprovalMenuActions = ({ fileName, onView, onDownload, isImageFile, viewIsLoading, downloadIsLoading }) => {
  const ref = useRef(null);

  const { open, onToggle } = useDisclosure();

  const onViewAction = (fileName) => {
    onView(fileName);
  };

  const onDownloadAction = (fileName) => {
    onDownload(fileName);
  };

  const handleMenuViewClick = (event, action) => {
    if (viewIsLoading) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    action();
  };

  const handleMenuDownloadClick = (event, action) => {
    if (downloadIsLoading) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    action();
  };

  useEffect(() => {
    if (!viewIsLoading && !downloadIsLoading) {
      onToggle();
    }
  }, [viewIsLoading, downloadIsLoading]);

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

export default TargetApprovalMenuActions;
