import { ArrowBackOutlined, CloseOutlined, ContentCopyOutlined, DoneOutlined, MoreHoriz, VisibilityOutlined } from "@mui/icons-material";
import { IconButton, ListItemIcon, Menu, MenuItem, Typography } from "@mui/material";

import { useRef } from "react";

import useDisclosure from "../../../hooks/useDisclosure";
import { theme } from "../../../theme/theme";
import { toast } from "sonner";
import moment from "moment";

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

  const onCopyTicket = async (data) => {
    const message = `Fresh Morning, ${data?.fullName}, ${data?.department_Name}. Your request has been successfully created under Service Ticket #${moment(data?.created_At).format(
      "YYYY"
    )}-${data?.ticketRequestConcerns?.[0]?.ticketConcernId} and forwarded to our ${
      data?.channel_Name
    } for review. A member of the Support Team will contact you shortly to provide further assistance.\n\nConcern: ${data?.concern}`;

    try {
      await navigator.clipboard.writeText(message);
      toast.success(`Ticket details copied to clipboard`, {
        duration: 1500,
      });
    } catch (err) {
      toast.error("Failed to copy Ticket details");
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

        <MenuItem onClick={() => onCopyTicket(data)}>
          <ListItemIcon>
            <ContentCopyOutlined fontSize="small" />
          </ListItemIcon>
          Copy Details
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
