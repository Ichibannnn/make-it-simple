import {
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { AddCircleOutline, EditOutlined, Save } from "@mui/icons-material";

import * as yup from "yup";
import { toast } from "sonner";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";

import { useCreateEditCategoryMutation } from "../../../features/api masterlist/category_api/categoryApi";
import { useLazyGetChannelsQuery } from "../../../features/api_channel_setup/channel/channelApi";
import { masterlistStyles as sx } from "../styles/masterlistStyles";

const schema = yup.object().shape({
  id: yup.string().nullable(),
  channelId: yup.object().required().label("Channel Name"),
  category_Description: yup.string().required("Category is required."),
});

export const CategoryDialog = ({ data, open, onClose }) => {
  const [
    createEditCategory,
    { isLoading: createEditCategoryIsLoading, isFetching: createEditCategoryIsFetching },
  ] = useCreateEditCategoryMutation();
  const [getChannel, { data: channelData, isLoading: channelIsLoading, isSuccess: channelIsSuccess }] =
    useLazyGetChannelsQuery();

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
      <Dialog fullWidth maxWidth="xs" open={open} PaperProps={{ sx: sx.dialogPaper }}>
        <Typography sx={sx.dialogTitle}>{data ? "Edit Category" : "Add Category"}</Typography>
        <Typography sx={sx.dialogSubtitle}>
          {data ? "Update the details of this category." : "Create a new category."}
        </Typography>

        <form onSubmit={handleSubmit(onSubmitAction)}>
          <DialogContent>
            <Stack sx={sx.dialogStack}>
              <Stack sx={sx.formField}>
                <Typography sx={sx.fieldText}>Channel Name</Typography>
                <Controller
                  control={control}
                  name="channelId"
                  render={({ field: { ref, value, onChange } }) => {
                    return (
                      <Autocomplete
                        ref={ref}
                        value={value}
                        size="small"
                        options={channelData?.value?.channel || []}
                        loading={channelIsLoading}
                        renderInput={(params) => (
                          <TextField
                            placeholder="Select Channel Name"
                            fullWidth
                            {...params}
                            sx={{ "& .MuiInputBase-input": { fontSize: "14px" } }}
                          />
                        )}
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

              <Stack sx={sx.formField}>
                <Typography sx={sx.fieldText}>Category</Typography>
                <TextField
                  {...register("category_Description")}
                  variant="outlined"
                  size="small"
                  placeholder="Enter Category Name"
                  helperText={errors?.category_Description?.message}
                  error={!!errors?.category_Description?.message}
                  fullWidth
                  autoComplete="off"
                  sx={{ borderColor: "primary", "& .MuiInputBase-input": { fontSize: "14px" } }}
                />
              </Stack>
            </Stack>
          </DialogContent>

          <DialogActions>
            <LoadingButton variant="outlined" onClick={onCloseAction}>
              <Typography sx={{ fontSize: "12.5px", fontWeight: 500 }}>Cancel</Typography>
            </LoadingButton>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={createEditCategoryIsLoading || createEditCategoryIsFetching}
              loadingPosition="start"
              startIcon={<Save />}
              disabled={!watch("category_Description") || !watch("channelId")}
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
