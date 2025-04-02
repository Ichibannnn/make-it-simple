import { FileDownloadOutlined, MoreHoriz, RemoveCircleOutline, VisibilityOutlined } from "@mui/icons-material";
import { Box, IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material";

import React, { useRef } from "react";
import useDisclosure from "../../../../hooks/useDisclosure";

const ManageForClosingMenuActions = ({ data, fileName, onView, onViewWithoutId, onDelete, onDownload, isImageFile }) => {
  const ref = useRef(null);

  const { open, onToggle } = useDisclosure();

  const onViewAction = (fileName) => {
    onToggle();
    onView(fileName);
  };

  const onViewWithoutIdAction = (fileName) => {
    console.log("File", fileName);

    onToggle();
    onViewWithoutId(fileName);
  };

  const onDeleteAction = (fileName) => {
    onToggle();
    onDelete(fileName);
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
              <MenuItem onClick={() => onViewWithoutIdAction(fileName.file)}>
                <ListItemIcon>
                  <VisibilityOutlined fontSize="small" />
                </ListItemIcon>
                View
              </MenuItem>
            )}
          </Box>
        )}

        {data?.getForClosingTickets?.[0]?.isApprove === false && (
          <MenuItem onClick={() => onDeleteAction(fileName)}>
            <ListItemIcon>
              <RemoveCircleOutline fontSize="small" />
            </ListItemIcon>
            Delete
          </MenuItem>
        )}

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

export default ManageForClosingMenuActions;
