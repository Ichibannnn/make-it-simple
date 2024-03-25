import { Stack, Typography } from "@mui/material";
import React from "react";
import { theme } from "../../theme/theme";
import { useChangeUserPasswordMutation } from "../../features/user_management_api/user/userApi";
import { useEffect } from "react";
import { Toaster, toast } from "sonner";

const Overview = () => {
  return (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: theme.palette.bgForm.black1,
        color: "#fff",
        padding: "44px 94px 94px 94px",
      }}
    >
      <Toaster richColors position="top-right" />
      <Stack>
        <Stack direction="row" justifyContent="space-between">
          <Stack>
            <Stack justifyItems="left">
              <Typography variant="h4">Overview</Typography>
            </Stack>
            <Stack justifyItems="space-between" direction="row"></Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Overview;
