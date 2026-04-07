import { ListOutlined, MoreHoriz, PlayArrowOutlined, VisibilityOutlined } from "@mui/icons-material";
import { IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material";
import { useRef } from "react";

import useDisclosure from "../../../hooks/useDisclosure";

const PmsTableDetailsActions = ({ data, onShowChecklist }) => {
  const ref = useRef(null);

  const { open, onToggle } = useDisclosure();

  const onShowChecklistAction = (data) => {
    onToggle();
    onShowChecklist();
  };

  return (
    <>
      <IconButton ref={ref} onClick={onToggle}>
        <MoreHoriz />
      </IconButton>

      <Menu anchorEl={ref.current} open={open} onClose={onToggle}>
        <MenuItem onClick={() => onShowChecklistAction(data)} disabled={data?.doneOn}>
          <ListItemIcon>
            <PlayArrowOutlined fontSize="small" />
          </ListItemIcon>
          Start PMS
        </MenuItem>
        <MenuItem onClick={() => onShowChecklistAction(data)} disabled={!data?.doneOn}>
          <ListItemIcon>
            <ListOutlined fontSize="small" />
          </ListItemIcon>
          Show Checklist
        </MenuItem>
      </Menu>
    </>
  );
};

export default PmsTableDetailsActions;
