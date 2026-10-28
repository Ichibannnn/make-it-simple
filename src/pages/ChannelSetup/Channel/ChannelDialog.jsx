import { Autocomplete, Button, Checkbox, Chip, Dialog, DialogActions, DialogContent, Stack, TextField, Typography } from "@mui/material";
import { Save } from "@mui/icons-material";
import { useEffect, useState } from "react";

import * as yup from "yup";
import { toast } from "sonner";
import { theme } from "../../../theme/theme";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";

import { useCreateChannelMutation, useCreateChannelValidationMutation, useLazyGetChannelMembersQuery } from "../../../features/api_channel_setup/channel/channelApi";
import { useLazyGetOneChargingDepartmentQuery } from "../../../features/api masterlist/department/departmentApi";

const schema = yup.object().shape({
  id: yup.string().nullable(),
  channel_Name: yup.string().required().label("Channel Name"),
  deparmentId: yup.array().required().label("Deparment"),
  userId: yup.array().required().label("User"),
});

const ChannelDialog = ({ data, open, onClose }) => {
  const [requestCheckbox, setRequestCheckbox] = useState(false);

  const [createChannelValidation, { error: errorValidation, isError: errorValidationIsError }] = useCreateChannelValidationMutation();
  const [createChannel, { isLoading: createChannelIsLoading, isFetching: createChannelIsFetching }] = useCreateChannelMutation();
  const [getDepartment, { data: departmentData, isLoading: departmentIsLoading, isSuccess: departmentIsSuccess }] = useLazyGetOneChargingDepartmentQuery();
  const [getMembers, { data: memberData, isLoading: memberIsLoading, isSuccess: memberIsSuccess }] = useLazyGetChannelMembersQuery();

  const {
    control: channelFormControl,
    handleSubmit: channelFormHandleSubmit,
    setValue: channelFormSetValue,
    watch: channelFormWatch,
    reset: channelFormReset,
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
    if (!data) {
      const addPayload = {
        channel_Name: formData.channel_Name,
        channelUserByIds: formData?.userId?.map((item) => ({
          userId: item.userId,
        })),
        request: requestCheckbox,
      };
      createChannel(addPayload)
        .unwrap()
        .then(() => {
          toast.success("Success!", {
            description: "Channel added successfully!",
            duration: 1500,
          });
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
        request: requestCheckbox,
      };
      createChannel(editPayload)
        .unwrap()
        .then(() => {
          toast.success("Success!", {
            description: "Updated successfully!",
            duration: 1500,
          });
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
    channelFormReset();
  };

  const requestCheckboxHandler = (event) => {
    setRequestCheckbox(event.target.checked);
  };

  useEffect(() => {
    if (data) {
      channelFormSetValue("channel_Name", data.channel_Name);

      if (data?.request === true) {
        setRequestCheckbox(true);
      } else if (data?.request === false) {
        setRequestCheckbox(false);
      } else {
        setRequestCheckbox(false);
      }

      const editMemberList = data?.channelUsers?.map((item) => ({
        channelUserId: item.channelUserId,
        userId: item.userId,
        fullName: item.fullname,
        userRole: item.userRole,
      }));

      channelFormSetValue("userId", editMemberList);
    }
  }, [data]);

  return (
    <>
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
                      options={departmentData?.value?.onecharging || []}
                      loading={departmentIsLoading}
                      renderInput={(params) => <TextField {...params} label="Department" size="small" />}
                      onOpen={() => {
                        if (!departmentIsSuccess) getDepartment();
                      }}
                      onChange={(_, value) => {
                        onChange(value);

                        const departmentIdParams = value?.map((department) => department?.departmentId);
                        if (channelFormWatch("deparmentId").length === 0) {
                          channelFormSetValue("userId", []);
                        }

                        getMembers({
                          DepartmentId: departmentIdParams,
                        });
                      }}
                      getOptionLabel={(option) => `${option.departmentCode} - ${option.departmentName}`}
                      isOptionEqualToValue={(option, value) => option.departmentId === value.departmentId}
                      getOptionDisabled={(option) => channelFormWatch("deparmentId")?.some((item) => item.departmentId === option.departmentId)}
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
                        onChange={(_, value) => {
                          console.log("value: ", value);
                          onChange(value);
                        }}
                        getOptionLabel={(option) => option.fullName}
                        isOptionEqualToValue={(option, value) => option.userId === value.userId}
                        getOptionDisabled={(option) => channelFormWatch("userId").some((item) => item.userId === option.userId)}
                        disabled={
                          data ? !channelFormWatch("channel_Name") || errorValidationIsError : !channelFormWatch("channel_Name") || !channelFormWatch("deparmentId").length || errorValidationIsError
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

              <Stack direction="row" gap={0.5} mt={2} sx={{ width: "100%", alignItems: "right" }}>
                <Checkbox
                  checked={requestCheckbox || data?.is_Request === true}
                  onChange={requestCheckboxHandler}
                  size="small"
                  sx={{
                    padding: 0,
                  }}
                />

                <Typography sx={{ fontSize: "15px", fontStyle: "italic", color: requestCheckbox ? theme.palette.text.main : theme.palette.text.secondary }}>For request concern?</Typography>
              </Stack>
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <LoadingButton variant="outlined" loading={createChannelIsLoading || createChannelIsFetching} onClick={onCloseAction}>
            <Typography sx={{ fontSize: "12.5px", fontWeight: 500 }}>Cancel</Typography>
          </LoadingButton>

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
            Save
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChannelDialog;
