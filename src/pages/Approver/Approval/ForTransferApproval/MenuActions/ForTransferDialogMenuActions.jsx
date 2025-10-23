import { FileDownloadOutlined, MoreHoriz, VisibilityOutlined } from "@mui/icons-material";
import { Box, CircularProgress, IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material";

import { useEffect, useRef } from "react";
import useDisclosure from "../../../../../hooks/useDisclosure";

const ForTransferDialogMenuActions = ({ fileName, onView, onDownload, isImageFile, viewIsLoading, downloadIsLoading }) => {
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

      <Menu
        anchorEl={ref.current}
        open={open}
        onClose={() => {
          if (!viewIsLoading) onToggle();
        }}
        disableAutoFocusItem={true}
      >
        <Box>
          {isImageFile(fileName.name) && (
            <MenuItem onClick={(e) => handleMenuViewClick(e, () => onViewAction(fileName))} disabled={viewIsLoading}>
              <ListItemIcon>{viewIsLoading ? <CircularProgress size={18} /> : <VisibilityOutlined fontSize="small" />}</ListItemIcon>
              View
            </MenuItem>
          )}
        </Box>

        <MenuItem onClick={(e) => handleMenuDownloadClick(e, () => onDownloadAction(fileName))} disabled={downloadIsLoading}>
          <ListItemIcon>{downloadIsLoading ? <CircularProgress size={18} /> : <FileDownloadOutlined fontSize="small" />}</ListItemIcon>
          Download
        </MenuItem>
      </Menu>
    </>
  );
};

export default ForTransferDialogMenuActions;
