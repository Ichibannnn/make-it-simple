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
import { Toaster, toast } from "sonner";
import { useApproveReceiverConcernMutation } from "../../../features/api_request/concerns_receiver/concernReceiverApi";

export const ReceiverConcernsActions = ({ data, onView, onClose }) => {
  const ref = useRef(null);
  const { open, onToggle } = useDisclosure();

  const [disabledButton, setDisabledButton] = useState(false);

  const [
    approveReceiverConcern,
    {
      isLoading: approveReceiverConcernIsLoading,
      isFetching: approveReceiverConcernIsFetching,
    },
  ] = useApproveReceiverConcernMutation();

  const onViewAction = (data) => {
    onToggle();
    onView(data);
  };

  const onApproveAction = (data) => {
    console.log("Data: ", data);

    Swal.fire({
      title: "Confirmation",
      text: "Approve this concern?",
      icon: "info",
      color: "white",
      showCancelButton: true,
      background: "#111927",
      confirmButtonColor: "#9e77ed",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      cancelButtonColor: "#1C2536",
      heightAuto: false,
      width: "30em",
      customClass: {
        container: "custom-container",
        title: "custom-title",
        htmlContainer: "custom-text",
        icon: "custom-icon",
        confirmButton: "custom-confirm-btn",
        cancelButton: "custom-cancel-btn",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const requestTransactionId = data?.requestTransactionId;
        const issueHandler =
          data?.ticketRequestConcerns[0]?.ticketConcerns?.map(
            (item) => item.userId
          );

        const approvePayload = {
          concern: issueHandler?.map((item) => ({
            requestTransactionId: requestTransactionId,
            issueHandler: item,
          })),
        };

        approveReceiverConcern(approvePayload)
          .unwrap()
          .then(() => {
            toast.success("Success!", {
              description: "Approve concern successfully!",
              duration: 1500,
            });
            // setAddData(null);
            // setEditData(null);
            onClose();
          })
          .catch((err) => {
            console.log("Error", err);
            toast.error("Error!", {
              description: err.data.error.message,
              duration: 1500,
            });
          });
      }
    });
  };

  useEffect(() => {
    if (data) {
      const bindFunction = data?.ticketRequestConcerns?.map((item) => ({
        categoryId: item?.categoryId,
      }));

      if (bindFunction?.[0]?.categoryId === null) {
        setDisabledButton(true);
      } else {
        setDisabledButton(false);
      }
    }
  }, [data]);

  return (
    <>
      <Toaster richColors position="top-right" closeButton />
      <IconButton ref={ref} onClick={onToggle}>
        <MoreHoriz />
      </IconButton>

      <Menu anchorEl={ref.current} open={open} onClose={onToggle}>
        {/* <MenuItem onClick={() => onViewAction(data)}>
          <ListItemIcon>
            <RemoveRedEyeOutlined fontSize="small" />
          </ListItemIcon>
          <Typography sx={{ color: theme.palette.text.secondary }}>
            View Concern
          </Typography>
        </MenuItem> */}

        <MenuItem
          disabled={disabledButton}
          onClick={() => onApproveAction(data)}
        >
          <ListItemIcon>
            <DoneAllOutlined fontSize="small" color="success" />
          </ListItemIcon>
          <Typography sx={{ color: theme.palette.success.main }}>
            Approve
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
};
