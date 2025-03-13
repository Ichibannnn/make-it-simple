import { Autocomplete, Button, Checkbox, Chip, Dialog, DialogActions, DialogContent, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import { theme } from "../../../theme/theme";
import { LoadingButton } from "@mui/lab";
import { Toaster, toast } from "sonner";
import { DeleteOutlineOutlined, Save } from "@mui/icons-material";

import {
  useCreateChannelMemberMutation,
  useCreateChannelMutation,
  useCreateChannelValidationMutation,
  useLazyGetChannelMembersQuery,
  useUpdateChannelMutation,
} from "../../../features/api_channel_setup/channel/channelApi";
import styled from "@emotion/styled";
import { useLazyGetDepartmentQuery } from "../../../features/api masterlist/department/departmentApi";
import MultiSelect from "../../../components/MultiSelect/MultiSelect";

const schema = yup.object().shape({
  id: yup.string().nullable(),
  channel_Name: yup.string().required().label("Channel Name"),
  deparmentId: yup.array().required().label("Deparment"),
  userId: yup.array().required().label("User"),
});

const ChannelDialog = ({ data, open, onClose }) => {
  const [members, setMembers] = useState([]);
  const [disabled, setDisabled] = useState(false);

  const [createChannelValidation, { error: errorValidation, isError: errorValidationIsError }] = useCreateChannelValidationMutation();
  const [createChannel, { isLoading: createChannelIsLoading, isFetching: createChannelIsFetching }] = useCreateChannelMutation();
  const [getDepartment, { data: departmentData, isLoading: departmentIsLoading, isSuccess: departmentIsSuccess }] = useLazyGetDepartmentQuery();
  const [getMembers, { data: memberData, isLoading: memberIsLoading, isSuccess: memberIsSuccess }] = useLazyGetChannelMembersQuery();

  const {
    control: channelFormControl,
    handleSubmit: channelFormHandleSubmit,
    setValue: channelFormSetValue,
    watch: channelFormWatch,
    reset: channelFormReset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      id: null,
      channel_Name: "",
      deparmentId: [],
      userId: [],
    },
  });

  const onValidateChannelName = async (e) => {
    if (!data) {
      try {
        await createChannelValidation({
          channel_Name: e.target.value,
        }).unwrap();
      } catch (error) {}
    }
  };

  const onChannelFormSubmit = (formData) => {
    console.log("FormData: ", formData);
    // console.log("Watch Members: ", memberFormWatch("userId"));

    if (!data) {
      const addPayload = {
        channel_Name: formData.channel_Name,
        channelUserByIds: formData?.userId?.map((item) => ({
          userId: item.userId,
        })),
      };
      createChannel(addPayload)
        .unwrap()
        .then(() => {
          toast.success("Success!", {
            description: "Channel added successfully!",
            duration: 1500,
          });
          setMembers([]);
          channelFormReset();
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
        channelId: data.id,
        channel_Name: formData.channel_Name,
        channelUserByIds: formData?.userId?.map((item) => ({
          userId: item.userId,
        })),
      };
      createChannel(editPayload)
        .unwrap()
        .then(() => {
          toast.success("Success!", {
            description: "Updated successfully!",
            duration: 1500,
          });
          setMembers([]);
          channelFormReset();
          onClose();
        })
        .catch((error) => {
          toast.error("Error!", {
            description: error.data.error.message,
            duration: 1500,
          });
        });
    }
  };

  const onCloseAction = () => {
    onClose();
    setDisabled(false);
    setMembers([]);
    channelFormReset();
  };

  useEffect(() => {
    if (data) {
      channelFormSetValue("channel_Name", data.channel_Name);

      // const departmentMap = data?.channelUsers?.reduce((dept, item) => {
      //   if (!dept[item.department_Code]) {
      //     dept[item.department_Code] = {
      //       id: item.id,
      //       department_Code: item.department_Code,
      //       department_Name: item.department_Name,
      //     };
      //   }

      //   return dept;
      // }, {});
      // const editDepartmentList = Object.values(departmentMap);
      // console.log("filterDepartment: ", editDepartmentList);

      const editMemberList = data?.channelUsers?.map((item) => ({
        channelUserId: item.channelUserId,
        userId: item.userId,
        fullName: item.fullname,
        userRole: item.userRole,
      }));

      // channelFormSetValue("deparmentId", editDepartmentList);
      channelFormSetValue("userId", editMemberList);
    }
  }, [data]);

  console.log("Members data: ", memberData);

  return (
    <>
      <Toaster richColors position="top-right" closeButton />
      <Dialog fullWidth maxWidth="sm" open={open} sx={{ borderRadius: "none", padding: 0 }} PaperProps={{ style: { overflow: "unset" } }}>
        <DialogContent sx={{ paddingBottom: 10 }}>
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
                  Channel Form
                </Typography>
              </Stack>

              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "12px",
                }}
              >
                Create a channel
              </Typography>
            </Stack>

            <Stack id="channelForm" component="form" onSubmit={channelFormHandleSubmit(onChannelFormSubmit)} sx={{ paddingTop: 2, gap: 2 }}>
              <Controller
                control={channelFormControl}
                name="channel_Name"
                render={({ field: { ref, value, onChange } }) => {
                  return (
                    <TextField
                      inputRef={ref}
                      size="small"
                      value={value}
                      label="Channel Name"
                      onChange={onChange}
                      onBlur={onValidateChannelName}
                      error={errorValidationIsError}
                      helperText={errorValidation?.data?.error?.message}
                      // disabled={data ? true : false}
                      sx={{
                        flex: 2,
                      }}
                      autoComplete="off"
                      fullWidth
                    />
                  );
                }}
              />

              <Controller
                control={channelFormControl}
                name="deparmentId"
                render={({ field: { ref, value, onChange } }) => {
                  return (
                    <Autocomplete
                      multiple
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

                        if (channelFormWatch("deparmentId").length === 0) {
                          channelFormSetValue("userId", []);
                        }

                        getMembers({
                          DepartmentId: departmentIdParams,
                        });
                      }}
                      getOptionLabel={(option) => `${option.department_Code} - ${option.department_Name}`}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      getOptionDisabled={(option) => channelFormWatch("deparmentId")?.some((item) => item.id === option.id)}
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

              <Stack>
                <Stack direction="row" gap={0.5} paddingTop={3}>
                  <Typography
                    sx={{
                      fontSize: "18px",
                      fontWeight: 700,
                      color: "#48BB78",
                    }}
                  >
                    Member Form
                  </Typography>
                </Stack>

                <Typography
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "12px",
                  }}
                >
                  Tagging of member(s) after creating a channel
                </Typography>
              </Stack>

              <Stack sx={{ gap: 2 }}>
                <Controller
                  control={channelFormControl}
                  name="userId"
                  render={({ field: { ref, value, onChange } }) => {
                    return (
                      <Autocomplete
                        multiple
                        ref={ref}
                        size="small"
                        value={value}
                        options={memberData?.value || []}
                        loading={memberIsLoading}
                        renderInput={(params) => <TextField {...params} label="Members" size="small" />}
                        renderOption={(props, option, { selected }) => {
                          const { key, ...optionProps } = props;
                          return (
                            <li key={key} {...optionProps}>
                              <Checkbox size="small" style={{ marginRight: 8 }} checked={selected} />
                              {option.fullName}
                            </li>
                          );
                        }}
                        onOpen={() => {
                          if (!memberIsSuccess) getMembers();
                        }}
                        onChange={(_, value) => {
                          onChange(value);
                        }}
                        getOptionLabel={(option) => option.fullName}
                        isOptionEqualToValue={(option, value) => option.userId === value.userId}
                        getOptionDisabled={(option) => channelFormWatch("userId").some((item) => item.userId === option.userId)}
                        disabled={
                          data
                            ? !channelFormWatch("channel_Name") || errorValidationIsError
                            : !channelFormWatch("channel_Name") || !channelFormWatch("deparmentId").length || errorValidationIsError
                        }
                        sx={{
                          flex: 2,
                        }}
                        fullWidth
                        disablePortal
                        disableClearable
                        disableCloseOnSelect
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Stack sx={{ width: "100%", alignItems: "start" }} key={index}>
                              <Chip label={option.fullName} {...getTagProps({ index })} />
                            </Stack>
                          ))
                        }
                      />
                    );
                  }}
                />
              </Stack>
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Stack direction="row" paddingBottom={1} gap={1}>
            <LoadingButton
              type="submit"
              form="channelForm"
              variant="contained"
              size="large"
              color="primary"
              startIcon={<Save />}
              loadingPosition="start"
              loading={createChannelIsLoading || createChannelIsFetching}
              disabled={!channelFormWatch("channel_Name") || !channelFormWatch("userId").length}
              sx={{
                ":disabled": {
                  backgroundColor: theme.palette.primary.secondary,
                  color: "black",
                },
              }}
            >
              Save Changes
            </LoadingButton>
            <Button variant="text" onClick={onCloseAction}>
              Close
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChannelDialog;
