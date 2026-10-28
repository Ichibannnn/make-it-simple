import { Autocomplete, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect } from "react";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { LoadingButton } from "@mui/lab";
import { toast } from "sonner";
import { AddCircleOutline, EditOutlined, Save } from "@mui/icons-material";

import { useLazyGetChannelsQuery } from "../../../features/api_channel_setup/channel/channelApi";
import { useCreateEditServiceProviderMutation, useServiceProviderValidationMutation } from "../../../features/api masterlist/service_provider/serviceProviderApi";
import { masterlistStyles as sx } from "../styles/masterlistStyles";

const schema = yup.object().shape({
  id: yup.string().nullable(),
  serviceProviderName: yup.string().required("Service provider is required."),
  channelId: yup.array().required().label("Channel Name"),
});

export const ServiceProviderDialog = ({ data, open, onClose }) => {
  const [serviceProviderValidation, { error: errorValidation, isError: errorValidationIsError }] = useServiceProviderValidationMutation();
  const [createEditServiceProvider, { isLoading: createEditServiceProviderIsLoading, isFetching: createEditServiceProviderIsFetching }] = useCreateEditServiceProviderMutation();
  const [getChannel, { data: channelData, isLoading: channelIsLoading, isSuccess: channelIsSuccess }] = useLazyGetChannelsQuery();

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
      serviceProviderName: "",
      channelId: [],
    },
  });

  const onValidateServiceProvider = async (e) => {
    if (!data) {
      try {
        await serviceProviderValidation({
          serviceProviderName: e.target.value,
        }).unwrap();
      } catch (error) {}
    }
  };

  useEffect(() => {
    if (data) {
      setValue("id", data?.id);
      setValue("serviceProviderName", data?.serviceProviderName);

      const editChannelList = data?.serviceChannel?.map((item) => ({
        id: item?.channelId,
        channel_Name: item?.channelName,
      }));

      setValue("channelId", editChannelList);
    }
  }, [data]);

  const onCloseAction = () => {
    reset();
    onClose();
  };

  const onSubmitAction = (formData) => {
    console.log("FormData: ", formData);
    // console.log("Watch Members: ", memberFormWatch("userId"));

    if (!data) {
      const addPayload = {
        serviceProviderName: formData.serviceProviderName,
        channelLists: formData?.channelId?.map((item) => ({
          channelId: item.id,
        })),
      };

      createEditServiceProvider(addPayload)
        .unwrap()
        .then(() => {
          toast.success("Success!", {
            description: "Channel added successfully!",
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
        serviceProviderId: data.id,
        serviceProviderName: formData.serviceProviderName,
        channelLists: formData?.channelId?.map((item) => ({
          channelId: item.id,
        })),
      };

      createEditServiceProvider(editPayload)
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
          toast.error("Error!", {
            description: error.data.error.message,
            duration: 1500,
          });
        });
    }
  };

  // console.log("Channel Data: ", channelData);

  return (
    <>
      <Dialog fullWidth maxWidth="xs" open={open} PaperProps={{ sx: sx.dialogPaper }}>
        <Typography sx={sx.dialogTitle}>{data ? "Edit Service Provider" : "Add Service Provider"}</Typography>
        <Typography sx={sx.dialogSubtitle}>{data ? "Update this service provider and its channels." : "Create a new service provider."}</Typography>

        <form onSubmit={handleSubmit(onSubmitAction)}>
          <DialogContent>
            <Stack sx={sx.dialogStack}>
              <Stack sx={sx.formField}>
                <Typography sx={sx.fieldText}>Service Provider</Typography>
                <Controller
                  control={control}
                  name="serviceProviderName"
                  render={({ field: { ref, value, onChange } }) => {
                    return (
                      <TextField
                        inputRef={ref}
                        value={value}
                        size="small"
                        placeholder="Enter Service Provider"
                        onChange={onChange}
                        onBlur={onValidateServiceProvider}
                        error={errorValidationIsError}
                        helperText={errorValidation?.data?.error?.message}
                        sx={{ "& .MuiInputBase-input": { fontSize: "14px" } }}
                        autoComplete="off"
                        fullWidth
                      />
                    );
                  }}
                />
              </Stack>

              <Stack sx={sx.formField}>
                <Typography sx={sx.fieldText}>Channel Name</Typography>
                <Controller
                  control={control}
                  name="channelId"
                  render={({ field: { ref, value, onChange } }) => {
                    return (
                      <Autocomplete
                        multiple
                        ref={ref}
                        value={value}
                        size="small"
                        options={channelData?.value?.channel || []}
                        loading={channelIsLoading}
                        renderInput={(params) => <TextField placeholder="Channel Name" fullWidth {...params} sx={{ "& .MuiInputBase-input": { fontSize: "14px" } }} />}
                        onOpen={() => {
                          if (!channelIsSuccess)
                            getChannel({
                              Status: true,
                            });
                        }}
                        onChange={(_, value) => onChange(value)}
                        getOptionLabel={(option) => option.channel_Name}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        fullWidth
                        disableClearable
                        componentsProps={{
                          popper: {
                            sx: {
                              "& .MuiAutocomplete-listbox": {
                                fontSize: "14px",
                              },
                            },
                          },
                        }}
                      />
                    );
                  }}
                />
              </Stack>
            </Stack>
          </DialogContent>

          <DialogActions>
            <LoadingButton variant="outlined" loading={createEditServiceProviderIsLoading || createEditServiceProviderIsFetching} onClick={onCloseAction}>
              <Typography sx={{ fontSize: "12.5px", fontWeight: 500 }}>Cancel</Typography>
            </LoadingButton>

            <LoadingButton
              type="submit"
              variant="contained"
              loading={createEditServiceProviderIsLoading || createEditServiceProviderIsFetching}
              loadingPosition="start"
              startIcon={<Save />}
              disabled={!watch("serviceProviderName") || !watch("channelId")?.length}
              sx={sx.disabledSaveButton}
            >
              <Typography sx={{ fontSize: "12.5px", fontWeight: 500 }}>Save</Typography>
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
