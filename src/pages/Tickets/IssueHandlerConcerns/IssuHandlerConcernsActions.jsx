import {
  ArrowForwardOutlined,
  ChecklistRtlOutlined,
  CloseOutlined,
  ContentCopyOutlined,
  DoneOutlined,
  KeyboardBackspaceOutlined,
  LocalPrintshopOutlined,
  ModeEditOutlineOutlined,
  MoreHoriz,
  MoveDownOutlined,
  PendingOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import { IconButton, ListItemIcon, Menu, MenuItem, Stack, Typography } from "@mui/material";
import { useRef } from "react";

import useDisclosure from "../../../hooks/useDisclosure";
import { theme } from "../../../theme/theme";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const IssueHandlerConcernsActions = ({
  data,
  onHoldTicket,
  onHoldManageTicket,
  onResumeTicket,
  onCloseTicket,
  onCancelCloseTicket,
  onManageTicket,
  onTransferTicket,
  onManageTransfer,
  onApproveTransfer,
  onCancelTransfer,
  onRejectTransferTicket,
  onPrintTicket,
  onConfirm,
  onRejectDate,
}) => {
  const ref = useRef(null);
  const userDetails = useSelector((state) => state?.user);

  const { open, onToggle } = useDisclosure();

  const onHoldTicketAction = (data) => {
    onToggle();
    onHoldTicket(data);
  };

  const onHoldManageTicketAction = (data) => {
    onToggle();
    onHoldManageTicket(data);
  };

  const onResumeTicketAction = (data) => {
    onToggle();
    onResumeTicket(data);
  };

  const onCloseTicketAction = (data) => {
    onToggle();
    onCloseTicket(data);
  };

  const onCancelCloseTicketAction = (data) => {
    onToggle();
    onCancelCloseTicket(data);
  };

  const onManageTicketAction = (data) => {
    onToggle();
    onManageTicket(data);
  };

  const onTransferTicketAction = (data) => {
    onToggle();
    onTransferTicket(data);
  };

  const onManageTransferAction = (data) => {
    onToggle();
    onManageTransfer(data);
  };

  const onApproveTransferAction = (data) => {
    onToggle();
    onApproveTransfer(data);
  };

  const onCancelTransferAction = (data) => {
    onToggle();
    onCancelTransfer(data);
  };

  const onRejectTransferAction = (data) => {
    onToggle();
    onRejectTransferTicket(data);
  };

  const onPrintTicketAction = (data) => {
    onToggle();
    onPrintTicket(data);
  };

  const onConfirmAction = (data) => {
    onToggle();
    onConfirm(data);
  };

  const onRejectDateAction = (data) => {
    onToggle();
    onRejectDate(data);
  };

  const onCopyOpenTicket = async (data) => {
    const message = `Fresh Morning, ${data?.requestor_Name}, ${data?.department_Name}. Your request has been successfully received under Service Ticket #${data?.ticketConcernId}. Will review your concern, and you will be updated once action has been taken. Thank you!`;

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

  const onCopyConfirmTicket = async (data) => {
    const message = `Fresh Morning, ${data?.requestor_Name}, ${data?.department_Name}. Your concern under Service Ticket #${data?.ticketConcernId} has been resolved and is now marked as For Confirmation. Kindly review the resolution provided. If no confirmation is received within 24 hours, the system will automatically close the ticket. If the problem is still not fixed, you may return the ticket for further assistance before the auto-closure deadline. Thank you!`;

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

  const menuItems = [];

  if (data?.ticket_Status === "Open Ticket") {
    menuItems.push(
      <MenuItem key="close" onClick={() => onCloseTicketAction(data)}>
        <ListItemIcon>
          <ChecklistRtlOutlined fontSize="small" />
        </ListItemIcon>
        Close
      </MenuItem>,
      <MenuItem key="transfer" onClick={() => onTransferTicketAction(data)}>
        <ListItemIcon>
          <MoveDownOutlined fontSize="small" />
        </ListItemIcon>
        Transfer
      </MenuItem>,
      <MenuItem key="hold" onClick={() => onHoldTicketAction(data)}>
        <ListItemIcon>
          <PendingOutlined fontSize="small" />
        </ListItemIcon>
        Hold
      </MenuItem>,
      <MenuItem key="hold" onClick={() => onCopyOpenTicket(data)}>
        <ListItemIcon>
          <ContentCopyOutlined fontSize="small" />
        </ListItemIcon>
        Copy Ticket Details
      </MenuItem>
    );
  } else {
    if (data?.getForClosingTickets?.[0]?.isApprove === false) {
      menuItems.push(
        <MenuItem key="manage" onClick={() => onManageTicketAction(data)}>
          <Stack direction="row" sx={{ alignItems: "center" }}>
            <ListItemIcon>
              <ModeEditOutlineOutlined fontSize="small" />
            </ListItemIcon>
            <Typography>Update Ticket</Typography>
          </Stack>
        </MenuItem>,
        <MenuItem key="resume" onClick={() => onCancelCloseTicketAction(data)}>
          <ListItemIcon>
            <ArrowForwardOutlined fontSize="small" color="error" />
          </ListItemIcon>
          <Typography sx={{ color: theme.palette.error.main }}>Cancel Ticket</Typography>
        </MenuItem>
      );
    }
  }

  if (data?.ticket_Status === "Transfer Approval") {
    menuItems.push(
      <MenuItem key="resume" onClick={() => onApproveTransferAction(data)}>
        <ListItemIcon>
          <ArrowForwardOutlined fontSize="small" color="success" />
        </ListItemIcon>
        <Typography sx={{ color: theme.palette.success.main }}>Approve</Typography>
      </MenuItem>,
      <MenuItem key="reject-transfer" onClick={() => onRejectTransferAction(data)}>
        <ListItemIcon>
          <KeyboardBackspaceOutlined fontSize="small" color="error" />
        </ListItemIcon>
        <Typography sx={{ color: theme.palette.error.main }}>Return</Typography>
      </MenuItem>
    );
  }

  if (data?.ticket_Status === "For On-Hold") {
    menuItems.push(
      <MenuItem key="manage-onhold" onClick={() => onHoldManageTicketAction(data)}>
        <ListItemIcon>
          <ModeEditOutlineOutlined fontSize="small" />
        </ListItemIcon>
        Update On-Hold
      </MenuItem>
    );
  }

  if (data?.ticket_Status === "Pending Request") {
    menuItems.push(
      <MenuItem key="resume" onClick={() => onRejectDateAction(data)}>
        <ListItemIcon>
          <ModeEditOutlineOutlined fontSize="small" />
        </ListItemIcon>
        <Typography>Manage Ticket</Typography>
      </MenuItem>
    );
  }

  if (data?.ticket_Status === "On-Hold") {
    menuItems.push(
      <MenuItem key="resume" onClick={() => onResumeTicketAction(data)}>
        <ListItemIcon>
          <ArrowForwardOutlined fontSize="small" color="warning" />
        </ListItemIcon>
        <Typography sx={{ color: theme.palette.warning.main }}>Resume</Typography>
      </MenuItem>
    );
  }

  if (data?.getForClosingTickets?.[0]?.isApprove === true && data?.ticket_Status !== "For Transfer") {
    menuItems.push(
      <MenuItem key="view" onClick={() => onManageTicketAction(data)}>
        <Stack direction="row" sx={{ alignItems: "center" }}>
          <ListItemIcon>
            <VisibilityOutlined fontSize="small" />
          </ListItemIcon>
          <Typography>View Ticket</Typography>
        </Stack>
      </MenuItem>
    );
  }

  if (data?.getForClosingTickets?.[0]?.isApprove === true && data?.ticket_Status !== "For Transfer" && data?.ticket_Status !== "Closed") {
    menuItems.push(
      <MenuItem onClick={() => onCopyConfirmTicket(data)}>
        <ListItemIcon>
          <ContentCopyOutlined fontSize="small" />
        </ListItemIcon>
        <Typography>Copy Ticket Details</Typography>
      </MenuItem>
    );
  }

  if (data?.getForClosingTickets?.[0]?.isApprove === true && data?.ticket_Status !== "For Transfer" && userDetails?.id === data?.requestor_By && data?.ticket_Status !== "Closed") {
    menuItems.push(
      <MenuItem onClick={() => onConfirmAction(data)}>
        <ListItemIcon>
          <DoneOutlined fontSize="small" color="success" />
        </ListItemIcon>
        <Typography sx={{ color: theme.palette.success.main }}>Confirm</Typography>
      </MenuItem>
    );
  }

  if (data?.ticket_Status === "Closed") {
    menuItems.push(
      <MenuItem key="print" onClick={() => onPrintTicketAction(data)}>
        <Stack direction="row" sx={{ alignItems: "center" }}>
          <ListItemIcon>
            <LocalPrintshopOutlined fontSize="small" color="success" />
          </ListItemIcon>
          <Typography sx={{ color: theme.palette.success.main }}>Print</Typography>
        </Stack>
      </MenuItem>
    );
  }

  if (data?.getForTransferTickets?.[0]?.isApprove === false && data?.ticket_Status === "For Transfer") {
    menuItems.push(
      <MenuItem key="manage-transfer" onClick={() => onManageTransferAction(data)}>
        <ListItemIcon>
          <MoveDownOutlined fontSize="small" />
        </ListItemIcon>
        Update Transfer
      </MenuItem>,

      <MenuItem key="cancel" onClick={() => onCancelTransferAction(data)}>
        <ListItemIcon>
          <CloseOutlined fontSize="small" color="error" />
        </ListItemIcon>
        <Typography sx={{ color: theme.palette.error.main }}>Cancel</Typography>
      </MenuItem>
    );
  }

  if (data?.getForTransferTickets?.[0]?.isApprove === true && data?.ticket_Status === "For Transfer") {
    menuItems.push(
      <MenuItem key="manage-transfer" onClick={() => onManageTransferAction(data)}>
        <ListItemIcon>
          <MoveDownOutlined fontSize="small" />
        </ListItemIcon>
        View Transfer
      </MenuItem>
    );
  }

  // console.log("Data: ", data);

  return (
    <>
      <IconButton ref={ref} onClick={onToggle}>
        <MoreHoriz />
      </IconButton>

      <Menu anchorEl={ref.current} open={open} onClose={onToggle}>
        {menuItems}
      </Menu>
    </>
  );
};

export default IssueHandlerConcernsActions;
