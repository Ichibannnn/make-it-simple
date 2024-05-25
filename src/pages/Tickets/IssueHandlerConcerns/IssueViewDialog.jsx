import { Stack, Typography } from "@mui/material";
import React from "react";

const IssueViewDialog = ({ data, viewOpen, viewOnClose }) => {
  return (
    <Stack>
      <Typography>{data?.description}</Typography>
    </Stack>
  );
};

export default IssueViewDialog;
