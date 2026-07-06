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
        <DialogTitle sx={sx.dialogTitle}>
          {data ? <EditOutlined sx={sx.dialogTitleIcon} /> : <AddCircleOutline sx={sx.dialogTitleIcon} />}
          {data ? "Edit Service Provider" : "Add Service Provider"}
        </DialogTitle>
        <Typography sx={sx.dialogSubtitle}>
          {data ? "Update this service provider and its channels." : "Create a new service provider."}
        </Typography>

        <form onSubmit={handleSubmit(onSubmitAction)}>
          <DialogContent>
            <Stack sx={sx.dialogStack}>
              <Controller
                control={control}
                name="serviceProviderName"
                render={({ field: { ref, value, onChange } }) => {
                  return (
                    <TextField
                      inputRef={ref}
                      value={value}
                      label="Service Provider"
                      onChange={onChange}
                      onBlur={onValidateServiceProvider}
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
                control={control}
                name="channelId"
                render={({ field: { ref, value, onChange } }) => {
                  return (
                    <Autocomplete
                      multiple
                      ref={ref}
                      value={value}
                      options={channelData?.value?.channel || []}
                      loading={channelIsLoading}
                      renderInput={(params) => <TextField label="Channel Name" fullWidth {...params} />}
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
                      // disablePortal
                      disableClearable
                    />
                  );
                }}
              />
            </Stack>
          </DialogContent>

          <DialogActions>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={createEditServiceProviderIsLoading || createEditServiceProviderIsFetching}
              loadingPosition="start"
              startIcon={<Save />}
              disabled={!watch("serviceProviderName") || !watch("channelId")?.length}
              sx={sx.disabledSaveButton}
            >
              Save
            </LoadingButton>
            <LoadingButton variant="outlined" onClick={onCloseAction}>
              Close
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
