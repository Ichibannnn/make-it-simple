import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  Paper,
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
import { CloseOutlined, DeleteOutlineOutlined } from "@mui/icons-material";

import {
  useCreateChannelMemberMutation,
  useCreateChannelMutation,
  useCreateChannelValidationMutation,
  useLazyGetChannelMembersQuery,
  useUpdateChannelMutation,
} from "../../../features/api_channel_setup/channel/channelApi";
import { useLazyGetSubUnitQuery } from "../../../features/api masterlist/sub-unit/subUnitApi";
import useDisclosure from "../../../hooks/useDisclosure";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { ReactSortable } from "react-sortablejs";

// const schema = yup.object().shape({
//   id: yup.string().nullable(),
//   channel_Name: yup.string().required().label("Channel Name"),
// });

// const ChannelDialog = ({ data, open, onClose }) => {
//   const [createChannelValidation] = useCreateChannelValidationMutation();
//   const {
//     open: openMemberDialog,
//     onToggle: onToggleMemberDialog,
//     onClose: onCloseMemberDialog,
//   } = useDisclosure();

//   const [channelName, setChannelName] = useState("");

//   const {
//     control,
//     handleSubmit,
//     register,
//     watch,
//     setValue,
//     reset,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(schema),
//     defaultValues: {
//       id: null,
//       channel_Name: "",
//       subUnitId: null,
//     },
//   });

//   console.log("Error: ", errors);

//   const onSubmitAction = (formData) => {
//     console.log("FormData: ", formData);

//     createChannelValidation({
//       channel_Name: formData.channel_Name,
//     })
//       .unwrap()
//       .then(() => {
//         setChannelName(formData.channel_Name);
//         onClose();
//         onToggleMemberDialog();
//       })
//       .catch((error) => {
//         toast.error("Error!", {
//           description: error.data.error.message,
//           duration: 1500,
//         });
//       });

//     // if (formData.id) {
//     //   updateChannel({
//     //     id: formData.id,
//     //     channel_Name: formData.channel_Name,
//     //     subUnitId: formData.subUnitId.id,
//     //   })
//     //     .unwrap()
//     //     .then((response) => {
//     //       console.log("Response", response);

//     //       toast.success("Success!", {
//     //         description: "Updated channel! ",
//     //         duration: 1500,
//     //       });
//     //       reset();
//     //       onClose();
//     //     })
//     //     .catch((error) => {
//     //       console.log("error: ", error);
//     //       toast.error("Error!", {
//     //         description: error.data.error.message,
//     //         duration: 1500,
//     //       });
//     //     });
//     // } else {
//     //   createChannel({
//     //     channel_Name: formData.channel_Name,
//     //     subUnitId: formData.subUnitId.id,
//     //   })
//     //     .unwrap()
//     //     .then((response) => {
//     //       console.log("FormData ID: ", formData.channel_Name);
//     //       console.log("response add: ", response);

//     //       // if (response?.value?.channel_Name === formData.id)

//     //       toast.success("Success!", {
//     //         description: "Channel added successsfully!",
//     //         duration: 1500,
//     //       });
//     //       reset();
//     //       onClose();
//     //     })
//     //     .catch((error) => {
//     //       console.log("Error: ", error);
//     //       toast.error("Error!", {
//     //         description: error.data.error.message,
//     //         duration: 1500,
//     //       });
//     //     });
//     // }
//   };

//   const onCloseAction = () => {
//     reset();
//     onClose();
//   };

//   return (
//     <>
//       <Toaster richColors position="top-right" closeButton />
//       <Dialog open={open} PaperProps={{ style: { overflow: "unset" } }}>
//         <DialogTitle
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "left",
//             paddingTop: 0,
//             paddingBottom: 0,
//             marginBlockEnd: "5.28px",
//           }}
//         >
//           <Stack>
//             <Stack direction="row" gap={0.5}>
//               <Typography
//                 sx={{
//                   fontSize: "20px",
//                   fontWeight: 700,
//                 }}
//               >
//                 Channel Form
//               </Typography>
//             </Stack>

//             <Typography
//               sx={{
//                 color: theme.palette.text.secondary,
//                 fontSize: "12px",
//               }}
//             >
//               Create channel before adding members.
//             </Typography>
//           </Stack>
//         </DialogTitle>

//         <IconButton
//           onClick={onCloseAction}
//           sx={{
//             position: "absolute",
//             right: 8,
//             top: 8,
//             color: (theme) => theme.palette.grey[500],
//           }}
//         >
//           <CloseOutlined />
//         </IconButton>

//         <DialogContent>
//           <Stack sx={{ padding: "5px", gap: 1.5, width: "400px" }}>
//             <form onSubmit={handleSubmit(onSubmitAction)}>
//               <Stack sx={{ gap: 1 }}>
//                 <Stack sx={{ width: "90%", gap: 1 }}>
//                   <FormLabel
//                     sx={{
//                       color: theme.palette.text.main,
//                       fontSize: "13px",
//                       fontWeight: 500,
//                       lineHeight: "1.4375em",
//                     }}
//                   >
//                     Channel Name
//                   </FormLabel>

//                   <TextField
//                     {...register("channel_Name")}
//                     size="small"
//                     variant="outlined"
//                     helperText={errors?.channel_Name?.message}
//                     error={!!errors?.channel_Name?.message}
//                     sx={{ borderColor: "primary" }}
//                     fullWidth
//                     autoComplete="off"
//                   />
//                 </Stack>

//                 {/* <Stack sx={{ width: "100%", gap: 1 }}>
//                   <FormLabel
//                     sx={{
//                       color: theme.palette.text.main,
//                       fontSize: "13px",
//                       fontWeight: 500,
//                       lineHeight: "1.4375em",
//                     }}
//                   >
//                     Sub Unit
//                   </FormLabel>

//                   <Controller
//                     control={control}
//                     name="subUnitId"
//                     render={({ field: { ref, value, onChange } }) => {
//                       return (
//                         <Autocomplete
//                           ref={ref}
//                           size="small"
//                           value={value}
//                           options={subUnitData?.value?.subUnit || []}
//                           loading={subUnitIsLoading}
//                           renderInput={(params) => (
//                             <TextField {...params} size="small" />
//                           )}
//                           onOpen={() => {
//                             if (!subUnitIsSuccess)
//                               getSubUnit({
//                                 Status: true,
//                               });
//                           }}
//                           onChange={(_, value) => onChange(value)}
//                           getOptionLabel={(option) =>
//                             `${option.subUnit_Code} - ${option.subUnit_Name}`
//                           }
//                           isOptionEqualToValue={(option, value) =>
//                             option.subUnitId === value.subUnitId
//                           }
//                           sx={{
//                             flex: 2,
//                           }}
//                           disabled={data ? true : false}
//                           fullWidth
//                           disablePortal
//                         />
//                       );
//                     }}
//                   />
//                 </Stack> */}
//               </Stack>

//               <DialogActions>
//                 <Stack
//                   direction="row"
//                   justifyContent="right"
//                   alignItems="center"
//                   sx={{ paddingTop: 2, gap: 1 }}
//                 >
//                   <LoadingButton
//                     type="submit"
//                     variant="contained"
//                     disabled={!watch("channel_Name")}
//                     sx={{
//                       ":disabled": {
//                         backgroundColor: theme.palette.secondary.main,
//                         color: "black",
//                       },
//                     }}
//                   >
//                     Next
//                   </LoadingButton>
//                 </Stack>
//               </DialogActions>
//             </form>
//           </Stack>
//         </DialogContent>
//       </Dialog>

//       <ChannelMemberList
//         channelName={channelName}
//         openMemberDialog={openMemberDialog}
//         onCloseMemberDialog={onCloseMemberDialog}
//       />
//     </>
//   );
// };

// export default ChannelDialog;

const schema = yup.object().shape({
  id: yup.string().nullable(),
  channel_Name: yup.string().required().label("Channel Name"),
  subUnitId: yup.object().required().label("Sub Unit"),
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
  const [createChannel] = useCreateChannelMutation();
  const [createChannelMember] = useCreateChannelMemberMutation();
  const [updateChannel] = useUpdateChannelMutation();

  const [
    getSubUnit,
    {
      data: subUnitData,
      isLoading: subUnitIsLoading,
      isSuccess: subUnitIsSuccess,
    },
  ] = useLazyGetSubUnitQuery();

  const [
    getSubUnitMembers,
    {
      data: subUnitMembersData,
      isLoading: subUnitMembersIsLoading,
      isSuccess: subUnitMembersIsSuccess,
    },
  ] = useLazyGetChannelMembersQuery();

  const {
    control: channelFormControl,
    handleSubmit: channelFormHandleSubmit,
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
    watch: memberFormWatch,
    formState: { errors: membersFormError },
  } = useForm({
    resolver: yupResolver(memberSchema),
    defaultValues: {
      userId: null,
    },
  });

  const onValidateChannelName = async (e) => {
    try {
      await createChannelValidation({
        channel_Name: e.target.value,
      }).unwrap();
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const onChannelFormSubmit = async (data) => {
    try {
      const response = await createChannel({
        channel_Name: data.channel_Name,
        subUnitId: data.subUnitId.id,
      }).unwrap();

      await createChannelMember({
        id: response.value.id,
        members: members,
      }).unwrap();
      toast.success("Success!", {
        description: "Channel added successfully!",
        duration: 1500,
      });
      setMembers([]);
      channelFormReset();
      memberFormReset();
      onClose();
    } catch (error) {
      console.log(error);
      toast.error("Error!", {
        description: error.data.error.message,
        duration: 1500,
      });
    }
  };

  const onMemberFormSubmit = (data) => {
    console.log("Members Data: ", data);

    setMembers((currentValue) => [
      ...currentValue,
      {
        userId: data.userId.userId,
        fullName: data.userId.fullName,
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
    if (members.length) {
      setDisabled(true);
    }
  }, [members]);

  return (
    <>
      <Toaster richColors position="top-right" closeButton />
      <Dialog
        fullWidth
        maxWidth="md"
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
                    fontSize: "20px",
                    fontWeight: 700,
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
                Add members to the newly added channel.
              </Typography>
            </Stack>

            <Stack
              id="channelForm"
              component="form"
              onSubmit={channelFormHandleSubmit(onChannelFormSubmit)}
              sx={{ paddingTop: 5, gap: 2 }}
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
                      disabled={disabled}
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
                        console.log(value);

                        getSubUnitMembers({
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
                        disabled
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
                        options={subUnitMembersData?.value || []}
                        loading={subUnitMembersIsLoading}
                        renderInput={(params) => (
                          <TextField {...params} label="Members" size="small" />
                        )}
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
          <Button
            type="submit"
            variant="contained"
            form="channelForm"
            disabled={
              !channelFormWatch("channel_Name") ||
              !channelFormWatch("subUnitId") ||
              !members.length
            }
            sx={{
              ":disabled": {
                backgroundColor: theme.palette.secondary.main,
                color: "black",
              },
            }}
          >
            Save Changes
          </Button>
          <Button variant="text" onClick={onCloseAction}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChannelDialog;
