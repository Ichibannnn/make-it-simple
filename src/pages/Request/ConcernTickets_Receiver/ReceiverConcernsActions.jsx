import {
  ArchiveOutlined,
  BackspaceOutlined,
  DoneAllOutlined,
  EditOutlined,
  MoreHoriz,
  RefreshOutlined,
  RemoveRedEyeOutlined,
  RestoreOutlined,
} from "@mui/icons-material";
import {
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

import useDisclosure from "../../../hooks/useDisclosure";
import { theme } from "../../../theme/theme";

import { useLazyGetReceiverAttachmentQuery } from "../../../features/api_request/concerns_receiver/concernReceiverApi";

export const ReceiverConcernsActions = ({ data, onView }) => {
  const [attachments, setAttachments] = useState([]);

  console.log("Attachment Data: ", attachments);

  const ref = useRef(null);
  const { open, onToggle } = useDisclosure();

  const [getReceiverAttachment, { data: attachmentData }] =
    useLazyGetReceiverAttachmentQuery();

  const onViewAction = (data) => {
    onToggle();
    onView(data);
  };

  const getAttachmentData = async (id) => {
    try {
      const res = await getReceiverAttachment({ Id: id }).unwrap();

      console.log("res", res);

      setAttachments(
        res?.value?.[0]?.attachments?.map((item) => ({
          ticketAttachmentId: item.ticketAttachmentId,
          name: item.fileName,
          size: (item.fileSize / (1024 * 1024)).toFixed(2),
          link: item.attachment,
        }))
      );
    } catch (error) {}
  };

  useEffect(() => {
    if (data) {
      getAttachmentData(data.requestGeneratorId);
    }
  }, [data]);

  return (
    <>
      <IconButton ref={ref} onClick={onToggle}>
        <MoreHoriz />
      </IconButton>

      <Menu anchorEl={ref.current} open={open} onClose={onToggle}>
        <MenuItem onClick={() => onViewAction(data)}>
          <ListItemIcon>
            <RemoveRedEyeOutlined fontSize="small" />
          </ListItemIcon>
          <Typography sx={{ color: theme.palette.text.secondary }}>
            View Concern
          </Typography>
        </MenuItem>

        <MenuItem>
          <ListItemIcon>
            <DoneAllOutlined fontSize="small" color="success" />
          </ListItemIcon>
          <Typography sx={{ color: theme.palette.success.main }}>
            Approve
          </Typography>
        </MenuItem>

        <MenuItem>
          <ListItemIcon>
            <BackspaceOutlined fontSize="small" color="error" />
          </ListItemIcon>
          <Typography sx={{ color: theme.palette.error.main }}>
            Reject
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
};
