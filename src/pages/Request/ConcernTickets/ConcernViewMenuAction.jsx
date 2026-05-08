import { FileDownloadOutlined, MoreHoriz, RemoveCircleOutline, VisibilityOutlined } from "@mui/icons-material";
import { Box, CircularProgress, IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material";

import { useRef } from "react";
import useDisclosure from "../../../hooks/useDisclosure";

const ConcernViewMenuActions = ({ editData, fileName, onView, onViewWithoutId, onDelete, onDownload, isImageFile, viewIsLoading, downloadIsLoading, deleteIsLoading }) => {
  const ref = useRef(null);

  const { open, onToggle } = useDisclosure();

  const onViewAction = (fileName) => {
    onView(fileName);
  };

  const onViewWithoutIdAction = (fileName) => {
    onViewWithoutId(fileName);
  };

  const onDeleteAction = (fileName) => {
    // onToggle();
    onDelete(fileName);
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

  const handleMenuDeleteClick = (event, action) => {
    if (deleteIsLoading) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    action();
  };

  // useEffect(() => {
  //   if (!viewIsLoading && !downloadIsLoading) {
  //     onToggle();
  //   }
  // }, [viewIsLoading, downloadIsLoading]);

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
        disableAutoFocusItem
      >
        {!!fileName.ticketAttachmentId ? (
          <Box>
            {isImageFile(fileName.name) && (
              <MenuItem onClick={(e) => handleMenuViewClick(e, () => onViewAction(fileName))} disabled={viewIsLoading}>
                <ListItemIcon>{viewIsLoading ? <CircularProgress size={18} /> : <VisibilityOutlined fontSize="small" />}</ListItemIcon>
                View
              </MenuItem>
            )}
          </Box>
        ) : (
          <Box>
            {isImageFile(fileName.name) && (
              <MenuItem onClick={() => onViewWithoutIdAction(fileName.file)}>
                <ListItemIcon>{viewIsLoading ? <CircularProgress size={18} /> : <VisibilityOutlined fontSize="small" />}</ListItemIcon>
                View
              </MenuItem>
            )}
          </Box>
        )}

        {(editData?.concern_Status === "For Approval" || editData?.concern_Status === "") && (
          <MenuItem onClick={(e) => handleMenuDeleteClick(e, () => onDeleteAction(fileName))} disabled={deleteIsLoading}>
            <ListItemIcon>{deleteIsLoading ? <CircularProgress size={18} /> : <RemoveCircleOutline fontSize="small" />}</ListItemIcon>
            Delete
          </MenuItem>
        )}

        {!!fileName.ticketAttachmentId && (
          <MenuItem onClick={(e) => handleMenuDownloadClick(e, () => onDownloadAction(fileName))} disabled={downloadIsLoading}>
            <ListItemIcon>{downloadIsLoading ? <CircularProgress size={18} /> : <FileDownloadOutlined fontSize="small" />}</ListItemIcon>
            Download
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default ConcernViewMenuActions;
