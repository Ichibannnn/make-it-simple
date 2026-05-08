import { useRef } from "react";
import { GroupsOutlined } from "@mui/icons-material";
import { Badge, IconButton, Tooltip } from "@mui/material";

import useDisclosure from "../../../hooks/useDisclosure";

const ApproverChannels = ({ approvers }) => {
  const ref = useRef();
  const { onToggle } = useDisclosure();

  return (
    <div>
      <IconButton ref={ref} onClick={onToggle}>
        <Tooltip title="View Approvers">
          <Badge badgeContent={approvers?.length} color="primary">
            <GroupsOutlined />
          </Badge>
        </Tooltip>
      </IconButton>
    </div>
  );
};

export default ApproverChannels;
