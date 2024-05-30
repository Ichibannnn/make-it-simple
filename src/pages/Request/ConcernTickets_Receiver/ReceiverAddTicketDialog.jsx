import { LoadingButton } from "@mui/lab";
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Stack, TextField, Typography } from "@mui/material";
import { AccessTimeOutlined, AccountCircleRounded, Close, FiberManualRecord, GetAppOutlined, PeopleOutlined } from "@mui/icons-material";

import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import moment from "moment";

import { Toaster } from "sonner";
import { theme } from "../../../theme/theme";

import { useLazyGetDepartmentQuery } from "../../../features/api masterlist/department/departmentApi";
import { useLazyGetChannelMembersQuery } from "../../../features/api_channel_setup/channel/channelApi";

const schema = yup.object().shape({
  department: yup.object().required().label("Department is required"),
  Requestor_By: yup.object().required().label("Requestor name is required"),
  concern_Details: yup.string().required().label("Concern Details"),
  RequestAttachmentsFiles: yup.array().nullable(),

  categoryId: yup.object().required().label("Category"),
  subCategoryId: yup.object().required().label("Sub category"),
  ChannelId: yup.object().required().label("Channel"),
  userId: yup.object().required().label("Issue handler"),
  startDate: yup.date().required("Start date is required"),
  targetDate: yup.date().required("Target date is required"),

  //   ticketConcernId: yup.string().nullable(),
  //   RequestConcernId: yup.string().nullable(),
});

const ReceiverAddTicketDialog = ({ open, onClose }) => {
  const [getDepartment, { data: departmentData, isLoading: departmentIsLoading, isSuccess: departmentIsSuccess }] = useLazyGetDepartmentQuery();
  const [getMembers, { data: memberData, isLoading: memberIsLoading, isSuccess: memberIsSuccess }] = useLazyGetChannelMembersQuery();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      Requestor_By: "",
      concern_Details: "",
      ticketConcernId: "",

      categoryId: null,
      subCategoryId: null,

      ChannelId: null,
      userId: null,
      startDate: null,
      targetDate: null,

      RequestConcernId: "",
      RequestAttachmentsFiles: [],
    },
  });

  const onCloseHandler = () => {
    onClose();
  };

  return (
    <>
      <Dialog fullWidth maxWidth="md" open={open}>
        <Toaster richColors position="top-right" closeButton />

        <DialogContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" gap={1} alignItems="center">
              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: 700,
                  //   color: "#48BB78",
                }}
              >
                Create Ticket
              </Typography>
            </Stack>

            <Stack direction="row" gap={0.5} alignItems="center">
              <IconButton onClick={onCloseHandler}>
                <Close />
              </IconButton>
            </Stack>
          </Stack>

          <Divider variant="fullWidth" sx={{ background: "#2D3748", marginTop: 1 }} />

          <Stack direction="row" gap={1} sx={{ width: "100%", height: "100%" }}>
            <Stack sx={{ minHeight: "500px", width: "50%", border: "1px solid #2D3748", padding: 1 }}>
              <Typography
                sx={{
                  fontSize: "15px",
                  color: theme.palette.success.main,
                }}
              >
                Requestor Details
              </Typography>

              <Controller
                control={control}
                name="department"
                render={({ field: { ref, value, onChange } }) => {
                  return (
                    <Autocomplete
                      ref={ref}
                      size="small"
                      value={value}
                      options={departmentData?.value?.department || []}
                      loading={departmentIsLoading}
                      renderInput={(params) => <TextField {...params} label="Department" size="small" />}
                      onOpen={() => {
                        if (!departmentIsSuccess) getDepartment();
                      }}
                      onChange={(_, value) => {
                        console.log("Value: ", value);
                        onChange(value);

                        const departmentIdParams = value?.map((department) => department?.id);

                        console.log("departmentIdParams", departmentIdParams);

                        getMembers({
                          DepartmentId: departmentIdParams,
                        });
                      }}
                      getOptionLabel={(option) => `${option.department_Code} - ${option.department_Name}`}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
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
            </Stack>

            <Stack sx={{ minHeight: "500px", width: "50%", border: "1px solid #2D3748", padding: 1 }}>
              {" "}
              <Typography
                sx={{
                  fontSize: "15px",
                  color: theme.palette.success.main,
                }}
              >
                Set Ticket Details
              </Typography>
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Stack sx={{ width: "100%", paddingRight: 2, paddingLeft: 2 }}>
            <LoadingButton type="submit" form="user" variant="contained">
              Submit
            </LoadingButton>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReceiverAddTicketDialog;
