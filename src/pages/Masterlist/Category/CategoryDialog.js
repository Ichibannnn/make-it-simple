import { Autocomplete, Dialog, DialogActions, DialogContent, DialogTitle, FormLabel, Stack, TextField } from "@mui/material";
import React, { useEffect } from "react";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import { theme } from "../../../theme/theme";
import { LoadingButton } from "@mui/lab";
import { Toaster, toast } from "sonner";
import { useCreateEditCategoryMutation } from "../../../features/api masterlist/category_api/categoryApi";
import { useLazyGetChannelsQuery } from "../../../features/api_channel_setup/channel/channelApi";

const schema = yup.object().shape({
  id: yup.string().nullable(),
  channelId: yup.object().required().label("Channel Name"),
  category_Description: yup.string().required("Category is required."),
});

export const CategoryDialog = ({ data, open, onClose }) => {
  const [createEditCategory] = useCreateEditCategoryMutation();
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
      channelId: null,
      category_Description: "",
    },
  });

  useEffect(() => {
    if (data) {
      setValue("id", data?.id);
      setValue("channelId", {
        id: data?.channelId,
        channel_Name: data?.channel_Name,
      });
      setValue("category_Description", data?.category_Description);
    }
  }, [data]);

  const onCloseAction = () => {
    reset();
    onClose();
  };

  const onSubmitAction = (formData) => {
    console.log("Form Data: ", formData);

    if (formData.id) {
      const editPayload = {
        id: data.id,
        channelId: formData?.channelId?.id,
        category_Description: formData?.category_Description,
      };

      createEditCategory(editPayload)
        .unwrap()
        .then(() => {
          toast.success("Success!", {
            description: "Updated category! ",
            duration: 1500,
          });
          reset();
          onClose();
        })
        .catch((error) => {
          console.log("error: ", error);
          toast.error("Error!", {
            description: error.data.error.message,
            duration: 1500,
          });
        });
    } else {
      const addPayload = {
        channelId: formData?.channelId?.id,
        category_Description: formData?.category_Description,
      };

      createEditCategory(addPayload)
        .unwrap()
        .then(() => {
          toast.success("Success!", {
            description: "Category added successsfully!",
            duration: 1500,
          });
          reset();
          onClose();
        })
        .catch((error) => {
          console.log("error: ", error);
          toast.error("Error!", {
            description: error.data.error.message,
            duration: 1500,
          });
        });
    }
  };

  return (
    <>
      <Toaster richColors position="top-right" closeButton />
      <Dialog fullWidth maxWidth="xs" open={open} PaperProps={{ style: { overflow: "unset" } }}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "center",
            paddingTop: 0,
            paddingBottom: 0,
            marginBlockEnd: "5.28px",
            fontSize: "18px",
            fontWeight: 700,
            color: "#48BB78",
          }}
        >
          {data ? "Edit Category" : "Add Category"}
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmitAction)}>
          <DialogContent>
            <Stack sx={{ padding: "5px", gap: 1.5 }}>
              <Controller
                control={control}
                name="channelId"
                render={({ field: { ref, value, onChange } }) => {
                  return (
                    <Autocomplete
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
                      disablePortal
                    />
                  );
                }}
              />

              <TextField
                {...register("category_Description")}
                variant="outlined"
                label="Category Name"
                helperText={errors?.category_Description?.message}
                error={!!errors?.category_Description?.message}
                sx={{ borderColor: "primary" }}
                fullWidth
                autoComplete="off"
              />
            </Stack>
          </DialogContent>

          <DialogActions>
            <LoadingButton
              type="submit"
              variant="contained"
              disabled={!watch("category_Description") || !watch("channelId")}
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
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
