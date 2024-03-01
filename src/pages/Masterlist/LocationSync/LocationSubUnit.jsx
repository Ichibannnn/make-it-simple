import React, { useRef } from "react";
import { LanOutlined } from "@mui/icons-material";

import { IconButton, Tooltip } from "@mui/material";
import useDisclosure from "../../../hooks/useDisclosure";

const LocationSubUnit = ({ subUnits }) => {
  const ref = useRef();
  const { open, onToggle } = useDisclosure();

  return (
    <div>
      <IconButton ref={ref} onClick={onToggle}>
        <Tooltip title="View Sub Units">
          <LanOutlined />
        </Tooltip>
      </IconButton>
    </div>
  );
};

export default LocationSubUnit;
