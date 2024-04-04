import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import { Controller, Form, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import { theme } from "../../../theme/theme";
import { LoadingButton } from "@mui/lab";
import { Toaster, toast } from "sonner";
import { DeleteOutlineOutlined } from "@mui/icons-material";

import {
  useCreateChannelMemberMutation,
  useCreateChannelMutation,
  useCreateChannelValidationMutation,
  useLazyGetChannelMembersQuery,
  useUpdateChannelMutation,
} from "../../../features/api_channel_setup/channel/channelApi";
import styled from "@emotion/styled";

const schema = yup.object().shape({
  id: yup.string().nullable(),
  channel_Name: yup.string().required().label("Channel Name"),
});

const memberSchema = yup.object().shape({
  userId: yup.object().required().label("User"),
});

const ChannelDialog = ({ data, open, onClose }) => {
  const [members, setMembers] = useState([]);
  const [disabled, setDisabled] = useState(false);

  const [
    createChannelValidation,
    { error: errorValidation, isError: errorValidationIsError },
  ] = useCreateChannelValidationMutation();

  const [
    createChannel,
    { isLoading: createChannelIsLoading, isFetching: createChannelIsFetching },
  ] = useCreateChannelMutation();

  const [
    getMembers,
    {
      data: memberData,
      isLoading: memberIsLoading,
      isSuccess: memberIsSuccess,
    },
  ] = useLazyGetChannelMembersQuery();

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
      subUnitId: null,
    },
  });

  const {
    control: memberFormControl,
    handleSubmit: memberFormHandlerSubmit,
    reset: memberFormReset,
    setValue: memberFormSetValue,
    watch: memberFormWatch,
    formState: { errors: membersFormError },
  } = useForm({
    resolver: yupResolver(memberSchema),
    defaultValues: {
      userId: null,
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
        channelUserByIds: members?.map((item) => ({
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
          memberFormReset();
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
        channelUserByIds: members?.map((item) => ({
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
          memberFormReset();
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

  const onMemberFormSubmit = (data) => {
    setMembers((currentValue) => [
      ...currentValue,
      {
        userId: data.userId.userId,
        fullName: data.userId.fullName,
        userRole: data.userId.userRole,
      },
    ]);

    memberFormReset();
  };

  const onMemberFormDelete = (index) => {
    setMembers((currentValue) =>
      currentValue.filter((_, memberIndex) => memberIndex !== index)
    );
  };

  const onCloseAction = () => {
    onClose();
    setDisabled(false);
    setMembers([]);
    channelFormReset();
    memberFormReset();
  };

  useEffect(() => {
    if (members.length > 0 || !!data) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [members]);

  useEffect(() => {
    if (data) {
      channelFormSetValue("channel_Name", data.channel_Name);

      const editMemberList = data?.channelUsers?.map((item) => ({
        channelUserId: item.channelUserId,
        userId: item.userId,
        fullName: item.fullname,
        userRole: item.userRole,
      }));

      setMembers(editMemberList);
    }
  }, [data]);

  return (
    <>
      <Toaster richColors position="top-right" closeButton />
      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        sx={{ borderRadius: "none", padding: 0 }}
        PaperProps={{ style: { overflow: "unset" } }}
      >
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

            <Stack
              id="channelForm"
              component="form"
              onSubmit={channelFormHandleSubmit(onChannelFormSubmit)}
              sx={{ paddingTop: 2, gap: 2 }}
            >
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
                      disabled={disabled && !data}
                      sx={{
                        flex: 2,
                      }}
                      autoComplete="off"
                      fullWidth
                    />
                  );
                }}
              />

              {/* <Controller
                control={channelFormControl}
                name="subUnitId"
                render={({ field: { ref, value, onChange } }) => {
                  return (
                    <Autocomplete
                      ref={ref}
                      size="small"
                      value={value}
                      options={subUnitData?.value?.subUnit || []}
                      loading={subUnitIsLoading}
                      renderInput={(params) => (
                        <TextField {...params} label="Sub Unit" size="small" />
                      )}
                      onOpen={() => {
                        if (!subUnitIsSuccess) getSubUnit();
                      }}
                      onChange={(_, value) => {
                        onChange(value);

                        getMembers({
                          SubUnitId: value.id,
                        });
                      }}
                      getOptionLabel={(option) =>
                        `${option.subUnit_Code} - ${option.subUnit_Name}`
                      }
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      }
                      disabled={
                        !channelFormWatch("channel_Name") ||
                        errorValidationIsError ||
                        // disabled ||
                        members.length > 0
                      }
                      sx={{
                        flex: 2,
                      }}
                      fullWidth
                      disablePortal
                      disableClearable
                    />
                  );
                }}
              /> */}
            </Stack>

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

            <Stack sx={{ paddingTop: 2, gap: 2 }}>
              <Stack
                component="form"
                onSubmit={memberFormHandlerSubmit(onMemberFormSubmit)}
                direction="row"
                gap={2}
              >
                <Controller
                  control={memberFormControl}
                  name="userId"
                  render={({ field: { ref, value, onChange } }) => {
                    return (
                      <Autocomplete
                        ref={ref}
                        size="small"
                        value={value}
                        options={memberData?.value || []}
                        loading={memberIsLoading}
                        groupBy={(option) => option.userRole}
                        renderInput={(params) => (
                          <TextField {...params} label="Members" size="small" />
                        )}
                        renderGroup={(params) => (
                          <li key={params.key}>
                            <GroupHeader>{params.group}</GroupHeader>
                            <GroupItems>{params.children}</GroupItems>
                          </li>
                        )}
                        onOpen={() => {
                          if (!memberIsSuccess) getMembers();
                        }}
                        onChange={(_, value) => {
                          onChange(value);
                        }}
                        getOptionLabel={(option) => option.fullName}
                        isOptionEqualToValue={(option, value) =>
                          option.userId === value.userId
                        }
                        getOptionDisabled={(option) =>
                          members.some((item) => item.userId === option.userId)
                        }
                        disabled={
                          !channelFormWatch("channel_Name") ||
                          errorValidationIsError
                        }
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

                <LoadingButton
                  type="submit"
                  variant="contained"
                  size="medium"
                  color="primary"
                  disabled={
                    !channelFormWatch("channel_Name") || errorValidationIsError
                  }
                  sx={{
                    ":disabled": {
                      backgroundColor: theme.palette.secondary.main,
                      color: "black",
                    },
                  }}
                >
                  Add member
                </LoadingButton>
              </Stack>

              <TableContainer>
                <Table
                  size="small"
                  sx={{
                    borderBottom: "none",
                    // minHeight: "50px",
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          background: "#1C2536",
                          color: theme.palette.text.secondary,
                          fontWeight: 700,
                          fontSize: "10px",
                        }}
                      >
                        FULLNAME
                      </TableCell>

                      <TableCell
                        sx={{
                          background: "#1C2536",
                          color: theme.palette.text.secondary,
                          fontWeight: 700,
                          fontSize: "10px",
                        }}
                      >
                        ROLE
                      </TableCell>

                      <TableCell
                        sx={{
                          background: "#1C2536",
                          color: theme.palette.text.secondary,
                          fontWeight: 700,
                          fontSize: "10px",
                        }}
                        align="center"
                      >
                        ACTION
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody sx={{ border: "1px" }}>
                    {members.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "12px",
                          }}
                        >
                          {item.fullName}
                        </TableCell>

                        <TableCell
                          sx={{
                            color: theme.palette.primary.main,
                            fontSize: "12px",
                            fontWeight: 700,
                          }}
                        >
                          {item.userRole}
                        </TableCell>

                        <TableCell
                          sx={{
                            color: "#EDF2F7",
                            fontSize: "12px",
                          }}
                          align="center"
                        >
                          <IconButton onClick={() => onMemberFormDelete(index)}>
                            <DeleteOutlineOutlined />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Stack direction="row" paddingBottom={1} gap={1}>
            <Button
              type="submit"
              variant="contained"
              form="channelForm"
              loading={createChannelIsLoading || createChannelIsFetching}
              disabled={!channelFormWatch("channel_Name") || !members.length}
            >
              Save Changes
            </Button>
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

const GroupHeader = styled("div")(({ theme }) => ({
  position: "sticky",
  top: "-8px",
  fontSize: "12px",
  padding: "4px 10px",
  color: theme.palette.text.main,
  backgroundColor: theme.palette.text.accent,
}));

export const GroupItems = styled("ul")({
  padding: 0,
});
