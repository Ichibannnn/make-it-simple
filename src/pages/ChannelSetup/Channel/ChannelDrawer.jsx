import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { theme } from "../../../theme/theme";
import { LoadingButton } from "@mui/lab";
import { Toaster, toast } from "sonner";

import {
  useCreateChannelMutation,
  useUpdateChannelMutation,
} from "../../../features/api_channel_setup/channel/channelApi";
import { useLazyGetSubUnitQuery } from "../../../features/api masterlist/sub-unit/subUnitApi";

const schema = yup.object().shape({
  id: yup.string().nullable(),
  channel_Name: yup.string().required().label("Channel Name"),
  subUnitId: yup.object().required().label("Sub Unit"),
});

const ChannelDrawer = ({ data, open, onClose }) => {
  const [createChannel] = useCreateChannelMutation();
  const [updateChannel] = useUpdateChannelMutation();
  const [
    getSubUnit,
    {
      data: subUnitData,
      isLoading: subUnitIsLoading,
      isSuccess: subUnitIsSuccess,
    },
  ] = useLazyGetSubUnitQuery();

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
      id: null,
      channel_Name: "",
      subUnitId: null,
    },
  });

  //   console.log(watch("subUnitId"));

  useEffect(() => {
    if (data) {
      setValue("id", data?.id);
      setValue("channel_Name", data?.channel_Name);
      setValue("subUnitId", {
        id: data?.subUnitId,
        subUnit_Code: data?.subUnit_Code,
        subUnit_Name: data?.subUnit_Name,
      });
    }
  }, [data]);

  const onCloseAction = () => {
    reset();
    onClose();
  };

  const onSubmitAction = (formData) => {
    console.log("FormData: ", formData);

    if (formData.id) {
      updateChannel({
        id: formData.id,
        channel_Name: formData.channel_Name,
        subUnitId: formData.subUnitId.id,
      })
        .unwrap()
        .then((response) => {
          console.log("Response", response);

          // reset();
          // onClose();
        })
        .catch((error) => {
          console.log("error: ", error);
          toast.error("Error!", {
            description: error.data.error.message,
            duration: 1500,
          });
        });
    } else {
      createChannel({
        channel_Name: formData.channel_Name,
        subUnitId: formData.subUnitId.id,
      })
        .unwrap()
        .then((response) => {
          console.log("FormData ID: ", formData.channel_Name);
          console.log("response add: ", response);

          // if (response?.value?.channel_Name === formData.id)

          // toast.success("Success!", {
          //   description: "Channel added successsfully!",
          //   duration: 1500,
          // });
          // reset();
          // onClose();
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

  //   console.log("Channel Name", watch("channel_Name"));
  //   console.log("Sub Unit", watch("subUnitId"));
  //   console.log("SubUnit Data: ", subUnitData);
  console.log("Edit Data: ", data);

  return (
    <>
      <Toaster richColors position="top-right" />
      <Drawer anchor="right" open={open}>
        <Stack sx={{ padding: 3 }}>
          <Typography
            sx={{
              fontWeight: "bold",
            }}
          >
            Channel Form
          </Typography>
        </Stack>

        <Divider variant="fullWidth" sx={{ background: "#2D3748" }} />

        <form onSubmit={handleSubmit(onSubmitAction)}>
          <Box sx={{ width: "300px", padding: 2, minHeight: "790px" }}>
            <Stack sx={{ marginTop: 3, gap: 2 }}>
              <Stack sx={{ width: "100%", gap: 1 }}>
                <FormLabel
                  sx={{
                    color: theme.palette.text.main,
                    fontSize: "15px",
                    fontWeight: 500,
                    lineHeight: "1.4375em",
                  }}
                >
                  Channel Name
                </FormLabel>

                <TextField
                  {...register("channel_Name")}
                  size="small"
                  variant="outlined"
                  helperText={errors?.channel_Name?.message}
                  error={!!errors?.channel_Name?.message}
                  sx={{ borderColor: "primary" }}
                  fullWidth
                  autoComplete="off"
                />
              </Stack>

              <Stack sx={{ width: "100%", gap: 1 }}>
                <FormLabel
                  sx={{
                    color: theme.palette.text.main,
                    fontSize: "15px",
                    fontWeight: 500,
                    lineHeight: "1.4375em",
                  }}
                >
                  Sub Unit
                </FormLabel>

                <Controller
                  control={control}
                  name="subUnitId"
                  render={({ field: { ref, value, onChange } }) => {
                    return (
                      <Autocomplete
                        ref={ref}
                        size="small"
                        value={value}
                        options={subUnitData?.value?.subUnit || []}
                        loading={subUnitIsLoading}
                        renderInput={(params) => <TextField {...params} />}
                        onOpen={() => {
                          if (!subUnitIsSuccess)
                            getSubUnit({
                              Status: true,
                            });
                        }}
                        onChange={(_, value) => onChange(value)}
                        getOptionLabel={(option) =>
                          `${option.subUnit_Code} - ${option.subUnit_Name}`
                        }
                        isOptionEqualToValue={(option, value) =>
                          option.subUnitId === value.subUnitId
                        }
                        sx={{
                          flex: 2,
                        }}
                        disabled={data ? true : false}
                        fullWidth
                        disablePortal
                      />
                    );
                  }}
                />
              </Stack>
            </Stack>

            <Stack
              direction="row"
              justifyContent="right"
              alignItems="center"
              sx={{ paddingTop: 2, gap: 1 }}
            >
              <LoadingButton
                type="submit"
                variant="contained"
                disabled={!watch("channel_Name") || !watch("subUnitId")}
                sx={{
                  ":disabled": {
                    backgroundColor: theme.palette.secondary.main,
                    color: "black",
                  },
                }}
              >
                Save
              </LoadingButton>

              <LoadingButton variant="outlined" onClick={onCloseAction}>
                Close
              </LoadingButton>
            </Stack>
          </Box>

          {/* <Divider variant="fullWidth" sx={{ background: "#2D3748" }} /> */}
        </form>
      </Drawer>
    </>
  );
};

export default ChannelDrawer;
