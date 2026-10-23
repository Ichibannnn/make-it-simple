import {
  FileDownloadOutlined,
  MoreHoriz,
  RemoveCircleOutline,
} from "@mui/icons-material";
import {
  CircularProgress,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
} from "@mui/material";

import { useRef } from "react";
import useDisclosure from "../../../hooks/useDisclosure";

const AssignDialogMenuAction = ({
  fileName,
  onDelete,
  onDownload,
  viewIsLoading,
  downloadIsLoading,
}) => {
  const ref = useRef(null);

  const { open, onToggle } = useDisclosure();

  const onDeleteAction = (fileName) => {
    onToggle();
    onDelete(fileName);
  };

  const onDownloadAction = (fileName) => {
    onDownload(fileName);
  };

  const handleMenuDownloadClick = (event, action) => {
    if (downloadIsLoading) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    action();
  };


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
        <MenuItem onClick={() => onDeleteAction(fileName)}>
          <ListItemIcon>
            <RemoveCircleOutline fontSize="small" />
          </ListItemIcon>
          Delete
        </MenuItem>

        {!!fileName.ticketAttachmentId && (
          <MenuItem
            onClick={(e) =>
              handleMenuDownloadClick(e, () => onDownloadAction(fileName))
            }
            disabled={downloadIsLoading}
          >
            <ListItemIcon>
              {downloadIsLoading ? (
                <CircularProgress size={18} />
              ) : (
                <FileDownloadOutlined fontSize="small" />
              )}
            </ListItemIcon>
            Download
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default AssignDialogMenuAction;
