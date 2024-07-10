import { Warning } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import React from "react";
import { toast, Toaster } from "sonner";
import { theme } from "../../../theme/theme";
import { useUpdateUserMutation } from "../../../features/user_management_api/user/userApi";

const UserAccountWarningDialog = ({ data, payload, open, onClose, userOnClose }) => {
  const [updateUser, { isLoading: isUpdateUserIsLoading, isFetching: isUpdateUserIsFetching }] = useUpdateUserMutation();

  const onSubmitAction = () => {
    // console.log("Data: ", data);
    // console.log("Payload", payload);

    const submitUpdateUser = {
      id: data.id,
      userRoleId: payload.userRoleId,
      username: payload.username,
      departmentId: payload.departmentId,
      subUnitId: payload.subUnitId,
      unitId: payload.unitId,
      companyId: payload.companyId,
      businessUnitId: payload.businessUnitId,
      locationCode: payload.locationCode,
    };

    console.log("submitUpdateUser", submitUpdateUser);

    updateUser(submitUpdateUser)
      .unwrap()
      .then(() => {
        toast.success("Success!", {
          description: "User updated successfully!",
        });
        userOnClose();
        onClose();
      })
      .catch((error) => {
        toast.error("Error!", {
          description: error.data.error.message,
        });
      });
  };

  const onCloseAction = () => {
    onClose();
  };

  return (
    <>
      <Toaster richColors position="top-right" closeButton />
      <Dialog fullWidth maxWidth="xs" open={open}>
        <DialogContent>
          <Stack sx={{ width: "100%", padding: 2, justifyContent: "center" }}>
            <Stack spacing={0} sx={{ justifyContent: "center", alignItems: "center" }}>
              <Warning color="warning" sx={{ fontSize: "100px" }} />
              <Typography sx={{ fontSize: "20px", fontWeight: 600 }}>Warning!</Typography>
            </Stack>
          </Stack>

          <Stack sx={{ width: "100%", paddingLeft: 1, paddingRight: 1, justifyContent: "center" }}>
            <Stack sx={{ justifyContent: "center", alignItems: "center" }}>
              <Typography
                sx={{ fontSize: "13px", textAlign: "center", color: theme.palette.text.secondary }}
              >{`There have been recent transactions for this user. Are you sure you want to switch from ${data?.user_Role_Name} to ${payload?.user_Role_Name} in this role ?`}</Typography>
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Stack direction="row" gap={1} sx={{ width: "100%", paddingBottom: 1, justifyContent: "center" }}>
            <LoadingButton variant="contained" size="small" onClick={onSubmitAction} loading={isUpdateUserIsLoading || isUpdateUserIsFetching}>
              Yes
            </LoadingButton>
            <LoadingButton size="small" variant="outlined" onClick={onCloseAction} loading={isUpdateUserIsLoading || isUpdateUserIsFetching}>
              No
            </LoadingButton>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserAccountWarningDialog;
