import { Autocomplete, Dialog, DialogContent, IconButton, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { CloseOutlined, Save, SyncOutlined } from "@mui/icons-material";

import { Controller, get, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { theme } from "../../../theme/theme";
import { LoadingButton } from "@mui/lab";
import { toast } from "sonner";
import {
  useCreateEditApproverSetupMutation,
  useLazyGetAllApproversQuery,
  useLazyGetAllIssueHandlersQuery,
} from "../../../features/api masterlist/new_approver_api/approverSetupApi";

const schema = yup.object().shape({
  approverId: yup.object().required().label("Approver"),
  userId: yup.array().required().label("Approver"),
});

const ApproverSetupDialog = ({ data, setData, open, onClose }) => {
  const [createEditApproverSetup, { isLoading: createApproverIsLoading, isFetching: createApproverIsFetching }] = useCreateEditApproverSetupMutation();
  const [getApprovers, { data: approverData, isLoading: approverIsLoading, isSuccess: approverIsSuccess }] = useLazyGetAllApproversQuery();
  const [getIssueHandlers, { data: issueHandlerData, isLoading: issueHandlerIsLoading, isSuccess: issueHandlerIsSuccess }] = useLazyGetAllIssueHandlersQuery();

  const {
    control,
    handleSubmit,
    register,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      approverId: null,
      userId: [],
    },
  });

  const onSubmitSubUnitForm = (formData) => {
    console.log("Formdata:", formData);
    if (!data) {
      const addPayload = {
        approverId: formData.approverId.userId,
        userId: formData?.userId?.map((item) => item?.userId),
      };

      console.log("addPayload: ", addPayload);

      createEditApproverSetup(addPayload)
        .unwrap()
        .then(() => {
          toast.success("Success!", {
            description: "Added sub unit successfully!",
            duration: 1500,
          });
          reset();
          onClose();
        })
        .catch((error) => {
          toast.error("Error!", {
            description: error.data.error.message,
            duration: 1500,
          });
        });
    } else {
      const editPayload = {
        approverUserId: data?.approverId,
        approverId: formData.approverId.userId,
        userId: formData?.userId?.map((item) => item?.userId),
      };

      console.log("data?.approverId", data?.approverId);

      //   console.log("Edit Payload: ", editPayload);

      createEditApproverSetup(editPayload)
        .unwrap()
        .then(() => {
          toast.success("Success!", {
            description: "Updated successfully!",
            duration: 1500,
          });
          reset();
          onClose();
        })
        .catch((error) => {
          console.log("Error: ", error);
          toast.error("Error!", {
            description: error.data.error.message,
            duration: 1500,
          });
        });
    }
  };

  const onCloseAction = () => {
    reset();
    onClose();
  };

  useEffect(() => {
    if (data) {
      setValue("approverId", {
        userId: data?.approverId,
        fullName: data?.approverName,
      });

      const getIssueHandlers = data?.userForApprovers?.map((item) => ({
        userId: item?.userId,
        fullName: item?.userName,
      }));

      setValue("userId", getIssueHandlers);
    }
  }, [data]);

  console.log("errors", errors);

  return (
    <div>
      <Dialog fullWidth maxWidth="sm" open={open} PaperProps={{ style: { overflow: "unset" } }}>
        <IconButton
          aria-label="close"
          onClick={onCloseAction}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseOutlined />
        </IconButton>

        <DialogContent>
          <Stack direction="column" sx={{ padding: "5px" }}>
            <Stack>
              <Stack direction="row" gap={0.5}>
                <Typography
                  sx={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#48BB78",
                  }}
                >
                  {!data ? "Add Approver" : "Edit Approver"}
                </Typography>
              </Stack>

              <form onSubmit={handleSubmit(onSubmitSubUnitForm)}>
                <Stack sx={{ marginTop: 3, padding: "5px", gap: 1.5 }}>
                  <Controller
                    control={control}
                    name="approverId"
                    render={({ field: { ref, value, onChange } }) => {
                      return (
                        <Autocomplete
                          ref={ref}
                          size="small"
                          value={value}
                          options={approverData?.value?.users || []}
                          loading={approverIsLoading}
                          renderInput={(params) => <TextField {...params} label="Approver" />}
                          onOpen={() => {
                            if (!approverIsSuccess) getApprovers();
                          }}
                          onChange={(_, value) => {
                            onChange(value);
                          }}
                          getOptionLabel={(option) => option.fullName}
                          isOptionEqualToValue={(option, value) => option.userId === value.userId}
                          noOptionsText={"No list of approvers."}
                          sx={{
                            flex: 2,
                          }}
                          fullWidth
                          disablePortal
                          disableClearable
                        />
                      );
                    }}
                  />

                  <Controller
                    control={control}
                    name="userId"
                    render={({ field: { ref, value, onChange } }) => {
                      return (
                        <Autocomplete
                          multiple
                          ref={ref}
                          size="small"
                          value={value}
                          options={issueHandlerData?.value?.users || []}
                          loading={issueHandlerIsLoading}
                          renderInput={(params) => <TextField label="Issue Handler" fullWidth {...params} />}
                          onOpen={() => {
                            if (!issueHandlerIsSuccess) getIssueHandlers();
                          }}
                          onChange={(_, value) => onChange(value)}
                          getOptionLabel={(option) => option.fullName}
                          getOptionDisabled={(option) => option?.userId === watch("approverId")?.userId}
                          isOptionEqualToValue={(option, value) => option.userId === value.userId}
                          noOptionsText={"No list of issue handlers."}
                          fullWidth
                          // disablePortal
                          disableClearable
                        />
                      );
                    }}
                  />
                </Stack>

                <Stack direction="row" justifyContent="right" marginTop={3} gap={1}>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    startIcon={<Save />}
                    loadingPosition="start"
                    loading={createApproverIsLoading || createApproverIsFetching}
                    disabled={!watch("approverId")}
                    sx={{
                      ":disabled": {
                        backgroundColor: theme.palette.secondary.main,
                        color: "black",
                      },
                    }}
                    size="small"
                  >
                    Save
                  </LoadingButton>

                  <LoadingButton variant="outlined" onClick={onCloseAction} size="small">
                    Close
                  </LoadingButton>
                </Stack>
              </form>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApproverSetupDialog;
