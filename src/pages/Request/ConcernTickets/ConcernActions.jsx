import { ArrowBackOutlined, CloseOutlined, ContentCopyOutlined, DoneOutlined, MoreHoriz, ReplyAllOutlined, VisibilityOutlined } from "@mui/icons-material";
import { IconButton, ListItemIcon, Menu, MenuItem, Typography } from "@mui/material";

import React, { useRef } from "react";

import useDisclosure from "../../../hooks/useDisclosure";
import { theme } from "../../../theme/theme";
import { toast } from "sonner";

const ConcernActions = ({ data, onView, onConfirm, onReturn, onCancel, status }) => {
  const ref = useRef(null);

  const { open, onToggle } = useDisclosure();

  const onViewAction = (data) => {
    onToggle();
    onView(data);
  };

  const onConfirmAction = (data) => {
    onToggle();
    onConfirm(data);
  };

  const onReturnAction = (data) => {
    onToggle();
    onReturn(data);
  };

  const onCancelAction = (data) => {
    onToggle();
    onCancel(data);
  };

  const onCopyTicket = async (id) => {
    try {
      await navigator.clipboard.writeText(id);
      toast.success(`Ticket #${id} copied to clipboard`, {
        duration: 1500,
      });
    } catch (err) {
      toast.error("Failed to copy Ticket #");
    }
    onToggle();
  };

  return (
    <>
      <IconButton ref={ref} onClick={onToggle}>
        <MoreHoriz sx={{ color: "#fff" }} />
      </IconButton>

      <Menu anchorEl={ref.current} open={open} onClose={onToggle}>
        <MenuItem onClick={() => onViewAction(data)}>
          <ListItemIcon>
            <VisibilityOutlined fontSize="small" />
          </ListItemIcon>
          View Concerns
        </MenuItem>

        {data?.concern_Status === "For Confirmation" && (
          <MenuItem onClick={() => onConfirmAction(data)}>
            <ListItemIcon>
              <DoneOutlined fontSize="small" color="success" />
            </ListItemIcon>
            <Typography sx={{ fontSize: "17px", fontWeight: 500, color: theme.palette.success.main }}>Confirm</Typography>
          </MenuItem>
        )}

        <MenuItem onClick={() => onCopyTicket(data?.ticketRequestConcerns?.[0]?.ticketConcernId)}>
          <ListItemIcon>
            <ContentCopyOutlined fontSize="small" />
          </ListItemIcon>
          Copy Ticket #
        </MenuItem>

        {data?.concern_Status === "For Confirmation" && (
          <MenuItem onClick={() => onReturnAction(data)}>
            <ListItemIcon>
              <ArrowBackOutlined fontSize="small" color="error" />
            </ListItemIcon>
            <Typography sx={{ fontSize: "17px", fontWeight: 500, color: theme.palette.error.main }}>Return</Typography>
          </MenuItem>
        )}

        {(data?.concern_Status === "" || data?.concern_Status === "For Approval") && (
          <MenuItem onClick={() => onCancelAction(data)}>
            <ListItemIcon>
              <CloseOutlined fontSize="small" color="error" />
            </ListItemIcon>
            <Typography sx={{ fontSize: "17px", fontWeight: 500, color: theme.palette.error.main }}>Cancel</Typography>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default ConcernActions;
